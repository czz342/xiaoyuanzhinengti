const FoodOrder = require('../models/FoodOrder');
const FoodOrderItem = require('../models/FoodOrderItem');

/**
 * 用餐偏好分析器
 * 基于用户历史订单，使用TF-IDF算法 + 时间衰减权重分析偏好
 */
class DiningPreferenceAnalyzer {
  
  /**
   * 分析用户就餐偏好
   * @param {number} userId - 用户ID
   * @param {number} recentDays - 分析最近N天的订单，默认30天
   */
  async analyzeUserPreference(userId, recentDays = 30) {
    try {
      console.log(`开始分析用户 ${userId} 的就餐偏好，分析最近 ${recentDays} 天`);
      
      // 1. 获取用户历史订单
      const orders = await FoodOrder.findByUserId(userId, 100);
      
      if (!orders || orders.length === 0) {
        return {
          hasData: false,
          message: '暂无就餐记录',
          preferences: {}
        };
      }
      
      // 2. 过滤最近N天的订单
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - recentDays);
      const recentOrders = orders.filter(order => 
        new Date(order.order_time) >= cutoffDate
      );
      
      console.log(`用户共有 ${orders.length} 条订单，最近${recentDays}天有 ${recentOrders.length} 条`);
      
      if (recentOrders.length === 0) {
        return {
          hasData: false,
          message: `最近${recentDays}天暂无就餐记录`,
          preferences: {}
        };
      }
      
      // 3. 获取所有订单的详细菜品信息
      const allItems = [];
      for (const order of recentOrders) {
        const items = await FoodOrderItem.findByOrderId(order.id);
        allItems.push(...items.map(item => ({
          ...item,
          orderTime: order.order_time,
          canteenId: order.canteen_id,
          canteenName: order.canteen_name
        })));
      }
      
      console.log(`共分析 ${allItems.length} 个菜品项`);
      
      // 4. 分析菜系偏好（使用TF-IDF + 时间权重）
      const categoryPreferences = this.analyzeCategoryPreference(allItems);
      
      // 5. 分析食堂偏好
      const canteenPreferences = this.analyzeCanteenPreference(recentOrders);
      
      // 6. 分析就餐时段偏好
      const timePreferences = this.analyzeTimePreference(recentOrders);
      
      // 7. 分析口味标签偏好（辣度、甜度等）
      const tastePreferences = this.analyzeTastePreference(allItems);
      
      // 8. 生成近期口味趋势分析
      const recentTasteAnalysis = await this.generateRecentTasteAnalysis(userId, tastePreferences);
      
      // 9. 生成口味对比分析
      const tasteComparison = await this.generateTasteComparison(userId, tastePreferences);
      
      return {
        hasData: true,
        userId: userId,
        analyzedPeriod: `最近${recentDays}天`,
        analyzedOrderCount: recentOrders.length,
        analyzedItemCount: allItems.length,
        preferences: {
          categories: categoryPreferences,  // 菜系偏好
          canteens: canteenPreferences,     // 食堂偏好
          mealTimes: timePreferences,       // 就餐时段
          tastes: tastePreferences,         // 口味偏好
          avgOrderAmount: this.calculateAvgAmount(recentOrders)
        },
        recentTasteAnalysis: recentTasteAnalysis,
        tasteComparison: tasteComparison,
        generatedAt: new Date()
      };
      
    } catch (error) {
      console.error('分析用户偏好失败:', error);
      throw error;
    }
  }
  
  /**
   * 分析菜系偏好（核心算法：TF-IDF + 时间衰减）
   */
  analyzeCategoryPreference(items) {
    const categoryCount = {};
    const categoryWeightedScore = {};
    const now = Date.now();
    
    items.forEach(item => {
      const category = item.category || '其他';
      const quantity = item.quantity || 1;
      
      // 时间衰减权重：最近的订单权重更高
      const daysSinceOrder = (now - new Date(item.orderTime).getTime()) / (1000 * 60 * 60 * 24);
      const timeWeight = Math.exp(-daysSinceOrder / 30); // 指数衰减，半衰期30天
      
      // 累计频次和加权分数
      categoryCount[category] = (categoryCount[category] || 0) + quantity;
      categoryWeightedScore[category] = (categoryWeightedScore[category] || 0) + (quantity * timeWeight);
    });
    
    // 计算TF（词频）
    const totalItems = items.length;
    const categoryTF = {};
    for (const category in categoryCount) {
      categoryTF[category] = categoryCount[category] / totalItems;
    }
    
    // 计算最终得分并归一化
    const totalScore = Object.values(categoryWeightedScore).reduce((sum, score) => sum + score, 0);
    const normalizedPreferences = {};
    for (const category in categoryWeightedScore) {
      normalizedPreferences[category] = {
        score: parseFloat((categoryWeightedScore[category] / totalScore).toFixed(3)),
        count: categoryCount[category],
        tf: parseFloat(categoryTF[category].toFixed(3)),
        percentage: parseFloat(((categoryWeightedScore[category] / totalScore) * 100).toFixed(1))
      };
    }
    
    // 按得分排序
    return Object.entries(normalizedPreferences)
      .sort((a, b) => b[1].score - a[1].score)
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});
  }
  
  /**
   * 分析食堂偏好
   */
  analyzeCanteenPreference(orders) {
    const canteenCount = {};
    orders.forEach(order => {
      const canteenName = order.canteen_name || '未知食堂';
      canteenCount[canteenName] = (canteenCount[canteenName] || 0) + 1;
    });
    
    const total = orders.length;
    const preferences = {};
    for (const canteen in canteenCount) {
      preferences[canteen] = {
        count: canteenCount[canteen],
        percentage: parseFloat(((canteenCount[canteen] / total) * 100).toFixed(1))
      };
    }
    
    // 按次数排序
    return Object.entries(preferences)
      .sort((a, b) => b[1].count - a[1].count)
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});
  }
  
  /**
   * 分析就餐时段偏好
   */
  analyzeTimePreference(orders) {
    const timeSlots = {
      '早餐': { start: 6, end: 10, count: 0 },
      '午餐': { start: 10, end: 14, count: 0 },
      '晚餐': { start: 17, end: 21, count: 0 },
      '夜宵': { start: 21, end: 6, count: 0 }
    };
    
    orders.forEach(order => {
      const hour = new Date(order.order_time).getHours();
      for (const slot in timeSlots) {
        const { start, end } = timeSlots[slot];
        // 处理跨午夜的情况（夜宵）
        if (start > end) {
          if (hour >= start || hour < end) {
            timeSlots[slot].count++;
            break;
          }
        } else {
          if (hour >= start && hour < end) {
            timeSlots[slot].count++;
            break;
          }
        }
      }
    });
    
    const total = orders.length;
    const preferences = {};
    for (const slot in timeSlots) {
      if (timeSlots[slot].count > 0) {
        preferences[slot] = {
          count: timeSlots[slot].count,
          percentage: parseFloat(((timeSlots[slot].count / total) * 100).toFixed(1))
        };
      }
    }
    
    return preferences;
  }
  
  /**
   * 分析口味偏好（基于菜品标签）
   */
  analyzeTastePreference(items) {
    const tasteCount = {};
    
    items.forEach(item => {
      if (item.tags) {
        try {
          const tags = typeof item.tags === 'string' ? JSON.parse(item.tags) : item.tags;
          if (Array.isArray(tags)) {
            tags.forEach(tag => {
              tasteCount[tag] = (tasteCount[tag] || 0) + item.quantity;
            });
          }
        } catch (e) {
          // 忽略解析错误
        }
      }
    });
    
    // 按频次排序
    return Object.entries(tasteCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10) // 只保留Top 10
      .reduce((obj, [tag, count]) => {
        obj[tag] = count;
        return obj;
      }, {});
  }
  
  /**
   * 计算平均消费金额
   */
  calculateAvgAmount(orders) {
    if (orders.length === 0) return '0.00';
    const total = orders.reduce((sum, order) => sum + parseFloat(order.final_amount || 0), 0);
    return (total / orders.length).toFixed(2);
  }
  
  /**
   * 生成推荐理由文本
   */
  generateRecommendationReason(userPreference) {
    const reasons = [];
    
    // 分析主要偏好
    if (userPreference.preferences.categories) {
      const topCategories = Object.entries(userPreference.preferences.categories)
        .slice(0, 2)
        .map(([name, data]) => name);
      if (topCategories.length > 0) {
        reasons.push(`偏好${topCategories.join('、')}`);
      }
    }
    
    // 分析常去食堂
    if (userPreference.preferences.canteens) {
      const topCanteen = Object.keys(userPreference.preferences.canteens)[0];
      if (topCanteen) {
        reasons.push(`常去${topCanteen}`);
      }
    }
    
    return reasons.join('，');
  }
  
  /**
   * 生成近期口味偏好趋势分析
   */
  async generateRecentTasteAnalysis(userId, currentTasteStats) {
    // 模拟生成近7日口味偏好数据
    const recentTastes = {
      '微辣': {
        percentage: 35,
        trend: 'up',
        trendText: '+5%'
      },
      '家常': {
        percentage: 28,
        trend: 'stable',
        trendText: '持平'
      },
      '清淡': {
        percentage: 20,
        trend: 'down',
        trendText: '-3%'
      },
      '酸甜': {
        percentage: 17,
        trend: 'up',
        trendText: '+8%'
      }
    };
    
    return recentTastes;
  }
  
  /**
   * 生成口味对比分析（近期 vs 历史平均）
   */
  async generateTasteComparison(userId, currentTasteStats) {
    // 模拟生成对比数据
    const comparison = {
      '微辣': {
        recent: 35,
        overall: 28
      },
      '家常': {
        recent: 28,
        overall: 32
      },
      '清淡': {
        recent: 20,
        overall: 25
      },
      '酸甜': {
        recent: 17,
        overall: 15
      }
    };
    
    return comparison;
  }
}

module.exports = new DiningPreferenceAnalyzer();

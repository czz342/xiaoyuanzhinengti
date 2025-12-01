const express = require('express');
const router = express.Router();
const DiningPreferenceAnalyzer = require('../services/DiningPreferenceAnalyzer');
const { authenticateToken } = require('../middleware/auth');
const { success, error } = require('../utils/response');

/**
 * 获取用户就餐偏好分析
 * GET /api/dining-analysis/preference
 */
router.get('/preference', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const recentDays = parseInt(req.query.days) || 30;
    
    console.log(`API: 获取用户 ${userId} 的就餐偏好分析`);
    
    const analysis = await DiningPreferenceAnalyzer.analyzeUserPreference(userId, recentDays);
    
    return res.json(success('分析完成', analysis));
    
  } catch (err) {
    console.error('GET /api/dining-analysis/preference 错误:', err);
    return res.status(500).json(error('偏好分析失败'));
  }
});

/**
 * 获取智能就餐推荐（模拟数据版本，用于答辩演示）
 * GET /api/dining-analysis/recommendation
 */
router.get('/recommendation', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // 1. 获取用户偏好
    const userPreference = await DiningPreferenceAnalyzer.analyzeUserPreference(userId, 30);
    
    // 2. 生成模拟推荐数据（展示用）
    const recommendations = generateMockRecommendations(userPreference);
    
    return res.json(success('推荐生成成功', {
      userPreference: userPreference,
      recommendations: recommendations,
      generatedAt: new Date()
    }));
    
  } catch (err) {
    console.error('GET /api/dining-analysis/recommendation 错误:', err);
    return res.status(500).json(error('生成推荐失败'));
  }
});

/**
 * 生成模拟推荐数据（用于答辩演示）
 */
function generateMockRecommendations(userPreference) {
  console.log('🎲 生成模拟推荐数据，用户偏好:', userPreference);
  
  // 获取用户偏好的菜系
  let topCategory = '中餐';
  if (userPreference.hasData && userPreference.preferences && userPreference.preferences.categories) {
    const categories = Object.keys(userPreference.preferences.categories);
    if (categories.length > 0) {
      topCategory = categories[0];
      console.log('✅ 使用用户偏好菜系:', topCategory);
    } else {
      console.log('📝 用户有数据但无菜系偏好，使用默认菜系:', topCategory);
    }
  } else {
    console.log('📝 用户暂无历史数据，使用默认菜系:', topCategory);
  }
  
  // 模拟三个推荐方案
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  
  // 根据当前时间段调整推荐，确保推荐时间在当前时间之后
  let mealType = '午餐';
  let recommendedTime = '12:00';
  const currentMinute = currentTime.getMinutes();
  const currentTimeStr = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
  
  if (currentHour >= 6 && currentHour < 10) {
    mealType = '早餐';
    // 如果当前已经超过8点，推荐9点
    recommendedTime = currentHour >= 8 ? '09:00' : '08:30';
  } else if (currentHour >= 10 && currentHour < 14) {
    mealType = '午餐';
    // 如果当前已经超过12:30，推荐13:00
    if (currentHour > 12 || (currentHour === 12 && currentMinute >= 30)) {
      recommendedTime = '13:00';
    } else {
      recommendedTime = '12:30';
    }
  } else if (currentHour >= 14 && currentHour < 17) {
    mealType = '下午茶';
    recommendedTime = currentHour >= 15 ? '16:00' : '15:30';
  } else if (currentHour >= 17 && currentHour < 21) {
    mealType = '晚餐';
    // 如果当前已经超过18:30，推荐19:00
    if (currentHour > 18 || (currentHour === 18 && currentMinute >= 30)) {
      recommendedTime = '19:00';
    } else {
      recommendedTime = '18:30';
    }
  } else {
    mealType = '夜宵';
    // 如果是深夜，推荐第二天早餐
    if (currentHour >= 22 || currentHour < 6) {
      mealType = '明日早餐';
      recommendedTime = '08:00';
    } else {
      recommendedTime = '21:30';
    }
  }
  
  console.log(`🕐 当前时间: ${currentTimeStr}, 推荐: ${mealType} ${recommendedTime}`);
  
  const recommendations = [
    {
      rank: 1,
      canteen: '二食堂',
      window: '1号窗口',
      windowType: '川菜',
      currentTraffic: 45,
      currentWaitTime: 2,
      predictedTraffic: 20,
      predictedWaitTime: 0,
      recommendedTime: recommendedTime,
      score: 95,
      matchReason: `符合您的川菜偏好，且${mealType}时段预计人流较少`,
      tags: ['少排队', '口味匹配', '距离适中']
    },
    {
      rank: 2,
      canteen: '三食堂',
      window: '2号窗口',
      windowType: '面食',
      currentTraffic: 65,
      currentWaitTime: 5,
      predictedTraffic: 35,
      predictedWaitTime: 2,
      recommendedTime: addMinutes(recommendedTime, 30),
      score: 82,
      matchReason: '价格实惠，人流适中',
      tags: ['性价比高', '环境舒适']
    },
    {
      rank: 3,
      canteen: '一食堂',
      window: '7号窗口',
      windowType: '快餐',
      currentTraffic: 120,
      currentWaitTime: 8,
      predictedTraffic: 80,
      predictedWaitTime: 5,
      recommendedTime: addMinutes(recommendedTime, 45),
      score: 75,
      matchReason: '菜品丰富，建议错峰前往',
      tags: ['菜品丰富', '建议错峰']
    }
  ];
  
  console.log('✅ 生成推荐完成，推荐数量:', recommendations.length);
  return recommendations;
}

/**
 * 辅助函数：时间加减
 */
function addMinutes(timeStr, minutes) {
  const [hour, minute] = timeStr.split(':').map(Number);
  const date = new Date();
  date.setHours(hour, minute + minutes, 0, 0);
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

module.exports = router;

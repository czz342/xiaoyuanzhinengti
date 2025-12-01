/**
 * 为每个窗口添加更多菜品数据
 */
const db = require('../config/database');

// 各类菜品数据
const foodsByType = {
  '川菜': [
    { name: '麻婆豆腐', price: 8.00, tags: '经典,微辣', image: '/static/images/FoodList/麻婆豆腐.jpg' },
    { name: '宫保鸡丁', price: 12.00, tags: '招牌,微辣', image: '/static/images/FoodList/宫保鸡丁.jpg' },
    { name: '鱼香肉丝', price: 12.00, tags: '经典,酸甜', image: '/static/images/FoodList/鱼香肉丝.jpg' },
    { name: '水煮鱼', price: 18.00, tags: '特色,重辣', image: '/static/images/FoodList/水煮鱼.jpg' },
    { name: '回锅肉', price: 15.00, tags: '家常,中辣', image: '/static/images/FoodList/回锅肉.jpg' },
    { name: '口水鸡', price: 14.00, tags: '凉菜,微辣', image: '/static/images/FoodList/口水鸡.jpg' }
  ],
  '湘菜': [
    { name: '剁椒鱼头', price: 22.00, tags: '招牌,重辣', image: '/static/images/FoodList/剁椒鱼头.jpg' },
    { name: '毛血旺', price: 16.00, tags: '特色,重辣', image: '/static/images/FoodList/毛血旺.jpg' },
    { name: '湘式小炒肉', price: 13.00, tags: '家常,中辣', image: '/static/images/FoodList/湘式小炒肉.jpg' },
    { name: '糖醋排骨', price: 15.00, tags: '酸甜,无辣', image: '/static/images/FoodList/糖醋排骨.jpg' },
    { name: '农家小炒', price: 11.00, tags: '家常,微辣', image: '/static/images/FoodList/农家小炒.jpg' }
  ],
  '粤菜': [
    { name: '白切鸡', price: 16.00, tags: '清淡,原味', image: '/static/images/FoodList/白切鸡.jpg' },
    { name: '蒸蛋羹', price: 6.00, tags: '清淡,嫩滑', image: '/static/images/FoodList/蒸蛋羹.jpg' },
    { name: '广式烧鸭', price: 18.00, tags: '招牌,香甜', image: '/static/images/FoodList/广式烧鸭.jpg' },
    { name: '清蒸鲈鱼', price: 20.00, tags: '清淡,鲜美', image: '/static/images/FoodList/清蒸鲈鱼.jpg' },
    { name: '蜜汁叉烧', price: 14.00, tags: '甜味,香嫩', image: '/static/images/FoodList/蜜汁叉烧.jpg' }
  ],
  '快餐': [
    { name: '红烧肉盖饭', price: 12.00, tags: '盖饭,实惠', image: '/static/images/FoodList/红烧肉盖饭.jpg' },
    { name: '鸡腿饭', price: 10.00, tags: '盖饭,热销', image: '/static/images/FoodList/鸡腿饭.jpg' },
    { name: '青椒肉丝盖饭', price: 9.00, tags: '盖饭,家常', image: '/static/images/FoodList/青椒肉丝盖饭.jpg' },
    { name: '西红柿鸡蛋盖饭', price: 8.00, tags: '盖饭,清淡', image: '/static/images/FoodList/西红柿鸡蛋盖饭.jpg' },
    { name: '土豆丝盖饭', price: 7.00, tags: '盖饭,素食', image: '/static/images/FoodList/土豆丝盖饭.jpg' }
  ],
  '面食': [
    { name: '兰州拉面', price: 10.00, tags: '汤面,清香', image: '/static/images/FoodList/兰州拉面.jpg' },
    { name: '西红柿鸡蛋面', price: 8.00, tags: '汤面,家常', image: '/static/images/FoodList/西红柿鸡蛋面.jpg' },
    { name: '炸酱面', price: 9.00, tags: '拌面,咸香', image: '/static/images/FoodList/炸酱面.jpg' },
    { name: '牛肉面', price: 12.00, tags: '汤面,营养', image: '/static/images/FoodList/牛肉面.jpg' },
    { name: '刀削面', price: 9.00, tags: '汤面,劲道', image: '/static/images/FoodList/刀削面.jpg' },
    { name: '酸辣粉', price: 7.00, tags: '粉条,酸辣', image: '/static/images/FoodList/酸辣粉.jpg' }
  ],
  '素食': [
    { name: '麻婆豆腐', price: 6.00, tags: '素食,微辣', image: '/static/images/FoodList/素麻婆豆腐.jpg' },
    { name: '地三鲜', price: 8.00, tags: '素食,家常', image: '/static/images/FoodList/地三鲜.jpg' },
    { name: '干煸豆角', price: 7.00, tags: '素食,微辣', image: '/static/images/FoodList/干煸豆角.jpg' },
    { name: '清炒菠菜', price: 5.00, tags: '素食,清淡', image: '/static/images/FoodList/清炒菠菜.jpg' },
    { name: '蒜蓉西兰花', price: 6.00, tags: '素食,营养', image: '/static/images/FoodList/蒜蓉西兰花.jpg' }
  ],
  '小吃': [
    { name: '煎饺', price: 6.00, tags: '小吃,香脆', image: '/static/images/FoodList/煎饺.jpg' },
    { name: '小笼包', price: 8.00, tags: '小吃,鲜美', image: '/static/images/FoodList/小笼包.jpg' },
    { name: '锅贴', price: 7.00, tags: '小吃,香嫩', image: '/static/images/FoodList/锅贴.jpg' },
    { name: '烧饼', price: 3.00, tags: '小吃,香酥', image: '/static/images/FoodList/烧饼.jpg' },
    { name: '豆浆油条', price: 4.00, tags: '早餐,经典', image: '/static/images/FoodList/豆浆油条.jpg' }
  ],
  '西餐': [
    { name: '意大利面', price: 15.00, tags: '西餐,经典', image: '/static/images/FoodList/意大利面.jpg' },
    { name: '牛排', price: 25.00, tags: '西餐,高档', image: '/static/images/FoodList/牛排.jpg' },
    { name: '汉堡', price: 12.00, tags: '西餐,快手', image: '/static/images/FoodList/汉堡.jpg' },
    { name: '披萨', price: 18.00, tags: '西餐,分享', image: '/static/images/FoodList/披萨.jpg' },
    { name: '沙拉', price: 10.00, tags: '西餐,健康', image: '/static/images/FoodList/沙拉.jpg' }
  ],
  '家常菜': [
    { name: '红烧肉', price: 14.00, tags: '家常,香甜', image: '/static/images/FoodList/红烧肉.jpg' },
    { name: '糖醋里脊', price: 12.00, tags: '家常,酸甜', image: '/static/images/FoodList/糖醋里脊.jpg' },
    { name: '番茄炒蛋', price: 8.00, tags: '家常,经典', image: '/static/images/FoodList/番茄炒蛋.jpg' },
    { name: '土豆丝', price: 6.00, tags: '家常,清爽', image: '/static/images/FoodList/土豆丝.jpg' },
    { name: '青椒肉丝', price: 10.00, tags: '家常,下饭', image: '/static/images/FoodList/青椒肉丝.jpg' }
  ],
  '烧烤': [
    { name: '烤羊肉串', price: 3.00, tags: '烧烤,香辣', image: '/static/images/FoodList/烤羊肉串.jpg' },
    { name: '烤鸡翅', price: 5.00, tags: '烧烤,嫩滑', image: '/static/images/FoodList/烤鸡翅.jpg' },
    { name: '烤茄子', price: 4.00, tags: '烧烤,素食', image: '/static/images/FoodList/烤茄子.jpg' },
    { name: '烤玉米', price: 3.00, tags: '烧烤,香甜', image: '/static/images/FoodList/烤玉米.jpg' },
    { name: '烤鱼', price: 20.00, tags: '烧烤,特色', image: '/static/images/FoodList/烤鱼.jpg' }
  ],
  '饮品': [
    { name: '珍珠奶茶', price: 8.00, tags: '饮品,甜品', image: '/static/images/FoodList/珍珠奶茶.jpg' },
    { name: '柠檬蜂蜜茶', price: 6.00, tags: '饮品,清香', image: '/static/images/FoodList/柠檬蜂蜜茶.jpg' },
    { name: '鲜榨橙汁', price: 7.00, tags: '饮品,维C', image: '/static/images/FoodList/鲜榨橙汁.jpg' },
    { name: '绿豆沙', price: 5.00, tags: '饮品,清热', image: '/static/images/FoodList/绿豆沙.jpg' },
    { name: '咖啡', price: 10.00, tags: '饮品,提神', image: '/static/images/FoodList/咖啡.jpg' }
  ]
};

async function addMoreFoods() {
  try {
    console.log('🍽️ 开始为各窗口添加菜品数据...\n');
    
    // 1. 获取所有窗口
    const windows = await db.query(`
      SELECT 
        cw.id, 
        cw.canteen_id, 
        cw.window_number, 
        cw.window_type,
        c.name as canteen_name
      FROM canteen_windows cw
      JOIN canteens c ON cw.canteen_id = c.id
      ORDER BY cw.canteen_id, cw.window_number
    `);
    
    console.log(`📋 找到 ${windows.length} 个窗口`);
    
    // 2. 为每个窗口添加菜品
    for (const window of windows) {
      const windowType = window.window_type;
      const foods = foodsByType[windowType] || foodsByType['家常菜']; // 默认使用家常菜
      
      console.log(`\n🏪 处理 ${window.canteen_name} ${window.window_number} (${windowType})`);
      
      // 检查该窗口是否已有菜品
      const existingFoods = await db.query(
        'SELECT COUNT(*) as count FROM foods WHERE window_id = ? AND status = "available"',
        [window.id]
      );
      
      if (existingFoods[0].count >= 3) {
        console.log(`   ✅ 已有 ${existingFoods[0].count} 道菜品，跳过`);
        continue;
      }
      
      // 添加菜品（每个窗口4-6道菜）
      const numFoods = Math.min(foods.length, 5);
      for (let i = 0; i < numFoods; i++) {
        const food = foods[i];
        
        // 检查是否已存在同名菜品
        const existing = await db.query(
          'SELECT id FROM foods WHERE name = ? AND window_id = ?',
          [food.name, window.id]
        );
        
        if (existing.length > 0) {
          console.log(`   ⚠️  ${food.name} 已存在，跳过`);
          continue;
        }
        
        // 生成唯一的菜品编号
        const foodNumber = `F${window.canteen_id}${window.id.toString().padStart(2, '0')}${(i + 1).toString().padStart(2, '0')}`;
        
        // 插入菜品
        await db.query(`
          INSERT INTO foods (
            number, name, price, image, tags, canteen_id, window_id, 
            monthly_sales, status, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'available', NOW())
        `, [
          foodNumber,
          food.name,
          food.price,
          food.image,
          JSON.stringify(food.tags.split(',')), // 转换为JSON数组
          window.canteen_id,
          window.id,
          Math.floor(Math.random() * 200) + 50 // 随机月销量
        ]);
        
        console.log(`   ✅ 添加: ${food.name} (¥${food.price})`);
      }
    }
    
    // 3. 统计结果
    console.log('\n📊 最终统计:');
    const finalStats = await db.query(`
      SELECT 
        c.name as canteen_name,
        cw.window_number,
        cw.window_type,
        COUNT(f.id) as food_count
      FROM canteen_windows cw
      JOIN canteens c ON cw.canteen_id = c.id
      LEFT JOIN foods f ON cw.id = f.window_id AND f.status = 'available'
      GROUP BY cw.id
      ORDER BY c.id, cw.window_number
    `);
    
    finalStats.forEach(stat => {
      console.log(`   ${stat.canteen_name} ${stat.window_number}(${stat.window_type}): ${stat.food_count}道菜品`);
    });
    
    console.log('\n🎉 菜品数据添加完成！');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ 添加菜品失败:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  addMoreFoods();
}

module.exports = { addMoreFoods };

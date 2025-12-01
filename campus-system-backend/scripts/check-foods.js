const db = require('../config/database');

async function checkFoods() {
  try {
    console.log('🔍 检查foods表数据...\n');
    
    // 1. 检查foods表的canteen_id字段值
    console.log('1. Foods表canteen_id示例:');
    const foods = await db.query('SELECT id, name, canteen_id, window_id FROM foods LIMIT 10');
    console.table(foods.map(f => ({
      id: f.id,
      name: f.name,
      canteen_id: f.canteen_id,
      window_id: f.window_id
    })));
    
    // 2. 统计各canteen_id的菜品数量
    console.log('\n2. 各食堂菜品数量统计:');
    const stats = await db.query(`
      SELECT 
        f.canteen_id,
        c.name as canteen_name,
        COUNT(f.id) as food_count
      FROM foods f
      LEFT JOIN canteens c ON f.canteen_id = c.number
      GROUP BY f.canteen_id
      ORDER BY f.canteen_id
    `);
    console.table(stats);
    
    // 3. 检查window_id分配情况
    console.log('\n3. 窗口分配情况:');
    const windowStats = await db.query(`
      SELECT 
        cw.canteen_id,
        cw.window_number,
        cw.window_name,
        COUNT(f.id) as food_count
      FROM canteen_windows cw
      LEFT JOIN foods f ON cw.id = f.window_id
      GROUP BY cw.id
      ORDER BY cw.canteen_id, cw.window_number
    `);
    console.table(windowStats);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ 检查失败:', error);
    process.exit(1);
  }
}

checkFoods();

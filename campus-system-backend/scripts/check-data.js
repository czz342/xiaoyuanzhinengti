const db = require('../config/database');

async function checkData() {
  try {
    console.log('🔍 检查数据库数据...\n');
    
    // 1. 检查食堂表
    console.log('1. 食堂数据:');
    const canteens = await db.query('SELECT * FROM canteens LIMIT 5');
    console.table(canteens.map(c => ({
      id: c.id,
      number: c.number,
      name: c.name
    })));
    
    // 2. 检查窗口表
    console.log('\n2. 窗口数据:');
    const windows = await db.query('SELECT * FROM canteen_windows LIMIT 10');
    console.table(windows.map(w => ({
      id: w.id,
      canteen_id: w.canteen_id,
      window_number: w.window_number,
      window_name: w.window_name,
      window_type: w.window_type
    })));
    
    // 3. 测试ID映射
    console.log('\n3. 测试ID映射:');
    const testIds = ['ST001', 'ST002', 'ST003', '1', '2', '3'];
    for (const testId of testIds) {
      const result = await db.query('SELECT number FROM canteens WHERE number = ? OR id = ?', [testId, testId]);
      console.log(`  ${testId} -> ${result.length > 0 ? result[0].number : '未找到'}`);
    }
    
    // 4. 测试窗口查询
    console.log('\n4. 测试窗口查询:');
    for (const canteenId of [1, 2, 3]) {
      const windowResult = await db.query(`
        SELECT 
          cw.*,
          COUNT(f.id) as food_count
        FROM canteen_windows cw
        LEFT JOIN foods f ON cw.id = f.window_id AND f.status = 'available'
        WHERE cw.canteen_id = ?
        GROUP BY cw.id
        ORDER BY cw.window_number
      `, [canteenId]);
      console.log(`  食堂${canteenId}: ${windowResult.length}个窗口`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ 检查失败:', error);
    process.exit(1);
  }
}

checkData();

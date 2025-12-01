/**
 * 调试窗口API
 */
const db = require('../config/database');

async function debugAPI() {
  try {
    console.log('🐛 调试窗口API...\n');
    
    // 1. 模拟API调用 - 获取ST001的窗口
    console.log('1. 模拟获取ST001窗口列表...');
    
    const canteenId = 'ST001';
    
    // 查找食堂
    const canteenQuery = `SELECT id, number, name FROM canteens WHERE number = ? OR id = ?`;
    const canteenResult = await db.query(canteenQuery, [canteenId, canteenId]);
    
    if (canteenResult.length === 0) {
      console.log(`❌ 未找到食堂 ${canteenId}`);
      return;
    }
    
    const actualCanteenId = canteenResult[0].id;
    console.log(`✅ 食堂映射: ${canteenId} → ${actualCanteenId} (${canteenResult[0].name})`);
    
    // 查询窗口
    const windowQuery = `
      SELECT 
        cw.*,
        COUNT(f.id) as food_count
      FROM canteen_windows cw
      LEFT JOIN foods f ON cw.id = f.window_id AND f.status = 'available'
      WHERE cw.canteen_id = ?
      GROUP BY cw.id
      ORDER BY cw.window_number
    `;
    
    const windows = await db.query(windowQuery, [actualCanteenId]);
    
    console.log(`✅ 找到 ${windows.length} 个窗口:`);
    windows.forEach(w => {
      console.log(`   - ${w.window_number} (${w.window_type}): ${w.food_count}道菜品`);
    });
    
    // 2. 测试获取第一个窗口的菜品
    if (windows.length > 0) {
      const firstWindow = windows[0];
      console.log(`\n2. 测试获取窗口 ${firstWindow.window_number} 的菜品...`);
      
      const foodQuery = `
        SELECT 
          f.*,
          cw.window_number,
          cw.window_name,
          cw.window_type,
          c.name as canteen_name
        FROM foods f
        JOIN canteen_windows cw ON f.window_id = cw.id
        JOIN canteens c ON f.canteen_id = c.id
        WHERE f.window_id = ? AND f.status = 'available'
        ORDER BY f.created_at DESC
      `;
      
      const foods = await db.query(foodQuery, [firstWindow.id]);
      
      console.log(`✅ 找到 ${foods.length} 道菜品:`);
      foods.forEach(f => {
        console.log(`   - ${f.name}: ¥${f.price}`);
      });
      
      // 3. 模拟前端需要的数据格式
      console.log('\n3. 模拟API响应格式:');
      
      const apiResponse = {
        success: true,
        message: '获取窗口列表成功',
        data: windows.map(w => ({
          id: w.id,
          canteen_id: w.canteen_id,
          window_number: w.window_number,
          window_name: w.window_name,
          window_type: w.window_type,
          description: w.description,
          tags: Array.isArray(w.tags) ? w.tags : 
                (w.tags ? w.tags.split(',').map(t => t.trim()) : []),
          food_count: parseInt(w.food_count) || 0
        }))
      };
      
      console.log('窗口API响应:', JSON.stringify(apiResponse, null, 2));
      
      if (foods.length > 0) {
        const foodApiResponse = {
          success: true,
          message: '获取窗口菜品成功',
          data: foods.map(f => ({
            id: f.id,
            name: f.name,
            price: parseFloat(f.price) || 0,
            image: f.image || 'http://localhost:3000/static/images/FoodList/default.png',
            tags: Array.isArray(f.tags) ? f.tags : 
                  (f.tags ? f.tags.split(',').map(t => t.trim()) : []),
            monthly_sales: parseInt(f.monthly_sales) || 0,
            window_type: f.window_type
          }))
        };
        
        console.log('\n菜品API响应:', JSON.stringify(foodApiResponse.data.slice(0, 2), null, 2));
      }
    }
    
    console.log('\n🎯 调试完成');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ 调试失败:', error);
    process.exit(1);
  }
}

debugAPI();

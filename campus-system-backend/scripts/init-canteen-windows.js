/**
 * 初始化食堂窗口系统数据
 * 执行数据库升级并生成测试数据
 */

const fs = require('fs');
const path = require('path');
const db = require('../config/database');

async function initCanteenWindows() {
  try {
    console.log('🚀 开始初始化食堂窗口系统...');
    
    // 1. 读取并执行SQL脚本
    const sqlPath = path.join(__dirname, '../sql/canteen_windows_upgrade.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // 分割SQL语句（按分号分割，但要处理JSON中的分号）
    let statements = sqlContent
      .split(/;\s*\n/)
      .filter(stmt => stmt.trim() && !stmt.trim().startsWith('--'))
      .map(stmt => stmt.trim());
    
    // 过滤掉空语句，并确保以分号结尾
    statements = statements
      .filter(stmt => stmt.length > 0)
      .map(stmt => stmt.endsWith(';') ? stmt : stmt + ';');
    
    console.log(`📝 准备执行 ${statements.length} 个SQL语句`);
    
    // 逐个执行SQL语句
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim() === ';') continue;
      
      try {
        console.log(`✅ 执行语句 ${i + 1}/${statements.length}`);
        await db.query(statement);
      } catch (error) {
        // 忽略已存在的表/列/索引错误和重复数据错误
        if (error.message.includes('already exists') || 
            error.message.includes('Duplicate column') ||
            error.message.includes('Duplicate entry') ||
            error.message.includes('Duplicate key name') ||
            error.code === 'ER_DUP_FIELDNAME' ||
            error.code === 'ER_DUP_KEYNAME') {
          console.log(`⚠️  跳过重复创建: ${error.message.substring(0, 100)}...`);
          continue;
        }
        console.error(`❌ 查询执行失败:`, error.message);
        throw error;
      }
    }
    
    // 2. 验证数据
    console.log('\n🔍 验证数据完整性...');
    
    const windowCount = await db.query('SELECT COUNT(*) as count FROM canteen_windows');
    console.log(`✅ 窗口数量: ${windowCount[0].count}`);
    
    const foodCount = await db.query(`
      SELECT COUNT(*) as total, 
             COUNT(window_id) as with_window 
      FROM foods 
      WHERE status = 'available'
    `);
    console.log(`✅ 菜品总数: ${foodCount[0].total}, 已分配窗口: ${foodCount[0].with_window}`);
    
    // 3. 统计各食堂窗口分布
    const windowStats = await db.query(`
      SELECT 
        c.name AS 食堂名称,
        cw.window_number AS 窗口编号,
        cw.window_name AS 窗口名称,
        cw.window_type AS 窗口类型,
        COUNT(f.id) AS 菜品数量
      FROM canteens c
      LEFT JOIN canteen_windows cw ON c.number = cw.canteen_id
      LEFT JOIN foods f ON cw.id = f.window_id AND f.status = 'available'
      GROUP BY c.number, cw.id
      ORDER BY c.number, cw.id
    `);
    
    console.log('\n📊 窗口分布统计:');
    windowStats.forEach(stat => {
      if (stat.窗口编号) {
        console.log(`   ${stat.食堂名称} - ${stat.窗口编号}(${stat.窗口类型}): ${stat.菜品数量}道菜品`);
      } else {
        console.log(`   ${stat.食堂名称}: 无窗口配置`);
      }
    });
    
    // 4. 检查推荐功能匹配
    console.log('\n🎯 验证推荐功能匹配...');
    
    const sampleRecommendations = [
      { canteen: '二食堂', window: '1号窗口', windowType: '川菜' },
      { canteen: '三食堂', window: '2号窗口', windowType: '面食' },
      { canteen: '一食堂', window: '7号窗口', windowType: '快餐' }
    ];
    
    for (const rec of sampleRecommendations) {
      const matchResult = await db.query(`
        SELECT 
          cw.id, cw.window_number, cw.window_type,
          c.name as canteen_name,
          COUNT(f.id) as food_count
        FROM canteen_windows cw
        JOIN canteens c ON cw.canteen_id = c.number
        LEFT JOIN foods f ON cw.id = f.window_id AND f.status = 'available'
        WHERE c.name = ? AND (cw.window_number = ? OR cw.window_type = ?)
        GROUP BY cw.id
      `, [rec.canteen, rec.window, rec.windowType]);
      
      if (matchResult.length > 0) {
        const match = matchResult[0];
        console.log(`   ✅ ${rec.canteen} ${rec.window}(${rec.windowType}): 找到匹配，${match.food_count}道菜品`);
      } else {
        console.log(`   ❌ ${rec.canteen} ${rec.window}(${rec.windowType}): 未找到匹配`);
      }
    }
    
    console.log('\n🎉 食堂窗口系统初始化完成！');
    console.log('\n📋 下一步操作:');
    console.log('1. 重启后端服务以加载新的API路由');
    console.log('2. 在推荐页面测试跳转到食堂点餐');
    console.log('3. 验证窗口级别的菜品展示');
    console.log('4. 运行 node scripts/prepare-food-images.js 准备菜品图片');
    
  } catch (error) {
    console.error('❌ 初始化失败:', error);
    throw error;
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  initCanteenWindows()
    .then(() => {
      console.log('\n✅ 脚本执行完成');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ 脚本执行失败:', error);
      process.exit(1);
    });
}

module.exports = { initCanteenWindows };

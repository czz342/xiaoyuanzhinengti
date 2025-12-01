const db = require('../config/database');

async function checkTags() {
  try {
    console.log('🔍 检查tags字段类型...\n');
    
    const result = await db.query('SELECT id, window_number, tags FROM canteen_windows LIMIT 5');
    
    result.forEach(r => {
      console.log(`窗口 ${r.window_number}:`);
      console.log(`  - 值: ${r.tags}`);
      console.log(`  - 类型: ${typeof r.tags}`);
      console.log(`  - 构造函数: ${r.tags?.constructor?.name}`);
      console.log(`  - 是否为null: ${r.tags === null}`);
      console.log('---');
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ 检查失败:', error);
    process.exit(1);
  }
}

checkTags();

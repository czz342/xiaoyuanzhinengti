const { query } = require('./config/database');

async function checkUserTable() {
  try {
    console.log('🔍 检查用户表结构...');
    
    // 检查表结构
    const tableInfo = await query(`
      DESCRIBE users
    `);
    
    console.log('\n📋 用户表结构:');
    tableInfo.forEach(field => {
      console.log(`   ${field.Field} - ${field.Type} ${field.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${field.Key === 'PRI' ? 'PRIMARY KEY' : ''}`);
    });
    
    // 检查表中的数据
    const users = await query(`
      SELECT id, userId, userName, email, displayName, status, creditScore, completedOrders, createdTime 
      FROM users 
      LIMIT 5
    `);
    
    console.log('\n👥 用户数据:');
    if (users.length === 0) {
      console.log('   表中暂无用户数据');
    } else {
      users.forEach(user => {
        console.log(`   ID: ${user.id}, 用户名: ${user.userName}, 状态: ${user.status}, 信誉评分: ${user.creditScore}`);
      });
    }
    
  } catch (error) {
    console.error('❌ 检查表结构失败:', error.message);
  }
}

checkUserTable();

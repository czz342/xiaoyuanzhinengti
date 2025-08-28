const bcrypt = require('bcryptjs');
const { query } = require('./config/database');

async function testPassword() {
  try {
    console.log('🔍 测试密码验证...\n');
    
    // 获取数据库中的用户信息
    const users = await query(`
      SELECT id, userName, password, email, displayName 
      FROM users 
      LIMIT 5
    `);
    
    console.log('📋 数据库中的用户:');
    users.forEach(user => {
      console.log(`   ID: ${user.id}, 用户名: ${user.userName}, 邮箱: ${user.email}`);
      console.log(`   密码哈希: ${user.password.substring(0, 20)}...`);
      console.log(`   显示名称: ${user.displayName || '未设置'}`);
      console.log('   ---');
    });
    
    // 测试密码验证
    console.log('\n🧪 测试密码验证:');
    
    // 测试admin用户
    const adminUser = users.find(u => u.userName === 'admin');
    if (adminUser) {
      console.log(`\n   测试用户: ${adminUser.userName}`);
      console.log(`   密码哈希: ${adminUser.password.substring(0, 20)}...`);
      
      // 测试常见密码
      const testPasswords = ['admin123', 'admin', '123456', 'password'];
      
      for (const testPwd of testPasswords) {
        const isValid = await bcrypt.compare(testPwd, adminUser.password);
        console.log(`   密码 "${testPwd}": ${isValid ? '✅ 正确' : '❌ 错误'}`);
      }
    }
    
    // 测试testuser用户
    const testUser = users.find(u => u.userName === 'testuser');
    if (testUser) {
      console.log(`\n   测试用户: ${testUser.userName}`);
      console.log(`   密码哈希: ${testUser.password.substring(0, 20)}...`);
      
      // 测试常见密码
      const testPasswords = ['123456', 'testuser', 'password', '123'];
      
      for (const testPwd of testPasswords) {
        const isValid = await bcrypt.compare(testPwd, testUser.password);
        console.log(`   密码 "${testPwd}": ${isValid ? '✅ 正确' : '❌ 错误'}`);
      }
    }
    
    // 测试645730151用户
    const user645730151 = users.find(u => u.userName === '645730151');
    if (user645730151) {
      console.log(`\n   测试用户: ${user645730151.userName}`);
      console.log(`   密码哈希: ${user645730151.password.substring(0, 20)}...`);
      
      // 测试常见密码
      const testPasswords = ['645730151', '123456', 'password', '123'];
      
      for (const testPwd of testPasswords) {
        const isValid = await bcrypt.compare(testPwd, user645730151.password);
        console.log(`   密码 "${testPwd}": ${isValid ? '✅ 正确' : '❌ 错误'}`);
      }
    }
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  }
}

testPassword();

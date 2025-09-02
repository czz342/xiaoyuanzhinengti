const User = require('../models/User');
const { testConnection } = require('../config/database');

async function createTestUser() {
  try {
    console.log('开始创建testuser测试账户...');
    await testConnection();
    console.log('数据库连接正常');

    // 检查testuser是否已存在
    const existingUser = await User.findByUsername('testuser');
    if (existingUser) {
      console.log('⚠️ testuser账户已存在，跳过创建');
      return;
    }

    // 创建testuser账户
    const testUserData = {
      userId: 'TEST001',
      userName: 'testuser',
      email: 'testuser@campus.com',
      password: 'test123',
      displayName: '测试用户',
      studentId: 'testuser',
      phone: '13800000001',
      picture: null,
      source: 'register'
    };

    const newUser = await User.create(testUserData);
    console.log('✅ testuser账户创建成功！');
    console.log('📋 账户信息:');
    console.log(`   - 用户名: ${newUser.userName}`);
    console.log(`   - 密码: test123`);
    console.log(`   - 学号: ${newUser.studentId}`);
    console.log(`   - 邮箱: ${newUser.email}`);
    console.log('🔑 请使用以上信息登录测试课程表功能');

  } catch (err) {
    console.error('❌ 创建testuser账户失败:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  createTestUser();
}

module.exports = createTestUser;

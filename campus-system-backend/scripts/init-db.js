const User = require('../models/User');
const { testConnection, ensureDatabase } = require('../config/database');

async function initializeDatabase() {
  try {
    console.log('🚀 开始初始化数据库...');
    
    // 首先确保数据库存在
    console.log('📋 检查数据库是否存在...');
    const dbExists = await ensureDatabase();
    if (!dbExists) {
      console.error('❌ 无法创建数据库，请检查MySQL连接配置');
      process.exit(1);
    }
    
    // 测试数据库连接
    console.log('🔗 测试数据库连接...');
    const connected = await testConnection();
    if (!connected) {
      console.error('❌ 数据库连接失败，无法初始化');
      process.exit(1);
    }
    
    // 创建用户表
    console.log('📋 创建用户表...');
    await User.createTable();
    
    // 创建默认管理员账户（可选）
    console.log('👤 检查默认管理员账户...');
    const adminUser = await User.findByUsername('admin');
    if (!adminUser) {
      console.log('📝 创建默认管理员账户...');
      await User.create({
        userId: 'ADMIN001',
        userName: 'admin',
        email: 'admin@campus.com',
        password: 'admin123',
        displayName: '系统管理员',
        studentId: 'ADMIN001',
        phone: '13800000000',
        source: 'admin',
        picture: null
      });
      console.log('✅ 默认管理员账户创建成功');
      console.log('   用户名: admin');
      console.log('   密码: admin123');
    } else {
      console.log('✅ 默认管理员账户已存在');
    }
    
    console.log('🎉 数据库初始化完成！');
    
  } catch (error) {
    console.error('❌ 数据库初始化失败:', error.message);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  initializeDatabase();
}

module.exports = initializeDatabase;

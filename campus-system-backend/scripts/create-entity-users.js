const { pool, query } = require('../config/database');
const Canteen = require('../models/Canteen');
const User = require('../models/User');

async function createEntityUsers() {
  console.log('🚀 开始为实体创建用户账号...');

  try {
    // 1. 为所有食堂创建用户账号
    const canteens = await Canteen.list();
    console.log(`找到 ${canteens.length} 个食堂，正在为它们创建用户...`);

    for (const canteen of canteens) {
      const userData = {
        userId: `canteen_${canteen.id}`,
        userName: `canteen_${canteen.id}`,
        password: '123456', // 统一的默认密码
        email: `canteen_${canteen.id}@example.com`,
        displayName: canteen.name,
        picture: canteen.image || null,
        phone: canteen.phone || null,
        studentId: null, // 食堂没有学号
        source: 'import',
        status: 'active'
      };

      const existingUser = await User.findByUsername(userData.userName);
      if (existingUser) {
        console.log(`- 食堂账号 ${userData.userName} 已存在，跳过创建。`);
      } else {
        await User.create(userData);
        console.log(`✅ 已为食堂“${canteen.name}”创建用户账号: ${userData.userName}`);
      }
    }

    // 2. 创建一个测试骑手账号
    const riderData = {
      userId: 'rider_test_001',
      userName: 'rider_test_001',
      password: '123456',
      email: 'rider_test_001@example.com',
      displayName: '校园骑手-001',
      picture: null, // 骑手可以后续上传头像
      phone: null, // 骑手可以后续补充
      studentId: null, // 骑手不是学生
      source: 'import',
      status: 'active'
    };

    const existingRider = await User.findByUsername(riderData.userName);
    if (existingRider) {
      console.log(`- 测试骑手账号 ${riderData.userName} 已存在，跳过创建。`);
    } else {
      await User.create(riderData);
      console.log(`✅ 已创建测试骑手账号: ${riderData.userName}`);
    }

    console.log('\n🎉 所有实体用户账号处理完毕！');

  } catch (error) {
    console.error('❌ 创建实体用户时出错:', error);
  } finally {
    await pool.end();
    console.log('数据库连接已关闭。');
  }
}

createEntityUsers();

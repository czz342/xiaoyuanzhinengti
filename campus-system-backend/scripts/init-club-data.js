const { testConnection } = require('../config/database');
const Club = require('../models/Club');
const ClubMember = require('../models/ClubMember');

async function initClubData() {
  try {
    console.log('🚀 开始初始化社团数据...');
    
    // 测试数据库连接
    const connected = await testConnection();
    if (!connected) {
      throw new Error('数据库连接失败');
    }
    
    // 创建社团表
    await Club.createTable();
    console.log('✅ 社团表创建成功');
    
    // 创建社团成员表
    await ClubMember.createTable();
    console.log('✅ 社团成员表创建成功');
    
    // 插入示例社团数据
    const sampleClubs = [
      {
        name: '计算机协会',
        description: '致力于计算机技术学习和交流的学术社团',
        category: '技术类',
        leader_id: '1',
        leader_name: '张三',
        leader_phone: '13800138001',
        established_date: '2020-09-01',
        contact_email: 'cs@university.edu',
        contact_phone: '010-12345678',
        meeting_place: '计算机学院A101',
        meeting_time: '每周三晚7:00-9:00',
        requirements: '对计算机技术有浓厚兴趣，有一定的编程基础',
        level: 'A',
        status: 'active'
      },
      {
        name: '摄影社',
        description: '用镜头记录美好时光，分享摄影技巧和作品',
        category: '艺术类',
        leader_id: '2',
        leader_name: '李四',
        leader_phone: '13800138002',
        established_date: '2019-03-15',
        contact_email: 'photo@university.edu',
        contact_phone: '010-12345679',
        meeting_place: '艺术学院B201',
        meeting_time: '每周六下午2:00-5:00',
        requirements: '热爱摄影，有相机设备优先',
        level: 'B',
        status: 'active'
      },
      {
        name: '篮球社',
        description: '推广篮球运动，组织比赛和训练活动',
        category: '体育类',
        leader_id: '3',
        leader_name: '王五',
        leader_phone: '13800138003',
        established_date: '2018-09-01',
        contact_email: 'basketball@university.edu',
        contact_phone: '010-12345680',
        meeting_place: '体育馆篮球场',
        meeting_time: '每周二、四晚6:00-8:00',
        requirements: '热爱篮球运动，有一定的篮球基础',
        level: 'A',
        status: 'active'
      },
      {
        name: '文学社',
        description: '文学创作与交流，举办读书会和写作比赛',
        category: '文化类',
        leader_id: '4',
        leader_name: '赵六',
        leader_phone: '13800138004',
        established_date: '2021-03-01',
        contact_email: 'literature@university.edu',
        contact_phone: '010-12345681',
        meeting_place: '文学院C301',
        meeting_time: '每周五晚7:00-9:00',
        requirements: '热爱文学创作，有一定的写作基础',
        level: 'C',
        status: 'inactive'
      },
      {
        name: '音乐社',
        description: '音乐学习与表演，组织音乐会和演出活动',
        category: '艺术类',
        leader_id: '5',
        leader_name: '钱七',
        leader_phone: '13800138005',
        established_date: '2020-09-15',
        contact_email: 'music@university.edu',
        contact_phone: '010-12345682',
        meeting_place: '音乐学院D101',
        meeting_time: '每周日晚上7:00-9:00',
        requirements: '热爱音乐，有乐器演奏基础优先',
        level: 'B',
        status: 'active'
      },
      {
        name: '舞蹈社',
        description: '各种舞蹈风格的学习和表演，提升身体协调性',
        category: '艺术类',
        leader_id: '6',
        leader_name: '孙八',
        leader_phone: '13800138006',
        established_date: '2021-09-01',
        contact_email: 'dance@university.edu',
        contact_phone: '010-12345683',
        meeting_place: '艺术学院舞蹈室',
        meeting_time: '每周三、六下午3:00-5:00',
        requirements: '热爱舞蹈，有一定的舞蹈基础',
        level: 'B',
        status: 'active'
      },
      {
        name: '英语角',
        description: '英语口语练习和交流，提高英语水平',
        category: '文化类',
        leader_id: '7',
        leader_name: '周九',
        leader_phone: '13800138007',
        established_date: '2019-09-01',
        contact_email: 'english@university.edu',
        contact_phone: '010-12345684',
        meeting_place: '外语学院E201',
        meeting_time: '每周四晚7:00-8:30',
        requirements: '对英语学习有兴趣，有一定的英语基础',
        level: 'C',
        status: 'active'
      },
      {
        name: '动漫社',
        description: '动漫文化分享和交流，组织cosplay活动',
        category: '文化类',
        leader_id: '8',
        leader_name: '吴十',
        leader_phone: '13800138008',
        established_date: '2022-03-01',
        contact_email: 'anime@university.edu',
        contact_phone: '010-12345685',
        meeting_place: '学生活动中心F101',
        meeting_time: '每周六下午2:00-5:00',
        requirements: '热爱动漫文化，有相关作品分享',
        level: 'C',
        status: 'active'
      }
    ];
    
    // 插入社团数据
    for (const clubData of sampleClubs) {
      try {
        const club = await Club.create(clubData);
        console.log(`✅ 创建社团: ${club.name}`);
        
        // 为每个社团添加一些成员
        const memberCount = Math.floor(Math.random() * 50) + 20; // 20-70个成员
        for (let i = 1; i <= memberCount; i++) {
          const role = i === 1 ? 'leader' : (i <= 3 ? 'vice_leader' : 'member');
          await ClubMember.join(
            club.id,
            `USER${club.id}${i.toString().padStart(3, '0')}`,
            `成员${i}`,
            role
          );
        }
        
        // 更新社团成员数量
        await Club.updateMemberCount(club.id, memberCount);
        
        // 随机添加一些活动数量
        const activityCount = Math.floor(Math.random() * 20) + 5; // 5-25个活动
        await Club.updateActivityCount(club.id, activityCount);
        
      } catch (error) {
        console.error(`❌ 创建社团 ${clubData.name} 失败:`, error.message);
      }
    }
    
    console.log('🎉 社团数据初始化完成！');
    console.log(`📊 共创建了 ${sampleClubs.length} 个社团`);
    
  } catch (error) {
    console.error('❌ 初始化社团数据失败:', error.message);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  initClubData().then(() => {
    console.log('✅ 脚本执行完成');
    process.exit(0);
  }).catch((error) => {
    console.error('❌ 脚本执行失败:', error);
    process.exit(1);
  });
}

module.exports = { initClubData };


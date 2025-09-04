const { testConnection, ensureDatabase } = require('../config/database');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Like = require('../models/Like');

async function initCommunityTables() {
  console.log('🚀 开始初始化校园圈子数据库表...');
  
  try {
    // 确保数据库存在
    await ensureDatabase();
    
    // 测试连接
    const connected = await testConnection();
    if (!connected) {
      throw new Error('数据库连接失败');
    }
    
    // 创建表（按依赖顺序）
    console.log('📝 创建帖子表...');
    await Post.createTable();
    
    console.log('💬 创建评论表...');
    await Comment.createTable();
    
    console.log('👍 创建点赞表...');
    await Like.createTable();
    
    console.log('✅ 校园圈子数据库表初始化完成！');
    
    // 插入一些示例数据
    await insertSampleData();
    
  } catch (error) {
    console.error('❌ 初始化失败:', error);
    process.exit(1);
  }
}

async function insertSampleData() {
  console.log('📊 插入示例数据...');
  
  try {
    // 检查是否已有数据
    const existingPosts = await Post.list({ limit: 1 });
    if (existingPosts.length > 0) {
      console.log('ℹ️ 数据已存在，跳过示例数据插入');
      return;
    }
    
    // 插入示例帖子
    const samplePosts = [
      {
        title: '出售二手自行车，九成新',
        content: '因为毕业要离开学校，出售陪伴我三年的自行车。车子保养得很好，没有大修过，适合日常代步。价格面议，有意者请联系。',
        category: 'second_hand',
        author_id: 'student001',
        author_name: '张三',
        author_avatar: '/static/images/avatar1.png',
        images: ['/static/images/bike1.jpg', '/static/images/bike2.jpg'],
        allow_comments: true,
        is_featured: true
      },
      {
        title: '寻找一起学习的小伙伴',
        content: '准备考研，希望找一个志同道合的学习伙伴，互相督促，一起进步。最好是计算机专业的同学，可以一起讨论题目。',
        category: 'dating',
        author_id: 'student002',
        author_name: '李四',
        author_avatar: '/static/images/avatar2.png',
        images: [],
        allow_comments: true
      },
      {
        title: '图书馆怎么预约座位？',
        content: '第一次来图书馆，不知道怎么预约座位，有同学能教教我吗？谢谢！',
        category: 'help',
        author_id: 'student003',
        author_name: '王五',
        author_avatar: '/static/images/avatar3.png',
        images: [],
        allow_comments: true
      },
      {
        title: '招聘校园代理，月薪2000+',
        content: '某知名教育机构招聘校园代理，主要负责推广课程。工作时间灵活，月薪2000-5000元，有提成。要求：沟通能力强，有责任心。',
        category: 'part_time',
        author_id: 'company001',
        author_name: '教育机构HR',
        author_avatar: '/static/images/company1.png',
        images: [],
        allow_comments: true
      },
      {
        title: '今天食堂的菜真不错！',
        content: '今天去食堂吃饭，发现新开了一个窗口，菜品种类丰富，味道也不错，价格还实惠。推荐大家去试试！',
        category: 'gossip',
        author_id: 'student004',
        author_name: '赵六',
        author_avatar: '/static/images/avatar4.png',
        images: ['/static/images/food1.jpg'],
        allow_comments: true
      }
    ];
    
    for (const postData of samplePosts) {
      await Post.create(postData);
    }
    
    console.log('✅ 示例数据插入完成！');
    
  } catch (error) {
    console.error('❌ 插入示例数据失败:', error);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  initCommunityTables().then(() => {
    console.log('🎉 初始化完成，程序退出');
    process.exit(0);
  });
}

module.exports = { initCommunityTables };

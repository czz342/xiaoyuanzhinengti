const Book = require('../models/Book');
const BookBorrowing = require('../models/BookBorrowing');
const BookReservation = require('../models/BookReservation');
const { ensureDatabase } = require('../config/database');

async function initBookTables() {
  try {
    console.log('📚 开始初始化图书模块...');
    
    // 确保数据库连接
    await ensureDatabase();
    
    // 创建表
    await Book.createTable();
    await BookBorrowing.createTable();
    await BookReservation.createTable();
    
    console.log('✅ 图书模块表创建完成');
    
    // 插入示例数据
    await insertSampleBooks();
    
    console.log('🎉 图书模块初始化完成！');
  } catch (error) {
    console.error('❌ 图书模块初始化失败:', error);
    process.exit(1);
  }
}

async function insertSampleBooks() {
  console.log('📖 开始插入示例图书数据...');
  
  // 使用用户提供的真实图书数据，并添加数量信息
  const sampleBooks = [
    {
      isbn: '9787532781354',
      title: '三体',
      author: '刘慈欣',
      publisher: '重庆出版社',
      publishDate: '2008-01-01',
      category: '科幻',
      description: '地球文明向宇宙发出广播，寻找其他文明，却引来了三体文明的入侵。',
      coverImage: '/static/images/BookPicture/三体.jpg',
      location: '1层-A1-01',
      totalCopies: 8,
      availableCopies: 6,
      borrowedCopies: 2,
      reservedCopies: 0,
      price: 23.00,
      language: '中文',
      pages: 302,
      format: '平装',
      tags: ['科幻', '宇宙', '文明', '科技']
    },
    {
      isbn: '9787506365437',
      title: '活着',
      author: '余华',
      publisher: '作家出版社',
      publishDate: '2012-08-01',
      category: '文学',
      description: '讲述了农村人福贵悲惨的人生遭遇，揭示了生命的意义和人性的复杂。',
      coverImage: '/static/images/BookPicture/活着.jpg',
      location: '2层-B3-05',
      totalCopies: 10,
      availableCopies: 7,
      borrowedCopies: 3,
      reservedCopies: 0,
      price: 20.00,
      language: '中文',
      pages: 191,
      format: '平装',
      tags: ['现代文学', '人生', '苦难', '生命']
    },
    {
      isbn: '9787020138982',
      title: '围城',
      author: '钱钟书',
      publisher: '人民文学出版社',
      publishDate: '1991-02-01',
      category: '文学',
      description: '描写了抗战初期知识分子的群相，被誉为"新儒林外史"。',
      coverImage: '/static/images/BookPicture/围城.jpg',
      location: '2层-B3-02',
      totalCopies: 6,
      availableCopies: 4,
      borrowedCopies: 2,
      reservedCopies: 0,
      price: 19.00,
      language: '中文',
      pages: 359,
      format: '平装',
      tags: ['现代文学', '知识分子', '婚姻', '讽刺']
    },
    {
      isbn: '9787544253994',
      title: '百年孤独',
      author: '[哥] 加西亚·马尔克斯',
      publisher: '南海出版公司',
      publishDate: '2011-06-01',
      category: '文学',
      description: '魔幻现实主义文学代表作，描写了布恩迪亚家族七代人的传奇故事。',
      coverImage: '/static/images/BookPicture/百年孤独.jpg',
      location: '2层-B4-08',
      totalCopies: 5,
      availableCopies: 3,
      borrowedCopies: 2,
      reservedCopies: 0,
      price: 55.00,
      language: '中文',
      pages: 360,
      format: '精装',
      tags: ['魔幻现实主义', '家族', '拉丁美洲', '文学经典']
    },
    {
      isbn: '9787115545499',
      title: 'JavaScript高级程序设计(第4版)',
      author: '[美] 马特·弗里斯比',
      publisher: '人民邮电出版社',
      publishDate: '2019-12-01',
      category: '计算机',
      description: 'JavaScript权威指南，全面介绍JavaScript语言特性和最佳实践。',
      coverImage: '/static/images/BookPicture/JavaScript高级程序设计(第4版).jpg',
      location: '3层-C1-11',
      totalCopies: 12,
      availableCopies: 8,
      borrowedCopies: 4,
      reservedCopies: 0,
      price: 129.00,
      language: '中文',
      pages: 800,
      format: '平装',
      tags: ['JavaScript', '编程', '前端开发', '技术']
    },
    {
      isbn: '9787121352227',
      title: '深入理解计算机系统',
      author: '[美] Randal E. Bryant',
      publisher: '机械工业出版社',
      publishDate: '2016-11-01',
      category: '计算机',
      description: '计算机系统的经典教材，深入讲解计算机硬件和软件的工作原理。',
      coverImage: '/static/images/BookPicture/深入理解计算机系统.jpg',
      location: '3层-C1-12',
      totalCopies: 8,
      availableCopies: 5,
      borrowedCopies: 3,
      reservedCopies: 0,
      price: 139.00,
      language: '中文',
      pages: 736,
      format: '平装',
      tags: ['计算机系统', '硬件', '软件', '技术']
    },
    {
      isbn: '9787111641094',
      title: '洞穴奇案',
      author: '[美] 彼得·萨伯',
      publisher: '北京大学出版社',
      publishDate: '2012-01-01',
      category: '法学',
      description: '通过一个虚构的洞穴探险案件，探讨法律、道德和正义的复杂关系。',
      coverImage: '/static/images/BookPicture/洞穴奇案.jpg',
      location: '4层-F5-01',
      totalCopies: 6,
      availableCopies: 4,
      borrowedCopies: 2,
      reservedCopies: 0,
      price: 32.00,
      language: '中文',
      pages: 256,
      format: '平装',
      tags: ['法学', '哲学', '正义', '道德']
    },
    {
      isbn: '9787508647357',
      title: '人类简史',
      author: '[以] 尤瓦尔·赫拉利',
      publisher: '中信出版社',
      publishDate: '2014-11-01',
      category: '社科',
      description: '从认知革命、农业革命到科技革命，重新解读人类发展历程。',
      coverImage: '/static/images/BookPicture/人类简史.jpg',
      location: '1层-S5-09',
      totalCopies: 15,
      availableCopies: 10,
      borrowedCopies: 5,
      reservedCopies: 0,
      price: 68.00,
      language: '中文',
      pages: 440,
      format: '精装',
      tags: ['历史', '人类学', '社会学', '科普']
    },
    {
      isbn: '9787549400844',
      title: '艺术的故事',
      author: '[英] E.H.贡布里希',
      publisher: '广西美术出版社',
      publishDate: '2008-04-01',
      category: '艺术',
      description: '艺术史的经典著作，从史前艺术到现代艺术的全面介绍。',
      coverImage: '/static/images/BookPicture/艺术的故事.jpg',
      location: '4层-Y1-03',
      totalCopies: 4,
      availableCopies: 2,
      borrowedCopies: 2,
      reservedCopies: 0,
      price: 280.00,
      language: '中文',
      pages: 688,
      format: '精装',
      tags: ['艺术史', '美术', '文化', '经典']
    },
    {
      isbn: '9787115461430',
      title: '深度学习',
      author: '[美] 伊恩·古德费洛',
      publisher: '人民邮电出版社',
      publishDate: '2017-07-01',
      category: '计算机',
      description: '深度学习的权威教材，全面介绍深度学习理论和实践。',
      coverImage: '/static/images/BookPicture/深度学习.jpg',
      location: '3层-C1-15',
      totalCopies: 10,
      availableCopies: 6,
      borrowedCopies: 4,
      reservedCopies: 0,
      price: 168.00,
      language: '中文',
      pages: 800,
      format: '平装',
      tags: ['深度学习', '人工智能', '机器学习', '技术']
    },
    {
      isbn: '9787208108844',
      title: '追风筝的人',
      author: '[美] 卡勒德·胡赛尼',
      publisher: '上海人民出版社',
      publishDate: '2006-05-01',
      category: '小说',
      description: '阿富汗背景下的成长小说，讲述友情、背叛和救赎的故事。',
      coverImage: '/static/images/BookPicture/追风筝的人.jpg',
      location: '2层-B6-07',
      totalCopies: 8,
      availableCopies: 5,
      borrowedCopies: 3,
      reservedCopies: 0,
      price: 25.00,
      language: '中文',
      pages: 362,
      format: '平装',
      tags: ['小说', '阿富汗', '友情', '救赎']
    },
    {
      isbn: '9787544270878',
      title: '解忧杂货店',
      author: '[日] 东野圭吾',
      publisher: '南海出版公司',
      publishDate: '2014-05-01',
      category: '小说',
      description: '通过一家神奇的杂货店，连接过去和现在，解答人生困惑。',
      coverImage: '/static/images/BookPicture/解忧杂货店.jpg',
      location: '2层-B6-01',
      totalCopies: 12,
      availableCopies: 8,
      borrowedCopies: 4,
      reservedCopies: 0,
      price: 39.50,
      language: '中文',
      pages: 291,
      format: '平装',
      tags: ['小说', '日本文学', '温情', '治愈']
    },
    {
      isbn: '9787530216773',
      title: '平凡的世界',
      author: '路遥',
      publisher: '北京十月文艺出版社',
      publishDate: '2017-06-01',
      category: '文学',
      description: '描写中国农村青年奋斗历程的现实主义文学巨著。',
      coverImage: '/static/images/BookPicture/平凡的世界.jpg',
      location: '2层-B3-09',
      totalCopies: 10,
      availableCopies: 6,
      borrowedCopies: 4,
      reservedCopies: 0,
      price: 128.00,
      language: '中文',
      pages: 1260,
      format: '平装',
      tags: ['现实主义', '农村', '奋斗', '人生']
    },
    {
      isbn: '9787121103713',
      title: '代码整洁之道',
      author: '[美] Robert C. Martin',
      publisher: '电子工业出版社',
      publishDate: '2010-01-01',
      category: '计算机',
      description: '软件开发的经典著作，教你如何写出清晰、可维护的代码。',
      coverImage: '/static/images/BookPicture/代码整洁之道.jpg',
      location: '3层-C2-01',
      totalCopies: 8,
      availableCopies: 5,
      borrowedCopies: 3,
      reservedCopies: 0,
      price: 59.00,
      language: '中文',
      pages: 388,
      format: '平装',
      tags: ['编程', '代码质量', '软件工程', '最佳实践']
    },
    {
      isbn: '9787535799334',
      title: '奈特人体解剖学图谱',
      author: '[美] 弗兰克·奈特',
      publisher: '湖南科学技术出版社',
      publishDate: '2010-01-01',
      category: '医学',
      description: '世界著名的人体解剖学图谱，医学教育的必备参考书。',
      coverImage: '/static/images/BookPicture/奈特人体解剖学图谱.jpg',
      location: '4层-M7-02',
      totalCopies: 6,
      availableCopies: 3,
      borrowedCopies: 3,
      reservedCopies: 0,
      price: 298.00,
      language: '中文',
      pages: 624,
      format: '精装',
      tags: ['医学', '解剖学', '图谱', '专业']
    },
    {
      isbn: '9787208170827',
      title: '乡土中国',
      author: '费孝通',
      publisher: '上海人民出版社',
      publishDate: '2006-04-01',
      category: '社科',
      description: '中国社会学经典著作，深入分析中国传统社会的结构和特征。',
      coverImage: '/static/images/BookPicture/乡土中国.jpg',
      location: '1层-S5-02',
      totalCopies: 7,
      availableCopies: 4,
      borrowedCopies: 3,
      reservedCopies: 0,
      price: 38.00,
      language: '中文',
      pages: 426,
      format: '平装',
      tags: ['社会学', '中国社会', '传统文化', '学术']
    },
    {
      isbn: '9787508633596',
      title: '思考，快与慢',
      author: '[美] 丹尼尔·卡尼曼',
      publisher: '中信出版社',
      publishDate: '2012-07-01',
      category: '经管',
      description: '诺贝尔经济学奖得主卡尼曼关于人类思维和决策的研究。',
      coverImage: '/static/images/BookPicture/思考，快与慢.jpg',
      location: '1层-J3-06',
      totalCopies: 9,
      availableCopies: 6,
      borrowedCopies: 3,
      reservedCopies: 0,
      price: 69.00,
      language: '中文',
      pages: 424,
      format: '精装',
      tags: ['心理学', '经济学', '决策', '思维']
    },
    {
      isbn: '9787532742188',
      title: '枪炮、病菌与钢铁',
      author: '[美] 贾雷德·戴蒙德',
      publisher: '上海译文出版社',
      publishDate: '2006-04-01',
      category: '历史',
      description: '探讨人类社会发展差异的原因，从地理、生物、文化等角度分析。',
      coverImage: '/static/images/BookPicture/枪炮、病菌与钢铁.jpg',
      location: '2层-H3-10',
      totalCopies: 6,
      availableCopies: 3,
      borrowedCopies: 3,
      reservedCopies: 0,
      price: 45.00,
      language: '中文',
      pages: 460,
      format: '平装',
      tags: ['历史', '人类学', '社会发展', '文明']
    },
    {
      isbn: '9787209117946',
      title: '设计中的设计',
      author: '[日] 原研哉',
      publisher: '山东人民出版社',
      publishDate: '2006-11-01',
      category: '艺术',
      description: '日本设计大师原研哉的设计理念和作品集。',
      coverImage: '/static/images/BookPicture/设计中的设计.jpg',
      location: '4层-Y2-05',
      totalCopies: 5,
      availableCopies: 3,
      borrowedCopies: 2,
      reservedCopies: 0,
      price: 48.00,
      language: '中文',
      pages: 240,
      format: '平装',
      tags: ['设计', '日本设计', '美学', '创意']
    },
    {
      isbn: '9787208171336',
      title: '置身事内',
      author: '兰小欢',
      publisher: '上海人民出版社',
      publishDate: '2021-08-01',
      category: '经济',
      description: '中国经济观察，从政府视角解读中国经济运行机制。',
      coverImage: '/static/images/BookPicture/置身事内.jpg',
      location: '1层-J4-04',
      totalCopies: 8,
      availableCopies: 5,
      borrowedCopies: 3,
      reservedCopies: 0,
      price: 65.00,
      language: '中文',
      pages: 320,
      format: '平装',
      tags: ['经济学', '中国经济', '政府', '政策']
    }
  ];

  for (const bookData of sampleBooks) {
    try {
      await Book.create(bookData);
      console.log(`✅ 创建图书: ${bookData.title}`);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.log(`⚠️  图书已存在: ${bookData.title}`);
      } else {
        console.error(`❌ 创建图书失败 ${bookData.title}:`, error.message);
      }
    }
  }
  
  console.log('✅ 示例图书数据插入完成');
}

if (require.main === module) {
  initBookTables();
}

module.exports = { initBookTables, insertSampleBooks };

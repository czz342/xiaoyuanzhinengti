/**
 * 简化版数据库初始化
 * 直接逐步执行关键SQL
 */

const db = require('../config/database');

async function simpleInit() {
  try {
    console.log('🚀 开始简化初始化...');
    
    // 1. 创建窗口表
    console.log('📝 创建窗口表...');
    try {
      await db.query(`
        CREATE TABLE IF NOT EXISTS \`canteen_windows\` (
          \`id\` INT AUTO_INCREMENT PRIMARY KEY,
          \`canteen_id\` INT NOT NULL COMMENT '食堂ID',
          \`window_number\` VARCHAR(20) NOT NULL COMMENT '窗口编号',
          \`window_name\` VARCHAR(100) NOT NULL COMMENT '窗口名称',
          \`window_type\` VARCHAR(50) NOT NULL COMMENT '窗口类型/菜系',
          \`description\` TEXT COMMENT '窗口描述',
          \`tags\` JSON COMMENT '窗口标签',
          \`status\` ENUM('open', 'closed', 'busy') DEFAULT 'open' COMMENT '窗口状态',
          \`open_time\` TIME COMMENT '营业开始时间',
          \`close_time\` TIME COMMENT '营业结束时间',
          \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX \`idx_canteen_id\` (\`canteen_id\`),
          INDEX \`idx_window_type\` (\`window_type\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='食堂窗口表'
      `);
      console.log('✅ 窗口表创建成功');
    } catch (error) {
      console.log('⚠️  窗口表已存在，跳过创建');
    }
    
    // 2. 添加window_id列
    console.log('📝 添加window_id列...');
    try {
      await db.query(`ALTER TABLE \`foods\` ADD COLUMN \`window_id\` INT DEFAULT NULL COMMENT '所属窗口ID' AFTER \`canteen_id\``);
      console.log('✅ window_id列添加成功');
    } catch (error) {
      console.log('⚠️  window_id列已存在，跳过添加');
    }
    
    // 3. 创建索引
    console.log('📝 创建索引...');
    try {
      await db.query(`ALTER TABLE \`foods\` ADD INDEX \`idx_window_id\` (\`window_id\`)`);
      console.log('✅ 索引创建成功');
    } catch (error) {
      console.log('⚠️  索引已存在，跳过创建');
    }
    
    // 4. 插入窗口数据
    console.log('📝 插入窗口数据...');
    
    const windows = [
      // 一食堂窗口
      [1, '1号窗口', '一食堂川菜窗口', '川菜', '正宗川味，麻辣鲜香', '["热销", "特色"]', '06:30:00', '21:30:00'],
      [1, '2号窗口', '一食堂湘菜窗口', '湘菜', '地道湘味，香辣可口', '["特色", "推荐"]', '06:30:00', '21:30:00'],
      [1, '3号窗口', '一食堂粤菜窗口', '粤菜', '清淡养生，原汁原味', '["健康", "清淡"]', '07:00:00', '21:00:00'],
      [1, '4号窗口', '一食堂快餐窗口', '快餐', '快速出餐，品种齐全', '["快速", "实惠"]', '06:30:00', '21:30:00'],
      [1, '5号窗口', '一食堂面食窗口', '面食', '各式面点，手工制作', '["主食", "特色"]', '06:30:00', '21:00:00'],
      [1, '6号窗口', '一食堂素食窗口', '素食', '健康素食，营养均衡', '["健康", "素食"]', '07:00:00', '20:00:00'],
      [1, '7号窗口', '一食堂小吃窗口', '小吃', '地方小吃，风味独特', '["小吃", "特色"]', '10:00:00', '21:30:00'],
      
      // 二食堂窗口
      [2, '1号窗口', '二食堂特色川菜', '川菜', '招牌川菜，师傅精选', '["热销", "特色", "推荐"]', '07:00:00', '21:00:00'],
      [2, '2号窗口', '二食堂精品面食', '面食', '手工拉面，现做现卖', '["主食", "热销"]', '07:00:00', '21:00:00'],
      [2, '3号窗口', '二食堂西式简餐', '西餐', '西式快餐，便捷美味', '["西餐", "快速"]', '08:00:00', '20:00:00'],
      [2, '4号窗口', '二食堂特色小炒', '家常菜', '家常小炒，温馨美味', '["家常", "推荐"]', '07:00:00', '21:00:00'],
      [2, '5号窗口', '二食堂盖浇饭', '快餐', '营养盖浇，经济实惠', '["实惠", "快速"]', '07:00:00', '21:00:00'],
      
      // 三食堂窗口
      [3, '1号窗口', '三食堂快餐套餐', '快餐', '营养套餐，搭配合理', '["套餐", "实惠"]', '07:30:00', '20:30:00'],
      [3, '2号窗口', '三食堂面馆', '面食', '各地面食，应有尽有', '["主食", "特色"]', '07:30:00', '20:30:00'],
      [3, '3号窗口', '三食堂小吃城', '小吃', '网红小吃，美味汇聚', '["小吃", "网红", "新品"]', '10:00:00', '20:30:00'],
      [3, '4号窗口', '三食堂饮品站', '饮品', '现制饮品，清凉一夏', '["饮品", "推荐"]', '08:00:00', '20:30:00'],
      [3, '5号窗口', '三食堂烧烤', '烧烤', '特色烧烤，香气扑鼻', '["烧烤", "特色", "热销"]', '11:00:00', '20:30:00']
    ];
    
    for (const window of windows) {
      try {
        await db.query(
          `INSERT INTO \`canteen_windows\` (\`canteen_id\`, \`window_number\`, \`window_name\`, \`window_type\`, \`description\`, \`tags\`, \`open_time\`, \`close_time\`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          window
        );
      } catch (error) {
        if (error.code !== 'ER_DUP_ENTRY') {
          console.log('窗口插入错误:', error.message);
        }
      }
    }
    
    // 5. 验证数据
    const windowCount = await db.query('SELECT COUNT(*) as count FROM canteen_windows');
    console.log(`✅ 窗口数量: ${windowCount[0].count}`);
    
    // 6. 为现有菜品分配窗口
    console.log('📝 为菜品分配窗口...');
    
    // 获取所有窗口
    const allWindows = await db.query('SELECT id, canteen_id, window_type FROM canteen_windows');
    
    // 为每个食堂的菜品分配窗口
    for (const window of allWindows) {
      const foods = await db.query(
        `SELECT id, name FROM foods WHERE canteen_id = ? AND window_id IS NULL LIMIT 3`,
        [window.canteen_id]
      );
      
      for (const food of foods) {
        await db.query(
          `UPDATE foods SET window_id = ? WHERE id = ?`,
          [window.id, food.id]
        );
      }
    }
    
    const assignedCount = await db.query('SELECT COUNT(*) as count FROM foods WHERE window_id IS NOT NULL');
    console.log(`✅ 已分配窗口的菜品数量: ${assignedCount[0].count}`);
    
    console.log('\n🎉 简化初始化完成！');
    
  } catch (error) {
    console.error('❌ 初始化失败:', error);
    throw error;
  }
}

if (require.main === module) {
  simpleInit()
    .then(() => {
      console.log('✅ 脚本执行完成');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ 脚本执行失败:', error);
      process.exit(1);
    });
}

module.exports = { simpleInit };

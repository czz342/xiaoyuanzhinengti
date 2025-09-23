const { query } = require('../config/database')

async function createActivityTables() {
  try {
    console.log('开始创建活动相关数据表...')

    // 创建活动表
    const createActivitiesTable = `
      CREATE TABLE IF NOT EXISTS activities (
        id INT AUTO_INCREMENT PRIMARY KEY,
        club_id INT NOT NULL,
        title VARCHAR(200) NOT NULL COMMENT '活动标题',
        description TEXT COMMENT '活动描述',
        start_time DATETIME NOT NULL COMMENT '开始时间',
        end_time DATETIME NOT NULL COMMENT '结束时间',
        location VARCHAR(200) NOT NULL COMMENT '活动地点',
        max_participants INT DEFAULT 50 COMMENT '最大参与人数',
        registration_deadline DATETIME NOT NULL COMMENT '报名截止时间',
        cover_image VARCHAR(500) COMMENT '封面图片',
        tags JSON COMMENT '活动标签',
        status ENUM('draft', 'published', 'ongoing', 'completed', 'cancelled') DEFAULT 'draft' COMMENT '活动状态',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_club_id (club_id),
        INDEX idx_status (status),
        INDEX idx_start_time (start_time),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='活动表'
    `

    // 创建活动参与者表
    const createActivityParticipantsTable = `
      CREATE TABLE IF NOT EXISTS activity_participants (
        id INT AUTO_INCREMENT PRIMARY KEY,
        activity_id INT NOT NULL,
        user_id INT NOT NULL,
        status ENUM('registered', 'attended', 'absent') DEFAULT 'registered' COMMENT '参与状态',
        registration_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '报名时间',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_participation (activity_id, user_id),
        INDEX idx_activity_id (activity_id),
        INDEX idx_user_id (user_id),
        INDEX idx_status (status),
        FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='活动参与者表'
    `

    await query(createActivitiesTable)
    console.log('✅ 活动表创建成功')

    await query(createActivityParticipantsTable)
    console.log('✅ 活动参与者表创建成功')

    console.log('🎉 活动相关数据表创建完成！')
  } catch (error) {
    console.error('❌ 创建数据表失败:', error.message)
    throw error
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  createActivityTables()
    .then(() => {
      console.log('脚本执行完成')
      process.exit(0)
    })
    .catch((error) => {
      console.error('脚本执行失败:', error.message)
      process.exit(1)
    })
}

module.exports = createActivityTables


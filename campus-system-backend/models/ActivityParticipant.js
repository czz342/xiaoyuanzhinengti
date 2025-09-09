const { query } = require('../config/database')

class ActivityParticipant {
  // 创建活动参与者表
  static async createTable() {
    const sql = `
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
    
    try {
      await query(sql)
      console.log('Activity participants table created successfully')
    } catch (error) {
      console.error('Error creating activity participants table:', error)
      throw error
    }
  }
  // 报名参加活动
  static async register(activityId, userId) {
    // 检查是否已经报名
    const checkSql = 'SELECT id FROM activity_participants WHERE activity_id = ? AND user_id = ?'
    const existing = await query(checkSql, [activityId, userId])
    
    if (existing.length > 0) {
      throw new Error('您已经报名参加此活动')
    }

    // 检查活动是否存在且可报名
    const activitySql = 'SELECT * FROM activities WHERE id = ? AND status = "published"'
    const activity = await query(activitySql, [activityId])
    
    if (activity.length === 0) {
      throw new Error('活动不存在或已结束报名')
    }

    // 检查报名截止时间
    if (new Date() > new Date(activity[0].registration_deadline)) {
      throw new Error('报名已截止')
    }

    // 检查参与人数限制
    const countSql = 'SELECT COUNT(*) as count FROM activity_participants WHERE activity_id = ?'
    const countResult = await query(countSql, [activityId])
    const currentCount = countResult[0].count

    if (currentCount >= activity[0].max_participants) {
      throw new Error('活动报名人数已满')
    }

    // 创建报名记录
    const sql = `
      INSERT INTO activity_participants (activity_id, user_id, status, registration_time)
      VALUES (?, ?, 'registered', NOW())
    `

    try {
      const result = await query(sql, [activityId, userId])
      return { id: result.insertId, activity_id: activityId, user_id: userId, status: 'registered' }
    } catch (error) {
      throw new Error(`报名失败: ${error.message}`)
    }
  }

  // 获取活动参与者列表
  static async getByActivityId(activityId, params = {}) {
    const { page = 1, limit = 10, status } = params

    let sql = `
      SELECT 
        ap.*,
        u.username as user_name,
        u.avatar as user_avatar
      FROM activity_participants ap
      LEFT JOIN users u ON ap.user_id = u.id
      WHERE ap.activity_id = ?
    `
    const values = [activityId]

    if (status) {
      sql += ' AND ap.status = ?'
      values.push(status)
    }

    // 添加分页
    const offset = (page - 1) * limit
    sql += ` ORDER BY ap.registration_time DESC LIMIT ? OFFSET ?`
    values.push(limit, offset)

    try {
      const participants = await query(sql, values)
      
      // 获取总数
      let countSql = `
        SELECT COUNT(*) as total
        FROM activity_participants ap
        WHERE ap.activity_id = ?
      `
      const countValues = [activityId]
      
      if (status) {
        countSql += ' AND ap.status = ?'
        countValues.push(status)
      }

      const countResult = await query(countSql, countValues)
      const total = countResult[0].total

      return {
        participants,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: parseInt(total)
        }
      }
    } catch (error) {
      throw new Error(`获取参与者列表失败: ${error.message}`)
    }
  }

  // 更新参与者状态
  static async updateStatus(activityId, participantId, status) {
    const sql = 'UPDATE activity_participants SET status = ? WHERE activity_id = ? AND id = ?'
    
    try {
      const result = await query(sql, [status, activityId, participantId])
      return result.affectedRows > 0
    } catch (error) {
      throw new Error(`更新参与者状态失败: ${error.message}`)
    }
  }

  // 取消报名
  static async cancel(activityId, userId) {
    const sql = 'DELETE FROM activity_participants WHERE activity_id = ? AND user_id = ?'
    
    try {
      const result = await query(sql, [activityId, userId])
      return result.affectedRows > 0
    } catch (error) {
      throw new Error(`取消报名失败: ${error.message}`)
    }
  }

  // 获取用户参与的活动
  static async getByUserId(userId, params = {}) {
    const { page = 1, limit = 10, status } = params

    let sql = `
      SELECT 
        ap.*,
        a.title as activity_title,
        a.start_time,
        a.end_time,
        a.location,
        c.name as club_name
      FROM activity_participants ap
      LEFT JOIN activities a ON ap.activity_id = a.id
      LEFT JOIN clubs c ON a.club_id = c.id
      WHERE ap.user_id = ?
    `
    const values = [userId]

    if (status) {
      sql += ' AND ap.status = ?'
      values.push(status)
    }

    // 添加分页
    const offset = (page - 1) * limit
    sql += ` ORDER BY ap.registration_time DESC LIMIT ? OFFSET ?`
    values.push(limit, offset)

    try {
      const activities = await query(sql, values)
      
      // 获取总数
      let countSql = `
        SELECT COUNT(*) as total
        FROM activity_participants ap
        WHERE ap.user_id = ?
      `
      const countValues = [userId]
      
      if (status) {
        countSql += ' AND ap.status = ?'
        countValues.push(status)
      }

      const countResult = await query(countSql, countValues)
      const total = countResult[0].total

      return {
        activities,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: parseInt(total)
        }
      }
    } catch (error) {
      throw new Error(`获取用户参与活动失败: ${error.message}`)
    }
  }

  // 获取活动参与人数
  static async getParticipantCount(activityId) {
    const sql = 'SELECT COUNT(*) as count FROM activity_participants WHERE activity_id = ?'
    
    try {
      const result = await query(sql, [activityId])
      return result[0].count
    } catch (error) {
      throw new Error(`获取参与人数失败: ${error.message}`)
    }
  }
}

module.exports = ActivityParticipant
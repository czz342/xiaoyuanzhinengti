const { query } = require('../config/database');

class ActivityParticipant {
  // 创建活动参与表
  static async createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS activity_participants (
        id INT AUTO_INCREMENT PRIMARY KEY,
        activity_id INT NOT NULL COMMENT '活动ID',
        user_id VARCHAR(50) NOT NULL COMMENT '用户ID',
        status ENUM('registered', 'attended', 'absent', 'cancelled') DEFAULT 'registered' COMMENT '参与状态',
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '报名时间',
        attended_at TIMESTAMP NULL COMMENT '实际参与时间',
        points_earned INT DEFAULT 0 COMMENT '获得积分',
        feedback TEXT COMMENT '用户反馈',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_participation (activity_id, user_id),
        INDEX idx_activity_id (activity_id),
        INDEX idx_user_id (user_id),
        INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;
    
    try {
      await query(sql);
      console.log('Activity participants table created successfully');
    } catch (error) {
      console.error('Error creating activity participants table:', error);
      throw error;
    }
  }

  // 参与活动
  static async join(activityId, userId) {
    const sql = `
      INSERT INTO activity_participants (activity_id, user_id, status) 
      VALUES (?, ?, 'registered')
    `;
    
    try {
      const result = await query(sql, [activityId, userId]);
      return { id: result.insertId, activity_id: activityId, user_id: userId };
    } catch (error) {
      console.error('Error joining activity:', error);
      throw error;
    }
  }

  // 取消参与
  static async cancel(activityId, userId) {
    const sql = `
      UPDATE activity_participants 
      SET status = 'cancelled' 
      WHERE activity_id = ? AND user_id = ? AND status = 'registered'
    `;
    
    try {
      const result = await query(sql, [activityId, userId]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error cancelling participation:', error);
      throw error;
    }
  }

  // 标记为已参与
  static async markAttended(activityId, userId, pointsEarned = 0) {
    const sql = `
      UPDATE activity_participants 
      SET status = 'attended', attended_at = NOW(), points_earned = ?
      WHERE activity_id = ? AND user_id = ? AND status = 'registered'
    `;
    
    try {
      const result = await query(sql, [pointsEarned, activityId, userId]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error marking as attended:', error);
      throw error;
    }
  }

  // 标记为缺席
  static async markAbsent(activityId, userId) {
    const sql = `
      UPDATE activity_participants 
      SET status = 'absent' 
      WHERE activity_id = ? AND user_id = ? AND status = 'registered'
    `;
    
    try {
      const result = await query(sql, [activityId, userId]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error marking as absent:', error);
      throw error;
    }
  }

  // 检查是否已参与
  static async isParticipating(activityId, userId) {
    const sql = `
      SELECT * FROM activity_participants 
      WHERE activity_id = ? AND user_id = ? AND status IN ('registered', 'attended')
    `;
    
    try {
      const rows = await query(sql, [activityId, userId]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error('Error checking participation:', error);
      throw error;
    }
  }

  // 获取用户参与的活动
  static async getUserActivities(userId, status = null) {
    let sql = `
      SELECT a.id, a.title, a.description, a.start_time, a.end_time, 
             a.location, a.points_reward, a.club_name, a.image_url,
             a.max_participants, a.current_participants, a.min_credibility,
             a.status, a.is_featured, a.created_at, a.updated_at,
             ap.status as user_participation, ap.joined_at
      FROM activity_participants ap
      JOIN activities a ON ap.activity_id = a.id
      WHERE ap.user_id = ?
    `;
    const values = [userId];

    if (status) {
      sql += ' AND ap.status = ?';
      values.push(status);
    }

    sql += ' ORDER BY ap.joined_at DESC';

    try {
      const rows = await query(sql, values);
      return rows;
    } catch (error) {
      console.error('Error getting user activities:', error);
      throw error;
    }
  }

  // 获取活动的参与者
  static async getActivityParticipants(activityId, status = null) {
    let sql = `
      SELECT ap.*, u.userName, u.picture
      FROM activity_participants ap
      LEFT JOIN users u ON ap.user_id = u.id
      WHERE ap.activity_id = ?
    `;
    const values = [activityId];

    if (status) {
      sql += ' AND ap.status = ?';
      values.push(status);
    }

    sql += ' ORDER BY ap.joined_at ASC';

    try {
      const rows = await query(sql, values);
      return rows;
    } catch (error) {
      console.error('Error getting activity participants:', error);
      throw error;
    }
  }

  // 获取用户参与统计
  static async getUserStats(userId) {
    const sql = `
      SELECT 
        COUNT(*) as total_participations,
        SUM(CASE WHEN status = 'attended' THEN 1 ELSE 0 END) as attended_count,
        SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END) as absent_count,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_count,
        SUM(points_earned) as total_points_earned
      FROM activity_participants 
      WHERE user_id = ?
    `;
    
    try {
      const rows = await query(sql, [userId]);
      return rows[0] || {
        total_participations: 0,
        attended_count: 0,
        absent_count: 0,
        cancelled_count: 0,
        total_points_earned: 0
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      throw error;
    }
  }

  // 删除参与记录
  static async delete(activityId, userId) {
    const sql = 'DELETE FROM activity_participants WHERE activity_id = ? AND user_id = ?';
    
    try {
      const result = await query(sql, [activityId, userId]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting participation:', error);
      throw error;
    }
  }
}

module.exports = ActivityParticipant;

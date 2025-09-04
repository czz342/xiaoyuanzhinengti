const { query } = require('../config/database');

class UserPoints {
  // 创建用户积分表
  static async createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS user_points (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id VARCHAR(50) NOT NULL COMMENT '用户ID',
        current_points INT DEFAULT 0 COMMENT '当前积分',
        semester_target INT DEFAULT 100 COMMENT '学期积分目标',
        earned_points INT DEFAULT 0 COMMENT '累计获得积分',
        last_earned_at TIMESTAMP NULL COMMENT '最后获得积分时间',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_user (user_id),
        INDEX idx_user_id (user_id),
        INDEX idx_current_points (current_points)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;
    
    try {
      await query(sql);
      console.log('User points table created successfully');
    } catch (error) {
      console.error('Error creating user points table:', error);
      throw error;
    }
  }

  // 初始化用户积分
  static async initUserPoints(userId, initialPoints = 50) {
    const sql = `
      INSERT INTO user_points (user_id, current_points, earned_points) 
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE 
      current_points = current_points, 
      earned_points = earned_points
    `;
    
    try {
      const result = await query(sql, [userId, initialPoints, initialPoints]);
      return { user_id: userId, current_points: initialPoints, earned_points: initialPoints };
    } catch (error) {
      console.error('Error initializing user points:', error);
      throw error;
    }
  }

  // 增加积分
  static async addPoints(userId, points, reason = '') {
    const sql = `
      UPDATE user_points 
      SET current_points = current_points + ?, 
          earned_points = earned_points + ?,
          last_earned_at = NOW()
      WHERE user_id = ?
    `;
    
    try {
      const result = await query(sql, [points, points, userId]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error adding points:', error);
      throw error;
    }
  }

  // 消耗积分
  static async spendPoints(userId, points) {
    const sql = `
      UPDATE user_points 
      SET current_points = current_points - ?
      WHERE user_id = ? AND current_points >= ?
    `;
    
    try {
      const result = await query(sql, [points, userId, points]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error spending points:', error);
      throw error;
    }
  }

  // 获取用户积分信息
  static async getUserPoints(userId) {
    const sql = 'SELECT * FROM user_points WHERE user_id = ?';
    
    try {
      const rows = await query(sql, [userId]);
      if (rows.length === 0) {
        // 如果用户没有积分记录，初始化
        await this.initUserPoints(userId);
        return await this.getUserPoints(userId);
      }
      return rows[0];
    } catch (error) {
      console.error('Error getting user points:', error);
      throw error;
    }
  }

  // 更新学期目标
  static async updateSemesterTarget(userId, target) {
    const sql = `
      UPDATE user_points 
      SET semester_target = ?
      WHERE user_id = ?
    `;
    
    try {
      const result = await query(sql, [target, userId]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating semester target:', error);
      throw error;
    }
  }

  // 获取积分排行榜
  static async getLeaderboard(limit = 10) {
    const sql = `
      SELECT up.*, u.userName, u.picture
      FROM user_points up
      LEFT JOIN users u ON up.user_id = u.id
      ORDER BY up.current_points DESC, up.earned_points DESC
      LIMIT ?
    `;
    
    try {
      const rows = await query(sql, [limit]);
      return rows;
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      throw error;
    }
  }

  // 获取用户排名
  static async getUserRank(userId) {
    const sql = `
      SELECT COUNT(*) + 1 as rank
      FROM user_points 
      WHERE current_points > (
        SELECT current_points 
        FROM user_points 
        WHERE user_id = ?
      )
    `;
    
    try {
      const rows = await query(sql, [userId]);
      return rows[0]?.rank || 1;
    } catch (error) {
      console.error('Error getting user rank:', error);
      throw error;
    }
  }

  // 检查是否达到学期目标
  static async checkSemesterTarget(userId) {
    const sql = `
      SELECT 
        current_points,
        semester_target,
        CASE 
          WHEN current_points >= semester_target THEN true 
          ELSE false 
        END as target_achieved
      FROM user_points 
      WHERE user_id = ?
    `;
    
    try {
      const rows = await query(sql, [userId]);
      return rows[0] || { current_points: 0, semester_target: 100, target_achieved: false };
    } catch (error) {
      console.error('Error checking semester target:', error);
      throw error;
    }
  }

  // 重置学期积分（新学期开始时）
  static async resetSemesterPoints() {
    const sql = `
      UPDATE user_points 
      SET current_points = 0, 
          earned_points = 0,
          semester_target = 100
    `;
    
    try {
      const result = await query(sql);
      return result.affectedRows;
    } catch (error) {
      console.error('Error resetting semester points:', error);
      throw error;
    }
  }

  // 获取积分统计
  static async getPointsStats() {
    const sql = `
      SELECT 
        COUNT(*) as total_users,
        AVG(current_points) as avg_points,
        MAX(current_points) as max_points,
        MIN(current_points) as min_points,
        COUNT(CASE WHEN current_points >= semester_target THEN 1 END) as target_achievers
      FROM user_points
    `;
    
    try {
      const rows = await query(sql);
      return rows[0] || {
        total_users: 0,
        avg_points: 0,
        max_points: 0,
        min_points: 0,
        target_achievers: 0
      };
    } catch (error) {
      console.error('Error getting points stats:', error);
      throw error;
    }
  }
}

module.exports = UserPoints;

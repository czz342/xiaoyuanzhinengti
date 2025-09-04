const { query } = require('../config/database');

class UserCredibility {
  // 创建用户诚信度表
  static async createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS user_credibility (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id VARCHAR(50) NOT NULL COMMENT '用户ID',
        credibility_score DECIMAL(3,2) DEFAULT 5.00 COMMENT '诚信度分数(0-10)',
        total_activities INT DEFAULT 0 COMMENT '总参与活动数',
        attended_activities INT DEFAULT 0 COMMENT '按时参与活动数',
        late_activities INT DEFAULT 0 COMMENT '迟到参与活动数',
        absent_activities INT DEFAULT 0 COMMENT '缺席活动数',
        cancelled_activities INT DEFAULT 0 COMMENT '取消参与活动数',
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_user (user_id),
        INDEX idx_user_id (user_id),
        INDEX idx_credibility_score (credibility_score)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;
    
    try {
      await query(sql);
      console.log('User credibility table created successfully');
    } catch (error) {
      console.error('Error creating user credibility table:', error);
      throw error;
    }
  }

  // 初始化用户诚信度
  static async initUserCredibility(userId) {
    const sql = `
      INSERT INTO user_credibility (user_id, credibility_score) 
      VALUES (?, 5.00)
      ON DUPLICATE KEY UPDATE 
      credibility_score = credibility_score
    `;
    
    try {
      const result = await query(sql, [userId]);
      return { user_id: userId, credibility_score: 5.00 };
    } catch (error) {
      console.error('Error initializing user credibility:', error);
      throw error;
    }
  }

  // 更新诚信度（基于参与行为）
  static async updateCredibility(userId, behavior) {
    // behavior: 'attended', 'late', 'absent', 'cancelled'
    const behaviorWeights = {
      'attended': 1.0,    // 按时参与 +1.0
      'late': 0.5,        // 迟到参与 +0.5
      'absent': -1.0,     // 缺席 -1.0
      'cancelled': -0.5   // 取消 -0.5
    };

    const weight = behaviorWeights[behavior] || 0;

    // 先更新统计数据
    const updateStatsSql = `
      UPDATE user_credibility 
      SET 
        total_activities = total_activities + 1,
        attended_activities = attended_activities + ${behavior === 'attended' ? 1 : 0},
        late_activities = late_activities + ${behavior === 'late' ? 1 : 0},
        absent_activities = absent_activities + ${behavior === 'absent' ? 1 : 0},
        cancelled_activities = cancelled_activities + ${behavior === 'cancelled' ? 1 : 0}
      WHERE user_id = ?
    `;

    try {
      await query(updateStatsSql, [userId]);

      // 重新计算诚信度分数
      const credibility = await this.calculateCredibility(userId);
      
      const updateScoreSql = `
        UPDATE user_credibility 
        SET credibility_score = ?
        WHERE user_id = ?
      `;
      
      await query(updateScoreSql, [credibility, userId]);
      
      return credibility;
    } catch (error) {
      console.error('Error updating credibility:', error);
      throw error;
    }
  }

  // 计算诚信度分数
  static async calculateCredibility(userId) {
    const sql = `
      SELECT 
        total_activities,
        attended_activities,
        late_activities,
        absent_activities,
        cancelled_activities
      FROM user_credibility 
      WHERE user_id = ?
    `;
    
    try {
      const rows = await query(sql, [userId]);
      if (rows.length === 0) {
        return 5.00; // 默认分数
      }

      const stats = rows[0];
      const { total_activities, attended_activities, late_activities, absent_activities, cancelled_activities } = stats;

      if (total_activities === 0) {
        return 5.00; // 没有参与记录，保持默认分数
      }

      // 计算基础分数：按时参与权重最高，迟到次之，缺席和取消降低分数
      const baseScore = (attended_activities * 1.0 + late_activities * 0.5 - absent_activities * 1.0 - cancelled_activities * 0.5) / total_activities;
      
      // 转换为0-10分制，基础分数范围是-1到1，映射到0-10
      const credibilityScore = Math.max(0, Math.min(10, (baseScore + 1) * 5));
      
      return Math.round(credibilityScore * 100) / 100; // 保留两位小数
    } catch (error) {
      console.error('Error calculating credibility:', error);
      return 5.00;
    }
  }

  // 获取用户诚信度信息
  static async getUserCredibility(userId) {
    const sql = 'SELECT * FROM user_credibility WHERE user_id = ?';
    
    try {
      const rows = await query(sql, [userId]);
      if (rows.length === 0) {
        // 如果用户没有诚信度记录，初始化
        await this.initUserCredibility(userId);
        return await this.getUserCredibility(userId);
      }
      return rows[0];
    } catch (error) {
      console.error('Error getting user credibility:', error);
      throw error;
    }
  }

  // 获取诚信度等级
  static getCredibilityLevel(score) {
    if (score >= 8.0) return { level: 'excellent', name: '优秀', color: '#00B578' };
    if (score >= 6.0) return { level: 'good', name: '良好', color: '#4cd964' };
    if (score >= 4.0) return { level: 'average', name: '一般', color: '#FF9500' };
    if (score >= 2.0) return { level: 'poor', name: '较差', color: '#FF3B30' };
    return { level: 'very_poor', name: '很差', color: '#8B0000' };
  }

  // 获取诚信度排行榜
  static async getCredibilityLeaderboard(limit = 10) {
    const sql = `
      SELECT uc.*, u.userName, u.picture
      FROM user_credibility uc
      LEFT JOIN users u ON uc.user_id = u.id
      WHERE uc.total_activities > 0
      ORDER BY uc.credibility_score DESC, uc.attended_activities DESC
      LIMIT ?
    `;
    
    try {
      const rows = await query(sql, [limit]);
      return rows.map(row => ({
        ...row,
        level: this.getCredibilityLevel(row.credibility_score)
      }));
    } catch (error) {
      console.error('Error getting credibility leaderboard:', error);
      throw error;
    }
  }

  // 获取用户排名
  static async getUserRank(userId) {
    const sql = `
      SELECT COUNT(*) + 1 as rank
      FROM user_credibility 
      WHERE credibility_score > (
        SELECT credibility_score 
        FROM user_credibility 
        WHERE user_id = ?
      ) AND total_activities > 0
    `;
    
    try {
      const rows = await query(sql, [userId]);
      return rows[0]?.rank || 1;
    } catch (error) {
      console.error('Error getting user rank:', error);
      throw error;
    }
  }

  // 检查是否可以参与活动（基于诚信度要求）
  static async canJoinActivity(userId, minCredibility) {
    const credibility = await this.getUserCredibility(userId);
    return credibility.credibility_score >= minCredibility;
  }

  // 获取诚信度统计
  static async getCredibilityStats() {
    const sql = `
      SELECT 
        COUNT(*) as total_users,
        AVG(credibility_score) as avg_credibility,
        MAX(credibility_score) as max_credibility,
        MIN(credibility_score) as min_credibility,
        COUNT(CASE WHEN credibility_score >= 8.0 THEN 1 END) as excellent_count,
        COUNT(CASE WHEN credibility_score >= 6.0 AND credibility_score < 8.0 THEN 1 END) as good_count,
        COUNT(CASE WHEN credibility_score >= 4.0 AND credibility_score < 6.0 THEN 1 END) as average_count,
        COUNT(CASE WHEN credibility_score < 4.0 THEN 1 END) as poor_count
      FROM user_credibility
      WHERE total_activities > 0
    `;
    
    try {
      const rows = await query(sql);
      return rows[0] || {
        total_users: 0,
        avg_credibility: 5.00,
        max_credibility: 5.00,
        min_credibility: 5.00,
        excellent_count: 0,
        good_count: 0,
        average_count: 0,
        poor_count: 0
      };
    } catch (error) {
      console.error('Error getting credibility stats:', error);
      throw error;
    }
  }

  // 重置诚信度（特殊情况使用）
  static async resetCredibility(userId) {
    const sql = `
      UPDATE user_credibility 
      SET 
        credibility_score = 5.00,
        total_activities = 0,
        attended_activities = 0,
        late_activities = 0,
        absent_activities = 0,
        cancelled_activities = 0
      WHERE user_id = ?
    `;
    
    try {
      const result = await query(sql, [userId]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error resetting credibility:', error);
      throw error;
    }
  }
}

module.exports = UserCredibility;

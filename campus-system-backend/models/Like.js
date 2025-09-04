const { query } = require('../config/database');

class Like {
  // 创建点赞表
  static async createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS likes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id VARCHAR(50) NOT NULL COMMENT '用户ID',
        target_type ENUM('post', 'comment') NOT NULL COMMENT '目标类型',
        target_id INT NOT NULL COMMENT '目标ID',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_like (user_id, target_type, target_id),
        INDEX idx_user_id (user_id),
        INDEX idx_target (target_type, target_id),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;
    
    try {
      await query(sql);
      console.log('Likes table created successfully');
    } catch (error) {
      console.error('Error creating likes table:', error);
      throw error;
    }
  }

  // 添加点赞
  static async create(likeData) {
    const sql = `
      INSERT INTO likes (user_id, target_type, target_id)
      VALUES (?, ?, ?)
    `;
    
    const values = [
      likeData.user_id,
      likeData.target_type,
      likeData.target_id
    ];

    try {
      const result = await query(sql, values);
      return result.insertId;
    } catch (error) {
      // 如果是重复点赞，返回null
      if (error.code === 'ER_DUP_ENTRY') {
        return null;
      }
      console.error('Error creating like:', error);
      throw error;
    }
  }

  // 取消点赞
  static async delete(userId, targetType, targetId) {
    const sql = `
      DELETE FROM likes 
      WHERE user_id = ? AND target_type = ? AND target_id = ?
    `;
    
    try {
      const result = await query(sql, [userId, targetType, targetId]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting like:', error);
      throw error;
    }
  }

  // 检查用户是否已点赞
  static async isLiked(userId, targetType, targetId) {
    const sql = `
      SELECT id FROM likes 
      WHERE user_id = ? AND target_type = ? AND target_id = ?
    `;
    
    try {
      const rows = await query(sql, [userId, targetType, targetId]);
      return rows.length > 0;
    } catch (error) {
      console.error('Error checking like status:', error);
      throw error;
    }
  }

  // 获取目标的点赞数
  static async getCount(targetType, targetId) {
    const sql = `
      SELECT COUNT(*) as count FROM likes 
      WHERE target_type = ? AND target_id = ?
    `;
    
    try {
      const rows = await query(sql, [targetType, targetId]);
      return rows[0].count;
    } catch (error) {
      console.error('Error getting like count:', error);
      throw error;
    }
  }

  // 获取用户的点赞列表
  static async getByUserId(userId, filters = {}) {
    let sql = `
      SELECT l.*, 
             CASE 
               WHEN l.target_type = 'post' THEN p.title
               WHEN l.target_type = 'comment' THEN c.content
             END as target_content,
             CASE 
               WHEN l.target_type = 'post' THEN p.category
               ELSE NULL
             END as target_category
      FROM likes l
      LEFT JOIN posts p ON l.target_type = 'post' AND l.target_id = p.id
      LEFT JOIN comments c ON l.target_type = 'comment' AND l.target_id = c.id
      WHERE l.user_id = ?
    `;
    const values = [userId];

    if (filters.target_type) {
      sql += ' AND l.target_type = ?';
      values.push(filters.target_type);
    }

    sql += ' ORDER BY l.created_at DESC';

    if (filters.limit) {
      sql += ' LIMIT ?';
      values.push(parseInt(filters.limit));
    }

    try {
      const rows = await query(sql, values);
      return rows;
    } catch (error) {
      console.error('Error getting likes by user id:', error);
      throw error;
    }
  }

  // 获取目标的点赞用户列表
  static async getLikedUsers(targetType, targetId, filters = {}) {
    let sql = `
      SELECT l.user_id, l.created_at,
             u.userName, u.picture
      FROM likes l
      LEFT JOIN users u ON l.user_id = u.studentId
      WHERE l.target_type = ? AND l.target_id = ?
    `;
    const values = [targetType, targetId];

    sql += ' ORDER BY l.created_at DESC';

    if (filters.limit) {
      sql += ' LIMIT ?';
      values.push(parseInt(filters.limit));
    }

    try {
      const rows = await query(sql, values);
      return rows;
    } catch (error) {
      console.error('Error getting liked users:', error);
      throw error;
    }
  }

  // 批量检查点赞状态
  static async batchCheckLiked(userId, targets) {
    if (targets.length === 0) return {};
    
    const conditions = targets.map(() => '(target_type = ? AND target_id = ?)').join(' OR ');
    const values = [];
    
    targets.forEach(target => {
      values.push(target.type, target.id);
    });
    values.push(userId);

    const sql = `
      SELECT target_type, target_id FROM likes 
      WHERE (${conditions}) AND user_id = ?
    `;
    
    try {
      const rows = await query(sql, values);
      const result = {};
      
      rows.forEach(row => {
        const key = `${row.target_type}_${row.target_id}`;
        result[key] = true;
      });
      
      return result;
    } catch (error) {
      console.error('Error batch checking likes:', error);
      throw error;
    }
  }

  // 获取点赞统计
  static async getStats(userId) {
    const sql = `
      SELECT 
        target_type,
        COUNT(*) as count
      FROM likes 
      WHERE user_id = ?
      GROUP BY target_type
    `;
    
    try {
      const rows = await query(sql, [userId]);
      const stats = { post: 0, comment: 0 };
      
      rows.forEach(row => {
        stats[row.target_type] = row.count;
      });
      
      return stats;
    } catch (error) {
      console.error('Error getting like stats:', error);
      throw error;
    }
  }
}

module.exports = Like;

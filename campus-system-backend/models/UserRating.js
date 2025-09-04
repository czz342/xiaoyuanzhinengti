const { db } = require('../config/database');

class UserRating {
  // 创建用户评分表
  static async createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS user_ratings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        rater_id INT NOT NULL,
        rated_user_id INT NOT NULL,
        rating DECIMAL(2,1) NOT NULL CHECK (rating >= 1.0 AND rating <= 5.0),
        comment TEXT,
        created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES errand_orders(id) ON DELETE CASCADE,
        FOREIGN KEY (rater_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (rated_user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_order_rating (order_id, rater_id, rated_user_id),
        INDEX idx_order_id (order_id),
        INDEX idx_rater_id (rater_id),
        INDEX idx_rated_user_id (rated_user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;
    
    try {
      await db.execute(sql);
      console.log('✅ 用户评分表创建成功');
    } catch (error) {
      console.error('❌ 用户评分表创建失败:', error.message);
      throw error;
    }
  }

  // 创建评分记录
  static async create(ratingData) {
    const { order_id, rater_id, rated_user_id, rating, comment } = ratingData;
    
    const sql = `
      INSERT INTO user_ratings (order_id, rater_id, rated_user_id, rating, comment)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    try {
      const result = await db.execute(sql, [order_id, rater_id, rated_user_id, rating, comment]);
      return { id: result.insertId, ...ratingData };
    } catch (error) {
      console.error('❌ 评分记录创建失败:', error.message);
      throw error;
    }
  }

  // 根据订单ID获取评分记录
  static async getByOrderId(orderId) {
    const sql = `
      SELECT ur.*, 
             u1.displayName as rater_name, u1.picture as rater_avatar,
             u2.displayName as rated_user_name, u2.picture as rated_user_avatar
      FROM user_ratings ur
      JOIN users u1 ON ur.rater_id = u1.id
      JOIN users u2 ON ur.rated_user_id = u2.id
      WHERE ur.order_id = ?
      ORDER BY ur.created_time DESC
    `;
    
    try {
      const rows = await db.execute(sql, [orderId]);
      return rows;
    } catch (error) {
      console.error('❌ 获取订单评分失败:', error.message);
      throw error;
    }
  }

  // 根据用户ID获取收到的评分
  static async getReceivedRatings(userId, limit = 10, offset = 0) {
    const sql = `
      SELECT ur.*, 
             u.displayName as rater_name, u.picture as rater_avatar,
             eo.title as order_title
      FROM user_ratings ur
      JOIN users u ON ur.rater_id = u.id
      JOIN errand_orders eo ON ur.order_id = eo.id
      WHERE ur.rated_user_id = ?
      ORDER BY ur.created_time DESC
      LIMIT ? OFFSET ?
    `;
    
    try {
      const rows = await db.execute(sql, [userId, limit, offset]);
      return rows;
    } catch (error) {
      console.error('❌ 获取用户收到的评分失败:', error.message);
      throw error;
    }
  }

  // 根据用户ID获取发出的评分
  static async getGivenRatings(userId, limit = 10, offset = 0) {
    const sql = `
      SELECT ur.*, 
             u.displayName as rated_user_name, u.picture as rated_user_avatar,
             eo.title as order_title
      FROM user_ratings ur
      JOIN users u ON ur.rated_user_id = u.id
      JOIN errand_orders eo ON ur.order_id = eo.id
      WHERE ur.rater_id = ?
      ORDER BY ur.created_time DESC
      LIMIT ? OFFSET ?
    `;
    
    try {
      const rows = await db.execute(sql, [userId, limit, offset]);
      return rows;
    } catch (error) {
      console.error('❌ 获取用户发出的评分失败:', error.message);
      throw error;
    }
  }

  // 检查用户是否已对订单中的特定用户评分
  static async hasRated(orderId, raterId, ratedUserId) {
    const sql = 'SELECT COUNT(*) as count FROM user_ratings WHERE order_id = ? AND rater_id = ? AND rated_user_id = ?';
    
    try {
      const rows = await db.execute(sql, [orderId, raterId, ratedUserId]);
      return rows[0].count > 0;
    } catch (error) {
      console.error('❌ 检查评分状态失败:', error.message);
      throw error;
    }
  }

  // 获取用户的平均评分
  static async getAverageRating(userId) {
    const sql = 'SELECT AVG(rating) as avg_rating, COUNT(*) as rating_count FROM user_ratings WHERE rated_user_id = ?';
    
    try {
      const rows = await db.execute(sql, [userId]);
      return {
        averageRating: rows[0].avg_rating || 0,
        ratingCount: rows[0].rating_count || 0
      };
    } catch (error) {
      console.error('❌ 获取用户平均评分失败:', error.message);
      throw error;
    }
  }
}

module.exports = UserRating;

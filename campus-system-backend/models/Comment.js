const { query } = require('../config/database');

class Comment {
  // 创建评论表
  static async createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS comments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        post_id INT NOT NULL COMMENT '帖子ID',
        user_id VARCHAR(50) NOT NULL COMMENT '评论者ID',
        user_name VARCHAR(100) NOT NULL COMMENT '评论者姓名',
        user_avatar VARCHAR(500) COMMENT '评论者头像',
        content TEXT NOT NULL COMMENT '评论内容',
        parent_id INT DEFAULT NULL COMMENT '父评论ID（回复）',
        like_count INT DEFAULT 0 COMMENT '点赞数',
        status ENUM('published', 'deleted') DEFAULT 'published' COMMENT '评论状态',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_post_id (post_id),
        INDEX idx_user_id (user_id),
        INDEX idx_parent_id (parent_id),
        INDEX idx_created_at (created_at),
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;
    
    try {
      await query(sql);
      console.log('Comments table created successfully');
    } catch (error) {
      console.error('Error creating comments table:', error);
      throw error;
    }
  }

  // 创建评论
  static async create(commentData) {
    const sql = `
      INSERT INTO comments (
        post_id, user_id, user_name, user_avatar, content, parent_id, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      commentData.post_id,
      commentData.user_id,
      commentData.user_name,
      commentData.user_avatar,
      commentData.content,
      commentData.parent_id || null,
      commentData.status || 'published'
    ];

    try {
      const result = await query(sql, values);
      return result.insertId;
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  }

  // 获取帖子的评论列表
  static async getByPostId(postId, filters = {}) {
    let sql = `
      SELECT * FROM comments 
      WHERE post_id = ? AND status = 'published'
    `;
    const values = [postId];

    // 排序
    const sortBy = filters.sort_by || 'created_at';
    const sortOrder = filters.sort_order || 'ASC';
    sql += ` ORDER BY ${sortBy} ${sortOrder}`;

    // 分页
    if (filters.limit) {
      sql += ' LIMIT ?';
      values.push(parseInt(filters.limit));
      
      if (filters.offset) {
        sql += ' OFFSET ?';
        values.push(parseInt(filters.offset));
      }
    }

    try {
      const rows = await query(sql, values);
      return rows;
    } catch (error) {
      console.error('Error getting comments by post id:', error);
      throw error;
    }
  }

  // 根据ID获取评论
  static async getById(id) {
    const sql = 'SELECT * FROM comments WHERE id = ? AND status != "deleted"';
    
    try {
      const rows = await query(sql, [id]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error('Error getting comment by id:', error);
      throw error;
    }
  }

  // 更新评论
  static async update(id, updateData) {
    const fields = [];
    const values = [];

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(updateData[key]);
      }
    });

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(id);
    const sql = `UPDATE comments SET ${fields.join(', ')} WHERE id = ?`;

    try {
      const result = await query(sql, values);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating comment:', error);
      throw error;
    }
  }

  // 删除评论（软删除）
  static async delete(id) {
    const sql = 'UPDATE comments SET status = "deleted" WHERE id = ?';
    
    try {
      const result = await query(sql, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }

  // 更新点赞数
  static async updateLikeCount(id, increment) {
    const sql = increment > 0 
      ? 'UPDATE comments SET like_count = like_count + 1 WHERE id = ?'
      : 'UPDATE comments SET like_count = GREATEST(like_count - 1, 0) WHERE id = ?';
    
    try {
      await query(sql, [id]);
    } catch (error) {
      console.error('Error updating comment like count:', error);
      throw error;
    }
  }

  // 获取用户的评论列表
  static async getByUserId(userId, filters = {}) {
    let sql = `
      SELECT c.*, p.title as post_title, p.category as post_category
      FROM comments c
      JOIN posts p ON c.post_id = p.id
      WHERE c.user_id = ? AND c.status = 'published'
    `;
    const values = [userId];

    sql += ' ORDER BY c.created_at DESC';

    if (filters.limit) {
      sql += ' LIMIT ?';
      values.push(parseInt(filters.limit));
    }

    try {
      const rows = await query(sql, values);
      return rows;
    } catch (error) {
      console.error('Error getting comments by user id:', error);
      throw error;
    }
  }

  // 获取评论的回复列表
  static async getReplies(commentId, filters = {}) {
    let sql = `
      SELECT * FROM comments 
      WHERE parent_id = ? AND status = 'published'
    `;
    const values = [commentId];

    sql += ' ORDER BY created_at ASC';

    if (filters.limit) {
      sql += ' LIMIT ?';
      values.push(parseInt(filters.limit));
    }

    try {
      const rows = await query(sql, values);
      return rows;
    } catch (error) {
      console.error('Error getting comment replies:', error);
      throw error;
    }
  }

  // 获取评论统计
  static async getStats(postId) {
    const sql = `
      SELECT 
        COUNT(*) as total_comments,
        COUNT(CASE WHEN parent_id IS NULL THEN 1 END) as top_level_comments,
        COUNT(CASE WHEN parent_id IS NOT NULL THEN 1 END) as replies
      FROM comments 
      WHERE post_id = ? AND status = 'published'
    `;
    
    try {
      const rows = await query(sql, [postId]);
      return rows[0];
    } catch (error) {
      console.error('Error getting comment stats:', error);
      throw error;
    }
  }
}

module.exports = Comment;

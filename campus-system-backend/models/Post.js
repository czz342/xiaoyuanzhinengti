const { query } = require('../config/database');

class Post {
  static parseImagesField(raw) {
    if (!raw) return [];
    // 如果已经是数组，直接返回
    if (Array.isArray(raw)) return raw;
    // 可能是Buffer或对象
    if (typeof raw === 'object') {
      try {
        // MySQL JSON 列可能已被驱动解析为对象
        return Array.isArray(raw) ? raw : [raw];
      } catch (_) {
        return [];
      }
    }
    // 字符串情况
    if (typeof raw === 'string') {
      const trimmed = raw.trim();
      if (!trimmed) return [];
      // 如果是JSON数组/对象字符串，尝试解析
      if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
        try {
          const parsed = JSON.parse(trimmed);
          return Array.isArray(parsed) ? parsed : [parsed];
        } catch (_) {
          // 解析失败则按单个URL处理
          return [trimmed];
        }
      }
      // 纯URL或逗号分隔
      if (trimmed.includes(',')) {
        return trimmed
          .split(',')
          .map(s => s.trim())
          .filter(Boolean);
      }
      return [trimmed];
    }
    return [];
  }
  // 创建帖子表
  static async createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(200) NOT NULL COMMENT '帖子标题',
        content TEXT NOT NULL COMMENT '帖子内容',
        category ENUM('second_hand', 'dating', 'help', 'part_time', 'gossip') NOT NULL COMMENT '帖子分类',
        author_id VARCHAR(50) NOT NULL COMMENT '作者ID',
        author_name VARCHAR(100) NOT NULL COMMENT '作者姓名',
        author_avatar VARCHAR(500) COMMENT '作者头像',
        images JSON COMMENT '图片URLs',
        allow_comments BOOLEAN DEFAULT TRUE COMMENT '是否允许评论',
        status ENUM('draft', 'published', 'deleted', 'pending') DEFAULT 'published' COMMENT '帖子状态',
        view_count INT DEFAULT 0 COMMENT '浏览数',
        like_count INT DEFAULT 0 COMMENT '点赞数',
        comment_count INT DEFAULT 0 COMMENT '评论数',
        is_featured BOOLEAN DEFAULT FALSE COMMENT '是否推荐',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_category (category),
        INDEX idx_author (author_id),
        INDEX idx_status (status),
        INDEX idx_created_at (created_at),
        INDEX idx_featured (is_featured)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;
    
    try {
      await query(sql);
      console.log('Posts table created successfully');
    } catch (error) {
      console.error('Error creating posts table:', error);
      throw error;
    }
  }

  // 创建帖子
  static async create(postData) {
    const sql = `
      INSERT INTO posts (
        title, content, category, author_id, author_name, author_avatar,
        images, allow_comments, status, is_featured
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      postData.title,
      postData.content,
      postData.category,
      postData.author_id,
      postData.author_name,
      postData.author_avatar,
      JSON.stringify(postData.images || []),
      postData.allow_comments !== false,
      postData.status || 'published',
      postData.is_featured || false
    ];

    try {
      const result = await query(sql, values);
      return result.insertId;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }

  // 获取帖子列表
  static async list(filters = {}) {
    let sql = `
      SELECT * FROM posts 
      WHERE status = 'published'
    `;
    const values = [];

    // 添加筛选条件
    if (filters.category) {
      sql += ' AND category = ?';
      values.push(filters.category);
    }

    if (filters.author_id) {
      sql += ' AND author_id = ?';
      values.push(filters.author_id);
    }

    if (filters.keyword) {
      sql += ' AND (title LIKE ? OR content LIKE ?)';
      const keyword = `%${filters.keyword}%`;
      values.push(keyword, keyword);
    }

    if (filters.is_featured) {
      sql += ' AND is_featured = ?';
      values.push(filters.is_featured);
    }

    // 排序
    const sortBy = filters.sort_by || 'created_at';
    const sortOrder = filters.sort_order || 'DESC';
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
      return rows.map(row => ({
        ...row,
        images: Post.parseImagesField(row.images)
      }));
    } catch (error) {
      console.error('Error getting posts list:', error);
      throw error;
    }
  }

  // 根据ID获取帖子
  static async getById(id) {
    const sql = 'SELECT * FROM posts WHERE id = ? AND status != "deleted"';
    
    try {
      const rows = await query(sql, [id]);
      if (rows.length === 0) {
        return null;
      }
      
      const post = rows[0];
      return {
        ...post,
        images: Post.parseImagesField(post.images)
      };
    } catch (error) {
      console.error('Error getting post by id:', error);
      throw error;
    }
  }

  // 更新帖子
  static async update(id, updateData) {
    const fields = [];
    const values = [];

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        if (key === 'images') {
          fields.push(`${key} = ?`);
          values.push(JSON.stringify(updateData[key]));
        } else {
          fields.push(`${key} = ?`);
          values.push(updateData[key]);
        }
      }
    });

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(id);
    const sql = `UPDATE posts SET ${fields.join(', ')} WHERE id = ?`;

    try {
      const result = await query(sql, values);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  }

  // 删除帖子（软删除）
  static async delete(id) {
    const sql = 'UPDATE posts SET status = "deleted" WHERE id = ?';
    
    try {
      const result = await query(sql, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  }

  // 增加浏览数
  static async incrementViewCount(id) {
    const sql = 'UPDATE posts SET view_count = view_count + 1 WHERE id = ?';
    
    try {
      await query(sql, [id]);
    } catch (error) {
      console.error('Error incrementing view count:', error);
      throw error;
    }
  }

  // 更新点赞数
  static async updateLikeCount(id, increment) {
    const sql = increment > 0 
      ? 'UPDATE posts SET like_count = like_count + 1 WHERE id = ?'
      : 'UPDATE posts SET like_count = GREATEST(like_count - 1, 0) WHERE id = ?';
    
    try {
      await query(sql, [id]);
    } catch (error) {
      console.error('Error updating like count:', error);
      throw error;
    }
  }

  // 更新评论数
  static async updateCommentCount(id, increment) {
    const sql = increment > 0 
      ? 'UPDATE posts SET comment_count = comment_count + 1 WHERE id = ?'
      : 'UPDATE posts SET comment_count = GREATEST(comment_count - 1, 0) WHERE id = ?';
    
    try {
      await query(sql, [id]);
    } catch (error) {
      console.error('Error updating comment count:', error);
      throw error;
    }
  }

  // 搜索帖子
  static async search(keyword, filters = {}) {
    let sql = `
      SELECT * FROM posts 
      WHERE status = 'published' 
      AND (title LIKE ? OR content LIKE ?)
    `;
    const values = [`%${keyword}%`, `%${keyword}%`];

    if (filters.category) {
      sql += ' AND category = ?';
      values.push(filters.category);
    }

    sql += ' ORDER BY created_at DESC';

    if (filters.limit) {
      sql += ' LIMIT ?';
      values.push(parseInt(filters.limit));
    }

    try {
      const rows = await query(sql, values);
      return rows.map(row => ({
        ...row,
        images: Post.parseImagesField(row.images)
      }));
    } catch (error) {
      console.error('Error searching posts:', error);
      throw error;
    }
  }

  // 获取分类统计
  static async getCategoryStats() {
    const sql = `
      SELECT category, COUNT(*) as count 
      FROM posts 
      WHERE status = 'published' 
      GROUP BY category
    `;
    
    try {
      const rows = await query(sql);
      return rows;
    } catch (error) {
      console.error('Error getting category stats:', error);
      throw error;
    }
  }
}

module.exports = Post;

const { query } = require('../config/database');

class Activity {
  // 创建活动表
  static async createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS activities (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(200) NOT NULL COMMENT '活动标题',
        description TEXT COMMENT '活动描述',
        image_url VARCHAR(500) COMMENT '活动图片',
        club_id INT COMMENT '发布社团ID',
        club_name VARCHAR(100) COMMENT '社团名称',
        start_time DATETIME NOT NULL COMMENT '开始时间',
        end_time DATETIME NOT NULL COMMENT '结束时间',
        location VARCHAR(200) COMMENT '活动地点',
        max_participants INT DEFAULT 0 COMMENT '最大参与人数',
        current_participants INT DEFAULT 0 COMMENT '当前参与人数',
        points_reward INT DEFAULT 0 COMMENT '积分奖励',
        min_credibility DECIMAL(3,2) DEFAULT 0.00 COMMENT '最低诚信度要求',
        status ENUM('draft', 'published', 'cancelled', 'completed') DEFAULT 'draft' COMMENT '活动状态',
        is_featured BOOLEAN DEFAULT FALSE COMMENT '是否推荐',
        created_by VARCHAR(50) NOT NULL COMMENT '创建者ID',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_status (status),
        INDEX idx_start_time (start_time),
        INDEX idx_club_id (club_id),
        INDEX idx_featured (is_featured)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;
    
    try {
      await query(sql);
      console.log('Activities table created successfully');
    } catch (error) {
      console.error('Error creating activities table:', error);
      throw error;
    }
  }

  // 创建活动
  static async create(activityData) {
    const sql = `
      INSERT INTO activities (
        title, description, image_url, club_id, club_name, start_time, end_time,
        location, max_participants, points_reward, min_credibility, status, is_featured, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      activityData.title,
      activityData.description || null,
      activityData.image_url || null,
      activityData.club_id || null,
      activityData.club_name || null,
      activityData.start_time,
      activityData.end_time,
      activityData.location || null,
      activityData.max_participants || 0,
      activityData.points_reward || 0,
      activityData.min_credibility || 0.00,
      activityData.status || 'published',
      activityData.is_featured || false,
      activityData.created_by
    ];

    try {
      const result = await query(sql, values);
      return { id: result.insertId, ...activityData };
    } catch (error) {
      console.error('Error creating activity:', error);
      throw error;
    }
  }

  // 获取活动列表
  static async list(filters = {}) {
    let sql = `
      SELECT * FROM activities 
      WHERE status = 'published'
    `;
    const values = [];

    // 添加筛选条件
    if (filters.club_id) {
      sql += ' AND club_id = ?';
      values.push(filters.club_id);
    }

    if (filters.is_featured) {
      sql += ' AND is_featured = ?';
      values.push(filters.is_featured);
    }

    if (filters.status) {
      sql += ' AND status = ?';
      values.push(filters.status);
    }

    if (filters.start_date) {
      sql += ' AND start_time >= ?';
      values.push(filters.start_date);
    }

    if (filters.end_date) {
      sql += ' AND start_time <= ?';
      values.push(filters.end_date);
    }

    // 排序
    if (filters.sort_by === 'start_time') {
      sql += ' ORDER BY start_time ASC';
    } else if (filters.sort_by === 'points') {
      sql += ' ORDER BY points_reward DESC';
    } else {
      sql += ' ORDER BY is_featured DESC, created_at DESC';
    }

    // 分页
    if (filters.limit) {
      sql += ' LIMIT ?';
      values.push(filters.limit);
      
      if (filters.offset) {
        sql += ' OFFSET ?';
        values.push(filters.offset);
      }
    }

    try {
      const rows = await query(sql, values);
      return rows;
    } catch (error) {
      console.error('Error listing activities:', error);
      throw error;
    }
  }

  // 根据ID获取活动详情
  static async findById(id) {
    const sql = 'SELECT * FROM activities WHERE id = ?';
    
    try {
      const rows = await query(sql, [id]);
      return rows[0] || null;
    } catch (error) {
      console.error('Error finding activity by ID:', error);
      throw error;
    }
  }

  // 更新活动
  static async update(id, updateData) {
    const allowedFields = [
      'title', 'description', 'image_url', 'start_time', 'end_time',
      'location', 'max_participants', 'points_reward', 'min_credibility',
      'status', 'is_featured'
    ];
    const updates = [];
    const values = [];

    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(updateData[field]);
      }
    });

    if (updates.length === 0) {
      throw new Error('No valid fields to update');
    }

    values.push(id);
    const sql = `UPDATE activities SET ${updates.join(', ')} WHERE id = ?`;

    try {
      const result = await query(sql, values);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating activity:', error);
      throw error;
    }
  }

  // 更新参与人数
  static async updateParticipantCount(id, change) {
    const sql = `
      UPDATE activities 
      SET current_participants = current_participants + ? 
      WHERE id = ?
    `;
    
    try {
      const result = await query(sql, [change, id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating participant count:', error);
      throw error;
    }
  }

  // 删除活动
  static async delete(id) {
    const sql = 'DELETE FROM activities WHERE id = ?';
    
    try {
      const result = await query(sql, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting activity:', error);
      throw error;
    }
  }

  // 获取推荐活动（轮播图用）
  static async getFeatured() {
    const sql = `
      SELECT * FROM activities 
      WHERE status = 'published' AND is_featured = true 
      ORDER BY created_at DESC 
      LIMIT 5
    `;
    
    try {
      const rows = await query(sql);
      return rows;
    } catch (error) {
      console.error('Error getting featured activities:', error);
      throw error;
    }
  }

  // 搜索活动
  static async search(keyword, filters = {}) {
    let sql = `
      SELECT * FROM activities 
      WHERE status = 'published' 
      AND (title LIKE ? OR description LIKE ? OR club_name LIKE ?)
    `;
    const values = [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`];

    // 添加其他筛选条件
    if (filters.club_id) {
      sql += ' AND club_id = ?';
      values.push(filters.club_id);
    }

    sql += ' ORDER BY is_featured DESC, created_at DESC';

    if (filters.limit) {
      sql += ' LIMIT ?';
      values.push(filters.limit);
    }

    try {
      const rows = await query(sql, values);
      return rows;
    } catch (error) {
      console.error('Error searching activities:', error);
      throw error;
    }
  }
}

module.exports = Activity;

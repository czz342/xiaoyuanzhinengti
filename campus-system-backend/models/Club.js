const { query } = require('../config/database');

class Club {
  // 创建社团表
  static async createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS clubs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL COMMENT '社团名称',
        description TEXT COMMENT '社团描述',
        category VARCHAR(50) NOT NULL COMMENT '社团类别',
        logo_url VARCHAR(500) COMMENT '社团Logo',
        leader_id INT COMMENT '社长ID',
        leader_name VARCHAR(50) COMMENT '社长姓名',
        leader_phone VARCHAR(20) COMMENT '社长电话',
        member_count INT DEFAULT 0 COMMENT '成员数量',
        activity_count INT DEFAULT 0 COMMENT '活动数量',
        level ENUM('A', 'B', 'C') DEFAULT 'C' COMMENT '社团等级',
        status ENUM('active', 'inactive', 'suspended') DEFAULT 'active' COMMENT '社团状态',
        established_date DATE COMMENT '成立日期',
        contact_email VARCHAR(100) COMMENT '联系邮箱',
        contact_phone VARCHAR(20) COMMENT '联系电话',
        meeting_place VARCHAR(200) COMMENT '活动地点',
        meeting_time VARCHAR(100) COMMENT '活动时间',
        requirements TEXT COMMENT '入社要求',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_category (category),
        INDEX idx_status (status),
        INDEX idx_level (level),
        INDEX idx_leader_id (leader_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;
    
    try {
      await query(sql);
      console.log('Clubs table created successfully');
    } catch (error) {
      console.error('Error creating clubs table:', error);
      throw error;
    }
  }

  // 创建社团
  static async create(clubData) {
    const sql = `
      INSERT INTO clubs (
        name, description, category, logo_url, leader_id, leader_name, 
        leader_phone, established_date, contact_email, contact_phone, 
        meeting_place, meeting_time, requirements
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      clubData.name,
      clubData.description || null,
      clubData.category,
      clubData.logo_url || null,
      clubData.leader_id || null,
      clubData.leader_name || null,
      clubData.leader_phone || null,
      clubData.established_date || null,
      clubData.contact_email || null,
      clubData.contact_phone || null,
      clubData.meeting_place || null,
      clubData.meeting_time || null,
      clubData.requirements || null
    ];

    try {
      const result = await query(sql, values);
      return { id: result.insertId, ...clubData };
    } catch (error) {
      console.error('Error creating club:', error);
      throw error;
    }
  }

  // 获取社团列表
  static async list(filters = {}) {
    let sql = 'SELECT * FROM clubs WHERE 1=1';
    const values = [];

    // 添加筛选条件
    if (filters.category) {
      sql += ' AND category = ?';
      values.push(filters.category);
    }

    if (filters.status) {
      sql += ' AND status = ?';
      values.push(filters.status);
    }

    if (filters.level) {
      sql += ' AND level = ?';
      values.push(filters.level);
    }

    if (filters.keyword) {
      sql += ' AND (name LIKE ? OR description LIKE ?)';
      values.push(`%${filters.keyword}%`, `%${filters.keyword}%`);
    }

    // 排序
    if (filters.sort_by === 'member_count') {
      sql += ' ORDER BY member_count DESC';
    } else if (filters.sort_by === 'activity_count') {
      sql += ' ORDER BY activity_count DESC';
    } else if (filters.sort_by === 'level') {
      sql += ' ORDER BY level ASC';
    } else {
      sql += ' ORDER BY created_at DESC';
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
      console.error('Error listing clubs:', error);
      throw error;
    }
  }

  // 根据ID获取社团详情
  static async findById(id) {
    const sql = 'SELECT * FROM clubs WHERE id = ?';
    
    try {
      const rows = await query(sql, [id]);
      return rows[0] || null;
    } catch (error) {
      console.error('Error finding club by ID:', error);
      throw error;
    }
  }

  // 更新社团
  static async update(id, updateData) {
    const allowedFields = [
      'name', 'description', 'category', 'logo_url', 'leader_id', 'leader_name',
      'leader_phone', 'established_date', 'contact_email', 'contact_phone',
      'meeting_place', 'meeting_time', 'requirements', 'level', 'status'
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
    const sql = `UPDATE clubs SET ${updates.join(', ')} WHERE id = ?`;

    try {
      const result = await query(sql, values);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating club:', error);
      throw error;
    }
  }

  // 更新成员数量
  static async updateMemberCount(id, change) {
    const sql = `
      UPDATE clubs 
      SET member_count = member_count + ? 
      WHERE id = ?
    `;
    
    try {
      const result = await query(sql, [change, id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating member count:', error);
      throw error;
    }
  }

  // 更新活动数量
  static async updateActivityCount(id, change) {
    const sql = `
      UPDATE clubs 
      SET activity_count = activity_count + ? 
      WHERE id = ?
    `;
    
    try {
      const result = await query(sql, [change, id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating activity count:', error);
      throw error;
    }
  }

  // 删除社团
  static async delete(id) {
    const sql = 'DELETE FROM clubs WHERE id = ?';
    
    try {
      const result = await query(sql, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting club:', error);
      throw error;
    }
  }

  // 获取社团统计信息
  static async getStats() {
    const sql = `
      SELECT 
        COUNT(*) as total_clubs,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_clubs,
        SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) as inactive_clubs,
        SUM(CASE WHEN status = 'suspended' THEN 1 ELSE 0 END) as suspended_clubs,
        SUM(member_count) as total_members,
        SUM(activity_count) as total_activities,
        AVG(member_count) as avg_members_per_club,
        AVG(activity_count) as avg_activities_per_club
      FROM clubs
    `;
    
    try {
      const rows = await query(sql);
      return rows[0] || {};
    } catch (error) {
      console.error('Error getting club stats:', error);
      throw error;
    }
  }

  // 按类别统计社团
  static async getCategoryStats() {
    const sql = `
      SELECT 
        category,
        COUNT(*) as count,
        SUM(member_count) as total_members,
        SUM(activity_count) as total_activities
      FROM clubs 
      WHERE status = 'active'
      GROUP BY category
      ORDER BY count DESC
    `;
    
    try {
      const rows = await query(sql);
      return rows;
    } catch (error) {
      console.error('Error getting category stats:', error);
      throw error;
    }
  }

  // 获取热门社团（按成员数）
  static async getPopularClubs(limit = 10) {
    const sql = `
      SELECT * FROM clubs 
      WHERE status = 'active'
      ORDER BY member_count DESC 
      LIMIT ?
    `;
    
    try {
      const rows = await query(sql, [limit]);
      return rows;
    } catch (error) {
      console.error('Error getting popular clubs:', error);
      throw error;
    }
  }

  // 搜索社团
  static async search(keyword, filters = {}) {
    let sql = `
      SELECT * FROM clubs 
      WHERE (name LIKE ? OR description LIKE ? OR category LIKE ?)
    `;
    const values = [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`];

    // 添加其他筛选条件
    if (filters.status) {
      sql += ' AND status = ?';
      values.push(filters.status);
    }

    sql += ' ORDER BY member_count DESC';

    if (filters.limit) {
      sql += ' LIMIT ?';
      values.push(filters.limit);
    }

    try {
      const rows = await query(sql, values);
      return rows;
    } catch (error) {
      console.error('Error searching clubs:', error);
      throw error;
    }
  }
}

module.exports = Club;


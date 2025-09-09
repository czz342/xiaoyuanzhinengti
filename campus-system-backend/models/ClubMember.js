const { query } = require('../config/database');

class ClubMember {
  // 创建社团成员表
  static async createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS club_members (
        id INT AUTO_INCREMENT PRIMARY KEY,
        club_id INT NOT NULL COMMENT '社团ID',
        user_id VARCHAR(50) NOT NULL COMMENT '用户ID',
        user_name VARCHAR(50) NOT NULL COMMENT '用户姓名',
        role ENUM('member', 'vice_leader', 'leader') DEFAULT 'member' COMMENT '角色',
        join_date DATE NOT NULL COMMENT '加入日期',
        status ENUM('active', 'inactive', 'expelled') DEFAULT 'active' COMMENT '状态',
        contribution_score INT DEFAULT 0 COMMENT '贡献积分',
        last_activity_date DATE COMMENT '最后活动日期',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_club_user (club_id, user_id),
        INDEX idx_club_id (club_id),
        INDEX idx_user_id (user_id),
        INDEX idx_role (role),
        INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;
    
    try {
      await query(sql);
      console.log('Club members table created successfully');
    } catch (error) {
      console.error('Error creating club members table:', error);
      throw error;
    }
  }

  // 加入社团
  static async join(clubId, userId, userName, role = 'member') {
    const sql = `
      INSERT INTO club_members (club_id, user_id, user_name, role, join_date)
      VALUES (?, ?, ?, ?, CURDATE())
    `;
    
    try {
      const result = await query(sql, [clubId, userId, userName, role]);
      
      // 更新社团成员数量
      await query('UPDATE clubs SET member_count = member_count + 1 WHERE id = ?', [clubId]);
      
      return { id: result.insertId, club_id: clubId, user_id: userId, user_name: userName, role };
    } catch (error) {
      console.error('Error joining club:', error);
      throw error;
    }
  }

  // 退出社团
  static async leave(clubId, userId) {
    const sql = 'DELETE FROM club_members WHERE club_id = ? AND user_id = ?';
    
    try {
      const result = await query(sql, [clubId, userId]);
      
      if (result.affectedRows > 0) {
        // 更新社团成员数量
        await query('UPDATE clubs SET member_count = member_count - 1 WHERE id = ?', [clubId]);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error leaving club:', error);
      throw error;
    }
  }

  // 更新成员角色
  static async updateRole(clubId, userId, newRole) {
    const sql = 'UPDATE club_members SET role = ? WHERE club_id = ? AND user_id = ?';
    
    try {
      const result = await query(sql, [newRole, clubId, userId]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating member role:', error);
      throw error;
    }
  }

  // 更新成员状态
  static async updateStatus(clubId, userId, status) {
    const sql = 'UPDATE club_members SET status = ? WHERE club_id = ? AND user_id = ?';
    
    try {
      const result = await query(sql, [status, clubId, userId]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating member status:', error);
      throw error;
    }
  }

  // 更新贡献积分
  static async updateContribution(clubId, userId, score) {
    const sql = `
      UPDATE club_members 
      SET contribution_score = contribution_score + ?, last_activity_date = CURDATE()
      WHERE club_id = ? AND user_id = ?
    `;
    
    try {
      const result = await query(sql, [score, clubId, userId]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating contribution score:', error);
      throw error;
    }
  }

  // 获取社团成员列表
  static async getClubMembers(clubId, filters = {}) {
    let sql = `
      SELECT * FROM club_members 
      WHERE club_id = ?
    `;
    const values = [clubId];

    if (filters.role) {
      sql += ' AND role = ?';
      values.push(filters.role);
    }

    if (filters.status) {
      sql += ' AND status = ?';
      values.push(filters.status);
    }

    sql += ' ORDER BY role ASC, contribution_score DESC, join_date ASC';

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
      console.error('Error getting club members:', error);
      throw error;
    }
  }

  // 获取用户加入的社团
  static async getUserClubs(userId) {
    const sql = `
      SELECT 
        cm.*,
        c.name as club_name,
        c.description as club_description,
        c.category as club_category,
        c.logo_url as club_logo,
        c.status as club_status
      FROM club_members cm
      JOIN clubs c ON cm.club_id = c.id
      WHERE cm.user_id = ? AND cm.status = 'active'
      ORDER BY cm.join_date DESC
    `;
    
    try {
      const rows = await query(sql, [userId]);
      return rows;
    } catch (error) {
      console.error('Error getting user clubs:', error);
      throw error;
    }
  }

  // 检查用户是否已加入社团
  static async isMember(clubId, userId) {
    const sql = 'SELECT * FROM club_members WHERE club_id = ? AND user_id = ? AND status = "active"';
    
    try {
      const rows = await query(sql, [clubId, userId]);
      return rows[0] || null;
    } catch (error) {
      console.error('Error checking club membership:', error);
      throw error;
    }
  }

  // 获取社团成员统计
  static async getClubMemberStats(clubId) {
    const sql = `
      SELECT 
        COUNT(*) as total_members,
        SUM(CASE WHEN role = 'leader' THEN 1 ELSE 0 END) as leaders,
        SUM(CASE WHEN role = 'vice_leader' THEN 1 ELSE 0 END) as vice_leaders,
        SUM(CASE WHEN role = 'member' THEN 1 ELSE 0 END) as members,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_members,
        AVG(contribution_score) as avg_contribution,
        MAX(contribution_score) as max_contribution
      FROM club_members 
      WHERE club_id = ?
    `;
    
    try {
      const rows = await query(sql, [clubId]);
      return rows[0] || {};
    } catch (error) {
      console.error('Error getting club member stats:', error);
      throw error;
    }
  }

  // 获取贡献排行榜
  static async getContributionLeaderboard(clubId, limit = 10) {
    const sql = `
      SELECT 
        user_name,
        contribution_score,
        role,
        join_date,
        last_activity_date
      FROM club_members 
      WHERE club_id = ? AND status = 'active'
      ORDER BY contribution_score DESC, join_date ASC
      LIMIT ?
    `;
    
    try {
      const rows = await query(sql, [clubId, limit]);
      return rows;
    } catch (error) {
      console.error('Error getting contribution leaderboard:', error);
      throw error;
    }
  }

  // 删除成员
  static async removeMember(clubId, userId) {
    const sql = 'DELETE FROM club_members WHERE club_id = ? AND user_id = ?';
    
    try {
      const result = await query(sql, [clubId, userId]);
      
      if (result.affectedRows > 0) {
        // 更新社团成员数量
        await query('UPDATE clubs SET member_count = member_count - 1 WHERE id = ?', [clubId]);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error removing member:', error);
      throw error;
    }
  }
}

module.exports = ClubMember;


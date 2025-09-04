const { query } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  // 创建用户表（如果不存在）
  static async createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        createdTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        userId VARCHAR(50) UNIQUE NOT NULL,
        userName VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        email VARCHAR(100) UNIQUE NOT NULL,
        displayName VARCHAR(50),
        status ENUM('active', 'inactive', 'banned') DEFAULT 'active',
        source ENUM('register', 'import', 'admin') DEFAULT 'register',
        studentId VARCHAR(20) UNIQUE,
        picture VARCHAR(255),
        creditScore DECIMAL(5,2) DEFAULT 5.00,
        completedOrders INT DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_userId (userId),
        INDEX idx_userName (userName),
        INDEX idx_email (email),
        INDEX idx_studentId (studentId),
        INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;
    
    try {
      await query(sql);
      console.log('✅ 用户表创建成功');
    } catch (error) {
      console.error('❌ 用户表创建失败:', error.message);
      throw error;
    }
  }

  // 创建新用户
  static async create(userData) {
    const { 
      userId, userName, password, phone, email, displayName, 
      studentId, picture, source = 'register' 
    } = userData;
    
    // 密码加密
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const sql = `
      INSERT INTO users (userId, userName, password, phone, email, displayName, studentId, picture, source)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    try {
      const result = await query(sql, [
        userId, userName, hashedPassword, phone, email, displayName, 
        studentId, picture, source
      ]);
      return { 
        id: result.insertId, 
        userId, userName, phone, email, displayName, 
        studentId, picture, source,
        creditScore: 5.00,
        completedOrders: 0
      };
    } catch (error) {
      console.error('❌ 用户创建失败:', error.message);
      throw error;
    }
  }

  // 根据用户名查找用户
  static async findByUsername(userName) {
    const sql = 'SELECT * FROM users WHERE userName = ?';
    try {
      const users = await query(sql, [userName]);
      return users[0] || null;
    } catch (error) {
      console.error('❌ 用户查询失败:', error.message);
      throw error;
    }
  }

  // 根据邮箱查找用户
  static async findByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email = ?';
    try {
      const users = await query(sql, [email]);
      return users[0] || null;
    } catch (error) {
      console.error('❌ 用户查询失败:', error.message);
      throw error;
    }
  }

  // 根据ID查找用户
  static async findById(id) {
    const sql = `
      SELECT id, createdTime, userId, userName, phone, email, displayName, 
             status, source, studentId, picture, creditScore, completedOrders, updated_at 
      FROM users WHERE id = ?
    `;
    try {
      const users = await query(sql, [id]);
      return users[0] || null;
    } catch (error) {
      console.error('❌ 用户查询失败:', error.message);
      throw error;
    }
  }

  // 根据userId查找用户
  static async findByUserId(userId) {
    const sql = `
      SELECT id, createdTime, userId, userName, phone, email, displayName, 
             status, source, studentId, picture, creditScore, completedOrders, updated_at 
      FROM users WHERE userId = ?
    `;
    try {
      const users = await query(sql, [userId]);
      return users[0] || null;
    } catch (error) {
      console.error('❌ 用户查询失败:', error.message);
      throw error;
    }
  }

  // 根据studentId查找用户
  static async findByStudentId(studentId) {
    const sql = `
      SELECT id, createdTime, userId, userName, phone, email, displayName, 
             status, source, studentId, picture, creditScore, completedOrders, updated_at 
      FROM users WHERE studentId = ?
    `;
    try {
      const users = await query(sql, [studentId]);
      return users[0] || null;
    } catch (error) {
      console.error('❌ 用户查询失败:', error.message);
      throw error;
    }
  }

  // 验证密码
  static async verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  // 更新用户信息
  static async update(id, updateData) {
    const allowedFields = ['displayName', 'phone', 'picture', 'status', 'creditScore', 'completedOrders'];
    const updates = [];
    const values = [];
    
    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key) && value !== undefined) {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    }
    
    if (updates.length === 0) {
      throw new Error('没有可更新的字段');
    }
    
    values.push(id);
    const sql = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
    
    try {
      await query(sql, values);
      return true;
    } catch (error) {
      console.error('❌ 用户更新失败:', error.message);
      throw error;
    }
  }

  // 更新信誉评分
  static async updateCreditScore(id, newScore) {
    const sql = 'UPDATE users SET creditScore = ? WHERE id = ?';
    try {
      await query(sql, [newScore, id]);
      return true;
    } catch (error) {
      console.error('❌ 信誉评分更新失败:', error.message);
      throw error;
    }
  }

  // 增加完成订单数
  static async incrementCompletedOrders(id) {
    const sql = 'UPDATE users SET completedOrders = completedOrders + 1 WHERE id = ?';
    try {
      await query(sql, [id]);
      return true;
    } catch (error) {
      console.error('❌ 订单数更新失败:', error.message);
      throw error;
    }
  }

  // 获取用户列表（分页）
  static async getList(page = 1, limit = 10, search = '') {
    const offset = (page - 1) * limit;
    let sql = `
      SELECT id, createdTime, userId, userName, phone, email, displayName, 
             status, source, studentId, picture, creditScore, completedOrders, updated_at 
      FROM users
    `;
    let countSql = 'SELECT COUNT(*) as total FROM users';
    let params = [];
    let countParams = [];
    
    if (search) {
      const searchCondition = 'WHERE userName LIKE ? OR email LIKE ? OR displayName LIKE ? OR studentId LIKE ?';
      const searchParam = `%${search}%`;
      sql += ` ${searchCondition}`;
      countSql += ` ${searchCondition}`;
      params = [searchParam, searchParam, searchParam, searchParam];
      countParams = [searchParam, searchParam, searchParam, searchParam];
    }
    
    sql += ' ORDER BY createdTime DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    try {
      const [users, countResult] = await Promise.all([
        query(sql, params),
        query(countSql, countParams)
      ]);
      
      return {
        users,
        total: countResult[0].total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(countResult[0].total / limit)
      };
    } catch (error) {
      console.error('❌ 用户列表查询失败:', error.message);
      throw error;
    }
  }

  // 获取跑腿员列表（信誉评分排序）
  static async getRunnersList(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const sql = `
      SELECT id, userId, userName, displayName, picture, creditScore, completedOrders, updated_at
      FROM users 
      WHERE status = 'active' AND creditScore >= 3.0
      ORDER BY creditScore DESC, completedOrders DESC 
      LIMIT ? OFFSET ?
    `;
    
    try {
      const users = await query(sql, [limit, offset]);
      return users;
    } catch (error) {
      console.error('❌ 跑腿员列表查询失败:', error.message);
      throw error;
    }
  }
  
  // 更新用户密码
  static async updatePassword(userId, hashedPassword) {
    const sql = `
      UPDATE users 
      SET password = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    try {
      const [result] = await query(sql, [hashedPassword, userId]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('❌ 更新密码失败:', error.message);
      throw error;
    }
  }
}

module.exports = User;

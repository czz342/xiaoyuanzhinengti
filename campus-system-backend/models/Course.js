const { query } = require('../config/database');

class Course {
  // 创建课程表
  static async createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS courses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        courseCode VARCHAR(20) UNIQUE NOT NULL COMMENT '课程代码',
        courseName VARCHAR(100) NOT NULL COMMENT '课程名称',
        credits DECIMAL(3,1) DEFAULT 0 COMMENT '学分',
        courseType ENUM('必修', '选修', '公共课') DEFAULT '必修' COMMENT '课程类型',
        department VARCHAR(50) COMMENT '开课院系',
        description TEXT COMMENT '课程描述',
        createdTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_courseCode (courseCode),
        INDEX idx_courseName (courseName),
        INDEX idx_department (department)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;
    
    try {
      await query(sql);
      console.log('Courses table created successfully');
    } catch (error) {
      console.error('Error creating courses table:', error);
      throw error;
    }
  }

  // 创建课程
  static async create(courseData) {
    const sql = `
      INSERT INTO courses (courseCode, courseName, credits, courseType, department, description)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      courseData.courseCode,
      courseData.courseName,
      courseData.credits || 0,
      courseData.courseType || '必修',
      courseData.department || null,
      courseData.description || null
    ];

    try {
      const result = await query(sql, values);
      return { id: result.insertId, ...courseData };
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  }

  // 根据ID查找课程
  static async findById(id) {
    const sql = 'SELECT * FROM courses WHERE id = ?';
    
    try {
      const rows = await query(sql, [id]);
      return rows[0] || null;
    } catch (error) {
      console.error('Error finding course by ID:', error);
      throw error;
    }
  }

  // 根据课程代码查找课程
  static async findByCode(courseCode) {
    const sql = 'SELECT * FROM courses WHERE courseCode = ?';
    
    try {
      const rows = await query(sql, [courseCode]);
      return rows[0] || null;
    } catch (error) {
      console.error('Error finding course by code:', error);
      throw error;
    }
  }

  // 根据课程名称查找课程
  static async findByName(courseName) {
    const sql = 'SELECT * FROM courses WHERE courseName LIKE ?';
    
    try {
      const rows = await query(sql, [`%${courseName}%`]);
      return rows;
    } catch (error) {
      console.error('Error finding course by name:', error);
      throw error;
    }
  }

  // 获取所有课程
  static async getAll(limit = 100, offset = 0) {
    const sql = 'SELECT * FROM courses ORDER BY courseCode LIMIT ? OFFSET ?';
    
    try {
      const rows = await query(sql, [limit, offset]);
      return rows;
    } catch (error) {
      console.error('Error getting all courses:', error);
      throw error;
    }
  }

  // 更新课程
  static async update(id, updateData) {
    const allowedFields = ['courseName', 'credits', 'courseType', 'department', 'description'];
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
    const sql = `UPDATE courses SET ${updates.join(', ')} WHERE id = ?`;

    try {
      const result = await query(sql, values);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  }

  // 删除课程
  static async delete(id) {
    const sql = 'DELETE FROM courses WHERE id = ?';
    
    try {
      const result = await query(sql, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  }

  // 根据院系获取课程
  static async getByDepartment(department) {
    const sql = 'SELECT * FROM courses WHERE department = ? ORDER BY courseCode';
    
    try {
      const rows = await query(sql, [department]);
      return rows;
    } catch (error) {
      console.error('Error getting courses by department:', error);
      throw error;
    }
  }

  // 搜索课程
  static async search(keyword) {
    const sql = `
      SELECT * FROM courses 
      WHERE courseCode LIKE ? OR courseName LIKE ? OR department LIKE ?
      ORDER BY courseCode
    `;
    
    const searchTerm = `%${keyword}%`;
    
    try {
      const rows = await query(sql, [searchTerm, searchTerm, searchTerm]);
      return rows;
    } catch (error) {
      console.error('Error searching courses:', error);
      throw error;
    }
  }
}

module.exports = Course;

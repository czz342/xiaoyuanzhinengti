const { query } = require('../config/database');

class CourseSchedule {
  // 创建课程安排表
  static async createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS course_schedules (
        id INT AUTO_INCREMENT PRIMARY KEY,
        courseId INT NOT NULL COMMENT '课程ID',
        studentId VARCHAR(50) NOT NULL COMMENT '学生ID',
        teacherName VARCHAR(50) COMMENT '授课教师',
        location VARCHAR(100) COMMENT '上课地点',
        weekday TINYINT NOT NULL COMMENT '星期几(1-7)',
        startTime TIME NOT NULL COMMENT '开始时间',
        endTime TIME NOT NULL COMMENT '结束时间',
        startWeek TINYINT NOT NULL COMMENT '开始周次',
        endWeek TINYINT NOT NULL COMMENT '结束周次',
        semester VARCHAR(20) NOT NULL COMMENT '学期(如:2024-2025-1)',
        academicYear VARCHAR(20) NOT NULL COMMENT '学年(如:2024-2025)',
        status ENUM('active', 'cancelled', 'suspended') DEFAULT 'active' COMMENT '课程状态',
        createdTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_student_semester (studentId, semester),
        INDEX idx_weekday_time (weekday, startTime),
        INDEX idx_semester (semester),
        INDEX idx_courseId (courseId)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;
    
    try {
      await query(sql);
      console.log('Course schedules table created successfully');
    } catch (error) {
      console.error('Error creating course schedules table:', error);
      throw error;
    }
  }

  // 创建课程安排
  static async create(scheduleData) {
    const sql = `
      INSERT INTO course_schedules (
        courseId, studentId, teacherName, location, weekday, 
        startTime, endTime, startWeek, endWeek, semester, academicYear, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      scheduleData.courseId,
      scheduleData.studentId,
      scheduleData.teacherName || null,
      scheduleData.location || null,
      scheduleData.weekday,
      scheduleData.startTime,
      scheduleData.endTime,
      scheduleData.startWeek,
      scheduleData.endWeek,
      scheduleData.semester,
      scheduleData.academicYear,
      scheduleData.status || 'active'
    ];

    try {
      const result = await query(sql, values);
      return { id: result.insertId, ...scheduleData };
    } catch (error) {
      console.error('Error creating course schedule:', error);
      throw error;
    }
  }

  // 根据ID查找课程安排
  static async findById(id) {
    const sql = `
      SELECT cs.*, c.courseCode, c.courseName, c.credits, c.courseType, c.department
      FROM course_schedules cs
      JOIN courses c ON cs.courseId = c.id
      WHERE cs.id = ?
    `;
    
    try {
      const rows = await query(sql, [id]);
      return rows[0] || null;
    } catch (error) {
      console.error('Error finding course schedule by ID:', error);
      throw error;
    }
  }

  // 获取学生的课程表
  static async getStudentSchedule(studentId, semester = null) {
    let sql = `
      SELECT cs.*, c.courseCode, c.courseName, c.credits, c.courseType, c.department
      FROM course_schedules cs
      JOIN courses c ON cs.courseId = c.id
      WHERE cs.studentId = ? AND cs.status = 'active'
    `;
    
    const values = [studentId];
    
    if (semester) {
      sql += ' AND cs.semester = ?';
      values.push(semester);
    }
    
    sql += ' ORDER BY cs.weekday, cs.startTime';
    
    try {
      const rows = await query(sql, values);
      
      // 格式化数据，将课程信息放在course对象中
      return rows.map(row => ({
        id: row.id,
        courseId: row.courseId,
        studentId: row.studentId,
        teacherName: row.teacherName,
        location: row.location,
        weekday: row.weekday,
        startTime: row.startTime,
        endTime: row.endTime,
        startWeek: row.startWeek,
        endWeek: row.endWeek,
        semester: row.semester,
        academicYear: row.academicYear,
        status: row.status,
        createdTime: row.createdTime,
        updated_at: row.updated_at,
        course: {
          courseName: row.courseName,
          courseCode: row.courseCode,
          credits: row.credits,
          courseType: row.courseType,
          department: row.department
        }
      }));
    } catch (error) {
      console.error('Error getting student schedule:', error);
      throw error;
    }
  }

  // 获取指定日期的课程
  static async getCoursesByDate(studentId, date, semester = null) {
    const weekday = date.getDay() || 7; // 转换为1-7格式
    
    let sql = `
      SELECT cs.*, c.courseCode, c.courseName, c.credits, c.courseType, c.department
      FROM course_schedules cs
      JOIN courses c ON cs.courseId = c.id
      WHERE cs.studentId = ? AND cs.weekday = ? AND cs.status = 'active'
    `;
    
    const values = [studentId, weekday];
    
    if (semester) {
      sql += ' AND cs.semester = ?';
      values.push(semester);
    }
    
    sql += ' ORDER BY cs.startTime';
    
    try {
      const rows = await query(sql, values);
      return rows;
    } catch (error) {
      console.error('Error getting courses by date:', error);
      throw error;
    }
  }

  // 获取指定周次的课程
  static async getCoursesByWeek(studentId, week, semester = null) {
    let sql = `
      SELECT cs.*, c.courseCode, c.courseName, c.credits, c.courseType, c.department
      FROM course_schedules cs
      JOIN courses c ON cs.courseId = c.id
      WHERE cs.studentId = ? AND cs.status = 'active'
      AND ? BETWEEN cs.startWeek AND cs.endWeek
    `;
    
    const values = [studentId, week];
    
    if (semester) {
      sql += ' AND cs.semester = ?';
      values.push(semester);
    }
    
    sql += ' ORDER BY cs.weekday, cs.startTime';
    
    try {
      const rows = await query(sql, values);
      return rows;
    } catch (error) {
      console.error('Error getting courses by week:', error);
      throw error;
    }
  }

  // 获取指定学期的所有课程安排
  static async getBySemester(semester, limit = 100, offset = 0) {
    const sql = `
      SELECT cs.*, c.courseCode, c.courseName, c.credits, c.courseType, c.department
      FROM course_schedules cs
      JOIN courses c ON cs.courseId = c.id
      WHERE cs.semester = ? AND cs.status = 'active'
      ORDER BY cs.studentId, cs.weekday, cs.startTime
      LIMIT ? OFFSET ?
    `;
    
    try {
      const rows = await query(sql, [semester, limit, offset]);
      return rows;
    } catch (error) {
      console.error('Error getting courses by semester:', error);
      throw error;
    }
  }

  // 更新课程安排
  static async update(id, updateData) {
    const allowedFields = [
      'teacherName', 'location', 'weekday', 'startTime', 'endTime', 
      'startWeek', 'endWeek', 'semester', 'academicYear', 'status'
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
    const sql = `UPDATE course_schedules SET ${updates.join(', ')} WHERE id = ?`;

    try {
      const result = await query(sql, values);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating course schedule:', error);
      throw error;
    }
  }

  // 删除课程安排
  static async delete(id) {
    const sql = 'DELETE FROM course_schedules WHERE id = ?';
    
    try {
      const result = await query(sql, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting course schedule:', error);
      throw error;
    }
  }

  // 批量创建课程安排
  static async batchCreate(schedules) {
    if (!Array.isArray(schedules) || schedules.length === 0) {
      throw new Error('Schedules must be a non-empty array');
    }

    const sql = `
      INSERT INTO course_schedules (
        courseId, studentId, teacherName, location, weekday, 
        startTime, endTime, startWeek, endWeek, semester, academicYear, status
      ) VALUES ?
    `;
    
    const values = schedules.map(schedule => [
      schedule.courseId,
      schedule.studentId,
      schedule.teacherName || null,
      schedule.location || null,
      schedule.weekday,
      schedule.startTime,
      schedule.endTime,
      schedule.startWeek,
      schedule.endWeek,
      schedule.semester,
      schedule.academicYear,
      schedule.status || 'active'
    ]);

    try {
      const result = await query(sql, [values]);
      return result.affectedRows;
    } catch (error) {
      console.error('Error batch creating course schedules:', error);
      throw error;
    }
  }

  // 获取课程冲突
  static async getConflicts(studentId, semester, weekday, startTime, endTime, excludeId = null) {
    let sql = `
      SELECT cs.*, c.courseCode, c.courseName
      FROM course_schedules cs
      JOIN courses c ON cs.courseId = c.id
      WHERE cs.studentId = ? AND cs.semester = ? AND cs.weekday = ?
      AND cs.status = 'active'
      AND (
        (cs.startTime < ? AND cs.endTime > ?) OR
        (cs.startTime < ? AND cs.endTime > ?) OR
        (cs.startTime >= ? AND cs.endTime <= ?)
      )
    `;
    
    const values = [
      studentId, semester, weekday, 
      endTime, startTime, endTime, startTime, startTime, endTime
    ];
    
    if (excludeId) {
      sql += ' AND cs.id != ?';
      values.push(excludeId);
    }
    
    try {
      const rows = await query(sql, values);
      return rows;
    } catch (error) {
      console.error('Error getting course conflicts:', error);
      throw error;
    }
  }

  // 获取学生当前学期的课程统计
  static async getStudentStats(studentId, semester) {
    const sql = `
      SELECT 
        COUNT(*) as totalCourses,
        SUM(c.credits) as totalCredits,
        COUNT(DISTINCT cs.weekday) as activeDays
      FROM course_schedules cs
      JOIN courses c ON cs.courseId = c.id
      WHERE cs.studentId = ? AND cs.semester = ? AND cs.status = 'active'
    `;
    
    try {
      const rows = await query(sql, [studentId, semester]);
      return rows[0] || { totalCourses: 0, totalCredits: 0, activeDays: 0 };
    } catch (error) {
      console.error('Error getting student stats:', error);
      throw error;
    }
  }
}

module.exports = CourseSchedule;

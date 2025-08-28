const { query } = require('../config/database');

class CourseTimeTemplate {
  // 创建课程时间模板表
  static async createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS course_time_templates (
        id INT AUTO_INCREMENT PRIMARY KEY,
        timeSlot TINYINT NOT NULL COMMENT '时间段(1-14)',
        startTime TIME NOT NULL COMMENT '开始时间',
        endTime TIME NOT NULL COMMENT '结束时间',
        description VARCHAR(50) COMMENT '时间段描述',
        createdTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uk_timeSlot (timeSlot)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;
    
    try {
      await query(sql);
      console.log('Course time templates table created successfully');
    } catch (error) {
      console.error('Error creating course time templates table:', error);
      throw error;
    }
  }

  // 初始化默认时间模板
  static async initializeDefaultTemplates() {
    const defaultTemplates = [
      { timeSlot: 1, startTime: '08:00:00', endTime: '08:45:00', description: '第1节' },
      { timeSlot: 2, startTime: '08:55:00', endTime: '09:40:00', description: '第2节' },
      { timeSlot: 3, startTime: '10:00:00', endTime: '10:45:00', description: '第3节' },
      { timeSlot: 4, startTime: '10:55:00', endTime: '11:40:00', description: '第4节' },
      { timeSlot: 5, startTime: '14:00:00', endTime: '14:45:00', description: '第5节' },
      { timeSlot: 6, startTime: '14:55:00', endTime: '15:40:00', description: '第6节' },
      { timeSlot: 7, startTime: '16:00:00', endTime: '16:45:00', description: '第7节' },
      { timeSlot: 8, startTime: '16:55:00', endTime: '17:40:00', description: '第8节' },
      { timeSlot: 9, startTime: '19:00:00', endTime: '19:45:00', description: '第9节' },
      { timeSlot: 10, startTime: '19:55:00', endTime: '20:40:00', description: '第10节' },
      { timeSlot: 11, startTime: '20:50:00', endTime: '21:35:00', description: '第11节' },
      { timeSlot: 12, startTime: '21:45:00', endTime: '22:30:00', description: '第12节' }
    ];

    try {
      for (const template of defaultTemplates) {
        await this.create(template);
      }
      console.log('Default time templates initialized successfully');
    } catch (error) {
      console.error('Error initializing default time templates:', error);
      throw error;
    }
  }

  // 创建时间模板
  static async create(templateData) {
    const sql = `
      INSERT INTO course_time_templates (timeSlot, startTime, endTime, description)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
      startTime = VALUES(startTime),
      endTime = VALUES(endTime),
      description = VALUES(description)
    `;
    
    const values = [
      templateData.timeSlot,
      templateData.startTime,
      templateData.endTime,
      templateData.description || null
    ];

    try {
      const result = await query(sql, values);
      return { id: result.insertId || result.insertId, ...templateData };
    } catch (error) {
      console.error('Error creating time template:', error);
      throw error;
    }
  }

  // 根据时间段获取模板
  static async findByTimeSlot(timeSlot) {
    const sql = 'SELECT * FROM course_time_templates WHERE timeSlot = ?';
    
    try {
      const rows = await query(sql, [timeSlot]);
      return rows[0] || null;
    } catch (error) {
      console.error('Error finding time template by timeSlot:', error);
      throw error;
    }
  }

  // 获取所有时间模板
  static async getAll() {
    const sql = 'SELECT * FROM course_time_templates ORDER BY timeSlot';
    
    try {
      const rows = await query(sql);
      return rows;
    } catch (error) {
      console.error('Error getting all time templates:', error);
      throw error;
    }
  }

  // 更新时间模板
  static async update(timeSlot, updateData) {
    const allowedFields = ['startTime', 'endTime', 'description'];
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

    values.push(timeSlot);
    const sql = `UPDATE course_time_templates SET ${updates.join(', ')} WHERE timeSlot = ?`;

    try {
      const result = await query(sql, values);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating time template:', error);
      throw error;
    }
  }

  // 删除时间模板
  static async delete(timeSlot) {
    const sql = 'DELETE FROM course_time_templates WHERE timeSlot = ?';
    
    try {
      const result = await query(sql, [timeSlot]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting time template:', error);
      throw error;
    }
  }

  // 根据时间获取对应的时间段
  static async getTimeSlotByTime(time) {
    const sql = `
      SELECT * FROM course_time_templates 
      WHERE ? BETWEEN startTime AND endTime
      LIMIT 1
    `;
    
    try {
      const rows = await query(sql, [time]);
      return rows[0] || null;
    } catch (error) {
      console.error('Error getting time slot by time:', error);
      throw error;
    }
  }

  // 获取指定时间范围内的所有时间段
  static async getTimeSlotsInRange(startTime, endTime) {
    const sql = `
      SELECT * FROM course_time_templates 
      WHERE startTime >= ? AND endTime <= ?
      ORDER BY timeSlot
    `;
    
    try {
      const rows = await query(sql, [startTime, endTime]);
      return rows;
    } catch (error) {
      console.error('Error getting time slots in range:', error);
      throw error;
    }
  }

  // 批量更新时间模板
  static async batchUpdate(templates) {
    if (!Array.isArray(templates) || templates.length === 0) {
      throw new Error('Templates must be a non-empty array');
    }

    const sql = `
      INSERT INTO course_time_templates (timeSlot, startTime, endTime, description)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
      startTime = VALUES(startTime),
      endTime = VALUES(endTime),
      description = VALUES(description)
    `;
    
    try {
      for (const template of templates) {
        await query(sql, [
          template.timeSlot,
          template.startTime,
          template.endTime,
          template.description || null
        ]);
      }
      return templates.length;
    } catch (error) {
      console.error('Error batch updating time templates:', error);
      throw error;
    }
  }

  // 验证时间模板的有效性
  static async validateTimeTemplate(startTime, endTime, excludeTimeSlot = null) {
    let sql = `
      SELECT * FROM course_time_templates 
      WHERE (
        (startTime < ? AND endTime > ?) OR
        (startTime < ? AND endTime > ?) OR
        (startTime >= ? AND endTime <= ?)
      )
    `;
    
    const values = [endTime, startTime, endTime, startTime, startTime, endTime];
    
    if (excludeTimeSlot) {
      sql += ' AND timeSlot != ?';
      values.push(excludeTimeSlot);
    }
    
    try {
      const rows = await query(sql, values);
      return rows.length === 0; // 返回true表示没有冲突
    } catch (error) {
      console.error('Error validating time template:', error);
      throw error;
    }
  }
}

module.exports = CourseTimeTemplate;

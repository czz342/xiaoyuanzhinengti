const { query } = require('../config/database');

class ClassroomReservation {
  // 创建教室预约表
  static async createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS classroom_reservations (
        id INT PRIMARY KEY AUTO_INCREMENT,
        createdTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        reservationNumber VARCHAR(50) UNIQUE NOT NULL COMMENT '预约编号',
        userId INT NOT NULL COMMENT '用户ID',
        classroomId INT NOT NULL COMMENT '教室ID',
        reservationDate DATE NOT NULL COMMENT '预约日期',
        startTime INT NOT NULL COMMENT '开始时间（秒）',
        endTime INT NOT NULL COMMENT '结束时间（秒）',
        purpose VARCHAR(200) DEFAULT '' COMMENT '预约用途',
        status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending' COMMENT '预约状态',
        notes TEXT COMMENT '备注信息',
        isActive BOOLEAN DEFAULT TRUE COMMENT '是否有效',
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (classroomId) REFERENCES classrooms(id) ON DELETE CASCADE,
        INDEX idx_user_date (userId, reservationDate),
        INDEX idx_classroom_date (classroomId, reservationDate),
        INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='教室预约表';
    `;
    
    try {
      await query(sql);
      console.log('✅ 教室预约表创建成功');
      return true;
    } catch (error) {
      console.error('❌ 教室预约表创建失败:', error);
      return false;
    }
  }

  // 创建预约
  static async create(reservationData) {
    const {
      reservationNumber,
      userId,
      classroomId,
      reservationDate,
      startTime,
      endTime,
      purpose = '',
      status = 'pending',
      notes = ''
    } = reservationData;

    const sql = `
      INSERT INTO classroom_reservations 
      (reservationNumber, userId, classroomId, reservationDate, startTime, endTime, purpose, status, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    try {
      const result = await query(sql, [
        reservationNumber, userId, classroomId, reservationDate, 
        startTime, endTime, purpose, status, notes
      ]);
      return result.insertId;
    } catch (error) {
      console.error('创建教室预约失败:', error);
      throw error;
    }
  }

  // 根据ID查找预约
  static async findById(id) {
    const sql = `
      SELECT cr.*, c.code as classroomCode, c.name as classroomName, c.building, c.floor,
             u.userName, u.displayName, u.studentId
      FROM classroom_reservations cr
      JOIN classrooms c ON cr.classroomId = c.id
      JOIN users u ON cr.userId = u.id
      WHERE cr.id = ? AND cr.isActive = TRUE
    `;
    try {
      const rows = await query(sql, [id]);
      return rows[0] || null;
    } catch (error) {
      console.error('查找预约失败:', error);
      throw error;
    }
  }

  // 根据预约编号查找
  static async findByNumber(reservationNumber) {
    const sql = `
      SELECT cr.*, c.code as classroomCode, c.name as classroomName, c.building, c.floor,
             u.userName, u.displayName, u.studentId
      FROM classroom_reservations cr
      JOIN classrooms c ON cr.classroomId = c.id
      JOIN users u ON cr.userId = u.id
      WHERE cr.reservationNumber = ? AND cr.isActive = TRUE
    `;
    try {
      const rows = await query(sql, [reservationNumber]);
      return rows[0] || null;
    } catch (error) {
      console.error('查找预约失败:', error);
      throw error;
    }
  }

  // 获取用户的所有预约
  static async getByUserId(userId, date = null) {
    let sql = `
      SELECT cr.*, c.code as classroomCode, c.name as classroomName, c.building, c.floor,
             u.userName, u.displayName, u.studentId
      FROM classroom_reservations cr
      JOIN classrooms c ON cr.classroomId = c.id
      JOIN users u ON cr.userId = u.id
      WHERE cr.userId = ? AND cr.isActive = TRUE
    `;
    const params = [userId];

    if (date) {
      sql += ' AND cr.reservationDate = ?';
      params.push(date);
    }

    sql += ' ORDER BY cr.reservationDate DESC, cr.startTime ASC';

    try {
      const rows = await query(sql, params);
      return rows;
    } catch (error) {
      console.error('获取用户预约失败:', error);
      throw error;
    }
  }

  // 获取指定日期的所有预约
  static async getByDate(date) {
    const sql = `
      SELECT cr.*, c.code as classroomCode, c.name as classroomName, c.building, c.floor,
             u.userName, u.displayName, u.studentId
      FROM classroom_reservations cr
      JOIN classrooms c ON cr.classroomId = c.id
      JOIN users u ON cr.userId = u.id
      WHERE cr.reservationDate = ? AND cr.isActive = TRUE
      ORDER BY cr.startTime ASC
    `;
    try {
      const rows = await query(sql, [date]);
      return rows;
    } catch (error) {
      console.error('获取日期预约失败:', error);
      throw error;
    }
  }

  // 获取指定教室的预约
  static async getByClassroomId(classroomId, date = null) {
    let sql = `
      SELECT cr.*, c.code as classroomCode, c.name as classroomName, c.building, c.floor,
             u.userName, u.displayName, u.studentId
      FROM classroom_reservations cr
      JOIN classrooms c ON cr.classroomId = c.id
      JOIN users u ON cr.userId = u.id
      WHERE cr.classroomId = ? AND cr.isActive = TRUE
    `;
    const params = [classroomId];

    if (date) {
      sql += ' AND cr.reservationDate = ?';
      params.push(date);
    }

    sql += ' ORDER BY cr.reservationDate ASC, cr.startTime ASC';

    try {
      const rows = await query(sql, params);
      return rows;
    } catch (error) {
      console.error('获取教室预约失败:', error);
      throw error;
    }
  }

  // 检查时间冲突
  static async checkTimeConflict(classroomId, date, startTime, endTime, excludeId = null) {
    let sql = `
      SELECT COUNT(*) as count
      FROM classroom_reservations
      WHERE classroomId = ? AND reservationDate = ? 
        AND status IN ('pending', 'confirmed')
        AND isActive = TRUE
        AND (
          (startTime < ? AND endTime > ?) OR
          (startTime < ? AND endTime > ?) OR
          (startTime >= ? AND endTime <= ?)
        )
    `;
    const params = [classroomId, date, endTime, startTime, endTime, startTime, startTime, endTime];

    if (excludeId) {
      sql += ' AND id != ?';
      params.push(excludeId);
    }

    try {
      const rows = await query(sql, params);
      return rows[0].count > 0;
    } catch (error) {
      console.error('检查时间冲突失败:', error);
      throw error;
    }
  }

  // 更新预约状态
  static async updateStatus(id, status) {
    const sql = 'UPDATE classroom_reservations SET status = ?, updatedTime = CURRENT_TIMESTAMP WHERE id = ?';
    try {
      const result = await query(sql, [status, id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('更新预约状态失败:', error);
      throw error;
    }
  }

  // 更新预约信息
  static async update(id, updateData) {
    const allowedFields = ['purpose', 'notes', 'startTime', 'endTime'];
    const updates = [];
    const values = [];

    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key)) {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (updates.length === 0) {
      return false;
    }

    values.push(id);
    const sql = `UPDATE classroom_reservations SET ${updates.join(', ')}, updatedTime = CURRENT_TIMESTAMP WHERE id = ?`;

    try {
      const result = await query(sql, values);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('更新预约失败:', error);
      throw error;
    }
  }

  // 取消预约
  static async cancel(id, userId) {
    const sql = 'UPDATE classroom_reservations SET status = "cancelled", updatedTime = CURRENT_TIMESTAMP WHERE id = ? AND userId = ?';
    try {
      const result = await query(sql, [id, userId]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('取消预约失败:', error);
      throw error;
    }
  }

  // 删除预约（软删除）
  static async delete(id) {
    const sql = 'UPDATE classroom_reservations SET isActive = FALSE WHERE id = ?';
    try {
      const result = await query(sql, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('删除预约失败:', error);
      throw error;
    }
  }

  // 获取预约统计
  static async getStats(userId = null) {
    let sql = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
      FROM classroom_reservations
      WHERE isActive = TRUE
    `;
    const params = [];

    if (userId) {
      sql += ' AND userId = ?';
      params.push(userId);
    }

    try {
      const rows = await query(sql, params);
      return rows[0];
    } catch (error) {
      console.error('获取预约统计失败:', error);
      throw error;
    }
  }

  // 生成预约编号
  static generateReservationNumber() {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `CR${timestamp.slice(-8)}${random}`;
  }

  // 获取即将到期的预约（用于提醒）
  static async getUpcomingReservations(userId, hours = 24) {
    const sql = `
      SELECT cr.*, c.name as classroomName, c.building, c.floor
      FROM classroom_reservations cr
      JOIN classrooms c ON cr.classroomId = c.id
      WHERE cr.userId = ? 
        AND cr.status = 'confirmed'
        AND cr.isActive = TRUE
        AND cr.reservationDate = CURDATE()
        AND cr.startTime > UNIX_TIMESTAMP() 
        AND cr.startTime <= UNIX_TIMESTAMP() + (? * 3600)
      ORDER BY cr.startTime ASC
    `;
    try {
      const rows = await query(sql, [userId, hours]);
      return rows;
    } catch (error) {
      console.error('获取即将到期预约失败:', error);
      throw error;
    }
  }
}

module.exports = ClassroomReservation;

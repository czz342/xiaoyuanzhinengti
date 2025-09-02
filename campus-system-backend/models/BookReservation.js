const { query } = require('../config/database');

class BookReservation {
  // 创建图书预约表
  static async createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS book_reservations (
        id INT PRIMARY KEY AUTO_INCREMENT,
        reservationNumber VARCHAR(20) UNIQUE NOT NULL COMMENT '预约单号',
        userId INT NOT NULL COMMENT '用户ID',
        bookId INT NOT NULL COMMENT '图书ID',
        reservationDate DATE NOT NULL COMMENT '预约日期',
        status ENUM('pending', 'available', 'expired', 'cancelled') DEFAULT 'pending' COMMENT '预约状态',
        notifyDate DATE NULL COMMENT '通知日期',
        pickupDeadline DATE NULL COMMENT '取书截止日期',
        notes TEXT COMMENT '备注',
        createdTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
        updatedTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
        isActive BOOLEAN DEFAULT TRUE COMMENT '是否有效',
        FOREIGN KEY (userId) REFERENCES users(id),
        FOREIGN KEY (bookId) REFERENCES books(id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='图书预约表'
    `;
    
    try {
      await query(sql);
      console.log('✅ 图书预约表创建成功');
    } catch (error) {
      console.error('❌ 创建图书预约表失败:', error);
      throw error;
    }
  }

  // 创建预约记录
  static async create(reservationData) {
    const {
      reservationNumber, userId, bookId, reservationDate, notes
    } = reservationData;

    const sql = `
      INSERT INTO book_reservations (
        reservationNumber, userId, bookId, reservationDate, notes
      ) VALUES (?, ?, ?, ?, ?)
    `;

    try {
      const result = await query(sql, [
        reservationNumber, userId, bookId, reservationDate, notes
      ]);
      return result.insertId;
    } catch (error) {
      console.error('创建预约记录失败:', error);
      throw error;
    }
  }

  // 根据ID查找预约记录
  static async findById(id) {
    const sql = `
      SELECT br.*, b.title as bookTitle, b.author as bookAuthor, b.isbn as bookISBN,
             b.coverImage as bookCover, u.userName, u.displayName, u.studentId
      FROM book_reservations br
      JOIN books b ON br.bookId = b.id
      JOIN users u ON br.userId = u.id
      WHERE br.id = ? AND br.isActive = TRUE
    `;
    try {
      const rows = await query(sql, [id]);
      return rows[0] || null;
    } catch (error) {
      console.error('查找预约记录失败:', error);
      throw error;
    }
  }

  // 根据预约单号查找
  static async findByNumber(reservationNumber) {
    const sql = `
      SELECT br.*, b.title as bookTitle, b.author as bookAuthor, b.isbn as bookISBN,
             b.coverImage as bookCover, u.userName, u.displayName, u.studentId
      FROM book_reservations br
      JOIN books b ON br.bookId = b.id
      JOIN users u ON br.userId = u.id
      WHERE br.reservationNumber = ? AND br.isActive = TRUE
    `;
    try {
      const rows = await query(sql, [reservationNumber]);
      return rows[0] || null;
    } catch (error) {
      console.error('根据预约单号查找失败:', error);
      throw error;
    }
  }

  // 获取用户的所有预约记录
  static async getByUserId(userId, status = null) {
    let sql = `
      SELECT br.*, b.title as bookTitle, b.author as bookAuthor, b.isbn as bookISBN,
             b.coverImage as bookCover, u.userName, u.displayName, u.studentId
      FROM book_reservations br
      JOIN books b ON br.bookId = b.id
      JOIN users u ON br.userId = u.id
      WHERE br.userId = ? AND br.isActive = TRUE
    `;
    const params = [userId];

    if (status) {
      sql += ' AND br.status = ?';
      params.push(status);
    }

    sql += ' ORDER BY br.reservationDate DESC, br.createdTime DESC';

    try {
      const rows = await query(sql, params);
      return rows;
    } catch (error) {
      console.error('获取用户预约记录失败:', error);
      throw error;
    }
  }

  // 获取图书的预约记录
  static async getByBookId(bookId, status = null) {
    let sql = `
      SELECT br.*, b.title as bookTitle, b.author as bookAuthor, b.isbn as bookISBN,
             u.userName, u.displayName, u.studentId
      FROM book_reservations br
      JOIN books b ON br.bookId = b.id
      JOIN users u ON br.userId = u.id
      WHERE br.bookId = ? AND br.isActive = TRUE
    `;
    const params = [bookId];

    if (status) {
      sql += ' AND br.status = ?';
      params.push(status);
    }

    sql += ' ORDER BY br.reservationDate ASC';

    try {
      const rows = await query(sql, params);
      return rows;
    } catch (error) {
      console.error('获取图书预约记录失败:', error);
      throw error;
    }
  }

  // 更新预约状态
  static async updateStatus(id, status, notifyDate = null, pickupDeadline = null) {
    let sql = `
      UPDATE book_reservations 
      SET status = ?, updatedTime = CURRENT_TIMESTAMP
    `;
    const params = [status];

    if (notifyDate) {
      sql += ', notifyDate = ?';
      params.push(notifyDate);
    }

    if (pickupDeadline) {
      sql += ', pickupDeadline = ?';
      params.push(pickupDeadline);
    }

    sql += ' WHERE id = ? AND isActive = TRUE';
    params.push(id);

    try {
      const result = await query(sql, params);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('更新预约状态失败:', error);
      throw error;
    }
  }

  // 图书可借时通知预约用户
  static async notifyAvailable(bookId) {
    const sql = `
      UPDATE book_reservations 
      SET status = 'available', notifyDate = CURDATE(), 
          pickupDeadline = DATE_ADD(CURDATE(), INTERVAL 7 DAY),
          updatedTime = CURRENT_TIMESTAMP
      WHERE bookId = ? AND status = 'pending' AND isActive = TRUE
      ORDER BY reservationDate ASC
      LIMIT 1
    `;
    
    try {
      const result = await query(sql, [bookId]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('通知预约用户失败:', error);
      throw error;
    }
  }

  // 取消预约
  static async cancelReservation(id, userId) {
    const sql = `
      UPDATE book_reservations 
      SET status = 'cancelled', updatedTime = CURRENT_TIMESTAMP
      WHERE id = ? AND userId = ? AND isActive = TRUE
    `;
    
    try {
      const result = await query(sql, [id, userId]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('取消预约失败:', error);
      throw error;
    }
  }

  // 检查预约是否过期
  static async checkExpiredReservations() {
    const sql = `
      UPDATE book_reservations 
      SET status = 'expired', updatedTime = CURRENT_TIMESTAMP
      WHERE status = 'available' AND pickupDeadline < CURDATE() AND isActive = TRUE
    `;
    
    try {
      const result = await query(sql);
      return result.affectedRows;
    } catch (error) {
      console.error('检查过期预约失败:', error);
      throw error;
    }
  }

  // 生成预约单号
  static async generateReservationNumber() {
    const prefix = 'BR';
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
  }

  // 获取预约统计信息
  static async getStats(userId = null) {
    let sql = `
      SELECT 
        COUNT(*) as totalReservations,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pendingReservations,
        SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END) as availableReservations,
        SUM(CASE WHEN status = 'expired' THEN 1 ELSE 0 END) as expiredReservations,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelledReservations
      FROM book_reservations 
      WHERE isActive = TRUE
    `;
    const params = [];

    if (userId) {
      sql += ' AND userId = ?';
      params.push(userId);
    }

    try {
      const rows = await query(sql, params);
      return rows[0] || null;
    } catch (error) {
      console.error('获取预约统计失败:', error);
      throw error;
    }
  }

  // 删除预约记录（软删除）
  static async delete(id) {
    const sql = `
      UPDATE book_reservations SET isActive = FALSE WHERE id = ?
    `;
    
    try {
      const result = await query(sql, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('删除预约记录失败:', error);
      throw error;
    }
  }
}

module.exports = BookReservation;

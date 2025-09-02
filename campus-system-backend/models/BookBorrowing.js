const { query } = require('../config/database');

class BookBorrowing {
  // 创建图书借阅记录表
  static async createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS book_borrowings (
        id INT PRIMARY KEY AUTO_INCREMENT,
        borrowingNumber VARCHAR(20) UNIQUE NOT NULL COMMENT '借阅单号',
        userId INT NOT NULL COMMENT '用户ID',
        bookId INT NOT NULL COMMENT '图书ID',
        borrowDate DATE NOT NULL COMMENT '借阅日期',
        dueDate DATE NOT NULL COMMENT '应还日期',
        returnDate DATE NULL COMMENT '实际归还日期',
        status ENUM('borrowed', 'returned', 'overdue', 'lost', 'cancelled') DEFAULT 'borrowed' COMMENT '借阅状态',
        borrowDays INT NOT NULL DEFAULT 30 COMMENT '借阅天数',
        fine DECIMAL(10,2) DEFAULT 0.00 COMMENT '罚金',
        fineReason VARCHAR(255) COMMENT '罚金原因',
        notes TEXT COMMENT '备注',
        createdTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
        updatedTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
        isActive BOOLEAN DEFAULT TRUE COMMENT '是否有效',
        FOREIGN KEY (userId) REFERENCES users(id),
        FOREIGN KEY (bookId) REFERENCES books(id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='图书借阅记录表'
    `;
    
    try {
      await query(sql);
      console.log('✅ 图书借阅记录表创建成功');
    } catch (error) {
      console.error('❌ 创建图书借阅记录表失败:', error);
      throw error;
    }
  }

  // 创建借阅记录
  static async create(borrowingData) {
    const {
      borrowingNumber, userId, bookId, borrowDate, dueDate, borrowDays, notes
    } = borrowingData;

    const sql = `
      INSERT INTO book_borrowings (
        borrowingNumber, userId, bookId, borrowDate, dueDate, borrowDays, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    try {
      const result = await query(sql, [
        borrowingNumber, userId, bookId, borrowDate, dueDate, borrowDays, notes
      ]);
      return result.insertId;
    } catch (error) {
      console.error('创建借阅记录失败:', error);
      throw error;
    }
  }

  // 根据ID查找借阅记录
  static async findById(id) {
    const sql = `
      SELECT bb.*, b.title as bookTitle, b.author as bookAuthor, b.isbn as bookISBN,
             b.coverImage as bookCover, b.location as bookLocation, u.userName, u.displayName, u.studentId
      FROM book_borrowings bb
      JOIN books b ON bb.bookId = b.id
      JOIN users u ON bb.userId = u.id
      WHERE bb.id = ? AND bb.isActive = TRUE
    `;
    try {
      const rows = await query(sql, [id]);
      return rows[0] || null;
    } catch (error) {
      console.error('查找借阅记录失败:', error);
      throw error;
    }
  }

  // 根据借阅单号查找
  static async findByNumber(borrowingNumber) {
    const sql = `
      SELECT bb.*, b.title as bookTitle, b.author as bookAuthor, b.isbn as bookISBN,
             b.coverImage as bookCover, b.location as bookLocation, u.userName, u.displayName, u.studentId
      FROM book_borrowings bb
      JOIN books b ON bb.bookId = b.id
      JOIN users u ON bb.userId = u.id
      WHERE bb.borrowingNumber = ? AND bb.isActive = TRUE
    `;
    try {
      const rows = await query(sql, [borrowingNumber]);
      return rows[0] || null;
    } catch (error) {
      console.error('根据借阅单号查找失败:', error);
      throw error;
    }
  }

  // 获取用户的所有借阅记录
  static async getByUserId(userId, status = null, limit = 50, offset = 0) {
    let sql = `
      SELECT bb.*, b.title as bookTitle, b.author as bookAuthor, b.isbn as bookISBN,
             b.coverImage as bookCover, b.location as bookLocation, u.userName, u.displayName, u.studentId
      FROM book_borrowings bb
      JOIN books b ON bb.bookId = b.id
      JOIN users u ON bb.userId = u.id
      WHERE bb.userId = ? AND bb.isActive = TRUE
    `;
    const params = [userId];

    if (status) {
      sql += ' AND bb.status = ?';
      params.push(status);
    }

    sql += ' ORDER BY bb.borrowDate DESC, bb.createdTime DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    try {
      const rows = await query(sql, params);
      return rows;
    } catch (error) {
      console.error('获取用户借阅记录失败:', error);
      throw error;
    }
  }

  // 获取图书的借阅记录
  static async getByBookId(bookId, status = null) {
    let sql = `
      SELECT bb.*, b.title as bookTitle, b.author as bookAuthor, b.isbn as bookISBN,
             b.location as bookLocation, u.userName, u.displayName, u.studentId
      FROM book_borrowings bb
      JOIN books b ON bb.bookId = b.id
      JOIN users u ON bb.userId = u.id
      WHERE bb.bookId = ? AND bb.isActive = TRUE
    `;
    const params = [bookId];

    if (status) {
      sql += ' AND bb.status = ?';
      params.push(status);
    }

    sql += ' ORDER BY bb.borrowDate DESC';

    try {
      const rows = await query(sql, params);
      return rows;
    } catch (error) {
      console.error('获取图书借阅记录失败:', error);
      throw error;
    }
  }

  // 获取逾期记录
  static async getOverdueRecords() {
    const sql = `
      SELECT bb.*, b.title as bookTitle, b.author as bookAuthor, b.isbn as bookISBN,
             b.location as bookLocation, u.userName, u.displayName, u.studentId
      FROM book_borrowings bb
      JOIN books b ON bb.bookId = b.id
      JOIN users u ON bb.userId = u.id
      WHERE bb.status = 'borrowed' AND bb.dueDate < CURDATE() AND bb.isActive = TRUE
      ORDER BY bb.dueDate ASC
    `;
    try {
      const rows = await query(sql);
      return rows;
    } catch (error) {
      console.error('获取逾期记录失败:', error);
      throw error;
    }
  }

  // 更新借阅状态
  static async updateStatus(id, status, returnDate = null, fine = 0, fineReason = null) {
    let sql = `
      UPDATE book_borrowings 
      SET status = ?, updatedTime = CURRENT_TIMESTAMP
    `;
    const params = [status];

    if (returnDate) {
      sql += ', returnDate = ?';
      params.push(returnDate);
    }

    if (fine > 0) {
      sql += ', fine = ?, fineReason = ?';
      params.push(fine, fineReason);
    }

    sql += ' WHERE id = ? AND isActive = TRUE';
    params.push(id);

    try {
      const result = await query(sql, params);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('更新借阅状态失败:', error);
      throw error;
    }
  }

  // 归还图书
  static async returnBook(id, returnDate = null) {
    const sql = `
      UPDATE book_borrowings 
      SET status = 'returned', returnDate = ?, updatedTime = CURRENT_TIMESTAMP
      WHERE id = ? AND isActive = TRUE AND status = 'borrowed'
    `;
    
    try {
      const result = await query(sql, [returnDate || new Date(), id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('归还图书失败:', error);
      throw error;
    }
  }

  // 续借图书
  static async renewBook(id, newDueDate) {
    const sql = `
      UPDATE book_borrowings 
      SET dueDate = ?, borrowDays = DATEDIFF(?, borrowDate), updatedTime = CURRENT_TIMESTAMP
      WHERE id = ? AND isActive = TRUE AND status = 'borrowed'
    `;
    
    try {
      const result = await query(sql, [newDueDate, newDueDate, id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('续借图书失败:', error);
      throw error;
    }
  }

  // 计算罚金
  static async calculateFine(id) {
    const sql = `
      SELECT 
        bb.dueDate,
        DATEDIFF(CURDATE(), bb.dueDate) as overdueDays,
        bb.fine
      FROM book_borrowings bb
      WHERE bb.id = ? AND bb.isActive = TRUE
    `;
    
    try {
      const rows = await query(sql, [id]);
      if (rows.length === 0) return 0;
      
      const record = rows[0];
      if (record.overdueDays <= 0) return 0;
      
      // 每天罚金0.5元
      const dailyFine = 0.5;
      const totalFine = record.overdueDays * dailyFine;
      
      // 更新罚金
      await this.updateStatus(id, 'overdue', null, totalFine, `逾期${record.overdueDays}天`);
      
      return totalFine;
    } catch (error) {
      console.error('计算罚金失败:', error);
      throw error;
    }
  }

  // 生成借阅单号
  static async generateBorrowingNumber() {
    const prefix = 'BB';
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
  }

  // 获取借阅统计信息
  static async getStats(userId = null) {
    let sql = `
      SELECT 
        COUNT(*) as totalBorrowings,
        SUM(CASE WHEN status = 'borrowed' THEN 1 ELSE 0 END) as currentBorrowings,
        SUM(CASE WHEN status = 'returned' THEN 1 ELSE 0 END) as returnedBooks,
        SUM(CASE WHEN status = 'overdue' THEN 1 ELSE 0 END) as overdueBooks,
        SUM(fine) as totalFines
      FROM book_borrowings 
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
      console.error('获取借阅统计失败:', error);
      throw error;
    }
  }

  // 删除借阅记录（软删除）
  static async delete(id) {
    const sql = `
      UPDATE book_borrowings SET isActive = FALSE WHERE id = ?
    `;
    
    try {
      const result = await query(sql, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('删除借阅记录失败:', error);
      throw error;
    }
  }
}

module.exports = BookBorrowing;

const { query } = require('../config/database');

class Book {
  // 创建图书表
  static async createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS books (
        id INT PRIMARY KEY AUTO_INCREMENT,
        isbn VARCHAR(20) UNIQUE NOT NULL COMMENT 'ISBN号',
        title VARCHAR(200) NOT NULL COMMENT '书名',
        author VARCHAR(100) NOT NULL COMMENT '作者',
        publisher VARCHAR(100) COMMENT '出版社',
        publishDate DATE COMMENT '出版日期',
        category VARCHAR(50) COMMENT '图书分类',
        description TEXT COMMENT '图书简介',
        coverImage VARCHAR(255) COMMENT '封面图片路径',
        location VARCHAR(100) COMMENT '馆藏位置',
        totalCopies INT NOT NULL DEFAULT 1 COMMENT '总册数',
        availableCopies INT NOT NULL DEFAULT 1 COMMENT '可借册数',
        borrowedCopies INT NOT NULL DEFAULT 0 COMMENT '已借册数',
        reservedCopies INT NOT NULL DEFAULT 0 COMMENT '已预约册数',
        price DECIMAL(10,2) COMMENT '价格',
        language VARCHAR(20) DEFAULT '中文' COMMENT '语言',
        pages INT COMMENT '页数',
        format VARCHAR(20) COMMENT '装帧格式',
        status ENUM('active', 'inactive', 'maintenance') DEFAULT 'active' COMMENT '图书状态',
        tags JSON COMMENT '标签',
        createdTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
        updatedTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
        isActive BOOLEAN DEFAULT TRUE COMMENT '是否有效'
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='图书信息表'
    `;
    
    try {
      await query(sql);
      console.log('✅ 图书表创建成功');
    } catch (error) {
      console.error('❌ 创建图书表失败:', error);
      throw error;
    }
  }

  // 创建图书
  static async create(bookData) {
    const {
      isbn, title, author, publisher, publishDate, category, description,
      coverImage, location, totalCopies, price, language, pages, format, tags
    } = bookData;

    const sql = `
      INSERT INTO books (
        isbn, title, author, publisher, publishDate, category, description,
        coverImage, location, totalCopies, availableCopies, price, language, pages, format, tags
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    try {
      const result = await query(sql, [
        isbn, title, author, publisher, publishDate, category, description,
        coverImage, location, totalCopies, totalCopies, price, language, pages, format, 
        tags ? JSON.stringify(tags) : null
      ]);
      return result.insertId;
    } catch (error) {
      console.error('创建图书失败:', error);
      throw error;
    }
  }

  // 根据ID查找图书
  static async findById(id) {
    const sql = `
      SELECT * FROM books WHERE id = ? AND isActive = TRUE
    `;
    try {
      const rows = await query(sql, [id]);
      return rows[0] || null;
    } catch (error) {
      console.error('查找图书失败:', error);
      throw error;
    }
  }

  // 根据ISBN查找图书
  static async findByISBN(isbn) {
    const sql = `
      SELECT * FROM books WHERE isbn = ? AND isActive = TRUE
    `;
    try {
      const rows = await query(sql, [isbn]);
      return rows[0] || null;
    } catch (error) {
      console.error('根据ISBN查找图书失败:', error);
      throw error;
    }
  }

  // 搜索图书
  static async search(keyword, category = null, limit = 20, offset = 0) {
    let sql = `
      SELECT * FROM books 
      WHERE isActive = TRUE AND (
        title LIKE ? OR author LIKE ? OR isbn LIKE ? OR description LIKE ?
      )
    `;
    const params = [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`];

    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }

    sql += ' ORDER BY title ASC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    try {
      const rows = await query(sql, params);
      return rows;
    } catch (error) {
      console.error('搜索图书失败:', error);
      throw error;
    }
  }

  // 获取推荐图书
  static async getRecommended(limit = 10) {
    const sql = `
      SELECT * FROM books 
      WHERE isActive = TRUE AND availableCopies > 0
      ORDER BY RAND() 
      LIMIT ?
    `;
    try {
      const rows = await query(sql, [limit]);
      return rows;
    } catch (error) {
      console.error('获取推荐图书失败:', error);
      throw error;
    }
  }

  // 获取图书分类
  static async getCategories() {
    const sql = `
      SELECT DISTINCT category FROM books 
      WHERE isActive = TRUE AND category IS NOT NULL
      ORDER BY category
    `;
    try {
      const rows = await query(sql);
      return rows.map(row => row.category);
    } catch (error) {
      console.error('获取图书分类失败:', error);
      throw error;
    }
  }

  // 更新图书信息
  static async update(id, updateData) {
    const allowedFields = [
      'title', 'author', 'publisher', 'publishDate', 'category', 'description',
      'coverImage', 'location', 'totalCopies', 'price', 'language', 'pages', 'format', 'tags'
    ];
    
    const updates = [];
    const values = [];
    
    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key)) {
        if (key === 'tags' && value) {
          updates.push(`${key} = ?`);
          values.push(JSON.stringify(value));
        } else {
          updates.push(`${key} = ?`);
          values.push(value);
        }
      }
    }
    
    if (updates.length === 0) {
      return false;
    }
    
    const sql = `UPDATE books SET ${updates.join(', ')} WHERE id = ? AND isActive = TRUE`;
    values.push(id);
    
    try {
      const result = await query(sql, values);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('更新图书失败:', error);
      throw error;
    }
  }

  // 更新图书库存
  static async updateInventory(id, totalCopies, availableCopies, borrowedCopies, reservedCopies) {
    const sql = `
      UPDATE books 
      SET totalCopies = ?, availableCopies = ?, borrowedCopies = ?, reservedCopies = ?
      WHERE id = ? AND isActive = TRUE
    `;
    
    try {
      const result = await query(sql, [totalCopies, availableCopies, borrowedCopies, reservedCopies, id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('更新图书库存失败:', error);
      throw error;
    }
  }

  // 借阅图书（减少可借册数，增加已借册数）
  static async borrowBook(id) {
    const sql = `
      UPDATE books 
      SET availableCopies = availableCopies - 1, borrowedCopies = borrowedCopies + 1
      WHERE id = ? AND isActive = TRUE AND availableCopies > 0
    `;
    
    try {
      const result = await query(sql, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('借阅图书失败:', error);
      throw error;
    }
  }

  // 归还图书（增加可借册数，减少已借册数）
  static async returnBook(id) {
    const sql = `
      UPDATE books 
      SET availableCopies = availableCopies + 1, borrowedCopies = borrowedCopies - 1
      WHERE id = ? AND isActive = TRUE AND borrowedCopies > 0
    `;
    
    try {
      const result = await query(sql, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('归还图书失败:', error);
      throw error;
    }
  }

  // 预约图书（减少可借册数，增加已预约册数）
  static async reserveBook(id) {
    const sql = `
      UPDATE books 
      SET availableCopies = availableCopies - 1, reservedCopies = reservedCopies + 1
      WHERE id = ? AND isActive = TRUE AND availableCopies > 0
    `;
    
    try {
      const result = await query(sql, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('预约图书失败:', error);
      throw error;
    }
  }

  // 取消预约（增加可借册数，减少已预约册数）
  static async cancelReservation(id) {
    const sql = `
      UPDATE books 
      SET availableCopies = availableCopies + 1, reservedCopies = reservedCopies - 1
      WHERE id = ? AND isActive = TRUE AND reservedCopies > 0
    `;
    
    try {
      const result = await query(sql, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('取消预约失败:', error);
      throw error;
    }
  }

  // 删除图书（软删除）
  static async delete(id) {
    const sql = `
      UPDATE books SET isActive = FALSE WHERE id = ?
    `;
    
    try {
      const result = await query(sql, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('删除图书失败:', error);
      throw error;
    }
  }

  // 获取图书统计信息
  static async getStats() {
    const sql = `
      SELECT 
        COUNT(*) as totalBooks,
        SUM(totalCopies) as totalCopies,
        SUM(availableCopies) as totalAvailable,
        SUM(borrowedCopies) as totalBorrowed,
        SUM(reservedCopies) as totalReserved
      FROM books 
      WHERE isActive = TRUE
    `;
    
    try {
      const rows = await query(sql);
      return rows[0] || null;
    } catch (error) {
      console.error('获取图书统计失败:', error);
      throw error;
    }
  }
}

module.exports = Book;

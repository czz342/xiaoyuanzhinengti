const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { success, error } = require('../utils/response');
const Book = require('../models/Book');
const BookBorrowing = require('../models/BookBorrowing');
const BookReservation = require('../models/BookReservation');

// 获取图书列表
router.get('/books', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, keyword = '', category = '', status = '' } = req.query;
    const offset = (page - 1) * limit;

    let books;
    if (keyword || category) {
      books = await Book.search(keyword, category || null, parseInt(limit), offset);
    } else {
      // 获取所有图书
      const sql = `
        SELECT * FROM books 
        WHERE isActive = TRUE 
        ${status ? 'AND status = ?' : ''}
        ORDER BY createdTime DESC 
        LIMIT ? OFFSET ?
      `;
      const params = status ? [status, parseInt(limit), offset] : [parseInt(limit), offset];
      const { query } = require('../config/database');
      books = await query(sql, params);
    }

    // 获取总数
    const countSql = `
      SELECT COUNT(*) as total FROM books 
      WHERE isActive = TRUE 
      ${status ? 'AND status = ?' : ''}
    `;
    const countParams = status ? [status] : [];
    const { query: queryCount } = require('../config/database');
    const countResult = await queryCount(countSql, countParams);
    const total = countResult[0].total;

    res.json(success({
      books,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }));
  } catch (err) {
    console.error('获取图书列表失败:', err);
    res.status(500).json(error('获取图书列表失败'));
  }
});

// 获取图书详情
router.get('/books/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    
    if (!book) {
      return res.status(404).json(error('图书不存在'));
    }

    res.json(success(book));
  } catch (err) {
    console.error('获取图书详情失败:', err);
    res.status(500).json(error('获取图书详情失败'));
  }
});

// 创建图书
router.post('/books', authenticateToken, async (req, res) => {
  try {
    const bookData = req.body;
    const bookId = await Book.create(bookData);
    
    res.json(success({ id: bookId }, '图书创建成功'));
  } catch (err) {
    console.error('创建图书失败:', err);
    res.status(500).json(error('创建图书失败'));
  }
});

// 更新图书
router.put('/books/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const result = await Book.update(id, updateData);
    if (!result) {
      return res.status(404).json(error('图书不存在或更新失败'));
    }

    res.json(success(null, '图书更新成功'));
  } catch (err) {
    console.error('更新图书失败:', err);
    res.status(500).json(error('更新图书失败'));
  }
});

// 删除图书
router.delete('/books/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Book.delete(id);
    
    if (!result) {
      return res.status(404).json(error('图书不存在'));
    }

    res.json(success(null, '图书删除成功'));
  } catch (err) {
    console.error('删除图书失败:', err);
    res.status(500).json(error('删除图书失败'));
  }
});

// 获取图书分类
router.get('/categories', authenticateToken, async (req, res) => {
  try {
    const categories = await Book.getCategories();
    res.json(success(categories));
  } catch (err) {
    console.error('获取图书分类失败:', err);
    res.status(500).json(error('获取图书分类失败'));
  }
});

// 获取借阅记录
router.get('/borrowings', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status = '', userId = '' } = req.query;
    const offset = (page - 1) * limit;

    let borrowings;
    if (userId) {
      borrowings = await BookBorrowing.getByUserId(userId, status || null, parseInt(limit), offset);
    } else {
      // 获取所有借阅记录
      const sql = `
        SELECT bb.*, b.title as bookTitle, b.author as bookAuthor, b.isbn as bookISBN,
               b.coverImage as bookCover, b.location as bookLocation, u.userName, u.displayName, u.studentId
        FROM book_borrowings bb
        JOIN books b ON bb.bookId = b.id
        JOIN users u ON bb.userId = u.id
        WHERE bb.isActive = TRUE
        ${status ? 'AND bb.status = ?' : ''}
        ORDER BY bb.borrowDate DESC
        LIMIT ? OFFSET ?
      `;
      const params = status ? [status, parseInt(limit), offset] : [parseInt(limit), offset];
      const { query } = require('../config/database');
      borrowings = await query(sql, params);
    }

    // 获取总数
    const countSql = `
      SELECT COUNT(*) as total FROM book_borrowings bb
      WHERE bb.isActive = TRUE
      ${status ? 'AND bb.status = ?' : ''}
      ${userId ? 'AND bb.userId = ?' : ''}
    `;
    const countParams = [];
    if (status) countParams.push(status);
    if (userId) countParams.push(userId);
    const { query: queryCount } = require('../config/database');
    const countResult = await queryCount(countSql, countParams);
    const total = countResult[0].total;

    res.json(success({
      borrowings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }));
  } catch (err) {
    console.error('获取借阅记录失败:', err);
    res.status(500).json(error('获取借阅记录失败'));
  }
});

// 创建借阅记录
router.post('/borrowings', authenticateToken, async (req, res) => {
  try {
    const { userId, bookId, borrowDays = 30, notes = '' } = req.body;
    
    // 检查图书是否可借
    const book = await Book.findById(bookId);
    if (!book || book.availableCopies <= 0) {
      return res.status(400).json(error('图书不可借'));
    }

    // 生成借阅单号
    const borrowingNumber = await BookBorrowing.generateBorrowingNumber();
    
    // 计算借阅日期
    const borrowDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + borrowDays);

    const borrowingData = {
      borrowingNumber,
      userId,
      bookId,
      borrowDate: borrowDate.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      borrowDays,
      notes
    };

    const borrowingId = await BookBorrowing.create(borrowingData);
    
    // 更新图书库存
    await Book.borrowBook(bookId);

    res.json(success({ id: borrowingId, borrowingNumber }, '借阅成功'));
  } catch (err) {
    console.error('创建借阅记录失败:', err);
    res.status(500).json(error('创建借阅记录失败'));
  }
});

// 归还图书
router.put('/borrowings/:id/return', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { returnDate } = req.body;
    
    // 获取借阅记录
    const borrowing = await BookBorrowing.findById(id);
    if (!borrowing) {
      return res.status(404).json(error('借阅记录不存在'));
    }

    if (borrowing.status !== 'borrowed') {
      return res.status(400).json(error('图书已归还或状态异常'));
    }

    // 更新借阅状态
    await BookBorrowing.returnBook(id, returnDate);
    
    // 更新图书库存
    await Book.returnBook(borrowing.bookId);

    res.json(success(null, '归还成功'));
  } catch (err) {
    console.error('归还图书失败:', err);
    res.status(500).json(error('归还图书失败'));
  }
});

// 续借图书
router.put('/borrowings/:id/renew', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { newDueDate } = req.body;
    
    const result = await BookBorrowing.renewBook(id, newDueDate);
    if (!result) {
      return res.status(404).json(error('借阅记录不存在或状态异常'));
    }

    res.json(success(null, '续借成功'));
  } catch (err) {
    console.error('续借图书失败:', err);
    res.status(500).json(error('续借图书失败'));
  }
});

// 获取预约记录
router.get('/reservations', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status = '', userId = '' } = req.query;
    const offset = (page - 1) * limit;

    let reservations;
    if (userId) {
      reservations = await BookReservation.getByUserId(userId, status || null);
    } else {
      // 获取所有预约记录
      const sql = `
        SELECT br.*, b.title as bookTitle, b.author as bookAuthor, b.isbn as bookISBN,
               b.coverImage as bookCover, u.userName, u.displayName, u.studentId
        FROM book_reservations br
        JOIN books b ON br.bookId = b.id
        JOIN users u ON br.userId = u.id
        WHERE br.isActive = TRUE
        ${status ? 'AND br.status = ?' : ''}
        ORDER BY br.reservationDate DESC
        LIMIT ? OFFSET ?
      `;
      const params = status ? [status, parseInt(limit), offset] : [parseInt(limit), offset];
      const { query } = require('../config/database');
      reservations = await query(sql, params);
    }

    // 获取总数
    const countSql = `
      SELECT COUNT(*) as total FROM book_reservations br
      WHERE br.isActive = TRUE
      ${status ? 'AND br.status = ?' : ''}
      ${userId ? 'AND br.userId = ?' : ''}
    `;
    const countParams = [];
    if (status) countParams.push(status);
    if (userId) countParams.push(userId);
    const { query: queryCount } = require('../config/database');
    const countResult = await queryCount(countSql, countParams);
    const total = countResult[0].total;

    res.json(success({
      reservations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }));
  } catch (err) {
    console.error('获取预约记录失败:', err);
    res.status(500).json(error('获取预约记录失败'));
  }
});

// 创建预约记录
router.post('/reservations', authenticateToken, async (req, res) => {
  try {
    const { userId, bookId, notes = '' } = req.body;
    
    // 检查图书是否存在
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json(error('图书不存在'));
    }

    // 生成预约单号
    const reservationNumber = await BookReservation.generateReservationNumber();
    
    const reservationData = {
      reservationNumber,
      userId,
      bookId,
      reservationDate: new Date().toISOString().split('T')[0],
      notes
    };

    const reservationId = await BookReservation.create(reservationData);
    
    // 更新图书库存
    await Book.reserveBook(bookId);

    res.json(success({ id: reservationId, reservationNumber }, '预约成功'));
  } catch (err) {
    console.error('创建预约记录失败:', err);
    res.status(500).json(error('创建预约记录失败'));
  }
});

// 取消预约
router.put('/reservations/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    
    // 获取预约记录
    const reservation = await BookReservation.findById(id);
    if (!reservation) {
      return res.status(404).json(error('预约记录不存在'));
    }

    if (reservation.userId !== parseInt(userId)) {
      return res.status(403).json(error('无权限取消此预约'));
    }

    // 取消预约
    const result = await BookReservation.cancelReservation(id, userId);
    if (!result) {
      return res.status(400).json(error('取消预约失败'));
    }
    
    // 更新图书库存
    await Book.cancelReservation(reservation.bookId);

    res.json(success(null, '取消预约成功'));
  } catch (err) {
    console.error('取消预约失败:', err);
    res.status(500).json(error('取消预约失败'));
  }
});

// 获取统计信息
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const bookStats = await Book.getStats();
    const borrowingStats = await BookBorrowing.getStats();
    const reservationStats = await BookReservation.getStats();

    res.json(success({
      books: bookStats,
      borrowings: borrowingStats,
      reservations: reservationStats
    }));
  } catch (err) {
    console.error('获取统计信息失败:', err);
    res.status(500).json(error('获取统计信息失败'));
  }
});

// 获取逾期记录
router.get('/overdue', authenticateToken, async (req, res) => {
  try {
    const overdueRecords = await BookBorrowing.getOverdueRecords();
    res.json(success(overdueRecords));
  } catch (err) {
    console.error('获取逾期记录失败:', err);
    res.status(500).json(error('获取逾期记录失败'));
  }
});

module.exports = router;


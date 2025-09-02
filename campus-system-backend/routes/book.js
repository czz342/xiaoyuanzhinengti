const express = require('express');
const Book = require('../models/Book');
const BookBorrowing = require('../models/BookBorrowing');
const BookReservation = require('../models/BookReservation');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const { success, error, paginated, list } = require('../utils/response');
const router = express.Router();

// 图书相关路由
// 获取图书列表
router.get('/list', async (req, res) => {
  try {
    const { page = 1, limit = 20, category } = req.query;
    const offset = (page - 1) * limit;
    
    let books;
    if (category) {
      books = await Book.search('', category, limit, offset);
    } else {
      books = await Book.getRecommended(limit);
    }
    
    res.json(success('获取图书列表成功', books));
  } catch (err) {
    console.error('获取图书列表错误:', err);
    res.status(500).json(error('获取图书列表失败', 500));
  }
});

// 搜索图书
router.get('/search', async (req, res) => {
  try {
    const { keyword, category, page = 1, limit = 20 } = req.query;
    
    if (!keyword) {
      return res.status(400).json(error('搜索关键词不能为空', 400));
    }
    
    const offset = (page - 1) * limit;
    const books = await Book.search(keyword, category, limit, offset);
    
    res.json(success('搜索图书成功', books));
  } catch (err) {
    console.error('搜索图书错误:', err);
    res.status(500).json(error('搜索图书失败', 500));
  }
});

// 获取图书详情
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    
    if (!book) {
      return res.status(404).json(error('图书不存在', 404));
    }
    
    res.json(success('获取图书详情成功', book));
  } catch (err) {
    console.error('获取图书详情错误:', err);
    res.status(500).json(error('获取图书详情失败', 500));
  }
});

// 获取图书分类
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Book.getCategories();
    res.json(success('获取图书分类成功', categories));
  } catch (err) {
    console.error('获取图书分类错误:', err);
    res.status(500).json(error('获取图书分类失败', 500));
  }
});

// 获取图书统计信息
router.get('/stats/overview', async (req, res) => {
  try {
    const bookStats = await Book.getStats();
    const borrowingStats = await BookBorrowing.getStats();
    const reservationStats = await BookReservation.getStats();
    
    const stats = {
      books: bookStats,
      borrowings: borrowingStats,
      reservations: reservationStats
    };
    
    res.json(success('获取统计信息成功', stats));
  } catch (err) {
    console.error('获取统计信息错误:', err);
    res.status(500).json(error('获取统计信息失败', 500));
  }
});

// 管理员功能：创建图书
router.post('/', authenticateToken, async (req, res) => {
  try {
    // 检查权限
    if (req.user.role !== 'admin') {
      return res.status(403).json(error('权限不足', 403));
    }
    
    const bookData = req.body;
    const bookId = await Book.create(bookData);
    const book = await Book.findById(bookId);
    
    res.json(success('图书创建成功', book));
  } catch (err) {
    console.error('创建图书错误:', err);
    res.status(500).json(error('创建图书失败', 500));
  }
});

// 管理员功能：更新图书
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    // 检查权限
    if (req.user.role !== 'admin') {
      return res.status(403).json(error('权限不足', 403));
    }
    
    const { id } = req.params;
    const updateData = req.body;
    
    const updated = await Book.update(id, updateData);
    if (!updated) {
      return res.status(404).json(error('图书不存在', 404));
    }
    
    const book = await Book.findById(id);
    res.json(success('图书信息更新成功', book));
  } catch (err) {
    console.error('更新图书错误:', err);
    res.status(500).json(error('更新图书失败', 500));
  }
});

// 管理员功能：删除图书
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    // 检查权限
    if (req.user.role !== 'admin') {
      return res.status(403).json(error('权限不足', 403));
    }
    
    const { id } = req.params;
    const deleted = await Book.delete(id);
    
    if (!deleted) {
      return res.status(404).json(error('图书不存在', 404));
    }
    
    res.json(success('图书删除成功'));
  } catch (err) {
    console.error('删除图书错误:', err);
    res.status(500).json(error('删除图书失败', 500));
  }
});

// 借阅相关路由
// 借阅图书
router.post('/borrow', authenticateToken, async (req, res) => {
  try {
    const { bookId, borrowDays = 30, notes = '' } = req.body;
    
    // 验证必填字段
    if (!bookId || !borrowDays) {
      return res.status(400).json(error('缺少必要参数', 400));
    }
    
    // 检查图书是否存在且可借
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json(error('图书不存在', 404));
    }
    
    if (book.availableCopies <= 0) {
      return res.status(400).json(error('图书库存不足', 400));
    }
    
    // 计算借阅日期和应还日期
    const borrowDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + borrowDays);
    
    // 生成借阅单号
    const borrowingNumber = await BookBorrowing.generateBorrowingNumber();
    
    // 创建借阅记录
    const borrowingData = {
      borrowingNumber,
      userId: req.user.id,
      bookId,
      borrowDate: borrowDate.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      borrowDays,
      notes
    };
    
    const borrowingId = await BookBorrowing.create(borrowingData);
    
    // 更新图书库存
    await Book.borrowBook(bookId);
    
    // 获取完整的借阅记录
    const borrowing = await BookBorrowing.findById(borrowingId);
    
    res.json(success('借阅成功', borrowing));
  } catch (err) {
    console.error('借阅图书错误:', err);
    res.status(500).json(error('借阅图书失败', 500));
  }
});

// 归还图书
router.put('/return/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { returnDate } = req.body;
    
    // 查找借阅记录
    const borrowing = await BookBorrowing.findById(id);
    if (!borrowing) {
      return res.status(404).json(error('借阅记录不存在', 404));
    }
    
    // 检查权限：只能归还自己的借阅记录
    if (borrowing.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json(error('权限不足', 403));
    }
    
    // 归还图书
    const returned = await BookBorrowing.returnBook(id, returnDate);
    if (!returned) {
      return res.status(400).json(error('归还失败，图书可能已经归还', 400));
    }
    
    // 更新图书库存
    await Book.returnBook(borrowing.bookId);
    
    // 检查是否有预约用户需要通知
    await BookReservation.notifyAvailable(borrowing.bookId);
    
    // 获取更新后的借阅记录
    const updatedBorrowing = await BookBorrowing.findById(id);
    
    res.json(success('归还成功', updatedBorrowing));
  } catch (err) {
    console.error('归还图书错误:', err);
    res.status(500).json(error('归还图书失败', 500));
  }
});

// 续借图书
router.put('/renew/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { additionalDays = 30 } = req.body;
    
    // 查找借阅记录
    const borrowing = await BookBorrowing.findById(id);
    if (!borrowing) {
      return res.status(404).json(error('借阅记录不存在', 404));
    }
    
    // 检查权限：只能续借自己的借阅记录
    if (borrowing.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json(error('权限不足', 403));
    }
    
    // 计算新的应还日期
    const newDueDate = new Date(borrowing.dueDate);
    newDueDate.setDate(newDueDate.getDate() + additionalDays);
    
    // 续借图书
    const renewed = await BookBorrowing.renewBook(id, newDueDate.toISOString().split('T')[0]);
    if (!renewed) {
      return res.status(400).json(error('续借失败', 400));
    }
    
    // 获取更新后的借阅记录
    const updatedBorrowing = await BookBorrowing.findById(id);
    
    res.json(success('续借成功', updatedBorrowing));
  } catch (err) {
    console.error('续借图书错误:', err);
    res.status(500).json(error('续借图书失败', 500));
  }
});

// 获取用户的借阅记录
router.get('/borrowings/my', authenticateToken, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    const borrowings = await BookBorrowing.getByUserId(req.user.id, status, limit, offset);
    res.json(success('获取借阅记录成功', borrowings));
  } catch (err) {
    console.error('获取借阅记录错误:', err);
    res.status(500).json(error('获取借阅记录失败', 500));
  }
});

// 获取借阅记录详情
router.get('/borrowings/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const borrowing = await BookBorrowing.findById(id);
    
    if (!borrowing) {
      return res.status(404).json(error('借阅记录不存在', 404));
    }
    
    // 检查权限：只能查看自己的借阅记录或管理员可以查看所有
    if (borrowing.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json(error('权限不足', 403));
    }
    
    res.json(success('获取借阅记录详情成功', borrowing));
  } catch (err) {
    console.error('获取借阅记录详情错误:', err);
    res.status(500).json(error('获取借阅记录详情失败', 500));
  }
});

// 预约相关路由
// 预约图书
router.post('/reserve', authenticateToken, async (req, res) => {
  try {
    const { bookId, notes = '' } = req.body;
    
    // 验证必填字段
    if (!bookId) {
      return res.status(400).json(error('缺少必要参数', 400));
    }
    
    // 检查图书是否存在
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json(error('图书不存在', 404));
    }
    
    // 检查是否已经预约过
    const existingReservations = await BookReservation.getByUserId(req.user.id, 'pending');
    const alreadyReserved = existingReservations.some(r => r.bookId === bookId);
    if (alreadyReserved) {
      return res.status(400).json(error('您已经预约过这本书', 400));
    }
    
    // 生成预约单号
    const reservationNumber = await BookReservation.generateReservationNumber();
    
    // 创建预约记录
    const reservationData = {
      reservationNumber,
      userId: req.user.id,
      bookId,
      reservationDate: new Date().toISOString().split('T')[0],
      notes
    };
    
    const reservationId = await BookReservation.create(reservationData);
    
    // 获取完整的预约记录
    const reservation = await BookReservation.findById(reservationId);
    
    res.json(success('预约成功', reservation));
  } catch (err) {
    console.error('预约图书错误:', err);
    res.status(500).json(error('预约图书失败', 500));
  }
});

// 取消预约
router.put('/reservations/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // 查找预约记录
    const reservation = await BookReservation.findById(id);
    if (!reservation) {
      return res.status(404).json(error('预约记录不存在', 404));
    }
    
    // 检查权限：只能取消自己的预约
    if (reservation.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json(error('权限不足', 403));
    }
    
    // 取消预约
    const cancelled = await BookReservation.cancelReservation(id, req.user.id);
    if (!cancelled) {
      return res.status(400).json(error('取消预约失败', 400));
    }
    
    res.json(success('取消预约成功'));
  } catch (err) {
    console.error('取消预约错误:', err);
    res.status(500).json(error('取消预约失败', 500));
  }
});

// 获取用户的预约记录
router.get('/reservations/my', authenticateToken, async (req, res) => {
  try {
    const { status } = req.query;
    const reservations = await BookReservation.getByUserId(req.user.id, status);
    res.json(success('获取预约记录成功', reservations));
  } catch (err) {
    console.error('获取预约记录错误:', err);
    res.status(500).json(error('获取预约记录失败', 500));
  }
});

// 获取预约记录详情
router.get('/reservations/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await BookReservation.findById(id);
    
    if (!reservation) {
      return res.status(404).json(error('预约记录不存在', 404));
    }
    
    // 检查权限：只能查看自己的预约记录或管理员可以查看所有
    if (reservation.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json(error('权限不足', 403));
    }
    
    res.json(success('获取预约记录详情成功', reservation));
  } catch (err) {
    console.error('获取预约记录详情错误:', err);
    res.status(500).json(error('获取预约记录详情失败', 500));
  }
});

// 管理员功能：获取逾期记录
router.get('/borrowings/overdue/list', authenticateToken, async (req, res) => {
  try {
    // 检查权限
    if (req.user.role !== 'admin') {
      return res.status(403).json(error('权限不足', 403));
    }
    
    const overdueRecords = await BookBorrowing.getOverdueRecords();
    res.json(success('获取逾期记录成功', overdueRecords));
  } catch (err) {
    console.error('获取逾期记录错误:', err);
    res.status(500).json(error('获取逾期记录失败', 500));
  }
});

// 管理员功能：计算罚金
router.post('/borrowings/:id/calculate-fine', authenticateToken, async (req, res) => {
  try {
    // 检查权限
    if (req.user.role !== 'admin') {
      return res.status(403).json(error('权限不足', 403));
    }
    
    const { id } = req.params;
    const fine = await BookBorrowing.calculateFine(id);
    
    res.json(success('计算罚金成功', { fine }));
  } catch (err) {
    console.error('计算罚金错误:', err);
    res.status(500).json(error('计算罚金失败', 500));
  }
});

module.exports = router;

const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
const { success, error } = require('../utils/response');
const config = require('../config/config');

const router = express.Router();

// 用户注册
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, real_name, student_id, phone, userName, displayName, studentId } = req.body;
    
    // 支持两种字段名
    const actualUsername = username || userName;
    const actualEmail = email;
    const actualPassword = password;
    const actualDisplayName = real_name || displayName || actualUsername;
    const actualStudentId = student_id || studentId;

    // 输入验证
    if (!actualUsername || !actualEmail || !actualPassword) {
      return res.status(400).json(error('用户名、邮箱和密码为必填项', 400));
    }

    if (password.length < 6) {
      return res.status(400).json(error('密码长度至少6位', 400));
    }

    // 检查用户名是否已存在
    const existingUser = await User.findByUsername(actualUsername);
    if (existingUser) {
      return res.status(400).json(error('用户名已存在', 400));
    }

    // 检查邮箱是否已存在
    const existingEmail = await User.findByEmail(actualEmail);
    if (existingEmail) {
      return res.status(400).json(error('邮箱已被注册', 400));
    }

    // 生成唯一的userId
    const userId = `USER${Date.now()}`;

    // 创建用户
    const newUser = await User.create({
      userId,
      userName: actualUsername,
      email: actualEmail,
      password: actualPassword,
      displayName: actualDisplayName,
      studentId: actualStudentId,
      phone,
      picture: null
    });

    // 生成JWT令牌
    const token = jwt.sign(
      { 
        id: newUser.id, 
        userId: newUser.userId,
        userName: newUser.userName,
        studentId: newUser.studentId,
        phone: newUser.phone
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    res.status(201).json(success('注册成功', {
      user: {
        id: newUser.id,
        userId: newUser.userId,
        userName: newUser.userName,
        email: newUser.email,
        displayName: newUser.displayName,
        studentId: newUser.studentId,
        phone: newUser.phone,
        creditScore: newUser.creditScore,
        completedOrders: newUser.completedOrders
      },
      token
    }));

  } catch (err) {
    console.error('注册错误:', err);
    res.status(500).json(error('注册失败，请稍后重试', 500));
  }
});

// 用户登录
router.post('/login', async (req, res) => {
  try {
    const { username, password, userName } = req.body;
    
    // 支持两种字段名
    const actualUsername = username || userName;

    // 输入验证
    if (!actualUsername || !password) {
      return res.status(400).json(error('用户名和密码为必填项', 400));
    }

    // 查找用户
    const user = await User.findByUsername(actualUsername);
    if (!user) {
      return res.status(401).json(error('用户名或密码错误', 401));
    }

    // 检查用户状态
    if (user.status !== 'active') {
      return res.status(403).json(error('账户已被禁用，请联系管理员', 403));
    }

    // 验证密码
    const isValidPassword = await User.verifyPassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json(error('用户名或密码错误', 401));
    }

    // 生成JWT令牌
    const token = jwt.sign(
      { 
        id: user.id, 
        userId: user.userId,
        userName: user.userName,
        studentId: user.studentId,
        phone: user.phone
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    res.json(success('登录成功', {
      user: {
        id: user.id,
        userId: user.userId,
        userName: user.userName,
        email: user.email,
        displayName: user.displayName,
        studentId: user.studentId,
        phone: user.phone,
        picture: user.picture,
        creditScore: user.creditScore,
        completedOrders: user.completedOrders
      },
      token
    }));

  } catch (err) {
    console.error('登录错误:', err);
    res.status(500).json(error('登录失败，请稍后重试', 500));
  }
});

// 获取当前用户信息
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json(error('用户不存在', 404));
    }

    res.json(success('获取用户信息成功', user));
  } catch (err) {
    console.error('获取用户信息错误:', err);
    res.status(500).json(error('获取用户信息失败', 500));
  }
});

// 刷新令牌
router.post('/refresh', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json(error('用户不存在', 404));
    }

    // 生成新的JWT令牌
    const newToken = jwt.sign(
      { 
        id: user.id, 
        userId: user.userId,
        userName: user.userName,
        studentId: user.studentId,
        phone: user.phone
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    res.json(success('令牌刷新成功', { token: newToken }));
  } catch (err) {
    console.error('令牌刷新错误:', err);
    res.status(500).json(error('令牌刷新失败', 500));
  }
});

// 忘记密码
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    // 输入验证
    if (!email) {
      return res.status(400).json(error('邮箱地址不能为空', 400));
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json(error('邮箱格式不正确', 400));
    }

    // 查找用户
    const user = await User.findByEmail(email);
    if (!user) {
      // 为了安全，不暴露用户是否存在
      return res.json(success('如果邮箱存在，重置链接已发送'));
    }

    // 生成重置令牌（这里简化处理，实际应该发送邮件）
    const resetToken = jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        type: 'reset'
      },
      config.jwt.secret,
      { expiresIn: '1h' } // 重置令牌1小时有效
    );

    // 这里应该发送邮件，现在只是模拟
    console.log(`密码重置链接已发送到 ${email}: http://localhost:3000/reset-password?token=${resetToken}`);

    res.json(success('重置链接已发送到您的邮箱'));

  } catch (err) {
    console.error('忘记密码错误:', err);
    res.status(500).json(error('发送重置链接失败，请稍后重试', 500));
  }
});

// 重置密码
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json(error('重置令牌和新密码不能为空', 400));
    }

    if (newPassword.length < 6) {
      return res.status(400).json(error('新密码长度至少6位', 400));
    }

    // 验证重置令牌
    const decoded = jwt.verify(token, config.jwt.secret);
    if (decoded.type !== 'reset') {
      return res.status(400).json(error('无效的重置令牌', 400));
    }

    // 查找用户
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json(error('用户不存在', 404));
    }

    // 更新密码
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updatePassword(user.id, hashedPassword);

    res.json(success('密码重置成功'));

  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(400).json(error('重置令牌无效或已过期', 400));
    }
    console.error('重置密码错误:', err);
    res.status(500).json(error('重置密码失败，请稍后重试', 500));
  }
});

// 用户登出（客户端删除令牌即可）
router.post('/logout', (req, res) => {
  res.json(success('登出成功'));
});

module.exports = router;

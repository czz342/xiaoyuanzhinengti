const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
const { success, error, paginated } = require('../utils/response');

const router = express.Router();

// 所有路由都需要认证
router.use(authenticateToken);

// 头像上传配置
const avatarsDir = path.join(__dirname, '..', 'uploads', 'avatars');
if (!fs.existsSync(avatarsDir)) {
  fs.mkdirSync(avatarsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, avatarsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeUserId = req.user.userId || `uid-${req.user.id}`;
    const filename = `${safeUserId}-${Date.now()}${ext}`;
    cb(null, filename);
  }
});

const allowedMime = new Set(['image/jpeg', 'image/png', 'image/webp']);
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!allowedMime.has(file.mimetype)) {
      return cb(new Error('不支持的文件类型'));
    }
    cb(null, true);
  }
});

// 更新头像
router.post('/avatar', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json(error('未选择文件'));
    }

    const relPath = path.posix.join('uploads', 'avatars', path.basename(req.file.path));
    const host = req.get('host');
    const protocol = (req.headers['x-forwarded-proto'] || req.protocol || 'http').split(',')[0];
    const baseUrl = `${protocol}://${host}`;
    const pictureUrl = `${baseUrl}/${relPath.replace(/\\/g, '/')}`;

    // 更新数据库中的头像地址
    const updated = await User.update(req.user.id, { picture: pictureUrl });
    if (!updated) {
      return res.status(500).json(error('更新头像失败'));
    }

    return res.json(success('头像更新成功', { pictureUrl }));
  } catch (err) {
    console.error('上传头像错误:', err);
    if (err.message && err.message.includes('文件类型')) {
      return res.status(415).json(error('不支持的文件类型'));
    }
    return res.status(500).json(error('上传失败'));
  }
});

// 获取用户列表（管理员功能）
router.get('/list', async (req, res) => {
  try {
    // 检查权限（只有管理员可以查看用户列表）
    if (req.user.role !== 'admin') {
      return error(res, '权限不足', 403);
    }

    const { page = 1, limit = 10, search = '' } = req.query;
    const result = await User.getList(page, limit, search);

    paginated(res, result.users, page, limit, result.total, '获取用户列表成功');
  } catch (err) {
    console.error('获取用户列表错误:', err);
    error(res, '获取用户列表失败', 500);
  }
});

// 获取指定用户信息
router.get('/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    // 检查权限（只能查看自己的信息，或者管理员可以查看所有）
    if (req.user.role !== 'admin' && req.user.id !== userId) {
      return error(res, '权限不足', 403);
    }

    const user = await User.findById(userId);
    if (!user) {
      return error(res, '用户不存在', 404);
    }

    success(res, user, '获取用户信息成功');
  } catch (err) {
    console.error('获取用户信息错误:', err);
    error(res, '获取用户信息失败', 500);
  }
});

// 更新用户信息
router.put('/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const updateData = req.body;
    
    // 检查权限（只能更新自己的信息，或者管理员可以更新所有）
    if (req.user.role !== 'admin' && req.user.id !== userId) {
      return error(res, '权限不足', 403);
    }

    // 普通用户不能更新敏感字段
    if (req.user.role !== 'admin') {
      delete updateData.role;
      delete updateData.status;
    }

    const result = await User.update(userId, updateData);
    if (result) {
      success(res, null, '用户信息更新成功');
    } else {
      error(res, '用户信息更新失败', 500);
    }
  } catch (err) {
    console.error('更新用户信息错误:', err);
    error(res, '更新用户信息失败', 500);
  }
});

// 删除用户（管理员功能）
router.delete('/:id', async (req, res) => {
  try {
    // 检查权限（只有管理员可以删除用户）
    if (req.user.role !== 'admin') {
      return error(res, '权限不足', 403);
    }

    const userId = parseInt(req.params.id);
    
    // 不能删除自己
    if (req.user.id === userId) {
      return error(res, '不能删除自己的账户', 400);
    }

    // 这里可以添加删除用户的逻辑
    // 为了安全，建议只是标记为删除状态，而不是物理删除
    
    success(res, null, '用户删除成功');
  } catch (err) {
    console.error('删除用户错误:', err);
    error(res, '删除用户失败', 500);
  }
});

// 修改密码
router.put('/:id/password', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { oldPassword, newPassword } = req.body;
    
    // 检查权限（只能修改自己的密码）
    if (req.user.id !== userId) {
      return error(res, '权限不足', 403);
    }

    if (!oldPassword || !newPassword) {
      return error(res, '旧密码和新密码为必填项', 400);
    }

    if (newPassword.length < 6) {
      return error(res, '新密码长度至少6位', 400);
    }

    // 获取用户信息
    const user = await User.findById(userId);
    if (!user) {
      return error(res, '用户不存在', 404);
    }

    // 验证旧密码
    const isValidPassword = await User.verifyPassword(oldPassword, user.password);
    if (!isValidPassword) {
      return error(res, '旧密码错误', 400);
    }

    // 更新密码
    const bcrypt = require('bcryptjs');
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    
    await User.update(userId, { password: hashedPassword });
    
    success(res, null, '密码修改成功');
  } catch (err) {
    console.error('修改密码错误:', err);
    error(res, '修改密码失败', 500);
  }
});

module.exports = router;

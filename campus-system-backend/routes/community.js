const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Like = require('../models/Like');
const User = require('../models/User');
const { success, error } = require('../utils/response');

// 获取帖子列表
router.get('/posts', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      keyword,
      sort_by = 'created_at',
      sort_order = 'DESC',
      is_featured
    } = req.query;

    const filters = {
      category,
      keyword,
      sort_by,
      sort_order,
      is_featured: is_featured === 'true',
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    };

    let posts;
    if (keyword) {
      posts = await Post.search(keyword, filters);
    } else {
      posts = await Post.list(filters);
    }

    // 获取用户点赞状态（如果已登录）
    const token = req.headers.authorization?.replace('Bearer ', '');
    let likedPosts = {};
    if (token) {
      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const userId = decoded.studentId || decoded.userId || decoded.id;
        
        const targets = posts.map(post => ({ type: 'post', id: post.id }));
        likedPosts = await Like.batchCheckLiked(userId, targets);
      } catch (err) {
        // Token无效，忽略点赞状态
      }
    }

    // 为每个帖子添加点赞状态
    posts = posts.map(post => ({
      ...post,
      is_liked: likedPosts[`post_${post.id}`] || false
    }));

    return res.json(success('获取帖子列表成功', {
      posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: posts.length
      }
    }));

  } catch (err) {
    console.error('GET /api/community/posts', err);
    return res.status(500).json(error('获取帖子列表失败'));
  }
});

// 获取帖子详情
router.get('/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.getById(id);
    
    if (!post) {
      return res.status(404).json(error('帖子不存在'));
    }

    // 增加浏览数
    await Post.incrementViewCount(id);

    // 获取作者的用户数据库ID
    let authorDbId = null;
    if (post.author_id) {
      try {
        const author = await User.findByStudentId(post.author_id);
        if (author) {
          authorDbId = author.id;
        }
      } catch (err) {
        console.error('获取作者数据库ID失败:', err);
      }
    }

    // 获取用户点赞状态（如果已登录）
    const token = req.headers.authorization?.replace('Bearer ', '');
    let isLiked = false;
    if (token) {
      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const userId = decoded.studentId || decoded.userId || decoded.id;
        isLiked = await Like.isLiked(userId, 'post', id);
      } catch (err) {
        // Token无效，忽略点赞状态
      }
    }

    return res.json(success('获取帖子详情成功', {
      ...post,
      author_db_id: authorDbId,
      is_liked: isLiked
    }));

  } catch (err) {
    console.error('GET /api/community/posts/:id', err);
    return res.status(500).json(error('获取帖子详情失败'));
  }
});

// 创建帖子
router.post('/posts', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.studentId || req.user.userId || String(req.user.id || '');
    const userInfo = req.user || {};

    // 查询数据库用户（优先使用数据库昵称与头像）
    let dbUser = null;
    if (req.user.studentId) {
      dbUser = await User.findByStudentId(req.user.studentId);
    }
    if (!dbUser && req.user.userId) {
      dbUser = await User.findByUserId(req.user.userId);
    }
    if (!dbUser && req.user.id) {
      dbUser = await User.findById(req.user.id);
    }

    const nickname = (dbUser && (dbUser.displayName || dbUser.userName))
      || userInfo.nickName || userInfo.displayName || userInfo.userName || '匿名用户';
    const avatar = (dbUser && dbUser.picture)
      || userInfo.avatarUrl || userInfo.picture || '/static/images/default-avatar.png';

    const postData = {
      ...req.body,
      author_id: userId,
      author_name: nickname,
      author_avatar: avatar
    };

    const postId = await Post.create(postData);

    return res.json(success('发布帖子成功', { postId }));

  } catch (err) {
    console.error('POST /api/community/posts', err);
    return res.status(500).json(error('发布帖子失败'));
  }
});

// 更新帖子
router.put('/posts/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.studentId || req.user.userId || String(req.user.id || '');
    
    // 检查帖子是否存在且是作者
    const post = await Post.getById(id);
    if (!post) {
      return res.status(404).json(error('帖子不存在'));
    }
    
    if (post.author_id !== userId) {
      return res.status(403).json(error('无权限修改此帖子'));
    }

    const updated = await Post.update(id, req.body);
    
    if (!updated) {
      return res.status(400).json(error('更新帖子失败'));
    }

    return res.json(success('更新帖子成功'));

  } catch (err) {
    console.error('PUT /api/community/posts/:id', err);
    return res.status(500).json(error('更新帖子失败'));
  }
});

// 删除帖子
router.delete('/posts/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.studentId || req.user.userId || String(req.user.id || '');
    
    // 检查帖子是否存在且是作者
    const post = await Post.getById(id);
    if (!post) {
      return res.status(404).json(error('帖子不存在'));
    }
    
    if (post.author_id !== userId) {
      return res.status(403).json(error('无权限删除此帖子'));
    }

    const deleted = await Post.delete(id);
    
    if (!deleted) {
      return res.status(400).json(error('删除帖子失败'));
    }

    return res.json(success('删除帖子成功'));

  } catch (err) {
    console.error('DELETE /api/community/posts/:id', err);
    return res.status(500).json(error('删除帖子失败'));
  }
});

// 获取帖子评论
router.get('/posts/:id/comments', async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20, sort_by = 'created_at', sort_order = 'ASC' } = req.query;

    const filters = {
      sort_by,
      sort_order,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    };

    const comments = await Comment.getByPostId(id, filters);

    // 获取用户点赞状态（如果已登录）
    const token = req.headers.authorization?.replace('Bearer ', '');
    let likedComments = {};
    if (token) {
      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const userId = decoded.studentId || decoded.userId || decoded.id;
        
        const targets = comments.map(comment => ({ type: 'comment', id: comment.id }));
        likedComments = await Like.batchCheckLiked(userId, targets);
      } catch (err) {
        // Token无效，忽略点赞状态
      }
    }

    // 为每个评论添加点赞状态和用户数据库ID
    const commentsWithLikes = await Promise.all(comments.map(async (comment) => {
      let userDbId = null;
      if (comment.user_id) {
        try {
          const user = await User.findByStudentId(comment.user_id);
          if (user) {
            userDbId = user.id;
          }
        } catch (err) {
          console.error('获取评论者数据库ID失败:', err);
        }
      }
      
      return {
        ...comment,
        user_db_id: userDbId,
        is_liked: likedComments[`comment_${comment.id}`] || false
      };
    }));

    return res.json(success('获取评论成功', {
      comments: commentsWithLikes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: comments.length
      }
    }));

  } catch (err) {
    console.error('GET /api/community/posts/:id/comments', err);
    return res.status(500).json(error('获取评论失败'));
  }
});

// 创建评论
router.post('/posts/:id/comments', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.studentId || req.user.userId || String(req.user.id || '');
    const userInfo = req.user || {};

    // 检查帖子是否存在
    const post = await Post.getById(id);
    if (!post) {
      return res.status(404).json(error('帖子不存在'));
    }

    // 检查是否允许评论
    if (!post.allow_comments) {
      return res.status(403).json(error('此帖子不允许评论'));
    }

    // 查询数据库用户（优先使用数据库昵称与头像）
    let dbUser = null;
    if (req.user.studentId) {
      dbUser = await User.findByStudentId(req.user.studentId);
    }
    if (!dbUser && req.user.userId) {
      dbUser = await User.findByUserId(req.user.userId);
    }
    if (!dbUser && req.user.id) {
      dbUser = await User.findById(req.user.id);
    }

    const nickname = (dbUser && (dbUser.displayName || dbUser.userName))
      || userInfo.nickName || userInfo.displayName || userInfo.userName || '匿名用户';
    const avatar = (dbUser && dbUser.picture)
      || userInfo.avatarUrl || userInfo.picture || '/static/images/default-avatar.png';

    const commentData = {
      post_id: id,
      user_id: userId,
      user_name: nickname,
      user_avatar: avatar,
      content: req.body.content,
      parent_id: req.body.parent_id || null
    };

    const commentId = await Comment.create(commentData);

    // 更新帖子的评论数
    await Post.updateCommentCount(id, 1);

    return res.json(success('发表评论成功', { commentId }));

  } catch (err) {
    console.error('POST /api/community/posts/:id/comments', err);
    return res.status(500).json(error('发表评论失败'));
  }
});

// 删除评论
router.delete('/comments/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.studentId || req.user.userId || String(req.user.id || '');
    
    // 检查评论是否存在且是作者
    const comment = await Comment.getById(id);
    if (!comment) {
      return res.status(404).json(error('评论不存在'));
    }
    
    if (comment.user_id !== userId) {
      return res.status(403).json(error('无权限删除此评论'));
    }

    const deleted = await Comment.delete(id);
    
    if (!deleted) {
      return res.status(400).json(error('删除评论失败'));
    }

    // 更新帖子的评论数
    await Post.updateCommentCount(comment.post_id, -1);

    return res.json(success('删除评论成功'));

  } catch (err) {
    console.error('DELETE /api/community/comments/:id', err);
    return res.status(500).json(error('删除评论失败'));
  }
});

// 点赞/取消点赞
router.post('/like', authenticateToken, async (req, res) => {
  try {
    const { target_type, target_id } = req.body;
    const userId = req.user.studentId || req.user.userId || String(req.user.id || '');
    
    if (!['post', 'comment'].includes(target_type)) {
      return res.status(400).json(error('无效的目标类型'));
    }

    // 检查是否已点赞
    const isLiked = await Like.isLiked(userId, target_type, target_id);
    
    if (isLiked) {
      // 取消点赞
      await Like.delete(userId, target_type, target_id);
      
      // 更新点赞数
      if (target_type === 'post') {
        await Post.updateLikeCount(target_id, -1);
      } else if (target_type === 'comment') {
        await Comment.updateLikeCount(target_id, -1);
      }
      
      return res.json(success('取消点赞成功', { is_liked: false }));
    } else {
      // 添加点赞
      await Like.create({ user_id: userId, target_type, target_id });
      
      // 更新点赞数
      if (target_type === 'post') {
        await Post.updateLikeCount(target_id, 1);
      } else if (target_type === 'comment') {
        await Comment.updateLikeCount(target_id, 1);
      }
      
      return res.json(success('点赞成功', { is_liked: true }));
    }

  } catch (err) {
    console.error('POST /api/community/like', err);
    return res.status(500).json(error('操作失败'));
  }
});

// 获取分类统计
router.get('/categories/stats', async (req, res) => {
  try {
    const stats = await Post.getCategoryStats();
    
    const categoryNames = {
      'second_hand': '二手市场',
      'dating': '恋爱交友',
      'help': '打听求助',
      'part_time': '发布兼职',
      'gossip': '校园八卦'
    };
    
    const formattedStats = stats.map(stat => ({
      category: stat.category,
      name: categoryNames[stat.category] || stat.category,
      count: stat.count
    }));

    return res.json(success('获取分类统计成功', { stats: formattedStats }));

  } catch (err) {
    console.error('GET /api/community/categories/stats', err);
    return res.status(500).json(error('获取分类统计失败'));
  }
});

// 获取用户的帖子
router.get('/users/:userId/posts', async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const filters = {
      author_id: userId,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    };

    const posts = await Post.list(filters);

    return res.json(success('获取用户帖子成功', {
      posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: posts.length
      }
    }));

  } catch (err) {
    console.error('GET /api/community/users/:userId/posts', err);
    return res.status(500).json(error('获取用户帖子失败'));
  }
});

// 获取用户的评论
router.get('/users/:userId/comments', async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const filters = {
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    };

    const comments = await Comment.getByUserId(userId, filters);

    return res.json(success('获取用户评论成功', {
      comments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: comments.length
      }
    }));

  } catch (err) {
    console.error('GET /api/community/users/:userId/comments', err);
    return res.status(500).json(error('获取用户评论失败'));
  }
});

// 举报管理相关路由
// 获取举报列表
router.get('/reports', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, type } = req.query;

    // 检查管理员权限
    if (req.user.role !== 'admin' && req.user.role !== 'community_admin') {
      return res.status(403).json(error('无权限访问举报管理'));
    }

    const filters = {
      status,
      type,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    };

    // 模拟举报数据
    const mockReports = [
      {
        id: 1,
        type: 'post',
        target_id: 101,
        target_title: '出售二手iPhone 13',
        reporter_id: 'USER001',
        reporter_name: '张三',
        reason: 'spam',
        reason_text: '垃圾信息',
        description: '发布虚假信息，多次重复发布',
        status: 'pending',
        created_at: '2024-01-15T10:30:00Z',
        updated_at: '2024-01-15T10:30:00Z'
      },
      {
        id: 2,
        type: 'comment',
        target_id: 205,
        target_title: '评论内容',
        reporter_id: 'USER002',
        reporter_name: '李四',
        reason: 'inappropriate',
        reason_text: '不当内容',
        description: '包含不当言论和人身攻击',
        status: 'approved',
        created_at: '2024-01-14T15:20:00Z',
        updated_at: '2024-01-14T16:45:00Z'
      },
      {
        id: 3,
        type: 'post',
        target_id: 102,
        target_title: '寻找学习伙伴',
        reporter_id: 'USER003',
        reporter_name: '王五',
        reason: 'harassment',
        reason_text: '骚扰行为',
        description: '发布不当交友信息，涉嫌骚扰',
        status: 'rejected',
        created_at: '2024-01-13T09:15:00Z',
        updated_at: '2024-01-13T11:30:00Z'
      }
    ];

    // 根据筛选条件过滤
    let filteredReports = mockReports;
    if (status) {
      filteredReports = filteredReports.filter(report => report.status === status);
    }
    if (type) {
      filteredReports = filteredReports.filter(report => report.type === type);
    }

    return res.json(success('获取举报列表成功', {
      reports: filteredReports,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: filteredReports.length
      }
    }));

  } catch (err) {
    console.error('GET /api/community/reports', err);
    return res.status(500).json(error('获取举报列表失败'));
  }
});

// 处理举报
router.put('/reports/:id/handle', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_comment } = req.body;

    // 检查管理员权限
    if (req.user.role !== 'admin' && req.user.role !== 'community_admin') {
      return res.status(403).json(error('无权限处理举报'));
    }

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json(error('无效的处理状态'));
    }

    // 模拟处理举报
    const mockReport = {
      id: parseInt(id),
      status,
      admin_comment,
      handled_by: req.user.userName || 'admin',
      handled_at: new Date().toISOString()
    };

    return res.json(success('处理举报成功', mockReport));

  } catch (err) {
    console.error('PUT /api/community/reports/:id/handle', err);
    return res.status(500).json(error('处理举报失败'));
  }
});

// 获取举报统计
router.get('/reports/stats', authenticateToken, async (req, res) => {
  try {
    // 检查管理员权限
    if (req.user.role !== 'admin' && req.user.role !== 'community_admin') {
      return res.status(403).json(error('无权限访问举报统计'));
    }

    // 模拟统计数据
    const stats = {
      total: 156,
      pending: 23,
      approved: 98,
      rejected: 35,
      by_type: {
        post: 89,
        comment: 67
      },
      by_reason: {
        spam: 45,
        inappropriate: 38,
        harassment: 28,
        other: 45
      }
    };

    return res.json(success('获取举报统计成功', stats));

  } catch (err) {
    console.error('GET /api/community/reports/stats', err);
    return res.status(500).json(error('获取举报统计失败'));
  }
});

module.exports = router;

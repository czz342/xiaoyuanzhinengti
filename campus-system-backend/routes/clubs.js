const express = require('express');
const router = express.Router();
const Club = require('../models/Club');
const ClubMember = require('../models/ClubMember');
const Activity = require('../models/Activity');
const { authenticateToken } = require('../middleware/auth');
const { success, error } = require('../utils/response');

// 获取社团列表
router.get('/list', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      status = 'active',
      level,
      keyword,
      sort_by = 'created_at'
    } = req.query;

    const filters = {
      category: category || null,
      status: status || null,
      level: level || null,
      keyword: keyword || null,
      sort_by: sort_by || 'created_at',
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    };

    const clubs = await Club.list(filters);

    return res.json(success('获取社团列表成功', {
      clubs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: clubs.length
      }
    }));

  } catch (err) {
    console.error('GET /api/clubs/list', err);
    return res.status(500).json(error('获取社团列表失败'));
  }
});

// 获取社团详情
router.get('/:id', async (req, res) => {
  try {
    const clubId = parseInt(req.params.id);
    const club = await Club.findById(clubId);

    if (!club) {
      return res.status(404).json(error('社团不存在'));
    }

    // 获取社团成员统计
    const memberStats = await ClubMember.getClubMemberStats(clubId);
    
    // 获取社团活动（最近5个）
    const activities = await Activity.list({
      club_id: clubId,
      limit: 5
    });

    return res.json(success('获取社团详情成功', {
      club: {
        ...club,
        member_stats: memberStats,
        recent_activities: activities
      }
    }));

  } catch (err) {
    console.error('GET /api/clubs/:id', err);
    return res.status(500).json(error('获取社团详情失败'));
  }
});

// 创建社团
router.post('/', authenticateToken, async (req, res) => {
  try {
    const clubData = {
      ...req.body,
      leader_id: req.user.studentId || req.user.userId || String(req.user.id || ''),
      leader_name: req.user.userName || req.user.displayName || '未知用户'
    };

    const club = await Club.create(clubData);

    // 自动将创建者设为社长
    await ClubMember.join(club.id, clubData.leader_id, clubData.leader_name, 'leader');

    return res.json(success('创建社团成功', { club }));

  } catch (err) {
    console.error('POST /api/clubs', err);
    return res.status(500).json(error('创建社团失败'));
  }
});

// 更新社团
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const clubId = parseInt(req.params.id);
    const updateData = req.body;

    // 检查权限（只有社长可以更新）
    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json(error('社团不存在'));
    }

    const userId = req.user.studentId || req.user.userId || String(req.user.id || '');
    const membership = await ClubMember.isMember(clubId, userId);
    
    if (!membership || membership.role !== 'leader') {
      return res.status(403).json(error('只有社长可以更新社团信息'));
    }

    const success = await Club.update(clubId, updateData);
    
    if (success) {
      return res.json(success('更新社团成功'));
    } else {
      return res.status(400).json(error('更新社团失败'));
    }

  } catch (err) {
    console.error('PUT /api/clubs/:id', err);
    return res.status(500).json(error('更新社团失败'));
  }
});

// 删除社团
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const clubId = parseInt(req.params.id);

    // 检查权限（只有社长可以删除）
    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json(error('社团不存在'));
    }

    const userId = req.user.studentId || req.user.userId || String(req.user.id || '');
    const membership = await ClubMember.isMember(clubId, userId);
    
    if (!membership || membership.role !== 'leader') {
      return res.status(403).json(error('只有社长可以删除社团'));
    }

    const success = await Club.delete(clubId);
    
    if (success) {
      return res.json(success('删除社团成功'));
    } else {
      return res.status(400).json(error('删除社团失败'));
    }

  } catch (err) {
    console.error('DELETE /api/clubs/:id', err);
    return res.status(500).json(error('删除社团失败'));
  }
});

// 加入社团
router.post('/:id/join', authenticateToken, async (req, res) => {
  try {
    const clubId = parseInt(req.params.id);
    const userId = req.user.studentId || req.user.userId || String(req.user.id || '');
    const userName = req.user.userName || req.user.displayName || '未知用户';

    // 检查社团是否存在
    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json(error('社团不存在'));
    }

    // 检查社团状态
    if (club.status !== 'active') {
      return res.status(400).json(error('社团未开放或已暂停'));
    }

    // 检查是否已加入
    const existingMembership = await ClubMember.isMember(clubId, userId);
    if (existingMembership) {
      return res.status(400).json(error('您已经加入此社团'));
    }

    // 加入社团
    await ClubMember.join(clubId, userId, userName);

    return res.json(success('加入社团成功'));

  } catch (err) {
    console.error('POST /api/clubs/:id/join', err);
    return res.status(500).json(error('加入社团失败'));
  }
});

// 退出社团
router.post('/:id/leave', authenticateToken, async (req, res) => {
  try {
    const clubId = parseInt(req.params.id);
    const userId = req.user.studentId || req.user.userId || String(req.user.id || '');

    // 检查是否已加入
    const membership = await ClubMember.isMember(clubId, userId);
    if (!membership) {
      return res.status(400).json(error('您未加入此社团'));
    }

    // 社长不能退出社团
    if (membership.role === 'leader') {
      return res.status(400).json(error('社长不能退出社团，请先转让社长职位'));
    }

    // 退出社团
    await ClubMember.leave(clubId, userId);

    return res.json(success('退出社团成功'));

  } catch (err) {
    console.error('POST /api/clubs/:id/leave', err);
    return res.status(500).json(error('退出社团失败'));
  }
});

// 获取社团成员列表
router.get('/:id/members', async (req, res) => {
  try {
    const clubId = parseInt(req.params.id);
    const { role, status = 'active', limit = 50 } = req.query;

    const filters = {
      role: role || null,
      status: status || null,
      limit: parseInt(limit)
    };

    const members = await ClubMember.getClubMembers(clubId, filters);

    return res.json(success('获取社团成员成功', { members }));

  } catch (err) {
    console.error('GET /api/clubs/:id/members', err);
    return res.status(500).json(error('获取社团成员失败'));
  }
});

// 更新成员角色
router.put('/:id/members/:userId/role', authenticateToken, async (req, res) => {
  try {
    const clubId = parseInt(req.params.id);
    const userId = req.params.userId;
    const { role } = req.body;

    // 检查权限（只有社长可以更新角色）
    const currentUserId = req.user.studentId || req.user.userId || String(req.user.id || '');
    const membership = await ClubMember.isMember(clubId, currentUserId);
    
    if (!membership || membership.role !== 'leader') {
      return res.status(403).json(error('只有社长可以更新成员角色'));
    }

    const success = await ClubMember.updateRole(clubId, userId, role);
    
    if (success) {
      return res.json(success('更新成员角色成功'));
    } else {
      return res.status(400).json(error('更新成员角色失败'));
    }

  } catch (err) {
    console.error('PUT /api/clubs/:id/members/:userId/role', err);
    return res.status(500).json(error('更新成员角色失败'));
  }
});

// 移除成员
router.delete('/:id/members/:userId', authenticateToken, async (req, res) => {
  try {
    const clubId = parseInt(req.params.id);
    const userId = req.params.userId;

    // 检查权限（只有社长可以移除成员）
    const currentUserId = req.user.studentId || req.user.userId || String(req.user.id || '');
    const membership = await ClubMember.isMember(clubId, currentUserId);
    
    if (!membership || membership.role !== 'leader') {
      return res.status(403).json(error('只有社长可以移除成员'));
    }

    const success = await ClubMember.removeMember(clubId, userId);
    
    if (success) {
      return res.json(success('移除成员成功'));
    } else {
      return res.status(400).json(error('移除成员失败'));
    }

  } catch (err) {
    console.error('DELETE /api/clubs/:id/members/:userId', err);
    return res.status(500).json(error('移除成员失败'));
  }
});

// 获取社团统计信息
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await Club.getStats();
    const categoryStats = await Club.getCategoryStats();
    const popularClubs = await Club.getPopularClubs(5);

    return res.json(success('获取社团统计成功', {
      overview: stats,
      categories: categoryStats,
      popular_clubs: popularClubs
    }));

  } catch (err) {
    console.error('GET /api/clubs/stats/overview', err);
    return res.status(500).json(error('获取社团统计失败'));
  }
});

// 搜索社团
router.get('/search', async (req, res) => {
  try {
    const { keyword, status = 'active', limit = 20 } = req.query;

    if (!keyword) {
      return res.status(400).json(error('请输入搜索关键词'));
    }

    const filters = {
      status: status || null,
      limit: parseInt(limit)
    };

    const clubs = await Club.search(keyword, filters);

    return res.json(success('搜索社团成功', { clubs }));

  } catch (err) {
    console.error('GET /api/clubs/search', err);
    return res.status(500).json(error('搜索社团失败'));
  }
});

// 获取我的社团
router.get('/my/clubs', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.studentId || req.user.userId || String(req.user.id || '');
    const clubs = await ClubMember.getUserClubs(userId);

    return res.json(success('获取我的社团成功', { clubs }));

  } catch (err) {
    console.error('GET /api/clubs/my/clubs', err);
    return res.status(500).json(error('获取我的社团失败'));
  }
});

module.exports = router;


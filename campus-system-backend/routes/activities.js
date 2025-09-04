const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const ActivityParticipant = require('../models/ActivityParticipant');
const UserPoints = require('../models/UserPoints');
const UserCredibility = require('../models/UserCredibility');
const { authenticateToken } = require('../middleware/auth');
const { success, error } = require('../utils/response');

// 获取活动列表
router.get('/list', async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            club_id,
            is_featured,
            status = 'published',
            sort_by = 'created_at',
            keyword
        } = req.query;

        const filters = {
            club_id: club_id ? parseInt(club_id) : null,
            is_featured: is_featured === 'true',
            status,
            limit: parseInt(limit),
            offset: (parseInt(page) - 1) * parseInt(limit),
            sort_by
        };

        let activities;
        if (keyword) {
            activities = await Activity.search(keyword, filters);
        } else {
            activities = await Activity.list(filters);
        }

        // 为每个活动添加用户参与状态（如果已登录）
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (token) {
            try {
                const jwt = require('jsonwebtoken');
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
                const userId = decoded.studentId || decoded.userId || decoded.id;

                for (let activity of activities) {
                    const participation = await ActivityParticipant.isParticipating(activity.id, userId);
                    activity.user_participation = participation ? participation.status : null;
                }
            } catch (err) {
                // Token无效，忽略用户参与状态
            }
        }

        return res.json(success('ok', {
            activities,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: activities.length
            }
        }));

    } catch (err) {
        console.error('GET /api/activities/list', err);
        return res.status(500).json(error('获取活动列表失败'));
    }
});

// 获取推荐活动（轮播图）
router.get('/featured', async (req, res) => {
    try {
        const activities = await Activity.getFeatured();
        return res.json(success('ok', { activities }));
    } catch (err) {
        console.error('GET /api/activities/featured', err);
        return res.status(500).json(error('获取推荐活动失败'));
    }
});

// 获取活动详情
router.get('/:id', async (req, res) => {
    try {
        const activityId = parseInt(req.params.id);
        const activity = await Activity.findById(activityId);

        if (!activity) {
            return res.status(404).json(error('活动不存在'));
        }

        // 获取参与者列表
        const participants = await ActivityParticipant.getActivityParticipants(activityId);

        // 检查用户参与状态（如果已登录）
        const token = req.headers.authorization?.replace('Bearer ', '');
        let userParticipation = null;
        if (token) {
            try {
                const jwt = require('jsonwebtoken');
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
                const userId = decoded.studentId || decoded.userId || decoded.id;
                userParticipation = await ActivityParticipant.isParticipating(activityId, userId);
            } catch (err) {
                // Token无效，忽略用户参与状态
            }
        }

        return res.json(success('ok', {
            activity: {
                ...activity,
                participants: participants.slice(0, 10), // 只返回前10个参与者
                total_participants: participants.length,
                user_participation: userParticipation ? userParticipation.status : null
            }
        }));

    } catch (err) {
        console.error('GET /api/activities/:id', err);
        return res.status(500).json(error('获取活动详情失败'));
    }
});

// 参与活动
router.post('/:id/join', authenticateToken, async (req, res) => {
    try {
        const activityId = parseInt(req.params.id);
        const userId = req.user.studentId || req.user.userId || String(req.user.id || '');

        // 检查活动是否存在
        const activity = await Activity.findById(activityId);
        if (!activity) {
            return res.status(404).json(error('活动不存在'));
        }

        // 检查活动状态
        if (activity.status !== 'published') {
            return res.status(400).json(error('活动未发布或已结束'));
        }

        // 检查是否已参与
        const existingParticipation = await ActivityParticipant.isParticipating(activityId, userId);
        if (existingParticipation) {
            return res.status(400).json(error('您已经参与此活动'));
        }

        // 检查参与人数限制
        if (activity.max_participants > 0 && activity.current_participants >= activity.max_participants) {
            return res.status(400).json(error('活动参与人数已满'));
        }

        // 检查诚信度要求
        const canJoin = await UserCredibility.canJoinActivity(userId, activity.min_credibility);
        if (!canJoin) {
            return res.status(400).json(error('您的诚信度不满足活动要求'));
        }

        // 参与活动
        await ActivityParticipant.join(activityId, userId);
        await Activity.updateParticipantCount(activityId, 1);

        return res.json(success('ok', { message: '参与活动成功' }));

    } catch (err) {
        console.error('POST /api/activities/:id/join', err);
        return res.status(500).json(error('参与活动失败'));
    }
});

// 取消参与活动
router.post('/:id/cancel', authenticateToken, async (req, res) => {
    try {
        const activityId = parseInt(req.params.id);
        const userId = req.user.studentId || req.user.userId || String(req.user.id || '');

        // 检查是否已参与
        const participation = await ActivityParticipant.isParticipating(activityId, userId);
        if (!participation) {
            return res.status(400).json(error('您未参与此活动'));
        }

        // 取消参与
        await ActivityParticipant.cancel(activityId, userId);
        await Activity.updateParticipantCount(activityId, -1);

        return res.json(success('ok', { message: '取消参与成功' }));

    } catch (err) {
        console.error('POST /api/activities/:id/cancel', err);
        return res.status(500).json(error('取消参与失败'));
    }
});

// 获取我的活动
router.get('/my/activities', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.studentId || req.user.userId || String(req.user.id || '');
        const { status } = req.query;

        const activities = await ActivityParticipant.getUserActivities(userId, status);

        return res.json(success('ok', { activities }));

    } catch (err) {
        console.error('GET /api/activities/my/activities', err);
        return res.status(500).json(error('获取我的活动失败'));
    }
});

// 获取我的积分信息
router.get('/my/points', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.studentId || req.user.userId || String(req.user.id || '');
        
        const pointsInfo = await UserPoints.getUserPoints(userId);
        const targetInfo = await UserPoints.checkSemesterTarget(userId);
        const rank = await UserPoints.getUserRank(userId);

        return res.json(success('ok', {
            ...pointsInfo,
            ...targetInfo,
            rank
        }));

    } catch (err) {
        console.error('GET /api/activities/my/points', err);
        return res.status(500).json(error('获取积分信息失败'));
    }
});

// 获取我的诚信度信息
router.get('/my/credibility', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.studentId || req.user.userId || String(req.user.id || '');
        
        const credibilityInfo = await UserCredibility.getUserCredibility(userId);
        const level = UserCredibility.getCredibilityLevel(credibilityInfo.credibility_score);
        const rank = await UserCredibility.getUserRank(userId);

        return res.json(success('ok', {
            ...credibilityInfo,
            level,
            rank
        }));

    } catch (err) {
        console.error('GET /api/activities/my/credibility', err);
        return res.status(500).json(error('获取诚信度信息失败'));
    }
});

// 获取积分排行榜
router.get('/leaderboard/points', async (req, res) => {
    try {
        const { limit = 10 } = req.query;
        const leaderboard = await UserPoints.getLeaderboard(parseInt(limit));

        return res.json(success('ok', { leaderboard }));

    } catch (err) {
        console.error('GET /api/activities/leaderboard/points', err);
        return res.status(500).json(error('获取积分排行榜失败'));
    }
});

// 获取诚信度排行榜
router.get('/leaderboard/credibility', async (req, res) => {
    try {
        const { limit = 10 } = req.query;
        const leaderboard = await UserCredibility.getCredibilityLeaderboard(parseInt(limit));

        return res.json(success('ok', { leaderboard }));

    } catch (err) {
        console.error('GET /api/activities/leaderboard/credibility', err);
        return res.status(500).json(error('获取诚信度排行榜失败'));
    }
});

// 管理员：标记活动参与状态
router.post('/:id/attendance', authenticateToken, async (req, res) => {
    try {
        const activityId = parseInt(req.params.id);
        const { user_id, status } = req.body; // status: 'attended', 'absent'

        // 这里应该检查管理员权限，暂时跳过

        if (status === 'attended') {
            // 获取活动积分奖励
            const activity = await Activity.findById(activityId);
            const pointsEarned = activity.points_reward || 0;

            // 标记为已参与并给予积分
            await ActivityParticipant.markAttended(activityId, user_id, pointsEarned);
            await UserPoints.addPoints(user_id, pointsEarned, `参与活动: ${activity.title}`);
            await UserCredibility.updateCredibility(user_id, 'attended');
        } else if (status === 'absent') {
            // 标记为缺席
            await ActivityParticipant.markAbsent(activityId, user_id);
            await UserCredibility.updateCredibility(user_id, 'absent');
        }

        return res.json(success('ok', { message: '考勤记录更新成功' }));

    } catch (err) {
        console.error('POST /api/activities/:id/attendance', err);
        return res.status(500).json(error('更新考勤记录失败'));
    }
});

module.exports = router;

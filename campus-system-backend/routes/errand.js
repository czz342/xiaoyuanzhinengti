const express = require('express');
const router = require('express').Router();
const ErrandOrder = require('../models/ErrandOrder');
const OrderStatusLog = require('../models/OrderStatusLog');
const UserRating = require('../models/UserRating');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

// 健康检查
router.get('/ping', (req, res) => {
    res.json({ success: true, message: 'errand ok' });
});

// 初始化表（可由脚本统一创建，这里提供兜底）
router.post('/init', async (req, res) => {
    try {
        await ErrandOrder.createTable();
        await OrderStatusLog.createTable();
        await UserRating.createTable();
        res.json({ success: true, message: 'Errand tables ensured.' });
    } catch (e) {
        console.error('init errand tables error:', e);
        res.status(500).json({ success: false, message: e.message });
    }
});

// 发布跑腿订单
router.post('/orders', authenticateToken, async (req, res) => {
    try {
        const user = req.user;
        const {
            title, description, service_type, price,
            pickup_location, delivery_location, expected_time, phone
        } = req.body;

        if (!title || !service_type || price == null || !pickup_location || !delivery_location || !phone) {
            return res.status(400).json({ success: false, message: '缺少必填字段' });
        }

        const created = await ErrandOrder.create({
            title,
            description,
            service_type,
            price,
            publisher_id: user.id,
            pickup_location,
            delivery_location,
            expected_time,
            phone
        });

        await OrderStatusLog.create({ order_id: created.id, status: '待接单', operator_id: user.id, remark: '发布订单' });

        res.json({ success: true, data: created });
    } catch (e) {
        console.error('create errand order error:', e);
        res.status(500).json({ success: false, message: e.message });
    }
});

// 我的订单
router.get('/orders/my', authenticateToken, async (req, res) => {
    try {
        const user = req.user;
        const rows = await ErrandOrder.listMyOrders(user.id);
        res.json({ success: true, data: rows });
    } catch (e) {
        console.error('list my errand orders error:', e);
        res.status(500).json({ success: false, message: e.message });
    }
});

// 我接的订单
router.get('/orders/accepted', authenticateToken, async (req, res) => {
    try {
        const user = req.user;
        const rows = await ErrandOrder.listAcceptedOrders(user.id);
        res.json({ success: true, data: rows });
    } catch (e) {
        console.error('list accepted errand orders error:', e);
        res.status(500).json({ success: false, message: e.message });
    }
});

// 可接订单列表
router.get('/orders/available', authenticateToken, async (req, res) => {
    try {
        const { serviceType, minPrice, maxPrice, offset, limit } = req.query;
        const user = req.user;
        const rows = await ErrandOrder.listAvailable({
            serviceType,
            minPrice: minPrice != null ? Number(minPrice) : undefined,
            maxPrice: maxPrice != null ? Number(maxPrice) : undefined,
            offset: offset != null ? Number(offset) : undefined,
            limit: limit != null ? Number(limit) : undefined,
            excludeUserId: user.id // 排除当前用户发布的订单
        });
        res.json({ success: true, data: rows });
    } catch (e) {
        console.error('list available errand orders error:', e);
        res.status(500).json({ success: false, message: e.message });
    }
});

// 订单详情
router.get('/orders/:id', authenticateToken, async (req, res) => {
    try {
        const id = Number(req.params.id);
        const row = await ErrandOrder.findDetailById(id);
        if (!row) return res.status(404).json({ success: false, message: '订单不存在' });
        res.json({ success: true, data: row });
    } catch (e) {
        console.error('get errand order detail error:', e);
        res.status(500).json({ success: false, message: e.message });
    }
});

// 接单
router.post('/orders/:id/accept', authenticateToken, async (req, res) => {
    try {
        const orderId = Number(req.params.id);
        const user = req.user;
        const ok = await ErrandOrder.acceptOrder({ orderId, accepterId: user.id });
        if (!ok) return res.status(400).json({ success: false, message: '接单失败，订单状态可能已变化' });
        await OrderStatusLog.create({ order_id: orderId, status: '已接单', operator_id: user.id, remark: '接单' });
        res.json({ success: true });
    } catch (e) {
        console.error('accept errand order error:', e);
        res.status(500).json({ success: false, message: e.message });
    }
});

// 取消
router.post('/orders/:id/cancel', authenticateToken, async (req, res) => {
    try {
        const orderId = Number(req.params.id);
        const user = req.user;
        const ok = await ErrandOrder.cancelOrder({ orderId, userId: user.id });
        if (!ok) return res.status(400).json({ success: false, message: '取消失败，无权限或状态不允许' });
        await OrderStatusLog.create({ order_id: orderId, status: '已取消', operator_id: user.id, remark: '取消订单' });
        res.json({ success: true });
    } catch (e) {
        console.error('cancel errand order error:', e);
        res.status(500).json({ success: false, message: e.message });
    }
});

// 完成
router.post('/orders/:id/complete', authenticateToken, async (req, res) => {
    try {
        const orderId = Number(req.params.id);
        const user = req.user;
        const ok = await ErrandOrder.completeOrder({ orderId, userId: user.id });
        if (!ok) return res.status(400).json({ success: false, message: '完成失败，无权限或状态不允许' });
        
        // 更新用户完成订单数
        await ErrandOrder.updateUserCompletedOrders(orderId);
        
        await OrderStatusLog.create({ order_id: orderId, status: '已完成', operator_id: user.id, remark: '完成订单' });
        res.json({ success: true });
    } catch (e) {
        console.error('complete errand order error:', e);
        res.status(500).json({ success: false, message: e.message });
    }
});

// 订单状态日志
router.get('/orders/:id/logs', authenticateToken, async (req, res) => {
    try {
        const orderId = Number(req.params.id);
        const rows = await OrderStatusLog.listByOrder(orderId);
        res.json({ success: true, data: rows });
    } catch (e) {
        console.error('list errand order logs error:', e);
        res.status(500).json({ success: false, message: e.message });
    }
});

// 获取订单评分状态
router.get('/orders/:id/rating-status', authenticateToken, async (req, res) => {
    try {
        const orderId = Number(req.params.id);
        const user = req.user;
        const ratingStatus = await ErrandOrder.getRatingStatus(orderId, user.id);
        if (!ratingStatus) {
            return res.status(404).json({ success: false, message: '订单不存在' });
        }
        res.json({ success: true, data: ratingStatus });
    } catch (e) {
        console.error('get rating status error:', e);
        res.status(500).json({ success: false, message: e.message });
    }
});

// 提交评分
router.post('/orders/:id/rate', authenticateToken, async (req, res) => {
    try {
        const orderId = Number(req.params.id);
        const user = req.user;
        const { targetUserId, rating, comment } = req.body;
        
        if (!targetUserId || !rating || rating < 1 || rating > 5) {
            return res.status(400).json({ success: false, message: '参数错误' });
        }

        // 检查是否已评分
        const hasRated = await UserRating.hasRated(orderId, user.id, targetUserId);
        if (hasRated) {
            return res.status(400).json({ success: false, message: '您已经对此用户评分过了' });
        }

        // 创建评分记录
        await UserRating.create({
            order_id: orderId,
            rater_id: user.id,
            rated_user_id: targetUserId,
            rating: Number(rating),
            comment: comment || ''
        });

        // 更新用户平均评分
        const avgRating = await UserRating.getAverageRating(targetUserId);
        await User.updateCreditScore(targetUserId, avgRating.averageRating);

        res.json({ success: true, message: '评分提交成功' });
    } catch (e) {
        console.error('submit rating error:', e);
        res.status(500).json({ success: false, message: e.message });
    }
});

// 获取订单评分记录
router.get('/orders/:id/ratings', authenticateToken, async (req, res) => {
    try {
        const orderId = Number(req.params.id);
        const ratings = await UserRating.getByOrderId(orderId);
        res.json({ success: true, data: ratings });
    } catch (e) {
        console.error('get order ratings error:', e);
        res.status(500).json({ success: false, message: e.message });
    }
});

// 获取用户收到的评分
router.get('/ratings/received', authenticateToken, async (req, res) => {
    try {
        const user = req.user;
        const { limit = 10, offset = 0 } = req.query;
        const ratings = await UserRating.getReceivedRatings(user.id, Number(limit), Number(offset));
        res.json({ success: true, data: ratings });
    } catch (e) {
        console.error('get received ratings error:', e);
        res.status(500).json({ success: false, message: e.message });
    }
});

// 获取用户发出的评分
router.get('/ratings/given', authenticateToken, async (req, res) => {
    try {
        const user = req.user;
        const { limit = 10, offset = 0 } = req.query;
        const ratings = await UserRating.getGivenRatings(user.id, Number(limit), Number(offset));
        res.json({ success: true, data: ratings });
    } catch (e) {
        console.error('get given ratings error:', e);
        res.status(500).json({ success: false, message: e.message });
    }
});

// 管理员相关路由
// 获取所有订单列表（管理员）
router.get('/admin/orders', authenticateToken, async (req, res) => {
    try {
        // 检查管理员权限
        if (req.user.role !== 'admin' && req.user.role !== 'errand_admin') {
            return res.status(403).json({ success: false, message: '无权限访问' });
        }

        const { 
            page = 1, 
            limit = 10, 
            status, 
            service_type, 
            publisher_id, 
            accepter_id,
            start_date,
            end_date
        } = req.query;

        const filters = {
            status,
            service_type,
            publisher_id,
            accepter_id,
            start_date,
            end_date,
            limit: Number(limit),
            offset: (Number(page) - 1) * Number(limit)
        };

        const { orders, total } = await ErrandOrder.listAllOrders(filters);
        
        res.json({ 
            success: true, 
            data: {
                orders,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total,
                    pages: Math.ceil(total / Number(limit))
                }
            }
        });
    } catch (e) {
        console.error('get all errand orders error:', e);
        res.status(500).json({ success: false, message: e.message });
    }
});

// 更新订单状态（管理员）
router.put('/admin/orders/:id/status', authenticateToken, async (req, res) => {
    try {
        // 检查管理员权限
        if (req.user.role !== 'admin' && req.user.role !== 'errand_admin') {
            return res.status(403).json({ success: false, message: '无权限访问' });
        }

        const orderId = Number(req.params.id);
        const { status, remark } = req.body;

        if (!status) {
            return res.status(400).json({ success: false, message: '状态不能为空' });
        }

        const validStatuses = ['待接单', '已接单', '进行中', '已完成', '已取消', '已退款'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: '无效的状态' });
        }

        const updated = await ErrandOrder.updateStatus(orderId, status);
        if (!updated) {
            return res.status(404).json({ success: false, message: '订单不存在' });
        }

        // 记录状态变更日志
        await OrderStatusLog.create({
            order_id: orderId,
            status,
            operator_id: req.user.id,
            remark: remark || `管理员更新状态为：${status}`
        });

        res.json({ success: true, message: '状态更新成功' });
    } catch (e) {
        console.error('update order status error:', e);
        res.status(500).json({ success: false, message: e.message });
    }
});

// 获取订单统计（管理员）
router.get('/admin/stats', authenticateToken, async (req, res) => {
    try {
        // 检查管理员权限
        if (req.user.role !== 'admin' && req.user.role !== 'errand_admin') {
            return res.status(403).json({ success: false, message: '无权限访问' });
        }

        const { start_date, end_date } = req.query;
        
        const stats = await ErrandOrder.getAdminStats({
            start_date,
            end_date
        });

        res.json({ success: true, data: stats });
    } catch (e) {
        console.error('get errand stats error:', e);
        res.status(500).json({ success: false, message: e.message });
    }
});

// 获取骑手列表（管理员）
router.get('/admin/riders', authenticateToken, async (req, res) => {
    try {
        // 检查管理员权限
        if (req.user.role !== 'admin' && req.user.role !== 'errand_admin') {
            return res.status(403).json({ success: false, message: '无权限访问' });
        }

        const { page = 1, limit = 10, keyword } = req.query;
        
        // 使用模拟数据
        const mockRiders = [
            {
                id: 1,
                rider_name: '张三',
                phone: '13800138001',
                completed_orders: 15,
                average_rating: 4.8,
                status: '在线',
                join_date: '2024-01-15',
                total_earnings: 1250.50
            },
            {
                id: 2,
                rider_name: '李四',
                phone: '13800138002',
                completed_orders: 23,
                average_rating: 4.6,
                status: '忙碌',
                join_date: '2024-01-10',
                total_earnings: 1890.30
            },
            {
                id: 3,
                rider_name: '王五',
                phone: '13800138003',
                completed_orders: 8,
                average_rating: 4.9,
                status: '在线',
                join_date: '2024-02-01',
                total_earnings: 680.20
            },
            {
                id: 4,
                rider_name: '赵六',
                phone: '13800138004',
                completed_orders: 31,
                average_rating: 4.7,
                status: '离线',
                join_date: '2023-12-20',
                total_earnings: 2450.80
            },
            {
                id: 5,
                rider_name: '钱七',
                phone: '13800138005',
                completed_orders: 12,
                average_rating: 4.5,
                status: '在线',
                join_date: '2024-01-25',
                total_earnings: 920.60
            }
        ];

        // 简单的关键词过滤
        let filteredRiders = mockRiders;
        if (keyword) {
            filteredRiders = mockRiders.filter(rider => 
                rider.rider_name.includes(keyword) || 
                rider.phone.includes(keyword)
            );
        }

        const total = filteredRiders.length;
        const startIndex = (Number(page) - 1) * Number(limit);
        const endIndex = startIndex + Number(limit);
        const riders = filteredRiders.slice(startIndex, endIndex);
        
        res.json({ 
            success: true, 
            data: {
                riders,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total,
                    pages: Math.ceil(total / Number(limit))
                }
            }
        });
    } catch (e) {
        console.error('get rider list error:', e);
        res.status(500).json({ success: false, message: e.message });
    }
});

module.exports = router;



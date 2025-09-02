const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const SharedDevice = require('../models/SharedDevice');
const LaundryOrder = require('../models/LaundryOrder');
const PrintJob = require('../models/PrintJob');
const ServicePricing = require('../models/ServicePricing');
const config = require('../config/config');

// 中间件：验证JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: '访问令牌缺失' });
    }

    jwt.verify(token, config.jwt.secret, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: '访问令牌无效' });
        }
        req.user = user;
        next();
    });
};

// 获取所有共享设备
router.get('/devices', async (req, res) => {
    try {
        const { deviceType, status, building, location } = req.query;
        
        const filters = {};
        if (deviceType) filters.deviceType = deviceType;
        if (status) filters.status = status;
        if (building) filters.building = building;
        if (location) filters.location = location;

        let devices = await SharedDevice.list(filters);
        // 若存在usage_status列，则直接透传；否则用当前订单推导
        if (!('usage_status' in (devices[0] || {}))) {
            const busyIds = await LaundryOrder.getBusyDeviceIds();
            const busySet = new Set(busyIds);
            devices = devices.map(d => ({
                ...d,
                usage_status: busySet.has(d.id) ? '使用中' : '空闲'
            }));
        }
        
        res.json({
            success: true,
            data: devices
        });
    } catch (error) {
        console.error('获取设备列表失败:', error);
        res.status(500).json({
            success: false,
            message: '获取设备列表失败'
        });
    }
});

// 获取设备统计信息
router.get('/devices/stats', async (req, res) => {
    try {
        const stats = await SharedDevice.getDeviceStats();

        // 计算总体统计（完好率 = 正常状态/总设备），显式转数值并夹紧到0-100
        const toNum = (v) => Number(v || 0);
        const totalDevices = stats.reduce((sum, s) => sum + toNum(s.total_count), 0);
        const normalDevices = stats.reduce((sum, s) => sum + toNum(s.normal_count), 0);
        let integrity = totalDevices > 0 ? Math.round((normalDevices / totalDevices) * 100) : 100;
        integrity = Math.max(0, Math.min(100, integrity));

        const empty = { total_count: 0, available_count: 0, busy_count: 0 };
        const laundry = stats.find(s => s.device_type === '洗衣机') || empty;
        const printers = stats.find(s => s.device_type === '打印机') || empty;

        res.json({
            success: true,
            data: {
                totalDevices,
                deviceIntegrity: `${integrity}%`,
                laundry: {
                    total: laundry.total_count,
                    available: laundry.available_count,
                    busy: laundry.busy_count
                },
                printers: {
                    total: printers.total_count,
                    available: printers.available_count,
                    busy: printers.busy_count
                }
            }
        });
    } catch (error) {
        console.error('获取设备统计失败:', error);
        res.status(500).json({
            success: false,
            message: '获取设备统计失败'
        });
    }
});

// 获取可用设备
router.get('/devices/available', async (req, res) => {
    try {
        const { deviceType } = req.query;
        
        if (!deviceType) {
            return res.status(400).json({
                success: false,
                message: '设备类型参数缺失'
            });
        }

        // 获取繁忙设备ID列表
        let busyDeviceIds = [];
        if (deviceType === '洗衣机') {
            busyDeviceIds = await LaundryOrder.getBusyDeviceIds();
        } else if (deviceType === '打印机') {
            busyDeviceIds = await PrintJob.getBusyDeviceIds();
        }

        const availableDevices = await SharedDevice.getAvailableDevices(deviceType, busyDeviceIds);
        
        res.json({
            success: true,
            data: availableDevices
        });
    } catch (error) {
        console.error('获取可用设备失败:', error);
        res.status(500).json({
            success: false,
            message: '获取可用设备失败'
        });
    }
});

// 获取繁忙设备ID列表
router.get('/devices/busy', async (req, res) => {
    try {
        const { deviceType } = req.query;
        
        if (!deviceType) {
            return res.status(400).json({
                success: false,
                message: '设备类型参数缺失'
            });
        }

        let busyDeviceIds = [];
        if (deviceType === '洗衣机') {
            busyDeviceIds = await LaundryOrder.getBusyDeviceIds();
        } else if (deviceType === '打印机') {
            busyDeviceIds = await PrintJob.getBusyDeviceIds();
        }

        res.json({
            success: true,
            data: busyDeviceIds
        });
    } catch (error) {
        console.error('获取繁忙设备失败:', error);
        res.status(500).json({
            success: false,
            message: '获取繁忙设备失败'
        });
    }
});

// 获取设备详情
router.get('/devices/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const device = await SharedDevice.findById(id);
        
        if (!device) {
            return res.status(404).json({
                success: false,
                message: '设备不存在'
            });
        }

        res.json({
            success: true,
            data: device
        });
    } catch (error) {
        console.error('获取设备详情失败:', error);
        res.status(500).json({
            success: false,
            message: '获取设备详情失败'
        });
    }
});

// 获取服务定价
router.get('/pricing', async (req, res) => {
    try {
        const { serviceType, deviceType } = req.query;
        
        const pricing = await ServicePricing.getPricingByService(serviceType, deviceType);
        
        res.json({
            success: true,
            data: pricing
        });
    } catch (error) {
        console.error('获取服务定价失败:', error);
        res.status(500).json({
            success: false,
            message: '获取服务定价失败'
        });
    }
});

// 计算服务价格
router.post('/pricing/calculate', async (req, res) => {
    try {
        const { serviceType, deviceType, params } = req.body;
        
        if (!serviceType || !deviceType) {
            return res.status(400).json({
                success: false,
                message: '服务类型和设备类型参数缺失'
            });
        }

        const pricing = await ServicePricing.calculatePrice(serviceType, deviceType, params);
        
        if (pricing.error) {
            return res.status(400).json({
                success: false,
                message: pricing.error
            });
        }

        res.json({
            success: true,
            data: pricing
        });
    } catch (error) {
        console.error('计算服务价格失败:', error);
        res.status(500).json({
            success: false,
            message: '计算服务价格失败'
        });
    }
});

// 创建洗衣订单
router.post('/laundry/orders', authenticateToken, async (req, res) => {
    try {
        const orderData = {
            ...req.body,
            userId: req.user.id,
            userNumber: req.user.userId,
            orderNumber: `LO${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`
        };
        // 设置时间窗口：开始=现在，结束=开始+washDuration分钟（如果未传则默认30分钟）
        const now = new Date();
        const duration = Number(orderData.washDuration || 30);
        const end = new Date(now.getTime() + duration * 60 * 1000);
        orderData.startTime = now;
        orderData.endTime = end;
        // 新订单在占用时间段内视为“进行中”以便设备判忙
        orderData.status = '进行中';

        const orderId = await LaundryOrder.create(orderData);
        // 立即将设备标记为使用中
        try {
            await SharedDevice.updateUsageStatus(orderData.deviceId, '使用中');
        } catch (e) {
            console.warn('更新设备使用状态失败:', e.message);
        }
        
        res.json({
            success: true,
            data: { orderId, orderNumber: orderData.orderNumber },
            message: '洗衣订单创建成功'
        });
    } catch (error) {
        console.error('创建洗衣订单失败:', error);
        res.status(500).json({
            success: false,
            message: '创建洗衣订单失败'
        });
    }
});

// 获取用户洗衣订单
router.get('/laundry/orders', authenticateToken, async (req, res) => {
    try {
        const { status } = req.query;
        const orders = await LaundryOrder.findByUserId(req.user.id, status);
        
        res.json({
            success: true,
            data: orders
        });
    } catch (error) {
        console.error('获取洗衣订单失败:', error);
        res.status(500).json({
            success: false,
            message: '获取洗衣订单失败'
        });
    }
});

// 获取洗衣订单详情
router.get('/laundry/orders/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const order = await LaundryOrder.findById(id);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: '订单不存在'
            });
        }

        // 检查订单是否属于当前用户
        if (order.user_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: '无权访问此订单'
            });
        }

        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error('获取洗衣订单详情失败:', error);
        res.status(500).json({
            success: false,
            message: '获取洗衣订单详情失败'
        });
    }
});

// 更新洗衣订单状态
router.put('/laundry/orders/:id/status', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { status, ...additionalData } = req.body;
        
        const order = await LaundryOrder.findById(id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: '订单不存在'
            });
        }

        // 检查订单是否属于当前用户
        if (order.user_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: '无权操作此订单'
            });
        }

        await LaundryOrder.updateStatus(id, status, additionalData);
        // 若订单完成或取消，释放设备使用状态
        if (['已完成', '已取消', '已退款'].includes(status)) {
            try { await SharedDevice.updateUsageStatus(order.device_id, '空闲'); } catch (e) { console.warn('释放设备使用状态失败:', e.message); }
        } else if (['进行中', '已支付', '打印中'].includes(status)) {
            try { await SharedDevice.updateUsageStatus(order.device_id, '使用中'); } catch (e) { console.warn('占用设备使用状态失败:', e.message); }
        }
        
        res.json({
            success: true,
            message: '订单状态更新成功'
        });
    } catch (error) {
        console.error('更新洗衣订单状态失败:', error);
        res.status(500).json({
            success: false,
            message: '更新洗衣订单状态失败'
        });
    }
});

// 创建打印任务
router.post('/printing/jobs', authenticateToken, async (req, res) => {
    try {
        const jobData = {
            ...req.body,
            userId: req.user.id,
            userNumber: req.user.userId,
            jobNumber: `PJ${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`
        };

        const jobId = await PrintJob.create(jobData);
        
        res.json({
            success: true,
            data: { jobId, jobNumber: jobData.jobNumber },
            message: '打印任务创建成功'
        });
    } catch (error) {
        console.error('创建打印任务失败:', error);
        res.status(500).json({
            success: false,
            message: '创建打印任务失败'
        });
    }
});

// 获取用户打印任务
router.get('/printing/jobs', authenticateToken, async (req, res) => {
    try {
        const { status } = req.query;
        const jobs = await PrintJob.findByUserId(req.user.id, status);
        
        res.json({
            success: true,
            data: jobs
        });
    } catch (error) {
        console.error('获取打印任务失败:', error);
        res.status(500).json({
            success: false,
            message: '获取打印任务失败'
        });
    }
});

// 获取打印任务详情
router.get('/printing/jobs/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const job = await PrintJob.findById(id);
        
        if (!job) {
            return res.status(404).json({
                success: false,
                message: '任务不存在'
            });
        }

        // 检查任务是否属于当前用户
        if (job.user_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: '无权访问此任务'
            });
        }

        res.json({
            success: true,
            data: job
        });
    } catch (error) {
        console.error('获取打印任务详情失败:', error);
        res.status(500).json({
            success: false,
            message: '获取打印任务详情失败'
        });
    }
});

// 更新打印任务状态
router.put('/printing/jobs/:id/status', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { status, ...additionalData } = req.body;
        
        const job = await PrintJob.findById(id);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: '任务不存在'
            });
        }

        // 检查任务是否属于当前用户
        if (job.user_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: '无权操作此任务'
            });
        }

        await PrintJob.updateStatus(id, status, additionalData);
        
        res.json({
            success: true,
            message: '任务状态更新成功'
        });
    } catch (error) {
        console.error('更新打印任务状态失败:', error);
        res.status(500).json({
            success: false,
            message: '更新打印任务状态失败'
        });
    }
});

// 获取用户统计信息
router.get('/user/stats', authenticateToken, async (req, res) => {
    try {
        const [laundryStats, printStats] = await Promise.all([
            LaundryOrder.getOrderStats(req.user.id),
            PrintJob.getJobStats(req.user.id)
        ]);
        
        res.json({
            success: true,
            data: {
                laundry: laundryStats,
                printing: printStats
            }
        });
    } catch (error) {
        console.error('获取用户统计失败:', error);
        res.status(500).json({
            success: false,
            message: '获取用户统计失败'
        });
    }
});

module.exports = router;

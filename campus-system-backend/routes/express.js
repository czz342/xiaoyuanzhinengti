const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const ExpressPackage = require('../models/ExpressPackage');
const ExpressStation = require('../models/ExpressStation');
const ExpressTracking = require('../models/ExpressTracking');

// 中间件：验证JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: '访问令牌缺失' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: '访问令牌无效' });
        }
        req.user = user;
        next();
    });
};

// 获取用户的快递包裹列表
router.get('/packages', authenticateToken, async (req, res) => {
    try {
        const { phone } = req.user;
        const { status } = req.query;
        
        const packages = await ExpressPackage.findByReceiverPhone(phone, status);
        
        // 为每个包裹添加跟踪信息
        const packagesWithTracking = await Promise.all(
            packages.map(async (pkg) => {
                const tracking = await ExpressTracking.findByPackageId(pkg.id);
                return {
                    ...pkg,
                    trackingInfo: tracking
                };
            })
        );
        
        res.json({
            success: true,
            data: packagesWithTracking
        });
    } catch (error) {
        console.error('获取快递列表失败:', error);
        res.status(500).json({
            success: false,
            message: '获取快递列表失败'
        });
    }
});

// 根据快递单号查询包裹
router.get('/packages/tracking/:trackingNumber', async (req, res) => {
    try {
        const { trackingNumber } = req.params;
        
        const package = await ExpressPackage.findByTrackingNumber(trackingNumber);
        if (!package) {
            return res.status(404).json({
                success: false,
                message: '未找到该快递单号'
            });
        }
        
        const tracking = await ExpressTracking.findByTrackingNumber(trackingNumber);
        
        res.json({
            success: true,
            data: {
                ...package,
                trackingInfo: tracking
            }
        });
    } catch (error) {
        console.error('查询快递失败:', error);
        res.status(500).json({
            success: false,
            message: '查询快递失败'
        });
    }
});

// 搜索快递包裹
router.get('/packages/search', authenticateToken, async (req, res) => {
    try {
        const { q } = req.query;
        
        if (!q || q.trim().length < 2) {
            return res.status(400).json({
                success: false,
                message: '搜索关键词至少需要2个字符'
            });
        }
        
        const packages = await ExpressPackage.searchPackages(q.trim());
        
        // 为每个包裹添加跟踪信息
        const packagesWithTracking = await Promise.all(
            packages.map(async (pkg) => {
                const tracking = await ExpressTracking.findByPackageId(pkg.id);
                return {
                    ...pkg,
                    trackingInfo: tracking
                };
            })
        );
        
        res.json({
            success: true,
            data: packagesWithTracking
        });
    } catch (error) {
        console.error('搜索快递失败:', error);
        res.status(500).json({
            success: false,
            message: '搜索快递失败'
        });
    }
});

// 获取包裹详情
router.get('/packages/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        
        const package = await ExpressPackage.findById(id);
        if (!package) {
            return res.status(404).json({
                success: false,
                message: '包裹不存在'
            });
        }
        
        // 验证用户权限（只有收件人可以查看）
        if (package.receiver_phone !== req.user.phone) {
            return res.status(403).json({
                success: false,
                message: '无权限查看此包裹'
            });
        }
        
        const tracking = await ExpressTracking.findByPackageId(id);
        
        res.json({
            success: true,
            data: {
                ...package,
                trackingInfo: tracking
            }
        });
    } catch (error) {
        console.error('获取包裹详情失败:', error);
        res.status(500).json({
            success: false,
            message: '获取包裹详情失败'
        });
    }
});

// 获取快递驿站列表
router.get('/stations', async (req, res) => {
    try {
        const { latitude, longitude, radius } = req.query;
        
        let stations;
        if (latitude && longitude) {
            stations = await ExpressStation.getNearbyStations(
                parseFloat(latitude),
                parseFloat(longitude),
                parseFloat(radius) || 5
            );
        } else {
            stations = await ExpressStation.getAll();
        }
        
        res.json({
            success: true,
            data: stations
        });
    } catch (error) {
        console.error('获取驿站列表失败:', error);
        res.status(500).json({
            success: false,
            message: '获取驿站列表失败'
        });
    }
});

// 获取驿站详情
router.get('/stations/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const station = await ExpressStation.findById(id);
        if (!station) {
            return res.status(404).json({
                success: false,
                message: '驿站不存在'
            });
        }
        
        // 获取该驿站的包裹统计
        const packages = await ExpressPackage.findByStation(id);
        
        res.json({
            success: true,
            data: {
                ...station,
                packageCount: packages.length,
                packages: packages
            }
        });
    } catch (error) {
        console.error('获取驿站详情失败:', error);
        res.status(500).json({
            success: false,
            message: '获取驿站详情失败'
        });
    }
});

// 获取快递统计信息
router.get('/stats', authenticateToken, async (req, res) => {
    try {
        const { phone } = req.user;
        
        // 获取用户的所有包裹
        const allPackages = await ExpressPackage.findByReceiverPhone(phone);
        
        const stats = {
            total: allPackages.length,
            inTransit: allPackages.filter(p => p.status === 'in_transit').length,
            arrived: allPackages.filter(p => p.status === 'arrived').length,
            pickedUp: allPackages.filter(p => p.status === 'picked_up').length,
            delivered: allPackages.filter(p => p.status === 'delivered').length,
            returned: allPackages.filter(p => p.status === 'returned').length
        };
        
        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('获取统计信息失败:', error);
        res.status(500).json({
            success: false,
            message: '获取统计信息失败'
        });
    }
});

// 获取跟踪记录
router.get('/tracking/:trackingNumber', async (req, res) => {
    try {
        const { trackingNumber } = req.params;
        
        const tracking = await ExpressTracking.findByTrackingNumber(trackingNumber);
        
        res.json({
            success: true,
            data: tracking
        });
    } catch (error) {
        console.error('获取跟踪记录失败:', error);
        res.status(500).json({
            success: false,
            message: '获取跟踪记录失败'
        });
    }
});

// 管理员接口：创建包裹
router.post('/packages', authenticateToken, async (req, res) => {
    try {
        // 这里可以添加管理员权限检查
        const packageData = req.body;
        
        const packageId = await ExpressPackage.create(packageData);
        
        // 生成初始跟踪记录
        await ExpressTracking.generateStandardTracking(
            packageId,
            packageData.trackingNumber,
            packageData.status || 'in_transit'
        );
        
        res.json({
            success: true,
            data: { id: packageId },
            message: '包裹创建成功'
        });
    } catch (error) {
        console.error('创建包裹失败:', error);
        res.status(500).json({
            success: false,
            message: '创建包裹失败'
        });
    }
});

// 管理员接口：更新包裹状态
router.put('/packages/:id/status', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { status, additionalData } = req.body;
        
        const success = await ExpressPackage.updateStatus(id, status, additionalData);
        
        if (!success) {
            return res.status(404).json({
                success: false,
                message: '包裹不存在或更新失败'
            });
        }
        
        // 添加跟踪记录
        const package = await ExpressPackage.findById(id);
        if (package) {
            await ExpressTracking.create({
                packageId: id,
                trackingNumber: package.tracking_number,
                status: status,
                statusDescription: getStatusDescription(status),
                location: additionalData?.location || '系统',
                operator: additionalData?.operator || '系统',
                timestamp: new Date(),
                details: additionalData?.details || {}
            });
        }
        
        res.json({
            success: true,
            message: '状态更新成功'
        });
    } catch (error) {
        console.error('更新包裹状态失败:', error);
        res.status(500).json({
            success: false,
            message: '更新包裹状态失败'
        });
    }
});

// 管理员接口：创建驿站
router.post('/stations', authenticateToken, async (req, res) => {
    try {
        const stationData = req.body;
        
        const stationId = await ExpressStation.create(stationData);
        
        res.json({
            success: true,
            data: { id: stationId },
            message: '驿站创建成功'
        });
    } catch (error) {
        console.error('创建驿站失败:', error);
        res.status(500).json({
            success: false,
            message: '创建驿站失败'
        });
    }
});

// 获取系统统计信息（管理员）
router.get('/admin/stats', authenticateToken, async (req, res) => {
    try {
        const packageStats = await ExpressPackage.getStats();
        const stationStats = await ExpressStation.getStats();
        const recentActivity = await ExpressTracking.getRecentActivity(24);
        
        res.json({
            success: true,
            data: {
                packages: packageStats,
                stations: stationStats,
                recentActivity: recentActivity
            }
        });
    } catch (error) {
        console.error('获取系统统计失败:', error);
        res.status(500).json({
            success: false,
            message: '获取系统统计失败'
        });
    }
});

// 辅助函数：获取状态描述
function getStatusDescription(status) {
    const statusMap = {
        'in_transit': '运输中',
        'arrived': '已到达',
        'picked_up': '已取件',
        'delivered': '已签收',
        'returned': '已退回'
    };
    return statusMap[status] || status;
}

module.exports = router;

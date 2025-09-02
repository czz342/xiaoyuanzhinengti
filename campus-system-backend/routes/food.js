const express = require('express');
const router = express.Router();
const Canteen = require('../models/Canteen');
const Food = require('../models/Food');
const FoodOrder = require('../models/FoodOrder');
const FoodOrderItem = require('../models/FoodOrderItem');
const { authenticateToken } = require('../middleware/auth');
const { success, error } = require('../utils/response');

// 获取食堂列表
router.get('/canteens', async (req, res) => {
    try {
        const canteens = await Canteen.getStatus();
        return res.json(success('获取食堂列表成功', canteens));
    } catch (err) {
        console.error('GET /api/food/canteens', err);
        return res.status(500).json(error('获取食堂列表失败'));
    }
});

// 获取指定食堂的菜品列表
router.get('/canteens/:canteenId/foods', async (req, res) => {
    try {
        const canteenId = req.params.canteenId;
        console.log('获取菜品，食堂ID/编号:', canteenId);
        
        // 先通过食堂编号查找食堂
        const canteen = await Canteen.findByNumber(canteenId);
        if (!canteen) {
            return res.status(404).json(error('食堂不存在'));
        }
        
        console.log('找到食堂:', canteen);
        
        // 通过食堂ID查找菜品
        const foods = await Food.findByCanteen(canteen.id);
        console.log('找到菜品数量:', foods.length);
        
        // 处理图片路径，确保返回完整的URL
        const processedFoods = foods.map(food => {
            if (food.image && !food.image.startsWith('http')) {
                // 如果是相对路径，转换为完整URL
                food.image = `http://localhost:3000${food.image}`;
            }
            return food;
        });
        
        return res.json(success('获取菜品列表成功', processedFoods));
    } catch (err) {
        console.error('GET /api/food/canteens/:canteenId/foods', err);
        return res.status(500).json(error('获取菜品列表失败'));
    }
});

// 获取菜品分类
router.get('/categories', async (req, res) => {
    try {
        const categories = await Food.getCategories();
        return res.json(success('获取菜品分类成功', categories));
    } catch (err) {
        console.error('GET /api/food/categories', err);
        return res.status(500).json(error('获取菜品分类失败'));
    }
});

// 搜索菜品
router.get('/search', async (req, res) => {
    try {
        const { keyword } = req.query;
        if (!keyword) {
            return res.status(400).json(error('搜索关键词不能为空'));
        }
        const foods = await Food.search(keyword);
        return res.json(success('搜索菜品成功', foods));
    } catch (err) {
        console.error('GET /api/food/search', err);
        return res.status(500).json(error('搜索菜品失败'));
    }
});

// 获取推荐菜品
router.get('/recommended', async (req, res) => {
    try {
        const foods = await Food.getRecommended();
        return res.json(success('获取推荐菜品成功', foods));
    } catch (err) {
        console.error('GET /api/food/recommended', err);
        return res.status(500).json(error('获取推荐菜品失败'));
    }
});

// 创建订单
router.post('/orders', authenticateToken, async (req, res) => {
    try {
        const {
            canteenId,
            diningType,
            items,
            deliveryAddress,
            deliveryPhone,
            deliveryNotes,
            notes
        } = req.body;

        if (!canteenId || !diningType || !items || items.length === 0) {
            return res.status(400).json(error('订单信息不完整'));
        }

        // 验证用餐类型
        const validDiningTypes = ['dine_in', 'takeaway', 'delivery'];
        if (!validDiningTypes.includes(diningType)) {
            return res.status(400).json(error('无效的用餐类型'));
        }

        // 外卖必须提供地址和电话
        if (diningType === 'delivery' && (!deliveryAddress || !deliveryPhone)) {
            return res.status(400).json(error('外卖订单必须提供配送地址和联系电话'));
        }

        // 计算订单金额
        let totalAmount = 0;
        let deliveryFee = 0;

        for (const item of items) {
            const food = await Food.findById(item.foodId);
            if (!food) {
                return res.status(400).json(error(`菜品不存在: ${item.foodName}`));
            }
            if (food.status !== 'available') {
                return res.status(400).json(error(`菜品已售罄: ${food.name}`));
            }
            totalAmount += food.price * item.quantity;
        }

        // 外卖收取配送费
        if (diningType === 'delivery') {
            deliveryFee = totalAmount >= 20 ? 0 : 3; // 满20免配送费
        }

        const finalAmount = totalAmount + deliveryFee;

        // 生成订单号
        const orderNumber = await FoodOrder.generateOrderNumber();

        // 创建订单
        const orderData = {
            order_number: orderNumber,
            user_id: req.user.id,
            canteen_id: canteenId,
            dining_type: diningType,
            total_amount: totalAmount,
            delivery_fee: deliveryFee,
            final_amount: finalAmount,
            delivery_address: deliveryAddress,
            delivery_phone: deliveryPhone,
            delivery_notes: deliveryNotes,
            notes: notes
        };

        const orderId = await FoodOrder.create(orderData);

        // 创建订单项
        const orderItems = items.map(item => ({
            order_id: orderId,
            food_id: item.foodId,
            food_name: item.foodName,
            food_image: item.foodImage,
            quantity: item.quantity,
            unit_price: item.unitPrice,
            total_price: item.unitPrice * item.quantity,
            notes: item.notes
        }));

        await FoodOrderItem.createBatch(orderItems);

        // 生成取餐码（堂食和外带）
        let pickupCode = null;
        if (diningType !== 'delivery') {
            pickupCode = Math.random().toString(36).substr(2, 6).toUpperCase();
            await FoodOrder.updateStatus(orderId, 'confirmed', 'confirmed_time');
        }

        // 获取完整订单信息
        const order = await FoodOrder.findById(orderId);
        const orderItemsData = await FoodOrderItem.findByOrderId(orderId);

        return res.json(success('下单成功', {
            order: { ...order, pickupCode },
            items: orderItemsData
        }));

    } catch (err) {
        console.error('POST /api/food/orders', err);
        return res.status(500).json(error('下单失败'));
    }
});

// 获取用户订单列表
router.get('/orders/my', authenticateToken, async (req, res) => {
    try {
        const orders = await FoodOrder.findByUserId(req.user.id);
        
        // 为每个订单添加订单项信息
        const ordersWithItems = await Promise.all(
            orders.map(async (order) => {
                const items = await FoodOrderItem.findByOrderId(order.id);
                return { ...order, items };
            })
        );

        return res.json(success('获取订单列表成功', ordersWithItems));
    } catch (err) {
        console.error('GET /api/food/orders/my', err);
        return res.status(500).json(error('获取订单列表失败'));
    }
});

// 获取订单详情
router.get('/orders/:orderId', authenticateToken, async (req, res) => {
    try {
        const orderId = parseInt(req.params.orderId, 10);
        const order = await FoodOrder.findById(orderId);
        
        if (!order) {
            return res.status(404).json(error('订单不存在'));
        }

        // 检查权限：只能查看自己的订单
        if (order.user_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json(error('无权查看此订单'));
        }

        const items = await FoodOrderItem.findByOrderId(orderId);
        return res.json(success('获取订单详情成功', { ...order, items }));
    } catch (err) {
        console.error('GET /api/food/orders/:orderId', err);
        return res.status(500).json(error('获取订单详情失败'));
    }
});

// 取消订单
router.put('/orders/:orderId/cancel', authenticateToken, async (req, res) => {
    try {
        const orderId = parseInt(req.params.orderId, 10);
        const { reason } = req.body;

        const order = await FoodOrder.findById(orderId);
        if (!order) {
            return res.status(404).json(error('订单不存在'));
        }

        // 检查权限
        if (order.user_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json(error('无权操作此订单'));
        }

        // 只能取消待确认或已确认的订单
        if (!['pending', 'confirmed'].includes(order.status)) {
            return res.status(400).json(error('当前订单状态不允许取消'));
        }

        await FoodOrder.cancel(orderId, reason);
        return res.json(success('订单取消成功'));
    } catch (err) {
        console.error('PUT /api/food/orders/:orderId/cancel', err);
        return res.status(500).json(error('取消订单失败'));
    }
});

// 获取订单统计
router.get('/orders/stats', authenticateToken, async (req, res) => {
    try {
        const stats = await FoodOrder.getStats(req.user.id);
        return res.json(success('获取订单统计成功', stats));
    } catch (err) {
        console.error('GET /api/food/orders/stats', err);
        return res.status(500).json(error('获取订单统计失败'));
    }
});

module.exports = router;

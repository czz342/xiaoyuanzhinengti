const { db } = require('../config/database');

class ErrandOrder {
    static async createTable() {
        const sql = `
            CREATE TABLE IF NOT EXISTS errand_orders (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(200) NOT NULL,
                description TEXT,
                service_type ENUM('快递代取','物品代买','排队代办','其他代办') NOT NULL,
                price DECIMAL(10,2) NOT NULL DEFAULT 0,
                status ENUM('待接单','已接单','进行中','已完成','已取消','已退款') NOT NULL DEFAULT '待接单',
                publisher_id INT NOT NULL,
                accepter_id INT NULL,
                pickup_location VARCHAR(255) NOT NULL,
                delivery_location VARCHAR(255) NOT NULL,
                expected_time DATETIME NULL,
                phone VARCHAR(32) NOT NULL,
                created_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
                accepted_time DATETIME NULL,
                completed_time DATETIME NULL,
                INDEX idx_publisher (publisher_id),
                INDEX idx_status (status),
                INDEX idx_service_type (service_type),
                INDEX idx_created_time (created_time)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `;
        await db.execute(sql);
    }

    static async create(order) {
        const sql = `INSERT INTO errand_orders
            (title, description, service_type, price, status, publisher_id, pickup_location, delivery_location, expected_time, phone)
            VALUES (?,?,?,?, '待接单', ?, ?, ?, ?, ?)`;
        const params = [
            order.title,
            order.description || null,
            order.service_type,
            order.price,
            order.publisher_id,
            order.pickup_location,
            order.delivery_location,
            order.expected_time || null,
            order.phone
        ];
        const [result] = await db.execute(sql, params);
        return { id: result.insertId, ...order, status: '待接单' };
    }

    static async findById(id) {
        const [rows] = await db.execute('SELECT * FROM errand_orders WHERE id=?', [id]);
        return rows[0] || null;
    }

    static async findByTitle(title) {
        const [rows] = await db.execute('SELECT * FROM errand_orders WHERE title = ?', [title]);
        return rows[0] || null;
    }

    static async findDetailById(id) {
        const sql = `
            SELECT eo.*, 
                   p.displayName AS publisher_name, p.picture AS publisher_avatar,
                   p.creditScore AS publisherCreditScore, p.completedOrders AS publisherCompletedOrders,
                   a.displayName AS accepter_name, a.picture AS accepter_avatar,
                   a.creditScore AS accepterCreditScore, a.completedOrders AS accepterCompletedOrders
            FROM errand_orders eo
            LEFT JOIN users p ON eo.publisher_id = p.id
            LEFT JOIN users a ON eo.accepter_id = a.id
            WHERE eo.id = ?
        `;
        const [rows] = await db.execute(sql, [id]);
        return rows[0] || null;
    }

    static async listMyOrders(userId) {
        const sql = `
            SELECT eo.*, u.displayName AS publisher_name, u.picture AS publisher_avatar
            FROM errand_orders eo
            LEFT JOIN users u ON eo.publisher_id = u.id
            WHERE eo.publisher_id = ?
            ORDER BY eo.created_time DESC
        `;
        const [rows] = await db.execute(sql, [userId]);
        return rows;
    }

    static async listAcceptedOrders(userId) {
        const sql = `
            SELECT eo.*, u.displayName AS publisher_name, u.picture AS publisher_avatar
            FROM errand_orders eo
            LEFT JOIN users u ON eo.publisher_id = u.id
            WHERE eo.accepter_id = ?
            ORDER BY eo.created_time DESC
        `;
        const [rows] = await db.execute(sql, [userId]);
        return rows;
    }

    static async listAvailable({ serviceType, minPrice, maxPrice, offset = 0, limit = 20, excludeUserId }) {
        const clauses = ['eo.status = \u0027待接单\u0027'];
        const params = [];
        
        // 排除当前用户发布的订单
        if (excludeUserId) {
            clauses.push('eo.publisher_id != ?');
            params.push(excludeUserId);
        }
        
        if (serviceType) {
            clauses.push('eo.service_type = ?');
            params.push(serviceType);
        }
        if (minPrice != null) {
            clauses.push('eo.price >= ?');
            params.push(minPrice);
        }
        if (maxPrice != null) {
            clauses.push('eo.price <= ?');
            params.push(maxPrice);
        }
        const where = clauses.length ? 'WHERE ' + clauses.join(' AND ') : '';
        params.push(Number(offset) || 0);
        params.push(Number(limit) || 20);
        const sql = `
            SELECT eo.*, 
                   u.displayName AS publisher_name, 
                   u.picture AS publisher_avatar,
                   u.creditScore,
                   u.completedOrders
            FROM errand_orders eo
            LEFT JOIN users u ON eo.publisher_id = u.id
            ${where}
            ORDER BY eo.created_time DESC
            LIMIT ?,?
        `;
        const [rows] = await db.execute(sql, params);
        return rows;
    }

    static async acceptOrder({ orderId, accepterId }) {
        const now = new Date();
        const [res] = await db.execute(
            `UPDATE errand_orders SET status='已接单', accepter_id=?, accepted_time=? WHERE id=? AND status='待接单'`,
            [accepterId, now, orderId]
        );
        return res.affectedRows > 0;
    }

    static async cancelOrder({ orderId, userId }) {
        const [res] = await db.execute(
            `UPDATE errand_orders SET status='已取消' WHERE id=? AND publisher_id=? AND status IN ('待接单','已接单')`,
            [orderId, userId]
        );
        return res.affectedRows > 0;
    }

    static async completeOrder({ orderId, userId }) {
        const now = new Date();
        const [res] = await db.execute(
            `UPDATE errand_orders SET status='已完成', completed_time=? WHERE id=? AND (publisher_id=? OR accepter_id=?) AND status IN ('已接单','进行中')`,
            [now, orderId, userId, userId]
        );
        return res.affectedRows > 0;
    }

    // 获取订单的评分状态
    static async getRatingStatus(orderId, userId) {
        const order = await this.findById(orderId);
        if (!order) return null;

        const UserRating = require('./UserRating');
        const canRatePublisher = order.publisher_id !== userId && 
            !(await UserRating.hasRated(orderId, userId, order.publisher_id));
        const canRateAccepter = order.accepter_id && order.accepter_id !== userId && 
            !(await UserRating.hasRated(orderId, userId, order.accepter_id));

        return {
            order,
            canRatePublisher,
            canRateAccepter,
            publisherId: order.publisher_id,
            accepterId: order.accepter_id
        };
    }

    // 更新用户完成订单数
    static async updateUserCompletedOrders(orderId) {
        const order = await this.findById(orderId);
        if (!order || order.status !== '已完成') return false;

        const User = require('./User');
        try {
            if (order.accepter_id) {
                await User.incrementCompletedOrders(order.accepter_id);
            }
            return true;
        } catch (error) {
            console.error('更新用户完成订单数失败:', error);
            return false;
        }
    }

    // 管理员相关方法
    // 获取所有订单列表（管理员）
    static async listAllOrders(filters = {}) {
        console.log('listAllOrders called with filters:', filters);
        
        try {
            // 先获取总数
            const [countResult] = await db.execute('SELECT COUNT(*) as total FROM errand_orders');
            const total = countResult[0].total;
            
            // 获取订单列表
            const limit = Number(filters.limit) || 10;
            const offset = Number(filters.offset) || 0;
            
            const [rows] = await db.execute(
                'SELECT * FROM errand_orders ORDER BY created_time DESC LIMIT ? OFFSET ?',
                [limit, offset]
            );
            
            console.log('Found orders:', rows.length);
            
            // 为每个订单获取用户信息
            const orders = [];
            for (const order of rows) {
                const orderWithUsers = { ...order };
                
                // 获取发布者信息
                if (order.publisher_id) {
                    try {
                        const [publisherRows] = await db.execute('SELECT displayName, phone FROM users WHERE id = ?', [order.publisher_id]);
                        if (publisherRows.length > 0) {
                            orderWithUsers.publisher_name = publisherRows[0].displayName;
                            orderWithUsers.publisher_phone = publisherRows[0].phone;
                        }
                    } catch (err) {
                        console.error('Error fetching publisher info:', err);
                    }
                }
                
                // 获取接单者信息
                if (order.accepter_id) {
                    try {
                        const [accepterRows] = await db.execute('SELECT displayName, phone FROM users WHERE id = ?', [order.accepter_id]);
                        if (accepterRows.length > 0) {
                            orderWithUsers.accepter_name = accepterRows[0].displayName;
                            orderWithUsers.accepter_phone = accepterRows[0].phone;
                        }
                    } catch (err) {
                        console.error('Error fetching accepter info:', err);
                    }
                }
                
                orders.push(orderWithUsers);
            }
            
            console.log('Returning orders:', orders.length);
            return { orders, total };
            
        } catch (error) {
            console.error('Error in listAllOrders:', error);
            throw error;
        }
    }

    // 更新订单状态（管理员）
    static async updateStatus(orderId, status) {
        const validStatuses = ['待接单', '已接单', '进行中', '已完成', '已取消', '已退款'];
        if (!validStatuses.includes(status)) {
            throw new Error('无效的状态');
        }

        const [result] = await db.execute(
            'UPDATE errand_orders SET status = ?, updated_at = NOW() WHERE id = ?',
            [status, orderId]
        );

        return result.affectedRows > 0;
    }

    // 获取订单统计（管理员）- 使用模拟数据
    static async getAdminStats(filters = {}) {
        // 返回原数据模拟数据
        return {
            total_orders: 156,
            pending_orders: 12,
            completed_orders: 140,
            cancelled_orders: 4,
            total_revenue: 12345,
            average_order_value: 88.2,
            completion_rate: 89.5,
            orders_by_status: [
                { status: '已完成', count: 140 },
                { status: '待接单', count: 12 },
                { status: '进行中', count: 8 },
                { status: '已取消', count: 4 },
                { status: '已退款', count: 2 }
            ],
            orders_by_service_type: [
                { service_type: '快递代取', count: 65 },
                { service_type: '物品代买', count: 45 },
                { service_type: '排队代办', count: 28 },
                { service_type: '其他代办', count: 18 }
            ],
            daily_orders: [
                { date: '2024-01-01', count: 5 },
                { date: '2024-01-02', count: 4 },
                { date: '2024-01-03', count: 6 },
                { date: '2024-01-04', count: 7 },
                { date: '2024-01-05', count: 5 },
                { date: '2024-01-06', count: 4 },
                { date: '2024-01-07', count: 3 },
                { date: '2024-01-08', count: 5 },
                { date: '2024-01-09', count: 6 },
                { date: '2024-01-10', count: 7 },
                { date: '2024-01-11', count: 5 },
                { date: '2024-01-12', count: 6 },
                { date: '2024-01-13', count: 6 },
                { date: '2024-01-14', count: 7 },
                { date: '2024-01-15', count: 4 },
                { date: '2024-01-16', count: 5 },
                { date: '2024-01-17', count: 6 },
                { date: '2024-01-18', count: 6 },
                { date: '2024-01-19', count: 5 },
                { date: '2024-01-20', count: 6 },
                { date: '2024-01-21', count: 4 },
                { date: '2024-01-22', count: 5 },
                { date: '2024-01-23', count: 6 },
                { date: '2024-01-24', count: 7 },
                { date: '2024-01-25', count: 5 },
                { date: '2024-01-26', count: 6 },
                { date: '2024-01-27', count: 6 },
                { date: '2024-01-28', count: 5 },
                { date: '2024-01-29', count: 6 },
                { date: '2024-01-30', count: 7 }
            ],
            top_riders: [
                { rider_id: 1, rider_name: '张三', completed_orders: 18, average_rating: 4.8 },
                { rider_id: 2, rider_name: '李四', completed_orders: 16, average_rating: 4.7 },
                { rider_id: 3, rider_name: '王五', completed_orders: 14, average_rating: 4.9 },
                { rider_id: 4, rider_name: '赵六', completed_orders: 12, average_rating: 4.6 },
                { rider_id: 5, rider_name: '钱七', completed_orders: 11, average_rating: 4.8 },
                { rider_id: 6, rider_name: '孙八', completed_orders: 10, average_rating: 4.5 },
                { rider_id: 7, rider_name: '周九', completed_orders: 9, average_rating: 4.7 },
                { rider_id: 8, rider_name: '吴十', completed_orders: 8, average_rating: 4.6 },
                { rider_id: 9, rider_name: '郑十一', completed_orders: 7, average_rating: 4.8 },
                { rider_id: 10, rider_name: '王十二', completed_orders: 6, average_rating: 4.4 }
            ]
        };
    }

    // 获取骑手列表（管理员）
    static async getRiderList(filters = {}) {
        const { keyword, limit = 10, offset = 0 } = filters;
        
        let whereClause = 'WHERE u.role = "rider" OR u.role = "user"';
        const params = [];

        if (keyword) {
            whereClause += ' AND (u.displayName LIKE ? OR u.userName LIKE ?)';
            params.push(`%${keyword}%`, `%${keyword}%`);
        }

        params.push(Number(limit));
        params.push(Number(offset));

        const sql = `
            SELECT 
                u.id,
                u.userId,
                u.userName,
                u.displayName,
                u.phone,
                COALESCE(completed_stats.completed_orders, 0) as completed_orders,
                COALESCE(rating_stats.average_rating, 0) as average_rating,
                COALESCE(earnings.total_earnings, 0) as total_earnings,
                u.status,
                u.createdTime
            FROM users u
            LEFT JOIN (
                SELECT 
                    accepter_id,
                    COUNT(*) as completed_orders
                FROM errand_orders
                WHERE status = '已完成'
                GROUP BY accepter_id
            ) completed_stats ON u.id = completed_stats.accepter_id
            LEFT JOIN (
                SELECT 
                    rated_user_id,
                    AVG(rating) as average_rating
                FROM user_ratings
                GROUP BY rated_user_id
            ) rating_stats ON u.id = rating_stats.rated_user_id
            LEFT JOIN (
                SELECT 
                    accepter_id,
                    SUM(price) as total_earnings
                FROM errand_orders
                WHERE status = '已完成'
                GROUP BY accepter_id
            ) earnings ON u.id = earnings.accepter_id
            ${whereClause}
            ORDER BY completed_orders DESC, average_rating DESC
            LIMIT ?, ?
        `;

        const countSql = `
            SELECT COUNT(*) as total
            FROM users u
            ${whereClause}
        `;

        const [rows] = await db.execute(sql, params);
        const [countResult] = await db.execute(countSql, params.slice(0, -2));
        const total = countResult[0].total;

        return { riders: rows, total };
    }
}

module.exports = ErrandOrder;



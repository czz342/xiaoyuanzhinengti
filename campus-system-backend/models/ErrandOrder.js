const { db } = require('../config/database');

class ErrandOrder {
    static async createTable() {
        const sql = `
            CREATE TABLE IF NOT EXISTS errand_orders (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(200) NOT NULL,
                description TEXT,
                service_type ENUM('外卖代拿','快递代取','小事代办') NOT NULL,
                price DECIMAL(10,2) NOT NULL DEFAULT 0,
                status ENUM('待接单','已接单','进行中','已完成','已取消') NOT NULL DEFAULT '待接单',
                publisher_id INT NOT NULL,
                accepter_id INT NULL,
                pickup_location VARCHAR(255) NOT NULL,
                delivery_location VARCHAR(255) NOT NULL,
                expected_time DATETIME NULL,
                phone VARCHAR(32) NOT NULL,
                created_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
}

module.exports = ErrandOrder;



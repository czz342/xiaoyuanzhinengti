const { db } = require('../config/database');

class LaundryOrder {
    static async createTable() {
        const sql = `
            CREATE TABLE IF NOT EXISTS laundry_orders (
                id INT AUTO_INCREMENT PRIMARY KEY,
                order_number VARCHAR(50) UNIQUE NOT NULL COMMENT '订单编号',
                user_id INT NOT NULL COMMENT '用户ID',
                user_number VARCHAR(50) NOT NULL COMMENT '用户编号',
                device_id INT NOT NULL COMMENT '设备ID',
                device_number VARCHAR(50) NOT NULL COMMENT '设备编号',
                device_name VARCHAR(100) NOT NULL COMMENT '设备名称',
                device_location VARCHAR(200) NOT NULL COMMENT '设备位置',
                wash_type ENUM('标准洗', '快速洗', '深度洗', '羊毛洗', '羽绒洗') DEFAULT '标准洗' COMMENT '洗涤类型',
                wash_temperature ENUM('冷水', '温水', '热水') DEFAULT '温水' COMMENT '洗涤温度',
                wash_duration INT NOT NULL COMMENT '洗涤时长(分钟)',
                spin_speed ENUM('低转速', '中转速', '高转速') DEFAULT '中转速' COMMENT '脱水转速',
                detergent_type ENUM('普通洗衣液', '柔顺剂', '漂白剂', '无添加') DEFAULT '普通洗衣液' COMMENT '洗涤剂类型',
                special_requirements TEXT COMMENT '特殊要求',
                estimated_cost DECIMAL(8,2) NOT NULL COMMENT '预估费用',
                actual_cost DECIMAL(8,2) COMMENT '实际费用',
                status ENUM('待支付', '已支付', '进行中', '已完成', '已取消', '已退款') DEFAULT '待支付' COMMENT '订单状态',
                payment_method ENUM('微信支付', '支付宝', '校园卡', '现金') COMMENT '支付方式',
                payment_time DATETIME COMMENT '支付时间',
                start_time DATETIME COMMENT '开始时间',
                end_time DATETIME COMMENT '结束时间',
                completion_time DATETIME COMMENT '完成时间',
                cancel_reason TEXT COMMENT '取消原因',
                refund_amount DECIMAL(8,2) DEFAULT 0 COMMENT '退款金额',
                refund_time DATETIME COMMENT '退款时间',
                user_rating INT COMMENT '用户评分(1-5)',
                user_feedback TEXT COMMENT '用户反馈',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_order_number (order_number),
                INDEX idx_user_id (user_id),
                INDEX idx_user_number (user_number),
                INDEX idx_device_id (device_id),
                INDEX idx_status (status),
                INDEX idx_created_at (created_at),
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (device_id) REFERENCES shared_devices(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='洗衣订单表'
        `;
        await db.execute(sql);
    }

    static async create(orderData) {
        const sql = `
            INSERT INTO laundry_orders (
                order_number, user_id, user_number, device_id, device_number,
                device_name, device_location, wash_type, wash_temperature,
                wash_duration, spin_speed, detergent_type, special_requirements,
                estimated_cost, actual_cost, status, payment_method,
                start_time, end_time
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            orderData.orderNumber,
            orderData.userId,
            orderData.userNumber,
            orderData.deviceId,
            orderData.deviceNumber,
            orderData.deviceName,
            orderData.deviceLocation,
            orderData.washType || '标准洗',
            orderData.washTemperature || '温水',
            orderData.washDuration,
            orderData.spinSpeed || '中转速',
            orderData.detergentType || '普通洗衣液',
            orderData.specialRequirements,
            orderData.estimatedCost,
            orderData.actualCost,
            orderData.status || '待支付',
            orderData.paymentMethod,
            orderData.startTime,
            orderData.endTime
        ];
        
        const [result] = await db.execute(sql, values);
        return result.insertId;
    }

    static async findById(id) {
        const sql = 'SELECT * FROM laundry_orders WHERE id = ?';
        const [rows] = await db.execute(sql, [id]);
        return rows.length > 0 ? rows[0] : null;
    }

    static async findByOrderNumber(orderNumber) {
        const sql = 'SELECT * FROM laundry_orders WHERE order_number = ?';
        const [rows] = await db.execute(sql, [orderNumber]);
        return rows.length > 0 ? rows[0] : null;
    }

    static async findByUserId(userId, status = null) {
        let sql = 'SELECT * FROM laundry_orders WHERE user_id = ?';
        const values = [userId];

        if (status) {
            sql += ' AND status = ?';
            values.push(status);
        }

        sql += ' ORDER BY created_at DESC';

        const [rows] = await db.execute(sql, values);
        return rows;
    }

    static async findByUserNumber(userNumber, status = null) {
        let sql = 'SELECT * FROM laundry_orders WHERE user_number = ?';
        const values = [userNumber];

        if (status) {
            sql += ' AND status = ?';
            values.push(status);
        }

        sql += ' ORDER BY created_at DESC';

        const [rows] = await db.execute(sql, values);
        return rows;
    }

    static async getBusyDeviceIds(queryTime = null) {
        const currentTime = queryTime || new Date();
        const sql = `
            SELECT DISTINCT device_id 
            FROM laundry_orders 
            WHERE status IN ('已支付', '进行中') 
            AND start_time <= ? 
            AND (end_time IS NULL OR end_time >= ?)
        `;
        const [rows] = await db.execute(sql, [currentTime, currentTime]);
        return rows.map(row => row.device_id);
    }

    static async getActiveOrdersByDevice(deviceId) {
        const sql = `
            SELECT * FROM laundry_orders 
            WHERE device_id = ? 
            AND status IN ('已支付', '进行中')
            ORDER BY start_time ASC
        `;
        const [rows] = await db.execute(sql, [deviceId]);
        return rows;
    }

    static async updateStatus(id, status, additionalData = {}) {
        const fields = ['status = ?', 'updated_at = CURRENT_TIMESTAMP'];
        const values = [status];

        if (additionalData.paymentTime) {
            fields.push('payment_time = ?');
            values.push(additionalData.paymentTime);
        }

        if (additionalData.startTime) {
            fields.push('start_time = ?');
            values.push(additionalData.startTime);
        }

        if (additionalData.endTime) {
            fields.push('end_time = ?');
            values.push(additionalData.endTime);
        }

        if (additionalData.completionTime) {
            fields.push('completion_time = ?');
            values.push(additionalData.completionTime);
        }

        if (additionalData.actualCost !== undefined) {
            fields.push('actual_cost = ?');
            values.push(additionalData.actualCost);
        }

        if (additionalData.cancelReason) {
            fields.push('cancel_reason = ?');
            values.push(additionalData.cancelReason);
        }

        if (additionalData.refundAmount !== undefined) {
            fields.push('refund_amount = ?');
            values.push(additionalData.refundAmount);
        }

        if (additionalData.refundTime) {
            fields.push('refund_time = ?');
            values.push(additionalData.refundTime);
        }

        values.push(id);
        const sql = `UPDATE laundry_orders SET ${fields.join(', ')} WHERE id = ?`;
        await db.execute(sql, values);
    }

    static async addRating(id, rating, feedback = null) {
        const sql = `
            UPDATE laundry_orders 
            SET user_rating = ?, user_feedback = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?
        `;
        await db.execute(sql, [rating, feedback, id]);
    }

    static async getOrderStats(userId = null) {
        let sql = `
            SELECT 
                COUNT(*) as total_orders,
                SUM(CASE WHEN status = '已完成' THEN 1 ELSE 0 END) as completed_orders,
                SUM(CASE WHEN status = '已取消' THEN 1 ELSE 0 END) as cancelled_orders,
                SUM(CASE WHEN status = '进行中' THEN 1 ELSE 0 END) as active_orders,
                SUM(actual_cost) as total_spent,
                AVG(user_rating) as avg_rating
            FROM laundry_orders
        `;
        const values = [];

        if (userId) {
            sql += ' WHERE user_id = ?';
            values.push(userId);
        }

        const [rows] = await db.execute(sql, values);
        return rows[0];
    }

    static async getRecentOrders(limit = 10) {
        const sql = `
            SELECT lo.*, u.userName, u.displayName 
            FROM laundry_orders lo
            LEFT JOIN users u ON lo.user_id = u.id
            ORDER BY lo.created_at DESC 
            LIMIT ?
        `;
        const [rows] = await db.execute(sql, [limit]);
        return rows;
    }

    static async delete(id) {
        const sql = 'DELETE FROM laundry_orders WHERE id = ?';
        await db.execute(sql, [id]);
    }
}

module.exports = LaundryOrder;

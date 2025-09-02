const { query } = require('../config/database');

const FoodOrder = {
    async createTable() {
        const sql = `
            CREATE TABLE IF NOT EXISTS food_orders (
                id INT AUTO_INCREMENT PRIMARY KEY,
                order_number VARCHAR(64) NOT NULL UNIQUE COMMENT '订单号',
                user_id INT NOT NULL COMMENT '用户ID',
                canteen_id INT NOT NULL COMMENT '食堂ID',
                dining_type ENUM('dine_in', 'takeaway', 'delivery') NOT NULL COMMENT '用餐类型：堂食/外带/外卖',
                total_amount DECIMAL(10,2) NOT NULL COMMENT '订单总金额',
                delivery_fee DECIMAL(10,2) DEFAULT 0.00 COMMENT '配送费',
                final_amount DECIMAL(10,2) NOT NULL COMMENT '最终金额',
                status ENUM('pending', 'confirmed', 'preparing', 'ready', 'delivering', 'delivered', 'cancelled') DEFAULT 'pending' COMMENT '订单状态',
                payment_status ENUM('unpaid', 'paid', 'refunded') DEFAULT 'unpaid' COMMENT '支付状态',
                payment_method ENUM('wechat', 'alipay', 'campus_card') DEFAULT 'wechat' COMMENT '支付方式',
                
                -- 配送相关字段
                delivery_address TEXT COMMENT '配送地址',
                delivery_phone VARCHAR(20) COMMENT '配送联系电话',
                delivery_notes TEXT COMMENT '配送备注',
                estimated_delivery_time DATETIME COMMENT '预计送达时间',
                
                -- 取餐相关字段
                pickup_code VARCHAR(10) COMMENT '取餐码',
                pickup_time DATETIME COMMENT '取餐时间',
                
                -- 时间相关字段
                order_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '下单时间',
                confirmed_time DATETIME COMMENT '确认时间',
                preparing_time DATETIME COMMENT '开始制作时间',
                ready_time DATETIME COMMENT '制作完成时间',
                delivery_start_time DATETIME COMMENT '开始配送时间',
                delivered_time DATETIME COMMENT '送达时间',
                cancelled_time DATETIME COMMENT '取消时间',
                
                -- 备注
                notes TEXT COMMENT '订单备注',
                
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                
                CONSTRAINT fk_order_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                CONSTRAINT fk_order_canteen FOREIGN KEY (canteen_id) REFERENCES canteens(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='食堂订单表';
        `;
        await query(sql);
    },

    async create(order) {
        const sql = `
            INSERT INTO food_orders (
                order_number, user_id, canteen_id, dining_type, total_amount, delivery_fee, final_amount,
                delivery_address, delivery_phone, delivery_notes, notes
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const params = [
            order.order_number, order.user_id, order.canteen_id, order.dining_type,
            order.total_amount, order.delivery_fee || 0, order.final_amount,
            order.delivery_address, order.delivery_phone, order.delivery_notes, order.notes
        ];
        const result = await query(sql, params);
        return result.insertId;
    },

    async findById(id) {
        const sql = `
            SELECT o.*, c.name as canteen_name, c.location as canteen_location,
                   u.userName, u.studentId
            FROM food_orders o
            LEFT JOIN canteens c ON o.canteen_id = c.id
            LEFT JOIN users u ON o.user_id = u.id
            WHERE o.id = ?
        `;
        const rows = await query(sql, [id]);
        return rows[0] || null;
    },

    async findByOrderNumber(orderNumber) {
        const sql = `
            SELECT o.*, c.name as canteen_name, c.location as canteen_location,
                   u.userName, u.studentId
            FROM food_orders o
            LEFT JOIN canteens c ON o.canteen_id = c.id
            LEFT JOIN users u ON o.user_id = u.id
            WHERE o.order_number = ?
        `;
        const rows = await query(sql, [orderNumber]);
        return rows[0] || null;
    },

    async findByUserId(userId, limit = 50) {
        const sql = `
            SELECT o.*, c.name as canteen_name, c.location as canteen_location
            FROM food_orders o
            LEFT JOIN canteens c ON o.canteen_id = c.id
            WHERE o.user_id = ?
            ORDER BY o.created_at DESC
            LIMIT ?
        `;
        const rows = await query(sql, [userId, limit]);
        return Array.isArray(rows) ? rows : [];
    },

    async findByCanteen(canteenId, limit = 50) {
        const sql = `
            SELECT o.*, u.userName, u.studentId
            FROM food_orders o
            LEFT JOIN users u ON o.user_id = u.id
            WHERE o.canteen_id = ?
            ORDER BY o.created_at DESC
            LIMIT ?
        `;
        const rows = await query(sql, [canteenId, limit]);
        return Array.isArray(rows) ? rows : [];
    },

    async updateStatus(id, status, timestampField = null) {
        let sql = 'UPDATE food_orders SET status = ?, updated_at = CURRENT_TIMESTAMP';
        let params = [status];

        if (timestampField) {
            sql += `, ${timestampField} = CURRENT_TIMESTAMP`;
        }

        sql += ' WHERE id = ?';
        params.push(id);

        const result = await query(sql, params);
        return result.affectedRows > 0;
    },

    async updatePaymentStatus(id, paymentStatus) {
        const sql = 'UPDATE food_orders SET payment_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
        const result = await query(sql, [paymentStatus, id]);
        return result.affectedRows > 0;
    },

    async cancel(id, reason = null) {
        const sql = 'UPDATE food_orders SET status = "cancelled", cancelled_time = CURRENT_TIMESTAMP, notes = CONCAT(IFNULL(notes, ""), " 取消原因: ", ?), updated_at = CURRENT_TIMESTAMP WHERE id = ?';
        const result = await query(sql, [reason || '用户取消', id]);
        return result.affectedRows > 0;
    },

    async getStats(userId = null) {
        let sql = `
            SELECT 
                COUNT(*) as total_orders,
                SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as completed_orders,
                SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_orders,
                SUM(CASE WHEN status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivering') THEN 1 ELSE 0 END) as active_orders,
                SUM(final_amount) as total_amount
            FROM food_orders
        `;
        let params = [];

        if (userId) {
            sql += ' WHERE user_id = ?';
            params.push(userId);
        }

        const rows = await query(sql, params);
        return rows[0] || null;
    },

    async generateOrderNumber() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `FO${timestamp}${random}`;
    }
};

module.exports = FoodOrder;

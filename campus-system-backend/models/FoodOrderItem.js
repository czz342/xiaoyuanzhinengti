const { query } = require('../config/database');

const FoodOrderItem = {
    async createTable() {
        const sql = `
            CREATE TABLE IF NOT EXISTS food_order_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                order_id INT NOT NULL COMMENT '订单ID',
                food_id INT NOT NULL COMMENT '菜品ID',
                food_name VARCHAR(255) NOT NULL COMMENT '菜品名称',
                food_image VARCHAR(500) COMMENT '菜品图片',
                quantity INT NOT NULL COMMENT '数量',
                unit_price DECIMAL(10,2) NOT NULL COMMENT '单价',
                total_price DECIMAL(10,2) NOT NULL COMMENT '小计',
                notes TEXT COMMENT '备注',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                
                CONSTRAINT fk_order_item_order FOREIGN KEY (order_id) REFERENCES food_orders(id) ON DELETE CASCADE,
                CONSTRAINT fk_order_item_food FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单项表';
        `;
        await query(sql);
    },

    async create(item) {
        const sql = `
            INSERT INTO food_order_items (order_id, food_id, food_name, food_image, quantity, unit_price, total_price, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const params = [
            item.order_id, item.food_id, item.food_name, item.food_image,
            item.quantity, item.unit_price, item.total_price, item.notes || ''
        ];
        const result = await query(sql, params);
        return result.insertId;
    },

    async createBatch(items) {
        if (!items || items.length === 0) return [];
        
        const sql = `
            INSERT INTO food_order_items (order_id, food_id, food_name, food_image, quantity, unit_price, total_price, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const insertPromises = items.map(item => {
            const params = [
                item.order_id, item.food_id, item.food_name, item.food_image,
                item.quantity, item.unit_price, item.total_price, item.notes || ''
            ];
            return query(sql, params);
        });
        
        const results = await Promise.all(insertPromises);
        return results.map(result => result.insertId);
    },

    async findByOrderId(orderId) {
        const sql = `
            SELECT oi.*, f.category, f.tags
            FROM food_order_items oi
            LEFT JOIN foods f ON oi.food_id = f.id
            WHERE oi.order_id = ?
            ORDER BY oi.id ASC
        `;
        const rows = await query(sql, [orderId]);
        return Array.isArray(rows) ? rows : [];
    },

    async findById(id) {
        const rows = await query('SELECT * FROM food_order_items WHERE id = ?', [id]);
        return rows[0] || null;
    },

    async update(id, updates) {
        const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
        const values = Object.values(updates);
        values.push(id);
        
        const sql = `UPDATE food_order_items SET ${fields} WHERE id = ?`;
        const result = await query(sql, values);
        return result.affectedRows > 0;
    },

    async delete(id) {
        const result = await query('DELETE FROM food_order_items WHERE id = ?', [id]);
        return result.affectedRows > 0;
    },

    async deleteByOrderId(orderId) {
        const result = await query('DELETE FROM food_order_items WHERE order_id = ?', [orderId]);
        return result.affectedRows > 0;
    }
};

module.exports = FoodOrderItem;

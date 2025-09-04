const { db } = require('../config/database');

class OrderStatusLog {
    static async createTable() {
        const sql = `
            CREATE TABLE IF NOT EXISTS order_status_logs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                order_id INT NOT NULL,
                status VARCHAR(20) NOT NULL,
                operator_id INT NOT NULL,
                remark VARCHAR(255) NULL,
                created_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_order (order_id),
                INDEX idx_status (status)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `;
        await db.execute(sql);
    }

    static async create({ order_id, status, operator_id, remark = null }) {
        const [res] = await db.execute(
            'INSERT INTO order_status_logs (order_id, status, operator_id, remark) VALUES (?,?,?,?)',
            [order_id, status, operator_id, remark]
        );
        return res.insertId;
    }

    static async listByOrder(orderId) {
        const [rows] = await db.execute(
            'SELECT * FROM order_status_logs WHERE order_id=? ORDER BY created_time ASC',
            [orderId]
        );
        return rows;
    }
}

module.exports = OrderStatusLog;



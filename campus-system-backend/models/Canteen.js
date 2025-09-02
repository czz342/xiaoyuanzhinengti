const { query } = require('../config/database');

const Canteen = {
    async createTable() {
        const sql = `
            CREATE TABLE IF NOT EXISTS canteens (
                id INT AUTO_INCREMENT PRIMARY KEY,
                number VARCHAR(64) NOT NULL UNIQUE COMMENT '食堂编码',
                name VARCHAR(255) NOT NULL COMMENT '食堂名称',
                location VARCHAR(255) COMMENT '食堂位置',
                description TEXT COMMENT '食堂描述',
                open_time TIME DEFAULT '06:00:00' COMMENT '营业开始时间',
                close_time TIME DEFAULT '22:00:00' COMMENT '营业结束时间',
                status ENUM('open', 'closed', 'maintenance') DEFAULT 'open' COMMENT '营业状态',
                phone VARCHAR(20) COMMENT '联系电话',
                image VARCHAR(500) COMMENT '食堂图片',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='食堂信息表';
        `;
        await query(sql);
    },

    async insert(canteen) {
        const sql = `
            INSERT INTO canteens (number, name, location, description, open_time, close_time, status, phone, image)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                name = VALUES(name), location = VALUES(location), description = VALUES(description),
                open_time = VALUES(open_time), close_time = VALUES(close_time), status = VALUES(status),
                phone = VALUES(phone), image = VALUES(image)
        `;
        const params = [
            canteen.number, canteen.name, canteen.location, canteen.description,
            canteen.open_time || '06:00:00', canteen.close_time || '22:00:00',
            canteen.status || 'open', canteen.phone, canteen.image
        ];
        await query(sql, params);
    },

    async list() {
        const rows = await query('SELECT * FROM canteens ORDER BY id ASC');
        return Array.isArray(rows) ? rows : [];
    },

    async findById(id) {
        const rows = await query('SELECT * FROM canteens WHERE id = ?', [id]);
        return rows[0] || null;
    },

    async findByNumber(number) {
        const rows = await query('SELECT * FROM canteens WHERE number = ?', [number]);
        return rows[0] || null;
    },

    async update(id, updates) {
        const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
        const values = Object.values(updates);
        values.push(id);
        
        const sql = `UPDATE canteens SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
        const result = await query(sql, values);
        return result.affectedRows > 0;
    },

    async delete(id) {
        const result = await query('DELETE FROM canteens WHERE id = ?', [id]);
        return result.affectedRows > 0;
    },

    async getStatus() {
        const now = new Date();
        const currentTime = now.toTimeString().slice(0, 8);
        
        const sql = `
            SELECT 
                id, number, name, location, status,
                CASE 
                    WHEN TIME(?) BETWEEN open_time AND close_time THEN 'open'
                    ELSE 'closed'
                END as current_status
            FROM canteens
            ORDER BY id ASC
        `;
        const rows = await query(sql, [currentTime]);
        return Array.isArray(rows) ? rows : [];
    }
};

module.exports = Canteen;

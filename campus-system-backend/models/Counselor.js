const { db } = require('../config/database');

class Counselor {
    static async createTable() {
        const sql = `
            CREATE TABLE IF NOT EXISTS counselors (
                id INT AUTO_INCREMENT PRIMARY KEY,
                counselor_number VARCHAR(50) UNIQUE NOT NULL COMMENT '咨询师编号',
                name VARCHAR(50) NOT NULL COMMENT '姓名',
                title VARCHAR(100) COMMENT '职称/资格',
                background TEXT COMMENT '背景',
                style TEXT COMMENT '咨询风格',
                specialties TEXT COMMENT '擅长方向(逗号分隔)',
                status ENUM('在职','离职') DEFAULT '在职' COMMENT '状态',
                avatar VARCHAR(255) COMMENT '头像URL',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_counselor_number (counselor_number),
                INDEX idx_name (name)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='心理咨询师'
        `;
        await db.execute(sql);
    }

    static async create(data) {
        const sql = `
            INSERT INTO counselors (counselor_number, name, title, background, style, specialties, status, avatar)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE name=VALUES(name), title=VALUES(title), background=VALUES(background),
                style=VALUES(style), specialties=VALUES(specialties), status=VALUES(status), avatar=VALUES(avatar)
        `;
        const values = [data.counselorNumber, data.name, data.title, data.background, data.style, data.specialties, data.status || '在职', data.avatar];
        const [res] = await db.execute(sql, values);
        return res.insertId || (await this.findByNumber(data.counselorNumber))?.id;
    }

    static async findByNumber(num) {
        const [rows] = await db.execute('SELECT * FROM counselors WHERE counselor_number = ?', [num]);
        return rows[0] || null;
    }

    static async list() {
        const [rows] = await db.execute('SELECT * FROM counselors ORDER BY name ASC');
        return rows;
    }
}

module.exports = Counselor;



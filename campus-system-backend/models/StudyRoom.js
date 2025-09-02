const { query } = require('../config/database');

const StudyRoom = {
    async createTable() {
        const sql = `
            CREATE TABLE IF NOT EXISTS study_rooms (
                id INT AUTO_INCREMENT PRIMARY KEY,
                number VARCHAR(64) NOT NULL UNIQUE,
                name VARCHAR(255) NOT NULL,
                location VARCHAR(255) DEFAULT NULL,
                open_time TIME DEFAULT NULL,
                close_time TIME DEFAULT NULL,
                total_seats INT DEFAULT 0,
                status VARCHAR(32) DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `;
        await query(sql);
    },

    async insert(room) {
        const sql = `INSERT INTO study_rooms (number, name, location, open_time, close_time, total_seats, status)
                     VALUES (?, ?, ?, ?, ?, ?, ?)
                     ON DUPLICATE KEY UPDATE name=VALUES(name), location=VALUES(location), open_time=VALUES(open_time), close_time=VALUES(close_time), total_seats=VALUES(total_seats), status=VALUES(status)`;
        const params = [room.number, room.name, room.location || null, room.open_time || null, room.close_time || null, room.total_seats || 0, room.status || 'active'];
        await query(sql, params);
    },

    async list() {
        const rows = await query('SELECT * FROM study_rooms ORDER BY id ASC');
        return Array.isArray(rows) ? rows : [];
    },

    async findById(id) {
        const rows = await query('SELECT * FROM study_rooms WHERE id = ?', [id]);
        return rows[0] || null;
    },

    async findByNumber(number) {
        const rows = await query('SELECT * FROM study_rooms WHERE number = ?', [number]);
        return rows[0] || null;
    }
};

module.exports = StudyRoom;



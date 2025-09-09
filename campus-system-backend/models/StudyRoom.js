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
    },

    async update(id, payload) {
        const fields = [];
        const params = [];
        if (payload.number !== undefined) { fields.push('number = ?'); params.push(payload.number); }
        if (payload.name !== undefined) { fields.push('name = ?'); params.push(payload.name); }
        if (payload.location !== undefined) { fields.push('location = ?'); params.push(payload.location); }
        if (payload.open_time !== undefined) { fields.push('open_time = ?'); params.push(payload.open_time); }
        if (payload.close_time !== undefined) { fields.push('close_time = ?'); params.push(payload.close_time); }
        if (payload.total_seats !== undefined) { fields.push('total_seats = ?'); params.push(payload.total_seats); }
        if (payload.status !== undefined) { fields.push('status = ?'); params.push(payload.status); }
        if (fields.length === 0) return;
        const sql = `UPDATE study_rooms SET ${fields.join(', ')} WHERE id = ?`;
        params.push(id);
        await query(sql, params);
    },

    async remove(id) {
        await query('DELETE FROM study_rooms WHERE id = ?', [id]);
    }
};

module.exports = StudyRoom;



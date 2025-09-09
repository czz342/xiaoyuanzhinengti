const { query } = require('../config/database');

const StudySeat = {
    async createTable() {
        const sql = `
            CREATE TABLE IF NOT EXISTS study_seats (
                id INT AUTO_INCREMENT PRIMARY KEY,
                room_id INT NOT NULL,
                number VARCHAR(64) NOT NULL,
                label VARCHAR(128) NOT NULL,
                row_no INT DEFAULT NULL,
                col_no INT DEFAULT NULL,
                seat_type VARCHAR(64) DEFAULT NULL,
                status VARCHAR(32) DEFAULT 'available',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                UNIQUE KEY uniq_room_number (room_id, number),
                CONSTRAINT fk_study_seat_room FOREIGN KEY (room_id) REFERENCES study_rooms(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `;
        await query(sql);
    },

    async insert(seat) {
        const sql = `INSERT INTO study_seats (room_id, number, label, row_no, col_no, seat_type, status)
                     VALUES (?, ?, ?, ?, ?, ?, ?)
                     ON DUPLICATE KEY UPDATE label=VALUES(label), row_no=VALUES(row_no), col_no=VALUES(col_no), seat_type=VALUES(seat_type), status=VALUES(status)`;
        const params = [seat.room_id, seat.number, seat.label, seat.row_no || null, seat.col_no || null, seat.seat_type || null, seat.status || 'available'];
        await query(sql, params);
    },

    async listByRoom(roomId) {
        const rows = await query('SELECT * FROM study_seats WHERE room_id = ? ORDER BY id ASC', [roomId]);
        return Array.isArray(rows) ? rows : [];
    },

    async update(id, payload) {
        const fields = [];
        const params = [];
        if (payload.number !== undefined) { fields.push('number = ?'); params.push(payload.number); }
        if (payload.label !== undefined) { fields.push('label = ?'); params.push(payload.label); }
        if (payload.row_no !== undefined) { fields.push('row_no = ?'); params.push(payload.row_no); }
        if (payload.col_no !== undefined) { fields.push('col_no = ?'); params.push(payload.col_no); }
        if (payload.seat_type !== undefined) { fields.push('seat_type = ?'); params.push(payload.seat_type); }
        if (payload.status !== undefined) { fields.push('status = ?'); params.push(payload.status); }
        if (fields.length === 0) return;
        const sql = `UPDATE study_seats SET ${fields.join(', ')} WHERE id = ?`;
        params.push(id);
        await query(sql, params);
    },

    async remove(id) {
        await query('DELETE FROM study_seats WHERE id = ?', [id]);
    }
};

module.exports = StudySeat;



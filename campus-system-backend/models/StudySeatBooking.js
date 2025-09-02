const { query } = require('../config/database');

const StudySeatBooking = {
    async createTable() {
        const sql = `
            CREATE TABLE IF NOT EXISTS study_seat_bookings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                room_id INT NOT NULL,
                seat_id INT NOT NULL,
                student_id VARCHAR(64) NOT NULL,
                booking_date DATE NOT NULL,
                start_time_sec INT NOT NULL,
                end_time_sec INT NOT NULL,
                status VARCHAR(16) DEFAULT 'reserved',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY uniq_booking (seat_id, booking_date, start_time_sec, end_time_sec),
                CONSTRAINT fk_booking_room FOREIGN KEY (room_id) REFERENCES study_rooms(id) ON DELETE CASCADE,
                CONSTRAINT fk_booking_seat FOREIGN KEY (seat_id) REFERENCES study_seats(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `;
        await query(sql);
    },

    async insert(booking) {
        const sql = `INSERT INTO study_seat_bookings (room_id, seat_id, student_id, booking_date, start_time_sec, end_time_sec, status)
                     VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const params = [booking.room_id, booking.seat_id, booking.student_id, booking.booking_date, booking.start_time_sec, booking.end_time_sec, booking.status || 'reserved'];
        await query(sql, params);
    },

    async listByRoomAndDate(roomId, date) {
        const rows = await query('SELECT * FROM study_seat_bookings WHERE room_id = ? AND booking_date = ? AND status = "reserved"', [roomId, date]);
        return Array.isArray(rows) ? rows : [];
    },

    async listByDate(date) {
        const rows = await query('SELECT * FROM study_seat_bookings WHERE booking_date = ? AND status = "reserved"', [date]);
        return Array.isArray(rows) ? rows : [];
    },

    async listByStudent(studentId) {
        const sql = `
            SELECT 
                b.*,
                r.name as room_name,
                s.label as seat_label
            FROM study_seat_bookings b
            LEFT JOIN study_rooms r ON b.room_id = r.id
            LEFT JOIN study_seats s ON b.seat_id = s.id
            WHERE b.student_id = ? 
            ORDER BY b.created_at DESC
        `;
        const rows = await query(sql, [studentId]);
        return Array.isArray(rows) ? rows : [];
    },

    async cancel(bookingId, studentId) {
        await query('UPDATE study_seat_bookings SET status = "cancelled" WHERE id = ? AND student_id = ?', [bookingId, studentId]);
    },

    async hasTimeConflict(seatId, date, startSec, endSec) {
        const sql = `
            SELECT id FROM study_seat_bookings 
            WHERE seat_id = ? AND booking_date = ? AND status = 'reserved'
            AND (? < end_time_sec) AND (? > start_time_sec)
            LIMIT 1
        `;
        const rows = await query(sql, [seatId, date, startSec, endSec]);
        return rows.length > 0;
    }
};

module.exports = StudySeatBooking;



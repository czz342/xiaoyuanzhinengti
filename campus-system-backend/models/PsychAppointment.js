const { db } = require('../config/database');

const PsychAppointment = {
    async createTable() {
        await db.execute(`
            CREATE TABLE IF NOT EXISTS psych_appointments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                student_id VARCHAR(64) NOT NULL,
                counselor_id INT NOT NULL,
                appointment_date DATE NOT NULL,
                start_time_sec INT NOT NULL,
                end_time_sec INT NOT NULL,
                status ENUM('已预约','已完成','已取消') DEFAULT '已预约',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_student (student_id),
                INDEX idx_counselor_date (counselor_id, appointment_date)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
    },

    async create({ studentId, counselorId, appointmentDate, startTimeSec, endTimeSec }) {
        const [result] = await db.execute(`
            INSERT INTO psych_appointments (student_id, counselor_id, appointment_date, start_time_sec, end_time_sec)
            VALUES (?, ?, ?, ?, ?)
        `, [studentId, counselorId, appointmentDate, startTimeSec, endTimeSec]);
        return { id: result.insertId };
    },

    async cancel(appointmentId, studentId) {
        await db.execute(`
            UPDATE psych_appointments SET status='已取消' WHERE id=? AND student_id=? AND status='已预约'
        `, [appointmentId, studentId]);
    },

    async listByStudent(studentId) {
        const [rows] = await db.execute(`
            SELECT pa.*, c.name AS counselor_name
            FROM psych_appointments pa
            LEFT JOIN counselors c ON pa.counselor_id = c.id
            WHERE pa.student_id = ?
            ORDER BY pa.appointment_date DESC, pa.start_time_sec DESC
        `, [studentId]);
        return rows;
    },

    async isSlotBooked(counselorId, appointmentDate, startTimeSec) {
        const [rows] = await db.execute(`
            SELECT id FROM psych_appointments 
            WHERE counselor_id=? AND appointment_date=? AND start_time_sec=? AND status='已预约'
        `, [counselorId, appointmentDate, startTimeSec]);
        return rows.length > 0;
    }
};

module.exports = PsychAppointment;



const { db } = require('../config/database');

const MedicalAppointment = {
    async createTable() {
        await db.execute(`
            CREATE TABLE IF NOT EXISTS medical_appointments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                student_id VARCHAR(64) NOT NULL,
                doctor_number VARCHAR(50) NOT NULL,
                appointment_date DATE NOT NULL,
                start_time_sec INT NOT NULL,
                end_time_sec INT NOT NULL,
                status ENUM('已预约','已完成','已取消') DEFAULT '已预约',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_student (student_id),
                INDEX idx_doctor_date (doctor_number, appointment_date)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
    },

    async isSlotBooked(doctorNumber, date, startSec) {
        const [rows] = await db.execute(`
            SELECT id FROM medical_appointments WHERE doctor_number=? AND appointment_date=? AND start_time_sec=? AND status='已预约'
        `, [doctorNumber, date, startSec]);
        return rows.length > 0;
    },

    async create({ studentId, doctorNumber, appointmentDate, startTimeSec, endTimeSec }) {
        const [res] = await db.execute(`
            INSERT INTO medical_appointments (student_id, doctor_number, appointment_date, start_time_sec, end_time_sec)
            VALUES (?, ?, ?, ?, ?)
        `, [studentId, doctorNumber, appointmentDate, startTimeSec, endTimeSec]);
        return { id: res.insertId };
    },

    async cancel(id, studentId) {
        await db.execute(`UPDATE medical_appointments SET status='已取消' WHERE id=? AND student_id=? AND status='已预约'`, [id, studentId]);
    },

    async listByStudent(studentId) {
        const [rows] = await db.execute(`
            SELECT ma.*, md.name AS doctor_name, md.title, md.dept_number
            FROM medical_appointments ma
            LEFT JOIN medical_doctors md ON md.doctor_number = ma.doctor_number
            WHERE ma.student_id = ?
            ORDER BY ma.appointment_date DESC, ma.start_time_sec DESC
        `, [studentId]);
        return rows;
    }
};

module.exports = MedicalAppointment;



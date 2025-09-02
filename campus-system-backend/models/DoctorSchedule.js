const { db } = require('../config/database');

const DoctorSchedule = {
    async createTable() {
        await db.execute(`
            CREATE TABLE IF NOT EXISTS doctor_schedules (
                id INT AUTO_INCREMENT PRIMARY KEY,
                doctor_number VARCHAR(50) NOT NULL,
                day_of_week VARCHAR(10) NOT NULL,
                start_time_sec INT NOT NULL,
                end_time_sec INT NOT NULL,
                quota INT DEFAULT 1,
                INDEX idx_doctor (doctor_number)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
    },

    async bulkInsert(doctorNumber, slots) {
        for (const s of slots) {
            await db.execute(`
                INSERT INTO doctor_schedules (doctor_number, day_of_week, start_time_sec, end_time_sec, quota)
                VALUES (?, ?, ?, ?, ?)
            `, [doctorNumber, s.day_of_week, s.start_time_sec, s.end_time_sec, s.quota || 1]);
        }
    },

    async listByDoctor(doctorNumber) {
        const [rows] = await db.execute(`SELECT * FROM doctor_schedules WHERE doctor_number=? ORDER BY start_time_sec ASC`, [doctorNumber]);
        return rows;
    }
};

module.exports = DoctorSchedule;



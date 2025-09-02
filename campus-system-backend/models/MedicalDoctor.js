const { db } = require('../config/database');

const MedicalDoctor = {
    async createTable() {
        await db.execute(`
            CREATE TABLE IF NOT EXISTS medical_doctors (
                id INT AUTO_INCREMENT PRIMARY KEY,
                doctor_number VARCHAR(50) UNIQUE NOT NULL,
                name VARCHAR(50) NOT NULL,
                dept_number VARCHAR(50) NOT NULL,
                title VARCHAR(100) DEFAULT NULL,
                specialty VARCHAR(500) DEFAULT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_name (name),
                INDEX idx_dept (dept_number)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
    },

    async upsert({ doctorNumber, name, deptNumber, title, specialty }) {
        await db.execute(`
            INSERT INTO medical_doctors (doctor_number, name, dept_number, title, specialty)
            VALUES (?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE name=VALUES(name), dept_number=VALUES(dept_number), title=VALUES(title), specialty=VALUES(specialty)
        `, [doctorNumber, name, deptNumber, title || null, specialty || null]);
        const [rows] = await db.execute(`SELECT * FROM medical_doctors WHERE doctor_number=?`, [doctorNumber]);
        return rows[0];
    },

    async listByDepartment(deptNumber) {
        const [rows] = await db.execute(`SELECT * FROM medical_doctors WHERE dept_number=? ORDER BY id ASC`, [deptNumber]);
        return rows;
    },

    async list() {
        const [rows] = await db.execute(`SELECT * FROM medical_doctors ORDER BY id ASC`);
        return rows;
    }
};

module.exports = MedicalDoctor;



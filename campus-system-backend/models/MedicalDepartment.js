const { db } = require('../config/database');

const MedicalDepartment = {
    async createTable() {
        await db.execute(`
            CREATE TABLE IF NOT EXISTS medical_departments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                dept_number VARCHAR(50) UNIQUE NOT NULL,
                name VARCHAR(100) NOT NULL,
                description VARCHAR(1000) DEFAULT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_name (name)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
    },

    async upsert({ deptNumber, name, description }) {
        await db.execute(`
            INSERT INTO medical_departments (dept_number, name, description)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description)
        `, [deptNumber, name, description || null]);
        const [rows] = await db.execute(`SELECT * FROM medical_departments WHERE dept_number=?`, [deptNumber]);
        return rows[0];
    },

    async list() {
        const [rows] = await db.execute(`SELECT * FROM medical_departments ORDER BY id ASC`);
        return rows;
    },

    async findByNumber(num) {
        const [rows] = await db.execute(`SELECT * FROM medical_departments WHERE dept_number=?`, [num]);
        return rows[0] || null;
    }
};

module.exports = MedicalDepartment;



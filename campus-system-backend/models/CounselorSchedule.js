const { db } = require('../config/database');

class CounselorSchedule {
    static async createTable() {
        const sql = `
            CREATE TABLE IF NOT EXISTS counselor_schedules (
                id INT AUTO_INCREMENT PRIMARY KEY,
                counselor_id INT NOT NULL COMMENT '咨询师ID',
                day_of_week ENUM('周一','周二','周三','周四','周五','周六','周日') NOT NULL,
                start_time_sec INT NOT NULL COMMENT '开始秒(当天)',
                end_time_sec INT NOT NULL COMMENT '结束秒(当天)',
                location VARCHAR(200) COMMENT '地点',
                capacity INT DEFAULT 1 COMMENT '最大接待人数/时段',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_counselor (counselor_id),
                FOREIGN KEY (counselor_id) REFERENCES counselors(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='咨询师周排班'
        `;
        await db.execute(sql);
    }

    static async create(data) {
        const sql = `
            INSERT INTO counselor_schedules (counselor_id, day_of_week, start_time_sec, end_time_sec, location, capacity)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const values = [data.counselorId, data.dayOfWeek, data.startSec, data.endSec, data.location || null, data.capacity || 1];
        const [res] = await db.execute(sql, values);
        return res.insertId;
    }

    static async listByCounselor(counselorId) {
        const [rows] = await db.execute('SELECT * FROM counselor_schedules WHERE counselor_id = ? ORDER BY FIELD(day_of_week,\'周一\',\'周二\',\'周三\',\'周四\',\'周五\',\'周六\',\'周日\'), start_time_sec', [counselorId]);
        return rows;
    }

    static async listAll() {
        const [rows] = await db.execute('SELECT * FROM counselor_schedules');
        return rows;
    }
}

module.exports = CounselorSchedule;



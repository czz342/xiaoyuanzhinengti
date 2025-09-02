const { db } = require('../config/database');

class PrintJob {
    static async createTable() {
        const sql = `
            CREATE TABLE IF NOT EXISTS print_jobs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                job_number VARCHAR(50) UNIQUE NOT NULL COMMENT '任务编号',
                user_id INT NOT NULL COMMENT '用户ID',
                user_number VARCHAR(50) NOT NULL COMMENT '用户编号',
                device_id INT NOT NULL COMMENT '设备ID',
                device_number VARCHAR(50) NOT NULL COMMENT '设备编号',
                device_name VARCHAR(100) NOT NULL COMMENT '设备名称',
                device_location VARCHAR(200) NOT NULL COMMENT '设备位置',
                file_name VARCHAR(255) NOT NULL COMMENT '文件名',
                file_path VARCHAR(500) NOT NULL COMMENT '文件路径',
                file_size INT COMMENT '文件大小(字节)',
                file_type VARCHAR(50) COMMENT '文件类型',
                print_type ENUM('黑白', '彩色') DEFAULT '黑白' COMMENT '打印类型',
                paper_size ENUM('A4', 'A3', 'A5', 'B4', 'B5') DEFAULT 'A4' COMMENT '纸张大小',
                paper_type ENUM('普通纸', '厚纸', '照片纸', '透明胶片') DEFAULT '普通纸' COMMENT '纸张类型',
                print_quality ENUM('草稿', '标准', '高质量') DEFAULT '标准' COMMENT '打印质量',
                copies INT DEFAULT 1 COMMENT '打印份数',
                pages INT COMMENT '页数',
                duplex ENUM('单面', '双面') DEFAULT '单面' COMMENT '双面打印',
                color_pages INT DEFAULT 0 COMMENT '彩色页数',
                black_pages INT DEFAULT 0 COMMENT '黑白页数',
                estimated_cost DECIMAL(8,2) NOT NULL COMMENT '预估费用',
                actual_cost DECIMAL(8,2) COMMENT '实际费用',
                status ENUM('待支付', '已支付', '打印中', '已完成', '已取消', '已退款', '打印失败') DEFAULT '待支付' COMMENT '任务状态',
                payment_method ENUM('微信支付', '支付宝', '校园卡', '现金') COMMENT '支付方式',
                payment_time DATETIME COMMENT '支付时间',
                start_time DATETIME COMMENT '开始时间',
                end_time DATETIME COMMENT '结束时间',
                completion_time DATETIME COMMENT '完成时间',
                cancel_reason TEXT COMMENT '取消原因',
                refund_amount DECIMAL(8,2) DEFAULT 0 COMMENT '退款金额',
                refund_time DATETIME COMMENT '退款时间',
                error_message TEXT COMMENT '错误信息',
                user_rating INT COMMENT '用户评分(1-5)',
                user_feedback TEXT COMMENT '用户反馈',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_job_number (job_number),
                INDEX idx_user_id (user_id),
                INDEX idx_user_number (user_number),
                INDEX idx_device_id (device_id),
                INDEX idx_status (status),
                INDEX idx_created_at (created_at),
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (device_id) REFERENCES shared_devices(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='打印任务表'
        `;
        await db.execute(sql);
    }

    static async create(jobData) {
        const sql = `
            INSERT INTO print_jobs (
                job_number, user_id, user_number, device_id, device_number,
                device_name, device_location, file_name, file_path, file_size,
                file_type, print_type, paper_size, paper_type, print_quality,
                copies, pages, duplex, color_pages, black_pages,
                estimated_cost, actual_cost, status, payment_method
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            jobData.jobNumber,
            jobData.userId,
            jobData.userNumber,
            jobData.deviceId,
            jobData.deviceNumber,
            jobData.deviceName,
            jobData.deviceLocation,
            jobData.fileName,
            jobData.filePath,
            jobData.fileSize,
            jobData.fileType,
            jobData.printType || '黑白',
            jobData.paperSize || 'A4',
            jobData.paperType || '普通纸',
            jobData.printQuality || '标准',
            jobData.copies || 1,
            jobData.pages,
            jobData.duplex || '单面',
            jobData.colorPages || 0,
            jobData.blackPages || 0,
            jobData.estimatedCost,
            jobData.actualCost,
            jobData.status || '待支付',
            jobData.paymentMethod
        ];
        
        const [result] = await db.execute(sql, values);
        return result.insertId;
    }

    static async findById(id) {
        const sql = 'SELECT * FROM print_jobs WHERE id = ?';
        const [rows] = await db.execute(sql, [id]);
        return rows.length > 0 ? rows[0] : null;
    }

    static async findByJobNumber(jobNumber) {
        const sql = 'SELECT * FROM print_jobs WHERE job_number = ?';
        const [rows] = await db.execute(sql, [jobNumber]);
        return rows.length > 0 ? rows[0] : null;
    }

    static async findByUserId(userId, status = null) {
        let sql = 'SELECT * FROM print_jobs WHERE user_id = ?';
        const values = [userId];

        if (status) {
            sql += ' AND status = ?';
            values.push(status);
        }

        sql += ' ORDER BY created_at DESC';

        const [rows] = await db.execute(sql, values);
        return rows;
    }

    static async findByUserNumber(userNumber, status = null) {
        let sql = 'SELECT * FROM print_jobs WHERE user_number = ?';
        const values = [userNumber];

        if (status) {
            sql += ' AND status = ?';
            values.push(status);
        }

        sql += ' ORDER BY created_at DESC';

        const [rows] = await db.execute(sql, values);
        return rows;
    }

    static async getBusyDeviceIds(queryTime = null) {
        const currentTime = queryTime || new Date();
        const sql = `
            SELECT DISTINCT device_id 
            FROM print_jobs 
            WHERE status IN ('已支付', '打印中') 
            AND start_time <= ? 
            AND (end_time IS NULL OR end_time >= ?)
        `;
        const [rows] = await db.execute(sql, [currentTime, currentTime]);
        return rows.map(row => row.device_id);
    }

    static async getActiveJobsByDevice(deviceId) {
        const sql = `
            SELECT * FROM print_jobs 
            WHERE device_id = ? 
            AND status IN ('已支付', '打印中')
            ORDER BY start_time ASC
        `;
        const [rows] = await db.execute(sql, [deviceId]);
        return rows;
    }

    static async updateStatus(id, status, additionalData = {}) {
        const fields = ['status = ?', 'updated_at = CURRENT_TIMESTAMP'];
        const values = [status];

        if (additionalData.paymentTime) {
            fields.push('payment_time = ?');
            values.push(additionalData.paymentTime);
        }

        if (additionalData.startTime) {
            fields.push('start_time = ?');
            values.push(additionalData.startTime);
        }

        if (additionalData.endTime) {
            fields.push('end_time = ?');
            values.push(additionalData.endTime);
        }

        if (additionalData.completionTime) {
            fields.push('completion_time = ?');
            values.push(additionalData.completionTime);
        }

        if (additionalData.actualCost !== undefined) {
            fields.push('actual_cost = ?');
            values.push(additionalData.actualCost);
        }

        if (additionalData.cancelReason) {
            fields.push('cancel_reason = ?');
            values.push(additionalData.cancelReason);
        }

        if (additionalData.refundAmount !== undefined) {
            fields.push('refund_amount = ?');
            values.push(additionalData.refundAmount);
        }

        if (additionalData.refundTime) {
            fields.push('refund_time = ?');
            values.push(additionalData.refundTime);
        }

        if (additionalData.errorMessage) {
            fields.push('error_message = ?');
            values.push(additionalData.errorMessage);
        }

        values.push(id);
        const sql = `UPDATE print_jobs SET ${fields.join(', ')} WHERE id = ?`;
        await db.execute(sql, values);
    }

    static async addRating(id, rating, feedback = null) {
        const sql = `
            UPDATE print_jobs 
            SET user_rating = ?, user_feedback = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?
        `;
        await db.execute(sql, [rating, feedback, id]);
    }

    static async getJobStats(userId = null) {
        let sql = `
            SELECT 
                COUNT(*) as total_jobs,
                SUM(CASE WHEN status = '已完成' THEN 1 ELSE 0 END) as completed_jobs,
                SUM(CASE WHEN status = '已取消' THEN 1 ELSE 0 END) as cancelled_jobs,
                SUM(CASE WHEN status = '打印中' THEN 1 ELSE 0 END) as active_jobs,
                SUM(actual_cost) as total_spent,
                SUM(pages * copies) as total_pages,
                AVG(user_rating) as avg_rating
            FROM print_jobs
        `;
        const values = [];

        if (userId) {
            sql += ' WHERE user_id = ?';
            values.push(userId);
        }

        const [rows] = await db.execute(sql, values);
        return rows[0];
    }

    static async getRecentJobs(limit = 10) {
        const sql = `
            SELECT pj.*, u.userName, u.displayName 
            FROM print_jobs pj
            LEFT JOIN users u ON pj.user_id = u.id
            ORDER BY pj.created_at DESC 
            LIMIT ?
        `;
        const [rows] = await db.execute(sql, [limit]);
        return rows;
    }

    static async getJobsByFileType() {
        const sql = `
            SELECT 
                file_type,
                COUNT(*) as count,
                SUM(pages * copies) as total_pages,
                SUM(actual_cost) as total_cost
            FROM print_jobs 
            WHERE status = '已完成'
            GROUP BY file_type
            ORDER BY count DESC
        `;
        const [rows] = await db.execute(sql);
        return rows;
    }

    static async delete(id) {
        const sql = 'DELETE FROM print_jobs WHERE id = ?';
        await db.execute(sql, [id]);
    }
}

module.exports = PrintJob;

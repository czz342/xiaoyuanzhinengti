const { db } = require('../config/database');

class ExpressTracking {
    static async createTable() {
        const sql = `
            CREATE TABLE IF NOT EXISTS express_tracking (
                id INT AUTO_INCREMENT PRIMARY KEY,
                package_id INT NOT NULL COMMENT '包裹ID',
                tracking_number VARCHAR(50) NOT NULL COMMENT '快递单号',
                status VARCHAR(50) NOT NULL COMMENT '状态',
                status_description TEXT COMMENT '状态描述',
                location VARCHAR(200) COMMENT '位置信息',
                operator VARCHAR(100) COMMENT '操作员',
                operator_phone VARCHAR(20) COMMENT '操作员电话',
                timestamp DATETIME NOT NULL COMMENT '时间戳',
                details JSON COMMENT '详细信息',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_package_id (package_id),
                INDEX idx_tracking_number (tracking_number),
                INDEX idx_timestamp (timestamp),
                INDEX idx_status (status),
                FOREIGN KEY (package_id) REFERENCES express_packages(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='快递跟踪记录表'
        `;
        await db.execute(sql);
    }

    static async create(trackingData) {
        const sql = `
            INSERT INTO express_tracking (
                package_id, tracking_number, status, status_description,
                location, operator, operator_phone, timestamp, details
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            trackingData.packageId || null,
            trackingData.trackingNumber || null,
            trackingData.status || null,
            trackingData.statusDescription || null,
            trackingData.location || null,
            trackingData.operator || null,
            trackingData.operatorPhone || null,
            trackingData.timestamp || null,
            JSON.stringify(trackingData.details || {})
        ];
        const [result] = await db.execute(sql, values);
        return result.insertId;
    }

    static async findByPackageId(packageId) {
        const sql = `
            SELECT * FROM express_tracking 
            WHERE package_id = ? 
            ORDER BY timestamp DESC
        `;
        const [rows] = await db.execute(sql, [packageId]);
        return rows;
    }

    static async findByTrackingNumber(trackingNumber) {
        const sql = `
            SELECT t.*, p.receiver_name, p.receiver_phone
            FROM express_tracking t
            LEFT JOIN express_packages p ON t.package_id = p.id
            WHERE t.tracking_number = ? 
            ORDER BY t.timestamp DESC
        `;
        const [rows] = await db.execute(sql, [trackingNumber]);
        return rows;
    }

    static async getLatestStatus(packageId) {
        const sql = `
            SELECT * FROM express_tracking 
            WHERE package_id = ? 
            ORDER BY timestamp DESC 
            LIMIT 1
        `;
        const [rows] = await db.execute(sql, [packageId]);
        return rows[0] || null;
    }

    static async getStatusHistory(packageId, limit = 10) {
        const sql = `
            SELECT * FROM express_tracking 
            WHERE package_id = ? 
            ORDER BY timestamp DESC 
            LIMIT ?
        `;
        const [rows] = await db.execute(sql, [packageId, limit]);
        return rows;
    }

    static async getRecentActivity(hours = 24) {
        const sql = `
            SELECT t.*, p.receiver_name, p.receiver_phone, p.package_description
            FROM express_tracking t
            LEFT JOIN express_packages p ON t.package_id = p.id
            WHERE t.timestamp >= DATE_SUB(NOW(), INTERVAL ? HOUR)
            ORDER BY t.timestamp DESC
        `;
        const [rows] = await db.execute(sql, [hours]);
        return rows;
    }

    static async getStatusStats(startDate, endDate) {
        const sql = `
            SELECT 
                status,
                COUNT(*) as count,
                DATE(timestamp) as date
            FROM express_tracking 
            WHERE timestamp BETWEEN ? AND ?
            GROUP BY status, DATE(timestamp)
            ORDER BY date DESC, count DESC
        `;
        const [rows] = await db.execute(sql, [startDate, endDate]);
        return rows;
    }

    static async deleteByPackageId(packageId) {
        const sql = 'DELETE FROM express_tracking WHERE package_id = ?';
        const [result] = await db.execute(sql, [packageId]);
        return result.affectedRows;
    }

    static async delete(id) {
        const sql = 'DELETE FROM express_tracking WHERE id = ?';
        const [result] = await db.execute(sql, [id]);
        return result.affectedRows > 0;
    }

    // 生成标准化的跟踪记录
    static async generateStandardTracking(packageId, trackingNumber, currentStatus) {
        const trackingRecords = [];
        const now = new Date();
        
        // 根据当前状态生成完整的跟踪记录
        const statusFlow = [
            {
                status: '已揽收',
                description: '快件已被揽收',
                location: '始发地',
                operator: '快递员',
                timestamp: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000) // 5天前
            },
            {
                status: '运输中',
                description: '快件已从始发地发出',
                location: '运输途中',
                operator: '系统',
                timestamp: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000) // 4天前
            },
            {
                status: '到达集散中心',
                description: '快件已到达本地集散中心，准备进行派送',
                location: '本地集散中心',
                operator: '系统',
                timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000) // 1天前
            }
        ];

        // 根据当前状态添加相应的记录
        if (currentStatus === 'arrived' || currentStatus === 'picked_up' || currentStatus === 'delivered') {
            statusFlow.push({
                status: '派送中',
                description: '快递员正在为您派送',
                location: '派送途中',
                operator: '快递员',
                timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000) // 2小时前
            });
            
            statusFlow.push({
                status: '已到达',
                description: '快递已到达驿站，请凭取件码领取',
                location: '校园快递驿站',
                operator: '驿站工作人员',
                timestamp: new Date(now.getTime() - 1 * 60 * 60 * 1000) // 1小时前
            });
        }

        if (currentStatus === 'picked_up' || currentStatus === 'delivered') {
            statusFlow.push({
                status: '已取件',
                description: '您的快递已取件',
                location: '校园快递驿站',
                operator: '驿站工作人员',
                timestamp: new Date(now.getTime() - 30 * 60 * 1000) // 30分钟前
            });
        }

        if (currentStatus === 'delivered') {
            statusFlow.push({
                status: '已签收',
                description: '您的快递已签收，感谢使用',
                location: '校园快递驿站',
                operator: '驿站工作人员',
                timestamp: new Date(now.getTime() - 10 * 60 * 1000) // 10分钟前
            });
        }

        // 插入跟踪记录
        for (const record of statusFlow) {
            await this.create({
                packageId,
                trackingNumber,
                status: record.status,
                statusDescription: record.description,
                location: record.location,
                operator: record.operator,
                timestamp: record.timestamp,
                details: {
                    auto_generated: true,
                    source: 'system'
                }
            });
        }

        return trackingRecords;
    }
}

module.exports = ExpressTracking;

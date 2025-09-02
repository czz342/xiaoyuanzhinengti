const { db } = require('../config/database');

class SharedDevice {
    static async columnExists(table, column) {
        const sql = `
            SELECT COUNT(*) as c
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?
        `;
        const [rows] = await db.execute(sql, [table, column]);
        return rows[0].c > 0;
    }
    static async createTable() {
        const sql = `
            CREATE TABLE IF NOT EXISTS shared_devices (
                id INT AUTO_INCREMENT PRIMARY KEY,
                device_number VARCHAR(50) UNIQUE NOT NULL COMMENT '设备编号',
                device_name VARCHAR(100) NOT NULL COMMENT '设备名称',
                device_type ENUM('洗衣机', '打印机') NOT NULL COMMENT '设备类型',
                device_model VARCHAR(100) COMMENT '设备型号',
                location VARCHAR(200) NOT NULL COMMENT '设备位置',
                building VARCHAR(100) COMMENT '所在建筑',
                floor VARCHAR(20) COMMENT '所在楼层',
                room_number VARCHAR(50) COMMENT '房间号',
                status ENUM('正常', '故障', '维护中') DEFAULT '正常' COMMENT '设备状态',
                usage_status ENUM('空闲', '使用中') DEFAULT '空闲' COMMENT '使用状态',
                capacity VARCHAR(50) COMMENT '容量/规格',
                features JSON COMMENT '设备功能特性',
                price_per_use DECIMAL(8,2) DEFAULT 0 COMMENT '单次使用价格',
                price_per_minute DECIMAL(8,2) DEFAULT 0 COMMENT '每分钟价格',
                rating DECIMAL(3,2) DEFAULT 5.00 COMMENT '设备评分',
                usage_count INT DEFAULT 0 COMMENT '使用次数',
                total_usage_time INT DEFAULT 0 COMMENT '总使用时间(分钟)',
                last_maintenance_date DATE COMMENT '最后维护日期',
                next_maintenance_date DATE COMMENT '下次维护日期',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_device_number (device_number),
                INDEX idx_device_type (device_type),
                INDEX idx_location (location),
                INDEX idx_status (status),
                INDEX idx_building (building)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='共享设备表'
        `;
        await db.execute(sql);
    }

    static async ensureUsageStatusColumn() {
        // 为已存在的表补充 usage_status 列
        const sql = `
            ALTER TABLE shared_devices 
            ADD COLUMN IF NOT EXISTS usage_status ENUM('空闲','使用中') DEFAULT '空闲' COMMENT '使用状态' AFTER status
        `;
        try { await db.execute(sql); } catch (e) { /* MySQL低版本不支持IF NOT EXISTS时忽略错误 */ }
    }

    static async create(deviceData) {
        const sql = `
            INSERT INTO shared_devices (
                device_number, device_name, device_type, device_model, location,
                building, floor, room_number, status, capacity, features,
                price_per_use, price_per_minute, rating, usage_count,
                total_usage_time, last_maintenance_date, next_maintenance_date
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            deviceData.deviceNumber,
            deviceData.deviceName,
            deviceData.deviceType,
            deviceData.deviceModel,
            deviceData.location,
            deviceData.building,
            deviceData.floor,
            deviceData.roomNumber,
            deviceData.status || '正常',
            deviceData.capacity,
            JSON.stringify(deviceData.features || []),
            deviceData.pricePerUse || 0,
            deviceData.pricePerMinute || 0,
            deviceData.rating || 5.00,
            deviceData.usageCount || 0,
            deviceData.totalUsageTime || 0,
            deviceData.lastMaintenanceDate,
            deviceData.nextMaintenanceDate
        ];
        
        const [result] = await db.execute(sql, values);
        return result.insertId;
    }

    static async findById(id) {
        const sql = 'SELECT * FROM shared_devices WHERE id = ?';
        const [rows] = await db.execute(sql, [id]);
        if (rows.length > 0) {
            const device = rows[0];
            if (typeof device.features === 'string') {
                try { device.features = JSON.parse(device.features || '[]'); } catch (e) { device.features = []; }
            } else if (!device.features) {
                device.features = [];
            }
            return device;
        }
        return null;
    }

    static async findByDeviceNumber(deviceNumber) {
        const sql = 'SELECT * FROM shared_devices WHERE device_number = ?';
        const [rows] = await db.execute(sql, [deviceNumber]);
        if (rows.length > 0) {
            const device = rows[0];
            if (typeof device.features === 'string') {
                try { device.features = JSON.parse(device.features || '[]'); } catch (e) { device.features = []; }
            } else if (!device.features) {
                device.features = [];
            }
            return device;
        }
        return null;
    }

    static async list(filters = {}) {
        let sql = 'SELECT * FROM shared_devices WHERE 1=1';
        const values = [];

        if (filters.deviceType) {
            sql += ' AND device_type = ?';
            values.push(filters.deviceType);
        }

        if (filters.status) {
            sql += ' AND status = ?';
            values.push(filters.status);
        }

        if (filters.building) {
            sql += ' AND building = ?';
            values.push(filters.building);
        }

        if (filters.location) {
            sql += ' AND location LIKE ?';
            values.push(`%${filters.location}%`);
        }

        sql += ' ORDER BY device_type, device_number';

        const [rows] = await db.execute(sql, values);
        return rows.map(device => {
            if (typeof device.features === 'string') {
                try { device.features = JSON.parse(device.features || '[]'); } catch (e) { device.features = []; }
            } else if (!device.features) {
                device.features = [];
            }
            return device;
        });
    }

    static async getAvailableDevices(deviceType, excludeBusyIds = []) {
        let sql = `
            SELECT * FROM shared_devices 
            WHERE device_type = ? AND status = '正常'
        `;
        const values = [deviceType];

        if (excludeBusyIds.length > 0) {
            const placeholders = excludeBusyIds.map(() => '?').join(',');
            sql += ` AND id NOT IN (${placeholders})`;
            values.push(...excludeBusyIds);
        }

        sql += ' ORDER BY rating DESC, usage_count ASC';

        const [rows] = await db.execute(sql, values);
        return rows.map(device => {
            if (typeof device.features === 'string') {
                try { device.features = JSON.parse(device.features || '[]'); } catch (e) { device.features = []; }
            } else if (!device.features) {
                device.features = [];
            }
            return device;
        });
    }

    static async updateStatus(id, status) {
        const sql = 'UPDATE shared_devices SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
        await db.execute(sql, [status, id]);
    }

    static async updateUsageStatus(id, usageStatus) {
        const sql = 'UPDATE shared_devices SET usage_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
        await db.execute(sql, [usageStatus, id]);
    }

    static async updateUsage(id, usageTime) {
        const sql = `
            UPDATE shared_devices 
            SET usage_count = usage_count + 1, 
                total_usage_time = total_usage_time + ?,
                updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?
        `;
        await db.execute(sql, [usageTime, id]);
    }

    static async getDeviceStats() {
        const hasUsageStatus = await this.columnExists('shared_devices', 'usage_status');
        if (hasUsageStatus) {
            const sql = `
                SELECT 
                    device_type,
                    COUNT(*) as total_count,
                    SUM(CASE WHEN status = '正常' THEN 1 ELSE 0 END) as normal_count,
                    SUM(CASE WHEN status = '故障' THEN 1 ELSE 0 END) as fault_count,
                    SUM(CASE WHEN status = '维护中' THEN 1 ELSE 0 END) as maintenance_count,
                    SUM(CASE WHEN usage_status = '空闲' AND status = '正常' THEN 1 ELSE 0 END) as available_count,
                    SUM(CASE WHEN usage_status = '使用中' THEN 1 ELSE 0 END) as busy_count,
                    AVG(rating) as avg_rating,
                    SUM(usage_count) as total_usage_count
                FROM shared_devices 
                GROUP BY device_type
            `;
            const [rows] = await db.execute(sql);
            return rows;
        }

        // Fallback：无 usage_status 列时，根据订单推导忙闲
        const sql = `
            SELECT 
                sd.device_type,
                COUNT(*) as total_count,
                SUM(CASE WHEN sd.status = '正常' THEN 1 ELSE 0 END) as normal_count,
                SUM(CASE WHEN sd.status = '故障' THEN 1 ELSE 0 END) as fault_count,
                SUM(CASE WHEN sd.status = '维护中' THEN 1 ELSE 0 END) as maintenance_count,
                SUM(CASE WHEN sd.status = '正常' AND NOT EXISTS (
                    SELECT 1 FROM laundry_orders lo 
                    WHERE lo.device_id = sd.id AND lo.status IN ('已支付','进行中') 
                    AND lo.start_time <= NOW() AND (lo.end_time IS NULL OR lo.end_time >= NOW())
                ) THEN 1 ELSE 0 END) as available_count,
                SUM(CASE WHEN EXISTS (
                    SELECT 1 FROM laundry_orders lo 
                    WHERE lo.device_id = sd.id AND lo.status IN ('已支付','进行中') 
                    AND lo.start_time <= NOW() AND (lo.end_time IS NULL OR lo.end_time >= NOW())
                ) THEN 1 ELSE 0 END) as busy_count,
                AVG(sd.rating) as avg_rating,
                SUM(sd.usage_count) as total_usage_count
            FROM shared_devices sd
            GROUP BY sd.device_type
        `;
        const [rows] = await db.execute(sql);
        return rows;
    }

    static async getDevicesByLocation(location) {
        const sql = `
            SELECT * FROM shared_devices 
            WHERE location LIKE ? 
            ORDER BY device_type, device_number
        `;
        const [rows] = await db.execute(sql, [`%${location}%`]);
        return rows.map(device => {
            if (typeof device.features === 'string') {
                try { device.features = JSON.parse(device.features || '[]'); } catch (e) { device.features = []; }
            } else if (!device.features) {
                device.features = [];
            }
            return device;
        });
    }

    static async update(id, updateData) {
        const fields = [];
        const values = [];

        Object.keys(updateData).forEach(key => {
            if (updateData[key] !== undefined) {
                fields.push(`${key} = ?`);
                if (key === 'features') {
                    values.push(JSON.stringify(updateData[key]));
                } else {
                    values.push(updateData[key]);
                }
            }
        });

        if (fields.length === 0) return;

        values.push(id);
        const sql = `UPDATE shared_devices SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
        await db.execute(sql, values);
    }

    static async delete(id) {
        const sql = 'DELETE FROM shared_devices WHERE id = ?';
        await db.execute(sql, [id]);
    }
}

module.exports = SharedDevice;

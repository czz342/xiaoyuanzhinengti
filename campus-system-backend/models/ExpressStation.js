const { db } = require('../config/database');

class ExpressStation {
    static async createTable() {
        const sql = `
            CREATE TABLE IF NOT EXISTS express_stations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                station_name VARCHAR(100) NOT NULL COMMENT '驿站名称',
                station_code VARCHAR(20) UNIQUE NOT NULL COMMENT '驿站代码',
                station_address TEXT NOT NULL COMMENT '驿站地址',
                contact_phone VARCHAR(20) COMMENT '联系电话',
                contact_person VARCHAR(50) COMMENT '联系人',
                operating_hours VARCHAR(100) DEFAULT '8:00-22:00' COMMENT '营业时间',
                latitude DECIMAL(10, 8) COMMENT '纬度',
                longitude DECIMAL(11, 8) COMMENT '经度',
                capacity INT DEFAULT 1000 COMMENT '容量',
                current_count INT DEFAULT 0 COMMENT '当前包裹数量',
                service_types JSON COMMENT '服务类型',
                facilities JSON COMMENT '设施信息',
                status ENUM('active', 'inactive', 'maintenance') DEFAULT 'active' COMMENT '状态',
                notes TEXT COMMENT '备注',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_station_code (station_code),
                INDEX idx_status (status),
                INDEX idx_location (latitude, longitude)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='快递驿站表'
        `;
        await db.execute(sql);
    }

    static async create(stationData) {
        const sql = `
            INSERT INTO express_stations (
                station_name, station_code, station_address, contact_phone, contact_person,
                operating_hours, latitude, longitude, capacity, current_count,
                service_types, facilities, status, notes
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            stationData.stationName,
            stationData.stationCode,
            stationData.stationAddress,
            stationData.contactPhone,
            stationData.contactPerson,
            stationData.operatingHours || '8:00-22:00',
            stationData.latitude,
            stationData.longitude,
            stationData.capacity || 1000,
            stationData.currentCount || 0,
            JSON.stringify(stationData.serviceTypes || []),
            JSON.stringify(stationData.facilities || {}),
            stationData.status || 'active',
            stationData.notes
        ];
        const [result] = await db.execute(sql, values);
        return result.insertId;
    }

    static async findById(id) {
        const sql = 'SELECT * FROM express_stations WHERE id = ?';
        const [rows] = await db.execute(sql, [id]);
        return rows[0] || null;
    }

    static async findByCode(stationCode) {
        const sql = 'SELECT * FROM express_stations WHERE station_code = ?';
        const [rows] = await db.execute(sql, [stationCode]);
        return rows[0] || null;
    }

    static async getAll(activeOnly = true) {
        let sql = 'SELECT * FROM express_stations';
        const values = [];
        
        if (activeOnly) {
            sql += ' WHERE status = ?';
            values.push('active');
        }
        
        sql += ' ORDER BY station_name ASC';
        
        const [rows] = await db.execute(sql, values);
        return rows;
    }

    static async getNearbyStations(latitude, longitude, radius = 5) {
        const sql = `
            SELECT *, 
                   (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * 
                    cos(radians(longitude) - radians(?)) + sin(radians(?)) * 
                    sin(radians(latitude)))) AS distance
            FROM express_stations 
            WHERE status = 'active' 
              AND latitude IS NOT NULL 
              AND longitude IS NOT NULL
            HAVING distance < ?
            ORDER BY distance ASC
        `;
        const [rows] = await db.execute(sql, [latitude, longitude, latitude, radius]);
        return rows;
    }

    static async update(id, updateData) {
        const allowedFields = [
            'station_name', 'station_address', 'contact_phone', 'contact_person',
            'operating_hours', 'latitude', 'longitude', 'capacity', 'current_count',
            'service_types', 'facilities', 'status', 'notes'
        ];
        
        const updateFields = [];
        const values = [];
        
        for (const [key, value] of Object.entries(updateData)) {
            if (allowedFields.includes(key) && value !== undefined) {
                if (key === 'service_types' || key === 'facilities') {
                    updateFields.push(`${key} = ?`);
                    values.push(JSON.stringify(value));
                } else {
                    updateFields.push(`${key} = ?`);
                    values.push(value);
                }
            }
        }
        
        if (updateFields.length === 0) {
            return false;
        }
        
        updateFields.push('updated_at = CURRENT_TIMESTAMP');
        values.push(id);
        
        const sql = `UPDATE express_stations SET ${updateFields.join(', ')} WHERE id = ?`;
        const [result] = await db.execute(sql, values);
        return result.affectedRows > 0;
    }

    static async updatePackageCount(stationId, increment = 1) {
        const sql = `
            UPDATE express_stations 
            SET current_count = current_count + ?, 
                updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?
        `;
        const [result] = await db.execute(sql, [increment, stationId]);
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const sql = 'DELETE FROM express_stations WHERE id = ?';
        const [result] = await db.execute(sql, [id]);
        return result.affectedRows > 0;
    }

    static async getStats() {
        const sql = `
            SELECT 
                COUNT(*) as total_stations,
                SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_stations,
                SUM(current_count) as total_packages,
                SUM(capacity) as total_capacity
            FROM express_stations
        `;
        const [rows] = await db.execute(sql);
        return rows[0] || {};
    }

    static async getBusyStations(threshold = 0.8) {
        const sql = `
            SELECT *, 
                   (current_count / capacity) as utilization_rate
            FROM express_stations 
            WHERE status = 'active' 
              AND (current_count / capacity) > ?
            ORDER BY utilization_rate DESC
        `;
        const [rows] = await db.execute(sql, [threshold]);
        return rows;
    }
}

module.exports = ExpressStation;

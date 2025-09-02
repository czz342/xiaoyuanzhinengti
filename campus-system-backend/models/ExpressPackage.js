const { db } = require('../config/database');

class ExpressPackage {
    static async createTable() {
        const sql = `
            CREATE TABLE IF NOT EXISTS express_packages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                tracking_number VARCHAR(50) UNIQUE NOT NULL COMMENT '快递单号',
                courier_name VARCHAR(50) NOT NULL COMMENT '快递公司名称',
                courier_code VARCHAR(20) NOT NULL COMMENT '快递公司代码',
                package_description TEXT COMMENT '包裹描述',
                sender_name VARCHAR(100) COMMENT '寄件人姓名',
                sender_phone VARCHAR(20) COMMENT '寄件人电话',
                receiver_name VARCHAR(100) NOT NULL COMMENT '收件人姓名',
                receiver_phone VARCHAR(20) NOT NULL COMMENT '收件人电话',
                receiver_address TEXT COMMENT '收件地址',
                status ENUM('in_transit', 'arrived', 'picked_up', 'delivered', 'returned') DEFAULT 'in_transit' COMMENT '包裹状态',
                station_id INT COMMENT '驿站ID',
                pickup_code VARCHAR(20) COMMENT '取件码',
                estimated_arrival DATETIME COMMENT '预计到达时间',
                actual_arrival DATETIME COMMENT '实际到达时间',
                pickup_time DATETIME COMMENT '取件时间',
                delivery_time DATETIME COMMENT '签收时间',
                weight DECIMAL(5,2) COMMENT '重量(kg)',
                size VARCHAR(50) COMMENT '尺寸',
                insurance_amount DECIMAL(10,2) DEFAULT 0 COMMENT '保价金额',
                shipping_fee DECIMAL(8,2) DEFAULT 0 COMMENT '运费',
                notes TEXT COMMENT '备注',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_tracking_number (tracking_number),
                INDEX idx_receiver_phone (receiver_phone),
                INDEX idx_status (status),
                INDEX idx_station_id (station_id),
                INDEX idx_created_at (created_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='快递包裹表'
        `;
        await db.execute(sql);
    }

    static async create(packageData) {
        const sql = `
            INSERT INTO express_packages (
                tracking_number, courier_name, courier_code, package_description,
                sender_name, sender_phone, receiver_name, receiver_phone, receiver_address,
                status, station_id, pickup_code, estimated_arrival, actual_arrival,
                weight, size, insurance_amount, shipping_fee, notes
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            packageData.trackingNumber,
            packageData.courierName,
            packageData.courierCode,
            packageData.packageDescription,
            packageData.senderName,
            packageData.senderPhone,
            packageData.receiverName,
            packageData.receiverPhone,
            packageData.receiverAddress,
            packageData.status || 'in_transit',
            packageData.stationId,
            packageData.pickupCode,
            packageData.estimatedArrival,
            packageData.actualArrival,
            packageData.weight,
            packageData.size,
            packageData.insuranceAmount || 0,
            packageData.shippingFee || 0,
            packageData.notes
        ];
        const [result] = await db.execute(sql, values);
        return result.insertId;
    }

    static async findById(id) {
        const sql = `
            SELECT p.*, s.station_name, s.station_address, s.contact_phone, s.operating_hours
            FROM express_packages p
            LEFT JOIN express_stations s ON p.station_id = s.id
            WHERE p.id = ?
        `;
        const [rows] = await db.execute(sql, [id]);
        return rows[0] || null;
    }

    static async findByTrackingNumber(trackingNumber) {
        const sql = `
            SELECT p.*, s.station_name, s.station_address, s.contact_phone, s.operating_hours
            FROM express_packages p
            LEFT JOIN express_stations s ON p.station_id = s.id
            WHERE p.tracking_number = ?
        `;
        const [rows] = await db.execute(sql, [trackingNumber]);
        return rows[0] || null;
    }

    static async findByReceiverPhone(phone, status = null) {
        let sql = `
            SELECT p.*, s.station_name, s.station_address, s.contact_phone, s.operating_hours
            FROM express_packages p
            LEFT JOIN express_stations s ON p.station_id = s.id
            WHERE p.receiver_phone = ?
        `;
        const values = [phone];
        
        if (status) {
            sql += ' AND p.status = ?';
            values.push(status);
        }
        
        sql += ' ORDER BY p.created_at DESC';
        
        const [rows] = await db.execute(sql, values);
        return rows;
    }

    static async findByStation(stationId, status = null) {
        let sql = `
            SELECT p.*, s.station_name, s.station_address, s.contact_phone, s.operating_hours
            FROM express_packages p
            LEFT JOIN express_stations s ON p.station_id = s.id
            WHERE p.station_id = ?
        `;
        const values = [stationId];
        
        if (status) {
            sql += ' AND p.status = ?';
            values.push(status);
        }
        
        sql += ' ORDER BY p.actual_arrival DESC';
        
        const [rows] = await db.execute(sql, values);
        return rows;
    }

    static async searchPackages(searchTerm) {
        const sql = `
            SELECT p.*, s.station_name, s.station_address, s.contact_phone, s.operating_hours
            FROM express_packages p
            LEFT JOIN express_stations s ON p.station_id = s.id
            WHERE p.tracking_number LIKE ? 
               OR p.receiver_phone LIKE ? 
               OR p.receiver_name LIKE ?
               OR p.package_description LIKE ?
            ORDER BY p.created_at DESC
        `;
        const searchPattern = `%${searchTerm}%`;
        const [rows] = await db.execute(sql, [searchPattern, searchPattern, searchPattern, searchPattern]);
        return rows;
    }

    static async updateStatus(id, status, additionalData = {}) {
        let sql = 'UPDATE express_packages SET status = ?, updated_at = CURRENT_TIMESTAMP';
        const values = [status];
        
        // 根据状态更新相应的时间字段
        if (status === 'arrived' && additionalData.actualArrival) {
            sql += ', actual_arrival = ?';
            values.push(additionalData.actualArrival);
        } else if (status === 'picked_up' && additionalData.pickupTime) {
            sql += ', pickup_time = ?';
            values.push(additionalData.pickupTime);
        } else if (status === 'delivered' && additionalData.deliveryTime) {
            sql += ', delivery_time = ?';
            values.push(additionalData.deliveryTime);
        }
        
        if (additionalData.stationId) {
            sql += ', station_id = ?';
            values.push(additionalData.stationId);
        }
        
        if (additionalData.pickupCode) {
            sql += ', pickup_code = ?';
            values.push(additionalData.pickupCode);
        }
        
        sql += ' WHERE id = ?';
        values.push(id);
        
        const [result] = await db.execute(sql, values);
        return result.affectedRows > 0;
    }

    static async update(id, updateData) {
        const allowedFields = [
            'package_description', 'receiver_name', 'receiver_phone', 'receiver_address',
            'station_id', 'pickup_code', 'estimated_arrival', 'actual_arrival',
            'weight', 'size', 'insurance_amount', 'shipping_fee', 'notes'
        ];
        
        const updateFields = [];
        const values = [];
        
        for (const [key, value] of Object.entries(updateData)) {
            if (allowedFields.includes(key) && value !== undefined) {
                updateFields.push(`${key} = ?`);
                values.push(value);
            }
        }
        
        if (updateFields.length === 0) {
            return false;
        }
        
        updateFields.push('updated_at = CURRENT_TIMESTAMP');
        values.push(id);
        
        const sql = `UPDATE express_packages SET ${updateFields.join(', ')} WHERE id = ?`;
        const [result] = await db.execute(sql, values);
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const sql = 'DELETE FROM express_packages WHERE id = ?';
        const [result] = await db.execute(sql, [id]);
        return result.affectedRows > 0;
    }

    static async getStats() {
        const sql = `
            SELECT 
                status,
                COUNT(*) as count
            FROM express_packages 
            GROUP BY status
        `;
        const [rows] = await db.execute(sql);
        
        const stats = {
            total: 0,
            inTransit: 0,
            arrived: 0,
            pickedUp: 0,
            delivered: 0,
            returned: 0
        };
        
        rows.forEach(row => {
            stats.total += row.count;
            switch (row.status) {
                case 'in_transit':
                    stats.inTransit = row.count;
                    break;
                case 'arrived':
                    stats.arrived = row.count;
                    break;
                case 'picked_up':
                    stats.pickedUp = row.count;
                    break;
                case 'delivered':
                    stats.delivered = row.count;
                    break;
                case 'returned':
                    stats.returned = row.count;
                    break;
            }
        });
        
        return stats;
    }

    static async getOverduePackages() {
        const sql = `
            SELECT p.*, s.station_name, s.station_address
            FROM express_packages p
            LEFT JOIN express_stations s ON p.station_id = s.id
            WHERE p.status = 'arrived' 
              AND p.actual_arrival < DATE_SUB(NOW(), INTERVAL 7 DAY)
            ORDER BY p.actual_arrival ASC
        `;
        const [rows] = await db.execute(sql);
        return rows;
    }
}

module.exports = ExpressPackage;

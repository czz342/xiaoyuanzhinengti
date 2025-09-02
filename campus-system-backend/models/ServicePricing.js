const { db } = require('../config/database');

class ServicePricing {
    static async createTable() {
        const sql = `
            CREATE TABLE IF NOT EXISTS service_pricing (
                id INT AUTO_INCREMENT PRIMARY KEY,
                service_type ENUM('洗衣', '打印') NOT NULL COMMENT '服务类型',
                service_name VARCHAR(100) NOT NULL COMMENT '服务名称',
                device_type ENUM('洗衣机', '打印机') NOT NULL COMMENT '设备类型',
                pricing_type ENUM('按次', '按时间', '按页数', '按容量') NOT NULL COMMENT '计费类型',
                base_price DECIMAL(8,2) NOT NULL COMMENT '基础价格',
                unit_price DECIMAL(8,2) COMMENT '单价',
                unit_name VARCHAR(50) COMMENT '单位名称',
                min_price DECIMAL(8,2) DEFAULT 0 COMMENT '最低价格',
                max_price DECIMAL(8,2) COMMENT '最高价格',
                discount_rate DECIMAL(5,2) DEFAULT 0 COMMENT '折扣率',
                peak_hours JSON COMMENT '高峰时段',
                peak_multiplier DECIMAL(3,2) DEFAULT 1.0 COMMENT '高峰时段倍数',
                special_conditions JSON COMMENT '特殊条件',
                is_active BOOLEAN DEFAULT TRUE COMMENT '是否启用',
                effective_date DATE NOT NULL COMMENT '生效日期',
                expiry_date DATE COMMENT '失效日期',
                description TEXT COMMENT '价格说明',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_service_type (service_type),
                INDEX idx_device_type (device_type),
                INDEX idx_pricing_type (pricing_type),
                INDEX idx_is_active (is_active),
                INDEX idx_effective_date (effective_date)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='服务定价表'
        `;
        await db.execute(sql);
    }

    static async create(pricingData) {
        const sql = `
            INSERT INTO service_pricing (
                service_type, service_name, device_type, pricing_type,
                base_price, unit_price, unit_name, min_price, max_price,
                discount_rate, peak_hours, peak_multiplier, special_conditions,
                is_active, effective_date, expiry_date, description
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            pricingData.serviceType,
            pricingData.serviceName,
            pricingData.deviceType,
            pricingData.pricingType,
            pricingData.basePrice,
            pricingData.unitPrice,
            pricingData.unitName,
            pricingData.minPrice || 0,
            pricingData.maxPrice,
            pricingData.discountRate || 0,
            JSON.stringify(pricingData.peakHours || []),
            pricingData.peakMultiplier || 1.0,
            JSON.stringify(pricingData.specialConditions || {}),
            pricingData.isActive !== false,
            pricingData.effectiveDate,
            pricingData.expiryDate,
            pricingData.description
        ];
        
        const [result] = await db.execute(sql, values);
        return result.insertId;
    }

    static async findById(id) {
        const sql = 'SELECT * FROM service_pricing WHERE id = ?';
        const [rows] = await db.execute(sql, [id]);
        if (rows.length > 0) {
            const pricing = rows[0];
            pricing.peakHours = JSON.parse(pricing.peakHours || '[]');
            pricing.specialConditions = JSON.parse(pricing.specialConditions || '{}');
            return pricing;
        }
        return null;
    }

    static async getPricingByService(serviceType, deviceType = null) {
        let sql = `
            SELECT * FROM service_pricing 
            WHERE service_type = ? AND is_active = TRUE
            AND effective_date <= CURDATE()
            AND (expiry_date IS NULL OR expiry_date >= CURDATE())
        `;
        const values = [serviceType];

        if (deviceType) {
            sql += ' AND device_type = ?';
            values.push(deviceType);
        }

        sql += ' ORDER BY effective_date DESC';

        const [rows] = await db.execute(sql, values);
        return rows.map(pricing => {
            pricing.peakHours = JSON.parse(pricing.peakHours || '[]');
            pricing.specialConditions = JSON.parse(pricing.specialConditions || '{}');
            return pricing;
        });
    }

    static async getCurrentPricing(serviceType, deviceType, pricingType = null) {
        let sql = `
            SELECT * FROM service_pricing 
            WHERE service_type = ? AND device_type = ? AND is_active = TRUE
            AND effective_date <= CURDATE()
            AND (expiry_date IS NULL OR expiry_date >= CURDATE())
        `;
        const values = [serviceType, deviceType];

        if (pricingType) {
            sql += ' AND pricing_type = ?';
            values.push(pricingType);
        }

        sql += ' ORDER BY effective_date DESC LIMIT 1';

        const [rows] = await db.execute(sql, values);
        if (rows.length > 0) {
            const pricing = rows[0];
            pricing.peakHours = JSON.parse(pricing.peakHours || '[]');
            pricing.specialConditions = JSON.parse(pricing.specialConditions || '{}');
            return pricing;
        }
        return null;
    }

    static async calculatePrice(serviceType, deviceType, params) {
        const pricing = await this.getCurrentPricing(serviceType, deviceType, params.pricingType);
        if (!pricing) {
            return { error: '未找到对应的价格配置' };
        }

        let basePrice = pricing.base_price;
        let unitPrice = pricing.unit_price || 0;
        let totalPrice = 0;

        // 根据计费类型计算价格
        let durationMinutes = Number(params.duration || 0) || 0;
        switch (pricing.pricingType) {
            case '按次':
                totalPrice = basePrice;
                if (!durationMinutes) {
                    durationMinutes = 30; // 默认按次30分钟
                }
                break;
            case '按时间':
                totalPrice = basePrice + (unitPrice * (params.duration || 0));
                if (!durationMinutes) {
                    durationMinutes = Number(params.duration || 0) || 0;
                }
                break;
            case '按页数':
                totalPrice = basePrice + (unitPrice * (params.pages || 0) * (params.copies || 1));
                if (!durationMinutes) {
                    const pages = Number(params.pages || 0) * Number(params.copies || 1);
                    // 简单估算：30页/分钟，至少1分钟
                    durationMinutes = Math.max(1, Math.ceil(pages / 30));
                }
                break;
            case '按容量':
                totalPrice = basePrice + (unitPrice * (params.capacity || 0));
                if (!durationMinutes) {
                    durationMinutes = 45; // 容量计价默认45分钟
                }
                break;
            default:
                totalPrice = basePrice;
                if (!durationMinutes) {
                    durationMinutes = 30;
                }
        }

        // 应用折扣
        if (pricing.discountRate > 0) {
            totalPrice = totalPrice * (1 - pricing.discountRate / 100);
        }

        // 检查是否在高峰时段
        const currentHour = new Date().getHours();
        const isPeakHour = pricing.peakHours.some(peak => {
            if (typeof peak === 'object' && peak.start && peak.end) {
                return currentHour >= peak.start && currentHour <= peak.end;
            }
            return false;
        });

        if (isPeakHour) {
            totalPrice = totalPrice * pricing.peakMultiplier;
        }

        // 应用最低和最高价格限制
        if (pricing.minPrice && totalPrice < pricing.minPrice) {
            totalPrice = pricing.minPrice;
        }
        if (pricing.maxPrice && totalPrice > pricing.maxPrice) {
            totalPrice = pricing.maxPrice;
        }

        return {
            basePrice: pricing.base_price,
            unitPrice: pricing.unit_price,
            totalPrice: Math.round(totalPrice * 100) / 100,
            pricingType: pricing.pricingType,
            unitName: pricing.unit_name,
            durationMinutes,
            isPeakHour,
            peakMultiplier: pricing.peakMultiplier,
            discountRate: pricing.discountRate
        };
    }

    static async list(filters = {}) {
        let sql = 'SELECT * FROM service_pricing WHERE 1=1';
        const values = [];

        if (filters.serviceType) {
            sql += ' AND service_type = ?';
            values.push(filters.serviceType);
        }

        if (filters.deviceType) {
            sql += ' AND device_type = ?';
            values.push(filters.deviceType);
        }

        if (filters.pricingType) {
            sql += ' AND pricing_type = ?';
            values.push(filters.pricingType);
        }

        if (filters.isActive !== undefined) {
            sql += ' AND is_active = ?';
            values.push(filters.isActive);
        }

        sql += ' ORDER BY service_type, device_type, effective_date DESC';

        const [rows] = await db.execute(sql, values);
        return rows.map(pricing => {
            pricing.peakHours = JSON.parse(pricing.peakHours || '[]');
            pricing.specialConditions = JSON.parse(pricing.specialConditions || '{}');
            return pricing;
        });
    }

    static async update(id, updateData) {
        const fields = [];
        const values = [];

        Object.keys(updateData).forEach(key => {
            if (updateData[key] !== undefined) {
                fields.push(`${key} = ?`);
                if (key === 'peakHours' || key === 'specialConditions') {
                    values.push(JSON.stringify(updateData[key]));
                } else {
                    values.push(updateData[key]);
                }
            }
        });

        if (fields.length === 0) return;

        values.push(id);
        const sql = `UPDATE service_pricing SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
        await db.execute(sql, values);
    }

    static async deactivate(id) {
        const sql = 'UPDATE service_pricing SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
        await db.execute(sql, [id]);
    }

    static async delete(id) {
        const sql = 'DELETE FROM service_pricing WHERE id = ?';
        await db.execute(sql, [id]);
    }

    static async getPricingStats() {
        const sql = `
            SELECT 
                service_type,
                device_type,
                COUNT(*) as total_pricing,
                SUM(CASE WHEN is_active = TRUE THEN 1 ELSE 0 END) as active_pricing,
                AVG(base_price) as avg_base_price,
                AVG(unit_price) as avg_unit_price
            FROM service_pricing 
            GROUP BY service_type, device_type
        `;
        const [rows] = await db.execute(sql);
        return rows;
    }
}

module.exports = ServicePricing;

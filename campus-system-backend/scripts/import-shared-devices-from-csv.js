const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const config = require('../config/config');

// 简易CSV解析（假设无引号包裹的逗号与换行内嵌）
function parseCsvSimple(content) {
    const lines = content.split(/\r?\n/).filter(l => l.trim().length > 0);
    if (lines.length === 0) return { headers: [], rows: [] };
    const headers = lines[0].split(',');
    const rows = lines.slice(1).map(line => line.split(',').map(v => v.trim()));
    return { headers, rows };
}

function valueByHeader(headers, row, key) {
    const idx = headers.indexOf(key);
    return idx >= 0 ? row[idx] : '';
}

function mapCsvRowToDevice(headers, row) {
    const deviceNumber = valueByHeader(headers, row, 'number');
    const deviceName = valueByHeader(headers, row, 'name.zh_CN') || deviceNumber;
    const deviceType = valueByHeader(headers, row, 'lb77_device_type') || '未知设备';
    const location = valueByHeader(headers, row, 'lb77_location') || '';
    const status = valueByHeader(headers, row, 'lb77_status') || '正常';
    const model = valueByHeader(headers, row, 'lb77_brand_model') || '';

    const isWasher = deviceType.includes('洗衣');
    const isPrinter = deviceType.includes('打印');

    const defaultFeatures = isWasher
        ? ['标准洗涤', '快洗模式']
        : isPrinter
            ? ['黑白打印', '网络打印']
            : [];

    const pricePerUse = isWasher ? 3.0 : isPrinter ? 0.1 : 0.0;
    const pricePerMinute = isWasher ? 0.2 : 0.0;

    return {
        device_number: deviceNumber,
        device_name: deviceName,
        device_type: deviceType,
        device_model: model,
        location: location,
        building: null,
        floor: null,
        room_number: null,
        status: status,
        capacity: isWasher ? '10kg' : null,
        features: defaultFeatures,
        price_per_use: pricePerUse,
        price_per_minute: pricePerMinute,
        rating: 4.5,
        usage_count: 0,
        total_usage_time: 0
    };
}

async function importFromCsv(csvPath) {
    const pool = mysql.createPool({
        host: config.database.host,
        user: config.database.user,
        password: config.database.password || '424266445Czz',
        database: 'campus_system'
    });
    try {
        console.log('📄 读取CSV:', csvPath);
        const content = fs.readFileSync(csvPath, 'utf-8');
        const { headers, rows } = parseCsvSimple(content);
        if (headers.length === 0) {
            throw new Error('CSV为空或无表头');
        }
        console.log(`🔎 解析到 ${rows.length} 行记录`);

        // 清空现有设备数据
        console.log('🧹 清空表 shared_devices ...');
        await pool.execute('DELETE FROM shared_devices');

        // 插入新数据
        const insertSql = `INSERT INTO shared_devices (
            device_number, device_name, device_type, device_model, location,
            building, floor, room_number, status, capacity, features,
            price_per_use, price_per_minute, rating, usage_count, total_usage_time
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        let success = 0;
        for (const row of rows) {
            const device = mapCsvRowToDevice(headers, row);
            if (!device.device_number) {
                console.warn('跳过：缺少设备编号');
                continue;
            }
            try {
                await pool.execute(insertSql, [
                    device.device_number, device.device_name, device.device_type, device.device_model, device.location,
                    device.building, device.floor, device.room_number, device.status, device.capacity, JSON.stringify(device.features),
                    device.price_per_use, device.price_per_minute, device.rating, device.usage_count, device.total_usage_time
                ]);
                success += 1;
            } catch (e) {
                console.error(`插入失败 ${device.device_number}:`, e.message);
            }
        }
        console.log(`✅ 导入完成：成功 ${success} 条`);
    } finally {
        await pool.end();
    }
}

if (require.main === module) {
    const csvPath = path.resolve(__dirname, '../../data/共享设备导入模板.csv');
    importFromCsv(csvPath).catch(err => {
        console.error('❌ 导入失败:', err);
        process.exit(1);
    });
}

module.exports = { importFromCsv };



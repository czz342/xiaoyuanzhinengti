const mysql = require('mysql2/promise');
const config = require('../config/config');

// 创建数据库连接池
const pool = mysql.createPool({
    host: config.database.host,
    user: config.database.user,
    password: config.database.password || '424266445Czz',
    database: 'campus_system'
});

// 初始化共享设备相关表
async function initTables() {
    console.log('🚀 开始初始化共享设备相关表...');
    
    try {
        // 创建表
        const SharedDevice = require('../models/SharedDevice');
        const LaundryOrder = require('../models/LaundryOrder');
        const PrintJob = require('../models/PrintJob');
        const ServicePricing = require('../models/ServicePricing');

        await SharedDevice.createTable();
        await LaundryOrder.createTable();
        await PrintJob.createTable();
        await ServicePricing.createTable();

        console.log('✅ 共享设备相关表创建成功');
    } catch (error) {
        console.error('❌ 创建表失败:', error);
        throw error;
    }
}

// 插入示例设备数据
async function insertSampleDevices() {
    console.log('📱 开始插入示例设备数据...');
    
    const devices = [
        // 洗衣机设备
        {
            device_number: 'WM001',
            device_name: '海尔智能洗衣机',
            device_type: '洗衣机',
            device_model: 'XQG80-HBD14276',
            location: '图书馆一楼洗衣房',
            building: '图书馆',
            floor: '1楼',
            room_number: 'A101',
            status: '正常',
            capacity: '8kg',
            features: ['智能洗涤', '高温杀菌', '快洗模式', '羊毛洗', '羽绒洗'],
            price_per_use: 3.00,
            price_per_minute: 0.20,
            rating: 4.8,
            usage_count: 156,
            total_usage_time: 4680
        },
        {
            device_number: 'WM002',
            device_name: '小天鹅滚筒洗衣机',
            device_type: '洗衣机',
            device_model: 'TG80V20WDX',
            location: '图书馆一楼洗衣房',
            building: '图书馆',
            floor: '1楼',
            room_number: 'A102',
            status: '正常',
            capacity: '8kg',
            features: ['标准洗涤', '快洗模式', '脱水功能'],
            price_per_use: 2.50,
            price_per_minute: 0.15,
            rating: 4.5,
            usage_count: 203,
            total_usage_time: 6090
        },
        {
            device_number: 'WM003',
            device_name: '美的波轮洗衣机',
            device_type: '洗衣机',
            device_model: 'MB80V331',
            location: '宿舍楼A区洗衣房',
            building: '宿舍楼A区',
            floor: '1楼',
            room_number: 'B201',
            status: '正常',
            capacity: '8kg',
            features: ['波轮洗涤', '标准模式', '快洗模式'],
            price_per_use: 2.00,
            price_per_minute: 0.12,
            rating: 4.3,
            usage_count: 89,
            total_usage_time: 2670
        },
        {
            device_number: 'WM004',
            device_name: '西门子滚筒洗衣机',
            device_type: '洗衣机',
            device_model: 'XQG80-WM12P2692W',
            location: '宿舍楼B区洗衣房',
            building: '宿舍楼B区',
            floor: '1楼',
            room_number: 'C301',
            status: '维护中',
            capacity: '8kg',
            features: ['智能洗涤', '高温杀菌', '快洗模式', '羊毛洗'],
            price_per_use: 3.50,
            price_per_minute: 0.25,
            rating: 4.9,
            usage_count: 234,
            total_usage_time: 7020
        },
        {
            device_number: 'WM005',
            device_name: 'LG智能洗衣机',
            device_type: '洗衣机',
            device_model: 'FCV13G4W',
            location: '宿舍楼C区洗衣房',
            building: '宿舍楼C区',
            floor: '1楼',
            room_number: 'D401',
            status: '故障',
            capacity: '13kg',
            features: ['大容量', '智能洗涤', '高温杀菌', '快洗模式'],
            price_per_use: 4.00,
            price_per_minute: 0.30,
            rating: 4.7,
            usage_count: 67,
            total_usage_time: 2010
        },

        // 打印机设备
        {
            device_number: 'PR001',
            device_name: 'HP LaserJet Pro',
            device_type: '打印机',
            device_model: 'M404dn',
            location: '图书馆一楼打印区',
            building: '图书馆',
            floor: '1楼',
            room_number: 'A103',
            status: '正常',
            capacity: '黑白激光',
            features: ['黑白打印', '双面打印', '网络打印', '高速打印'],
            price_per_use: 0.10,
            price_per_minute: 0.00,
            rating: 4.6,
            usage_count: 1234,
            total_usage_time: 0
        },
        {
            device_number: 'PR002',
            device_name: 'Canon彩色激光打印机',
            device_type: '打印机',
            device_model: 'LBP6230dn',
            location: '图书馆一楼打印区',
            building: '图书馆',
            floor: '1楼',
            room_number: 'A104',
            status: '正常',
            capacity: '彩色激光',
            features: ['彩色打印', '黑白打印', '双面打印', '网络打印'],
            price_per_use: 0.50,
            price_per_minute: 0.00,
            rating: 4.4,
            usage_count: 567,
            total_usage_time: 0
        },
        {
            device_number: 'PR003',
            device_name: 'Epson喷墨打印机',
            device_type: '打印机',
            device_model: 'L3158',
            location: '教学楼A区打印室',
            building: '教学楼A区',
            floor: '2楼',
            room_number: 'E201',
            status: '正常',
            capacity: '彩色喷墨',
            features: ['彩色打印', '照片打印', '无线打印', '扫描功能'],
            price_per_use: 0.30,
            price_per_minute: 0.00,
            rating: 4.2,
            usage_count: 345,
            total_usage_time: 0
        },
        {
            device_number: 'PR004',
            device_name: 'Brother黑白激光打印机',
            device_type: '打印机',
            device_model: 'HL-L2350DW',
            location: '教学楼B区打印室',
            building: '教学楼B区',
            floor: '3楼',
            room_number: 'F301',
            status: '正常',
            capacity: '黑白激光',
            features: ['黑白打印', '双面打印', '无线打印', '网络打印'],
            price_per_use: 0.08,
            price_per_minute: 0.00,
            rating: 4.5,
            usage_count: 789,
            total_usage_time: 0
        },
        {
            device_number: 'PR005',
            device_name: 'Xerox多功能一体机',
            device_type: '打印机',
            device_model: 'WorkCentre 6515',
            location: '行政楼打印中心',
            building: '行政楼',
            floor: '1楼',
            room_number: 'G101',
            status: '正常',
            capacity: '彩色激光',
            features: ['彩色打印', '黑白打印', '复印', '扫描', '传真'],
            price_per_use: 0.40,
            price_per_minute: 0.00,
            rating: 4.8,
            usage_count: 456,
            total_usage_time: 0
        }
    ];

    for (const device of devices) {
        try {
            // 检查设备是否已存在
            const [existing] = await pool.execute(
                'SELECT id FROM shared_devices WHERE device_number = ?',
                [device.device_number]
            );
            
            if (existing.length > 0) {
                console.log(`⚠️ 设备 ${device.device_number} 已存在，跳过`);
                continue;
            }

            // 插入设备数据
            const [result] = await pool.execute(`
                INSERT INTO shared_devices (
                    device_number, device_name, device_type, device_model, location,
                    building, floor, room_number, status, capacity, features,
                    price_per_use, price_per_minute, rating, usage_count,
                    total_usage_time
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                device.device_number, device.device_name, device.device_type,
                device.device_model, device.location, device.building,
                device.floor, device.room_number, device.status, device.capacity,
                JSON.stringify(device.features), device.price_per_use,
                device.price_per_minute, device.rating, device.usage_count,
                device.total_usage_time
            ]);

            console.log(`✅ 设备 ${device.device_number} 创建成功，ID: ${result.insertId}`);
        } catch (error) {
            console.error(`❌ 创建设备 ${device.device_number} 失败:`, error.message);
        }
    }
}

// 插入服务定价数据
async function insertSamplePricing() {
    console.log('💰 开始插入服务定价数据...');
    
    const pricingData = [
        // 洗衣服务定价
        {
            service_type: '洗衣',
            service_name: '标准洗衣服务',
            device_type: '洗衣机',
            pricing_type: '按次',
            base_price: 3.00,
            unit_price: 0.20,
            unit_name: '分钟',
            min_price: 2.00,
            max_price: 8.00,
            discount_rate: 0,
            peak_hours: [
                { start: 18, end: 22 }
            ],
            peak_multiplier: 1.2,
            special_conditions: {
                student_discount: 0.1,
                bulk_discount: 0.15
            },
            is_active: true,
            effective_date: '2024-01-01',
            description: '标准洗衣服务，包含洗涤、漂洗、脱水'
        },
        {
            service_type: '洗衣',
            service_name: '快速洗衣服务',
            device_type: '洗衣机',
            pricing_type: '按次',
            base_price: 2.50,
            unit_price: 0.15,
            unit_name: '分钟',
            min_price: 1.50,
            max_price: 6.00,
            discount_rate: 0,
            peak_hours: [
                { start: 18, end: 22 }
            ],
            peak_multiplier: 1.2,
            special_conditions: {
                student_discount: 0.1
            },
            is_active: true,
            effective_date: '2024-01-01',
            description: '快速洗衣服务，适合轻污衣物'
        },

        // 打印服务定价
        {
            service_type: '打印',
            service_name: '黑白打印服务',
            device_type: '打印机',
            pricing_type: '按页数',
            base_price: 0.10,
            unit_price: 0.10,
            unit_name: '页',
            min_price: 0.05,
            max_price: 1.00,
            discount_rate: 0,
            peak_hours: [
                { start: 8, end: 10 },
                { start: 14, end: 16 }
            ],
            peak_multiplier: 1.1,
            special_conditions: {
                student_discount: 0.2,
                bulk_discount: 0.3
            },
            is_active: true,
            effective_date: '2024-01-01',
            description: '黑白打印服务，A4纸张'
        },
        {
            service_type: '打印',
            service_name: '彩色打印服务',
            device_type: '打印机',
            pricing_type: '按页数',
            base_price: 0.50,
            unit_price: 0.50,
            unit_name: '页',
            min_price: 0.30,
            max_price: 2.00,
            discount_rate: 0,
            peak_hours: [
                { start: 8, end: 10 },
                { start: 14, end: 16 }
            ],
            peak_multiplier: 1.1,
            special_conditions: {
                student_discount: 0.15,
                bulk_discount: 0.25
            },
            is_active: true,
            effective_date: '2024-01-01',
            description: '彩色打印服务，A4纸张'
        }
    ];

    for (const pricing of pricingData) {
        try {
            // 检查定价是否已存在
            const [existing] = await pool.execute(
                'SELECT id FROM service_pricing WHERE service_type = ? AND service_name = ? AND device_type = ?',
                [pricing.service_type, pricing.service_name, pricing.device_type]
            );
            
            if (existing.length > 0) {
                console.log(`⚠️ 定价 ${pricing.service_name} 已存在，跳过`);
                continue;
            }

            // 插入定价数据
            const [result] = await pool.execute(`
                INSERT INTO service_pricing (
                    service_type, service_name, device_type, pricing_type,
                    base_price, unit_price, unit_name, min_price, max_price,
                    discount_rate, peak_hours, peak_multiplier, special_conditions,
                    is_active, effective_date, description
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                pricing.service_type, pricing.service_name, pricing.device_type,
                pricing.pricing_type, pricing.base_price, pricing.unit_price,
                pricing.unit_name, pricing.min_price, pricing.max_price,
                pricing.discount_rate, JSON.stringify(pricing.peak_hours),
                pricing.peak_multiplier, JSON.stringify(pricing.special_conditions),
                pricing.is_active, pricing.effective_date, pricing.description
            ]);

            console.log(`✅ 定价 ${pricing.service_name} 创建成功，ID: ${result.insertId}`);
        } catch (error) {
            console.error(`❌ 创建定价 ${pricing.service_name} 失败:`, error.message);
        }
    }
}

// 主函数
async function main() {
    try {
        console.log('🚀 开始初始化共享设备服务...');
        
        // 初始化表
        await initTables();
        
        // 插入示例数据
        await insertSampleDevices();
        await insertSamplePricing();
        
        console.log('✅ 共享设备服务初始化完成！');
        
        // 显示统计信息
        const [deviceCount] = await pool.execute('SELECT COUNT(*) as count FROM shared_devices');
        const [pricingCount] = await pool.execute('SELECT COUNT(*) as count FROM service_pricing');
        
        console.log(`📊 数据统计:`);
        console.log(`   - 共享设备: ${deviceCount[0].count} 个`);
        console.log(`   - 服务定价: ${pricingCount[0].count} 个`);
        
    } catch (error) {
        console.error('❌ 初始化失败:', error);
    } finally {
        await pool.end();
    }
}

// 运行脚本
if (require.main === module) {
    main();
}

module.exports = { initTables, insertSampleDevices, insertSamplePricing };

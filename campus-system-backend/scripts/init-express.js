const ExpressPackage = require('../models/ExpressPackage');
const ExpressStation = require('../models/ExpressStation');
const ExpressTracking = require('../models/ExpressTracking');

async function initExpressTables() {
    try {
        console.log('开始初始化快递服务数据表...');
        
        // 创建表
        await ExpressStation.createTable();
        console.log('✓ 快递驿站表创建成功');
        
        await ExpressPackage.createTable();
        console.log('✓ 快递包裹表创建成功');
        
        await ExpressTracking.createTable();
        console.log('✓ 快递跟踪记录表创建成功');
        
        console.log('所有快递服务数据表创建完成！');
    } catch (error) {
        console.error('初始化快递服务数据表失败:', error);
        throw error;
    }
}

async function insertSampleStations() {
    try {
        console.log('开始插入示例驿站数据...');
        
        // 检查是否已有数据
        const existingStations = await ExpressStation.getAll(false);
        if (existingStations.length > 0) {
            console.log(`✓ 驿站数据已存在 (${existingStations.length} 个)，跳过插入`);
            return;
        }
        
        const stations = [
            {
                stationName: '校园快递驿站A',
                stationCode: 'STATION_A',
                stationAddress: '学生宿舍区A栋一楼',
                contactPhone: '13800138001',
                contactPerson: '张师傅',
                operatingHours: '8:00-22:00',
                latitude: 39.9042,
                longitude: 116.4074,
                capacity: 500,
                currentCount: 0,
                serviceTypes: ['快递代收', '快递代发', '包装服务'],
                facilities: {
                    '自助取件': true,
                    '人工服务': true,
                    '包装材料': true,
                    '称重服务': true
                },
                status: 'active',
                notes: '主要服务学生宿舍区A-D栋'
            },
            {
                stationName: '校园快递驿站B',
                stationCode: 'STATION_B',
                stationAddress: '学生宿舍区B栋一楼',
                contactPhone: '13800138002',
                contactPerson: '李师傅',
                operatingHours: '8:00-22:00',
                latitude: 39.9045,
                longitude: 116.4077,
                capacity: 400,
                currentCount: 0,
                serviceTypes: ['快递代收', '快递代发'],
                facilities: {
                    '自助取件': true,
                    '人工服务': true,
                    '包装材料': false,
                    '称重服务': true
                },
                status: 'active',
                notes: '主要服务学生宿舍区E-H栋'
            },
            {
                stationName: '校园快递驿站C',
                stationCode: 'STATION_C',
                stationAddress: '生活服务区一楼',
                contactPhone: '13800138003',
                contactPerson: '王师傅',
                operatingHours: '7:00-23:00',
                latitude: 39.9048,
                longitude: 116.4080,
                capacity: 800,
                currentCount: 0,
                serviceTypes: ['快递代收', '快递代发', '包装服务', '快递查询'],
                facilities: {
                    '自助取件': true,
                    '人工服务': true,
                    '包装材料': true,
                    '称重服务': true,
                    '快递查询': true
                },
                status: 'active',
                notes: '主要服务生活服务区及周边区域'
            }
        ];
        
        for (const station of stations) {
            await ExpressStation.create(station);
        }
        
        console.log(`✓ 成功插入 ${stations.length} 个示例驿站`);
    } catch (error) {
        console.error('插入示例驿站数据失败:', error);
        throw error;
    }
}

async function insertSamplePackages() {
    try {
        console.log('开始插入示例快递包裹数据...');
        
        // 检查是否已有数据
        const existingPackages = await ExpressPackage.findByReceiverPhone('13735563391');
        if (existingPackages.length > 0) {
            console.log(`✓ 快递包裹数据已存在 (${existingPackages.length} 个)，跳过插入`);
            return;
        }
        
        // 获取驿站信息
        const stations = await ExpressStation.getAll();
        if (stations.length === 0) {
            throw new Error('没有找到驿站数据，请先插入驿站数据');
        }
        
        const packages = [
            {
                trackingNumber: 'SF1234567890',
                courierName: '顺丰快递',
                courierCode: 'SF',
                packageDescription: '书籍、文具用品',
                senderName: '张三',
                senderPhone: '13800138000',
                receiverName: '李小明',
                receiverPhone: '13735563391',
                receiverAddress: '学生宿舍A栋101室',
                status: 'arrived',
                stationId: stations[0].id,
                pickupCode: 'A1234',
                estimatedArrival: new Date(Date.now() + 24 * 60 * 60 * 1000),
                actualArrival: new Date(Date.now() - 2 * 60 * 60 * 1000),
                weight: 1.2,
                size: '30x20x10cm',
                insuranceAmount: 0,
                shippingFee: 12.00,
                notes: '易碎品，请小心处理'
            },
            {
                trackingNumber: 'YT9876543210',
                courierName: '圆通速递',
                courierCode: 'YT',
                packageDescription: '服装、鞋子',
                senderName: '王五',
                senderPhone: '13900139000',
                receiverName: '李小明',
                receiverPhone: '13735563391',
                receiverAddress: '学生宿舍A栋101室',
                status: 'in_transit',
                stationId: null,
                pickupCode: null,
                estimatedArrival: new Date(Date.now() + 48 * 60 * 60 * 1000),
                actualArrival: null,
                weight: 0.8,
                size: '40x30x15cm',
                insuranceAmount: 0,
                shippingFee: 8.00,
                notes: '请勿折叠'
            },
            {
                trackingNumber: 'ZT5556667778',
                courierName: '中通快递',
                courierCode: 'ZT',
                packageDescription: '电子产品',
                senderName: '赵六',
                senderPhone: '13700137000',
                receiverName: '李小明',
                receiverPhone: '13735563391',
                receiverAddress: '学生宿舍A栋101室',
                status: 'picked_up',
                stationId: stations[1].id,
                pickupCode: 'B5678',
                estimatedArrival: new Date(Date.now() - 24 * 60 * 60 * 1000),
                actualArrival: new Date(Date.now() - 24 * 60 * 60 * 1000),
                pickupTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
                weight: 0.5,
                size: '25x20x8cm',
                insuranceAmount: 100.00,
                shippingFee: 15.00,
                notes: '贵重物品，已保价'
            },
            {
                trackingNumber: 'JD1112223334',
                courierName: '京东物流',
                courierCode: 'JD',
                packageDescription: '日用品、零食',
                senderName: '孙七',
                senderPhone: '13600136000',
                receiverName: '李小明',
                receiverPhone: '13735563391',
                receiverAddress: '学生宿舍A栋101室',
                status: 'delivered',
                stationId: stations[2].id,
                pickupCode: 'C9012',
                estimatedArrival: new Date(Date.now() - 48 * 60 * 60 * 1000),
                actualArrival: new Date(Date.now() - 48 * 60 * 60 * 1000),
                pickupTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
                deliveryTime: new Date(Date.now() - 12 * 60 * 60 * 1000),
                weight: 2.1,
                size: '35x25x20cm',
                insuranceAmount: 0,
                shippingFee: 10.00,
                notes: '生鲜食品，请及时取件'
            },
            {
                trackingNumber: 'SF9998887776',
                courierName: '顺丰快递',
                courierCode: 'SF',
                packageDescription: '学习用品、文具',
                senderName: '周八',
                senderPhone: '13500135000',
                receiverName: '李小明',
                receiverPhone: '13735563391',
                receiverAddress: '学生宿舍A栋101室',
                status: 'arrived',
                stationId: stations[0].id,
                pickupCode: 'A3456',
                estimatedArrival: new Date(Date.now() + 12 * 60 * 60 * 1000),
                actualArrival: new Date(Date.now() - 1 * 60 * 60 * 1000),
                weight: 0.6,
                size: '28x18x12cm',
                insuranceAmount: 0,
                shippingFee: 9.00,
                notes: '学习用品，请妥善保管'
            }
        ];
        
        for (const packageData of packages) {
            const packageId = await ExpressPackage.create(packageData);
            
            // 为每个包裹生成跟踪记录
            await ExpressTracking.generateStandardTracking(
                packageId,
                packageData.trackingNumber,
                packageData.status
            );
        }
        
        console.log(`✓ 成功插入 ${packages.length} 个示例快递包裹`);
    } catch (error) {
        console.error('插入示例快递包裹数据失败:', error);
        throw error;
    }
}

async function main() {
    try {
        await initExpressTables();
        await insertSampleStations();
        await insertSamplePackages();
        
        console.log('\n🎉 快递服务数据初始化完成！');
        console.log('包含内容：');
        console.log('- 3个快递驿站');
        console.log('- 5个示例快递包裹');
        console.log('- 完整的跟踪记录');
    } catch (error) {
        console.error('快递服务数据初始化失败:', error);
        process.exit(1);
    }
}

// 如果直接运行此脚本
if (require.main === module) {
    main();
}

module.exports = {
    initExpressTables,
    insertSampleStations,
    insertSamplePackages,
    main
};

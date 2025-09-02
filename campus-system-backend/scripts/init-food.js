const Canteen = require('../models/Canteen');
const Food = require('../models/Food');
const FoodOrder = require('../models/FoodOrder');
const FoodOrderItem = require('../models/FoodOrderItem');

async function initFoodTables() {
    try {
        console.log('🔄 开始初始化食堂模块数据表...');
        
        // 创建表
        await Canteen.createTable();
        console.log('✅ 食堂表创建成功');
        
        await Food.createTable();
        console.log('✅ 菜品表创建成功');
        
        await FoodOrder.createTable();
        console.log('✅ 订单表创建成功');
        
        await FoodOrderItem.createTable();
        console.log('✅ 订单项表创建成功');
        
        console.log('🎉 食堂模块数据表初始化完成！');
    } catch (error) {
        console.error('❌ 初始化食堂模块数据表失败:', error);
        throw error;
    }
}

async function insertSampleCanteens() {
    try {
        console.log('🔄 开始插入示例食堂数据...');
        
        const canteens = [
            {
                number: 'ST001',
                name: '一食堂',
                location: '校园东区',
                description: '提供传统中式菜品，价格实惠',
                open_time: '06:00:00',
                close_time: '22:00:00',
                status: 'open',
                phone: '010-12345678'
            },
            {
                number: 'ST002',
                name: '二食堂',
                location: '校园西区',
                description: '提供多样化菜品，环境优雅',
                open_time: '06:30:00',
                close_time: '21:30:00',
                status: 'open',
                phone: '010-12345679'
            },
            {
                number: 'ST003',
                name: '风味餐厅',
                location: '校园中心',
                description: '提供特色美食，口味独特',
                open_time: '07:00:00',
                close_time: '22:00:00',
                status: 'open',
                phone: '010-12345680'
            },
            {
                number: 'ST004',
                name: '清真餐厅',
                location: '校园北区',
                description: '提供清真美食，尊重民族习惯',
                open_time: '06:00:00',
                close_time: '21:00:00',
                status: 'open',
                phone: '010-12345681'
            }
        ];
        
        for (const canteen of canteens) {
            // 确保所有字段都有值，避免undefined
            const cleanCanteen = {
                number: canteen.number,
                name: canteen.name,
                location: canteen.location || null,
                description: canteen.description || null,
                open_time: canteen.open_time || '06:00:00',
                close_time: canteen.close_time || '22:00:00',
                status: canteen.status || 'open',
                phone: canteen.phone || null,
                image: canteen.image || null
            };
            await Canteen.insert(cleanCanteen);
        }
        
        console.log('✅ 示例食堂数据插入成功');
    } catch (error) {
        console.error('❌ 插入示例食堂数据失败:', error);
        throw error;
    }
}

async function insertSampleFoods() {
    try {
        console.log('🔄 开始插入示例菜品数据...');
        
        // 先获取食堂ID
        const canteens = await Canteen.list();
        const canteenMap = {};
        canteens.forEach(c => canteenMap[c.number] = c.id);
        
        const foods = [
            // 一食堂菜品
            {
                number: 'CP001',
                name: '宫保鸡丁',
                canteen_id: canteenMap['ST001'],
                canteen_window: '1号窗口',
                description: '经典川菜，鸡肉鲜嫩，花生香脆',
                image: '/static/images/FoodList/宫保鸡丁.jpg',
                price: 12.00,
                category: '热菜',
                tags: ['家常', '微辣'],
                monthly_sales: 156,
                rating: 4.8,
                preparation_time: 8,
                is_recommended: true
            },
            {
                number: 'CP002',
                name: '鱼香肉丝',
                canteen_id: canteenMap['ST001'],
                canteen_window: '1号窗口',
                description: '酸甜可口的经典川菜',
                image: '/static/images/FoodList/鱼香肉丝.jpg',
                price: 12.00,
                category: '热菜',
                tags: ['家常', '酸甜'],
                monthly_sales: 142,
                rating: 4.7,
                preparation_time: 10,
                is_recommended: false
            },
            {
                number: 'CP003',
                name: '麻婆豆腐',
                canteen_id: canteenMap['ST001'],
                canteen_window: '2号窗口',
                description: '麻辣鲜香的经典川菜',
                image: '/static/images/FoodList/麻婆豆腐.jpg',
                price: 8.00,
                category: '热菜',
                tags: ['家常', '麻辣'],
                monthly_sales: 98,
                rating: 4.6,
                preparation_time: 6,
                is_recommended: false
            },
            {
                number: 'CP004',
                name: '番茄炒蛋',
                canteen_id: canteenMap['ST001'],
                canteen_window: '2号窗口',
                description: '简单美味的家常菜',
                image: '/static/images/FoodList/番茄炒蛋.jpg',
                price: 6.00,
                category: '热菜',
                tags: ['家常', '酸甜'],
                monthly_sales: 203,
                rating: 4.9,
                preparation_time: 5,
                is_recommended: true
            },
            {
                number: 'CP005',
                name: '红烧茄子',
                canteen_id: canteenMap['ST001'],
                canteen_window: '3号窗口',
                description: '茄子软糯，味道浓郁',
                image: '/static/images/FoodList/红烧茄子.jpg',
                price: 7.00,
                category: '素菜',
                tags: ['家常', '咸鲜'],
                monthly_sales: 87,
                rating: 4.5,
                preparation_time: 12,
                is_recommended: false
            },
            {
                number: 'CP006',
                name: '酸辣土豆丝',
                canteen_id: canteenMap['ST001'],
                canteen_window: '3号窗口',
                description: '酸辣开胃的爽口菜',
                image: '/static/images/FoodList/酸辣土豆丝.jpeg',
                price: 5.00,
                category: '素菜',
                tags: ['家常', '酸辣'],
                monthly_sales: 134,
                rating: 4.7,
                preparation_time: 7,
                is_recommended: false
            },
            {
                number: 'CP007',
                name: '米饭',
                canteen_id: canteenMap['ST001'],
                canteen_window: '4号窗口',
                description: '香软可口的白米饭',
                image: '/static/images/FoodList/米饭.jpg',
                price: 1.00,
                category: '主食',
                tags: [],
                monthly_sales: 567,
                rating: 4.8,
                preparation_time: 2,
                is_recommended: false
            },
            {
                number: 'CP008',
                name: '红烧排骨',
                canteen_id: canteenMap['ST001'],
                canteen_window: '特色窗口',
                description: '排骨软烂，味道浓郁',
                image: '/static/images/FoodList/红烧排骨.jpg',
                price: 18.00,
                category: '热菜',
                tags: ['家常', '咸鲜'],
                monthly_sales: 89,
                rating: 4.6,
                preparation_time: 15,
                is_recommended: true
            },
            
            // 二食堂菜品
            {
                number: 'CP011',
                name: '糖醋里脊',
                canteen_id: canteenMap['ST002'],
                canteen_window: '1号窗口',
                description: '外酥内嫩，酸甜可口',
                image: '/static/images/FoodList/糖醋里脊.jpg',
                price: 15.00,
                category: '热菜',
                tags: ['酸甜', '经典'],
                monthly_sales: 178,
                rating: 4.9,
                preparation_time: 15,
                is_recommended: true
            },
            {
                number: 'CP012',
                name: '地三鲜',
                canteen_id: canteenMap['ST002'],
                canteen_window: '1号窗口',
                description: '茄子、土豆、青椒的完美搭配',
                image: '/static/images/FoodList/地三鲜.jpg',
                price: 9.00,
                category: '热菜',
                tags: ['家常'],
                monthly_sales: 123,
                rating: 4.6,
                preparation_time: 12,
                is_recommended: false
            },
            {
                number: 'CP013',
                name: '干煸豆角',
                canteen_id: canteenMap['ST002'],
                canteen_window: '2号窗口',
                description: '豆角干香，微辣开胃',
                image: '/static/images/FoodList/干煸豆角.jpg',
                price: 10.00,
                category: '素菜',
                tags: ['干香', '微辣'],
                monthly_sales: 95,
                rating: 4.5,
                preparation_time: 10,
                is_recommended: false
            },
            {
                number: 'CP014',
                name: '水煮肉片',
                canteen_id: canteenMap['ST002'],
                canteen_window: '特色窗口',
                description: '麻辣鲜香，肉片嫩滑',
                image: '/static/images/FoodList/水煮肉片.jpg',
                price: 18.00,
                category: '热菜',
                tags: ['麻辣', '川菜'],
                monthly_sales: 89,
                rating: 4.8,
                preparation_time: 18,
                is_recommended: true
            },
            {
                number: 'CP015',
                name: '青椒肉丝',
                canteen_id: canteenMap['ST002'],
                canteen_window: '2号窗口',
                description: '青椒爽脆，肉丝嫩滑',
                image: '/static/images/FoodList/青椒肉丝.jpeg',
                price: 11.00,
                category: '热菜',
                tags: ['家常', '咸鲜'],
                monthly_sales: 112,
                rating: 4.7,
                preparation_time: 8,
                is_recommended: false
            },
            {
                number: 'CP016',
                name: '可乐鸡翅',
                canteen_id: canteenMap['ST002'],
                canteen_window: '特色窗口',
                description: '甜咸可口，鸡翅入味',
                image: '/static/images/FoodList/可乐鸡翅.jpg',
                price: 16.00,
                category: '热菜',
                tags: ['特色', '甜咸'],
                monthly_sales: 76,
                rating: 4.8,
                preparation_time: 20,
                is_recommended: true
            },
            
            // 风味餐厅菜品
            {
                number: 'CP021',
                name: '麻辣香锅',
                canteen_id: canteenMap['ST003'],
                canteen_window: '麻辣香锅窗口',
                description: '自选食材，麻辣鲜香',
                image: '/static/images/FoodList/麻辣香锅.jpg',
                price: 30.00,
                category: '特色',
                tags: ['自选', '麻辣'],
                monthly_sales: 67,
                rating: 4.9,
                preparation_time: 20,
                is_recommended: true
            },
            {
                number: 'CP022',
                name: '黄焖鸡米饭',
                canteen_id: canteenMap['ST003'],
                canteen_window: '盖饭窗口',
                description: '鸡肉鲜嫩，汤汁浓郁',
                image: '/static/images/FoodList/黄焖鸡米饭.jpg',
                price: 18.00,
                category: '特色',
                tags: ['盖饭', '咸鲜'],
                monthly_sales: 145,
                rating: 4.8,
                preparation_time: 12,
                is_recommended: true
            },
            {
                number: 'CP023',
                name: '酸菜鱼',
                canteen_id: canteenMap['ST003'],
                canteen_window: '特色窗口',
                description: '酸辣开胃，鱼肉鲜嫩',
                image: '/static/images/FoodList/酸菜鱼.jpg',
                price: 25.00,
                category: '特色',
                tags: ['酸辣', '川菜'],
                monthly_sales: 78,
                rating: 4.9,
                preparation_time: 18,
                is_recommended: true
            },
            {
                number: 'CP024',
                name: '大盘鸡',
                canteen_id: canteenMap['ST003'],
                canteen_window: '新疆菜窗口',
                description: '新疆特色，鸡肉土豆配馕',
                image: '/static/images/FoodList/大盘鸡.jpg',
                price: 35.00,
                category: '特色',
                tags: ['新疆', '咸鲜'],
                monthly_sales: 45,
                rating: 4.7,
                preparation_time: 25,
                is_recommended: false
            },
            {
                number: 'CP025',
                name: '羊肉串',
                canteen_id: canteenMap['ST003'],
                canteen_window: '烧烤窗口',
                description: '新疆羊肉串，香嫩多汁',
                image: '/static/images/FoodList/羊肉串.jpg',
                price: 8.00,
                category: '烧烤',
                tags: ['烧烤', '新疆'],
                monthly_sales: 234,
                rating: 4.8,
                preparation_time: 10,
                is_recommended: true
            },
            {
                number: 'CP026',
                name: '手抓饭',
                canteen_id: canteenMap['ST003'],
                canteen_window: '新疆菜窗口',
                description: '新疆手抓饭，羊肉胡萝卜',
                image: '/static/images/FoodList/手抓饭.jpeg',
                price: 22.00,
                category: '特色',
                tags: ['新疆', '主食'],
                monthly_sales: 56,
                rating: 4.6,
                preparation_time: 15,
                is_recommended: false
            },
            {
                number: 'CP027',
                name: '馕',
                canteen_id: canteenMap['ST003'],
                canteen_window: '新疆菜窗口',
                description: '新疆烤馕，香脆可口',
                image: '/static/images/FoodList/馕.jpg',
                price: 3.00,
                category: '主食',
                tags: ['新疆', '烤制'],
                monthly_sales: 189,
                rating: 4.7,
                preparation_time: 5,
                is_recommended: false
            },
            {
                number: 'CP028',
                name: '烤包子',
                canteen_id: canteenMap['ST003'],
                canteen_window: '新疆菜窗口',
                description: '新疆烤包子，外酥内软',
                image: '/static/images/FoodList/烤包子.jpg',
                price: 4.00,
                category: '主食',
                tags: ['新疆', '烤制'],
                monthly_sales: 156,
                rating: 4.6,
                preparation_time: 8,
                is_recommended: false
            },
            {
                number: 'CP029',
                name: '牛肉拉面',
                canteen_id: canteenMap['ST003'],
                canteen_window: '面食窗口',
                description: '兰州牛肉拉面，汤鲜面劲',
                image: '/static/images/FoodList/牛肉拉面.jpg',
                price: 15.00,
                category: '面食',
                tags: ['兰州', '汤面'],
                monthly_sales: 267,
                rating: 4.9,
                preparation_time: 12,
                is_recommended: true
            },
            {
                number: 'CP030',
                name: '兰州拉面',
                canteen_id: canteenMap['ST003'],
                canteen_window: '面食窗口',
                description: '正宗兰州拉面，手工制作',
                image: '/static/images/FoodList/兰州拉面.jpg',
                price: 12.00,
                category: '面食',
                tags: ['兰州', '手工'],
                monthly_sales: 198,
                rating: 4.8,
                preparation_time: 10,
                is_recommended: true
            },
            {
                number: 'CP031',
                name: '重庆小面',
                canteen_id: canteenMap['ST003'],
                canteen_window: '面食窗口',
                description: '重庆特色小面，麻辣鲜香',
                image: '/static/images/FoodList/重庆小面.jpg',
                price: 14.00,
                category: '面食',
                tags: ['重庆', '麻辣'],
                monthly_sales: 134,
                rating: 4.7,
                preparation_time: 8,
                is_recommended: false
            },
            {
                number: 'CP032',
                name: '过桥米线',
                canteen_id: canteenMap['ST003'],
                canteen_window: '米线窗口',
                description: '云南过桥米线，汤鲜料足',
                image: '/static/images/FoodList/过桥米线.jpg',
                price: 16.00,
                category: '米线',
                tags: ['云南', '汤面'],
                monthly_sales: 89,
                rating: 4.6,
                preparation_time: 15,
                is_recommended: false
            },
            {
                number: 'CP033',
                name: '螺蛳粉',
                canteen_id: canteenMap['ST003'],
                canteen_window: '特色窗口',
                description: '广西螺蛳粉，酸辣开胃',
                image: '/static/images/FoodList/螺蛳粉.jpg',
                price: 18.00,
                category: '特色',
                tags: ['广西', '酸辣'],
                monthly_sales: 67,
                rating: 4.5,
                preparation_time: 12,
                is_recommended: false
            },
            {
                number: 'CP034',
                name: '肉夹馍',
                canteen_id: canteenMap['ST003'],
                canteen_window: '特色窗口',
                description: '陕西肉夹馍，肉香馍脆',
                image: '/static/images/FoodList/肉夹馍.jpg',
                price: 8.00,
                category: '特色',
                tags: ['陕西', '肉夹馍'],
                monthly_sales: 145,
                rating: 4.7,
                preparation_time: 5,
                is_recommended: true
            },
            {
                number: 'CP035',
                name: '煎饼果子',
                canteen_id: canteenMap['ST003'],
                canteen_window: '早餐窗口',
                description: '天津煎饼果子，薄脆可口',
                image: '/static/images/FoodList/煎饼果子.jpeg',
                price: 6.00,
                category: '早餐',
                tags: ['天津', '早餐'],
                monthly_sales: 234,
                rating: 4.8,
                preparation_time: 3,
                is_recommended: true
            },
            {
                number: 'CP036',
                name: '铁板炒饭',
                canteen_id: canteenMap['ST003'],
                canteen_window: '炒饭窗口',
                description: '铁板炒饭，锅气十足',
                image: '/static/images/FoodList/铁板炒饭.jpg',
                price: 12.00,
                category: '炒饭',
                tags: ['铁板', '炒饭'],
                monthly_sales: 167,
                rating: 4.6,
                preparation_time: 8,
                is_recommended: false
            },
            {
                number: 'CP037',
                name: '过油肉拌面',
                canteen_id: canteenMap['ST003'],
                canteen_window: '面食窗口',
                description: '新疆过油肉拌面，肉香面劲',
                image: '/static/images/FoodList/过油肉拌面.jpg',
                price: 20.00,
                category: '面食',
                tags: ['新疆', '拌面'],
                monthly_sales: 78,
                rating: 4.7,
                preparation_time: 15,
                is_recommended: false
            },
            {
                number: 'CP038',
                name: '丁丁炒面',
                canteen_id: canteenMap['ST003'],
                canteen_window: '面食窗口',
                description: '新疆丁丁炒面，面丁肉丁',
                image: '/static/images/FoodList/丁丁炒面.jpg',
                price: 18.00,
                category: '面食',
                tags: ['新疆', '炒面'],
                monthly_sales: 56,
                rating: 4.5,
                preparation_time: 12,
                is_recommended: false
            },
            {
                number: 'CP039',
                name: '炒烤肉',
                canteen_id: canteenMap['ST003'],
                canteen_window: '烧烤窗口',
                description: '新疆炒烤肉，香嫩多汁',
                image: '/static/images/FoodList/炒烤肉.jpg',
                price: 25.00,
                category: '烧烤',
                tags: ['新疆', '烧烤'],
                monthly_sales: 45,
                rating: 4.6,
                preparation_time: 18,
                is_recommended: false
            },
            {
                number: 'CP040',
                name: '清炖羊肉汤',
                canteen_id: canteenMap['ST003'],
                canteen_window: '汤品窗口',
                description: '清炖羊肉汤，汤鲜肉嫩',
                image: '/static/images/FoodList/清炖羊肉汤.jpg',
                price: 22.00,
                category: '汤品',
                tags: ['清炖', '羊肉'],
                monthly_sales: 67,
                rating: 4.7,
                preparation_time: 25,
                is_recommended: false
            },
            {
                number: 'CP041',
                name: '鸭血粉丝汤',
                canteen_id: canteenMap['ST003'],
                canteen_window: '汤品窗口',
                description: '南京鸭血粉丝汤，鲜香浓郁',
                image: '/static/images/FoodList/鸭血粉丝汤.jpg',
                price: 16.00,
                category: '汤品',
                tags: ['南京', '粉丝汤'],
                monthly_sales: 89,
                rating: 4.6,
                preparation_time: 15,
                is_recommended: false
            },
            {
                number: 'CP042',
                name: '清炒时蔬',
                canteen_id: canteenMap['ST003'],
                canteen_window: '素菜窗口',
                description: '清炒时令蔬菜，清淡爽口',
                image: '/static/images/FoodList/清炒时蔬.jpg',
                price: 8.00,
                category: '素菜',
                tags: ['清炒', '时蔬'],
                monthly_sales: 123,
                rating: 4.5,
                preparation_time: 6,
                is_recommended: false
            },
            {
                number: 'CP043',
                name: '清炒西兰花',
                canteen_id: canteenMap['ST003'],
                canteen_window: '素菜窗口',
                description: '清炒西兰花，营养健康',
                image: '/static/images/FoodList/清炒西兰花.jpg',
                price: 9.00,
                category: '素菜',
                tags: ['清炒', '西兰花'],
                monthly_sales: 98,
                rating: 4.6,
                preparation_time: 7,
                is_recommended: false
            },
            {
                number: 'CP044',
                name: '蒜蓉油麦菜',
                canteen_id: canteenMap['ST003'],
                canteen_window: '素菜窗口',
                description: '蒜蓉油麦菜，蒜香浓郁',
                image: '/static/images/FoodList/蒜蓉油麦菜.jpg',
                price: 7.00,
                category: '素菜',
                tags: ['蒜蓉', '油麦菜'],
                monthly_sales: 76,
                rating: 4.4,
                preparation_time: 5,
                is_recommended: false
            },
            {
                number: 'CP045',
                name: '花卷',
                canteen_id: canteenMap['ST003'],
                canteen_window: '主食窗口',
                description: '传统花卷，层次分明',
                image: '/static/images/FoodList/花卷.jpg',
                price: 2.00,
                category: '主食',
                tags: ['传统', '花卷'],
                monthly_sales: 234,
                rating: 4.7,
                preparation_time: 3,
                is_recommended: false
            }
        ];
        
        for (const food of foods) {
            await Food.insert(food);
        }
        
        console.log('✅ 示例菜品数据插入成功');
    } catch (error) {
        console.error('❌ 插入示例菜品数据失败:', error);
        throw error;
    }
}

async function main() {
    try {
        await initFoodTables();
        await insertSampleCanteens();
        await insertSampleFoods();
        console.log('🎉 食堂模块数据初始化完成！');
        process.exit(0);
    } catch (error) {
        console.error('❌ 食堂模块数据初始化失败:', error);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = { initFoodTables, insertSampleCanteens, insertSampleFoods };

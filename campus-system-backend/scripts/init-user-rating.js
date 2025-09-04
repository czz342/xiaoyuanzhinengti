const UserRating = require('../models/UserRating');
const { testConnection } = require('../config/database');

async function initUserRatingTable() {
    try {
        console.log('🚀 开始初始化用户评分表...');
        
        // 测试数据库连接
        const connected = await testConnection();
        if (!connected) {
            throw new Error('数据库连接失败');
        }
        
        // 创建用户评分表
        await UserRating.createTable();
        
        console.log('✅ 用户评分表初始化完成');
        
    } catch (error) {
        console.error('❌ 用户评分表初始化失败:', error.message);
        process.exit(1);
    }
}

// 如果直接运行此脚本
if (require.main === module) {
    initUserRatingTable();
}

module.exports = initUserRatingTable;

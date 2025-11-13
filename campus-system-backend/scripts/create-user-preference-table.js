/**
 * 创建用户偏好相关表
 * 用于存储用户在AI对话中的历史偏好
 */

const { pool } = require('../config/database');

async function createTables() {
    const connection = await pool.getConnection();
    
    try {
        console.log('开始创建用户偏好相关表...');

        // 1. 创建对话历史表
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS ai_conversation_history (
                id INT AUTO_INCREMENT PRIMARY KEY,
                student_id VARCHAR(50) NOT NULL COMMENT '学生ID',
                module_type VARCHAR(50) NOT NULL COMMENT '功能模块(studyroom/library/dining等)',
                user_message TEXT NOT NULL COMMENT '用户发送的消息',
                ai_response TEXT COMMENT 'AI返回的消息',
                extracted_keywords JSON COMMENT '提取的关键词(如:靠窗/安静/有电源等)',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                INDEX idx_student_module (student_id, module_type),
                INDEX idx_created_at (created_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='AI对话历史记录表';
        `);
        console.log('✅ ai_conversation_history 表创建成功');

        // 2. 创建用户偏好汇总表
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS user_preferences (
                id INT AUTO_INCREMENT PRIMARY KEY,
                student_id VARCHAR(50) NOT NULL COMMENT '学生ID',
                module_type VARCHAR(50) NOT NULL COMMENT '功能模块',
                preference_type VARCHAR(50) NOT NULL COMMENT '偏好类型(location/environment/time等)',
                preference_value VARCHAR(200) NOT NULL COMMENT '偏好值',
                frequency INT DEFAULT 1 COMMENT '出现频率(用于权重计算)',
                last_mentioned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后提及时间',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                UNIQUE KEY unique_preference (student_id, module_type, preference_type, preference_value),
                INDEX idx_student_module (student_id, module_type)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户偏好汇总表';
        `);
        console.log('✅ user_preferences 表创建成功');

        console.log('\n所有表创建完成！');
        console.log('\n示例数据说明:');
        console.log('- module_type: studyroom(自习室), library(图书馆), dining(食堂)等');
        console.log('- preference_type: location(位置), environment(环境), time(时间)等');
        console.log('- preference_value: 靠窗, 安静, 有电源, 上午, 下午等');
        
    } catch (error) {
        console.error('创建表时出错:', error);
        throw error;
    } finally {
        connection.release();
        await pool.end();
    }
}

// 执行创建表
createTables()
    .then(() => {
        console.log('\n✅ 数据库表创建完成');
        process.exit(0);
    })
    .catch(err => {
        console.error('\n❌ 创建失败:', err);
        process.exit(1);
    });


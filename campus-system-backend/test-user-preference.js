/**
 * 测试用户偏好功能
 * 运行方式: node test-user-preference.js
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/preferences';
const TEST_STUDENT_ID = '2021001';
const MODULE_TYPE = 'studyroom';

// 测试数据
const testConversations = [
    '我想找一个靠窗的座位，要安静一点的',
    '帮我预约一个有电源插座的位置',
    '我喜欢角落的位置，最好是明亮一点的',
    '找个靠窗、有电源的座位',
    '上午我想在图书馆学习，要安静的环境'
];

async function testExtractKeywords() {
    console.log('\n========== 测试1: 关键词提取 ==========');
    
    for (const text of testConversations) {
        try {
            const response = await axios.post(`${BASE_URL}/extract`, { text });
            console.log(`\n原文: ${text}`);
            console.log('提取到的关键词:', response.data.data.keywords);
        } catch (error) {
            console.error('提取失败:', error.message);
        }
    }
}

async function testSaveConversations() {
    console.log('\n\n========== 测试2: 保存对话历史 ==========');
    
    for (const message of testConversations) {
        try {
            const response = await axios.post(`${BASE_URL}/conversation`, {
                student_id: TEST_STUDENT_ID,
                module_type: MODULE_TYPE,
                user_message: message,
                ai_response: '好的，我已经为您找到了符合要求的座位'
            });
            
            console.log(`\n✅ 保存成功: ${message.substring(0, 20)}...`);
            console.log(`   提取到 ${response.data.data.keywords_count} 个关键词`);
        } catch (error) {
            console.error('❌ 保存失败:', error.message);
        }
        
        // 避免请求过快
        await new Promise(resolve => setTimeout(resolve, 100));
    }
}

async function testGetPreferences() {
    console.log('\n\n========== 测试3: 查询用户偏好 ==========');
    
    try {
        const response = await axios.get(`${BASE_URL}/${TEST_STUDENT_ID}/${MODULE_TYPE}`);
        
        console.log('\n用户偏好列表:');
        console.log('总数:', response.data.data.total_count);
        
        console.log('\n按类型分组:');
        const grouped = response.data.data.grouped;
        for (const [type, prefs] of Object.entries(grouped)) {
            console.log(`\n${type}:`);
            prefs.forEach(p => {
                console.log(`  - ${p.value} (提及 ${p.frequency} 次)`);
            });
        }
    } catch (error) {
        console.error('❌ 查询失败:', error.message);
    }
}

async function testGetPreferenceSummary() {
    console.log('\n\n========== 测试4: 获取偏好摘要 ==========');
    
    try {
        const response = await axios.get(`${BASE_URL}/summary/${TEST_STUDENT_ID}/${MODULE_TYPE}`);
        
        console.log('\n偏好摘要:');
        console.log(response.data.data.summary);
        
        console.log('\n用于AI对话的提示词前缀:');
        console.log(response.data.data.prompt_prefix);
        
    } catch (error) {
        console.error('❌ 获取失败:', error.message);
    }
}

async function testGetHistory() {
    console.log('\n\n========== 测试5: 查询对话历史 ==========');
    
    try {
        const response = await axios.get(`${BASE_URL}/history/${TEST_STUDENT_ID}/${MODULE_TYPE}`);
        
        console.log(`\n对话历史记录 (共 ${response.data.data.count} 条):`);
        response.data.data.history.slice(0, 3).forEach((record, index) => {
            console.log(`\n[${index + 1}] ${record.created_at}`);
            console.log(`   用户: ${record.user_message.substring(0, 30)}...`);
            if (record.extracted_keywords) {
                console.log(`   关键词:`, record.extracted_keywords);
            }
        });
    } catch (error) {
        console.error('❌ 查询失败:', error.message);
    }
}

async function runAllTests() {
    console.log('🚀 开始测试用户偏好功能...');
    console.log('请确保后端服务已启动 (http://localhost:3000)');
    console.log('测试学生ID:', TEST_STUDENT_ID);
    console.log('测试模块:', MODULE_TYPE);
    
    try {
        await testExtractKeywords();
        await testSaveConversations();
        await testGetPreferences();
        await testGetPreferenceSummary();
        await testGetHistory();
        
        console.log('\n\n✅ 所有测试完成！');
        console.log('\n📊 现在你可以在AI助手中发送自习室相关消息，系统会自动:');
        console.log('   1. 提取并保存你的偏好关键词');
        console.log('   2. 在下次对话时自动注入你的历史偏好');
        console.log('   3. 示例: "帮我预约座位" → 系统会自动加上 "【用户历史偏好】位置偏好：靠窗；环境偏好：安静；设施偏好：有电源。帮我预约座位"');
        
    } catch (error) {
        console.error('\n❌ 测试过程出错:', error.message);
    }
}

// 运行测试
runAllTests();


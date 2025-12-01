/**
 * 用户偏好和对话历史API路由
 */
const express = require('express');
const router = express.Router();
const ConversationHistory = require('../models/ConversationHistory');
const UserPreference = require('../models/UserPreference');

/**
 * 提取关键词的简单规则
 * 实际项目中可以接入NLP服务或使用更复杂的算法
 */
function extractKeywords(message, moduleType = 'studyroom') {
    const keywords = [];
    
    // 如果是图书推荐模块，使用图书相关的关键词提取
    if (moduleType === 'book' || moduleType === 'library') {
        // 学科偏好关键词
        const subjectKeywords = [
            '计算机', '编程', '软件', '算法', '数据结构', '人工智能', 'AI', '机器学习', '深度学习',
            '文学', '小说', '诗歌', '散文', '文学史',
            '经济', '经济学', '金融', '投资', '商业', '管理', '市场营销',
            '历史', '历史学', '古代史', '近代史', '世界史', '中国史',
            '心理学', '心理', '认知', '行为', '社会学', '哲学',
            '数学', '物理', '化学', '生物', '医学', '法律', '艺术', '设计'
        ];
        
        subjectKeywords.forEach(kw => {
            if (message.includes(kw)) {
                keywords.push({ type: 'subject', value: kw });
            }
        });
        
        // 图书类型偏好关键词
        const bookTypeKeywords = [
            '教材', '教科书', '课本',
            '专业书', '专业书籍', '专业图书',
            '小说', '文学作品',
            '工具书', '参考书', '手册', '字典', '词典',
            '期刊', '杂志', '论文', '学术期刊'
        ];
        
        bookTypeKeywords.forEach(kw => {
            if (message.includes(kw)) {
                keywords.push({ type: 'book_type', value: kw });
            }
        });
        
        // 阅读周期偏好关键词
        const readingCyclePatterns = [
            { pattern: /短期|速读|快速|1[-\s]?3天|几天|短时间内/i, value: '短期速读(1-3天)' },
            { pattern: /长期|精读|深入|1[-\s]?2周|两周|几周/i, value: '长期精读(1-2周)' },
            { pattern: /参考|查阅|查阅资料|工具|工具书|手册/i, value: '参考查阅' }
        ];
        
        readingCyclePatterns.forEach(({ pattern, value }) => {
            if (pattern.test(message)) {
                // 检查是否已经添加过相同的值
                if (!keywords.some(k => k.type === 'reading_cycle' && k.value === value)) {
                    keywords.push({ type: 'reading_cycle', value });
                }
            }
        });
        
        // 借阅时机偏好关键词
        const borrowTimingPatterns = [
            { pattern: /考试|考试周|考前|复习|备考/i, value: '考试周前' },
            { pattern: /学期初|开学|新学期|学期开始/i, value: '学期初' },
            { pattern: /假期|放假|假期前|寒暑假|节假日/i, value: '假期前' }
        ];
        
        borrowTimingPatterns.forEach(({ pattern, value }) => {
            if (pattern.test(message)) {
                // 检查是否已经添加过相同的值
                if (!keywords.some(k => k.type === 'borrow_timing' && k.value === value)) {
                    keywords.push({ type: 'borrow_timing', value });
                }
            }
        });
        
        // 作者偏好关键词（需要从知识库中匹配作者名）
        // 这里我们提取可能包含作者名的模式，实际作者名需要与知识库匹配
        const authorPatterns = [
            /作者[是：:]\s*([^\s，,。.]+)/,
            /([^\s，,。.]+)\s*写的/,
            /([^\s，,。.]+)\s*著/,
            /([^\s，,。.]+)\s*编/,
            /([^\s，,。.]+)\s*主编/
        ];
        
        authorPatterns.forEach(pattern => {
            const match = message.match(pattern);
            if (match && match[1]) {
                const authorName = match[1].trim();
                // 排除一些常见的非作者词
                const excludeWords = ['书', '教材', '图书', '小说', '这本', '这本', '那本', '什么', '哪本'];
                if (authorName.length >= 2 && authorName.length <= 20 && !excludeWords.includes(authorName)) {
                    keywords.push({ type: 'author', value: authorName });
                }
            }
        });
        
        // 去重：如果同一类型有多个相同值，只保留一个
        const seen = new Map();
        const uniqueKeywords = [];
        keywords.forEach(kw => {
            const key = `${kw.type}:${kw.value}`;
            if (!seen.has(key)) {
                seen.set(key, true);
                uniqueKeywords.push(kw);
            }
        });
        
        return uniqueKeywords;
    }
    
    // 如果是教室预约模块，使用教室相关的关键词提取
    if (moduleType === 'classroom') {
        // 设备需求偏好关键词（按长度从长到短排序，优先匹配更具体的词）
        const equipmentKeywords = [
            '智慧黑板', '会议设备', '实验设备', '开发工具', 'AI设备',
            '投影仪', '计算机', '麦克风', '示波器', '传感器',
            '投影', '电脑', '空调', '音响', '白板', '黑板', '网络', 'WiFi', 'GPU'
        ];
        
        // 使用Set记录已匹配的位置，避免重复匹配
        const matchedPositions = new Set();
        
        // 按长度从长到短匹配，优先匹配更具体的词
        equipmentKeywords.forEach(kw => {
            let index = message.indexOf(kw);
            while (index !== -1) {
                // 检查这个位置是否已经被更长关键词覆盖
                let isCovered = false;
                for (let pos = index; pos < index + kw.length; pos++) {
                    if (matchedPositions.has(pos)) {
                        isCovered = true;
                        break;
                    }
                }
                
                if (!isCovered) {
                    keywords.push({ type: 'equipment', value: kw });
                    // 标记这个位置已被匹配
                    for (let pos = index; pos < index + kw.length; pos++) {
                        matchedPositions.add(pos);
                    }
                }
                
                // 继续查找下一个匹配位置
                index = message.indexOf(kw, index + 1);
            }
        });
        
        // 楼层偏好关键词（按长度从长到短排序）
        const floorKeywords = [
            '低楼层', '高楼层', '底层', '顶层',
            '一楼', '1楼', '二楼', '2楼', '三楼', '3楼', 
            '四楼', '4楼', '五楼', '5楼', '楼上', '楼下',
            '低层', '高层', '1层', '2层', '3层', '4层', '5层'
        ];
        
        // 模糊匹配：识别"低一些"、"低一点"、"楼层低"等表达
        const floorPatterns = [
            { pattern: /楼层.*低|低.*楼层|低一些|低一点|低点/i, value: '低楼层' },
            { pattern: /楼层.*高|高.*楼层|高一些|高一点|高点/i, value: '高楼层' },
            { pattern: /(一|1)楼|(一|1)层/i, value: '1楼' },
            { pattern: /(二|2)楼|(二|2)层/i, value: '2楼' },
            { pattern: /(三|3)楼|(三|3)层/i, value: '3楼' },
            { pattern: /(四|4)楼|(四|4)层/i, value: '4楼' },
            { pattern: /(五|5)楼|(五|5)层/i, value: '5楼' }
        ];
        
        // 先进行精确匹配
        floorKeywords.forEach(kw => {
            if (message.includes(kw)) {
                keywords.push({ type: 'floor', value: kw });
            }
        });
        
        // 再进行模糊匹配（补充识别"低一些"、"低一点"等表达）
        // 检查是否已经匹配到"低楼层"或"高楼层"相关
        const hasLowFloor = keywords.some(k => k.type === 'floor' && (k.value.includes('低') || k.value === '底层'));
        const hasHighFloor = keywords.some(k => k.type === 'floor' && (k.value.includes('高') || k.value === '顶层'));
        
        floorPatterns.forEach(({ pattern, value }) => {
            if (pattern.test(message)) {
                // 检查是否已经添加过相同的值
                const alreadyExists = keywords.some(k => k.type === 'floor' && k.value === value);
                
                // 如果已经匹配到"低楼层"相关，且当前是"低楼层"，则跳过
                if (value === '低楼层' && hasLowFloor) {
                    return;
                }
                // 如果已经匹配到"高楼层"相关，且当前是"高楼层"，则跳过
                if (value === '高楼层' && hasHighFloor) {
                    return;
                }
                
                if (!alreadyExists) {
                    keywords.push({ type: 'floor', value });
                }
            }
        });
        
        // 人数容量偏好关键词（按长度从长到短排序）
        const capacityKeywords = [
            '小会议室', '大会议室', '小教室', '大教室',
            '10-20人', '20-30人', '30-50人', '50-80人', '80-100人', '100人以上',
            '10人', '20人', '30人', '40人', '50人', '60人', '70人', '80人', '90人', '100人',
            '二十几人', '三十几人', '四十几人', '五十几人',
            '小型', '中型', '大型', '几个人', '十几人',
            '容纳', '座位数', '容量'
        ];
        
        // 精确匹配容量关键词
        capacityKeywords.forEach(kw => {
            if (message.includes(kw)) {
                keywords.push({ type: 'capacity', value: kw });
            }
        });
        
        // 模糊匹配：识别"小一点"、"小一些"、"小点的教室"等表达
        const capacityPatterns = [
            { pattern: /小.*教室|小.*会议室|小一点|小一些|小点|小型的|小型教室|小一点的/i, value: '小型' },
            { pattern: /大.*教室|大.*会议室|大一点|大一些|大点|大型的|大型教室|大一点的/i, value: '大型' },
            { pattern: /中.*教室|中.*会议室|中等|中型的|中型教室/i, value: '中型' }
        ];
        
        // 检查是否已经匹配到小型/大型相关
        const hasSmall = keywords.some(k => k.type === 'capacity' && (k.value.includes('小') || k.value === '小型'));
        const hasLarge = keywords.some(k => k.type === 'capacity' && (k.value.includes('大') || k.value === '大型'));
        const hasMedium = keywords.some(k => k.type === 'capacity' && (k.value.includes('中') || k.value === '中型'));
        
        // 进行模糊匹配（补充识别模糊表达）
        capacityPatterns.forEach(({ pattern, value }) => {
            if (pattern.test(message)) {
                // 检查是否已经添加过相同的值
                const alreadyExists = keywords.some(k => k.type === 'capacity' && k.value === value);
                
                // 如果已经匹配到相同类型，则跳过
                if (value === '小型' && hasSmall) {
                    return;
                }
                if (value === '大型' && hasLarge) {
                    return;
                }
                if (value === '中型' && hasMedium) {
                    return;
                }
                
                if (!alreadyExists) {
                    keywords.push({ type: 'capacity', value });
                }
            }
        });
        
        // 去重：如果同一类型有多个相同值，只保留一个
        const seen = new Map();
        const uniqueKeywords = [];
        keywords.forEach(kw => {
            const key = `${kw.type}:${kw.value}`;
            if (!seen.has(key)) {
                seen.set(key, true);
                uniqueKeywords.push(kw);
            }
        });
        
        return uniqueKeywords;
    }
    
    // 自习室模块的关键词提取（原有逻辑）
    // 位置偏好关键词
    const locationKeywords = ['靠窗', '窗边', '角落', '门口附近', '中间', '前排', '后排', '靠墙', '走廊'];
    locationKeywords.forEach(kw => {
        if (message.includes(kw)) {
            keywords.push({ type: 'location', value: kw });
        }
    });
    
    // 环境偏好关键词
    const environmentKeywords = ['安静', '热闹', '明亮', '昏暗', '通风', '温暖', '凉爽', '独立', '开放'];
    environmentKeywords.forEach(kw => {
        if (message.includes(kw)) {
            keywords.push({ type: 'environment', value: kw });
        }
    });
    
    // ❌ 时间偏好已移除 - 时间应该基于用户课表动态推荐，不作为历史偏好保存
    
    // 设施偏好关键词
    const facilityKeywords = ['有电源', '插座', '台灯', '空调', 'WiFi', '网络', '充电', '电脑桌'];
    facilityKeywords.forEach(kw => {
        if (message.includes(kw)) {
            keywords.push({ type: 'facility', value: kw });
        }
    });
    
    return keywords;
}

/**
 * POST /api/preferences/conversation
 * 保存对话历史并自动提取偏好
 */
router.post('/conversation', async (req, res) => {
    try {
        const { student_id, module_type, user_message, ai_response } = req.body;
        
        if (!student_id || !module_type || !user_message) {
            return res.status(400).json({
                success: false,
                message: '缺少必要参数'
            });
        }
        
        // 提取关键词（根据模块类型使用不同的提取逻辑）
        const extracted_keywords = extractKeywords(user_message, module_type);
        
        // 保存对话历史
        const conversationId = await ConversationHistory.insert({
            student_id,
            module_type,
            user_message,
            ai_response,
            extracted_keywords
        });
        
        // 如果提取到了关键词，更新用户偏好
        if (extracted_keywords.length > 0) {
            await UserPreference.batchUpsert(student_id, module_type, extracted_keywords);
        }
        
        res.json({
            success: true,
            message: '对话保存成功',
            data: {
                conversation_id: conversationId,
                extracted_keywords,
                keywords_count: extracted_keywords.length
            }
        });
        
    } catch (error) {
        console.error('保存对话历史失败:', error);
        res.status(500).json({
            success: false,
            message: '保存对话失败',
            error: error.message
        });
    }
});

/**
 * GET /api/preferences/summary/:studentId/:moduleType
 * 获取用户偏好摘要（用于注入到AI对话）
 */
router.get('/summary/:studentId/:moduleType', async (req, res) => {
    try {
        const { studentId, moduleType } = req.params;
        
        const summary = await UserPreference.generatePreferenceSummary(studentId, moduleType);
        
        res.json({
            success: true,
            data: {
                has_preferences: !!summary,
                summary,
                // 提供格式化的提示词前缀
                prompt_prefix: summary ? `【用户历史偏好】${summary}。` : null
            }
        });
        
    } catch (error) {
        console.error('获取偏好摘要失败:', error);
        res.status(500).json({
            success: false,
            message: '获取偏好失败',
            error: error.message
        });
    }
});

/**
 * GET /api/preferences/:studentId/:moduleType
 * 获取用户的详细偏好列表
 */
router.get('/:studentId/:moduleType', async (req, res) => {
    try {
        const { studentId, moduleType } = req.params;
        
        const preferences = await UserPreference.getByStudentAndModule(studentId, moduleType);
        
        // 🎯 获取真实的历史对话数量
        const conversationCount = await ConversationHistory.countByModule(studentId, moduleType);
        
        // 按类型分组
        const grouped = {};
        preferences.forEach(pref => {
            if (!grouped[pref.preference_type]) {
                grouped[pref.preference_type] = [];
            }
            grouped[pref.preference_type].push({
                id: pref.id,
                value: pref.preference_value,
                frequency: pref.frequency,
                last_mentioned_at: pref.last_mentioned_at
            });
        });
        
        res.json({
            success: true,
            data: {
                preferences,
                grouped,
                total_count: conversationCount  // 使用对话历史数量，而不是偏好条目数量
            }
        });
        
    } catch (error) {
        console.error('获取用户偏好失败:', error);
        res.status(500).json({
            success: false,
            message: '获取偏好失败',
            error: error.message
        });
    }
});

/**
 * GET /api/preferences/history/:studentId/:moduleType
 * 获取用户的对话历史
 */
router.get('/history/:studentId/:moduleType', async (req, res) => {
    try {
        const { studentId, moduleType } = req.params;
        const limit = parseInt(req.query.limit) || 20;
        
        const history = await ConversationHistory.getByStudentAndModule(studentId, moduleType, limit);
        
        res.json({
            success: true,
            data: {
                history,
                count: history.length
            }
        });
        
    } catch (error) {
        console.error('获取对话历史失败:', error);
        res.status(500).json({
            success: false,
            message: '获取历史失败',
            error: error.message
        });
    }
});

/**
 * DELETE /api/preferences/:studentId/:moduleType
 * 清空用户某个模块的偏好
 */
router.delete('/:studentId/:moduleType', async (req, res) => {
    try {
        const { studentId, moduleType } = req.params;
        
        await UserPreference.clearByModule(studentId, moduleType);
        
        res.json({
            success: true,
            message: '偏好已清空'
        });
        
    } catch (error) {
        console.error('清空偏好失败:', error);
        res.status(500).json({
            success: false,
            message: '清空失败',
            error: error.message
        });
    }
});

/**
 * POST /api/preferences/extract
 * 手动提取文本中的关键词（测试用）
 */
router.post('/extract', async (req, res) => {
    try {
        const { text } = req.body;
        
        if (!text) {
            return res.status(400).json({
                success: false,
                message: '缺少text参数'
            });
        }
        
        const keywords = extractKeywords(text);
        
        res.json({
            success: true,
            data: {
                text,
                keywords,
                count: keywords.length
            }
        });
        
    } catch (error) {
        console.error('提取关键词失败:', error);
        res.status(500).json({
            success: false,
            message: '提取失败',
            error: error.message
        });
    }
});

module.exports = router;


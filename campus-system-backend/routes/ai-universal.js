const express = require('express');
const router = express.Router();
const axios = require('axios');
const { authenticateToken } = require('../middleware/auth');

// 通用校园AI助手 - 分析多场景需求
router.post('/analyze-campus-needs', authenticateToken, async (req, res) => {
  console.log('🔥 通用AI助手API被调用');
  console.log('📥 请求体:', req.body);
  
  const { conversation } = req.body;
  const apiKey = process.env.SILICONFLOW_API_KEY;

  console.log('🔑 API Key状态:', apiKey ? '已配置' : '未配置');
  console.log('💬 对话文本长度:', conversation?.length || 0);

  if (!apiKey) {
    console.error('❌ SiliconFlow API key is not configured.');
    return res.status(500).json({ success: false, message: 'AI service is not configured.' });
  }

  if (!conversation || !conversation.trim()) {
    console.error('❌ 对话文本为空');
    return res.status(400).json({ success: false, message: 'Conversation text is required' });
  }

  try {
    console.log('🤖 调用SiliconFlow API...');
    const response = await axios.post(
      'https://api.siliconflow.cn/v1/chat/completions',
      {
        model: 'Qwen/Qwen2-7B-Instruct',
        messages: [
          {
            role: 'system',
            content: `你是校园生活AI助手。请仔细分析以下对话内容，识别用户可能需要的校园服务。重点关注对话中的所有细节要求，包括环境需求、特殊要求等。

支持的服务类型：
1. errand - 跑腿代办（快递代取、外卖代拿、小事代办等）
2. classroom - 教室预约（会议室、自习室、活动室等）
3. library - 图书借阅（借书、续借、查询、座位预约等）
4. studyroom - 自习室预约（安静学习、小组讨论等）
5. dining - 食堂服务（订餐、营业时间查询、菜单等）
6. dormitory - 宿舍服务（维修申报、访客登记、设施使用等）

请以严格的JSON格式返回，包含needs数组，每个需求包含：
- type: 服务类型（上述类型之一）
- title: 简短标题（5-15字）
- description: 详细描述（包含所有重要细节）
- confidence: 置信度（0-100）
- extractedData: 提取的具体信息对象

对于不同服务类型，extractedData应详细包含：
- errand: {service_type, title, description, pickup_location, delivery_location, pickup_code, special_notes}
- classroom: {room_type, date, time, duration, purpose, participants, equipment_needed, requirements}
- library: {action, book_title, author, category, time_preference, special_needs}
- studyroom: {date, time, duration, participants, environment, equipment, purpose, requirements}
- dining: {meal_type, time, location, special_request, dietary_requirements}
- dormitory: {issue_type, room_location, urgency, description, contact_info}

特别注意提取：
- 环境要求（如"安静"、"私密"、"宽敞"等）
- 特殊需求（如设备、人数、时间等）
- 地点信息（如具体楼栋、房间号等）
- 联系方式和备注信息

如果没有检测到明确需求，返回：{"needs": []}

只返回JSON，不要其他解释文字。`
          },
          {
            role: 'user',
            content: conversation
          }
        ],
        temperature: 0.3,
        response_format: { type: "json_object" }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );

    console.log('✅ SiliconFlow响应状态:', response.status);
    console.log('📝 AI返回内容:', response.data.choices[0].message.content);
    
    const resultJson = JSON.parse(response.data.choices[0].message.content);
    console.log('📊 解析结果:', resultJson);
    
    // 处理AI返回的数据格式，可能是数组或者包含needs的对象
    let needsArray = [];
    if (Array.isArray(resultJson)) {
      needsArray = resultJson;
      console.log('📋 AI返回数组格式，直接使用');
    } else if (resultJson.needs && Array.isArray(resultJson.needs)) {
      needsArray = resultJson.needs;
      console.log('📋 AI返回对象格式，提取needs数组');
    } else {
      console.log('📋 AI返回格式不符合预期，使用空数组');
    }
    
    // 验证和过滤结果
    const validNeeds = needsArray.filter(need => {
      const isValid = need.type && need.title && need.confidence >= 60;
      console.log('🔍 验证需求:', {
        type: need.type,
        title: need.title,
        confidence: need.confidence,
        isValid: isValid
      });
      return isValid;
    });

    console.log('🎯 有效需求数量:', validNeeds.length);
    console.log('✅ 有效需求列表:', validNeeds);
    
    const result = { 
      success: true, 
      data: { 
        needs: validNeeds,
        analyzed_text: conversation.substring(0, 200) + (conversation.length > 200 ? '...' : '')
      }
    };
    
    console.log('📤 返回结果:', result);
    res.json(result);

  } catch (error) {
    console.error('Error calling SiliconFlow API for universal analysis:', error.response ? error.response.data : error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to analyze campus needs.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;

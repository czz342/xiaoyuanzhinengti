const express = require('express');
const router = express.Router();
const axios = require('axios');
const { authenticateToken } = require('../middleware/auth');

// 使用 authenticateToken 中间件来保护这个路由，确保只有登录用户能使用
router.post('/parse-errand-from-text', authenticateToken, async (req, res) => {
  const { text } = req.body;
  // 从环境变量中安全地读取您的硅基流动API Key
  const apiKey = process.env.SILICONFLOW_API_KEY;

  if (!apiKey) {
    console.error('SiliconFlow API key is not configured.');
    return res.status(500).json({ success: false, message: 'AI service is not configured.' });
  }

  if (!text) {
    return res.status(400).json({ success: false, message: 'Text is required' });
  }

  try {
    // 构造发送给硅基流动API的请求
    const response = await axios.post(
      'https://api.siliconflow.cn/v1/chat/completions',
      {
        model: 'Qwen/Qwen2-7B-Instruct', // 您可以根据硅基流动平台支持的模型进行更换
        messages: [
          {
            role: 'system',
            content: `你是一个任务解析助手。请从以下文本中，判断用户是否想创建一个跑腿订单。如果是，请抽取出以下信息，并以严格的JSON格式返回，不要包含任何JSON以外的解释性文字：
                      - service_type (服务类型，只能是 'takeout', 'express', 'other' 中的一个)
                      - title (任务标题，简短概括任务要点，5-15字，例如："快递代取"、"外卖送至宿舍"等)
                      - description (需求详细描述，应尽可能完整，包含所有细节信息)
                      - pickup_location (取件地点，如果能识别)
                      - delivery_location (送达地点，如果能识别)
                      如果无法判断意图，或缺少关键信息，请返回 {"error": "intent_not_clear"}。`
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.3,
        response_format: { type: "json_object" } // 强制要求返回JSON格式
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );

    // 提取并解析返回的JSON
    const resultJson = JSON.parse(response.data.choices[0].message.content);

    // 将解析好的JSON返回给前端
    res.json({ success: true, data: resultJson });

  } catch (error) {
    console.error('Error calling SiliconFlow API:', error.response ? error.response.data : error.message);
    res.status(500).json({ success: false, message: 'Failed to parse text.' });
  }
});

module.exports = router;

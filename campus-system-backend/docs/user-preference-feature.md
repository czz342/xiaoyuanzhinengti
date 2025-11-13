# AI用户偏好记忆功能说明文档

## 📋 功能概述

这是一个智能的用户偏好学习系统，能够：
1. **自动记录**用户与AI对话的历史
2. **智能提取**对话中的偏好关键词（如"靠窗"、"安静"、"有电源"等）
3. **自动注入**：在下次对话时，自动把用户的历史偏好注入到提示词中

## 🎯 应用场景示例

### 场景：自习室预约

**第一次对话：**
- 用户：我想找一个靠窗的座位，要安静一点的
- 系统：✅ 保存偏好 → `位置:靠窗` `环境:安静`

**第二次对话：**
- 用户：帮我预约明天的座位
- 系统：自动添加前缀 → `【用户历史偏好】位置偏好：靠窗；环境偏好：安静。帮我预约明天的座位`
- AI助手会优先推荐符合用户偏好的座位

**持续优化：**
- 用户提到偏好越多次，权重越高
- 最近提到的偏好权重更高

## 🗄️ 数据库设计

### 1. ai_conversation_history（对话历史表）

```sql
CREATE TABLE ai_conversation_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL,           -- 学生ID
    module_type VARCHAR(50) NOT NULL,          -- 功能模块(studyroom/library等)
    user_message TEXT NOT NULL,                -- 用户消息
    ai_response TEXT,                          -- AI响应
    extracted_keywords JSON,                   -- 提取的关键词
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. user_preferences（用户偏好表）

```sql
CREATE TABLE user_preferences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL,           -- 学生ID
    module_type VARCHAR(50) NOT NULL,          -- 功能模块
    preference_type VARCHAR(50) NOT NULL,      -- 偏好类型(location/environment等)
    preference_value VARCHAR(200) NOT NULL,    -- 偏好值
    frequency INT DEFAULT 1,                   -- 出现频率
    last_mentioned_at TIMESTAMP,               -- 最后提及时间
    UNIQUE KEY (student_id, module_type, preference_type, preference_value)
);
```

## 🔧 API接口说明

### 1. 保存对话并提取偏好

```http
POST /api/preferences/conversation
Content-Type: application/json

{
  "student_id": "2021001",
  "module_type": "studyroom",
  "user_message": "我想找一个靠窗的座位，要安静一点的",
  "ai_response": "好的，我为您找到了..."
}
```

**响应：**
```json
{
  "success": true,
  "data": {
    "conversation_id": 123,
    "extracted_keywords": [
      { "type": "location", "value": "靠窗" },
      { "type": "environment", "value": "安静" }
    ],
    "keywords_count": 2
  }
}
```

### 2. 获取用户偏好摘要

```http
GET /api/preferences/summary/:studentId/:moduleType
```

**响应：**
```json
{
  "success": true,
  "data": {
    "has_preferences": true,
    "summary": "位置偏好：靠窗；环境偏好：安静；设施偏好：有电源",
    "prompt_prefix": "【用户历史偏好】位置偏好：靠窗；环境偏好：安静；设施偏好：有电源。"
  }
}
```

### 3. 获取详细偏好列表

```http
GET /api/preferences/:studentId/:moduleType
```

**响应：**
```json
{
  "success": true,
  "data": {
    "preferences": [...],
    "grouped": {
      "location": [
        { "value": "靠窗", "frequency": 5, "last_mentioned_at": "..." }
      ],
      "environment": [
        { "value": "安静", "frequency": 3, "last_mentioned_at": "..." }
      ]
    },
    "total_count": 8
  }
}
```

### 4. 获取对话历史

```http
GET /api/preferences/history/:studentId/:moduleType?limit=20
```

### 5. 清空偏好

```http
DELETE /api/preferences/:studentId/:moduleType
```

## 💡 关键词提取规则

系统当前支持自动提取以下类型的关键词：

### 位置偏好 (location)
- 靠窗、窗边、角落、门口附近、中间、前排、后排、靠墙、走廊

### 环境偏好 (environment)
- 安静、热闹、明亮、昏暗、通风、温暖、凉爽、独立、开放

### 时间偏好 (time)
- 上午、下午、晚上、早上、中午、深夜、全天

### 设施偏好 (facility)
- 有电源、插座、台灯、空调、WiFi、网络、充电、电脑桌

> 💡 **扩展建议**：可以接入NLP服务（如百度AI、阿里云NLP）进行更智能的实体识别和情感分析

## 🚀 使用流程

### 1. 初始化数据库表

```bash
cd campus-system-backend
node scripts/create-user-preference-table.js
```

### 2. 启动后端服务

```bash
npm start
```

### 3. 测试功能

```bash
node test-user-preference.js
```

### 4. 前端使用

前端AI助手页面已自动集成该功能：

1. **自动检测**：当用户发送包含"自习室"、"座位"、"预约"等关键词的消息时
2. **查询偏好**：自动查询该用户的历史偏好
3. **注入前缀**：如果有偏好，自动在消息前加上偏好摘要
4. **保存历史**：将本次对话保存到数据库，提取新的偏好关键词

## 📊 效果展示

### 没有历史偏好时
```
用户输入: "帮我预约座位"
发送给AI: "帮我预约座位"
```

### 有历史偏好时
```
用户输入: "帮我预约座位"
发送给AI: "【用户历史偏好】位置偏好：靠窗、角落；环境偏好：安静；设施偏好：有电源。帮我预约座位"
```

AI会根据这些偏好信息，优先推荐符合用户习惯的座位。

## 🎨 亮点说明

### 1. **无感知学习**
- 用户无需手动设置偏好
- 系统自动从对话中学习
- 越用越智能

### 2. **轻量级实现**
- 基于关键词匹配，本地处理
- 无需复杂的AI模型
- 响应速度快

### 3. **频率加权**
- 提到越多次的偏好权重越高
- 最近提到的偏好优先级更高
- 自动淘汰过时偏好

### 4. **多模块支持**
- 自习室(studyroom)
- 图书馆(library)  
- 食堂(dining)
- 可扩展到其他场景

### 5. **隐私保护**
- 数据存储在本地数据库
- 用户可随时清空偏好
- 透明可控

## 🔮 未来优化方向

1. **接入NLP服务**
   - 使用专业NLP API进行实体识别
   - 支持同义词识别（如"窗户边"="靠窗"）
   - 情感分析（区分喜欢/不喜欢）

2. **个性化推荐算法**
   - 基于协同过滤推荐相似用户喜欢的座位
   - 时间序列分析（周一喜欢A区，周五喜欢B区）

3. **可视化管理界面**
   - 让用户查看自己的偏好画像
   - 支持手动编辑偏好
   - 偏好统计图表

4. **跨模块学习**
   - 从图书馆借书偏好推断自习室偏好
   - 建立用户整体画像

## 📝 注意事项

1. **关键词维护**：定期review和更新关键词列表
2. **性能优化**：大量用户时考虑缓存策略
3. **数据清理**：定期清理过期的历史记录
4. **测试覆盖**：充分测试各种对话场景

## 🤝 技术支持

如有问题，请查看：
- 测试脚本：`test-user-preference.js`
- 后端路由：`routes/user-preference.js`
- 前端集成：`pages/assistant/index.vue`


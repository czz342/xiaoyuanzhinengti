<template>
  <view v-if="visible" class="ai-assistant">
    <view class="ai-card">
      <view class="ai-header">
        <view class="ai-title-wrapper">
          <text class="ai-title">校园AI助手</text>
        </view>
        <text class="ai-close" @tap="close">×</text>
      </view>
      
      <!-- 分析中 -->
      <view v-if="step === 'analyzing'" class="ai-body center">
        <view class="loading-wrapper">
          <view class="spinner"></view>
          <view class="loading-dots">
            <view class="dot"></view>
            <view class="dot"></view>
            <view class="dot"></view>
          </view>
        </view>
        <text class="ai-tip">正在分析您的校园需求</text>
        <text class="ai-sub-tip">分析最近{{ messageCount }}条对话...</text>
      </view>

      <!-- 分析结果 -->
      <view v-else-if="step === 'result'" class="ai-body">
        <view class="result-header">
          <view class="success-icon">✓</view>
          <text class="result-title">AI 分析完成</text>
        </view>
        
        <!-- 检测到的需求列表 -->
        <view class="needs-list">
          <view 
            v-for="(need, index) in detectedNeeds" 
            :key="index"
            class="need-item-wrapper"
          >
            <!-- 需求信息 -->
            <view class="need-info">
              <view class="need-icon">{{ need.icon }}</view>
              <view class="need-content">
                <text class="need-title">{{ need.title }}</text>
                <text class="need-desc">{{ need.description }}</text>
                <view class="need-confidence">
                  <text class="confidence-label">置信度: </text>
                  <text class="confidence-value">{{ need.confidence }}%</text>
                </view>
              </view>
            </view>
            
            <!-- 双选项按钮（仅对支持AI助手的需求类型显示） -->
            <view v-if="hasAIAssistantSupport(need.type)" class="need-actions">
              <button class="action-btn manual-btn" @tap="handleManualAction(need)">
                📋 手动操作
              </button>
              <button class="action-btn ai-btn" @tap="handleAIAssistantAction(need)">
                🤖 AI助手
              </button>
            </view>
            
            <!-- 单选项按钮（对于其他需求类型） -->
            <view v-else class="need-single-action">
              <button class="action-btn single-btn" @tap="handleNeedTap(need)">
                立即处理 →
              </button>
            </view>
          </view>
        </view>

        <!-- 如果没有检测到明确需求 -->
        <view v-if="detectedNeeds.length === 0" class="no-needs">
          <text class="no-needs-icon">💭</text>
          <text class="no-needs-title">暂未检测到明确的校园服务需求</text>
          <text class="no-needs-desc">您可以尝试更具体地描述您的需要</text>
        </view>
      </view>

      <!-- 错误状态 -->
      <view v-else-if="step === 'error'" class="ai-body center">
        <text class="error-icon">⚠️</text>
        <text class="ai-tip">分析失败</text>
        <text class="ai-sub">{{ errorMsg }}</text>
        <view class="ai-actions">
          <button class="btn ghost" @tap="close">关闭</button>
          <button class="btn primary" @tap="startAnalyze">重试</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from '../../../utils/transformVue'
import { events } from '../../../utils/constants.ts'

// 响应式数据
const visible = ref(false)
const step = ref('analyzing') // analyzing, result, error
const messageCount = ref(0)
const detectedNeeds = ref([])
const errorMsg = ref('')
const chatMessages = ref([])

// 需求类型映射
const needTypes = {
  errand: {
    icon: '🏃',
    title: '跑腿代办',
    route: '/pages/features/errand-service',
    color: '#667eea'
  },
  classroom: {
    icon: '🏫',
    title: '教室预约', 
    route: '/pages/features/classroom',
    color: '#10b981'
  },
  library: {
    icon: '📚',
    title: '图书借阅',
    route: '/pages/features/library', 
    color: '#f59e0b'
  },
  dining: {
    icon: '🍽️',
    title: '食堂服务',
    route: '/pages/features/dining-service',
    color: '#ef4444'
  },
  studyroom: {
    icon: '📖',
    title: '自习室预约',
    route: '/pages/features/studyroom',
    color: '#059669'
  },
  dormitory: {
    icon: '🏠',
    title: '宿舍服务', 
    route: '/pages/features/dormitory-service',
    color: '#8b5cf6'
  }
}

// 打开助手面板
const open = (messages) => {
  console.log('🤖 AI助手被打开，接收到消息:', messages?.length || 0)
  
  try {
    // 将MobX响应式对象转换为普通对象
    const plainMessages = (messages || []).map(msg => {
      try {
        return {
          type: msg.type || '',
          body: msg.body || '',
          from: msg.from || '',
          time: msg.time || 0
        }
      } catch (e) {
        console.warn('⚠️ 消息序列化失败:', e.message)
        return null
      }
    }).filter(Boolean)
    
    console.log('📝 序列化后的消息:', plainMessages.length, '条')
    console.log('消息内容预览:', plainMessages.slice(0, 3))
    
    chatMessages.value = plainMessages
    messageCount.value = Math.min(chatMessages.value.length, 10) // 最多分析10条
    visible.value = true
    step.value = 'analyzing'
    
    // 延迟一下确保界面已显示
    setTimeout(() => {
      startAnalyze()
    }, 100)
  } catch (e) {
    console.error('💥 打开AI助手失败:', e)
    uni.showToast({
      title: '打开AI助手失败',
      icon: 'none'
    })
  }
}

// 关闭助手面板
const close = () => {
  visible.value = false
  step.value = 'analyzing'
  detectedNeeds.value = []
  errorMsg.value = ''
}

// 开始分析
const startAnalyze = async () => {
  try {
    console.log('🔍 开始AI分析...')
    step.value = 'analyzing'
    
    // 准备要分析的对话文本
    const recentMessages = chatMessages.value.slice(-10) // 取最近10条消息
    console.log('📝 处理消息:', recentMessages.length, '条')
    
    const conversationText = recentMessages.map(msg => {
      // 现在msg已经是序列化后的普通对象，可以安全访问
      if (msg.type === 'text' && msg.body) {
        console.log('✅ 文本消息:', msg.body.substring(0, 50) + '...')
        return msg.body
      }
      return ''
    }).filter(text => text.trim()).join('\n')

    console.log('📄 对话文本长度:', conversationText.length)
    console.log('📄 对话内容:', conversationText.substring(0, 200) + '...')

    if (!conversationText.trim()) {
      throw new Error('没有可分析的文本内容')
    }

    const token = uni.getStorageSync('token')
    if (!token) throw new Error('请先登录')

    console.log('🌐 发送网络请求...')
    const res = await uni.request({
      url: 'http://localhost:3000/api/ai-universal/analyze-campus-needs',
      method: 'POST',
      header: { 'Authorization': `Bearer ${token}` },
      data: { conversation: conversationText }
    })

    console.log('📡 收到响应:', res.statusCode, res.data)
    
    const resData = res.data
    if (res.statusCode === 200 && resData && resData.success) {
      const needs = resData.data.needs || []
      console.log('🎯 检测到需求:', needs.length, '个')
      
      detectedNeeds.value = needs.map(need => ({
        ...need,
        ...needTypes[need.type],
        originalData: need.extractedData
      }))
      step.value = 'result'
    } else {
      console.error('❌ API返回错误:', resData)
      throw new Error(resData?.message || 'AI分析失败')
    }
  } catch (e) {
    console.error('💥 AI分析异常:', e)
    errorMsg.value = e?.message || 'AI服务异常'
    step.value = 'error'
  }
}

// 检查是否支持AI助手
const hasAIAssistantSupport = (needType) => {
  return ['classroom', 'library', 'studyroom'].includes(needType)
}

// 处理手动操作（跳转到传统页面）
const handleManualAction = (need) => {
  console.log('🔧 用户选择手动操作:', need.title)
  handleNeedTap(need) // 使用原有的跳转逻辑
}

// 处理AI助手操作（跳转到AI助手页面）
const handleAIAssistantAction = (need) => {
  console.log('🤖 用户选择AI助手:', need.title)
  
  try {
    // 生成用户需求总结文本
    const summaryText = generateNeedSummary(need)
    console.log('📝 生成需求总结:', summaryText)
    
    // 关闭当前面板
    close()
    
    // 跳转到AI助手页面，并传递需求总结
    uni.navigateTo({
      url: `/pages/assistant/index?from=chat_analysis&type=${need.type}&summary=${encodeURIComponent(summaryText)}`
    })
  } catch (e) {
    console.error('❌ 跳转AI助手页面失败:', e)
    uni.showToast({
      title: '跳转失败',
      icon: 'none'
    })
  }
}

// 生成需求总结文本
const generateNeedSummary = (need) => {
  let summary = `用户需求：${need.title}\n`
  summary += `详细描述：${need.description}\n`
  summary += `置信度：${need.confidence}%\n\n`
  
  // 添加原始对话内容
  const originalConversation = chatMessages.value.map(msg => {
    if (msg.type === 'text' && msg.body) {
      return msg.body
    }
    return ''
  }).filter(text => text.trim()).join('\n')
  
  if (originalConversation) {
    summary += `原始对话内容：\n${originalConversation}\n\n`
  }
  
  // 根据需求类型添加AI提取的特定信息
  if (need.originalData) {
    summary += `AI提取的关键信息：\n`
    const data = need.originalData
    
    // 通用信息提取 - 中文字段名映射
    const fieldNameMap = {
      'room_type': '房间类型',
      'date': '日期',
      'time': '时间',
      'duration': '时长',
      'purpose': '目的',
      'participants': '参与人数',
      'equipment_needed': '所需设备',
      'requirements': '特殊要求',
      'environment': '环境要求',
      'service_type': '服务类型',
      'pickup_location': '取件地点',
      'delivery_location': '送达地点',
      'pickup_code': '取件码',
      'special_notes': '备注',
      'book_title': '图书名称',
      'author': '作者',
      'category': '分类',
      'return_date': '归还日期',
      'action': '操作类型',
      'book_info': '图书信息',
      'time_preference': '时间偏好',
      'special_needs': '特殊需求',
      'meal_type': '餐食类型',
      'location': '地点',
      'special_request': '特殊要求',
      'dietary_requirements': '饮食要求',
      'issue_type': '问题类型',
      'room_location': '房间位置',
      'urgency': '紧急程度',
      'description': '详细描述',
      'contact_info': '联系方式'
    }
    
    Object.keys(data).forEach(key => {
      if (data[key] && typeof data[key] === 'string') {
        const chineseName = fieldNameMap[key] || key.replace(/_/g, ' ')
        summary += `- ${chineseName}: ${data[key]}\n`
      }
    })
    
    // 根据需求类型添加特定信息格式化
    switch (need.type) {
      case 'classroom':
        if (data.time) summary += `- 预约时间：${data.time}\n`
        if (data.duration) summary += `- 使用时长：${data.duration}\n`
        if (data.participants) summary += `- 参与人数：${data.participants}\n`
        if (data.purpose) summary += `- 使用目的：${data.purpose}\n`
        if (data.requirements) summary += `- 特殊要求：${data.requirements}\n`
        break
      case 'library':
        if (data.book_title) summary += `- 图书名称：${data.book_title}\n`
        if (data.author) summary += `- 作者：${data.author}\n`
        if (data.category) summary += `- 分类：${data.category}\n`
        if (data.return_date) summary += `- 预计归还日期：${data.return_date}\n`
        break
      case 'studyroom':
        if (data.time) summary += `- 预约时间：${data.time}\n`
        if (data.duration) summary += `- 使用时长：${data.duration}\n`
        if (data.participants) summary += `- 使用人数：${data.participants}\n`
        if (data.equipment) summary += `- 所需设备：${data.equipment}\n`
        if (data.environment) summary += `- 环境要求：${data.environment}\n`
        break
    }
  }
  
  summary += `\n请根据以上信息帮我完成${need.title}，特别注意原始对话中的所有细节和要求。`
  
  return summary.trim()
}

// 处理需求点击
const handleNeedTap = (need) => {
  console.log('🎯 用户点击需求:', need)
  console.log('📊 需求数据:', {
    type: need.type,
    title: need.title,
    originalData: need.originalData
  })
  
  // 保存分析数据到本地存储
  if (need.originalData) {
    const storageKey = `${need.type}_ai_data`
    console.log('💾 保存数据到本地存储，Key:', storageKey)
    console.log('💾 保存的数据:', need.originalData)
    
    uni.setStorageSync(storageKey, need.originalData)
    
    // 验证保存是否成功
    const savedData = uni.getStorageSync(storageKey)
    console.log('✅ 验证保存结果:', savedData)
  } else {
    console.warn('⚠️ 需求没有originalData，无法保存到本地存储')
  }
  
  // 关闭面板
  close()
  
  // 跳转到对应页面
  const route = need.route || needTypes[need.type]?.route
  console.log('🔗 准备跳转到:', route)
  
  if (route) {
    uni.navigateTo({
      url: `${route}?from=ai_assistant`
    })
  } else {
    console.error('❌ 无法找到对应的路由')
    uni.showToast({
      title: '该功能暂未开放',
      icon: 'none'
    })
  }
}

// 生命周期
onMounted(() => {
  console.log('🎯 UniversalAIAssistant 组件已挂载，开始监听事件:', events.OPEN_AI_ASSISTANT)
  uni.$on(events.OPEN_AI_ASSISTANT, open)
  
  // 测试事件系统是否正常工作
  console.log('🧪 测试uni.$emit是否存在:', typeof uni.$emit)
  console.log('🧪 测试uni.$on是否存在:', typeof uni.$on)
})

onUnmounted(() => {
  console.log('🔚 UniversalAIAssistant 组件卸载，停止监听事件')
  uni.$off(events.OPEN_AI_ASSISTANT, open)
})
</script>

<style scoped>
/* 主容器 */
.ai-assistant {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 主卡片 */
.ai-card {
  width: 100%;
  max-width: 640rpx;
  background: linear-gradient(135deg, #ffffff 0%, #f8faff 100%);
  border-radius: 24rpx;
  box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.15);
  padding: 32rpx;
  max-height: 80vh;
  overflow-y: auto;
  animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(60rpx) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 头部 */
.ai-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
  padding-bottom: 20rpx;
  border-bottom: 2rpx solid #f0f3ff;
}

.ai-title {
  font-weight: 600;
  font-size: 32rpx;
  color: #1f2937;
  letter-spacing: 1rpx;
}

.ai-close {
  font-size: 48rpx;
  color: #9ca3af;
  padding: 0 12rpx;
  line-height: 1;
  transition: all 0.2s;
}

.ai-close:active {
  color: #667eea;
  transform: scale(0.85) rotate(90deg);
}

/* 主体内容 */
.ai-body {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.ai-body.center {
  align-items: center;
  padding: 32rpx 0;
}

/* 加载动画 */
.loading-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20rpx;
}

.spinner {
  width: 72rpx;
  height: 72rpx;
  border: 8rpx solid rgba(102, 126, 234, 0.15);
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-dots {
  position: absolute;
  display: flex;
  gap: 12rpx;
  bottom: -48rpx;
}

.dot {
  width: 12rpx;
  height: 12rpx;
  background: #667eea;
  border-radius: 50%;
  animation: dotPulse 1.4s ease-in-out infinite;
}

.dot:nth-child(2) { animation-delay: 0.2s; }
.dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes dotPulse {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.ai-tip {
  font-size: 30rpx;
  color: #1f2937;
  font-weight: 500;
  text-align: center;
}

.ai-sub-tip {
  font-size: 24rpx;
  color: #9ca3af;
  text-align: center;
  margin-top: -8rpx;
}

/* 成功状态 */
.result-header {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 24rpx;
  padding: 20rpx;
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  border-radius: 16rpx;
}

.success-icon {
  width: 48rpx;
  height: 48rpx;
  background: #10b981;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  font-weight: bold;
  animation: successPop 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes successPop {
  0% { transform: scale(0); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.result-title {
  font-size: 32rpx;
  color: #065f46;
  font-weight: 600;
}

/* 需求列表 */
.needs-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.need-item-wrapper {
  background: #ffffff;
  border-radius: 16rpx;
  padding: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
  border: 2rpx solid #f0f3ff;
  margin-bottom: 16rpx;
}

.need-info {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 16rpx;
}

.need-actions {
  display: flex;
  gap: 12rpx;
  justify-content: center;
}

.need-single-action {
  display: flex;
  justify-content: center;
}

.action-btn {
  flex: 1;
  height: 72rpx;
  border-radius: 12rpx;
  border: none;
  font-size: 26rpx;
  font-weight: 500;
  transition: all 0.2s;
}

.manual-btn {
  background: #f8fafc;
  color: #475569;
  border: 2rpx solid #e2e8f0;
}

.manual-btn:active {
  background: #f1f5f9;
  transform: scale(0.98);
}

.ai-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
}

.ai-btn:active {
  transform: scale(0.98);
  opacity: 0.9;
}

.single-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  min-width: 200rpx;
}

.single-btn:active {
  transform: scale(0.98);
  opacity: 0.9;
}

.need-icon {
  font-size: 48rpx;
  line-height: 1;
  min-width: 48rpx;
}

.need-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.need-title {
  font-size: 30rpx;
  color: #1f2937;
  font-weight: 600;
}

.need-desc {
  font-size: 26rpx;
  color: #6b7280;
  line-height: 1.5;
}

.need-confidence {
  display: flex;
  align-items: center;
  margin-top: 8rpx;
}

.confidence-label {
  font-size: 22rpx;
  color: #9ca3af;
}

.confidence-value {
  font-size: 22rpx;
  color: #059669;
  font-weight: 500;
}

.need-arrow {
  font-size: 32rpx;
  color: #667eea;
  font-weight: bold;
}

/* 无需求状态 */
.no-needs {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
  padding: 40rpx 20rpx;
  text-align: center;
}

.no-needs-icon {
  font-size: 80rpx;
  opacity: 0.5;
}

.no-needs-title {
  font-size: 28rpx;
  color: #6b7280;
  font-weight: 500;
}

.no-needs-desc {
  font-size: 24rpx;
  color: #9ca3af;
  line-height: 1.5;
}

/* 错误状态 */
.error-icon {
  font-size: 80rpx;
  text-align: center;
  margin: 20rpx 0;
}

.ai-sub {
  font-size: 26rpx;
  color: #6b7280;
  text-align: center;
  line-height: 1.5;
}

/* 按钮 */
.ai-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16rpx;
  margin-top: 12rpx;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  padding: 20rpx 32rpx;
  border-radius: 16rpx;
  font-size: 28rpx;
  font-weight: 500;
  border: none;
  transition: all 0.2s;
}

.btn:active {
  transform: scale(0.96);
}

.btn.ghost {
  background: #f3f4f6;
  color: #6b7280;
}

.btn.ghost:active {
  background: #e5e7eb;
}

.btn.primary {
  background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
  color: #ffffff;
  box-shadow: 0 8rpx 20rpx rgba(79, 70, 229, 0.35);
}

.btn.primary:active {
  box-shadow: 0 4rpx 12rpx rgba(79, 70, 229, 0.4);
}
</style>

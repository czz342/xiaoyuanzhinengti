<template>
  <view v-if="visible" class="ai-panel" :class="step">
    <view class="ai-card">
      <view class="ai-header">
        <view class="ai-title-wrapper">
          <text class="ai-title">AI助手</text>
        </view>
        <text class="ai-close" @tap="close">×</text>
      </view>
      <view v-if="step==='prompt'" class="ai-body">
        <view class="detect-badge">
          <text class="badge-icon">✨</text>
          <text class="badge-text">AI检测到此可能是一个跑腿需求</text>
        </view>
        <view class="ai-msg">{{ msgText }}</view>
        <text class="ai-sub">是否需要解析并生成跑腿代办？</text>
        <view class="ai-actions">
          <button class="btn ghost" @tap="close">取消</button>
          <button class="btn primary" @tap="analyze">解析并生成</button>
        </view>
      </view>
      <view v-else-if="step==='loading'" class="ai-body center">
        <view class="loading-wrapper">
          <view class="spinner"></view>
          <view class="loading-dots">
            <view class="dot"></view>
            <view class="dot"></view>
            <view class="dot"></view>
          </view>
        </view>
        <text class="ai-tip">正在智能分析您的需求</text>
        <text class="ai-sub-tip">请稍候...</text>
      </view>
      <view v-else-if="step==='result'" class="ai-body">
        <view class="result-header">
          <view class="success-icon">✓</view>
          <text class="result-title">AI 解析完成</text>
        </view>
        <view class="ai-summary">
          <view class="summary-item">
            <view class="item-icon type">📦</view>
            <view class="item-content">
              <text class="item-label">服务类型</text>
              <text class="item-value">{{ serviceTypeName(parsed.service_type) }}</text>
            </view>
          </view>
          <view class="summary-item" v-if="parsed.title">
            <view class="item-icon title">📌</view>
            <view class="item-content">
              <text class="item-label">任务标题</text>
              <text class="item-value">{{ parsed.title }}</text>
            </view>
          </view>
          <view class="summary-item" v-if="parsed.description">
            <view class="item-icon desc">📝</view>
            <view class="item-content">
              <text class="item-label">详细描述</text>
              <text class="item-value">{{ parsed.description }}</text>
            </view>
          </view>
          <view class="summary-item" v-if="parsed.pickup_location">
            <view class="item-icon pickup">📍</view>
            <view class="item-content">
              <text class="item-label">取件地点</text>
              <text class="item-value">{{ parsed.pickup_location }}</text>
            </view>
          </view>
          <view class="summary-item" v-if="parsed.delivery_location">
            <view class="item-icon delivery">🎯</view>
            <view class="item-content">
              <text class="item-label">送达地点</text>
              <text class="item-value">{{ parsed.delivery_location }}</text>
            </view>
          </view>
        </view>
        <view class="ai-actions">
          <button class="btn ghost" @tap="close">稍后再说</button>
          <button class="btn primary" @tap="goPublish">
            <text class="btn-icon">🚀</text>
            <text>去发布订单</text>
          </button>
        </view>
      </view>
      <view v-else-if="step==='error'" class="ai-body">
        <view class="error-icon">⚠️</view>
        <text class="ai-tip">AI 服务暂时不可用</text>
        <text class="ai-sub">{{ errorMsg }}</text>
        <view class="ai-actions">
          <button class="btn ghost" @tap="close">取消</button>
          <button class="btn primary" @tap="goPublish">直接去发布</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from '../../../utils/transformVue'
import { events } from '../../../utils/constants'

const visible = ref(false)
const step = ref<'prompt'|'loading'|'result'|'error'>('prompt')
const msgText = ref('')
const parsed = ref<any>({})
const errorMsg = ref('')

const open = (payload: any) => {
  msgText.value = payload?.text || ''
  visible.value = true
  step.value = 'prompt'
  parsed.value = {}
  errorMsg.value = ''
}
const close = () => {
  visible.value = false
  uni.$emit(events.CLOSE_AI_ASSIST)
}

const serviceTypeName = (t: string) => {
  const map: any = { takeout: '外卖代拿', express: '快递代取', other: '小事代办' }
  return map[t] || '小事代办'
}

const analyze = async () => {
  try {
    step.value = 'loading'
    const token = uni.getStorageSync('token')
    if (!token) throw new Error('请先登录')
    const res = await uni.request({
      url: 'http://localhost:3000/api/nlp/parse-errand-from-text',
      method: 'POST',
      header: { 'Authorization': `Bearer ${token}` },
      data: { text: msgText.value }
    })
    const resData = res.data as any
    if (res.statusCode === 200 && resData && resData.success) {
      parsed.value = resData.data || {}
      if ((parsed.value as any).error) {
        parsed.value = { service_type: 'other', description: msgText.value }
      }
      step.value = 'result'
    } else {
      throw new Error((resData && resData.message) || 'AI解析失败')
    }
  } catch (e: any) {
    errorMsg.value = e?.message || 'AI服务异常'
    step.value = 'error'
  }
}

const goPublish = () => {
  try {
    uni.setStorageSync('errand_preparsed', parsed.value)
  } catch(e) {}
  const url = `/pages/features/errand-service?from=im&text=${encodeURIComponent(msgText.value)}`
  uni.navigateTo({ url })
  visible.value = false
}

onMounted(() => {
  uni.$on(events.OPEN_AI_ASSIST, open)
})

onUnmounted(() => {
  uni.$off(events.OPEN_AI_ASSIST, open)
})
</script>

<style scoped>
/* 主面板容器 - 带滑入动画 */
.ai-panel {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 160rpx;
  z-index: 999;
  display: flex;
  justify-content: center;
  padding: 0 24rpx;
  pointer-events: none;
  animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(60rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 主卡片 - 渐变背景 + 阴影 */
.ai-card {
  width: 100%;
  max-width: 680rpx;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);
  border-radius: 24rpx;
  box-shadow: 0 16rpx 48rpx rgba(102, 126, 234, 0.18), 
              0 8rpx 16rpx rgba(0, 0, 0, 0.06);
  padding: 32rpx;
  pointer-events: auto;
  border: 2rpx solid rgba(102, 126, 234, 0.12);
}

/* 头部样式 */
.ai-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
  padding-bottom: 20rpx;
  border-bottom: 2rpx solid rgba(102, 126, 234, 0.1);
}

.ai-title-wrapper {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.ai-icon {
  font-size: 40rpx;
  line-height: 1;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4rpx);
  }
}

.ai-title {
  font-weight: 600;
  font-size: 32rpx;
  color: #2d3748;
  letter-spacing: 1rpx;
}

.ai-close {
  font-size: 48rpx;
  color: #a0aec0;
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

/* 检测徽章 - 亮色醒目 */
.detect-badge {
  display: flex;
  align-items: center;
  gap: 12rpx;
  background: linear-gradient(135deg, #fff7e6 0%, #ffedd5 100%);
  border: 2rpx solid #fbbf24;
  border-radius: 16rpx;
  padding: 16rpx 20rpx;
  animation: glow 2s ease-in-out infinite;
}

@keyframes glow {
  0%, 100% {
    box-shadow: 0 0 8rpx rgba(251, 191, 36, 0.3);
  }
  50% {
    box-shadow: 0 0 20rpx rgba(251, 191, 36, 0.5);
  }
}

.badge-icon {
  font-size: 28rpx;
  animation: twinkle 1.5s ease-in-out infinite;
}

@keyframes twinkle {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

.badge-text {
  font-size: 26rpx;
  color: #b45309;
  font-weight: 500;
}

/* 消息内容 - 清新蓝色渐变 */
.ai-msg {
  background: linear-gradient(135deg, #e0e7ff 0%, #dbeafe 100%);
  border-left: 6rpx solid #667eea;
  border-radius: 12rpx;
  padding: 20rpx 24rpx;
  color: #374151;
  font-size: 28rpx;
  line-height: 1.7;
  word-break: break-all;
}

.ai-tip {
  font-size: 30rpx;
  color: #1f2937;
  font-weight: 500;
  text-align: center;
}

.ai-sub {
  font-size: 26rpx;
  color: #6b7280;
  text-align: center;
  line-height: 1.5;
}

.ai-sub-tip {
  font-size: 24rpx;
  color: #9ca3af;
  text-align: center;
  margin-top: -8rpx;
}

/* 加载动画 - 优化版 */
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
  to {
    transform: rotate(360deg);
  }
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

.dot:nth-child(2) {
  animation-delay: 0.2s;
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
}

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

/* 结果页面 - 成功状态 */
.result-header {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 20rpx;
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
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.result-title {
  font-size: 32rpx;
  color: #065f46;
  font-weight: 600;
}

/* AI 解析摘要 - 卡片列表 */
.ai-summary {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.summary-item {
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
  background: #ffffff;
  border-radius: 12rpx;
  padding: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
  border: 2rpx solid rgba(102, 126, 234, 0.08);
  transition: all 0.2s;
}

.summary-item:active {
  transform: scale(0.98);
  box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.12);
}

.item-icon {
  font-size: 36rpx;
  line-height: 1;
  min-width: 36rpx;
}

.item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.item-label {
  font-size: 24rpx;
  color: #9ca3af;
  font-weight: 500;
}

.item-value {
  font-size: 28rpx;
  color: #1f2937;
  line-height: 1.6;
  word-break: break-all;
}

/* 错误图标 */
.error-icon {
  font-size: 80rpx;
  text-align: center;
  margin: 20rpx 0;
}

/* 按钮组 */
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
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
}

.btn:active {
  transform: scale(0.96);
}

.btn.ghost {
  background: #f3f4f6;
  color: #6b7280;
  box-shadow: none;
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

.btn-icon {
  font-size: 28rpx;
  line-height: 1;
}
</style>

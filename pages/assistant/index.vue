<template>
	<view class="assistant-page">
		<!-- 聊天窗口 -->
		<scroll-view scroll-y="true" class="chat-container" :scroll-top="scrollTop" :scroll-with-animation="!isUserScrolling" @scrolltoupper="loadMoreMessages" @scroll="handleScroll">
			<view class="chat-list">
				<view v-for="(msg, index) in chatMessages" :key="index">
					<!-- 🎯 新增：偏好分析块（嵌入式展示） - 升级版带AI思考过程 -->
					<view v-if="msg.type === 'preference_analysis'" class="preference-analysis-container">
						<view class="analysis-header">
							<text class="analysis-title">AI 偏好分析</text>
							<view class="header-actions">
								<view class="collapse-btn" @click="togglePreferenceVisibility(index)">
									<text class="collapse-text">{{ msg.isVisible ? '收起' : '展开' }}</text>
									<text class="collapse-icon">{{ msg.isVisible ? '▲' : '▼' }}</text>
								</view>
							</view>
						</view>
						
						<view v-if="msg.isVisible" class="analysis-content">
							<!-- AI深度分析过程（类似大模型thinking） -->
							<view class="ai-thinking">
								<view class="thinking-header">
									<view class="thinking-indicator">
										<view class="thinking-dot"></view>
										<view class="thinking-dot"></view>
										<view class="thinking-dot"></view>
									</view>
									<text class="thinking-title">AI 深度分析中</text>
								</view>
								
								<!-- 思考过程详细展示 -->
								<view class="thinking-content">
									<view v-for="(step, index) in msg.analysisSteps" :key="step.id" 
									      class="thinking-step" 
									      :class="{ 'step-active': step.status === 'loading', 'step-done': step.status === 'complete' }">
										<view class="step-header">
											<view class="step-status">
												<view v-if="step.status === 'loading'" class="status-spinner"></view>
												<text v-else-if="step.status === 'complete'" class="status-check">✓</text>
												<text v-else class="status-dot">·</text>
											</view>
											<text class="step-title">{{ step.label }}</text>
										</view>
										<view v-if="step.status === 'loading' || step.status === 'complete'" class="step-detail">
											<text class="detail-text">{{ step.detailText }}</text>
										</view>
									</view>
								</view>
								
								<!-- 分析完成后的详细结果 -->
								<view v-if="msg.analysisStage === 'complete'" class="analysis-result">
									<!-- 数据统计 -->
									<view class="result-stats">
										<view class="stats-header">
											<text class="stats-icon">📊</text>
											<text class="stats-title">分析统计</text>
										</view>
										<view class="stats-grid">
											<view class="stat-card">
												<text class="stat-value">{{ msg.totalCount || 0 }}</text>
												<text class="stat-label">条历史对话</text>
											</view>
											<view class="stat-card">
												<text class="stat-value">{{ getPreferenceCount(msg.preferences) }}</text>
												<text class="stat-label">个偏好维度</text>
											</view>
											<view class="stat-card">
												<text class="stat-value">{{ getTotalKeywords(msg.preferences) }}</text>
												<text class="stat-label">个关键特征</text>
											</view>
										</view>
									</view>
									
									<!-- AI洞察 -->
									<view class="result-insight">
										<view class="insight-header">
											<text class="insight-icon">💡</text>
											<text class="insight-title">智能洞察</text>
										</view>
										<text class="insight-content">{{ msg.insight }}</text>
									</view>
									
									<!-- 分析方法说明 -->
									<view class="result-methodology">
										<view class="method-header">
											<text class="method-icon">🔬</text>
											<text class="method-title">分析方法</text>
										</view>
										<text class="method-text">本次分析采用自然语言处理技术，通过关键词提取、语义分析和模式识别算法，从用户历史对话中自动学习偏好特征。系统使用TF-IDF算法计算关键词权重，结合用户行为频次进行偏好强度量化，最终生成个性化推荐策略。</text>
									</view>
								</view>
							</view>
							
							<!-- 错误提示 -->
							<view v-if="msg.analysisStage === 'error'" class="analysis-error">
								<text class="error-text">{{ msg.insight || '分析过程中遇到错误' }}</text>
							</view>
							
							<!-- 图书推荐偏好 -->
							<template v-if="msg.moduleType === 'book' || msg.moduleType === 'library'">
								<!-- 如果没有历史偏好数据，显示提示 -->
								<view v-if="!msg.hasData" class="pref-empty">
									<text class="empty-text">暂无历史偏好数据，系统将从本次对话开始学习您的偏好</text>
								</view>
								
								<!-- 学科偏好 -->
								<view v-if="msg.preferences.subject && msg.preferences.subject.length > 0" class="pref-category fade-in">
									<view class="category-title">
										<text class="category-icon">📚</text>
										<text class="category-text">学科偏好</text>
									</view>
									<view class="pref-tags">
										<view v-for="item in msg.preferences.subject" :key="item.value" class="pref-tag-item subject">
											<view class="tag-info">
												<text class="tag-name">{{item.value}}</text>
												<text class="tag-count">×{{item.frequency}}</text>
											</view>
											<view class="tag-heatbar">
												<view class="heatbar-fill" :style="{ width: calculateHeatPercent(item.frequency, msg.preferences.subject) + '%' }"></view>
											</view>
										</view>
									</view>
								</view>
								
								<!-- 图书类型偏好 -->
								<view v-if="msg.preferences.book_type && msg.preferences.book_type.length > 0" class="pref-category fade-in">
									<view class="category-title">
										<text class="category-icon">📖</text>
										<text class="category-text">图书类型</text>
									</view>
									<view class="pref-tags">
										<view v-for="item in msg.preferences.book_type" :key="item.value" class="pref-tag-item book-type">
											<view class="tag-info">
												<text class="tag-name">{{item.value}}</text>
												<text class="tag-count">×{{item.frequency}}</text>
											</view>
											<view class="tag-heatbar">
												<view class="heatbar-fill" :style="{ width: calculateHeatPercent(item.frequency, msg.preferences.book_type) + '%' }"></view>
											</view>
										</view>
									</view>
								</view>
								
								<!-- 阅读周期偏好 -->
								<view v-if="msg.preferences.reading_cycle && msg.preferences.reading_cycle.length > 0" class="pref-category fade-in">
									<view class="category-title">
										<text class="category-icon">⏰</text>
										<text class="category-text">阅读周期</text>
									</view>
									<view class="pref-tags">
										<view v-for="item in msg.preferences.reading_cycle" :key="item.value" class="pref-tag-item reading-cycle">
											<view class="tag-info">
												<text class="tag-name">{{item.value}}</text>
												<text class="tag-count">×{{item.frequency}}</text>
											</view>
											<view class="tag-heatbar">
												<view class="heatbar-fill" :style="{ width: calculateHeatPercent(item.frequency, msg.preferences.reading_cycle) + '%' }"></view>
											</view>
										</view>
									</view>
								</view>
								
								<!-- 借阅时机偏好 -->
								<view v-if="msg.preferences.borrow_timing && msg.preferences.borrow_timing.length > 0" class="pref-category fade-in">
									<view class="category-title">
										<text class="category-icon">📅</text>
										<text class="category-text">借阅时机</text>
									</view>
									<view class="pref-tags">
										<view v-for="item in msg.preferences.borrow_timing" :key="item.value" class="pref-tag-item borrow-timing">
											<view class="tag-info">
												<text class="tag-name">{{item.value}}</text>
												<text class="tag-count">×{{item.frequency}}</text>
											</view>
											<view class="tag-heatbar">
												<view class="heatbar-fill" :style="{ width: calculateHeatPercent(item.frequency, msg.preferences.borrow_timing) + '%' }"></view>
											</view>
										</view>
									</view>
								</view>
								
								<!-- 作者偏好 -->
								<view v-if="msg.preferences.author && msg.preferences.author.length > 0" class="pref-category fade-in">
									<view class="category-title">
										<text class="category-icon">✍️</text>
										<text class="category-text">作者偏好</text>
									</view>
									<view class="pref-tags">
										<view v-for="item in msg.preferences.author" :key="item.value" class="pref-tag-item author">
											<view class="tag-info">
												<text class="tag-name">{{item.value}}</text>
												<text class="tag-count">×{{item.frequency}}</text>
											</view>
											<view class="tag-heatbar">
												<view class="heatbar-fill" :style="{ width: calculateHeatPercent(item.frequency, msg.preferences.author) + '%' }"></view>
											</view>
										</view>
									</view>
								</view>
								
								<view v-if="msg.hasData" class="analysis-tip">
									<text>💡 AI会根据以上偏好为您优先推荐符合条件的图书</text>
								</view>
							</template>
							
							<!-- 教室预约偏好 -->
							<template v-else-if="msg.moduleType === 'classroom'">
								<!-- 如果没有历史偏好数据，显示提示 -->
								<view v-if="!msg.hasData" class="pref-empty">
									<text class="empty-text">暂无历史偏好数据，系统将从本次对话开始学习您的偏好</text>
								</view>
								
								<!-- 设备需求偏好 -->
								<view v-if="msg.preferences.equipment && msg.preferences.equipment.length > 0" class="pref-category fade-in">
									<view class="category-title">
										<text class="category-icon">🖥️</text>
										<text class="category-text">设备需求</text>
									</view>
									<view class="pref-tags">
										<view v-for="item in msg.preferences.equipment" :key="item.value" class="pref-tag-item equipment">
											<view class="tag-info">
												<text class="tag-name">{{item.value}}</text>
												<text class="tag-count">×{{item.frequency}}</text>
											</view>
											<view class="tag-heatbar">
												<view class="heatbar-fill" :style="{ width: calculateHeatPercent(item.frequency, msg.preferences.equipment) + '%' }"></view>
											</view>
										</view>
									</view>
								</view>
								
								<!-- 楼层偏好 -->
								<view v-if="msg.preferences.floor && msg.preferences.floor.length > 0" class="pref-category fade-in">
									<view class="category-title">
										<text class="category-icon">🏢</text>
										<text class="category-text">楼层偏好</text>
									</view>
									<view class="pref-tags">
										<view v-for="item in msg.preferences.floor" :key="item.value" class="pref-tag-item floor">
											<view class="tag-info">
												<text class="tag-name">{{item.value}}</text>
												<text class="tag-count">×{{item.frequency}}</text>
											</view>
											<view class="tag-heatbar">
												<view class="heatbar-fill" :style="{ width: calculateHeatPercent(item.frequency, msg.preferences.floor) + '%' }"></view>
											</view>
										</view>
									</view>
								</view>
								
								<!-- 容量需求偏好 -->
								<view v-if="msg.preferences.capacity && msg.preferences.capacity.length > 0" class="pref-category fade-in">
									<view class="category-title">
										<text class="category-icon">👥</text>
										<text class="category-text">容量需求</text>
									</view>
									<view class="pref-tags">
										<view v-for="item in msg.preferences.capacity" :key="item.value" class="pref-tag-item capacity">
											<view class="tag-info">
												<text class="tag-name">{{item.value}}</text>
												<text class="tag-count">×{{item.frequency}}</text>
											</view>
											<view class="tag-heatbar">
												<view class="heatbar-fill" :style="{ width: calculateHeatPercent(item.frequency, msg.preferences.capacity) + '%' }"></view>
											</view>
										</view>
									</view>
								</view>
								
								<view v-if="msg.hasData" class="analysis-tip">
									<text>💡 AI会根据以上偏好为您优先推荐符合条件的教室</text>
								</view>
							</template>
							
							<!-- 自习室预约偏好 -->
							<template v-else>
								<!-- 如果没有历史偏好数据，显示提示 -->
								<view v-if="!msg.hasData" class="pref-empty">
									<text class="empty-text">暂无历史偏好数据，系统将从本次对话开始学习您的偏好</text>
								</view>
								
								<!-- 位置偏好 -->
								<view v-if="msg.preferences.location && msg.preferences.location.length > 0" class="pref-category fade-in">
									<view class="category-title">
										<text class="category-icon">📍</text>
										<text class="category-text">位置偏好</text>
									</view>
									<view class="pref-tags">
										<view v-for="item in msg.preferences.location" :key="item.value" class="pref-tag-item location">
											<view class="tag-info">
												<text class="tag-name">{{item.value}}</text>
												<text class="tag-count">×{{item.frequency}}</text>
											</view>
											<view class="tag-heatbar">
												<view class="heatbar-fill" :style="{ width: calculateHeatPercent(item.frequency, msg.preferences.location) + '%' }"></view>
											</view>
										</view>
									</view>
								</view>
								
								<!-- 环境偏好 -->
								<view v-if="msg.preferences.environment && msg.preferences.environment.length > 0" class="pref-category fade-in">
									<view class="category-title">
										<text class="category-icon">🌟</text>
										<text class="category-text">环境偏好</text>
									</view>
									<view class="pref-tags">
										<view v-for="item in msg.preferences.environment" :key="item.value" class="pref-tag-item environment">
											<view class="tag-info">
												<text class="tag-name">{{item.value}}</text>
												<text class="tag-count">×{{item.frequency}}</text>
											</view>
											<view class="tag-heatbar">
												<view class="heatbar-fill" :style="{ width: calculateHeatPercent(item.frequency, msg.preferences.environment) + '%' }"></view>
											</view>
										</view>
									</view>
								</view>
								
								<!-- 设施偏好 -->
								<view v-if="msg.preferences.facility && msg.preferences.facility.length > 0" class="pref-category fade-in">
									<view class="category-title">
										<text class="category-icon">🔌</text>
										<text class="category-text">设施偏好</text>
									</view>
									<view class="pref-tags">
										<view v-for="item in msg.preferences.facility" :key="item.value" class="pref-tag-item facility">
											<view class="tag-info">
												<text class="tag-name">{{item.value}}</text>
												<text class="tag-count">×{{item.frequency}}</text>
											</view>
											<view class="tag-heatbar">
												<view class="heatbar-fill" :style="{ width: calculateHeatPercent(item.frequency, msg.preferences.facility) + '%' }"></view>
											</view>
										</view>
									</view>
								</view>
								
								<view v-if="msg.hasData" class="analysis-tip">
									<text>💡 AI会根据以上偏好为您优先推荐符合条件的座位</text>
								</view>
							</template>
						</view>
					</view>
					
					<!-- Existing User/System Message Blocks -->
					<view v-else-if="msg.type === 'user' || msg.type === 'system'" class="chat-item" :class="{ 'user-message': msg.type === 'user', 'system-message': msg.type === 'system' }">
					<view class="avatar">
						<image :src="msg.type === 'user' ? userAvatar : botAvatar" mode="aspectFill"></image>
					</view>
					<view class="message-bubble">
						<block v-if="!msg.error">
							<block v-for="(part, partIndex) in parseMessage(msg.content)" :key="partIndex">
								<text v-if="part.type === 'text'">{{ part.content }}</text>
								<text v-if="part.type === 'link'" class="link-style" @click="handleLinkClick(part.path)">{{ part.text }}</text>
							</block>
						</block>
						<text v-else style="color: #ff6666;">{{msg.content}}</text>
					</view>
					</view>
					
					<!-- New Thinking Process Block -->
					<view v-else-if="msg.type === 'thinking_process'" class="thinking-process-container">
						<view class="thinking-header" @click="toggleThinkingVisibility(index)">
							<view class="spinner" v-if="msg.status === 'in_progress'"></view>
							<image v-else src="/static/images/ac.png" class="status-icon-completed"></image>
							<text class="thinking-title">{{ msg.title }}</text>
							<image src="/static/images/arrow-right.png" class="arrow-icon" :class="{ 'expanded': msg.isThinkingVisible }"></image>
						</view>
						<view v-if="msg.isThinkingVisible" class="steps-list">
							<view v-for="(step, stepIndex) in msg.steps" :key="step.id" class="step-item">
								<view class="step-header" @click.stop="toggleStep(index, stepIndex)">
									<image class="step-icon" :src="getStepIcon(step.type)" mode="aspectFit"></image>
									<text class="step-title">{{ step.title }}</text>
									<image src="/static/images/arrow-right.png" class="arrow-icon" :class="{ 'expanded': step.isExpanded }"></image>
								</view>
								<view v-if="step.isExpanded" class="step-content">
									<pre v-if="step.isJson">{{ step.displayContent }}</pre>
									<text v-else>{{ step.displayContent }}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				</view>
			</scroll-view>
		
		<!-- 回到底部按钮 -->
		<view v-if="showBackToBottom" class="back-to-bottom-btn" @tap="scrollToBottomManual">
			<text class="btn-icon">↓</text>
			<text class="btn-text">回到底部</text>
		</view>
		
		<!-- 动态任务追踪面板 -->
		<view class="task-panel" v-if="ongoingTasks.length > 0">
		<view class="panel-header">
			<text class="panel-title">进行中的任务</text>
			<view class="ai-preference-toggle" @tap="togglePreferenceAnalysis">
				<text class="toggle-label">AI偏好分析</text>
				<view class="toggle-switch" :class="{ 'active': enablePreferenceAnalysis }">
					<view class="toggle-slider"></view>
				</view>
			</view>
		</view>
			<scroll-view scroll-x="true" class="task-scroll">
				<view class="task-card" v-for="(task, index) in ongoingTasks" :key="index" @tap="viewTaskDetail(task)">
					<view class="task-icon">
						<image :src="task.icon" mode="aspectFit"></image>
					</view>
					<view class="task-info">
						<text class="task-title">{{task.title}}</text>
						<text class="task-desc">{{task.description}}</text>
						<view class="progress-bar">
							<view class="progress-fill" :style="{ width: task.progress + '%' }"></view>
						</view>
						<text class="task-time">剩余时间: {{task.remainingTime}}</text>
					</view>
					<view class="task-status" :class="task.status">
						<text>{{task.statusText}}</text>
					</view>
				</view>
			</scroll-view>
		</view>
		
		<!-- 底部快捷指令菜单 (原顶部菜单) -->
		<view class="quick-access-menu">
			<scroll-view scroll-x="true" class="menu-scroll">
				<view class="menu-item" v-for="(item, index) in quickAccessItems" :key="index" @tap="handleQuickAccess(item)">
					<view class="menu-icon">
						<image :src="item.icon" mode="aspectFit"></image>
					</view>
					<text class="menu-text">{{item.text}}</text>
				</view>
			</scroll-view>
		</view>
		
		<!-- 底部输入区域 -->
		<view class="input-area">
			<view class="mic-btn" @tap="startVoiceInput">
				<image src="/static/images/scan.png" mode="aspectFit"></image>
			</view>
			<input type="text" class="text-input" v-model="inputMessage" placeholder="请输入消息..." @confirm="sendMessage"/>
			<view class="attach-btn" @tap="showAttachMenu">
				<image src="/static/images/filter.png" mode="aspectFit"></image>
			</view>
			
			<!-- 🎯 对话管理按钮组 -->
			<view class="conversation-actions">
				<view class="action-btn" @tap="viewConversationHistory">
					<image src="/static/images/history.png" mode="aspectFit" class="action-icon"></image>
				</view>
				<view class="action-btn" @tap="createNewConversation">
					<image src="/static/images/plus.png" mode="aspectFit" class="action-icon"></image>
				</view>
			</view>
			
			<view class="send-btn" @tap="sendMessage">
				<image src="/static/images/arrow-right.png" mode="aspectFit"></image>
			</view>
		</view>
		
		<!-- 🎯 历史对话弹窗 -->
		<view v-if="showHistoryPopup" class="history-popup-overlay" @tap="closeHistoryPopup">
			<view class="history-popup" @tap.stop>
				<view class="popup-header">
					<text class="popup-title">历史对话</text>
					<view class="close-btn" @tap="closeHistoryPopup">
						<text>✕</text>
					</view>
				</view>
				
				<scroll-view scroll-y class="conversation-list">
					<view 
						v-for="(conv, index) in conversationList" 
						:key="conv.id"
						class="conversation-item"
						:class="{ 'active': conv.id === currentConversationId }"
						@tap="switchToConversation(conv.id)"
					>
						<view class="conv-main">
							<text class="conv-title">{{ conv.title }}</text>
							<text class="conv-time">{{ formatTime(conv.updatedAt) }}</text>
						</view>
						<view class="conv-actions">
							<view class="delete-btn" @tap.stop="deleteConversation(conv.id, index)">
								<text>删除</text>
							</view>
						</view>
					</view>
					
					<view v-if="conversationList.length === 0" class="empty-state">
						<image src="/static/images/empty.png" mode="aspectFit" class="empty-icon"></image>
						<text class="empty-text">暂无历史对话</text>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
import KingdeeAgentService from '@/services/kingdeeAgent'

export default {
	data() {
		return {
			// !!!重要!!!: 每次启动cloudflared后，请在这里更新为新的公网地址
			tunnelUrl: "https://supporters-judgment-programmer-conviction.trycloudflare.com", 
			
			inputMessage: '',
			scrollTop: 0,
			isUserScrolling: false, // 用户是否正在手动滚动
			showBackToBottom: false, // 是否显示回到底部按钮
			_lastScrollTop: 0, // 上次滚动位置（非响应式）
			_lockedScrollTop: 0, // 用户手动滚动时锁定的位置（非响应式）
			_scrollTimeout: null, // 滚动超时定时器（非响应式）
			_scrollHandlingEnabled: true, // 滚动处理是否启用（非响应式）
			_scrollLockInterval: null, // 滚动锁定监控定时器（非响应式）
			_firstScrollLogged: false, // 首次滚动日志标志（非响应式）
			_isActivelyScrolling: false, // 用户是否正在主动滚动（非响应式）
			_scrollActivityTimeout: null, // 滚动活动检测定时器（非响应式）
			_isAIStreaming: false, // AI是否正在流式输出（非响应式）
			userAvatar: '/static/images/avatar.png',
			botAvatar: '/static/images/assistant.png',
			chatMessages: [
				{
					type: 'system',
					content: '您好！我是校园智能体，有什么可以帮助您的吗？'
				}
			],
			quickAccessItems: [
				{
					icon: '/static/images/schedule.png',
					text: '查课表',
					path: '/pages/features/schedule'
				},
				{
					icon: '/static/images/food.png',
					text: '订餐',
					path: '/pages/features/food'
				},
				{
					icon: '/static/images/library.png',
					text: '借书',
					path: '/pages/features/library'
				},
				{
					icon: '/static/images/classroom.png',
					text: '教室预约',
					path: '/pages/features/classroom'
				},
				{
					icon: '/static/images/express.png',
					text: '快递',
					path: '/pages/features/express'
				}
			],
			ongoingTasks: [
				{
					id: 'task1',
					icon: '/static/images/icon-repair.png',
					title: '宿舍报修',
					description: '水管漏水，请求处理',
					progress: 75,
					remainingTime: '2小时',
					status: 'processing',
					statusText: '处理中',
					path: '/pages/tasks/detail?id=task1'
				},
				{
					id: 'task2',
					icon: '/static/images/icon-express.png',
					title: '快递代取',
					description: '京东快递，请尽快处理',
					progress: 25,
					remainingTime: '30分钟',
					status: 'waiting',
					statusText: '待领取',
					path: '/pages/tasks/detail?id=task2'
				},
				{
					id: 'task3',
					icon: '/static/images/icon-library.png',
					title: '图书续借',
					description: '《深入理解计算机系统》',
					progress: 90,
					remainingTime: '1天',
					status: 'processing',
					statusText: '即将到期',
					path: '/pages/tasks/detail?id=task3'
				}
			],
			sessionId: null,
			currentTaskId: null,
			isAssistantTyping: false,
			assistants: [],
		
		// 🎯 新增：标志当前会话是否已显示过偏好分析框
		hasShownPreferenceAnalysis: false,
		
		// 🎯 新增：AI偏好分析功能开关
		enablePreferenceAnalysis: true, // 默认开启
		
		// 🎯 新增：偏好分析动画进行中标志（完全禁用自动滚动）
		isPreferenceAnalyzing: false,
		
		// 🎯 新增：对话管理相关
		currentConversationId: null, // 当前对话ID
		conversationTitle: '新对话', // 当前对话标题
		conversationCreatedAt: null, // 对话创建时间
		showHistoryPopup: false, // 是否显示历史对话弹窗
		conversationList: [], // 历史对话列表
		
		// 🤖 新增：来自聊天分析的待处理需求
		pendingChatAnalysis: null, // 存储待发送的聊天分析需求
		
			selectedAssistant: null,
			activeSkill: {
				id: null,
				type: null
			},
			websocketTask: null,
			websocketConnected: false,
			reconnectInterval: null,
			heartbeatInterval: null // 新增：心跳定时器
		}
	},
	async onLoad(options) {
		console.log('🚀 页面加载开始', options);
		
		// 🎯 重置偏好分析显示标志（新会话）
		this.hasShownPreferenceAnalysis = false;
		
		// 🎯 重置滚动相关状态
		this.isUserScrolling = false;
		this.showBackToBottom = false;
		this._lastScrollTop = 0;
		this._lockedScrollTop = 0;
		this._scrollHandlingEnabled = true;
		
		// 🎯 检查是否从历史对话进入
		if (options && options.conversationId) {
			this.currentConversationId = options.conversationId;
			console.log('📖 加载历史对话:', this.currentConversationId);
		} else {
			// 生成新对话ID
			this.currentConversationId = this.generateConversationId();
			console.log('✨ 创建新对话:', this.currentConversationId);
		}
		
		// 🤖 检查是否来自聊天AI分析
		if (options && options.from === 'chat_analysis') {
			console.log('🔍 检测到来自聊天AI分析:', {
				type: options.type,
				summary: options.summary
			});
			// 保存需求信息，待初始化完成后自动发送
			this.pendingChatAnalysis = {
				type: options.type,
				summary: decodeURIComponent(options.summary || '')
			};
		}
		
		try {
			await this.initializeAssistant();
			// 初始化成功后，连接WebSocket
			this.connectWebSocket();
			console.log('页面初始化与WebSocket连接流程启动');
			
			// 🤖 如果有待发送的聊天分析需求，等待一秒后自动发送
			if (this.pendingChatAnalysis) {
				setTimeout(() => {
					this.sendChatAnalysisRequest();
				}, 1000);
			}
		} catch (error) {
			console.error('页面初始化失败:', error);
			uni.showToast({
				title: '初始化失败，请重试',
				icon: 'none'
			});
		}
	},
	methods: {
		async initializeAssistant() {
			console.log('开始初始化AI助手');
			try {
				uni.showLoading({
					title: '正在初始化...'
				});

				// 获取助手列表
				console.log('正在获取助手列表...');
				const assistantsResponse = await KingdeeAgentService.getAssistants();
				console.log('获取到的助手列表:', assistantsResponse);
				
				if (!assistantsResponse || !assistantsResponse.data || !Array.isArray(assistantsResponse.data) || !assistantsResponse.data.length) {
					console.error('助手列表无效或为空:', assistantsResponse);
					throw new Error('获取助手列表失败或列表为空');
				}

				this.assistants = assistantsResponse.data;
				if (this.assistants && this.assistants.length > 0) {
					// 目标助手的ID和名称
					const targetAssistantId = "2224845143255547904";
					const targetAssistantName = "校园助手";

					// 尝试通过ID查找助手，如果找不到，再尝试通过名称查找
					let foundAssistant = this.assistants.find(assistant => assistant.id === targetAssistantId);
					if (!foundAssistant) {
						console.warn(`未通过ID "${targetAssistantId}" 找到助手，尝试通过名称 "${targetAssistantName}" 查找...`);
						foundAssistant = this.assistants.find(assistant => assistant.name === targetAssistantName);
					}

					if (foundAssistant) {
						this.selectedAssistant = foundAssistant;
					} else {
						console.warn(`也未通过名称 "${targetAssistantName}" 找到助手，将默认使用列表中的第一个助手。`);
						this.selectedAssistant = this.assistants[0]; // 如果特定助手未找到，回退到第一个
					}

					console.log('已选择助手:', JSON.parse(JSON.stringify(this.selectedAssistant)));

					// 更新欢迎消息等
					/* this.chatMessages.unshift({
						type: 'system',
						content: this.selectedAssistant.openingSpeech || `您好，我是您的助手 ${this.selectedAssistant.name}，有什么可以帮助您的吗？`,
						timestamp: Date.now()
					}); */

					uni.showLoading({ title: '正在创建新会话...' });
					
					// 从选中的助手中获取 assistantId
					const assistantIdToUse = this.selectedAssistant.id; 
					// 将回调URL指向我们的cloudflared服务器
					const callbackUrlToUse = `${this.tunnelUrl}/webhook`;

					if (!assistantIdToUse) {
						console.error("无法从selectedAssistant中获取有效的ID!");
						throw new Error("无法初始化会话：助手ID缺失。");
					}

					console.log(`准备调用createSession，assistantId: ${assistantIdToUse}, callbackUrl: ${callbackUrlToUse}`);
					const sessionResponse = await KingdeeAgentService.createSession(assistantIdToUse, callbackUrlToUse);
					console.log('创建会话响应 (原始):', JSON.parse(JSON.stringify(sessionResponse))); // 使用深拷贝打印

					// 在判断前打印关键值及其类型
					console.log('DEBUG: sessionResponse object:', sessionResponse);
					if (sessionResponse) {
						console.log('DEBUG: sessionResponse.status:', sessionResponse.status, 'type:', typeof sessionResponse.status);
						console.log('DEBUG: sessionResponse.data object:', sessionResponse.data);
						if (sessionResponse.data) {
							console.log('DEBUG: sessionResponse.data.sessionId:', sessionResponse.data.sessionId, 'type:', typeof sessionResponse.data.sessionId);
							// 额外检查sessionId是否为空字符串或布尔false
							console.log('DEBUG: sessionResponse.data.sessionId === "":', sessionResponse.data.sessionId === "");
							console.log('DEBUG: sessionResponse.data.sessionId === false:', sessionResponse.data.sessionId === false);
							console.log('DEBUG: !!sessionResponse.data.sessionId:', !!sessionResponse.data.sessionId);
						}
					}

					// 修正并增强判断条件
					if (sessionResponse && 
					    sessionResponse.status && // 检查 status 是否为真值 (true, "true", 1 等都会通过)
					    sessionResponse.data && 
					    typeof sessionResponse.data.sessionId === 'string' && // 确保 sessionId 是字符串
					    sessionResponse.data.sessionId.length > 0) {
						this.sessionId = sessionResponse.data.sessionId;
						console.log('新会话创建成功，Session ID:', this.sessionId);
						
						// 新增：从响应中提取并保存第一个技能的信息
						if (sessionResponse.data.skills && sessionResponse.data.skills.length > 0) {
							const firstSkill = sessionResponse.data.skills[0];
							this.activeSkill.id = firstSkill.id;
							this.activeSkill.type = firstSkill.type;
							console.log('已激活技能:', JSON.parse(JSON.stringify(this.activeSkill)));
						} else {
							console.warn('newsession响应中未找到可用技能(skills)，后续调用可能受影响。');
						}

						uni.setNavigationBarTitle({ title: `与 ${this.selectedAssistant.name} 对话中` });
					} else {
						console.error('创建会话失败或未返回有效的sessionId (检查后):', sessionResponse);
						// 抛出更具体的错误信息，如果可能的话
						let errMsg = '创建会话失败或未返回有效的sessionId';
						if (sessionResponse && sessionResponse.data && typeof sessionResponse.data.sessionId === 'string' && sessionResponse.data.sessionId.length === 0) {
							errMsg = '创建会话成功，但返回的sessionId为空字符串';
						} else if (sessionResponse && sessionResponse.data && typeof sessionResponse.data.sessionId !== 'string') {
							errMsg = `创建会话成功，但sessionId类型不正确 (预期string，实际${typeof sessionResponse.data.sessionId})`;
						} else if (sessionResponse && !sessionResponse.status) {
							errMsg = `创建会话API响应状态非成功 (status: ${sessionResponse.status})`;
						}
						throw new Error(sessionResponse?.message || errMsg);
					}
				} else {
					console.warn('未获取到助手列表，或列表为空');
					this.chatMessages.unshift({
						type: 'system',
						content: '抱歉，助手列表为空，无法初始化会话。'
					});
				}

				uni.hideLoading();
				console.log('初始化完成');
			} catch (error) {
				uni.hideLoading();
				console.error('初始化AI助手失败:', {
					error: error.message,
					stack: error.stack,
					response: error.response
				});
				
				// 使用默认欢迎消息
				this.chatMessages = [{
					type: 'system',
					content: '抱歉，AI助手连接失败，请稍后重试。'
				}];
				
				throw error; // 向上传播错误
			}
		},

		// 发送消息
		async sendMessage() {
			if (!this.inputMessage.trim()) {
				uni.showToast({
					title: '不能发送空消息',
					icon: 'none'
				});
				return;
			}

			// 核心修正：先将输入内容存入局部变量
			const messageToSend = this.inputMessage;
			const originalMessage = messageToSend; // 保存原始消息用于历史记录

			// Add user message to chat list
			const userMessage = {
				id: `user-${Date.now()}`,
				type: 'user',
				content: messageToSend,
				timestamp: Date.now()
			};
			this.chatMessages.push(userMessage);

			// 然后再清空输入框
			this.inputMessage = ''; 

			this.scrollToBottom();

			try {
				// 🎯 新增：检测是否是自习室、教室或图书相关对话，如果是则注入用户偏好
				let enhancedMessage = messageToSend;
				const isStudyroomRelated = this.isStudyroomRelated(messageToSend);
				const isClassroomRelated = this.isClassroomRelated(messageToSend);
				const isBookRelated = this.isBookRelated(messageToSend);
				
				// 确定模块类型（优先级：图书 > 教室 > 自习室）
				let moduleType = 'general';
				if (isBookRelated) {
					moduleType = 'book';
				} else if (isClassroomRelated) {
					moduleType = 'classroom';
				} else if (isStudyroomRelated) {
					moduleType = 'studyroom';
				}
				
				// 如果是图书、教室或自习室相关，尝试注入偏好
				if (isBookRelated || isClassroomRelated || isStudyroomRelated) {
					let moduleName = '图书推荐';
					if (isBookRelated) {
						moduleName = '图书推荐';
					} else if (isClassroomRelated) {
						moduleName = '教室预约';
					} else if (isStudyroomRelated) {
						moduleName = '自习室预约';
					}
					console.log(`✅✅✅ 检测到${moduleName}相关对话，尝试获取用户偏好...`);
					// 优先从 userInfo 中获取，兼容多种字段名
					const userInfo = uni.getStorageSync('userInfo');
					const studentId = userInfo?.studentId || userInfo?.userId || userInfo?.student_id || uni.getStorageSync('userId');
					
					if (studentId) {
						console.log('✅ 找到用户ID:', studentId);
						try {
							// 🎯 检查开关是否启用
							if (this.enablePreferenceAnalysis) {
								// 先加载偏好数据（同步等待），确保偏好分析框在思考占位符之前显示
								if (!this.hasShownPreferenceAnalysis) {
									console.log('📊 准备显示偏好分析框，模块类型:', moduleType);
									await this.loadAndShowPreferences(studentId, moduleType, userMessage.id);
									this.hasShownPreferenceAnalysis = true; // 标记已显示
								}
								
								// 然后获取偏好摘要用于注入
								const prefResponse = await uni.request({
									url: `http://localhost:3000/api/preferences/summary/${studentId}/${moduleType}`,
									method: 'GET'
								});
								
								// 无论是否有偏好，都尝试注入（如果有的话）
								if (prefResponse.statusCode === 200 && prefResponse.data.success) {
									if (prefResponse.data.data.prompt_prefix) {
										enhancedMessage = prefResponse.data.data.prompt_prefix + messageToSend;
										console.log('✅ 已注入用户偏好:', prefResponse.data.data.summary);
										console.log('增强后的消息:', enhancedMessage);
									} else {
										console.log('该用户暂无历史偏好，使用原始消息');
									}
								} else {
									console.log('获取偏好摘要失败:', prefResponse);
								}
							} else {
								console.log('🔇 AI偏好分析已关闭，跳过偏好注入');
							}
						} catch (prefError) {
							console.warn('获取用户偏好失败，使用原始消息:', prefError);
							// 即使出错，也尝试显示偏好分析框（如果开关启用）
							if (!this.hasShownPreferenceAnalysis && this.enablePreferenceAnalysis) {
								console.log('📊 偏好获取异常，但仍尝试显示偏好分析框');
								await this.loadAndShowPreferences(studentId, moduleType, userMessage.id);
								this.hasShownPreferenceAnalysis = true;
							}
						}
					} else {
						console.warn('❌ 未找到学生ID，无法加载偏好分析');
					}
				}

				const response = await KingdeeAgentService.sendChatMessage({
					sessionId: this.sessionId,
					// 使用增强后的消息（如果有偏好则包含偏好前缀）
					userInput: enhancedMessage, 
				});
				console.log('消息发送成功，API响应:', response);
				
				// 🎯 新增：保存对话历史到数据库
				this.saveConversationHistory(originalMessage, moduleType);

				const thinkingProcessPlaceholder = {
					id: `thinking-${Date.now()}`, 
					type: 'thinking_process',
					runId: null, 
					title: 'AI思考中...',
					status: 'in_progress',
					isThinkingVisible: true,
					steps: []
				};
				this.chatMessages.push(thinkingProcessPlaceholder);
				this.scrollToBottom();

				if (response && response.runId) {
					console.log('API同步响应中包含runId，立即更新占位符');
					const placeholder = this.chatMessages.find(msg => msg.id === thinkingProcessPlaceholder.id);
					if (placeholder) {
						this.$set(placeholder, 'runId', response.runId);
					}
				}

			} catch (error) {
				// 用户指出，由于环境性能问题，超时是可预期的，
				// 且不影响后续WebSocket消息的接收，因此不再将此错误显示在UI上。
				// 我们仅在控制台记录此错误以供调试。
				console.warn(`发送消息时发生可预期的错误（通常是超时）: ${error.message}`);
				
				/*
				const errorId = `error-${Date.now()}`;
				this.chatMessages.push({
					id: errorId,
					type: 'system',
					content: `发送失败: ${error.message}`,
					error: true,
					timestamp: Date.now()
				});
				this.scrollToBottom();
				*/
			} finally {
				// uni.hideLoading();
			}
		},
		addSystemMessage(content) {
			this.chatMessages.push({
				type: 'system',
				content: content,
				timestamp: Date.now()
			});
			this.scrollToBottom();
		},

		// 🤖 发送聊天分析需求
		sendChatAnalysisRequest() {
			console.log('🚀 准备发送聊天分析需求:', this.pendingChatAnalysis);
			
			if (!this.pendingChatAnalysis || !this.pendingChatAnalysis.summary) {
				console.error('❌ 无有效的聊天分析需求');
				return;
			}
			
			try {
				// 构建消息内容
				const needTypeMap = {
					'classroom': '教室预约',
					'library': '图书借阅', 
					'studyroom': '自习室预约'
				};
				
				const needTypeName = needTypeMap[this.pendingChatAnalysis.type] || this.pendingChatAnalysis.type;
				const messageContent = `你好！我从聊天记录中分析到一个${needTypeName}需求，详情如下：\n\n${this.pendingChatAnalysis.summary}\n\n请帮我处理这个需求。`;
				
				// 设置输入框内容
				this.inputMessage = messageContent;
				
				// 自动发送消息
				setTimeout(() => {
					this.sendMessage();
					// 清理待处理的需求
					this.pendingChatAnalysis = null;
				}, 500);
				
				console.log('✅ 已自动发送聊天分析需求');
				
			} catch (e) {
				console.error('❌ 发送聊天分析需求失败:', e);
				uni.showToast({
					title: '发送需求失败',
					icon: 'none'
				});
			}
		},

		// 处理滚动事件（高度优化版）
		handleScroll(e) {
			// 如果滚动处理被禁用（弹窗打开时），直接返回
			if (!this._scrollHandlingEnabled) {
				return;
			}
			
			const { scrollTop, scrollHeight } = e.detail;

			// 🔍 降低节流阈值：只在滚动距离>3px时才处理
			const scrollDiff = Math.abs(scrollTop - this._lastScrollTop);
			if (scrollDiff < 3) {
				return;
			}
			
			// 首次滚动时输出日志（用于调试）
			if (!this._firstScrollLogged) {
				this._firstScrollLogged = true;
			}
			
			// 🎯 标记用户正在主动滚动，防止定时器强制锁定造成卡顿
			this._isActivelyScrolling = true;
			if (this._scrollActivityTimeout) {
				clearTimeout(this._scrollActivityTimeout);
			}
			// 600ms无滚动后才认为停止主动滚动（延长时间避免AI输出时卡顿）
			this._scrollActivityTimeout = setTimeout(() => {
				this._isActivelyScrolling = false;
			}, 600);
			
			// ⚠️ AI流式输出期间，不更新锁定位置，避免与DOM变化冲突
			if (this._isAIStreaming) {
				this._lastScrollTop = scrollTop;
				return;
			}
				
			// 用户向上滚动时标记为手动滚动
			if (scrollTop < this._lastScrollTop) {
				// 只在状态真正改变时才更新
				if (!this.isUserScrolling) {
					this.isUserScrolling = true;
					this.showBackToBottom = true;
					this.startScrollLockMonitor();
				}
				this._lockedScrollTop = scrollTop;
				this._lastScrollTop = scrollTop;
			} else if (this.isUserScrolling) {
				// 在手动模式下，无论scrollTop如何变化，都更新锁定位置
				// 统一由定时器在用户停止滚动后处理强制锁定，避免handleScroll中立即回弹造成卡顿
				this._lockedScrollTop = scrollTop;
				this._lastScrollTop = scrollTop;
			} else {
				// 非手动模式，正常更新
				this._lastScrollTop = scrollTop;
			}
			
			// 完全移除自动恢复滚动的逻辑
			// 用户一旦向上滚动，就完全由用户手动控制
			// 只有点击"回到底部"按钮才会恢复自动滚动
		},
		
		// 滚动到底部（自动）
		scrollToBottom() {
			// 如果用户正在手动滚动，不执行自动滚动
			if (this.isUserScrolling) {
				return;
			}
			
			this.$nextTick(() => {
				const lastMessageIndex = this.chatMessages.length - 1;
				if (lastMessageIndex < 0) return;
				// 这里使用一个较大的值来确保滚动到底部
				this.scrollTop = this.scrollTop + 9999;
			});
		},
		
		// 手动滚动到底部
		scrollToBottomManual() {
			this.isUserScrolling = false;
			this.showBackToBottom = false;
			
			// 停止滚动锁定监控
			this.stopScrollLockMonitor();
			
			this.$nextTick(() => {
				const lastMessageIndex = this.chatMessages.length - 1;
				if (lastMessageIndex < 0) return;
				this.scrollTop = this.scrollTop + 9999;
			});
		},
		
		// 启动滚动锁定监控
		startScrollLockMonitor() {
			// 先清除旧的定时器
			if (this._scrollLockInterval) {
				clearInterval(this._scrollLockInterval);
			}
			this._scrollLockInterval = setInterval(() => {
				// ⚠️ 关键1：AI流式输出期间完全禁用锁定，避免冲突
				if (this._isAIStreaming) {
					return;
				}
				// ⚠️ 关键2：只在用户完全停止主动滚动后才启用锁定
				// 这样可以避免与AI输出时的DOM变化冲突
				if (this.isUserScrolling && this._lockedScrollTop > 0 && !this._isActivelyScrolling) {
					const currentScrollTop = this.scrollTop;
					// 只有当scrollTop被AI输出拉动超过阈值时才强制恢复
					if (Math.abs(currentScrollTop - this._lockedScrollTop) > 20) {
						this.scrollTop = this._lockedScrollTop;
					}
				}
			}, 150); // 稍微降低检查频率，从100ms改为150ms
		},
		
		// 停止滚动锁定监控
		stopScrollLockMonitor() {
			if (this._scrollLockInterval) {
				clearInterval(this._scrollLockInterval);
				this._scrollLockInterval = null;
			}
		},
		
		// 语音输入
		startVoiceInput() {
			uni.showToast({ title: '语音功能开发中...', icon: 'none' });
		},

		// 附件菜单
		showAttachMenu() {
			uni.showToast({ title: '附件功能开发中...', icon: 'none' });
		},
		
		// 快捷指令处理
		handleQuickAccess(item) {
			if (item.path) {
				uni.navigateTo({ url: item.path });
			} else {
				uni.showToast({ title: '功能开发中...', icon: 'none' });
			}
		},

		// 查看任务详情
		viewTaskDetail(task) {
			uni.showToast({ title: '任务详情功能开发中...', icon: 'none' });
		},
		
		// 加载更多历史消息
		loadMoreMessages() {
		// 不显示任何提示，静默处理
		},
		
		// 以下是处理从Webhook接收到的消息的逻辑
		// 注意：这部分逻辑现在需要一个服务器来接收Webhook并将其推送到小程序
		handleWebhookData(payload) {
			console.log("处理Webhook数据:", payload);

			if (!payload || !payload.message) {
				console.warn("收到的Webhook数据格式不正确", payload);
				return;
			}
			
			const { message, sessionId, taskId } = payload;
			this.currentTaskId = taskId;

			if (message.actionList && Array.isArray(message.actionList)) {
				message.actionList.forEach(action => this.handleAction(action));
			}
		},
		
		handleAction(action) {
			console.log('处理Action:', action);
			// 修复：优先使用runId，如果没有则使用id字段
			const runId = action.data ? (action.data.runId || action.data.id) : null;

			switch (action.type) {
				case 'identifySkill':
				case 'streamDone':
					// 识别到中控发来的新事件类型，暂不处理，仅消除报错
					console.log(`已识别并忽略Action类型: ${action.type}`);
					// AI流式输出结束
					this._isAIStreaming = false;
					break;

				case 'runStepChat':
					{ // 使用块级作用域
						if (!runId) {
							console.warn('runStepChat消息中没有runId或id，无法处理:', action);
							return;
						}

						// 核心逻辑：寻找正确的思考面板
						// 1. 先尝试通过runId寻找已关联的面板
						let thinkingProcess = this.chatMessages.find(msg => msg.runId === runId);

						// 2. 如果没找到，说明这是第一个携带runId的消息，需要认领占位符面板
						if (!thinkingProcess) {
							thinkingProcess = this.chatMessages.find(msg => msg.type === 'thinking_process' && !msg.runId);
							if (thinkingProcess) {
								console.log(`为思考面板占位符关联上runId: ${runId}`);
								// 使用$set确保响应性
								this.$set(thinkingProcess, 'runId', runId);
							}
						}

						// 3. 如果仍然没有找到（异常情况），则创建一个新的
						if (!thinkingProcess) {
							console.warn(`未找到与runId ${runId} 匹配的思考过程，将创建一个新的。`);
							thinkingProcess = {
								id: `thinking-${runId}`,
								type: 'thinking_process',
								runId: runId,
								title: 'AI思考中...',
								status: 'in_progress',
								isThinkingVisible: true,
								steps: []
							};
							this.chatMessages.push(thinkingProcess);
						}

						// 更新思考过程的状态
						if (thinkingProcess.status !== 'completed') {
							thinkingProcess.status = 'in_progress';
						}

						const stepData = action.data;
						const stepIndex = thinkingProcess.steps.findIndex(s => s.id === stepData.runStepId);

						const displayContent = this.formatStepContent(stepData.message);

						const newStep = {
							id: stepData.runStepId,
							title: stepData.stepTypeName,
							type: stepData.stepType,
							status: stepData.stepStatus,
							content: stepData.message,
							displayContent: displayContent.content,
							isJson: displayContent.isJson,
							isExpanded: false // 默认折叠新步骤
						};

						if (stepIndex > -1) {
							// 更新现有步骤
							this.$set(thinkingProcess.steps, stepIndex, newStep);
						} else {
							// 添加新步骤
							thinkingProcess.steps.push(newStep);
						}
						
						this.$forceUpdate(); // 强制视图更新
						this.scrollToBottom();
					}
					break;

				case 'chat':
					{ // 使用块级作用域
						if (!runId) {
							console.warn('Chat消息中没有runId或id，无法处理:', action);
							return;
						}
						
						const messageData = action.data;
						const messageId = `final-message-${runId}`; // 使用runId确保唯一性
						
						console.log(`处理Chat消息 - runId: ${runId}, message: "${messageData.message}", messageId: ${messageId}`);
						
						// 查找或创建最终消息
						let finalMessage = this.chatMessages.find(msg => msg.id === messageId);

						if (finalMessage) {
							// 追加内容（流式消息）
							console.log(`追加内容到现有消息: "${messageData.message}"`);
							finalMessage.content += messageData.message;
							// 标记AI正在流式输出
							this._isAIStreaming = true;
						} else {
							// 创建新消息
							console.log(`创建新消息: "${messageData.message}"`);
							finalMessage = {
								id: messageId,
								type: 'system',
								content: messageData.message,
								runId: runId, // 关联runId
								timestamp: Date.now()
							};
							this.chatMessages.push(finalMessage);
							// 标记AI正在流式输出
							this._isAIStreaming = true;
						}

						// 定位到对应的思考过程并标记完成
						let thinkingProcess = this.chatMessages.find(msg => msg.runId === runId);
						if (thinkingProcess) {
							// 当最终chat消息到达时，标记思考过程为完成
							thinkingProcess.status = 'completed';
							thinkingProcess.title = 'AI思考完成';
						}

						console.log(`当前聊天消息总数: ${this.chatMessages.length}`);
						// 调用调试方法
						this.debugChatMessages();
						this.scrollToBottom();
						this.$forceUpdate(); // 确保视图更新
					}
					break;
				
				case 'waiting':
				    // 等待状态，可以用来显示一个通用的"处理中"状态，但我们已有思考面板，故忽略
				    console.log('收到waiting状态，暂不处理。');
			    break;
			
			case 'waitingDone':
				{ // 使用块级作用域
					console.log('✅ 收到waitingDone，标记所有进行中的思考过程为完成');
					
					// 查找所有状态为 in_progress 的思考过程，将其标记为完成
					this.chatMessages.forEach(msg => {
						if (msg.type === 'thinking_process' && msg.status === 'in_progress') {
							console.log(`标记思考过程完成: ${msg.id || msg.runId}`);
							msg.status = 'completed';
							msg.title = 'AI思考完成';
						}
					});
					
					// AI流式输出结束
					this._isAIStreaming = false;
					
					this.$forceUpdate(); // 强制视图更新
				}
				    break;

				default:
					console.error('未知的Action类型:', action.type);
			}
		},

		formatStepContent(content) {
			try {
				// 尝试解析为JSON
				const parsed = JSON.parse(content);
				// 如果成功，格式化为带缩进的字符串
				return {
					content: JSON.stringify(parsed, null, 2),
					isJson: true
				};
			} catch (e) {
				// 如果解析失败，说明是普通文本
				return {
					content: content,
					isJson: false
				};
			}
		},

		toggleThinkingVisibility(messageIndex) {
			const msg = this.chatMessages[messageIndex];
			if (msg) {
				this.$set(msg, 'isThinkingVisible', !msg.isThinkingVisible);
			}
		},

		toggleStep(messageIndex, stepIndex) {
			const msg = this.chatMessages[messageIndex];
			if (msg && msg.steps && msg.steps[stepIndex]) {
				const step = msg.steps[stepIndex];
				this.$set(step, 'isExpanded', !step.isExpanded);
			}
		},
		
		getStepTitle(runStep) {
			// 根据runStep的类型和内容生成更友好的标题
			// (这是一个示例，您可以根据实际的stepTypeName和message内容进行扩展)
			if (runStep.stepTypeName && runStep.stepTypeName.includes('llm-chat')) {
				return '正在思考...';
			}
			if (runStep.stepTypeName && runStep.stepTypeName.includes('tool-input')) {
				try {
					const toolCall = JSON.parse(runStep.message);
					return `准备调用工具: ${toolCall.tool_name || '未知工具'}`;
				} catch(e) {
					return '准备调用工具';
				}
			}
			if (runStep.stepTypeName && runStep.stepTypeName.includes('tool-output')) {
				return '获取到工具返回结果';
			}
			return runStep.stepTypeName || '未知步骤';
		},
		
		getStepIcon(stepType) {
			const icons = {
				'llm': '/static/images/assistant.png',
				'tool': '/static/images/settings.png',
				'ac': '/static/images/ac.png'
			};
			return icons[stepType] || '/static/images/ac.png';
		},
		
		handleTaskAction(action) {
			const taskData = action.task;
			const existingTaskIndex = this.ongoingTasks.findIndex(t => t.id === taskData.taskId);

			const formattedTask = {
				id: taskData.taskId,
				title: taskData.taskTitle,
				description: taskData.taskDesc,
				progress: parseInt(taskData.progress, 10),
				status: taskData.status, // running, success, fail
				statusText: this.getTaskStatusText(taskData.status),
				remainingTime: "计算中...", // 需要逻辑来计算
				icon: this.getTaskIcon(taskData.taskTitle)
			};
			
			if (existingTaskIndex > -1) {
				this.$set(this.ongoingTasks, existingTaskIndex, formattedTask);
			} else {
				this.ongoingTasks.push(formattedTask);
			}
		},

		getTaskStatusText(status) {
			const map = {
				running: "进行中",
				success: "已完成",
				fail: "已失败",
			};
			return map[status] || "未知";
		},

		getTaskIcon(title) {
			if (title.includes("课表")) return "/static/images/schedule.png";
			if (title.includes("订餐")) return "/static/images/food.png";
			return "/static/images/task.png"; // 默认图标
		},

		addOrUpdateBotMessage(content, messageId) {
			const existingMsgIndex = this.chatMessages.findIndex(m => m.id === messageId);
			if (existingMsgIndex > -1) {
				// 更新现有消息
				const msg = this.chatMessages[existingMsgIndex];
				this.$set(this.chatMessages[existingMsgIndex], 'content', msg.content + content);
			} else {
				// 添加新消息
				this.chatMessages.push({
					id: messageId,
					type: 'system',
					content: content,
					timestamp: Date.now()
				});
			}
			this.scrollToBottom();
		},
		
		removeBotMessage(messageId) {
			const msgIndex = this.chatMessages.findIndex(m => m.id === messageId);
			if (msgIndex > -1) {
				this.chatMessages.splice(msgIndex, 1);
			}
		},

		// --- WebSocket相关方法 ---
		connectWebSocket() {
			// 🎯 重要：先关闭旧连接，避免累积
			if (this.websocketTask) {
				console.log('⚠️ 检测到旧的WebSocket连接，先关闭');
				try {
					this.websocketTask.close({
						code: 1000,
						reason: '创建新连接'
					});
				} catch (error) {
					console.warn('关闭旧连接失败:', error);
				}
				this.websocketTask = null;
				this.websocketConnected = false;
			}
			
			// 从 "https://xxx.com" 生成 "wss://xxx.com"
			const wsUrl = this.tunnelUrl.replace(/^http/, 'ws');
			console.log(`尝试连接WebSocket: ${wsUrl}`);

			this.websocketTask = uni.connectSocket({
				url: wsUrl,
				success: () => {
					console.log("uni.connectSocket 调用成功");
				},
				fail: (err) => {
					console.error("uni.connectSocket 调用失败", err);
				}
			});

			this.websocketTask.onOpen(() => {
				console.log('✅ WebSocket 连接已打开');
				this.websocketConnected = true;
				// 清除可能存在的重连定时器
				if (this.reconnectInterval) {
					clearInterval(this.reconnectInterval);
					this.reconnectInterval = null;
				}
				// this.addSystemMessage("智能助手连接成功！");

				// 新增：开启心跳
				this.startHeartbeat();
			});

			this.websocketTask.onMessage((res) => {
				console.log('收到WebSocket消息:', res.data);

				// 新增：处理心跳回声，避免JSON解析错误
				if (typeof res.data === 'string' && res.data.startsWith('Echo:')) {
					console.log('❤️ 心跳响应 (Pong) 已收到。');
					return; // 是心跳回声，直接忽略，不进行解析
				}

				try {
					const payload = JSON.parse(res.data);
					// 调用我们已经写好的Webhook处理逻辑
					this.handleWebhookData(payload);
				} catch (e) {
					console.error('解析WebSocket消息失败:', e);
				}
			});

			this.websocketTask.onError((err) => {
				console.error('WebSocket 连接发生错误:', err);
				this.websocketConnected = false;
		// ⚠️ 不显示错误提示，避免在页面切换时产生不必要的用户困扰
			});

			this.websocketTask.onClose((res) => {
				console.log('🔌 WebSocket 连接已关闭', res);
				this.websocketConnected = false;
				
			// 停止心跳
				this.stopHeartbeat();

			// ⚠️ 取消自动重连机制
			// 原因：用户离开页面后不需要重连，重新进入会自动初始化
			// 避免在后台不断尝试重连导致连接累积
			
			// 清理连接状态
			this.websocketTask = null;
			});
		},
		
		// --- 新增：心跳相关方法 ---
		startHeartbeat() {
			// 先清除旧的，以防万一
			this.stopHeartbeat(); 
			
			console.log('❤️ 启动WebSocket心跳...');
			this.heartbeatInterval = setInterval(() => {
				if (this.websocketConnected) {
					const pingMessage = JSON.stringify({ type: 'ping' });
					this.websocketTask.send({
						data: pingMessage,
						success: () => {
							console.log('❤️ 心跳发送: ping');
						},
						fail: (err) => {
							console.error('💔 心跳发送失败:', err);
						}
					});
				}
			}, 30000); // 每30秒发送一次
		},

		stopHeartbeat() {
			if (this.heartbeatInterval) {
				console.log('💔 停止WebSocket心跳...');
				clearInterval(this.heartbeatInterval);
				this.heartbeatInterval = null;
			}
		},

		parseMessage(content) {
			// 正则表达式，用于匹配 Markdown 链接 [文字](路径) 或裸露的 /pages/ 路径
			const regex = /\[([^\]]+)\]\(([^)]+)\)|(\/pages\/[\w\/?=&.-]+)/g;
			const parts = [];
			let lastIndex = 0;
			let match;

			while ((match = regex.exec(content)) !== null) {
				// 添加链接前的文本部分
				if (match.index > lastIndex) {
					parts.push({
						type: 'text',
						content: content.substring(lastIndex, match.index)
					});
				}

				// 判断匹配到的是哪种链接
				if (match[1] && match[2]) {
					// 匹配到 Markdown 链接
					parts.push({
						type: 'link',
						text: match[1],
						path: match[2]
					});
				} else if (match[3]) {
					// 匹配到裸露路径
					parts.push({
						type: 'link',
						text: '点击查看详情',
						path: match[3]
					}); // 使用默认文本
				}

				lastIndex = regex.lastIndex;
			}

			// 添加最后一个链接后的文本部分
			if (lastIndex < content.length) {
				parts.push({
					type: 'text',
					content: content.substring(lastIndex)
				});
			}

			// 如果没有找到任何链接，则返回包含整个内容的单个文本部分
			return parts.length > 0 ? parts : [{
				type: 'text',
				content: content
			}];
		},

		handleLinkClick(path) {
			if (!path || !path.startsWith('/pages/')) {
				console.error('无效或不安全的页面路径:', path);
				uni.showToast({
					title: '无法跳转到该页面',
					icon: 'none'
				});
				return;
			}
			uni.navigateTo({
				url: path,
				fail: (err) => {
					console.error('跳转失败:', err);
					uni.showToast({
						title: '页面跳转失败',
						icon: 'none'
					});
				}
			});
		},

		// 调试方法：打印当前聊天消息状态
		debugChatMessages() {
			console.log('=== 当前聊天消息状态 ===');
			console.log(`总消息数: ${this.chatMessages.length}`);
			this.chatMessages.forEach((msg, index) => {
				console.log(`消息 ${index}:`, {
					id: msg.id,
					type: msg.type,
					content: msg.content ? msg.content.substring(0, 50) + '...' : '无内容',
					runId: msg.runId,
					timestamp: msg.timestamp
				});
			});
			console.log('=== 调试信息结束 ===');
		},

		// 🎯 新增：判断消息是否与自习室相关
		isStudyroomRelated(message) {
			const msg = message.toLowerCase(); // 转换为小写进行匹配（中文不受影响，但保持一致性）
			
			// 先排除教室预约相关（明确提到"教室预约"、"预约教室"、"预约一间教室"等）
			const classroomKeywords = [
				'教室预约', '预约教室', '教室预订', '预订教室',
				'预约一间教室', '教室开会', '教室会议',
				'教室活动', '教室使用', '预约教室'
			];
			// 检查是否包含教室预约相关关键词
			for (const keyword of classroomKeywords) {
				if (msg.includes(keyword)) {
					console.log('检测到教室预约相关，排除自习室偏好分析');
					return false; // 教室预约不是自习室相关
				}
			}
			
			// 再判断是否是自习室相关（需要明确提到自习室、座位等关键词）
			const studyroomKeywords = [
				'自习室', '座位', '选座', '自习座位', '学习座位',
				'靠窗', '角落', '电源', '插座', '图书馆座位'
			];
			// 只有当明确包含自习室相关关键词时才返回true
			// 注意：移除了"预约"、"学习"、"复习"、"看书"等过于宽泛的词
			// 移除了"教室"单独判断，避免误判
			for (const keyword of studyroomKeywords) {
				if (msg.includes(keyword)) {
					console.log('检测到自习室相关，将显示偏好分析');
					return true;
				}
			}
			
			return false;
		},

		// 🎯 新增：保存对话历史到数据库
		async saveConversationHistory(userMessage, moduleType) {
			try {
				// 优先从 userInfo 中获取，兼容多种字段名
				const userInfo = uni.getStorageSync('userInfo');
				const studentId = userInfo?.studentId || userInfo?.userId || userInfo?.student_id || uni.getStorageSync('userId');
				
				if (!studentId) {
					console.log('未找到学生ID，跳过保存对话历史');
					console.log('userInfo:', userInfo);
					return;
				}
				
				console.log('📝 准备保存对话历史，student_id:', studentId);

				// 异步保存，不阻塞主流程
				uni.request({
					url: 'http://localhost:3000/api/preferences/conversation',
					method: 'POST',
					data: {
						student_id: studentId,
						module_type: moduleType,
						user_message: userMessage,
						ai_response: null // AI响应会在后续通过WebSocket接收
					},
					success: (res) => {
						if (res.data.success) {
							console.log('✅ 对话历史保存成功:', res.data.data);
							
							// 如果提取到了关键词，显示提示
							if (res.data.data.keywords_count > 0) {
								console.log(`📝 已记录 ${res.data.data.keywords_count} 个偏好关键词`);
							}
						}
					},
					fail: (err) => {
						console.warn('保存对话历史失败（不影响使用）:', err);
					}
				});
			} catch (error) {
				console.warn('保存对话历史异常（不影响使用）:', error);
			}
		},
		
		// 🎯 新增：判断消息是否与图书推荐相关
		isBookRelated(message) {
			const msg = message; // 保持原始大小写，因为中文不受大小写影响
			
			// 图书推荐相关关键词（按优先级排序，更具体的在前）
			const bookKeywords = [
				'找书', '找图书', '找本书', '找一本', '查找图书', '查找书籍',
				'推荐书', '推荐图书', '推荐书籍', '推荐一本',
				'借书', '借阅', '借阅图书', '借阅书籍',
				'图书', '书籍', '书', '图书馆',
				'作者', 'ISBN', '书名'
			];
			
			// 检查是否包含图书推荐相关关键词
			for (const keyword of bookKeywords) {
				if (msg.includes(keyword)) {
					console.log('✅ 检测到图书推荐相关关键词:', keyword);
					console.log('✅ 消息内容:', msg);
					return true;
				}
			}
			
			console.log('❌ 未检测到图书推荐相关关键词');
			console.log('❌ 消息内容:', msg);
			return false;
		},

		// 🎯 新增：判断消息是否与教室预约相关
		isClassroomRelated(message) {
			const msg = message; // 保持原始大小写，因为中文不受大小写影响
			
			// 教室预约相关关键词（按优先级排序，更具体的在前）
			const classroomKeywords = [
				'预约一间教室', '预约教室', '教室预约', '教室预订', '预订教室',
				'教室开会', '教室会议', '教室活动', '教室使用', '教室'
			];
			
			// 检查是否包含教室预约相关关键词
			for (const keyword of classroomKeywords) {
				if (msg.includes(keyword)) {
					console.log('✅ 检测到教室预约相关关键词:', keyword);
					console.log('✅ 消息内容:', msg);
					return true;
				}
			}
			
			console.log('❌ 未检测到教室预约相关关键词');
			console.log('❌ 消息内容:', msg);
			return false;
		},

		// 🎯 新增：加载并显示偏好分析（嵌入到对话中）
		async loadAndShowPreferences(studentId, moduleType = 'studyroom', userMessageId = null) {
			try {
				console.log(`📊 开始加载偏好数据，studentId: ${studentId}, moduleType: ${moduleType}`);
				
				// 🔒 设置偏好分析进行中标志，完全禁用自动滚动
				this.isPreferenceAnalyzing = true;
				
				// 🎯 第一步：先插入一个"AI分析中"的占位符
				const getDetailText = (stepId, moduleType) => {
					const texts = {
						studyroom: {
							1: '正在从数据库检索用户的历史自习室预约记录，包括座位选择、时间偏好、环境需求等维度信息...',
							2: '应用NLP自然语言处理技术，从对话文本中识别并提取"靠窗"、"安静"、"插座"等关键偏好特征词...',
							3: '使用聚类算法分析提取的关键词，识别用户在位置、环境、设施三个维度的偏好模式，计算各特征的权重分布...',
							4: '结合TF-IDF算法量化偏好强度，生成自然语言描述的用户画像，为智能推荐提供决策依据...'
						},
						classroom: {
							1: '正在查询用户历史教室预约记录，分析设备需求、楼层偏好、容量要求等关键信息...',
							2: '通过语义分析识别"投影仪"、"低楼层"、"小型"等设备、位置、规模相关的偏好关键词...',
							3: '构建偏好特征向量，分析设备、楼层、容量三个维度的偏好分布，计算每个特征的频次权重...',
							4: '基于偏好向量生成个性化推荐策略，输出自然语言形式的用户偏好画像...'
						},
						book: {
							1: '正在检索用户历史图书借阅对话记录，提取学科、类型、阅读周期、借阅时机等多维度信息...',
							2: '运用关键词提取算法，识别"计算机"、"专业书"、"短期速读"等学科、类型、周期相关特征...',
							3: '分析学科偏好、图书类型、阅读周期、借阅时机、作者偏好五个维度，构建用户阅读兴趣模型...',
							4: '综合多维偏好数据，生成智能推荐依据，输出用户阅读习惯的自然语言描述...'
						}
					};
					return texts[moduleType]?.[stepId] || texts.studyroom[stepId];
				};
				
				const preferenceMessage = {
					id: `preference-${Date.now()}`,
					type: 'preference_analysis',
					moduleType: moduleType,
					analysisStage: 'loading', // loading -> extracting -> analyzing -> complete
					analysisSteps: [
						{ id: 1, label: '加载历史对话数据', status: 'loading', detailText: getDetailText(1, moduleType) },
						{ id: 2, label: '提取关键偏好信息', status: 'pending', detailText: getDetailText(2, moduleType) },
						{ id: 3, label: '归纳用户偏好模式', status: 'pending', detailText: getDetailText(3, moduleType) },
						{ id: 4, label: '生成个性化洞察', status: 'pending', detailText: getDetailText(4, moduleType) }
					],
					preferences: {},
					hasData: false,
					isVisible: true,
					timestamp: Date.now(),
					insight: '' // AI生成的洞察文本
				};
				
				// 插入占位符到对话列表
				if (userMessageId) {
					const userMessageIndex = this.chatMessages.findIndex(msg => msg.type === 'user' && msg.id === userMessageId);
					if (userMessageIndex >= 0) {
						this.chatMessages.splice(userMessageIndex + 1, 0, preferenceMessage);
					} else {
						this.chatMessages.push(preferenceMessage);
					}
				} else {
					this.chatMessages.push(preferenceMessage);
				}
				// 偏好分析期间不自动滚动
				if (!this.isUserScrolling && !this.isPreferenceAnalyzing) {
					this.scrollToBottom();
				}
				
				// 🎯 模拟AI分析过程，逐步更新状态（加快速度用于演示）
				const updateAnalysisStep = async (stepId, status, delay = 100) => {
					await new Promise(resolve => setTimeout(resolve, delay));
					const msg = this.chatMessages.find(m => m.id === preferenceMessage.id);
					if (msg) {
						const step = msg.analysisSteps.find(s => s.id === stepId);
						if (step) {
							step.status = status;
							this.$forceUpdate();
							// 偏好分析期间不自动滚动（保持用户当前位置）
							// if (!this.isUserScrolling) {
							// 	this.scrollToBottom();
							// }
						}
					}
				};
				
				// 第一步：加载数据
				await updateAnalysisStep(1, 'loading', 50);
				
				const response = await uni.request({
					url: `http://localhost:3000/api/preferences/${studentId}/${moduleType}`,
					method: 'GET'
				});
				
				await updateAnalysisStep(1, 'complete', 50);
				await updateAnalysisStep(2, 'loading', 50);
				
				console.log('📊 偏好数据响应:', response);
				
				if (response.statusCode === 200 && response.data.success) {
					const grouped = response.data.data.grouped || {};
					const totalCount = response.data.data.total_count || 0;
					
					console.log(`📊 偏好数据统计: total_count=${totalCount}`);
					console.log('📊 分组数据:', grouped);
					
					// 第二步：提取关键词
					await updateAnalysisStep(2, 'complete', 100);
					await updateAnalysisStep(3, 'loading', 50);
					
					// 第三步：归纳偏好
					await updateAnalysisStep(3, 'complete', 100);
					await updateAnalysisStep(4, 'loading', 50);
					
					// 🎯 组装偏好数据
					const preferences = (moduleType === 'book' || moduleType === 'library') ? {
						subject: grouped.subject || [],
						book_type: grouped.book_type || [],
						reading_cycle: grouped.reading_cycle || [],
						borrow_timing: grouped.borrow_timing || [],
						author: grouped.author || []
					} : moduleType === 'classroom' ? {
						equipment: grouped.equipment || [],
						floor: grouped.floor || [],
						capacity: grouped.capacity || []
					} : {
						location: grouped.location || [],
						environment: grouped.environment || [],
						facility: grouped.facility || []
					};
					
					// 🎯 生成AI洞察（智能总结）
					const insight = this.generatePreferenceInsight(preferences, moduleType, totalCount);
					
					// 第四步：生成洞察
					await updateAnalysisStep(4, 'complete', 100);
					
					// 🎯 更新为最终完成状态
					const msg = this.chatMessages.find(m => m.id === preferenceMessage.id);
					if (msg) {
						msg.analysisStage = 'complete';
						msg.preferences = preferences;
						msg.hasData = totalCount > 0;
						msg.insight = insight;
						msg.totalCount = totalCount;
						this.$forceUpdate();
					}
				} else {
					console.warn('📊 获取偏好数据失败:', response);
					// 更新为失败状态
					const msg = this.chatMessages.find(m => m.id === preferenceMessage.id);
					if (msg) {
						msg.analysisStage = 'error';
						msg.analysisSteps.forEach(step => {
							if (step.status === 'loading') step.status = 'error';
						});
						this.$forceUpdate();
					}
				}
				// 偏好分析完成，恢复自动滚动
				this.isPreferenceAnalyzing = false;
			} catch (error) {
				console.error('❌ 加载偏好数据失败:', error);
				const msg = this.chatMessages.find(m => m.id === preferenceMessage.id);
				if (msg) {
					msg.analysisStage = 'error';
					msg.analysisSteps.forEach(step => {
						if (step.status === 'loading' || step.status === 'pending') {
							step.status = 'error';
						}
					});
					msg.insight = '分析过程中遇到错误，请稍后重试';
					this.$forceUpdate();
				}
				// 🔓 异常情况也要恢复自动滚动
				this.isPreferenceAnalyzing = false;
			}
		},
		
		// 🎯 计算热度百分比（用于进度条显示）
		calculateHeatPercent(frequency, allItems) {
			if (!allItems || allItems.length === 0) return 0;
			const maxFrequency = Math.max(...allItems.map(item => item.frequency));
			return Math.max(20, (frequency / maxFrequency) * 100); // 最小20%，确保可见
		},
		
		// 🎯 计算偏好维度数量
		getPreferenceCount(preferences) {
			if (!preferences) return 0;
			let count = 0;
			Object.keys(preferences).forEach(key => {
				if (preferences[key] && preferences[key].length > 0) {
					count++;
				}
			});
			return count;
		},
		
		// 🎯 计算总关键词数量
		getTotalKeywords(preferences) {
			if (!preferences) return 0;
			let total = 0;
			Object.keys(preferences).forEach(key => {
				if (preferences[key] && preferences[key].length > 0) {
					total += preferences[key].length;
				}
			});
			return total;
		},
		
		// 🎯 生成AI洞察（智能总结用户偏好）
		generatePreferenceInsight(preferences, moduleType, totalCount) {
			if (totalCount === 0) {
				return '这是您的首次使用，系统将从本次对话开始学习您的偏好';
			}
			
			const insights = [];
			
			if (moduleType === 'studyroom') {
				// 自习室偏好洞察
				if (preferences.location && preferences.location.length > 0) {
					const topLocation = preferences.location[0].value;
					insights.push(`您偏好在${topLocation}自习`);
				}
				if (preferences.environment && preferences.environment.length > 0) {
					const envList = preferences.environment.slice(0, 2).map(e => e.value).join('、');
					insights.push(`倾向于${envList}的环境`);
				}
				if (preferences.facility && preferences.facility.length > 0) {
					const facList = preferences.facility.slice(0, 2).map(f => f.value).join('、');
					insights.push(`需要${facList}等设施`);
				}
			} else if (moduleType === 'classroom') {
				// 教室偏好洞察
				if (preferences.equipment && preferences.equipment.length > 0) {
					const eqList = preferences.equipment.slice(0, 2).map(e => e.value).join('、');
					insights.push(`常用设备：${eqList}`);
				}
				if (preferences.floor && preferences.floor.length > 0) {
					const topFloor = preferences.floor[0].value;
					insights.push(`偏好${topFloor}`);
				}
				if (preferences.capacity && preferences.capacity.length > 0) {
					const topCapacity = preferences.capacity[0].value;
					insights.push(`教室规模：${topCapacity}`);
				}
			} else if (moduleType === 'book' || moduleType === 'library') {
				// 图书偏好洞察
				if (preferences.subject && preferences.subject.length > 0) {
					const subList = preferences.subject.slice(0, 3).map(s => s.value).join('、');
					insights.push(`喜欢阅读${subList}类书籍`);
				}
				if (preferences.book_type && preferences.book_type.length > 0) {
					const typeList = preferences.book_type.slice(0, 2).map(t => t.value).join('、');
					insights.push(`偏好${typeList}`);
				}
				if (preferences.reading_cycle && preferences.reading_cycle.length > 0) {
					const cycle = preferences.reading_cycle[0].value;
					insights.push(`阅读周期：${cycle}`);
				}
				if (preferences.author && preferences.author.length > 0) {
					const authorList = preferences.author.slice(0, 2).map(a => a.value).join('、');
					insights.push(`喜欢${authorList}的作品`);
				}
			}
			
			if (insights.length === 0) {
				return `基于您的${totalCount}条历史记录，系统正在持续学习您的偏好`;
			}
			
			return `💡 基于您的${totalCount}条历史记录，AI发现：${insights.join('；')}`;
		},
		
		// 🎯 新增：切换偏好分析块的展开状态
		togglePreferenceVisibility(index) {
			const msg = this.chatMessages[index];
			if (msg && msg.type === 'preference_analysis') {
				this.$set(msg, 'isVisible', !msg.isVisible);
			}
		},
		
		// 🎯 ===== 对话管理功能 =====
		
		// 生成对话ID
		generateConversationId() {
			const timestamp = Date.now();
			const random = Math.random().toString(36).substring(2, 9);
			return `conv_${timestamp}_${random}`;
		},
		
		// 生成对话标题（基于首条用户消息）
		generateConversationTitle(messages) {
			const firstUserMessage = messages.find(msg => msg.type === 'user');
			if (firstUserMessage && firstUserMessage.content) {
				// 取前15个字符作为标题
				const title = firstUserMessage.content.substring(0, 15);
				return title.length < firstUserMessage.content.length ? title + '...' : title;
			}
			return '新对话';
		},
		
		// 保存当前对话（异步版本）
		saveCurrentConversation() {
			return new Promise((resolve) => {
				// 使用 setTimeout 将保存操作推迟到下一个事件循环
				// 避免阻塞当前的UI操作
				setTimeout(() => {
					try {
						const userInfo = uni.getStorageSync('userInfo');
						const userId = userInfo?.studentId || userInfo?.userId;
						if (!userId || !this.currentConversationId) {
							console.warn('无法保存对话：缺少用户ID或对话ID');
							resolve();
							return;
						}
						
						// 生成对话标题
						if (!this.conversationTitle || this.conversationTitle === '新对话') {
							this.conversationTitle = this.generateConversationTitle(this.chatMessages);
						}
						
						// 保存当前对话数据
						const conversationData = {
							id: this.currentConversationId,
							title: this.conversationTitle,
							messages: this.chatMessages,
							sessionId: this.sessionId,
							updatedAt: Date.now(),
							createdAt: this.conversationCreatedAt || Date.now()
						};
						
						const conversationKey = `conversation_${userId}_${this.currentConversationId}`;
						uni.setStorageSync(conversationKey, conversationData);
						
						// 更新对话列表索引
						this.updateConversationIndex(userId, conversationData);
						
						console.log('💾 已保存对话:', this.conversationTitle);
						resolve();
					} catch (error) {
						console.warn('保存对话失败:', error);
						resolve();
					}
				}, 0);
			});
		},
		
		// 更新对话列表索引
		updateConversationIndex(userId, conversationData) {
			try {
				const indexKey = `conversation_index_${userId}`;
				let conversationIndex = uni.getStorageSync(indexKey) || [];
				
				// 查找是否已存在
				const existingIndex = conversationIndex.findIndex(item => item.id === conversationData.id);
				
				const indexItem = {
					id: conversationData.id,
					title: conversationData.title,
					updatedAt: conversationData.updatedAt,
					createdAt: conversationData.createdAt
				};
				
				if (existingIndex >= 0) {
					// 更新现有记录
					conversationIndex[existingIndex] = indexItem;
				} else {
					// 添加新记录
					conversationIndex.unshift(indexItem);
				}
				
				// 保持最多50条记录
				if (conversationIndex.length > 50) {
					conversationIndex = conversationIndex.slice(0, 50);
				}
				
				uni.setStorageSync(indexKey, conversationIndex);
			} catch (error) {
				console.warn('更新对话索引失败:', error);
			}
		},
		
		// 加载指定对话
		loadConversation(conversationId) {
			if (!conversationId) {
				console.warn('无效的对话ID');
				return;
			}
			
			// 重置滚动状态，确保加载对话后能正常滚动到底部
			this.isUserScrolling = false;
			this.showBackToBottom = false;
			// 停止滚动锁定监控
			this.stopScrollLockMonitor();
			
			try {
				const userInfo = uni.getStorageSync('userInfo');
				const userId = userInfo?.studentId || userInfo?.userId;
				if (!userId) {
					console.warn('未找到用户ID');
					return;
				}
				
				const conversationKey = `conversation_${userId}_${conversationId}`;
				const conversationData = uni.getStorageSync(conversationKey);
				
				if (conversationData && conversationData.messages) {
					this.chatMessages = conversationData.messages;
					this.conversationTitle = conversationData.title || '新对话';
					this.sessionId = conversationData.sessionId;
					this.conversationCreatedAt = conversationData.createdAt;
					
					console.log(`📥 加载对话: ${this.conversationTitle} (${this.chatMessages.length}条消息)`);
					
					this.$nextTick(() => {
						this.scrollToBottom();
					});
				} else {
					console.log('📝 新对话，从欢迎消息开始');
				}
			} catch (error) {
				console.warn('加载对话失败:', error);
			}
		},
		
		// 创建新对话
		createNewConversation() {
			// 先保存当前对话
			if (this.chatMessages.length > 1) { // 有对话内容才保存
				this.saveCurrentConversation();
			}
			
			// 重新加载页面（创建新对话）
			uni.reLaunch({
				url: '/pages/assistant/index'
			});
		},
		
		// 查看历史对话列表（弹窗）- 极致优化版
		viewConversationHistory() {
			console.log('🔍 打开历史对话列表');
			const startTime = Date.now();
			
			// 禁用滚动事件处理，避免干扰
			this._scrollHandlingEnabled = false;
			
			// 清理滚动相关的定时器
			if (this._scrollTimeout) {
				clearTimeout(this._scrollTimeout);
				this._scrollTimeout = null;
			}
			
			// 立即加载对话列表（轻量级操作）
			this.loadConversationList();
			
			// 立即显示弹窗（不等待保存完成）
			this.showHistoryPopup = true;
			console.log(`✅ 历史对话弹窗已显示 (${Date.now() - startTime}ms)`);
			
			// 异步保存当前对话（不阻塞UI）
			if (this.chatMessages.length > 1) {
				this.saveCurrentConversation().then(() => {
					// 保存完成后重新加载列表，确保最新数据
					this.loadConversationList();
					console.log(`💾 后台保存完成 (${Date.now() - startTime}ms)`);
				});
			}
		},
		
		// 加载对话列表
		loadConversationList() {
			try {
				const userInfo = uni.getStorageSync('userInfo');
				const userId = userInfo?.studentId || userInfo?.userId;
				if (!userId) {
					console.warn('未找到用户ID');
					return;
				}
				
				const indexKey = `conversation_index_${userId}`;
				this.conversationList = uni.getStorageSync(indexKey) || [];
				
				console.log('📋 加载了', this.conversationList.length, '条历史对话');
			} catch (error) {
				console.warn('加载对话列表失败:', error);
				this.conversationList = [];
			}
		},
		
		// 关闭历史对话弹窗
		closeHistoryPopup() {
			this.showHistoryPopup = false;
			// 重新启用滚动事件处理
			this._scrollHandlingEnabled = true;
			console.log('❌ 关闭历史对话弹窗');
		},
		
		// 切换到指定对话
		switchToConversation(conversationId) {
			if (conversationId === this.currentConversationId) {
				// 已经是当前对话，直接关闭弹窗
				this.closeHistoryPopup();
				return;
			}
			
			// 保存当前对话
			if (this.chatMessages.length > 1) {
				this.saveCurrentConversation();
			}
			
			// 切换到新对话
			this.currentConversationId = conversationId;
			this.loadConversation(conversationId);
			
			// 重置偏好分析标志
			this.hasShownPreferenceAnalysis = false;
			
			// 关闭弹窗
			this.closeHistoryPopup();
			
			uni.showToast({
				title: '已切换对话',
				icon: 'success',
				duration: 1500
			});
		},
		
		// 删除对话
		deleteConversation(conversationId, index) {
			uni.showModal({
				title: '确认删除',
				content: '确定要删除这条对话记录吗？',
				success: (res) => {
					if (res.confirm) {
						try {
							const userInfo = uni.getStorageSync('userInfo');
							const userId = userInfo?.studentId || userInfo?.userId;
							if (!userId) return;
							
							// 删除对话数据
							const conversationKey = `conversation_${userId}_${conversationId}`;
							uni.removeStorageSync(conversationKey);
							
							// 从索引中移除
							const indexKey = `conversation_index_${userId}`;
							let conversationIndex = uni.getStorageSync(indexKey) || [];
							conversationIndex = conversationIndex.filter(item => item.id !== conversationId);
							uni.setStorageSync(indexKey, conversationIndex);
							
							// 从列表中移除
							this.conversationList.splice(index, 1);
							
							// 如果删除的是当前对话，创建新对话
							if (conversationId === this.currentConversationId) {
								this.createNewConversation();
							}
							
							uni.showToast({
								title: '已删除',
								icon: 'success'
							});
						} catch (error) {
							console.error('删除对话失败:', error);
							uni.showToast({
								title: '删除失败',
								icon: 'none'
							});
						}
					}
				}
			});
		},
		
		// 格式化时间
		formatTime(timestamp) {
			if (!timestamp) return '';
			
			const now = Date.now();
			const diff = now - timestamp;
			const minute = 60 * 1000;
			const hour = 60 * minute;
			const day = 24 * hour;
			
			if (diff < minute) {
				return '刚刚';
			} else if (diff < hour) {
				return Math.floor(diff / minute) + '分钟前';
			} else if (diff < day) {
				return Math.floor(diff / hour) + '小时前';
			} else if (diff < 7 * day) {
				return Math.floor(diff / day) + '天前';
			} else {
				const date = new Date(timestamp);
				return `${date.getMonth() + 1}/${date.getDate()}`;
			}
		},
		
		// 🎯 ===== 对话管理功能结束 =====
		
		// 🎯 新增：切换AI偏好分析功能
		togglePreferenceAnalysis() {
			this.enablePreferenceAnalysis = !this.enablePreferenceAnalysis;
			uni.showToast({
				title: this.enablePreferenceAnalysis ? 'AI偏好分析已开启' : 'AI偏好分析已关闭',
				icon: 'none',
				duration: 1500
			});
			console.log('🔄 AI偏好分析开关:', this.enablePreferenceAnalysis ? '开启' : '关闭');
		},
		
		// 🎯 新增：统一的WebSocket关闭方法
		closeWebSocket() {
			// 关闭WebSocket连接
		if (this.websocketTask) {
				try {
			this.websocketTask.close({
				code: 1000,
						reason: '页面离开'
			});
					this.websocketTask = null;
					this.websocketConnected = false;
					console.log('✅ WebSocket已关闭');
				} catch (error) {
					console.warn('关闭WebSocket失败:', error);
		}
			}
			
		// 清除重连定时器
		if(this.reconnectInterval) {
			clearInterval(this.reconnectInterval);
			this.reconnectInterval = null;
		}
			
			// 清除心跳定时器
		this.stopHeartbeat();
		}
	},
	
	// 监听chatMessages变化，立即恢复锁定位置
	watch: {
		chatMessages: {
			handler() {
				// 如果用户在手动滚动模式，立即恢复锁定位置
				if (this.isUserScrolling && this._lockedScrollTop > 0) {
					this.$nextTick(() => {
						this.scrollTop = this._lockedScrollTop;
					});
				}
			},
			deep: true
		}
	},
	
	// 🎯 新增：页面隐藏时关闭WebSocket（解决连接累积问题）
	onHide() {
		console.log('📴 页面隐藏，关闭WebSocket连接');
		this.closeWebSocket();
		
		// 🎯 新增：保存当前对话到本地缓存
		this.saveCurrentConversation();
	},
	
	// 🎯 新增：页面显示时恢复对话记录（不自动重连WebSocket）
	onShow() {
		console.log('📱 页面显示');
		
		// 🎯 恢复当前对话记录（基于conversationId）
		this.loadConversation(this.currentConversationId);
		
		// ⚠️ 不在这里重连WebSocket
		// 原因：onLoad已经处理了初始化和连接，onShow时重连会导致连接累积
	},
	
	onUnload() {
		console.log('🔚 页面卸载');
		this.closeWebSocket();
		// 清理滚动定时器
		if (this._scrollTimeout) {
			clearTimeout(this._scrollTimeout);
			this._scrollTimeout = null;
		}
		if (this._scrollActivityTimeout) {
			clearTimeout(this._scrollActivityTimeout);
			this._scrollActivityTimeout = null;
		}
		// 清理滚动锁定监控
		this.stopScrollLockMonitor();
	}
}
</script>

<style scoped>
/* ... existing styles ... */
.assistant-page {
	display: flex;
	flex-direction: column;
	height: 100vh;
	background-color: #f5f5f5;
	padding-bottom: env(safe-area-inset-bottom);
}


/* 快捷指令菜单样式 - 现在放在底部 */
.quick-access-menu {
	background-color: #ffffff;
	padding: 20rpx 0;
	border-top: 1rpx solid #e0e0e0;
	box-shadow: 0 -2rpx 6rpx rgba(0, 0, 0, 0.1);
	position: fixed;
	bottom: 110rpx;
	left: 0;
	right: 0;
	z-index: 10;
}

.menu-scroll {
	white-space: nowrap;
	padding: 0 20rpx;
}

.menu-item {
	display: inline-block;
	text-align: center;
	margin-right: 30rpx;
	width: 120rpx;
}

.menu-icon {
	width: 80rpx;
	height: 80rpx;
	margin: 0 auto;
	background-color: #e6f2ff;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
}

.menu-icon image {
	width: 50rpx;
	height: 50rpx;
}

.menu-text {
	font-size: 24rpx;
	color: #333;
	margin-top: 10rpx;
}

/* 回到底部按钮 */
.back-to-bottom-btn {
	position: fixed;
	right: 30rpx;
	bottom: 580rpx;
	z-index: 100;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: white;
	padding: 16rpx 24rpx;
	border-radius: 50rpx;
	box-shadow: 0 8rpx 16rpx rgba(102, 126, 234, 0.4);
	display: flex;
	align-items: center;
	gap: 8rpx;
	font-size: 28rpx;
	font-weight: 500;
	animation: slideIn 0.3s ease-out;
	cursor: pointer;
	transition: all 0.3s ease;
}

.back-to-bottom-btn:active {
	transform: scale(0.95);
	box-shadow: 0 4rpx 8rpx rgba(102, 126, 234, 0.3);
}

.btn-icon {
	font-size: 32rpx;
	font-weight: bold;
	line-height: 1;
}

.btn-text {
	font-size: 28rpx;
	line-height: 1;
}

@keyframes slideIn {
	from {
		opacity: 0;
		transform: translateY(20rpx);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

/* 聊天窗口 */
.chat-container {
	flex: 1;
	padding: 20rpx;
	padding-bottom: 450rpx;
	overflow-y: auto;
}

.chat-list {
	padding-bottom: 20rpx;
}

.chat-item {
	display: flex;
	margin-bottom: 30rpx;
}

.user-message {
	flex-direction: row-reverse;
}

.avatar {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	overflow: hidden;
	flex-shrink: 0;
}

.avatar image {
	width: 100%;
	height: 100%;
}

.message-bubble {
	max-width: 70%;
	padding: 20rpx;
	border-radius: 20rpx;
	margin: 0 20rpx;
	word-break: break-all;
	background-color: #ffffff;
	box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
}

.system-message .message-bubble {
	background-color: #E6F2FF;
	color: #333;
	border-top-left-radius: 0;
}

.user-message .message-bubble {
	background-color: #ffffff;
	color: #333333;
	border-top-right-radius: 0;
}

/* New Styles for Thinking Process */
.thinking-process-container {
	margin: 20rpx 0;
	padding: 20rpx;
	background-color: #ffffff;
	border-radius: 20rpx;
	box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.08);
}

.thinking-header {
	display: flex;
	align-items: center;
	margin-bottom: 20rpx;
}

.spinner {
	width: 32rpx;
	height: 32rpx;
	border: 4rpx solid #007AFF;
	border-top-color: transparent;
	border-radius: 50%;
	animation: spin 1s linear infinite;
	margin-right: 20rpx;
}

@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}

.status-icon-completed {
	width: 40rpx;
	height: 40rpx;
	margin-right: 16rpx;
}

.thinking-title {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
}

.steps-list {
	display: flex;
	flex-direction: column;
	gap: 10rpx;
}

.step-item {
	background-color: #f8f8f8;
	border-radius: 15rpx;
	overflow: hidden;
}

.step-header {
	display: flex;
	align-items: center;
	padding: 20rpx;
	cursor: pointer;
}

.step-icon {
	width: 32rpx;
	height: 32rpx;
	margin-right: 16rpx;
	flex-shrink: 0;
}

.step-title {
	flex: 1;
	font-size: 26rpx;
	color: #555;
}

.arrow-icon {
	width: 30rpx;
	height: 30rpx;
	transition: transform 0.2s ease-in-out;
}

.arrow-icon.expanded {
	transform: rotate(90deg);
}

.step-content {
	padding: 0 20rpx 20rpx 68rpx;
	background-color: #f8f8f8;
	font-size: 24rpx;
	color: #666;
	word-break: break-all;
}

.step-content pre {
	white-space: pre-wrap;
	font-family: 'Courier New', Courier, monospace;
	background-color: #efefef;
	padding: 15rpx;
	border-radius: 10rpx;
}

/* 任务面板 */
.task-panel {
	background-color: #ffffff;
	padding: 20rpx;
	border-top: 1rpx solid #e0e0e0;
	border-bottom: 1rpx solid #e0e0e0;
	position: fixed;
	bottom: 264rpx;
	left: 0;
	right: 0;
	z-index: 9;
}

.panel-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.panel-title {
	font-size: 28rpx;
	font-weight: bold;
 color: #333;
}

/* AI偏好分析开关 */
.ai-preference-toggle {
	display: flex;
	align-items: center;
	gap: 12rpx;
}

.toggle-label {
	font-size: 24rpx;
	color: #666;
	white-space: nowrap;
}

.toggle-switch {
	position: relative;
	width: 80rpx;
	height: 40rpx;
	background-color: #dcdcdc;
	border-radius: 20rpx;
	transition: background-color 0.3s ease;
	cursor: pointer;
}

.toggle-switch.active {
	background-color: #1890ff;
}

.toggle-slider {
	position: absolute;
	top: 4rpx;
	left: 4rpx;
	width: 32rpx;
	height: 32rpx;
	background-color: #ffffff;
	border-radius: 50%;
	transition: transform 0.3s ease;
	box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.2);
}

.toggle-switch.active .toggle-slider {
	transform: translateX(40rpx);
	}

	.task-scroll {
		white-space: nowrap;
	}

	.task-card {
	display: inline-block;
	width: 450rpx;
		background-color: #ffffff;
		border-radius: 20rpx;
 padding: 20rpx;
		margin-right: 20rpx;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
		position: relative;
	}

	.task-icon {
 width: 60rpx;
	height: 60rpx;
	position: absolute;
	top: 20rpx;
	left: 20rpx;
}

.task-icon image {
			width: 100%;
			height: 100%;
	}

 .task-info {
 margin-left: 80rpx;
	}

 .task-title {
 font-size: 28rpx;
	font-weight: bold;
 color: #333;
	}

 .task-desc {
		font-size: 24rpx;
 color: #666;
 margin: 10rpx 0;
	}

 .progress-bar {
	height: 10rpx;
	background-color: #f0f0f0;
	border-radius: 5rpx;
		overflow: hidden;
 margin: 10rpx 0;
	}

 .progress-fill {
		height: 100%;
 background-color: #007AFF;
	}
	
 .task-time {
	font-size: 24rpx;
		color: #999;
	}

 .task-status {
		position: absolute;
 top: 20rpx;
	right: 20rpx;
 padding: 5rpx 10rpx;
	border-radius: 10rpx;
		font-size: 22rpx;
}

.task-status.processing {
	background-color: #e6f2ff;
	color: #007AFF;
}

.task-status.ready {
	background-color: #e6fff2;
	color: #00B578;
}

.task-status.warning {
	background-color: #fff9e6;
	color: #FF9500;
}

/* 底部输入区域 */
.input-area {
	background-color: #ffffff;
	padding: 20rpx;
	border-top: 1rpx solid #e0e0e0;
	display: flex;
		align-items: center;
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 20;
}

.mic-btn, .attach-btn, .send-btn {
	width: 60rpx;
	height: 60rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	flex-shrink: 0;
}

.mic-btn image, .attach-btn image, .send-btn image {
	width: 40rpx;
	height: 40rpx;
}

.text-input {
	flex: 1;
	height: 70rpx;
	background-color: #f5f5f5;
	border-radius: 35rpx;
	padding: 0 20rpx;
	margin: 0 10rpx;
	font-size: 28rpx;
}

/* 🎯 对话管理按钮组 */
.conversation-actions {
	display: flex;
	gap: 10rpx;
	margin: 0 8rpx;
	flex-shrink: 0;
}

.action-btn {
	width: 70rpx;
	height: 70rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: #f5f5f5;
	border-radius: 50%;
	transition: all 0.2s ease;
}

.action-btn:active {
	background-color: #e0e0e0;
	transform: scale(0.92);
}

.action-icon {
	width: 40rpx;
	height: 40rpx;
	opacity: 0.7;
}

.link-style {
	color: #007AFF;
	text-decoration: underline;
	cursor: pointer;
}

/* 🎯 偏好分析块样式（嵌入式，淡色系） */
.preference-analysis-container {
	margin: 20rpx 20rpx 20rpx 20rpx;
	background: #ffffff;
	border-radius: 12rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
	border: 1px solid #e8e8e8;
	overflow: hidden;
}

.analysis-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20rpx 24rpx;
	background: #fafafa;
	border-bottom: 1px solid #f0f0f0;
}

.analysis-title {
	font-size: 28rpx;
	font-weight: 600;
	color: #333;
}

.header-actions {
	display: flex;
	align-items: center;
}

.collapse-btn {
	display: flex;
	align-items: center;
	gap: 6rpx;
	padding: 8rpx 16rpx;
	background: #ffffff;
	border: 1px solid #d9d9d9;
	border-radius: 4rpx;
	cursor: pointer;
	transition: all 0.2s ease;
}

.collapse-btn:hover {
	background: #f5f5f5;
	border-color: #1890ff;
}

.collapse-text {
	font-size: 24rpx;
	color: #666;
}

.collapse-icon {
	font-size: 20rpx;
	color: #999;
}

.analysis-content {
	padding: 24rpx;
	background: #ffffff;
}

/* AI深度思考样式 - 类似大模型thinking */
.ai-thinking {
	background: linear-gradient(135deg, #fafbfc 0%, #f5f7fa 100%);
	border-radius: 8rpx;
	padding: 24rpx;
	border: 1px solid #e8e8e8;
}

.thinking-header {
	display: flex;
	align-items: center;
	gap: 12rpx;
	margin-bottom: 20rpx;
	padding-bottom: 16rpx;
	border-bottom: 2px solid #e8e8e8;
}

.thinking-indicator {
	display: flex;
	gap: 6rpx;
}

.thinking-dot {
	width: 8rpx;
	height: 8rpx;
	background: #1890ff;
	border-radius: 50%;
	animation: thinking-pulse 1.4s ease-in-out infinite;
}

.thinking-dot:nth-child(2) {
	animation-delay: 0.2s;
}

.thinking-dot:nth-child(3) {
	animation-delay: 0.4s;
}

@keyframes thinking-pulse {
	0%, 60%, 100% { opacity: 0.3; transform: scale(0.8); }
	30% { opacity: 1; transform: scale(1); }
}

.thinking-title {
	font-size: 28rpx;
	font-weight: 600;
	color: #333;
	letter-spacing: 0.5rpx;
}

/* 思考步骤 */
.thinking-content {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

.thinking-step {
	padding: 16rpx;
	background: #ffffff;
	border-radius: 6rpx;
	border-left: 3rpx solid #e8e8e8;
	transition: all 0.3s ease;
	opacity: 0.4;
}

.thinking-step.step-active {
	opacity: 1;
	border-left-color: #1890ff;
	background: #f0f7ff;
	box-shadow: 0 2rpx 8rpx rgba(24, 144, 255, 0.1);
}

.thinking-step.step-done {
	opacity: 1;
	border-left-color: #52c41a;
}

.step-header {
	display: flex;
	align-items: center;
	gap: 12rpx;
	margin-bottom: 8rpx;
}

.step-status {
	width: 28rpx;
	height: 28rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
}

.status-spinner {
	width: 16rpx;
	height: 16rpx;
	border: 2rpx solid #1890ff;
	border-top-color: transparent;
	border-radius: 50%;
	animation: spin 0.8s linear infinite;
}

@keyframes spin {
	to { transform: rotate(360deg); }
}

.status-check {
	width: 24rpx;
	height: 24rpx;
	background: #52c41a;
	color: #ffffff;
	font-size: 16rpx;
	font-weight: bold;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	animation: checkBounce 0.4s ease-out;
}

@keyframes checkBounce {
	0% { transform: scale(0); }
	50% { transform: scale(1.2); }
	100% { transform: scale(1); }
}

.status-dot {
	font-size: 32rpx;
	color: #d9d9d9;
	line-height: 1;
}

.step-title {
	font-size: 26rpx;
	font-weight: 600;
	color: #333;
}

.step-detail {
	padding-left: 40rpx;
	margin-top: 8rpx;
}

.detail-text {
	font-size: 24rpx;
	line-height: 1.8;
	color: #666;
	text-align: justify;
}

/* 分析结果展示 */
.analysis-result {
	margin-top: 24rpx;
	padding-top: 24rpx;
	border-top: 2px solid #e8e8e8;
	animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
	from { opacity: 0; transform: translateY(20rpx); }
	to { opacity: 1; transform: translateY(0); }
}

/* 数据统计 */
.result-stats {
	margin-bottom: 20rpx;
}

.stats-header {
	display: flex;
	align-items: center;
	gap: 8rpx;
	margin-bottom: 16rpx;
}

.stats-icon {
	font-size: 28rpx;
}

.stats-title {
	font-size: 26rpx;
	font-weight: 600;
	color: #333;
}

.stats-grid {
	display: flex;
	gap: 12rpx;
}

.stat-card {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 20rpx 12rpx;
	background: linear-gradient(135deg, #e6f7ff 0%, #f0f9ff 100%);
	border-radius: 8rpx;
	border: 1px solid #91d5ff;
}

.stat-value {
	font-size: 36rpx;
	font-weight: 700;
	color: #1890ff;
	line-height: 1;
	margin-bottom: 8rpx;
}

.stat-label {
	font-size: 22rpx;
	color: #666;
	text-align: center;
	line-height: 1.3;
}

/* AI洞察 */
.result-insight {
	margin-bottom: 20rpx;
	padding: 20rpx;
	background: linear-gradient(135deg, #fff7e6 0%, #fffbf0 100%);
	border-radius: 8rpx;
	border: 1px solid #ffd591;
}

.insight-header {
	display: flex;
	align-items: center;
	gap: 8rpx;
	margin-bottom: 12rpx;
	padding-bottom: 12rpx;
	border-bottom: 1px solid #ffd591;
}

.insight-icon {
	font-size: 28rpx;
}

.insight-title {
	font-size: 26rpx;
	font-weight: 600;
	color: #d48806;
}

.insight-content {
	font-size: 26rpx;
	line-height: 1.9;
	color: #595959;
	text-align: justify;
}

/* 分析方法说明 */
.result-methodology {
	padding: 20rpx;
	background: #f7f7f7;
	border-radius: 8rpx;
	border: 1px solid #e8e8e8;
}

.method-header {
	display: flex;
	align-items: center;
	gap: 8rpx;
	margin-bottom: 12rpx;
	padding-bottom: 12rpx;
	border-bottom: 1px solid #d9d9d9;
}

.method-icon {
	font-size: 28rpx;
}

.method-title {
	font-size: 26rpx;
	font-weight: 600;
	color: #333;
}

.method-text {
	font-size: 24rpx;
	line-height: 1.9;
	color: #666;
	text-align: justify;
}

/* 错误提示样式 */
.analysis-error {
	background: #fff1f0;
	padding: 16rpx;
	border-radius: 10rpx;
	border-left: 4rpx solid #ff4d4f;
	margin-bottom: 20rpx;
}

.error-text {
	font-size: 24rpx;
	color: #ff4d4f;
	line-height: 1.6;
}

/* 偏好类别样式 - 简约风格 */
.pref-category {
	margin-bottom: 20rpx;
	padding: 16rpx;
	background: #fafafa;
	border-radius: 8rpx;
	border: 1px solid #f0f0f0;
}

.fade-in {
	/* 保留类名，用于未来扩展 */
}

.category-title {
	display: flex;
	align-items: center;
	margin-bottom: 16rpx;
	padding-bottom: 8rpx;
	border-bottom: 1px solid #e8e8e8;
}

.category-icon {
	font-size: 28rpx;
	margin-right: 8rpx;
}

.category-text {
	font-size: 26rpx;
	font-weight: 600;
	color: #333;
}

.category-note {
	font-size: 20rpx;
	color: #999999;
	font-weight: 400;
}

.pref-tags {
	display: flex;
	flex-direction: column;
	gap: 12rpx;
}

/* 🎯 新版偏好标签样式 - 简约风格 */
.pref-tag-item {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
	padding: 12rpx 16rpx;
	border-radius: 6rpx;
	background-color: #ffffff;
	border: 1px solid #e8e8e8;
	transition: all 0.2s ease;
}

.tag-info {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.tag-name {
	font-size: 26rpx;
	font-weight: 500;
	color: #333;
}

.tag-count {
	font-size: 20rpx;
	color: #999;
	margin-left: 8rpx;
	padding: 2rpx 8rpx;
	background-color: #f5f5f5;
	border-radius: 4rpx;
}

/* 热度进度条 - 简约风格 */
.tag-heatbar {
	width: 100%;
	height: 4rpx;
	background-color: #e8e8e8;
	border-radius: 2rpx;
	overflow: hidden;
}

.heatbar-fill {
	height: 100%;
	background: #1890ff;
	border-radius: 2rpx;
	transition: width 0.3s ease-out;
}

/* 旧版偏好标签样式（废弃，保留兼容） */
.pref-tag {
	display: flex;
	align-items: center;
	gap: 6rpx;
	padding: 6rpx 14rpx;
	border-radius: 20rpx;
	font-size: 22rpx;
	background-color: #ffffff;
	box-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.08);
}

.pref-tag.location {
	color: #1890ff;
	border: 1px solid #d6e4ff;
	background-color: #f0f7ff;
}

.pref-tag.environment {
	color: #52c41a;
	border: 1px solid #d9f7be;
	background-color: #f6ffed;
}

.pref-tag.facility {
	color: #fa8c16;
	border: 1px solid #ffe7ba;
	background-color: #fffbe6;
}

/* 教室预约偏好标签样式 */
.pref-tag.equipment {
	color: #1890ff;
	border: 1px solid #d6e4ff;
	background-color: #f0f7ff;
}

.pref-tag.floor {
	color: #722ed1;
	border: 1px solid #efdbff;
	background-color: #f9f0ff;
}

.pref-tag.capacity {
	color: #eb2f96;
	border: 1px solid #ffd6e7;
	background-color: #fff0f6;
}

/* 图书推荐偏好标签样式 */
.pref-tag.subject {
	color: #1890ff;
	border: 1px solid #d6e4ff;
	background-color: #f0f7ff;
}

.pref-tag.book-type {
	color: #52c41a;
	border: 1px solid #d9f7be;
	background-color: #f6ffed;
}

.pref-tag.reading-cycle {
	color: #fa8c16;
	border: 1px solid #ffe7ba;
	background-color: #fffbe6;
}

.pref-tag.borrow-timing {
	color: #722ed1;
	border: 1px solid #efdbff;
	background-color: #f9f0ff;
}

.pref-tag.author {
	color: #eb2f96;
	border: 1px solid #ffd6e7;
	background-color: #fff0f6;
}

/* 空状态样式 - 简约风格 */
.pref-empty {
	padding: 20rpx;
	text-align: center;
	background-color: #fafafa;
	border-radius: 6rpx;
	margin-bottom: 16rpx;
	border: 1px dashed #d9d9d9;
}

.pref-empty .empty-text {
	font-size: 24rpx;
	color: #999;
	line-height: 1.6;
}

.tag-name {
	font-weight: 400;
}

.tag-count {
	background-color: rgba(0, 0, 0, 0.06);
	color: #666666;
	padding: 2rpx 8rpx;
	border-radius: 12rpx;
	font-size: 18rpx;
	font-weight: 500;
}

/* 提示文本 - 简约风格 */
.analysis-tip {
	margin-top: 20rpx;
	padding: 12rpx 16rpx;
	background: #f7f7f7;
	border-radius: 6rpx;
	border-left: 3rpx solid #1890ff;
	text-align: center;
	font-size: 24rpx;
	color: #666;
	line-height: 1.6;
}

/* 🎯 历史对话弹窗样式 */
.history-popup-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	z-index: 999;
	display: flex;
	align-items: flex-end;
}

.history-popup {
	width: 100%;
	max-height: 70vh;
	background-color: #ffffff;
	border-radius: 32rpx 32rpx 0 0;
	display: flex;
	flex-direction: column;
	animation: slideUp 0.3s ease;
}

@keyframes slideUp {
	from {
		transform: translateY(100%);
	}
	to {
		transform: translateY(0);
	}
}

.popup-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 30rpx 40rpx;
	border-bottom: 1rpx solid #e0e0e0;
}

.popup-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
}

.close-btn {
	width: 50rpx;
	height: 50rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 40rpx;
	color: #999999;
}

.conversation-list {
	flex: 1;
	padding: 20rpx;
}

.conversation-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 24rpx 30rpx;
	margin-bottom: 16rpx;
	background-color: #f8f9fa;
	border-radius: 16rpx;
	transition: all 0.2s ease;
}

.conversation-item.active {
	background-color: #e6f4ff;
	border: 2rpx solid #91caff;
}

.conversation-item.active .conv-title {
	color: #1677ff;
	font-weight: 600;
}

.conversation-item.active .conv-time {
	color: #1677ff;
	opacity: 0.7;
}

.conversation-item:active {
	transform: scale(0.98);
	opacity: 0.8;
}

.conv-main {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.conv-title {
	font-size: 28rpx;
	font-weight: 500;
	color: #333333;
}

.conv-time {
	font-size: 22rpx;
	color: #999999;
}

.conv-actions {
	margin-left: 20rpx;
}

.delete-btn {
	padding: 10rpx 20rpx;
	background-color: #ff4d4f;
	border-radius: 8rpx;
	font-size: 24rpx;
	color: #ffffff;
}

.delete-btn:active {
	opacity: 0.7;
}

.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 100rpx 40rpx;
}

.empty-icon {
	width: 200rpx;
	height: 200rpx;
	margin-bottom: 30rpx;
	opacity: 0.3;
}

.empty-text {
	font-size: 28rpx;
	color: #999999;
}
</style> 
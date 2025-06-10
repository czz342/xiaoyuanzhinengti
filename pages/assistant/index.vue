<template>
	<view class="assistant-page">
		<!-- 聊天窗口 -->
		<scroll-view scroll-y="true" class="chat-container" :scroll-into-view="lastMessageId" :scroll-with-animation="true">
			<view class="chat-list">
				<view v-for="(msg, index) in chatMessages" :key="index" class="chat-item" :id="'msg-' + index" :class="{ 'user-message': msg.role === 'user', 'assistant-message': msg.role === 'assistant' }">
					<view class="avatar">
						<image :src="msg.role === 'user' ? userAvatar : botAvatar" mode="aspectFill"></image>
					</view>
					<view class="message-bubble">
						<!-- 普通文本消息 -->
						<template v-if="msg.type === 'text'">
							<text class="message-text">{{msg.payload.text}}</text>
						</template>

						<!-- 卡片消息 -->
						<template v-else-if="msg.type === 'card'">
							<view class="card-message">
								<view class="card-title" v-if="msg.payload.title">{{ msg.payload.title }}</view>
								<view class="card-body">
									<view v-for="(item, itemIndex) in msg.payload.items" :key="itemIndex" class="card-item">
										<text v-if="item.type === 'heading'" class="card-item-heading">{{ item.text }}</text>
										<view v-if="item.type === 'field'" class="card-item-field" :class="{ 'is-link': item.path }" @tap="navigateTo(item.path)">
											<text class="field-label">{{ item.label }}:</text>
											<text class="field-value">{{ item.value }}</text>
										</view>
									</view>
									<image v-if="msg.payload.qrCode" :src="msg.payload.qrCode" class="card-qrcode" mode="widthFix"></image>
								</view>
								<view class="card-footer" v-if="msg.payload.footer">{{ msg.payload.footer }}</view>
								<view class="card-buttons" v-if="msg.payload.buttons">
									<button v-for="(btn, btnIndex) in msg.payload.buttons" :key="btnIndex" class="card-button" @tap="handleCardButton(btn)">{{ btn.text }}</button>
								</view>
							</view>
						</template>

						<!-- 富文本内容消息 -->
						<template v-else-if="msg.type === 'richContent'">
							<view class="rich-content-message">
								<view class="rich-title" v-if="msg.payload.title">{{ msg.payload.title }}</view>
								<view class="rich-list" v-if="msg.payload.list">
									<view v-for="(item, itemIndex) in msg.payload.list" :key="itemIndex" class="rich-list-item is-link" @tap="navigateTo(item.path)">{{ item.text }}</view>
								</view>
								<image v-if="msg.payload.image" :src="msg.payload.image" class="rich-image" mode="widthFix"></image>
								<view class="rich-suggestion" v-if="msg.payload.suggestion">{{ msg.payload.suggestion }}</view>
							</view>
						</template>
						
						<!-- 包裹消息 -->
						<template v-else-if="msg.type === 'parcel'">
							<view class="parcel-message">
								<view class="parcel-title">{{ msg.payload.title }}</view>
								<view v-for="(parcel, pIndex) in msg.payload.parcels" :key="pIndex" class="parcel-item is-link" @tap="navigateTo(parcel.path)">
									<view class="parcel-item-title">{{ parcel.title }}</view>
									<view class="parcel-info">地点: {{ parcel.location }}</view>
									<view class="parcel-info">取件码: <text class="parcel-code">{{ parcel.code }}</text></view>
								</view>
							</view>
						</template>

						<!-- 列表消息 -->
						<template v-else-if="msg.type === 'list'">
							<view class="list-message">
								<view class="list-title">{{ msg.payload.title }}</view>
								<view v-for="(item, itemIndex) in msg.payload.items" :key="itemIndex" class="list-item is-link" @tap="navigateTo(item.path)">
									<text>{{ itemIndex + 1 }}. </text>
									<text>{{ item.text }}</text>
								</view>
							</view>
						</template>
						
					</view>
				</view>
		
				<!-- 加载中提示 -->
				<view v-if="isTyping" class="chat-item assistant-message">
					<view class="avatar">
						<image :src="botAvatar" mode="aspectFill"></image>
					</view>
					<view class="message-bubble">
						<view class="typing-indicator">
							<view class="dot"></view>
							<view class="dot"></view>
							<view class="dot"></view>
						</view>
					</view>
				</view>
				</view>
			</scroll-view>
		
		<!-- 动态任务追踪面板 -->
		<view class="task-panel" v-if="ongoingTasks.length > 0">
			<text class="panel-title">进行中的任务</text>
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
			<input type="text" class="text-input" v-model="inputMessage" placeholder="问点什么..." @confirm="handleSendMessage"/>
			<button class="send-btn" @tap="handleSendMessage" :disabled="isTyping || !inputMessage">发送</button>
		</view>
	</view>
</template>

<script>
import MockAssistantService from '@/services/mockAssistant.js'

export default {
	data() {
		return {
			inputMessage: '',
			userAvatar: '/static/images/avatar.png',
			botAvatar: '/static/images/assistant.png',
			chatMessages: [],
			isTyping: false,
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
			quickAccessItems: [
				{
					text: '查课表',
					icon: '/static/images/schedule.png',
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
		}
	},
	computed: {
		lastMessageId() {
			if (this.chatMessages.length === 0) {
				return '';
			}
			return `msg-${this.chatMessages.length - 1}`;
		}
	},
	onLoad() {
		this.chatMessages.push({
			role: 'assistant',
			type: 'text',
			payload: {
				text: '您好！我是校园智能体，有什么可以帮助您的吗？'
			}
		});
	},
	methods: {
		async handleSendMessage() {
			const userInput = this.inputMessage.trim();
			if (!userInput || this.isTyping) {
				return;
			}
			
			// 1. Add user message to chat
			this.chatMessages.push({
				role: 'user',
				type: 'text',
				payload: {
					text: userInput
				}
			});
			this.inputMessage = '';
			this.isTyping = true;
			this.scrollToBottom();

			// 2. Get response from mock assistant
			try {
				const response = await MockAssistantService.getResponse(userInput);
				
				// 3. Add assistant response to chat
				this.chatMessages.push({
					role: 'assistant',
					...response
				});

			} catch (error) {
				console.error("Mock assistant error:", error);
				this.chatMessages.push({
					role: 'assistant',
					type: 'text',
					payload: { text: '抱歉，演示脚本出了点问题。' }
				});
			} finally {
				this.isTyping = false;
					this.scrollToBottom();
			}
		},
		scrollToBottom() {
			this.$nextTick(() => {
				// The scroll-into-view logic in computed property handles this
			});
		},
		handleCardButton(button) {
			if (button.action === 'navigate' && button.path) {
				this.navigateTo(button.path);
			} else {
					uni.showToast({
					title: `未知按钮动作: ${button.action}`,
						icon: 'none'
					});
			}
		},
		navigateTo(path) {
			if (!path) return;
			
			uni.navigateTo({
				url: path,
				fail: (err) => {
					uni.showToast({
						title: '页面不存在或路径错误: ' + path,
						icon: 'none'
					})
				}
			});
		},
		viewTaskDetail(task) {
			this.navigateTo(task.path);
		},
		handleQuickAccess(item) {
			this.navigateTo(item.path);
		}
	}
}
</script>

<style lang="scss">
.assistant-page {
	display: flex;
	flex-direction: column;
	height: 100vh;
	background-color: #f4f6f9;
}

.chat-container {
	flex: 1;
	overflow-y: auto;
	padding: 20rpx;
	box-sizing: border-box;
}

.chat-list {
	display: flex;
	flex-direction: column;
	gap: 30rpx;
}

.chat-item {
	display: flex;
	align-items: flex-start;
	gap: 20rpx;
	max-width: 85%;

.avatar {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	overflow: hidden;
	flex-shrink: 0;

		image {
	width: 100%;
	height: 100%;
		}
}

.message-bubble {
		padding: 20rpx 25rpx;
	border-radius: 20rpx;
		background-color: #ffffff;
		word-break: break-word;
		box-shadow: 0 4rpx 15rpx rgba(0,0,0,0.08);
	}
}

.assistant-message {
	align-self: flex-start;
	.message-bubble {
		background-color: #ffffff;
	border-top-left-radius: 0;
}
}

.user-message {
	align-self: flex-end;
	flex-direction: row-reverse;
	
	.message-bubble {
		background-color: #4f80ff;
		color: #ffffff;
	border-top-right-radius: 0;
	box-shadow: 0 4rpx 15rpx rgba(77, 128, 255, 0.2);
}
}

.input-area {
	display: flex;
	align-items: center;
	padding: 20rpx;
	background-color: #f4f6f9;
	border-top: none;

	.text-input {
		flex: 1;
		height: 80rpx;
		padding: 0 20rpx;
		border-radius: 40rpx;
		background-color: #ffffff;
		margin-right: 20rpx;
		box-shadow: 0 4rpx 10rpx rgba(0,0,0,0.04);
}

	.send-btn {
		height: 80rpx;
		line-height: 80rpx;
		background-color: #4f80ff;
		color: white;
		border-radius: 40rpx;
		padding: 0 40rpx;
	font-size: 28rpx;
		&[disabled] {
			background-color: #a9c2ff;
}
	}
}

// Typing Indicator
.typing-indicator {
	display: flex;
	gap: 8rpx;
	align-items: center;
	padding: 10rpx 0;
	.dot {
		width: 16rpx;
		height: 16rpx;
		background-color: #b0c4de;
		border-radius: 50%;
		animation: typing 1.4s infinite;
		&:nth-child(2) { animation-delay: 0.2s; }
		&:nth-child(3) { animation-delay: 0.4s; }
	}
}

@keyframes typing {
	0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
	40% { transform: scale(1); opacity: 1; }
}

// Card Message Styles
.card-message {
	.card-title {
	font-weight: bold;
		font-size: 32rpx;
		margin-bottom: 20rpx;
	}
	.card-body {
		.card-item {
			margin-bottom: 10rpx;
			.card-item-heading {
				font-weight: 500;
				color: #555;
				margin-bottom: 8rpx;
			}
			.card-item-field {
				display: flex;
				.field-label {
					color: #888;
					margin-right: 10rpx;
					white-space: nowrap;
				}
				.field-value {
 color: #333;
}
			}
		}
		.card-qrcode {
			width: 100%;
			max-width: 450rpx;
			margin: 20rpx auto 0;
			display: block;
			border-radius: 12rpx;
		}
	}
	.card-footer {
		margin-top: 20rpx;
		padding-top: 15rpx;
		border-top: 1rpx solid #eee;
		font-size: 26rpx;
		color: #888;
	}
	.card-buttons {
		margin-top: 20rpx;
		.card-button {
			background-color: #4f80ff;
			color: white;
			font-size: 28rpx;
		}
	}
}

// Rich Content Message Styles
.rich-content-message {
	.rich-title {
		font-weight: bold;
		font-size: 32rpx;
		margin-bottom: 15rpx;
}
	.rich-list {
		margin-bottom: 15rpx;
		.rich-list-item {
			margin-bottom: 5rpx;
			font-size: 28rpx;
		}
	}
	.rich-image {
		width: 100%;
		border-radius: 10rpx;
		margin-bottom: 15rpx;
}
	.rich-suggestion {
		font-weight: 500;
		color: #2c3e50;
}
}

// Parcel Message Styles
.parcel-message {
	.parcel-title {
		font-weight: bold;
		font-size: 32rpx;
		margin-bottom: 20rpx;
	}
	.parcel-item {
		padding: 15rpx;
 border-radius: 10rpx;
		background-color: #f9f9f9;
		margin-bottom: 15rpx;
		.parcel-item-title {
			font-weight: 500;
			margin-bottom: 8rpx;
		}
		.parcel-info {
			font-size: 26rpx;
			color: #555;
		}
		.parcel-code {
			font-weight: bold;
			color: #e67e22;
}
	}
}

// List Message Styles
.list-message {
	.list-title {
		font-weight: bold;
		font-size: 32rpx;
		margin-bottom: 15rpx;
}
	.list-item {
		margin-bottom: 8rpx;
		font-size: 28rpx;
}
}

.is-link {
	cursor: pointer;
	transition: background-color 0.2s;
	&:hover {
		background-color: rgba(0, 0, 0, 0.05);
	}
}

// Card Message Styles
.card-message {
	.card-body {
		.card-item {
			.card-item-field.is-link {
				padding: 10rpx;
				margin: -10rpx;
				border-radius: 8rpx;
				.field-value {
					color: #4f80ff;
					text-decoration: underline;
}
			}
		}
	}
}

// Rich Content Message Styles
.rich-content-message {
	.rich-list-item.is-link {
		color: #4f80ff;
		padding: 10rpx;
		margin: -10rpx 0;
		border-radius: 8rpx;
}
}

// Parcel Message Styles
.parcel-message {
	.parcel-item.is-link {
		border: 1px solid transparent;
		&:hover {
			border-color: #4f80ff;
		}
	}
}

// List Message Styles
.list-message {
	.list-item.is-link {
		color: #4f80ff;
		padding: 10rpx;
		margin: -10rpx;
		border-radius: 8rpx;
	}
}

// 动态任务追踪面板
.task-panel {
	padding: 20rpx;
	padding-bottom: 10rpx;
	background-color: #f4f6f9;
	
	.panel-title {
		font-size: 28rpx;
		font-weight: 500;
		margin-left: 10rpx;
		margin-bottom: 20rpx;
		color: #5f6368;
	}

	.task-scroll {
		white-space: nowrap;
		&::-webkit-scrollbar {
			display: none;
		}
	}

	.task-card {
		display: inline-flex;
		align-items: flex-start;
		padding: 25rpx;
		background-color: #ffffff;
		border-radius: 20rpx;
		margin-right: 20rpx;
		margin-left: 5rpx;
		margin-bottom: 10rpx;
		width: 550rpx;
		position: relative;
		box-shadow: 0 4rpx 15rpx rgba(0,0,0,0.06);
		vertical-align: top;
	}

	.task-icon {
		width: 70rpx;
		height: 70rpx;
		margin-right: 20rpx;
		flex-shrink: 0;
		image {
			width: 100%;
			height: 100%;
		}
	}

	.task-info {
		display: flex;
		flex-direction: column;
		gap: 4rpx;
		flex-grow: 1;
		width: calc(100% - 90rpx);
	}

	.task-title {
		font-weight: 500;
		font-size: 30rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		color: #202124;
	}

	.task-desc {
		font-size: 24rpx;
		color: #5f6368;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.progress-bar {
		width: 100%;
		height: 8rpx;
		background-color: #e9ecef;
		border-radius: 4rpx;
		overflow: hidden;
		margin-top: 12rpx;
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, #4d80ff, #6a9eff);
		border-radius: 4rpx;
	}
	
	.task-time {
		font-size: 22rpx;
		color: #999;
		margin-top: 8rpx;
	}

	.task-status {
		position: absolute;
		top: 25rpx;
		right: 25rpx;
		font-size: 22rpx;
		font-weight: 500;
		padding: 6rpx 15rpx;
		border-radius: 8rpx;
		
		&.processing {
			background-color: rgba(255, 152, 0, 0.15);
			color: #ff9800;
		}

		&.waiting {
			background-color: rgba(77, 128, 255, 0.15);
			color: #4d80ff;
		}
	}
}

// 底部快捷指令菜单
.quick-access-menu {
	padding: 20rpx 0 15rpx 0;
	background-color: #f4f6f9;

	.menu-scroll {
		white-space: nowrap;
		&::-webkit-scrollbar {
			display: none;
		}
	}

	.menu-item {
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		width: 150rpx;
		gap: 12rpx;
		&:first-child {
			margin-left: 25rpx;
		}
		&:last-child {
			margin-right: 25rpx;
		}
	}

	.menu-icon {
		width: 90rpx;
		height: 90rpx;
		background-color: #ffffff;
		border-radius: 25rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		box-shadow: 0 4rpx 10rpx rgba(0,0,0,0.04);
		image {
			width: 50rpx;
			height: 50rpx;
		}
	}

	.menu-text {
		font-size: 24rpx;
		color: #3c4043;
	}
}
</style> 
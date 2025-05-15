<template>
	<view class="assistant-page">
		<!-- 聊天窗口 -->
		<scroll-view scroll-y="true" class="chat-container" :scroll-top="scrollTop" :scroll-with-animation="true" @scrolltoupper="loadMoreMessages">
			<view class="chat-list">
				<view v-for="(msg, index) in chatMessages" :key="index" class="chat-item" :class="{ 'user-message': msg.type === 'user', 'system-message': msg.type === 'system' }">
					<view class="avatar">
						<image :src="msg.type === 'user' ? userAvatar : botAvatar" mode="aspectFill"></image>
					</view>
					<view class="message-bubble">
						<text>{{msg.content}}</text>
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
			<view class="mic-btn" @tap="startVoiceInput">
				<image src="/static/images/mic.png" mode="aspectFit"></image>
			</view>
			<input type="text" class="text-input" v-model="inputMessage" placeholder="请输入消息..." @confirm="sendMessage"/>
			<view class="attach-btn" @tap="showAttachMenu">
				<image src="/static/images/attach.png" mode="aspectFit"></image>
			</view>
			<view class="send-btn" @tap="sendMessage">
				<image src="/static/images/send.png" mode="aspectFit"></image>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			inputMessage: '',
			scrollTop: 0,
			userAvatar: '/static/images/user-avatar.png',
			botAvatar: '/static/images/bot-avatar.png',
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
					id: 1,
					title: '教室预约',
					description: 'A306教室 18:00-20:00',
					icon: '/static/images/classroom.png',
					progress: 70,
					remainingTime: '30分钟',
					status: 'processing',
					statusText: '处理中'
				},
				{
					id: 2,
					title: '快递取件',
					description: '菜鸟驿站 #23891',
					icon: '/static/images/express.png',
					progress: 100,
					remainingTime: '已就绪',
					status: 'ready',
					statusText: '待取件'
				},
				{
					id: 3,
					title: '打印任务',
					description: '论文初稿 12页',
					icon: '/static/images/print.png',
					progress: 50,
					remainingTime: '5分钟',
					status: 'processing',
					statusText: '打印中'
				}
			]
		}
	},
	onLoad() {
		// 可以在这里加载历史对话记录
	},
	methods: {
		sendMessage() {
			if (!this.inputMessage.trim()) return;
			
			// 添加用户消息
			this.chatMessages.push({
				type: 'user',
				content: this.inputMessage
			});
			
			const userInput = this.inputMessage;
			this.inputMessage = '';
			
			// 模拟系统回复
			setTimeout(() => {
				this.chatMessages.push({
					type: 'system',
					content: this.getMockResponse(userInput)
				});
				
				// 滚动到最新消息
				this.$nextTick(() => {
					this.scrollToBottom();
				});
			}, 500);
		},
		scrollToBottom() {
			// 使用一个足够大的值确保滚动到底部
			this.scrollTop = 9999;
		},
		getMockResponse(input) {
			if (input.includes('课表') || input.includes('课程')) {
				return '您今天有3节课：\n1. 9:00-10:40 高等数学 A306\n2. 13:00-14:40 大学英语 B201\n3. 15:00-16:40 程序设计 机房3';
			} else if (input.includes('订餐') || input.includes('吃饭') || input.includes('食堂')) {
				return '今日食堂推荐：\n1. 一食堂：红烧排骨\n2. 二食堂：麻辣香锅\n3. 三食堂：黄焖鸡米饭\n需要为您预订餐品吗？';
			} else if (input.includes('借书') || input.includes('图书')) {
				return '您想借阅什么书籍？您可以输入书名，或者前往图书馆页面查找。';
			} else {
				return '我理解您的问题是关于"' + input + '"。请问您需要了解哪些具体信息呢？';
			}
		},
		handleQuickAccess(item) {
			uni.navigateTo({
				url: item.path
			});
		},
		viewTaskDetail(task) {
			// 查看任务详情
			uni.showToast({
				title: '查看任务：' + task.title,
				icon: 'none'
			});
		},
		startVoiceInput() {
			// 模拟语音输入
			uni.showToast({
				title: '开始语音输入...',
				icon: 'none'
			});
		},
		showAttachMenu() {
			// 显示附件菜单
			uni.showActionSheet({
				itemList: ['图片', '文件', '位置'],
				success: (res) => {
					uni.showToast({
						title: '选择了：' + ['图片', '文件', '位置'][res.tapIndex],
						icon: 'none'
					});
				}
			});
		},
		loadMoreMessages() {
			// 加载更多历史消息
			uni.showToast({
				title: '加载更多消息...',
				icon: 'none'
			});
		}
	}
}
</script>

<style>
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
	position: relative;
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

/* 聊天窗口 */
.chat-container {
	flex: 1;
	padding: 20rpx;
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
}

.system-message .message-bubble {
	background-color: #007AFF;
	color: #ffffff;
	border-top-left-radius: 0;
}

.user-message .message-bubble {
	background-color: #E0E0E0;
	color: #333333;
	border-top-right-radius: 0;
}

/* 任务面板 */
.task-panel {
	background-color: #ffffff;
	padding: 20rpx;
	border-top: 1rpx solid #e0e0e0;
	border-bottom: 1rpx solid #e0e0e0;
}

.panel-title {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 20rpx;
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
}

.mic-btn, .attach-btn, .send-btn {
	width: 60rpx;
	height: 60rpx;
	display: flex;
	justify-content: center;
	align-items: center;
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
	margin: 0 20rpx;
	font-size: 28rpx;
}
</style> 
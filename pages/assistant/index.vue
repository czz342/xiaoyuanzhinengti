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
				<image src="/static/images/scan.png" mode="aspectFit"></image>
			</view>
			<input type="text" class="text-input" v-model="inputMessage" placeholder="请输入消息..." @confirm="sendMessage"/>
			<view class="attach-btn" @tap="showAttachMenu">
				<image src="/static/images/filter.png" mode="aspectFit"></image>
			</view>
			<view class="send-btn" @tap="sendMessage">
				<image src="/static/images/arrow-right.png" mode="aspectFit"></image>
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
			tunnelUrl: "https://collectible-decent-brokers-garcia.trycloudflare.com", 
			
			inputMessage: '',
			scrollTop: 0,
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
			ongoingTasks: [],
			sessionId: null,
			currentTaskId: null,
			isAssistantTyping: false,
			assistants: [],
			selectedAssistant: null,
			websocketTask: null,
			websocketConnected: false,
			reconnectInterval: null
		}
	},
	async onLoad() {
		console.log('页面加载开始');
		try {
			await this.initializeAssistant();
			// 初始化成功后，连接WebSocket
			this.connectWebSocket();
			console.log('页面初始化与WebSocket连接流程启动');
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
					const targetAssistantName = "校园智能体";

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
					this.chatMessages.unshift({
						type: 'system',
						content: this.selectedAssistant.openingSpeech || `您好，我是您的助手 ${this.selectedAssistant.name}，有什么可以帮助您的吗？`,
						timestamp: Date.now()
					});

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
					    sessionResponse.data.sessionId.length > 0) { // 确保 sessionId 不是空字符串
						this.sessionId = sessionResponse.data.sessionId;
						console.log('新会话创建成功，Session ID:', this.sessionId);
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
				uni.showToast({ title: '不能发送空消息', icon: 'none' });
				return;
			}
			if (!this.sessionId) {
				uni.showToast({ title: '会话未建立，请稍后重试', icon: 'none' });
				console.error('sendMessage 失败: sessionId 为空');
				return;
			}

			const userMessage = {
				type: 'user',
				content: this.inputMessage.trim(),
				timestamp: Date.now()
			};
			this.chatMessages.push(userMessage);
			this.scrollToBottom();

			const messageToSend = this.inputMessage;
			this.inputMessage = ''; // 立刻清空输入框

			try {
				console.log(`准备发送消息: "${messageToSend}" 到 sessionId: ${this.sessionId}`);
				uni.showLoading({ title: '正在发送...' });
				
				const response = await KingdeeAgentService.sendChatMessage({
					sessionId: this.sessionId,
					userInput: messageToSend
				});

				uni.hideLoading();
				console.log('消息发送成功，API响应:', response);
				
				// 记录返回的taskId，可能用于后续操作，如停止任务
				if (response && response.taskId) {
					this.currentTaskId = response.taskId;
					console.log('记录当前任务ID:', this.currentTaskId);
				}

			} catch (error) {
				uni.hideLoading();
				console.error('发送消息失败:', error);
				this.addSystemMessage(`消息发送失败: ${error.message || '网络错误'}`);
				// 可选：将发送失败的消息状态更新
				const lastMessageIndex = this.chatMessages.length - 1;
				if (this.chatMessages[lastMessageIndex] === userMessage) {
					this.$set(this.chatMessages, lastMessageIndex, {
						...userMessage,
						error: true,
						content: userMessage.content + ' (发送失败)'
					});
				}
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

		// 滚动到底部
		scrollToBottom() {
			this.$nextTick(() => {
				const lastMessageIndex = this.chatMessages.length - 1;
				if (lastMessageIndex < 0) return;
				// 这里使用一个较大的值来确保滚动到底部
				this.scrollTop = this.scrollTop + 9999;
			});
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
			uni.showToast({ title: '没有更多历史消息了', icon: 'none' });
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
			console.log("处理Action:", action);
			switch(action.type) {
				case 'waiting':
					this.handleWaitingAction(action);
					break;
				case 'chat':
					this.handleChatAction(action);
					break;
				case 'task':
					this.handleTaskAction(action);
					break;
				default:
					console.warn("未知的Action类型:", action.type);
			}
		},
		
		handleWaitingAction(action) {
			if (action.waitState === 'start') {
				this.isAssistantTyping = true;
				this.addOrUpdateBotMessage("...", "typing_indicator");
			} else { // end
				this.isAssistantTyping = false;
				this.removeBotMessage("typing_indicator");
			}
		},

		handleChatAction(action) {
			this.isAssistantTyping = false;
			this.removeBotMessage("typing_indicator"); // 移除"正在输入"
			
			// 根据用户提供的正确日志结构，从 action.data.message 获取文本
			// 并使用 action.data.taskId 作为唯一标识符来合并流式消息
			if (action.data && action.data.message) {
				this.addOrUpdateBotMessage(action.data.message, action.data.taskId);
			} else {
				console.error("收到的chat action格式不正确，缺少 data.message:", action);
			}
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
				this.addSystemMessage("智能助手连接成功！");
			});

			this.websocketTask.onMessage((res) => {
				console.log('收到WebSocket消息:', res.data);
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
				this.addSystemMessage("与助手的连接发生错误，请检查网络。");
			});

			this.websocketTask.onClose((res) => {
				console.log('🔌 WebSocket 连接已关闭', res);
				this.websocketConnected = false;
				if (this.reconnectInterval) return; // 防止重复设置
				
				this.addSystemMessage("与助手连接已断开，尝试重新连接...");
				
				this.reconnectInterval = setInterval(() => {
					console.log("尝试重新连接WebSocket...");
					this.connectWebSocket();
				}, 5000); // 每5秒重连一次
			});
		}
	},
	onUnload() {
		// 页面卸载时关闭WebSocket连接
		if (this.websocketTask) {
			this.websocketTask.close({
				code: 1000,
				reason: '页面关闭'
			});
		}
		// 清除重连定时器
		if(this.reconnectInterval) {
			clearInterval(this.reconnectInterval);
			this.reconnectInterval = null;
		}
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
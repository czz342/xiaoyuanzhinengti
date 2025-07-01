<template>
	<view class="assistant-page">
		<!-- 聊天窗口 -->
		<scroll-view scroll-y="true" class="chat-container" :scroll-top="scrollTop" :scroll-with-animation="true" @scrolltoupper="loadMoreMessages">
			<view class="chat-list">
				<view v-for="(msg, index) in chatMessages" :key="msg.id || index">
					<!-- Existing User/System Message Blocks -->
					<view v-if="msg.type === 'user' || msg.type === 'system'" class="chat-item" :class="{ 'user-message': msg.type === 'user', 'system-message': msg.type === 'system' }">
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
			tunnelUrl: "https://cent-group-parenting-animated.trycloudflare.com", 
			
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
				const response = await KingdeeAgentService.sendChatMessage({
					sessionId: this.sessionId,
					// 使用存好的局部变量发送
					userInput: messageToSend, 
				});
				console.log('消息发送成功，API响应:', response);

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
			console.log('处理Action:', action);
			const runId = action.data ? action.data.runId : null;

			switch (action.type) {
				case 'identifySkill':
				case 'streamDone':
					// 识别到中控发来的新事件类型，暂不处理，仅消除报错
					console.log(`已识别并忽略Action类型: ${action.type}`);
					break;

				case 'runStepChat':
					{ // 使用块级作用域
						if (!runId) {
							console.warn('runStepChat消息中没有runId，无法处理:', action);
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
							console.warn('Chat消息中没有runId，无法处理:', action);
							return;
						}
						
						// 定位到对应的思考过程
						// 1. 先尝试通过runId寻找已关联的面板
						let thinkingProcess = this.chatMessages.find(msg => msg.runId === runId);

						// 2. 如果没找到，认领占位符面板 (处理AI直接回答的场景)
						if (!thinkingProcess) {
							thinkingProcess = this.chatMessages.find(msg => msg.type === 'thinking_process' && !msg.runId);
							if (thinkingProcess) {
								console.log(`Chat消息抵达，为思考面板占位符关联上runId: ${runId}`);
								this.$set(thinkingProcess, 'runId', runId);
							}
						}

						if (thinkingProcess) {
							// 当最终chat消息到达时，标记思考过程为完成
							thinkingProcess.status = 'completed';
							thinkingProcess.title = 'AI思考完成';
						}

						const messageData = action.data;
						const messageId = `final-message-${runId}`; // 使用runId确保唯一性
						
						let finalMessage = this.chatMessages.find(msg => msg.id === messageId);

						if (finalMessage) {
							// 追加内容
							finalMessage.content += messageData.message;
						} else {
							// 创建新消息
							finalMessage = {
								id: messageId,
								type: 'system',
								content: messageData.message,
								runId: runId, // 关联runId
								timestamp: Date.now()
							};
							this.chatMessages.push(finalMessage);
						}

						this.scrollToBottom();
						this.$forceUpdate(); // 确保视图更新
					}
					break;
				
				case 'waiting':
				    // 等待状态，可以用来显示一个通用的"处理中"状态，但我们已有思考面板，故忽略
				    console.log('收到waiting状态，暂不处理。');
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
				this.addSystemMessage("与助手的连接发生错误，请检查网络。");
			});

			this.websocketTask.onClose((res) => {
				console.log('🔌 WebSocket 连接已关闭', res);
				this.websocketConnected = false;
				
				// 新增：停止心跳
				this.stopHeartbeat();

				if (this.reconnectInterval) return; // 防止重复设置
				
				this.addSystemMessage("与助手连接已断开，尝试重新连接...");
				
				this.reconnectInterval = setInterval(() => {
					console.log("尝试重新连接WebSocket...");
					this.connectWebSocket();
				}, 5000); // 每5秒重连一次
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
		// 新增：清除心跳定时器
		this.stopHeartbeat();
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

.link-style {
	color: #007AFF;
	text-decoration: underline;
	cursor: pointer;
}
</style> 
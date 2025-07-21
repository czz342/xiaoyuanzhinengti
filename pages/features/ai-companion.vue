<template>
	<view class="companion-page">
		<scroll-view class="chat-container" scroll-y :scroll-top="scrollTop" :scroll-with-animation="true">
			<view class="chat-list">
				<view class="chat-item" v-for="(msg, index) in messages" :key="index" :class="msg.sender === 'ai' ? 'ai-message' : 'user-message'">
					<image class="avatar" :src="msg.sender === 'ai' ? aiAvatar : userAvatar"></image>
					<view class="message-bubble animate__animated animate__fadeInUp">
						<text>{{ msg.text }}</text>
					</view>
				</view>
				<view class="chat-item ai-message" v-if="isAiTyping">
					<image class="avatar" :src="aiAvatar"></image>
					<view class="message-bubble typing-indicator">
						<view class="dot"></view>
						<view class="dot"></view>
						<view class="dot"></view>
					</view>
				</view>
			</view>
		</scroll-view>

		<view class="input-area">
			<view class="quick-reply-area" v-if="showQuickReplies">
				<scroll-view scroll-x="true" class="quick-reply-scroll">
					<view class="quick-reply-item" v-for="(reply, index) in quickReplies" :key="index" @tap="sendQuickReply(reply)">
						{{ reply.label }}
					</view>
				</scroll-view>
			</view>
			<view class="input-row">
				<input class="text-input" v-model="userInput" placeholder="和“小晴”聊聊吧..." @confirm="sendMessage" />
				<button class="send-btn" @tap="sendMessage" :disabled="!userInput.trim()">发送</button>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			messages: [],
			userInput: '',
			isAiTyping: false,
			scrollTop: 0,
			userAvatar: '/static/images/avatar.png',
			aiAvatar: '/static/images/xiaoqing.png',
			showQuickReplies: true,
			quickReplies: [
				{ label: '最近压力好大', keyword: '压力' },
				{ label: '感觉有点孤单', keyword: '孤单' },
				{ label: '我好像失恋了', keyword: '失恋' },
				{ label: '对未来很迷茫', keyword: '迷茫' }
			],
			scriptedResponses: {
				'压力': '别太大压力，很多同学都会在这个阶段感到相似的困扰。试着出去走走，听听音乐放松一下，或者做个深呼吸。记住，你已经做得很好了，一步一步来，一切都会好起来的。',
				'孤单': '感到孤单是很正常的。要知道，即使一个人，也可以把生活过得有滋有味。也可以尝试主动联系一下老朋友，或者投入到一个新的兴趣中，或许会认识到志同道合的新伙伴呢。小晴会一直在这里陪着你。',
				'失恋': '听到这个消息我很难过，失恋的感觉一定很不好受。请允许自己有一段时间去难过和消化，这是很正常的过程。多和朋友聊聊，或者做一些能让自己开心起来的事情转移注意力。时间是最好的解药，你会慢慢走出来的。',
				'迷茫': '对未来感到迷茫，是因为我们充满了期待呀。这恰恰说明你是一个有追求的人。不妨先把眼前的每一件小事做好，比如认真听一堂课，完成一次作业。在行动中，方向会慢慢变得清晰的。',
				'默认': '嗯嗯，我在听。可以再多跟我说一些你的想法吗？',
				'感谢': '不用客气，能陪你聊聊，我也很开心。记住，任何时候需要，我都在这里。'
			}
		};
	},
	mounted() {
		this.initChat();
	},
	methods: {
		initChat() {
			this.isAiTyping = true;
			setTimeout(() => {
				this.messages.push({
					sender: 'ai',
					text: '你好，我是你的专属AI心理伙伴“小晴”。无论开心还是难过，都可以在这里和我说说。（放心和我说，我们的悄悄话除了我们两个没人会知道）'
				});
				this.isAiTyping = false;
				this.scrollToBottom();
			}, 1000);
		},
		sendMessage() {
			const text = this.userInput.trim();
			if (!text) return;

			this.messages.push({ sender: 'user', text });
			this.userInput = '';
			this.showQuickReplies = false;
			this.scrollToBottom();

			this.isAiTyping = true;
			setTimeout(() => {
				this.generateAiResponse(text);
				this.isAiTyping = false;
				this.scrollToBottom();
			}, 1500);
		},
		sendQuickReply(reply) {
			this.messages.push({ sender: 'user', text: reply.label });
			this.showQuickReplies = false;
			this.scrollToBottom();

			this.isAiTyping = true;
			setTimeout(() => {
				const response = this.scriptedResponses[reply.keyword] || this.scriptedResponses['默认'];
				this.messages.push({ sender: 'ai', text: response });
				this.isAiTyping = false;
				this.scrollToBottom();
			}, 1500);
		},
		generateAiResponse(userText) {
			let response = this.scriptedResponses['默认'];
			if (userText.includes('谢谢') || userText.includes('感谢')) {
				response = this.scriptedResponses['感谢'];
			} else {
				for (const keyword in this.scriptedResponses) {
					if (userText.includes(keyword)) {
						response = this.scriptedResponses[keyword];
						break;
					}
				}
			}
			this.messages.push({ sender: 'ai', text: response });
		},
		scrollToBottom() {
			this.$nextTick(() => {
				this.scrollTop = 999999; // 使用一个足够大的值来确保滚动到底部
			});
		}
	}
};
</script>

<style>
@import url('/static/animate.min.css');

.companion-page {
	display: flex;
	flex-direction: column;
	height: 100vh;
	/* 1. 使用更柔和、温暖的背景色 */
	background-color: #FAF8F5;
}

.chat-container {
	flex: 1;
	padding: 20rpx;
	box-sizing: border-box;
	overflow-y: auto;
}

.chat-list {
	display: flex;
	flex-direction: column;
	/* 2. 调整消息间距，使其更紧凑自然 */
	gap: 30rpx;
}

.chat-item {
	display: flex;
	align-items: flex-start;
	max-width: 80%;
}

.avatar {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	flex-shrink: 0;
}

.message-bubble {
	padding: 22rpx 30rpx; /* 微调内边距，增加呼吸感 */
	border-radius: 30rpx; /* 3. 更圆润的边角 */
	font-size: 30rpx;
	line-height: 1.6; /* 4. 增加行高，提升阅读舒适度 */
	word-break: break-word;
	box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.04); /* 5. 添加非常细微的阴影，增加层次感 */
}

/* AI消息样式 */
.ai-message {
	align-self: flex-start;
}
.ai-message .avatar {
	margin-right: 20rpx;
}
.ai-message .message-bubble {
	background-color: #ffffff;
	color: #333;
	border-top-left-radius: 8rpx; /* 6. 调整小尖角，使其更柔和 */
	border: 1rpx solid #ECECEC;
}

/* 用户消息样式 */
.user-message {
	align-self: flex-end;
	flex-direction: row-reverse;
}
.user-message .avatar {
	margin-left: 20rpx;
}
.user-message .message-bubble {
	/* 7. 使用更温和、治愈的绿色作为主色调 */
	background-color: #79C1A9;
	color: #ffffff;
	border-top-right-radius: 8rpx; /* 调整小尖角 */
}

/* 正在输入提示 */
.typing-indicator {
	display: flex;
	align-items: center;
	padding: 25rpx;
}
.typing-indicator .dot {
	width: 12rpx;
	height: 12rpx;
	border-radius: 50%;
	background-color: #b0b0b0;
	margin: 0 5rpx;
	animation: typing-blink 1.4s infinite both;
}
.typing-indicator .dot:nth-child(2) {
	animation-delay: 0.2s;
}
.typing-indicator .dot:nth-child(3) {
	animation-delay: 0.4s;
}
@keyframes typing-blink {
	0% {
		opacity: 0.2;
	}
	20% {
		opacity: 1;
	}
	to {
		opacity: 0.2;
	}
}

/* 底部输入区域 */
.input-area {
	background-color: #ffffff;
	border-top: 1rpx solid #F0F0F0;
	padding: 20rpx;
	/* 8. 适配iPhone等底部安全区域 */
	padding-bottom: calc(20rpx + constant(safe-area-inset-bottom));
	padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
	box-shadow: 0 -2rpx 20rpx rgba(0, 0, 0, 0.03);
}

.quick-reply-area {
	margin-bottom: 20rpx;
}

.quick-reply-scroll {
	white-space: nowrap;
}

.quick-reply-item {
	display: inline-block;
	/* 9. 更柔和的快捷回复样式 */
	background-color: #F5F5F5;
	color: #555555;
	padding: 12rpx 24rpx;
	border-radius: 30rpx;
	font-size: 26rpx;
	margin-right: 20rpx;
	border: 1rpx solid #EAEAEA;
}

.input-row {
	display: flex;
	align-items: center;
}

.text-input {
	flex: 1;
	/* 10. 统一输入框背景色 */
	background-color: #F5F5F5;
	height: 76rpx;
	padding: 0 25rpx;
	border-radius: 38rpx;
	font-size: 28rpx;
}
/* 11. 优化占位符颜色 */
.text-input::placeholder {
	color: #B2B2B2;
}


.send-btn {
	/* 12. 发送按钮也使用治愈绿，保持视觉统一 */
	background-color: #79C1A9;
	color: #fff;
	height: 76rpx;
	line-height: 76rpx;
	font-size: 28rpx;
	border-radius: 38rpx;
	padding: 0 40rpx;
	margin-left: 20rpx;
	transition: background-color 0.2s; /* 添加一个小的过渡动画 */
}
.send-btn[disabled] {
	/* 13. 柔和的禁用状态 */
	background-color: #B5D9CB;
	color: #F7F7F7;
}
</style> 
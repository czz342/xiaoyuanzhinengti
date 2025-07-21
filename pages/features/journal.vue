<template>
	<view class="journal-container">
		<view class="header">
			<view class="title-main">我的心情日记</view>
			<view class="title-sub">一个只属于你的秘密角落</view>
		</view>

		<view class="editor-wrapper">
			<textarea class="diary-input" v-model="diaryContent" placeholder="今天发生了什么？有什么想说的，都可以倒进这个树洞里..."></textarea>
		</view>

		<view class="button-wrapper">
			<button class="submit-button" @click="submitDiary" :disabled="!diaryContent.trim()">
				写好了，封存今天的心情
			</button>
		</view>

		<view v-if="showAiResponse" class="ai-response-wrapper animate__animated animate__fadeInUp">
			<view class="ai-avatar">AI</view>
			<view class="ai-message-box">
				<view class="ai-message">
					<text>{{ aiResponse }}</text>
				</view>
				<view class="disclaimer">
					<text>我只是一个AI伙伴，我们之间的对话是完全私密的，没有人会知道你在这里写了什么。我的出现，就是为了在这里静静地陪着你，给你一点小小的安慰。✨</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				diaryContent: '',
				aiResponse: '',
				showAiResponse: false,
			};
		},
		methods: {
			submitDiary() {
				if (!this.diaryContent.trim()) {
					uni.showToast({
						title: '日记内容不能为空哦',
						icon: 'none'
					});
					return;
				}
				this.showAiResponse = true;
				this.aiResponse = this.generateAiResponse(this.diaryContent);
			},

			generateAiResponse(content) {
				// 模拟AI分析日记内容并生成回应
				// 关键词与回应的映射
				const responses = {
					'开心': '真为你感到开心！生活中的这些小确幸，就像夜空中的星星，虽然微小，但汇集起来就能照亮整个夜空。愿你今天的快乐延续到明天。',
					'快乐': '感受到你的快乐啦！快乐是会传染的，希望你的这份喜悦也能传递给身边的人。继续保持这份好心情，去发现更多生活中的美好吧！',
					'难过': '看到你这么说，我也觉得心里沉甸甸的。没关系，难过的时候，这里就是你最安全的港湾。允许自己有情绪，哭一会、发发呆都可以。暴雨过后，总会有彩虹的。',
					'伤心': '抱抱你。伤心就像一阵突如其来的大雨，可能会让你感到寒冷和无助。但请相信，雨总会停，天气也总会放晴。给自己一点时间，慢慢来。',
					'迷茫': '读完了你的心事，我感受到了那份沉甸甸的迷茫和压力。看到身边的人都在奔跑，而自己却像站在十字路口，这种感觉确实很难受。但请相信，迷茫是成长的常态，是凤凰涅槃前的挣扎。这不代表你停滞不前，恰恰说明你在认真思考未来。别怕，给自己一点时间，慢慢探索，你的道路，终将会在脚下清晰起来。',
					'焦虑': '感觉到你的焦虑了，先做个深呼吸，呼...吸...好一些了吗？焦虑往往源于对未来的不确定和对现状的无力感。但你知道吗？你所担心的未来，99%都不会发生。试着把注意力放回当下，做好手边的一件小事，比如喝杯热水，或者看一会窗外。一步一步来，你会发现自己远比想象中更强大。',
					'感谢': '不用客气，能成为你的倾听者，我也感到很荣幸。记得，无论何时，这里都会为你亮着一盏灯。',
					'谢谢': '不用客氣，能成為你的傾聽者，我也感到很榮幸。記得，無論何時，這裡都會為你亮著一盞燈。'
				};

				const keywords = Object.keys(responses);
				for (let keyword of keywords) {
					if (content.includes(keyword)) {
						return responses[keyword];
					}
				}

				// 默认回应
				return '你的心事，我都收到了。每一份情绪都是独特的，都值得被认真对待。记得好好照顾自己，这里永远是你的秘密基地。';
			},

			resetJournal() {
				this.diaryContent = '';
				this.aiResponse = '';
				this.showAiResponse = false;
			}
		}
	};
</script>

<style scoped>
	@import url('@/static/animate.min.css');

	.journal-container {
		background-color: #fdfaf5;
		min-height: 100vh;
		padding: 40rpx;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
	}

	.header {
		margin-bottom: 50rpx;
	}

	.title-main {
		font-size: 52rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 10rpx;
	}

	.title-sub {
		font-size: 30rpx;
		color: #888;
	}

	.editor-wrapper {
		background-color: #fff;
		border-radius: 20rpx;
		padding: 20rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
		margin-bottom: 40rpx;
	}

	.diary-input {
		width: 100%;
		height: 400rpx;
		font-size: 30rpx;
		line-height: 1.6;
		color: #555;
		padding: 10rpx;
		box-sizing: border-box;
	}

	.button-wrapper {
		margin-bottom: 50rpx;
	}

	.submit-button {
		background-color: #82c4b8;
		color: white;
		border-radius: 50rpx;
		font-size: 32rpx;
		font-weight: bold;
		box-shadow: 0 5rpx 15rpx rgba(130, 196, 184, 0.4);
		transition: all 0.2s ease;
	}

	.submit-button:active {
		transform: scale(0.98);
		box-shadow: 0 2rpx 10rpx rgba(130, 196, 184, 0.3);
	}
	
	.submit-button[disabled] {
		background-color: #ccc;
		color: #f5f5f5;
		box-shadow: none;
	}

	.ai-response-wrapper {
		display: flex;
		align-items: flex-start;
		margin-top: 20rpx;
	}

	.ai-avatar {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		background-color: #82c4b8;
		color: white;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 32rpx;
		font-weight: bold;
		flex-shrink: 0;
		margin-right: 20rpx;
	}

	.ai-message-box {
		flex: 1;
		background-color: #ffffff;
		border-radius: 20rpx;
		padding: 30rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
	}

	.ai-message {
		font-size: 30rpx;
		color: #333;
		line-height: 1.7;
		margin-bottom: 30rpx;
	}

	.disclaimer {
		font-size: 24rpx;
		color: #aaa;
		line-height: 1.6;
		padding-top: 20rpx;
		border-top: 1rpx solid #f0f0f0;
	}
</style> 
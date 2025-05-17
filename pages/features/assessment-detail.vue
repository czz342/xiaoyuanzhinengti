<template>
	<view class="assessment-detail-page">
		<!-- 顶部进度条 -->
		<view class="progress-bar">
			<view class="progress-inner" :style="{ width: progress + '%' }"></view>
		</view>
		<view class="progress-text">{{currentIndex + 1}}/{{questions.length}}</view>
		
		<!-- 问卷标题 -->
		<view class="assessment-header">
			<text class="assessment-title">{{assessmentInfo.title}}</text>
			<text class="assessment-desc">{{assessmentInfo.description}}</text>
		</view>
		
		<!-- 问题内容 -->
		<view class="question-container">
			<text class="question-text">{{currentQuestion.question}}</text>
			
			<!-- 选项列表 -->
			<view class="options-list">
				<view 
					class="option-item" 
					v-for="(option, index) in currentQuestion.options" 
					:key="index"
					:class="{ selected: selectedOption === index }"
					@tap="selectOption(index)"
				>
					<view class="option-radio">
						<view class="radio-inner" v-if="selectedOption === index"></view>
					</view>
					<text class="option-text">{{option.text}}</text>
				</view>
			</view>
		</view>
		
		<!-- 操作按钮 -->
		<view class="action-buttons">
			<button 
				class="action-btn prev" 
				:disabled="currentIndex === 0"
				:class="{ disabled: currentIndex === 0 }"
				@tap="prevQuestion"
			>
				上一题
			</button>
			<button 
				class="action-btn next" 
				:disabled="selectedOption === -1"
				:class="{ disabled: selectedOption === -1 }"
				@tap="nextQuestion"
			>
				{{currentIndex === questions.length - 1 ? '提交' : '下一题'}}
			</button>
		</view>
		
		<!-- 提示信息 -->
		<view class="tip-container" v-if="currentIndex === 0">
			<view class="tip-icon">i</view>
			<text class="tip-text">请根据您近期的真实感受作答，答案没有对错之分。</text>
		</view>
		
		<!-- 完成弹窗 -->
		<view class="completion-popup" v-if="showCompletionPopup">
			<view class="popup-mask"></view>
			<view class="popup-content">
				<image src="/static/images/completion.png" mode="aspectFit" class="completion-image"></image>
				<text class="completion-title">评估完成！</text>
				<text class="completion-desc">我们正在生成您的心理健康报告</text>
				<view class="loading-dots">
					<view class="dot"></view>
					<view class="dot"></view>
					<view class="dot"></view>
				</view>
				<text class="completion-note">请稍候，这可能需要几秒钟时间</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			assessmentId: null,
			assessmentInfo: {},
			questions: [],
			currentIndex: 0,
			selectedOption: -1,
			answers: [],
			showCompletionPopup: false,
			
			// 示例问卷数据 - PHQ-9 抑郁筛查量表
			phq9: {
				id: 1,
				title: 'PHQ-9 抑郁症筛查量表',
				description: '在过去的两周内，您有多频繁地受到以下任何问题的困扰？',
				questions: [
					{
						id: 1,
						question: '做事时提不起劲或没有兴趣',
						options: [
							{ text: '完全没有', score: 0 },
							{ text: '有几天', score: 1 },
							{ text: '一半以上天数', score: 2 },
							{ text: '几乎每天', score: 3 }
						]
					},
					{
						id: 2,
						question: '感到心情低落、沮丧或绝望',
						options: [
							{ text: '完全没有', score: 0 },
							{ text: '有几天', score: 1 },
							{ text: '一半以上天数', score: 2 },
							{ text: '几乎每天', score: 3 }
						]
					},
					{
						id: 3,
						question: '入睡困难、睡不安稳或睡眠过多',
						options: [
							{ text: '完全没有', score: 0 },
							{ text: '有几天', score: 1 },
							{ text: '一半以上天数', score: 2 },
							{ text: '几乎每天', score: 3 }
						]
					},
					{
						id: 4,
						question: '感到疲倦或没有活力',
						options: [
							{ text: '完全没有', score: 0 },
							{ text: '有几天', score: 1 },
							{ text: '一半以上天数', score: 2 },
							{ text: '几乎每天', score: 3 }
						]
					},
					{
						id: 5,
						question: '食欲不振或过度饮食',
						options: [
							{ text: '完全没有', score: 0 },
							{ text: '有几天', score: 1 },
							{ text: '一半以上天数', score: 2 },
							{ text: '几乎每天', score: 3 }
						]
					},
					{
						id: 6,
						question: '对自己感到失望，或者觉得自己让家人失望',
						options: [
							{ text: '完全没有', score: 0 },
							{ text: '有几天', score: 1 },
							{ text: '一半以上天数', score: 2 },
							{ text: '几乎每天', score: 3 }
						]
					},
					{
						id: 7,
						question: '注意力不集中，做事情或阅读报纸有困难',
						options: [
							{ text: '完全没有', score: 0 },
							{ text: '有几天', score: 1 },
							{ text: '一半以上天数', score: 2 },
							{ text: '几乎每天', score: 3 }
						]
					},
					{
						id: 8,
						question: '行动或说话速度缓慢到别人已经注意到，或正好相反，烦躁或坐立不安、动来动去的情况更严重',
						options: [
							{ text: '完全没有', score: 0 },
							{ text: '有几天', score: 1 },
							{ text: '一半以上天数', score: 2 },
							{ text: '几乎每天', score: 3 }
						]
					},
					{
						id: 9,
						question: '有过不如死掉或用某种方式伤害自己的念头',
						options: [
							{ text: '完全没有', score: 0 },
							{ text: '有几天', score: 1 },
							{ text: '一半以上天数', score: 2 },
							{ text: '几乎每天', score: 3 }
						]
					}
				]
			},
			// GAD-7 广泛性焦虑量表
			gad7: {
				id: 2,
				title: 'GAD-7 广泛性焦虑量表',
				description: '在过去的两周内，有多少天您被以下的问题所困扰？',
				questions: [
					{
						id: 1,
						question: '感到紧张、焦虑或急切',
						options: [
							{ text: '完全没有', score: 0 },
							{ text: '有几天', score: 1 },
							{ text: '一半以上天数', score: 2 },
							{ text: '几乎每天', score: 3 }
						]
					},
					{
						id: 2,
						question: '不能够停止或控制担忧',
						options: [
							{ text: '完全没有', score: 0 },
							{ text: '有几天', score: 1 },
							{ text: '一半以上天数', score: 2 },
							{ text: '几乎每天', score: 3 }
						]
					},
					{
						id: 3,
						question: '对各种各样的事情担忧过多',
						options: [
							{ text: '完全没有', score: 0 },
							{ text: '有几天', score: 1 },
							{ text: '一半以上天数', score: 2 },
							{ text: '几乎每天', score: 3 }
						]
					},
					{
						id: 4,
						question: '很难放松下来',
						options: [
							{ text: '完全没有', score: 0 },
							{ text: '有几天', score: 1 },
							{ text: '一半以上天数', score: 2 },
							{ text: '几乎每天', score: 3 }
						]
					},
					{
						id: 5,
						question: '由于不安而无法静坐',
						options: [
							{ text: '完全没有', score: 0 },
							{ text: '有几天', score: 1 },
							{ text: '一半以上天数', score: 2 },
							{ text: '几乎每天', score: 3 }
						]
					},
					{
						id: 6,
						question: '变得容易烦恼或易怒',
						options: [
							{ text: '完全没有', score: 0 },
							{ text: '有几天', score: 1 },
							{ text: '一半以上天数', score: 2 },
							{ text: '几乎每天', score: 3 }
						]
					},
					{
						id: 7,
						question: '感到害怕，好像有什么可怕的事情要发生',
						options: [
							{ text: '完全没有', score: 0 },
							{ text: '有几天', score: 1 },
							{ text: '一半以上天数', score: 2 },
							{ text: '几乎每天', score: 3 }
						]
					}
				]
			}
		}
	},
	computed: {
		currentQuestion() {
			return this.questions[this.currentIndex] || {};
		},
		progress() {
			return (this.currentIndex / this.questions.length) * 100;
		}
	},
	onLoad(options) {
		this.assessmentId = options.id;
		this.loadAssessmentData();
	},
	methods: {
		// 加载问卷数据
		loadAssessmentData() {
			// 实际应用中应从服务器获取问卷数据
			// 这里使用示例数据
			if (this.assessmentId == 1) {
				this.assessmentInfo = {
					title: this.phq9.title,
					description: this.phq9.description
				};
				this.questions = this.phq9.questions;
			} else if (this.assessmentId == 2) {
				this.assessmentInfo = {
					title: this.gad7.title,
					description: this.gad7.description
				};
				this.questions = this.gad7.questions;
			}
			
			// 初始化答案数组
			this.answers = new Array(this.questions.length).fill(-1);
		},
		
		// 选择选项
		selectOption(index) {
			this.selectedOption = index;
			this.answers[this.currentIndex] = index;
		},
		
		// 上一题
		prevQuestion() {
			if (this.currentIndex > 0) {
				this.currentIndex--;
				this.selectedOption = this.answers[this.currentIndex];
			}
		},
		
		// 下一题或提交
		nextQuestion() {
			if (this.selectedOption === -1) return;
			
			this.answers[this.currentIndex] = this.selectedOption;
			
			if (this.currentIndex < this.questions.length - 1) {
				this.currentIndex++;
				this.selectedOption = this.answers[this.currentIndex];
			} else {
				// 提交问卷
				this.submitAssessment();
			}
		},
		
		// 提交问卷
		submitAssessment() {
			this.showCompletionPopup = true;
			
			// 计算得分
			let totalScore = 0;
			this.answers.forEach((answerIndex, questionIndex) => {
				const question = this.questions[questionIndex];
				const option = question.options[answerIndex];
				totalScore += option.score;
			});
			
			// 生成报告内容
			const report = this.generateReport(totalScore);
			
			// 保存报告
			setTimeout(() => {
				// 实际应用中应将报告保存到服务器
				uni.redirectTo({
					url: `/pages/features/report-detail?id=${this.assessmentId}&score=${totalScore}`
				});
			}, 2000);
		},
		
		// 生成报告内容
		generateReport(score) {
			let report = {
				assessmentId: this.assessmentId,
				title: this.assessmentInfo.title,
				score: score,
				date: new Date().toISOString().split('T')[0],
				level: '',
				summary: '',
				recommendations: []
			};
			
			// PHQ-9 评分解释
			if (this.assessmentId == 1) {
				if (score <= 4) {
					report.level = '无或极轻度抑郁';
					report.summary = '您的抑郁症状评分为无或极轻度，目前状态良好。';
					report.recommendations = [
						'保持健康的生活方式',
						'规律作息，保证充足睡眠',
						'持续锻炼身体，每周至少150分钟中等强度运动'
					];
				} else if (score <= 9) {
					report.level = '轻度抑郁';
					report.summary = '您的抑郁症状评分为轻度，建议关注情绪变化，保持规律作息和适当运动。';
					report.recommendations = [
						'保持规律的作息时间',
						'每天进行30分钟有氧运动',
						'学习简单的放松技巧',
						'与朋友保持社交联系'
					];
				} else if (score <= 14) {
					report.level = '中度抑郁';
					report.summary = '您的抑郁症状评分为中度，建议采取措施改善情绪，必要时寻求专业帮助。';
					report.recommendations = [
						'建议预约校内心理咨询师',
						'学习认知行为技巧来应对消极思维',
						'保持社交活动，避免孤独',
						'确保规律作息和健康饮食'
					];
				} else if (score <= 19) {
					report.level = '中重度抑郁';
					report.summary = '您的抑郁症状评分为中重度，建议尽快寻求专业心理咨询帮助。';
					report.recommendations = [
						'尽快预约校内心理咨询师',
						'告知信任的朋友或家人您的感受',
						'减轻学业压力，适当调整计划',
						'规律作息，避免熬夜'
					];
				} else {
					report.level = '重度抑郁';
					report.summary = '您的抑郁症状评分为重度，强烈建议立即寻求专业心理健康服务。';
					report.recommendations = [
						'立即联系校内心理咨询中心或医院精神科',
						'不要独处，告知家人或密友',
						'暂时减少压力源',
						'遵循专业人士的建议和治疗计划'
					];
				}
			}
			// GAD-7 评分解释
			else if (this.assessmentId == 2) {
				if (score <= 4) {
					report.level = '无焦虑';
					report.summary = '您的焦虑症状评分为无或极轻度，目前状态良好。';
					report.recommendations = [
						'保持健康的生活方式',
						'继续使用有效的压力管理策略',
						'定期进行放松活动'
					];
				} else if (score <= 9) {
					report.level = '轻度焦虑';
					report.summary = '您的焦虑症状评分为轻度，建议关注压力管理和放松技巧。';
					report.recommendations = [
						'学习呼吸放松技巧',
						'每天进行15分钟正念冥想',
						'保持规律作息',
						'适当运动缓解压力'
					];
				} else if (score <= 14) {
					report.level = '中度焦虑';
					report.summary = '您的焦虑症状评分为中度，建议学习焦虑管理技巧，必要时寻求专业帮助。';
					report.recommendations = [
						'建议预约校内心理咨询师',
						'学习认知行为技巧来应对焦虑思维',
						'减少咖啡因等刺激物摄入',
						'建立规律的日常计划，减少不确定性'
					];
				} else {
					report.level = '重度焦虑';
					report.summary = '您的焦虑症状评分为重度，建议尽快寻求专业心理咨询帮助。';
					report.recommendations = [
						'尽快预约校内心理咨询师',
						'与亲友分享您的感受',
						'减少压力源',
						'学习并实践焦虑管理技巧'
					];
				}
			}
			
			return report;
		}
	}
}
</script>

<style>
.assessment-detail-page {
	background-color: #ffffff;
	min-height: 100vh;
	padding: 0 0 40rpx;
	position: relative;
}

.progress-bar {
	width: 100%;
	height: 10rpx;
	background-color: #f0f0f0;
}

.progress-inner {
	height: 100%;
	background-color: #007AFF;
	transition: width 0.3s;
}

.progress-text {
	text-align: center;
	font-size: 24rpx;
	color: #999;
	margin: 10rpx 0 30rpx;
}

.assessment-header {
	padding: 0 40rpx;
	margin-bottom: 40rpx;
}

.assessment-title {
	font-size: 36rpx;
	color: #333;
	font-weight: bold;
	margin-bottom: 15rpx;
	display: block;
}

.assessment-desc {
	font-size: 28rpx;
	color: #666;
	line-height: 1.5;
	display: block;
}

.question-container {
	padding: 0 40rpx;
	margin-bottom: 60rpx;
}

.question-text {
	font-size: 32rpx;
	color: #333;
	font-weight: bold;
	line-height: 1.5;
	margin-bottom: 40rpx;
	display: block;
}

.options-list {
	margin-top: 20rpx;
}

.option-item {
	display: flex;
	align-items: center;
	padding: 30rpx;
	background-color: #f9f9f9;
	margin-bottom: 20rpx;
	border-radius: 10rpx;
	transition: all 0.2s;
}

.option-item.selected {
	background-color: #e6f2ff;
	border: 1px solid #007AFF;
}

.option-radio {
	width: 40rpx;
	height: 40rpx;
	border-radius: 20rpx;
	border: 2rpx solid #cccccc;
	margin-right: 20rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.option-item.selected .option-radio {
	border-color: #007AFF;
}

.radio-inner {
	width: 24rpx;
	height: 24rpx;
	border-radius: 12rpx;
	background-color: #007AFF;
}

.option-text {
	font-size: 28rpx;
	color: #333;
	flex: 1;
}

.action-buttons {
	display: flex;
	justify-content: space-between;
	padding: 0 40rpx;
	margin-top: 60rpx;
}

.action-btn {
	width: 45%;
	padding: 20rpx 0;
	text-align: center;
	border-radius: 10rpx;
	font-size: 30rpx;
}

.action-btn.prev {
	background-color: #f0f0f0;
	color: #666;
}

.action-btn.next {
	background-color: #007AFF;
	color: #ffffff;
}

.action-btn.disabled {
	opacity: 0.5;
}

.tip-container {
	display: flex;
	align-items: center;
	margin: 60rpx 40rpx 0;
	padding: 20rpx;
	background-color: #f9f9f9;
	border-radius: 10rpx;
}

.tip-icon {
	width: 40rpx;
	height: 40rpx;
	border-radius: 20rpx;
	background-color: #999;
	color: #fff;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 24rpx;
	font-style: italic;
	margin-right: 20rpx;
}

.tip-text {
	font-size: 24rpx;
	color: #666;
	flex: 1;
	line-height: 1.5;
}

/* 完成弹窗 */
.completion-popup {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 999;
	display: flex;
	align-items: center;
	justify-content: center;
}

.popup-mask {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0,0,0,0.5);
}

.popup-content {
	position: relative;
	width: 80%;
	background-color: #fff;
	border-radius: 20rpx;
	padding: 60rpx 40rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.completion-image {
	width: 200rpx;
	height: 200rpx;
	margin-bottom: 30rpx;
}

.completion-title {
	font-size: 36rpx;
	color: #333;
	font-weight: bold;
	margin-bottom: 15rpx;
}

.completion-desc {
	font-size: 28rpx;
	color: #666;
	margin-bottom: 30rpx;
}

.loading-dots {
	display: flex;
	justify-content: center;
	margin-bottom: 20rpx;
}

.dot {
	width: 16rpx;
	height: 16rpx;
	border-radius: 8rpx;
	background-color: #007AFF;
	margin: 0 8rpx;
	animation: dotPulse 1.4s infinite ease-in-out;
}

.dot:nth-child(1) {
	animation-delay: 0s;
}

.dot:nth-child(2) {
	animation-delay: 0.2s;
}

.dot:nth-child(3) {
	animation-delay: 0.4s;
}

@keyframes dotPulse {
	0%, 80%, 100% { 
		transform: scale(0.5);
		opacity: 0.5;
	}
	40% { 
		transform: scale(1.0);
		opacity: 1.0;
	}
}

.completion-note {
	font-size: 24rpx;
	color: #999;
}
</style> 
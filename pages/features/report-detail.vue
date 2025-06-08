<template>
	<view class="report-detail-page">
		<!-- 顶部状态栏 -->
		<view class="status-bar" :class="levelClass">
			<view class="status-content">
				<view class="status-left">
					<text class="status-label">状态评估</text>
					<text class="status-value">{{reportData.level}}</text>
				</view>
				<view class="status-right">
					<text class="score-label">总分</text>
					<text class="score-value">{{reportData.score}}</text>
				</view>
			</view>
		</view>
		
		<!-- 报告基本信息 -->
		<view class="report-header">
			<text class="report-title">{{reportData.title}}</text>
			<text class="report-date">{{reportData.date}}</text>
			
			<view class="report-share">
				<button class="share-btn" @tap="shareReport">
					<image src="/static/images/share.png" mode="aspectFit"></image>
					<text>分享报告</text>
				</button>
				<button class="download-btn" @tap="downloadReport">
					<image src="/static/images/download.png" mode="aspectFit"></image>
					<text>保存</text>
				</button>
			</view>
		</view>
		
		<!-- 报告内容 -->
		<view class="report-content">
			<!-- 总结部分 -->
			<view class="report-section summary-section">
				<view class="section-header">
					<image src="/static/images/summary.png" mode="aspectFit" class="section-icon"></image>
					<text class="section-title">评估总结</text>
				</view>
				<view class="section-content">
					<text class="summary-text">{{reportData.summary}}</text>
					
					<view class="score-chart">
						<view class="chart-container">
							<canvas canvas-id="scoreChart" class="score-canvas"></canvas>
						</view>
						<view class="chart-legend">
							<view class="legend-item" v-for="(level, index) in scoreLevels" :key="index">
								<view class="legend-color" :style="{ backgroundColor: getColorByLevel(level.name) }"></view>
								<text class="legend-text">{{level.name}} ({{level.range}})</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 建议部分 -->
			<view class="report-section recommendations-section">
				<view class="section-header">
					<image src="/static/images/recommendations.png" mode="aspectFit" class="section-icon"></image>
					<text class="section-title">改善建议</text>
				</view>
				<view class="section-content">
					<view class="recommendation-list">
						<view class="recommendation-item" v-for="(item, index) in reportData.recommendations" :key="index">
							<view class="recommendation-bullet">{{index + 1}}</view>
							<text class="recommendation-text">{{item}}</text>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 详细分析 -->
			<view class="report-section analysis-section">
				<view class="section-header">
					<image src="/static/images/analysis.png" mode="aspectFit" class="section-icon"></image>
					<text class="section-title">详细分析</text>
				</view>
				<view class="section-content">
					<view class="analysis-content">
						<text class="analysis-text">{{getAnalysisText()}}</text>
					</view>
				</view>
			</view>
			
			<!-- 在线资源 -->
			<view class="report-section resources-section">
				<view class="section-header">
					<image src="/static/images/resources.png" mode="aspectFit" class="section-icon"></image>
					<text class="section-title">在线资源</text>
				</view>
				<view class="section-content">
					<view class="resource-list">
						<view class="resource-item" v-for="(resource, index) in relevantResources" :key="index" @tap="openResource(resource)">
							<image :src="resource.icon" mode="aspectFit" class="resource-icon"></image>
							<view class="resource-info">
								<text class="resource-title">{{resource.title}}</text>
								<text class="resource-desc">{{resource.description}}</text>
							</view>
							<image src="/static/images/arrow-right.png" mode="aspectFit" class="arrow-icon"></image>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 底部操作区 -->
		<view class="action-area">
			<button class="action-btn consultation" @tap="bookConsultation">
				<text>预约心理咨询</text>
			</button>
			<button class="action-btn retake" @tap="retakeAssessment">
				<text>重新测评</text>
			</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			assessmentId: null,
			score: 0,
			reportData: {
				title: '',
				date: '',
				score: 0,
				level: '',
				summary: '',
				recommendations: []
			},
			
			// PHQ-9 评分等级
			phq9Levels: [
				{ name: '无或极轻度抑郁', range: '0-4', color: '#52C41A' },
				{ name: '轻度抑郁', range: '5-9', color: '#FAAD14' },
				{ name: '中度抑郁', range: '10-14', color: '#FA8C16' },
				{ name: '中重度抑郁', range: '15-19', color: '#F5222D' },
				{ name: '重度抑郁', range: '20-27', color: '#A8071A' }
			],
			
			// GAD-7 评分等级
			gad7Levels: [
				{ name: '无焦虑', range: '0-4', color: '#52C41A' },
				{ name: '轻度焦虑', range: '5-9', color: '#FAAD14' },
				{ name: '中度焦虑', range: '10-14', color: '#FA8C16' },
				{ name: '重度焦虑', range: '15-21', color: '#F5222D' }
			],
			
			// 相关资源
			depression_resources: [
				{
					title: '抑郁自助指南',
					description: '了解如何通过自助方式改善抑郁症状',
					icon: '/static/images/guide.png',
					url: ''
				},
				{
					title: '正念冥想练习',
					description: '音频引导的冥想练习，帮助缓解抑郁情绪',
					icon: '/static/images/meditation.png',
					url: ''
				},
				{
					title: '认知行为练习',
					description: '学习识别和挑战消极思维模式',
					icon: '/static/images/cbt.png',
					url: ''
				}
			],
			
			anxiety_resources: [
				{
					title: '焦虑管理技巧',
					description: '实用的方法来应对和减轻焦虑症状',
					icon: '/static/images/tips.png',
					url: ''
				},
				{
					title: '呼吸放松练习',
					description: '简单有效的呼吸技巧，快速缓解焦虑',
					icon: '/static/images/breathing.png',
					url: ''
				},
				{
					title: '压力管理指南',
					description: '学习如何识别压力源并有效管理压力',
					icon: '/static/images/stress.png',
					url: ''
				}
			]
		}
	},
	computed: {
		levelClass() {
			return this.getLevelClass(this.reportData.level);
		},
		scoreLevels() {
			return this.assessmentId == 1 ? this.phq9Levels : this.gad7Levels;
		},
		relevantResources() {
			return this.assessmentId == 1 ? this.depression_resources : this.anxiety_resources;
		}
	},
	onLoad(options) {
		this.assessmentId = options.id;
		this.score = options.score;
		this.loadReportData();
	},
	onReady() {
		this.drawScoreChart();
	},
	methods: {
		// 加载报告数据
		loadReportData() {
			// 实际应用中应从服务器获取报告数据
			this.reportData.score = this.score;
			this.reportData.date = new Date().toISOString().split('T')[0];
			
			// PHQ-9 抑郁量表
			if (this.assessmentId == 1) {
				this.reportData.title = 'PHQ-9 抑郁症筛查量表';
				
				if (this.score <= 4) {
					this.reportData.level = '无或极轻度抑郁';
					this.reportData.summary = '您的抑郁症状评分为无或极轻度，目前状态良好。';
					this.reportData.recommendations = [
						'保持健康的生活方式',
						'规律作息，保证充足睡眠',
						'持续锻炼身体，每周至少150分钟中等强度运动'
					];
				} else if (this.score <= 9) {
					this.reportData.level = '轻度抑郁';
					this.reportData.summary = '您的抑郁症状评分为轻度，建议关注情绪变化，保持规律作息和适当运动。';
					this.reportData.recommendations = [
						'保持规律的作息时间',
						'每天进行30分钟有氧运动',
						'学习简单的放松技巧',
						'与朋友保持社交联系'
					];
				} else if (this.score <= 14) {
					this.reportData.level = '中度抑郁';
					this.reportData.summary = '您的抑郁症状评分为中度，建议采取措施改善情绪，必要时寻求专业帮助。';
					this.reportData.recommendations = [
						'建议预约校内心理咨询师',
						'学习认知行为技巧来应对消极思维',
						'保持社交活动，避免孤独',
						'确保规律作息和健康饮食'
					];
				} else if (this.score <= 19) {
					this.reportData.level = '中重度抑郁';
					this.reportData.summary = '您的抑郁症状评分为中重度，建议尽快寻求专业心理咨询帮助。';
					this.reportData.recommendations = [
						'尽快预约校内心理咨询师',
						'告知信任的朋友或家人您的感受',
						'减轻学业压力，适当调整计划',
						'规律作息，避免熬夜'
					];
				} else {
					this.reportData.level = '重度抑郁';
					this.reportData.summary = '您的抑郁症状评分为重度，强烈建议立即寻求专业心理咨询帮助。';
					this.reportData.recommendations = [
						'立即联系校内心理咨询中心或医院精神科',
						'不要独处，告知家人或密友',
						'暂时减少压力源',
						'遵循专业人士的建议和治疗计划'
					];
				}
			} 
			// GAD-7 焦虑量表
			else if (this.assessmentId == 2) {
				this.reportData.title = 'GAD-7 广泛性焦虑量表';
				
				if (this.score <= 4) {
					this.reportData.level = '无焦虑';
					this.reportData.summary = '您的焦虑症状评分为无或极轻度，目前状态良好。';
					this.reportData.recommendations = [
						'保持健康的生活方式',
						'继续使用有效的压力管理策略',
						'定期进行放松活动'
					];
				} else if (this.score <= 9) {
					this.reportData.level = '轻度焦虑';
					this.reportData.summary = '您的焦虑症状评分为轻度，建议关注压力管理和放松技巧。';
					this.reportData.recommendations = [
						'学习呼吸放松技巧',
						'每天进行15分钟正念冥想',
						'保持规律作息',
						'适当运动缓解压力'
					];
				} else if (this.score <= 14) {
					this.reportData.level = '中度焦虑';
					this.reportData.summary = '您的焦虑症状评分为中度，建议学习焦虑管理技巧，必要时寻求专业帮助。';
					this.reportData.recommendations = [
						'建议预约校内心理咨询师',
						'学习认知行为技巧来应对焦虑思维',
						'减少咖啡因等刺激物摄入',
						'建立规律的日常计划，减少不确定性'
					];
				} else {
					this.reportData.level = '重度焦虑';
					this.reportData.summary = '您的焦虑症状评分为重度，建议尽快寻求专业心理咨询帮助。';
					this.reportData.recommendations = [
						'尽快预约校内心理咨询师',
						'与亲友分享您的感受',
						'减少压力源',
						'学习并实践焦虑管理技巧'
					];
				}
			}
		},
		
		// 根据级别获取对应的CSS类
		getLevelClass(level) {
			if (level.includes('无') || level.includes('极轻度')) {
				return 'level-none';
			} else if (level.includes('轻度')) {
				return 'level-mild';
			} else if (level.includes('中度') && !level.includes('重')) {
				return 'level-moderate';
			} else if (level.includes('中重度')) {
				return 'level-moderately-severe';
			} else if (level.includes('重度')) {
				return 'level-severe';
			}
			return '';
		},
		
		// 根据级别获取颜色
		getColorByLevel(level) {
			if (level.includes('无') || level.includes('极轻度')) {
				return '#52C41A';
			} else if (level.includes('轻度')) {
				return '#FAAD14';
			} else if (level.includes('中度') && !level.includes('重')) {
				return '#FA8C16';
			} else if (level.includes('中重度')) {
				return '#F5222D';
			} else if (level.includes('重度')) {
				return '#A8071A';
			}
			return '#666';
		},
		
		// 绘制得分图表
		drawScoreChart() {
			// 注意：uni-app 的 canvas API 与微信小程序相同，但在实际应用中可能需要额外引入图表库
			// 这里仅给出一个简单的示例，实际应用建议使用 echarts 等图表库
			const ctx = uni.createCanvasContext('scoreChart', this);
			const canvasWidth = 300;
			const canvasHeight = 150;
			
			// 绘制背景
			ctx.beginPath();
			ctx.rect(0, 0, canvasWidth, canvasHeight);
			ctx.setFillStyle('#f5f5f5');
			ctx.fill();
			
			// 计算得分的位置
			const maxScore = this.assessmentId == 1 ? 27 : 21;
			const scorePosition = (this.score / maxScore) * canvasWidth;
			
			// 绘制等级区域
			const levels = this.scoreLevels;
			let startX = 0;
			
			levels.forEach((level, index) => {
				const rangeArr = level.range.split('-');
				const start = parseInt(rangeArr[0]);
				const end = parseInt(rangeArr[1]);
				const width = ((end - start + 1) / maxScore) * canvasWidth;
				
				ctx.beginPath();
				ctx.rect(startX, 30, width, 40);
				ctx.setFillStyle(level.color);
				ctx.fill();
				
				startX += width;
			});
			
			// 绘制得分指示器
			ctx.beginPath();
			ctx.moveTo(scorePosition, 20);
			ctx.lineTo(scorePosition - 10, 0);
			ctx.lineTo(scorePosition + 10, 0);
			ctx.closePath();
			ctx.setFillStyle('#333');
			ctx.fill();
			
			// 绘制分数文字
			ctx.setFontSize(14);
			ctx.setFillStyle('#333');
			ctx.setTextAlign('center');
			ctx.fillText(`得分: ${this.score}`, scorePosition, 15);
			
			// 绘制
			ctx.draw();
		},
		
		// 获取详细分析文本
		getAnalysisText() {
			if (this.assessmentId == 1) { // PHQ-9
				if (this.score <= 4) {
					return "您目前的抑郁症状评分处于'无或极轻度'范围，表明您近期情绪状态良好，没有明显的抑郁症状。建议您继续保持健康的生活方式，规律作息，适当运动，保持良好的社交活动。";
				} else if (this.score <= 9) {
					return "您目前的抑郁症状评分处于'轻度'范围，表明您可能有一些情绪低落或兴趣减退的症状，但通常不会明显影响日常功能。建议您关注情绪变化，保持规律作息和适当运动，学习一些简单的情绪管理技巧，如果症状持续或加重，可以考虑寻求专业帮助。";
				} else if (this.score <= 14) {
					return "您目前的抑郁症状评分处于'中度'范围，表明您可能正在经历明显的抑郁症状，如持续的情绪低落、兴趣减退、睡眠问题等。这些症状可能已经对您的日常生活和学习产生一定影响。建议您采取积极措施改善情绪，如规律作息、适当运动、保持社交活动，同时考虑寻求校内心理咨询师的专业帮助。";
				} else if (this.score <= 19) {
					return "您目前的抑郁症状评分处于'中重度'范围，表明您可能正在经历较为严重的抑郁症状，这些症状很可能已经明显影响了您的日常功能和生活质量。强烈建议您尽快寻求专业心理咨询帮助，同时告知信任的朋友或家人您的感受，减轻学业压力，适当调整计划，确保规律作息。";
				} else {
					return "您目前的抑郁症状评分处于'重度'范围，表明您可能正在经历严重的抑郁症状，这些症状很可能已经严重影响了您的日常生活功能。强烈建议您立即联系校内心理咨询中心或医院精神科寻求专业帮助，不要独处，告知家人或密友，暂时减少压力源，并遵循专业人士的建议和治疗计划。";
				}
			} else if (this.assessmentId == 2) { // GAD-7
				if (this.score <= 4) {
					return "您目前的焦虑症状评分处于'无焦虑'范围，表明您近期情绪状态稳定，没有明显的焦虑症状。建议您继续保持健康的生活方式，继续使用有效的压力管理策略，定期进行放松活动。";
				} else if (this.score <= 9) {
					return "您目前的焦虑症状评分处于'轻度焦虑'范围，表明您可能有一些担忧和紧张感，但通常不会明显影响日常功能。建议您学习一些呼吸放松技巧，每天进行短时正念冥想，保持规律作息，适当运动缓解压力。";
				} else if (this.score <= 14) {
					return "您目前的焦虑症状评分处于'中度焦虑'范围，表明您可能正在经历明显的焦虑症状，如过度担忧、紧张不安、难以放松等。这些症状可能已经对您的日常生活和学习产生一定影响。建议您学习焦虑管理技巧，减少咖啡因等刺激物摄入，建立规律的日常计划，同时考虑寻求校内心理咨询师的专业帮助。";
				} else {
					return "您目前的焦虑症状评分处于'重度焦虑'范围，表明您可能正在经历严重的焦虑症状，这些症状很可能已经明显影响了您的日常功能和生活质量。强烈建议您尽快寻求专业心理咨询帮助，同时与亲友分享您的感受，减少压力源，学习并实践焦虑管理技巧。";
				}
			}
			return "";
		},
		
		// 分享报告
		shareReport() {
			uni.showToast({
				title: '分享功能开发中',
				icon: 'none'
			});
		},
		
		// 下载/保存报告
		downloadReport() {
			uni.showToast({
				title: '报告已保存',
				icon: 'success'
			});
		},
		
		// 打开资源
		openResource(resource) {
			uni.showToast({
				title: '正在打开: ' + resource.title,
				icon: 'none'
			});
		},
		
		// 预约咨询
		bookConsultation() {
			uni.navigateTo({
				url: '/pages/features/psychological-assessment?tab=2'
			});
		},
		
		// 重新测评
		retakeAssessment() {
			uni.navigateTo({
				url: `/pages/features/assessment-detail?id=${this.assessmentId}`
			});
		}
	}
}
</script>

<style>
.report-detail-page {
	background-color: #f5f5f5;
	min-height: 100vh;
	padding-bottom: 120rpx;
}

/* 顶部状态栏 */
.status-bar {
	padding: 30rpx;
	color: #ffffff;
}

.level-none {
	background-color: #52C41A;
}

.level-mild {
	background-color: #FAAD14;
}

.level-moderate {
	background-color: #FA8C16;
}

.level-moderately-severe {
	background-color: #F5222D;
}

.level-severe {
	background-color: #A8071A;
}

.status-content {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.status-left {
	display: flex;
	flex-direction: column;
}

.status-label {
	font-size: 24rpx;
	opacity: 0.8;
	margin-bottom: 6rpx;
}

.status-value {
	font-size: 40rpx;
	font-weight: bold;
}

.status-right {
	text-align: right;
}

.score-label {
	font-size: 24rpx;
	opacity: 0.8;
	display: block;
	margin-bottom: 6rpx;
}

.score-value {
	font-size: 60rpx;
	font-weight: bold;
}

/* 报告头部 */
.report-header {
	background-color: #ffffff;
	padding: 30rpx;
	margin-bottom: 20rpx;
}

.report-title {
	font-size: 34rpx;
	color: #333;
	font-weight: bold;
	margin-bottom: 10rpx;
	display: block;
}

.report-date {
	font-size: 26rpx;
	color: #999;
	display: block;
	margin-bottom: 20rpx;
}

.report-share {
	display: flex;
	margin-top: 20rpx;
}

.share-btn, .download-btn {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0;
	background-color: transparent;
	margin: 0;
	font-size: 26rpx;
	line-height: 1.5;
}

.share-btn {
	color: #007AFF;
	margin-right: 40rpx;
}

.download-btn {
	color: #666;
}

.share-btn::after, .download-btn::after {
	display: none;
}

.share-btn image, .download-btn image {
	width: 32rpx;
	height: 32rpx;
	margin-right: 10rpx;
}

/* 报告内容 */
.report-content {
	padding: 0 20rpx;
}

.report-section {
	background-color: #ffffff;
	border-radius: 10rpx;
	margin-bottom: 20rpx;
	overflow: hidden;
}

.section-header {
	display: flex;
	align-items: center;
	padding: 20rpx;
	border-bottom: 1px solid #f0f0f0;
}

.section-icon {
	width: 40rpx;
	height: 40rpx;
	margin-right: 16rpx;
}

.section-title {
	font-size: 30rpx;
	color: #333;
	font-weight: bold;
}

.section-content {
	padding: 20rpx;
}

/* 总结部分 */
.summary-text {
	font-size: 28rpx;
	color: #333;
	line-height: 1.6;
	margin-bottom: 30rpx;
	display: block;
}

.score-chart {
	margin-top: 30rpx;
}

.chart-container {
	width: 100%;
	height: 150rpx;
	margin-bottom: 20rpx;
}

.score-canvas {
	width: 100%;
	height: 100%;
}

.chart-legend {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-around;
}

.legend-item {
	display: flex;
	align-items: center;
	margin-right: 20rpx;
	margin-bottom: 10rpx;
}

.legend-color {
	width: 20rpx;
	height: 20rpx;
	border-radius: 4rpx;
	margin-right: 8rpx;
}

.legend-text {
	font-size: 22rpx;
	color: #666;
}

/* 建议部分 */
.recommendation-list {
	margin-top: 10rpx;
}

.recommendation-item {
	display: flex;
	margin-bottom: 20rpx;
}

.recommendation-bullet {
	width: 40rpx;
	height: 40rpx;
	border-radius: 20rpx;
	background-color: #007AFF;
	color: #fff;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 24rpx;
	margin-right: 20rpx;
	flex-shrink: 0;
}

.recommendation-text {
	font-size: 28rpx;
	color: #333;
	line-height: 1.6;
	flex: 1;
}

/* 详细分析 */
.analysis-content {
	background-color: #f9f9f9;
	padding: 20rpx;
	border-radius: 6rpx;
}

.analysis-text {
	font-size: 28rpx;
	color: #333;
	line-height: 1.6;
}

/* 资源部分 */
.resource-list {
	margin-top: 10rpx;
}

.resource-item {
	display: flex;
	align-items: center;
	padding: 20rpx 0;
	border-bottom: 1px solid #f0f0f0;
}

.resource-item:last-child {
	border-bottom: none;
}

.resource-icon {
	width: 60rpx;
	height: 60rpx;
	margin-right: 20rpx;
}

.resource-info {
	flex: 1;
}

.resource-title {
	font-size: 28rpx;
	color: #333;
	margin-bottom: 6rpx;
	display: block;
}

.resource-desc {
	font-size: 24rpx;
	color: #999;
	display: block;
}

.arrow-icon {
	width: 32rpx;
	height: 32rpx;
}

/* 底部操作区 */
.action-area {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	display: flex;
	padding: 20rpx;
	background-color: #ffffff;
	box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.05);
	box-sizing: border-box;
	z-index: 9;
}

.action-btn {
	flex: 1;
	height: 80rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 10rpx;
	font-size: 28rpx;
	margin: 0 10rpx;
}

.action-btn::after {
	display: none;
}

.action-btn.consultation {
	background-color: #007AFF;
	color: #ffffff;
}

.action-btn.retake {
	background-color: #f0f0f0;
	color: #666;
}
</style> 
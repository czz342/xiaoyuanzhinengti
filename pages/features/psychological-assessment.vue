<template>
	<view class="psych-assessment-page">
		<!-- 顶部banner -->
		<view class="assessment-banner">
			<image src="/static/images/psychology-banner.png" mode="aspectFill" class="banner-image"></image>
			<view class="banner-content">
				<text class="banner-title">心理健康评估</text>
				<text class="banner-subtitle">关爱自己，从了解开始</text>
			</view>
		</view>
		
		<!-- 主内容区域 -->
		<view class="assessment-container">
			<!-- 标签页切换 -->
			<view class="tabs">
				<view 
					class="tab-item" 
					v-for="(tab, index) in tabs" 
					:key="index" 
					:class="{ active: currentTab === index }"
					@tap="switchTab(index)"
				>
					<text>{{tab}}</text>
				</view>
			</view>
			
			<!-- 评估问卷列表 -->
			<view class="assessment-list" v-if="currentTab === 0">
				<view class="section-title">
					<text>专业评估问卷</text>
				</view>
				
				<view class="assessment-cards">
					<view class="assessment-card" v-for="(item, index) in assessmentList" :key="index" @tap="startAssessment(item)">
						<view class="card-left">
							<image :src="item.icon" mode="aspectFit" class="card-icon"></image>
						</view>
						<view class="card-content">
							<view class="card-title">{{item.title}}</view>
							<view class="card-desc">{{item.description}}</view>
							<view class="card-meta">
								<text class="meta-item"><text class="meta-label">题目:</text> {{item.questionCount}}题</text>
								<text class="meta-item"><text class="meta-label">时间:</text> 约{{item.timeNeeded}}分钟</text>
							</view>
						</view>
						<view class="card-right">
							<image src="/static/images/arrow-right.png" mode="aspectFit" class="arrow-icon"></image>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 我的报告 -->
			<view class="report-list" v-if="currentTab === 1">
				<view class="section-title">
					<text>我的评估报告</text>
				</view>
				
				<view class="empty-state" v-if="myReports.length === 0">
					<image src="/static/images/empty-reports.png" mode="aspectFit" class="empty-image"></image>
					<text class="empty-text">暂无评估报告</text>
					<button class="primary-btn" @tap="switchTab(0)">去完成评估</button>
				</view>
				
				<view class="report-cards" v-else>
					<view class="report-card" v-for="(report, index) in myReports" :key="index" @tap="viewReport(report)">
						<view class="report-header">
							<text class="report-title">{{report.title}}</text>
							<text class="report-date">{{report.date}}</text>
						</view>
						<view class="report-summary">
							<text class="summary-text">{{report.summary}}</text>
						</view>
						<view class="report-footer">
							<view class="score-display">
								<text class="score-label">总分</text>
								<text class="score-value">{{report.score}}</text>
							</view>
							<button class="view-btn">查看详情</button>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 咨询预约 -->
			<view class="counseling-section" v-if="currentTab === 2">
				<view class="section-title">
					<text>咨询师预约</text>
				</view>
				
				<view class="counselor-list">
					<view class="counselor-card" v-for="(counselor, index) in counselors" :key="index" @tap="showCounselorDetail(counselor)">
						<image :src="counselor.avatar" mode="aspectFill" class="counselor-avatar"></image>
						<view class="counselor-info">
							<view class="counselor-header">
								<text class="counselor-name">{{counselor.name}}</text>
								<text class="counselor-title">{{counselor.title}}</text>
							</view>
							<view class="counselor-specialties">
								<text class="specialty-label">专长：</text>
								<view class="specialty-tags">
									<text class="specialty-tag" v-for="(tag, tagIndex) in counselor.specialties" :key="tagIndex">{{tag}}</text>
								</view>
							</view>
							<view class="counselor-rating">
								<view class="stars">
									<text class="star" v-for="n in 5" :key="n" :class="{active: n <= counselor.rating}">★</text>
								</view>
								<text class="rating-value">{{counselor.rating.toFixed(1)}}</text>
								<text class="rating-count">({{counselor.ratingCount}})</text>
							</view>
						</view>
						<button class="book-btn">预约</button>
					</view>
				</view>
			</view>
		</view>

		<!-- 咨询师详情弹窗 -->
		<view class="counselor-detail-popup" v-if="showCounselorDetailPopup">
			<view class="popup-mask" @tap="hideCounselorDetail"></view>
			<view class="popup-content">
				<view class="popup-header">
					<text class="popup-title">咨询师详情</text>
					<view class="popup-close" @tap="hideCounselorDetail">
						<image src="/static/images/close.png" mode="aspectFit"></image>
					</view>
				</view>
				
				<view class="popup-body">
					<view class="counselor-profile">
						<image :src="currentCounselor.avatar" mode="aspectFill" class="profile-avatar"></image>
						<view class="profile-basic">
							<text class="profile-name">{{currentCounselor.name}}</text>
							<text class="profile-title">{{currentCounselor.title}}</text>
							<view class="profile-rating">
								<view class="stars">
									<text class="star" v-for="n in 5" :key="n" :class="{active: n <= currentCounselor.rating}">★</text>
								</view>
								<text class="rating-value">{{currentCounselor.rating.toFixed(1)}}</text>
							</view>
						</view>
					</view>
					
					<view class="profile-detail">
						<view class="detail-item">
							<text class="detail-label">专业背景</text>
							<text class="detail-value">{{currentCounselor.background}}</text>
						</view>
						<view class="detail-item">
							<text class="detail-label">咨询专长</text>
							<view class="specialty-tags">
								<text class="specialty-tag" v-for="(tag, tagIndex) in currentCounselor.specialties" :key="tagIndex">{{tag}}</text>
							</view>
						</view>
						<view class="detail-item">
							<text class="detail-label">咨询风格</text>
							<text class="detail-value">{{currentCounselor.style}}</text>
						</view>
						<view class="detail-item">
							<text class="detail-label">可预约时段</text>
							<view class="time-slots">
								<view class="date-selector">
									<view class="date-arrow" @tap="previousDate">
										<image src="/static/images/arrow-left.png" mode="aspectFit"></image>
									</view>
									<view class="dates">
										<view 
											class="date-item" 
											v-for="(date, dateIndex) in availableDates" 
											:key="dateIndex"
											:class="{active: selectedDateIndex === dateIndex}"
											@tap="selectDate(dateIndex)"
										>
											<text class="date-day">{{date.day}}</text>
											<text class="date-weekday">{{date.weekday}}</text>
										</view>
									</view>
									<view class="date-arrow" @tap="nextDate">
										<image src="/static/images/arrow-right.png" mode="aspectFit"></image>
									</view>
								</view>
								
								<view class="time-grid">
									<view 
										class="time-block" 
										v-for="(time, timeIndex) in availableTimeSlots" 
										:key="timeIndex"
										:class="{
											available: time.available,
											selected: selectedTimeIndex === timeIndex && time.available
										}"
										@tap="selectTime(timeIndex, time)"
									>
										<text>{{time.time}}</text>
									</view>
								</view>
							</view>
						</view>
					</view>
					
					<button 
						class="book-button" 
						:disabled="!selectedTimeIndex >= 0"
						:class="{disabled: !(selectedTimeIndex >= 0)}"
						@tap="bookAppointment"
					>
						确认预约
					</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			// 标签页
			tabs: ['评估问卷', '我的报告', '咨询预约'],
			currentTab: 0,
			
			// 评估问卷列表
			assessmentList: [
				{
					id: 1,
					title: 'PHQ-9 抑郁症筛查量表',
					description: '用于评估个体是否存在抑郁症状及其严重程度',
					questionCount: 9,
					timeNeeded: 3,
					icon: '/static/images/assessment-depression.png'
				},
				{
					id: 2,
					title: 'GAD-7 广泛性焦虑量表',
					description: '筛查广泛性焦虑障碍，评估焦虑症状严重程度',
					questionCount: 7,
					timeNeeded: 2,
					icon: '/static/images/assessment-anxiety.png'
				},
				{
					id: 3,
					title: 'SAS 社交焦虑量表',
					description: '评估社交情境中的焦虑水平及社交恐惧程度',
					questionCount: 20,
					timeNeeded: 5,
					icon: '/static/images/assessment-social.png'
				},
				{
					id: 4,
					title: '大学生心理健康综合评估',
					description: '全面评估大学生常见心理健康问题和心理适应状态',
					questionCount: 30,
					timeNeeded: 10,
					icon: '/static/images/assessment-comprehensive.png'
				}
			],
			
			// 我的报告
			myReports: [
				{
					id: 1,
					title: 'PHQ-9 抑郁症筛查量表',
					date: '2023-05-15',
					score: 4,
					summary: '您的抑郁症状评分为轻度，建议关注情绪变化，保持规律作息和适当运动。',
					recommendations: [
						'保持规律的作息时间',
						'每天进行30分钟有氧运动',
						'学习简单的放松技巧',
						'与朋友保持社交联系'
					]
				},
				{
					id: 2,
					title: 'GAD-7 广泛性焦虑量表',
					date: '2023-05-10',
					score: 6,
					summary: '您的焦虑症状评分为中度，建议学习焦虑管理技巧，必要时寻求专业帮助。',
					recommendations: [
						'学习呼吸放松技巧',
						'尝试正念冥想练习',
						'识别并挑战消极思维',
						'考虑预约心理咨询'
					]
				}
			],
			
			// 咨询师列表
			counselors: [
				{
					id: 1,
					name: '王丽萍',
					title: '资深心理咨询师',
					avatar: '/static/images/counselor1.png',
					specialties: ['抑郁症', '焦虑障碍', '人际关系'],
					rating: 4.9,
					ratingCount: 128,
					background: '北京大学心理学博士，10年心理咨询经验，擅长认知行为疗法和心理动力学疗法。',
					style: '温和支持型，善于倾听，注重建立咨询关系，帮助来访者发掘自身资源解决问题。'
				},
				{
					id: 2,
					name: '李明哲',
					title: '心理咨询师',
					avatar: '/static/images/counselor2.png',
					specialties: ['学业压力', '情绪管理', '生涯规划'],
					rating: 4.7,
					ratingCount: 86,
					background: '清华大学应用心理学硕士，5年大学生心理咨询经验，擅长解决方案聚焦治疗。',
					style: '直接引导型，善于提供明确反馈和具体建议，帮助来访者找到实用解决方案。'
				},
				{
					id: 3,
					name: '张雨晴',
					title: '青少年心理咨询师',
					avatar: '/static/images/counselor3.png',
					specialties: ['自我认同', '亲子关系', '适应困难'],
					rating: 4.8,
					ratingCount: 103,
					background: '中国科学院心理研究所硕士，8年青少年心理咨询经验，擅长叙事治疗和家庭系统治疗。',
					style: '探索反思型，引导来访者探索内心世界和家庭系统，促进自我认识和关系修复。'
				}
			],
			
			// 咨询预约
			showCounselorDetailPopup: false,
			currentCounselor: {},
			selectedDateIndex: 0,
			selectedTimeIndex: -1,
			availableDates: [
				{ day: '15', weekday: '周一' },
				{ day: '16', weekday: '周二' },
				{ day: '17', weekday: '周三' },
				{ day: '18', weekday: '周四' },
				{ day: '19', weekday: '周五' },
			],
			availableTimeSlots: [
				{ time: '9:00', available: true },
				{ time: '10:00', available: true },
				{ time: '11:00', available: false },
				{ time: '14:00', available: true },
				{ time: '15:00', available: true },
				{ time: '16:00', available: false },
				{ time: '17:00', available: true },
				{ time: '18:00', available: false }
			]
		}
	},
	methods: {
		// 切换标签页
		switchTab(index) {
			this.currentTab = index;
		},
		
		// 开始评估
		startAssessment(item) {
			uni.showToast({
				title: '开始评估：' + item.title,
				icon: 'none'
			});
			// 这里应该跳转到具体的问卷页面
			// uni.navigateTo({
			// 	url: `/pages/features/assessment-detail?id=${item.id}`
			// });
		},
		
		// 查看报告
		viewReport(report) {
			uni.showToast({
				title: '查看报告：' + report.title,
				icon: 'none'
			});
			// 这里应该跳转到报告详情页面
			// uni.navigateTo({
			// 	url: `/pages/features/report-detail?id=${report.id}`
			// });
		},
		
		// 显示咨询师详情
		showCounselorDetail(counselor) {
			this.currentCounselor = counselor;
			this.showCounselorDetailPopup = true;
			this.selectedDateIndex = 0;
			this.selectedTimeIndex = -1;
		},
		
		// 隐藏咨询师详情
		hideCounselorDetail() {
			this.showCounselorDetailPopup = false;
		},
		
		// 日期选择器控制
		previousDate() {
			// 实际应用中应获取前一天的日期数据
			uni.showToast({
				title: '加载前一天日期',
				icon: 'none'
			});
		},
		
		nextDate() {
			// 实际应用中应获取后一天的日期数据
			uni.showToast({
				title: '加载后一天日期',
				icon: 'none'
			});
		},
		
		// 选择日期
		selectDate(index) {
			this.selectedDateIndex = index;
			this.selectedTimeIndex = -1;
			// 实际应用中应根据选择的日期加载可用时间段
		},
		
		// 选择时间
		selectTime(index, time) {
			if (time.available) {
				this.selectedTimeIndex = index;
			}
		},
		
		// 预约咨询
		bookAppointment() {
			if (this.selectedTimeIndex >= 0) {
				const date = this.availableDates[this.selectedDateIndex];
				const time = this.availableTimeSlots[this.selectedTimeIndex];
				
				uni.showModal({
					title: '预约确认',
					content: `您确定要预约${this.currentCounselor.name}咨询师在5月${date.day}日 ${time.time}的咨询吗？`,
					success: (res) => {
						if (res.confirm) {
							uni.showToast({
								title: '预约成功',
								icon: 'success'
							});
							this.hideCounselorDetail();
						}
					}
				});
			}
		}
	}
}
</script>

<style>
.psych-assessment-page {
	background-color: #f5f5f5;
	min-height: 100vh;
}

.assessment-banner {
	position: relative;
	height: 300rpx;
	overflow: hidden;
}

.banner-image {
	width: 100%;
	height: 300rpx;
}

.banner-content {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 0 40rpx;
	background: linear-gradient(to right, rgba(0,0,0,0.5), rgba(0,0,0,0));
}

.banner-title {
	font-size: 40rpx;
	color: #ffffff;
	font-weight: bold;
	margin-bottom: 10rpx;
}

.banner-subtitle {
	font-size: 28rpx;
	color: #ffffff;
	opacity: 0.9;
}

.assessment-container {
	padding: 20rpx;
}

.tabs {
	display: flex;
	background-color: #ffffff;
	border-radius: 10rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
}

.tab-item {
	flex: 1;
	text-align: center;
	padding: 20rpx 0;
	font-size: 28rpx;
	color: #666;
	position: relative;
}

.tab-item.active {
	color: #007AFF;
	font-weight: bold;
}

.tab-item.active::after {
	content: '';
	position: absolute;
	bottom: 0;
	left: 50%;
	transform: translateX(-50%);
	width: 40rpx;
	height: 4rpx;
	background-color: #007AFF;
	border-radius: 2rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	margin: 30rpx 10rpx 20rpx;
	color: #333;
}

.assessment-cards, .report-cards, .counselor-list {
	background-color: #ffffff;
	border-radius: 10rpx;
	box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
	padding: 10rpx;
}

.assessment-card {
	display: flex;
	padding: 20rpx;
	border-bottom: 1px solid #f0f0f0;
}

.assessment-card:last-child {
	border-bottom: none;
}

.card-left {
	width: 80rpx;
	height: 80rpx;
	margin-right: 20rpx;
}

.card-icon {
	width: 80rpx;
	height: 80rpx;
}

.card-content {
	flex: 1;
}

.card-title {
	font-size: 30rpx;
	color: #333;
	font-weight: bold;
	margin-bottom: 10rpx;
}

.card-desc {
	font-size: 24rpx;
	color: #666;
	margin-bottom: 10rpx;
	line-height: 1.4;
}

.card-meta {
	display: flex;
	font-size: 22rpx;
	color: #999;
}

.meta-item {
	margin-right: 20rpx;
}

.meta-label {
	color: #666;
}

.card-right {
	display: flex;
	align-items: center;
}

.arrow-icon {
	width: 40rpx;
	height: 40rpx;
}

/* 空状态 */
.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 60rpx 0;
}

.empty-image {
	width: 200rpx;
	height: 200rpx;
	margin-bottom: 20rpx;
}

.empty-text {
	font-size: 28rpx;
	color: #999;
	margin-bottom: 30rpx;
}

.primary-btn {
	background-color: #007AFF;
	color: #fff;
	font-size: 28rpx;
	padding: 10rpx 40rpx;
	border-radius: 30rpx;
}

/* 报告卡片 */
.report-card {
	background-color: #fff;
	border-radius: 10rpx;
	padding: 20rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05);
}

.report-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 15rpx;
}

.report-title {
	font-size: 28rpx;
	color: #333;
	font-weight: bold;
}

.report-date {
	font-size: 24rpx;
	color: #999;
}

.report-summary {
	font-size: 26rpx;
	color: #666;
	margin-bottom: 20rpx;
	line-height: 1.4;
}

.report-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.score-display {
	display: flex;
	align-items: baseline;
}

.score-label {
	font-size: 24rpx;
	color: #666;
	margin-right: 10rpx;
}

.score-value {
	font-size: 40rpx;
	color: #FF9500;
	font-weight: bold;
}

.view-btn {
	background-color: #f0f0f0;
	color: #666;
	font-size: 24rpx;
	padding: 8rpx 20rpx;
	border-radius: 20rpx;
}

/* 咨询师卡片 */
.counselor-card {
	display: flex;
	padding: 20rpx;
	border-bottom: 1px solid #f0f0f0;
	align-items: center;
}

.counselor-card:last-child {
	border-bottom: none;
}

.counselor-avatar {
	width: 100rpx;
	height: 100rpx;
	border-radius: 50%;
	margin-right: 20rpx;
}

.counselor-info {
	flex: 1;
}

.counselor-header {
	display: flex;
	align-items: center;
	margin-bottom: 10rpx;
}

.counselor-name {
	font-size: 30rpx;
	font-weight: bold;
	color: #333;
	margin-right: 10rpx;
}

.counselor-title {
	font-size: 24rpx;
	color: #666;
}

.counselor-specialties {
	display: flex;
	font-size: 24rpx;
	color: #666;
	margin-bottom: 10rpx;
	flex-wrap: wrap;
}

.specialty-tags {
	display: flex;
	flex-wrap: wrap;
}

.specialty-tag {
	background-color: #f0f0f0;
	color: #666;
	padding: 4rpx 12rpx;
	border-radius: 20rpx;
	margin-right: 10rpx;
	margin-bottom: 6rpx;
	font-size: 20rpx;
}

.counselor-rating {
	display: flex;
	align-items: center;
}

.stars {
	display: flex;
	margin-right: 10rpx;
}

.star {
	color: #e0e0e0;
	font-size: 24rpx;
}

.star.active {
	color: #FFCC00;
}

.rating-value {
	font-size: 24rpx;
	color: #333;
	margin-right: 6rpx;
}

.rating-count {
	font-size: 22rpx;
	color: #999;
}

.book-btn {
	background-color: #007AFF;
	color: #fff;
	font-size: 24rpx;
	padding: 10rpx 30rpx;
	border-radius: 30rpx;
	margin-left: 20rpx;
}

/* 弹窗 */
.counselor-detail-popup {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 999;
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
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100%;
	background-color: #ffffff;
	border-top-left-radius: 20rpx;
	border-top-right-radius: 20rpx;
	padding-bottom: 40rpx;
	max-height: 80vh;
	overflow-y: auto;
}

.popup-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 30rpx;
	border-bottom: 1px solid #f0f0f0;
}

.popup-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.popup-close image {
	width: 40rpx;
	height: 40rpx;
}

.popup-body {
	padding: 30rpx;
}

.counselor-profile {
	display: flex;
	margin-bottom: 40rpx;
}

.profile-avatar {
	width: 120rpx;
	height: 120rpx;
	border-radius: 60rpx;
	margin-right: 30rpx;
}

.profile-basic {
	flex: 1;
}

.profile-name {
	font-size: 36rpx;
	color: #333;
	font-weight: bold;
	margin-bottom: 6rpx;
}

.profile-title {
	font-size: 28rpx;
	color: #666;
	margin-bottom: 10rpx;
}

.profile-detail .detail-item {
	margin-bottom: 30rpx;
}

.detail-label {
	font-size: 28rpx;
	color: #333;
	font-weight: bold;
	margin-bottom: 10rpx;
	display: block;
}

.detail-value {
	font-size: 26rpx;
	color: #666;
	line-height: 1.5;
}

.date-selector {
	display: flex;
	align-items: center;
	margin-bottom: 20rpx;
}

.date-arrow {
	width: 60rpx;
	display: flex;
	justify-content: center;
}

.date-arrow image {
	width: 40rpx;
	height: 40rpx;
}

.dates {
	flex: 1;
	display: flex;
	justify-content: space-between;
}

.date-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 10rpx 0;
	width: 80rpx;
}

.date-item.active {
	background-color: #007AFF;
	color: #fff;
	border-radius: 10rpx;
}

.date-day {
	font-size: 32rpx;
	font-weight: bold;
}

.date-weekday {
	font-size: 22rpx;
}

.time-grid {
	display: flex;
	flex-wrap: wrap;
	margin: 0 -10rpx;
}

.time-block {
	width: 25%;
	box-sizing: border-box;
	padding: 10rpx;
}

.time-block text {
	display: block;
	text-align: center;
	padding: 16rpx 0;
	background-color: #f5f5f5;
	color: #999;
	border-radius: 8rpx;
	font-size: 26rpx;
}

.time-block.available text {
	background-color: #f0f0f0;
	color: #333;
}

.time-block.selected text {
	background-color: #007AFF;
	color: #fff;
}

.book-button {
	margin-top: 40rpx;
	background-color: #007AFF;
	color: #fff;
	padding: 20rpx 0;
	text-align: center;
	border-radius: 10rpx;
	font-size: 32rpx;
}

.book-button.disabled {
	background-color: #cccccc;
}
</style> 
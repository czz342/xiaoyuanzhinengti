<template>
	<view class="home-page">
		<!-- 顶部欢迎区域 -->
		<view class="welcome-section">
			<view class="welcome-content">
				<text class="welcome-text">欢迎回来，{{ currentUser.name || '同学' }}！</text>
				<text class="welcome-subtitle">今天也要加油哦~</text>
			</view>
			<view class="weather-info">
				<image src="/static/images/weather.png" class="weather-icon"></image>
				<text class="weather-text">晴 22°C</text>
			</view>
		</view>
		
		<!-- 快捷功能区域 -->
		<view class="quick-actions">
			<view class="section-title">快捷功能</view>
			<view class="actions-grid">
				<view class="action-item" @tap="navigateTo('/pages/features/schedule')">
					<view class="action-icon academic">
						<image src="/static/images/schedule.png" mode="aspectFit"></image>
					</view>
					<text class="action-text">课表查询</text>
				</view>
				<view class="action-item" @tap="navigateTo('/pages/features/food')">
					<view class="action-icon lifestyle">
						<image src="/static/images/food.png" mode="aspectFit"></image>
					</view>
					<text class="action-text">食堂点餐</text>
				</view>
				<view class="action-item" @tap="navigateTo('/pages/features/studyroom')">
					<view class="action-icon academic">
						<image src="/static/images/study.png" mode="aspectFit"></image>
					</view>
					<text class="action-text">自习室</text>
				</view>
				<view class="action-item" @tap="navigateTo('/pages/features/express')">
					<view class="action-icon lifestyle">
						<image src="/static/images/express.png" mode="aspectFit"></image>
					</view>
					<text class="action-text">快递服务</text>
				</view>
			</view>
		</view>
		
		<!-- 今日提醒 -->
		<view class="reminders-section">
			<view class="section-title">今日提醒</view>
			<view class="reminder-list">
				<view class="reminder-item" v-for="(reminder, index) in todayReminders" :key="index">
					<view class="reminder-icon" :class="reminder.type">
						<image :src="reminder.icon" mode="aspectFit"></image>
					</view>
					<view class="reminder-content">
						<text class="reminder-title">{{ reminder.title }}</text>
						<text class="reminder-time">{{ reminder.time }}</text>
					</view>
					<view class="reminder-status" :class="reminder.status">
						<text>{{ reminder.statusText }}</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 校园动态 -->
		<view class="news-section">
			<view class="section-title">校园动态</view>
			<view class="news-list">
				<view class="news-item" v-for="(news, index) in campusNews" :key="index" @tap="viewNewsDetail(news)">
					<view class="news-content">
						<text class="news-title">{{ news.title }}</text>
						<text class="news-summary">{{ news.summary }}</text>
						<text class="news-time">{{ news.time }}</text>
					</view>
					<image :src="news.image" class="news-image" mode="aspectFill"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			currentUser: {
				name: '小明'
			},
			todayReminders: [
				{
					title: '数据结构与算法',
					time: '08:00 - 09:40',
					type: 'class',
					icon: '/static/images/schedule.png',
					status: 'upcoming',
					statusText: '即将开始'
				},
				{
					title: '图书馆借书到期',
					time: '今天',
					type: 'library',
					icon: '/static/images/library.png',
					status: 'urgent',
					statusText: '需处理'
				},
				{
					title: '心理测评预约',
					time: '14:00',
					type: 'health',
					icon: '/static/images/psychology.png',
					status: 'normal',
					statusText: '已预约'
				}
			],
			campusNews: [
				{
					title: '春季运动会报名开始',
					summary: '各项目报名火热进行中，欢迎同学们积极参与...',
					time: '2小时前',
					image: '/static/images/sports.png'
				},
				{
					title: '图书馆新书推荐',
					summary: '本月新增科技类图书500余册，涵盖人工智能、大数据等领域...',
					time: '1天前',
					image: '/static/images/library.png'
				},
				{
					title: '食堂新菜品上线',
					summary: '一食堂新增川菜窗口，二食堂推出健康轻食套餐...',
					time: '2天前',
					image: '/static/images/food.png'
				}
			]
		}
	},
	onLoad() {
		this.loadUserInfo();
	},
	methods: {
		// 加载用户信息
		loadUserInfo() {
			// 这里可以从本地存储或API获取用户信息
			const userInfo = uni.getStorageSync('userInfo');
			if (userInfo) {
				this.currentUser = userInfo;
			}
		},
		
		// 页面跳转
		navigateTo(url) {
			uni.navigateTo({ url });
		},
		
		// 查看新闻详情
		viewNewsDetail(news) {
			uni.showToast({
				title: '新闻详情功能开发中',
				icon: 'none'
			});
		}
	}
}
</script>

<style scoped>
.home-page {
	background-color: #f5f5f5;
	min-height: 100vh;
	padding-bottom: env(safe-area-inset-bottom);
}

/* 欢迎区域 */
.welcome-section {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	padding: 40rpx 30rpx;
	color: white;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.welcome-content {
	flex: 1;
}

.welcome-text {
	font-size: 36rpx;
	font-weight: bold;
	display: block;
	margin-bottom: 10rpx;
}

.welcome-subtitle {
	font-size: 26rpx;
	opacity: 0.9;
}

.weather-info {
	display: flex;
	align-items: center;
	background-color: rgba(255, 255, 255, 0.2);
	padding: 15rpx 20rpx;
	border-radius: 30rpx;
}

.weather-icon {
	width: 40rpx;
	height: 40rpx;
	margin-right: 10rpx;
}

.weather-text {
	font-size: 24rpx;
}

/* 通用区域样式 */
.quick-actions,
.reminders-section,
.news-section {
	background-color: #fff;
	margin: 20rpx 30rpx;
	border-radius: 20rpx;
	padding: 30rpx;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 30rpx;
}

/* 快捷功能 */
.actions-grid {
	display: flex;
	justify-content: space-between;
}

.action-item {
	text-align: center;
	width: 22%;
}

.action-icon {
	width: 100rpx;
	height: 100rpx;
	margin: 0 auto 15rpx;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
}

.action-icon.academic {
	background-color: #e6f2ff;
}

.action-icon.lifestyle {
	background-color: #e6fff2;
}

.action-icon image {
	width: 60rpx;
	height: 60rpx;
}

.action-text {
	font-size: 24rpx;
	color: #333;
}

/* 提醒列表 */
.reminder-list {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.reminder-item {
	display: flex;
	align-items: center;
	padding: 20rpx;
	background-color: #f9f9f9;
	border-radius: 15rpx;
}

.reminder-icon {
	width: 60rpx;
	height: 60rpx;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-right: 20rpx;
}

.reminder-icon.class {
	background-color: #e6f2ff;
}

.reminder-icon.library {
	background-color: #fff2e6;
}

.reminder-icon.health {
	background-color: #f0e6ff;
}

.reminder-icon image {
	width: 40rpx;
	height: 40rpx;
}

.reminder-content {
	flex: 1;
}

.reminder-title {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
	display: block;
	margin-bottom: 8rpx;
}

.reminder-time {
	font-size: 24rpx;
	color: #666;
}

.reminder-status {
	padding: 8rpx 16rpx;
	border-radius: 20rpx;
	font-size: 22rpx;
}

.reminder-status.upcoming {
	background-color: #e6f2ff;
	color: #007AFF;
}

.reminder-status.urgent {
	background-color: #ffe6e6;
	color: #FF3B30;
}

.reminder-status.normal {
	background-color: #e6fff2;
	color: #00B578;
}

/* 新闻列表 */
.news-list {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.news-item {
	display: flex;
	padding: 20rpx;
	background-color: #f9f9f9;
	border-radius: 15rpx;
}

.news-content {
	flex: 1;
	margin-right: 20rpx;
}

.news-title {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
	display: block;
	margin-bottom: 10rpx;
}

.news-summary {
	font-size: 24rpx;
	color: #666;
	display: block;
	margin-bottom: 10rpx;
	line-height: 1.4;
}

.news-time {
	font-size: 22rpx;
	color: #999;
}

.news-image {
	width: 120rpx;
	height: 120rpx;
	border-radius: 10rpx;
}
</style>

<template>
	<view class="activity-detail">
		<!-- 导航栏 -->
		<view class="navbar">
			<view class="nav-left" @tap="goBack">
				<text class="nav-icon">←</text>
			</view>
			<text class="nav-title">活动详情</text>
			<view class="nav-right"></view>
		</view>

		<!-- 加载状态 -->
		<view v-if="loading" class="loading-container">
			<text class="loading-text">加载中...</text>
		</view>

		<!-- 活动详情内容 -->
		<view v-else-if="activity" class="detail-content">
			<!-- 活动图片 -->
			<view class="activity-image">
				<image :src="activity.image_url || '/static/images/activity/校园摄影大赛.png'" mode="aspectFill"></image>
				<view class="image-overlay">
					<view class="status-badge" :class="activity.status_class">
						{{getActivityStatusText(activity)}}
					</view>
					<view class="featured-badge" v-if="activity.is_featured">推荐</view>
				</view>
			</view>

			<!-- 活动基本信息 -->
			<view class="activity-info">
				<view class="info-header">
					<text class="activity-title">{{activity.title}}</text>
					<view class="activity-meta">
						<text class="club-name">{{activity.club_name}}</text>
						<text class="activity-time">{{formatTime(activity.start_time)}}</text>
					</view>
				</view>

				<!-- 活动描述 -->
				<view class="activity-description">
					<text class="description-title">活动介绍</text>
					<text class="description-content">{{activity.description || '暂无详细描述'}}</text>
				</view>

				<!-- 活动详情 -->
				<view class="activity-details">
					<view class="detail-item">
						<text class="detail-label">活动时间</text>
						<text class="detail-value">{{formatTime(activity.start_time)}} - {{formatTime(activity.end_time)}}</text>
					</view>
					<view class="detail-item">
						<text class="detail-label">活动地点</text>
						<text class="detail-value">{{activity.location || '待定'}}</text>
					</view>
					<view class="detail-item">
						<text class="detail-label">参与人数</text>
						<text class="detail-value">{{activity.current_participants || 0}} / {{activity.max_participants || '不限'}}</text>
					</view>
					<view class="detail-item">
						<text class="detail-label">积分奖励</text>
						<text class="detail-value">{{activity.points_reward || 0}} 积分</text>
					</view>
					<view class="detail-item">
						<text class="detail-label">活动类型</text>
						<text class="detail-value">{{activity.category || '其他'}}</text>
					</view>
				</view>

				<!-- 参与按钮 -->
				<view class="action-section">
					<button 
						class="join-button" 
						:class="activity.button_class"
						:disabled="!activity.can_join"
						@tap="handleJoinActivity"
					>
						{{activity.button_text}}
					</button>
				</view>
			</view>
		</view>

		<!-- 错误状态 -->
		<view v-else class="error-container">
			<text class="error-text">活动不存在或已删除</text>
			<button class="retry-button" @tap="loadActivityDetail">重新加载</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			activity: null,
			loading: true,
			activityId: null
		}
	},
	
	onLoad(options) {
		console.log('活动详情页面加载，参数:', options);
		this.activityId = options.id;
		if (this.activityId) {
			this.loadActivityDetail();
		} else {
			this.loading = false;
			uni.showToast({
				title: '活动ID无效',
				icon: 'none'
			});
		}
	},
	
	methods: {
		// 返回上一页
		goBack() {
			uni.navigateBack();
		},
		
		// 加载活动详情
		async loadActivityDetail() {
			if (!this.activityId) return;
			
			this.loading = true;
			try {
				const response = await uni.request({
					url: 'http://localhost:3000/api/activities/' + this.activityId,
					method: 'GET',
					header: {
						'Content-Type': 'application/json'
					}
				});
				
				console.log('活动详情响应:', response);
				
				if (response.data && response.data.success) {
					this.activity = response.data.data.activity;
					// 计算活动状态
					this.calculateActivityStatus();
				} else {
					console.error('获取活动详情失败:', response.data);
					uni.showToast({
						title: '获取活动详情失败',
						icon: 'none'
					});
				}
			} catch (error) {
				console.error('请求活动详情出错:', error);
				uni.showToast({
					title: '网络错误',
					icon: 'none'
				});
			} finally {
				this.loading = false;
			}
		},
		
		// 计算活动状态
		calculateActivityStatus() {
			if (!this.activity) return;
			
			const now = new Date();
			const startTime = new Date(this.activity.start_time);
			const endTime = new Date(this.activity.end_time);
			
			if (now < startTime) {
				this.activity.status = 'upcoming';
				this.activity.status_class = 'status-upcoming';
				this.activity.can_join = true;
				this.activity.button_class = 'primary';
				this.activity.button_text = '立即参与';
			} else if (now >= startTime && now <= endTime) {
				this.activity.status = 'ongoing';
				this.activity.status_class = 'status-ongoing';
				this.activity.can_join = true;
				this.activity.button_class = 'primary';
				this.activity.button_text = '参与活动';
			} else {
				this.activity.status = 'ended';
				this.activity.status_class = 'status-ended';
				this.activity.can_join = false;
				this.activity.button_class = 'disabled';
				this.activity.button_text = '活动已结束';
			}
		},
		
		// 格式化时间
		formatTime(timeString) {
			if (!timeString) return '待定';
			const date = new Date(timeString);
			return date.toLocaleString('zh-CN', {
				year: 'numeric',
				month: '2-digit',
				day: '2-digit',
				hour: '2-digit',
				minute: '2-digit'
			});
		},
		
		// 获取活动状态文本
		getActivityStatusText(activity) {
			if (!activity) return '';
			switch (activity.status) {
				case 'upcoming': return '即将开始';
				case 'ongoing': return '进行中';
				case 'ended': return '已结束';
				default: return '未知';
			}
		},
		
		
		// 处理参与活动
		async handleJoinActivity() {
			if (!this.activity || !this.activity.can_join) {
				uni.showToast({
					title: '无法参与此活动',
					icon: 'none'
				});
				return;
			}
			
			const token = uni.getStorageSync('token');
			if (!token) {
				uni.showToast({
					title: '请先登录',
					icon: 'none'
				});
				return;
			}
			
			try {
				const response = await uni.request({
					url: 'http://localhost:3000/api/activities/' + this.activityId + '/join',
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
						'Authorization': 'Bearer ' + token
					}
				});
				
				console.log('参与活动响应:', response);
				
				if (response.data && response.data.success) {
					uni.showToast({
						title: '参与成功',
						icon: 'success'
					});
					// 重新加载活动详情
					this.loadActivityDetail();
				} else {
					uni.showToast({
						title: response.data.message || '参与失败',
						icon: 'none'
					});
				}
			} catch (error) {
				console.error('参与活动出错:', error);
				uni.showToast({
					title: '网络错误',
					icon: 'none'
				});
			}
		}
	}
}
</script>

<style scoped>
.activity-detail {
	min-height: 100vh;
	background-color: #f5f5f5;
}

/* 导航栏 */
.navbar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20rpx 30rpx;
	padding-top: calc(80rpx + env(safe-area-inset-top));
	background-color: #fff;
	border-bottom: 1rpx solid #eee;
	position: sticky;
	top: 0;
	z-index: 100;
}

.nav-left {
	width: 60rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.nav-icon {
	font-size: 36rpx;
	color: #333;
}

.nav-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #333;
}

.nav-right {
	width: 60rpx;
}

/* 加载状态 */
.loading-container {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 400rpx;
}

.loading-text {
	font-size: 28rpx;
	color: #999;
}

/* 活动详情内容 */
.detail-content {
	padding-bottom: 40rpx;
}

/* 活动图片 */
.activity-image {
	position: relative;
	width: 100%;
	height: 400rpx;
}

.activity-image image {
	width: 100%;
	height: 100%;
}

.image-overlay {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 100%);
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	padding: 20rpx;
}

.status-badge {
	padding: 8rpx 16rpx;
	border-radius: 20rpx;
	font-size: 24rpx;
	color: #fff;
}

.status-upcoming {
	background-color: #ff9500;
}

.status-ongoing {
	background-color: #34c759;
}

.status-ended {
	background-color: #8e8e93;
}

.featured-badge {
	padding: 8rpx 16rpx;
	border-radius: 20rpx;
	background-color: #ff3b30;
	color: #fff;
	font-size: 24rpx;
}

/* 活动信息 */
.activity-info {
	background-color: #fff;
	margin: 20rpx;
	border-radius: 20rpx;
	padding: 30rpx;
}

.info-header {
	margin-bottom: 30rpx;
}

.activity-title {
	font-size: 36rpx;
	font-weight: 600;
	color: #333;
	line-height: 1.4;
	margin-bottom: 16rpx;
	display: block;
}

.activity-meta {
	display: flex;
	align-items: center;
	gap: 20rpx;
}

.club-name {
	font-size: 28rpx;
	color: #666;
	background-color: #f0f0f0;
	padding: 8rpx 16rpx;
	border-radius: 16rpx;
}

.activity-time {
	font-size: 28rpx;
	color: #999;
}

/* 活动描述 */
.activity-description {
	margin-bottom: 30rpx;
}

.description-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #333;
	margin-bottom: 16rpx;
	display: block;
}

.description-content {
	font-size: 28rpx;
	color: #666;
	line-height: 1.6;
	display: block;
}

/* 活动详情 */
.activity-details {
	margin-bottom: 40rpx;
}

.detail-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #f0f0f0;
}

.detail-item:last-child {
	border-bottom: none;
}

.detail-label {
	font-size: 28rpx;
	color: #666;
}

.detail-value {
	font-size: 28rpx;
	color: #333;
	font-weight: 500;
}

/* 操作区域 */
.action-section {
	margin-top: 40rpx;
}

.join-button {
	width: 100%;
	height: 88rpx;
	border-radius: 44rpx;
	font-size: 32rpx;
	font-weight: 600;
	border: none;
	display: flex;
	align-items: center;
	justify-content: center;
}

.join-button.primary {
	background-color: #007aff;
	color: #fff;
}

.join-button.disabled {
	background-color: #f0f0f0;
	color: #999;
}

/* 错误状态 */
.error-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 400rpx;
	padding: 40rpx;
}

.error-text {
	font-size: 28rpx;
	color: #999;
	margin-bottom: 30rpx;
}

.retry-button {
	padding: 16rpx 32rpx;
	background-color: #007aff;
	color: #fff;
	border-radius: 20rpx;
	font-size: 28rpx;
	border: none;
}
</style>

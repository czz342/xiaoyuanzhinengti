<template>
	<view class="personal-page">
		<!-- 用户信息卡片 -->
		<view class="user-card">
			<view class="user-info">
				<image :src="userInfo.avatar" mode="aspectFill" class="user-avatar"></image>
				<view class="user-details">
					<text class="user-name">{{userInfo.name}}</text>
					<text class="user-id">学号：{{userInfo.studentId}}</text>
					<text class="user-college">{{userInfo.college}}</text>
				</view>
			</view>
			<view class="user-status">
				<text class="status-text">{{userInfo.status}}</text>
				<image src="/static/images/qrcode.png" mode="aspectFit" class="qrcode-icon" @tap="showMyCode"></image>
			</view>
		</view>
		
		<!-- 账户信息面板 -->
		<view class="account-panel">
			<view class="panel-header">
				<text class="panel-title">账户信息</text>
			</view>
			<view class="account-items">
				<view class="account-item" @tap="navigateTo('wallet')">
					<view class="item-icon wallet">
						<image src="/static/images/wallet.png" mode="aspectFit"></image>
					</view>
					<view class="item-content">
						<text class="item-label">校园钱包</text>
						<text class="item-value">余额：¥ {{wallet.balance}}</text>
					</view>
					<view class="item-arrow">
						<image src="/static/images/arrow-right.png" mode="aspectFit"></image>
					</view>
				</view>
				
				<view class="account-item" @tap="navigateTo('credits')">
					<view class="item-icon credits">
						<image src="/static/images/credits.png" mode="aspectFit"></image>
					</view>
					<view class="item-content">
						<text class="item-label">学分情况</text>
						<text class="item-value">已修：{{credits.earned}} / 总学分：{{credits.total}}</text>
					</view>
					<view class="item-arrow">
						<image src="/static/images/arrow-right.png" mode="aspectFit"></image>
					</view>
				</view>
				
				<view class="account-item" @tap="navigateTo('awards')">
					<view class="item-icon awards">
						<image src="/static/images/awards.png" mode="aspectFit"></image>
					</view>
					<view class="item-content">
						<text class="item-label">奖惩记录</text>
						<text class="item-value">{{awards.count}}条记录</text>
					</view>
					<view class="item-arrow">
						<image src="/static/images/arrow-right.png" mode="aspectFit"></image>
					</view>
				</view>
				
				<view class="account-item" @tap="navigateTo('certificates')">
					<view class="item-icon certificates">
						<image src="/static/images/certificates.png" mode="aspectFit"></image>
					</view>
					<view class="item-content">
						<text class="item-label">证书成绩</text>
						<text class="item-value">{{certificates.count}}个证书</text>
					</view>
					<view class="item-arrow">
						<image src="/static/images/arrow-right.png" mode="aspectFit"></image>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 通知中心 -->
		<view class="notification-panel">
			<view class="panel-header">
				<text class="panel-title">通知中心</text>
				<view class="panel-more" @tap="viewAllNotifications">
					<text>查看全部</text>
					<image src="/static/images/arrow-right.png" mode="aspectFit"></image>
				</view>
			</view>
			
			<view class="notification-list">
				<view class="notification-card" v-for="(notification, index) in notifications" :key="index" @tap="readNotification(notification)">
					<view class="notification-icon" :class="notification.typeCls">
						<image :src="notification.icon" mode="aspectFit"></image>
					</view>
					<view class="notification-content">
						<view class="notification-header">
							<text class="notification-title">{{notification.title}}</text>
							<text class="notification-time">{{notification.time}}</text>
						</view>
						<text class="notification-desc">{{notification.content}}</text>
					</view>
					<view class="notification-status" v-if="!notification.read"></view>
				</view>
			</view>
		</view>
		
		<!-- 系统功能 -->
		<view class="system-panel">
			<view class="panel-header">
				<text class="panel-title">系统功能</text>
			</view>
			
			<view class="system-items">
				<view class="system-item" @tap="navigateTo('feedback')">
					<view class="item-icon feedback">
						<image src="/static/images/feedback.png" mode="aspectFit"></image>
					</view>
					<text class="item-label">意见反馈</text>
				</view>
				
				<view class="system-item" @tap="navigateTo('settings')">
					<view class="item-icon settings">
						<image src="/static/images/settings.png" mode="aspectFit"></image>
					</view>
					<text class="item-label">系统设置</text>
				</view>
				
				<view class="system-item" @tap="navigateTo('privacy')">
					<view class="item-icon privacy">
						<image src="/static/images/privacy.png" mode="aspectFit"></image>
					</view>
					<text class="item-label">隐私政策</text>
				</view>
				
				<view class="system-item" @tap="navigateTo('about')">
					<view class="item-icon about">
						<image src="/static/images/about.png" mode="aspectFit"></image>
					</view>
					<text class="item-label">关于我们</text>
				</view>
			</view>
		</view>
		
		<!-- 二维码弹窗 -->
		<view class="qrcode-popup" v-if="showQRCode">
			<view class="popup-mask" @tap="hideMyCode"></view>
			<view class="popup-content">
				<view class="popup-header">
					<text class="popup-title">我的校园码</text>
					<view class="popup-close" @tap="hideMyCode">
						<image src="/static/images/close.png" mode="aspectFit"></image>
					</view>
				</view>
				
				<view class="popup-body">
					<view class="qrcode-container">
						<image src="/static/images/personal-qrcode.png" mode="aspectFit" class="qrcode-image"></image>
					</view>
					<view class="qrcode-info">
						<text class="qrcode-name">{{userInfo.name}}</text>
						<text class="qrcode-id">{{userInfo.studentId}}</text>
						<text class="qrcode-tips">凭此码可在校内进行身份识别</text>
					</view>
					
					<view class="action-buttons">
						<button class="action-btn primary" @tap="refreshCode">
							<image src="/static/images/refresh.png" mode="aspectFit"></image>
							<text>刷新校园码</text>
						</button>
						<button class="action-btn secondary" @tap="saveCodeImage">
							<image src="/static/images/save.png" mode="aspectFit"></image>
							<text>保存到相册</text>
						</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			// 用户信息
			userInfo: {
				avatar: '/static/images/avatar.png',
				name: '张同学',
				studentId: '2020123456',
				college: '计算机科学与技术学院',
				status: '在校生'
			},
			
			// 钱包信息
			wallet: {
				balance: 123.45,
				cardStatus: '正常'
			},
			
			// 学分情况
			credits: {
				earned: 85,
				total: 150
			},
			
			// 奖惩记录
			awards: {
				count: 5
			},
			
			// 证书成绩
			certificates: {
				count: 3
			},
			
			// 通知数据
			notifications: [
				{
					id: 1,
					title: '系统通知',
					content: '您的校园卡余额不足，请及时充值。',
					time: '2023-05-15 14:30',
					read: false,
					typeCls: 'system',
					icon: '/static/images/notification-system.png'
				},
				{
					id: 2,
					title: '课程通知',
					content: '您的《数据结构》课程有新的作业发布，请及时查看。',
					time: '2023-05-14 10:15',
					read: true,
					typeCls: 'course',
					icon: '/static/images/notification-course.png'
				},
				{
					id: 3,
					title: '活动通知',
					content: '校园歌手大赛报名开始，点击查看详情。',
					time: '2023-05-13 16:45',
					read: false,
					typeCls: 'activity',
					icon: '/static/images/notification-activity.png'
				}
			],
			
			// 二维码弹窗控制
			showQRCode: false
		}
	},
	methods: {
		navigateTo(target) {
			// 根据目标导航到不同页面
			uni.showToast({
				title: '前往' + target + '页面',
				icon: 'none'
			});
		},
		viewAllNotifications() {
			uni.showToast({
				title: '查看全部通知',
				icon: 'none'
			});
		},
		readNotification(notification) {
			// 标记通知为已读
			notification.read = true;
			
			uni.showToast({
				title: '查看通知：' + notification.title,
				icon: 'none'
			});
		},
		showMyCode() {
			this.showQRCode = true;
		},
		hideMyCode() {
			this.showQRCode = false;
		},
		refreshCode() {
			uni.showLoading({
				title: '刷新中...'
			});
			
			setTimeout(() => {
				uni.hideLoading();
				uni.showToast({
					title: '校园码已刷新',
					icon: 'success'
				});
			}, 1000);
		},
		saveCodeImage() {
			uni.showLoading({
				title: '保存中...'
			});
			
			setTimeout(() => {
				uni.hideLoading();
				uni.showToast({
					title: '已保存到相册',
					icon: 'success'
				});
			}, 1000);
		}
	}
}
</script>

<style>
.personal-page {
	background-color: #f5f5f5;
	min-height: 100vh;
	padding-bottom: 40rpx;
}

/* 用户信息卡片样式 */
.user-card {
	background-color: #007AFF;
	padding: 40rpx 30rpx;
	color: #FFFFFF;
	box-shadow: 0 4rpx 12rpx rgba(0, 122, 255, 0.3);
}

.user-info {
	display: flex;
	align-items: center;
}

.user-avatar {
	width: 120rpx;
	height: 120rpx;
	border-radius: 60rpx;
	border: 4rpx solid rgba(255, 255, 255, 0.3);
}

.user-details {
	margin-left: 30rpx;
}

.user-name {
	font-size: 36rpx;
	font-weight: bold;
	margin-bottom: 6rpx;
	display: block;
}

.user-id {
	font-size: 26rpx;
	opacity: 0.8;
	margin-bottom: 6rpx;
	display: block;
}

.user-college {
	font-size: 24rpx;
	opacity: 0.8;
	display: block;
}

.user-status {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 30rpx;
	padding-top: 20rpx;
	border-top: 1rpx solid rgba(255, 255, 255, 0.2);
}

.status-text {
	font-size: 28rpx;
	font-weight: bold;
}

.qrcode-icon {
	width: 50rpx;
	height: 50rpx;
}

/* 通用面板样式 */
.account-panel, .notification-panel, .system-panel {
	margin: 30rpx;
	background-color: #FFFFFF;
	border-radius: 20rpx;
	overflow: hidden;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.panel-header {
	padding: 30rpx;
	border-bottom: 1rpx solid #f0f0f0;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.panel-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.panel-more {
	display: flex;
	align-items: center;
	font-size: 24rpx;
	color: #999;
}

.panel-more image {
	width: 24rpx;
	height: 24rpx;
	margin-left: 6rpx;
}

/* 账户信息样式 */
.account-items {
	padding: 0 30rpx;
}

.account-item {
	display: flex;
	align-items: center;
	padding: 30rpx 0;
	border-bottom: 1rpx solid #f0f0f0;
}

.account-item:last-child {
	border-bottom: none;
}

.item-icon {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
}

.item-icon.wallet {
	background-color: #e6f2ff;
}

.item-icon.credits {
	background-color: #e6fff2;
}

.item-icon.awards {
	background-color: #fff2e6;
}

.item-icon.certificates {
	background-color: #f0e6ff;
}

.item-icon image {
	width: 40rpx;
	height: 40rpx;
}

.item-content {
	flex: 1;
	margin-left: 20rpx;
}

.item-label {
	font-size: 28rpx;
	color: #333;
	font-weight: bold;
	display: block;
}

.item-value {
	font-size: 24rpx;
	color: #999;
	margin-top: 6rpx;
	display: block;
}

.item-arrow {
	width: 40rpx;
	height: 40rpx;
}

.item-arrow image {
	width: 24rpx;
	height: 24rpx;
}

/* 通知中心样式 */
.notification-list {
	padding: 0 30rpx;
}

.notification-card {
	display: flex;
	padding: 30rpx 0;
	border-bottom: 1rpx solid #f0f0f0;
	position: relative;
}

.notification-card:last-child {
	border-bottom: none;
}

.notification-icon {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-right: 20rpx;
}

.notification-icon.system {
	background-color: #e6f2ff;
}

.notification-icon.course {
	background-color: #e6fff2;
}

.notification-icon.activity {
	background-color: #fff2e6;
}

.notification-icon image {
	width: 40rpx;
	height: 40rpx;
}

.notification-content {
	flex: 1;
}

.notification-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 10rpx;
}

.notification-title {
	font-size: 28rpx;
	color: #333;
	font-weight: bold;
}

.notification-time {
	font-size: 24rpx;
	color: #999;
}

.notification-desc {
	font-size: 26rpx;
	color: #666;
	line-height: 1.5;
}

.notification-status {
	position: absolute;
	top: 40rpx;
	right: 10rpx;
	width: 16rpx;
	height: 16rpx;
	border-radius: 50%;
	background-color: #FF3B30;
}

/* 系统功能样式 */
.system-items {
	display: flex;
	flex-wrap: wrap;
	padding: 20rpx 0;
}

.system-item {
	width: 25%;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 20rpx 0;
}

.system-item .item-icon {
	background-color: #f5f5f5;
	margin-bottom: 16rpx;
}

.system-item .item-label {
	font-size: 26rpx;
	color: #666;
	font-weight: normal;
}

/* 二维码弹窗样式 */
.qrcode-popup {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 9999;
	display: flex;
	align-items: center;
	justify-content: center;
}

.popup-mask {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
}

.popup-content {
	width: 80%;
	background-color: #FFFFFF;
	border-radius: 20rpx;
	overflow: hidden;
	z-index: 10000;
}

.popup-header {
	padding: 30rpx;
	border-bottom: 1rpx solid #f0f0f0;
	position: relative;
}

.popup-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	text-align: center;
}

.popup-close {
	position: absolute;
	top: 30rpx;
	right: 30rpx;
	width: 40rpx;
	height: 40rpx;
}

.popup-close image {
	width: 100%;
	height: 100%;
}

.popup-body {
	padding: 30rpx;
}

.qrcode-container {
	width: 400rpx;
	height: 400rpx;
	margin: 0 auto;
	padding: 20rpx;
	border: 1rpx solid #f0f0f0;
	border-radius: 10rpx;
}

.qrcode-image {
	width: 100%;
	height: 100%;
}

.qrcode-info {
	text-align: center;
	margin: 30rpx 0;
}

.qrcode-name {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	display: block;
	margin-bottom: 10rpx;
}

.qrcode-id {
	font-size: 28rpx;
	color: #666;
	display: block;
	margin-bottom: 20rpx;
}

.qrcode-tips {
	font-size: 24rpx;
	color: #999;
	display: block;
}

.action-buttons {
	display: flex;
	justify-content: space-between;
	margin-top: 40rpx;
}

.action-btn {
	width: 48%;
	height: 90rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 45rpx;
}

.action-btn image {
	width: 36rpx;
	height: 36rpx;
	margin-right: 10rpx;
}

.action-btn text {
	font-size: 28rpx;
}

.action-btn.primary {
	background-color: #007AFF;
	color: #FFFFFF;
}

.action-btn.secondary {
	background-color: #f5f5f5;
	color: #333;
}
</style> 
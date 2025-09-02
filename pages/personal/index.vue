<template>
	<view class="personal-page">
		<!-- 未登录状态 -->
		<view v-if="!isLoggedIn" class="login-prompt">
			<view class="prompt-content">
				<image src="/static/images/login-icon.png" mode="aspectFit" class="prompt-icon"></image>
				<text class="prompt-title">您还未登录</text>
				<text class="prompt-desc">登录后可以享受更多功能</text>
				<view class="prompt-buttons">
					<button class="prompt-btn login" @tap="goToLogin">立即登录</button>
					<button class="prompt-btn register" @tap="goToRegister">注册账户</button>
				</view>
			</view>
		</view>
		
		<!-- 已登录状态 - 用户信息卡片 -->
		<view v-else class="user-card">
			<view class="user-info">
				<image :src="userInfo.picture || '/static/images/avatar.png'" mode="aspectFill" class="user-avatar" @tap="onAvatarClick"></image>
				<view class="user-details">
					<text class="user-name">{{userInfo.displayName || userInfo.userName}}</text>
					<text class="user-id">学号：{{userInfo.studentId || '未设置'}}</text>
					<text class="user-email">{{userInfo.email}}</text>
				</view>
			</view>
			<view class="user-status">
				<view class="status-info">
					<text class="credit-score">信誉评分：{{userInfo.creditScore || 5.0}}</text>
					<text class="order-count">完成订单：{{userInfo.completedOrders || 0}}</text>
				</view>
				<view class="user-actions">
					<image src="/static/images/qrcode.png" mode="aspectFit" class="qrcode-icon" @tap="showMyCode"></image>
					<button class="logout-btn" @tap="logout">退出登录</button>
				</view>
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
			// 登录状态
			isLoggedIn: false,
			// 用户信息
			userInfo: {},
			
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
	
	// 生命周期
	onShow() {
		this.checkLoginStatus();
	},
	
	methods: {
		// 检查登录状态
		checkLoginStatus() {
			const token = uni.getStorageSync('token');
			const userInfo = uni.getStorageSync('userInfo');
			
			if (token && userInfo) {
				this.isLoggedIn = true;
				this.userInfo = userInfo;
				// 获取最新的用户信息
				this.fetchUserInfo();
			} else {
				this.isLoggedIn = false;
				this.userInfo = {};
			}
		},
		
		// 获取用户信息
		async fetchUserInfo() {
			try {
				const token = uni.getStorageSync('token');
				const response = await uni.request({
					url: 'http://localhost:3000/api/auth/me',
					method: 'GET',
					header: {
						'Authorization': `Bearer ${token}`
					}
				});
				
				if (response.data.success) {
					this.userInfo = response.data.data;
					// 更新本地存储
					uni.setStorageSync('userInfo', this.userInfo);
				}
			} catch (error) {
				console.error('获取用户信息失败:', error);
				// 如果token失效，清除登录状态
				if (error.statusCode === 401) {
					this.logout();
				}
			}
		},
		
		// 跳转到登录页面
		goToLogin() {
			uni.navigateTo({
				url: '/pages/login/index'
			});
		},
		
		// 跳转到注册页面
		goToRegister() {
			uni.navigateTo({
				url: '/pages/register/index'
			});
		},
		
		// 退出登录
		logout() {
			uni.showModal({
				title: '提示',
				content: '确定要退出登录吗？',
				success: (res) => {
					if (res.confirm) {
						// 清除本地存储
						uni.removeStorageSync('token');
						uni.removeStorageSync('userInfo');
						uni.removeStorageSync('isLoggedIn');
						
						// 更新状态
						this.isLoggedIn = false;
						this.userInfo = {};
						
						uni.showToast({
							title: '已退出登录',
							icon: 'success'
						});
					}
				}
			});
		},
		
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
		},
		// 点击头像上传
		onAvatarClick() {
			if (!this.isLoggedIn) {
				this.goToLogin();
				return;
			}
			uni.showActionSheet({
				itemList: ['从相册选择', '拍照上传'],
				success: (res) => {
					const sourceType = res.tapIndex === 1 ? ['camera'] : ['album'];
					this.pickAndUpload(sourceType);
				}
			});
		},
		async pickAndUpload(sourceType) {
			try {
				const chooseRes = await uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType
				});
				if (!chooseRes.tempFilePaths || !chooseRes.tempFilePaths.length) return;
				const filePath = chooseRes.tempFilePaths[0];

				uni.showLoading({ title: '上传中...' });
				const token = uni.getStorageSync('token');
				const uploadRes = await uni.uploadFile({
					url: 'http://localhost:3000/api/user/avatar',
					filePath,
					name: 'file',
					header: { 'Authorization': `Bearer ${token}` }
				});

				uni.hideLoading();
				let data;
				try { data = JSON.parse(uploadRes.data); } catch (e) { data = uploadRes.data; }
				if (data && data.success && data.data && data.data.pictureUrl) {
					this.userInfo.picture = data.data.pictureUrl;
					uni.setStorageSync('userInfo', this.userInfo);
					uni.showToast({ title: '头像已更新', icon: 'success' });
				} else {
					uni.showToast({ title: (data && data.message) || '上传失败', icon: 'none' });
				}
			} catch (err) {
				uni.hideLoading();
				uni.showToast({ title: '上传失败，请重试', icon: 'none' });
			}
		}
	}
}
</script>

<style>
.personal-page {
	background: linear-gradient(180deg, #f8f9ff 0%, #f0f2ff 50%, #e8ecff 100%);
	min-height: 100vh;
	padding-bottom: 40rpx;
}

/* 未登录提示样式 */
.login-prompt {
	background: rgba(255, 255, 255, 0.95);
	border-radius: 24rpx;
	margin: 30rpx;
	padding: 60rpx 40rpx;
	box-shadow: 0 15rpx 40rpx rgba(102, 126, 234, 0.15);
	text-align: center;
	backdrop-filter: blur(20rpx);
	border: 1rpx solid rgba(102, 126, 234, 0.08);
}

.prompt-content {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.prompt-icon {
	width: 120rpx;
	height: 120rpx;
	margin-bottom: 30rpx;
}

.prompt-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 20rpx;
}

.prompt-desc {
	font-size: 28rpx;
	color: #666;
	margin-bottom: 40rpx;
}

.prompt-buttons {
	display: flex;
	gap: 20rpx;
}

.prompt-btn {
	width: 200rpx;
	height: 80rpx;
	border-radius: 40rpx;
	border: none;
	font-size: 28rpx;
	font-weight: bold;
}

.prompt-btn.login {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: #FFFFFF;
	box-shadow: 0 8rpx 25rpx rgba(102, 126, 234, 0.3);
}

.prompt-btn.register {
	background: rgba(255, 255, 255, 0.9);
	color: #667eea;
	border: 2rpx solid #667eea;
	backdrop-filter: blur(10rpx);
}

/* 用户信息卡片样式 */
.user-card {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
	padding: 40rpx 30rpx;
	color: #FFFFFF;
	box-shadow: 0 20rpx 40rpx rgba(102, 126, 234, 0.25);
	border-radius: 24rpx;
	margin: 30rpx;
	position: relative;
	overflow: hidden;
}

.user-card::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: linear-gradient(45deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%, rgba(255, 255, 255, 0.05) 100%);
	pointer-events: none;
}

.user-info {
	display: flex;
	align-items: center;
}

.user-avatar {
	width: 120rpx;
	height: 120rpx;
	border-radius: 60rpx;
	border: 4rpx solid rgba(255, 255, 255, 0.4);
	box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.15);
	position: relative;
	z-index: 1;
}

.user-details {
	margin-left: 30rpx;
	position: relative;
	z-index: 1;
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
	border-top: 1rpx solid rgba(255, 255, 255, 0.25);
	position: relative;
	z-index: 1;
}

.status-info {
	display: flex;
	flex-direction: column;
	gap: 10rpx;
}

.credit-score, .order-count {
	font-size: 24rpx;
	opacity: 0.9;
}

.user-actions {
	display: flex;
	align-items: center;
	gap: 20rpx;
}

.qrcode-icon {
	width: 50rpx;
	height: 50rpx;
}

.logout-btn {
	background: rgba(255, 255, 255, 0.15);
	color: #FFFFFF;
	border: 1rpx solid rgba(255, 255, 255, 0.3);
	border-radius: 20rpx;
	padding: 12rpx 24rpx;
	font-size: 24rpx;
	backdrop-filter: blur(10rpx);
	transition: all 0.3s ease;
}

.logout-btn:active {
	background: rgba(255, 255, 255, 0.25);
	transform: scale(0.95);
}

/* 通用面板样式 */
.account-panel, .notification-panel, .system-panel {
	margin: 30rpx;
	background: rgba(255, 255, 255, 0.95);
	border-radius: 24rpx;
	overflow: hidden;
	box-shadow: 0 8rpx 32rpx rgba(102, 126, 234, 0.12);
	border: 1rpx solid rgba(102, 126, 234, 0.08);
	backdrop-filter: blur(20rpx);
}

.panel-header {
	padding: 30rpx;
	border-bottom: 1rpx solid rgba(102, 126, 234, 0.1);
	display: flex;
	justify-content: space-between;
	align-items: center;
	background: linear-gradient(90deg, rgba(102, 126, 234, 0.03) 0%, rgba(118, 75, 162, 0.06) 100%);
}

.panel-title {
	font-size: 32rpx;
	font-weight: bold;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
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
	background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.1) 100%);
}

.item-icon.credits {
	background: linear-gradient(135deg, rgba(118, 75, 162, 0.12) 0%, rgba(240, 147, 251, 0.08) 100%);
}

.item-icon.awards {
	background: linear-gradient(135deg, rgba(240, 147, 251, 0.1) 0%, rgba(102, 126, 234, 0.06) 100%);
}

.item-icon.certificates {
	background: linear-gradient(135deg, rgba(102, 126, 234, 0.18) 0%, rgba(118, 75, 162, 0.12) 100%);
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
	background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.1) 100%);
}

.notification-icon.course {
	background: linear-gradient(135deg, rgba(118, 75, 162, 0.12) 0%, rgba(240, 147, 251, 0.08) 100%);
}

.notification-icon.activity {
	background: linear-gradient(135deg, rgba(240, 147, 251, 0.1) 0%, rgba(102, 126, 234, 0.06) 100%);
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
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	box-shadow: 0 2rpx 8rpx rgba(102, 126, 234, 0.4);
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
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: #FFFFFF;
	box-shadow: 0 8rpx 25rpx rgba(102, 126, 234, 0.3);
}

.action-btn.secondary {
	background-color: #f5f5f5;
	color: #333;
}
</style> 
<template>
	<view class="shared-devices">
		<!-- 顶部状态栏 -->
		<view class="status-bar">
			<view class="status-item">
				<text class="status-number">12</text>
				<text class="status-label">空闲洗衣机</text>
			</view>
			<view class="status-item">
				<text class="status-number">8</text>
				<text class="status-label">空闲打印机</text>
			</view>
			<view class="status-item">
				<text class="status-number">95%</text>
				<text class="status-label">设备完好率</text>
			</view>
		</view>

		<!-- 服务卡片区域 -->
		<view class="service-cards">
			<!-- 智能洗衣服务 -->
			<view class="service-card laundry" @tap="navigateToLaundry">
				<view class="card-header">
					<view class="header-left">
						<image src="/static/images/laundry-icon.png" mode="aspectFit" class="service-icon"></image>
						<text class="service-title">智能洗衣</text>
					</view>
					<view class="header-right">
						<text class="status-tag available">12台可用</text>
					</view>
				</view>
				<view class="card-content">
					<view class="feature-list">
						<view class="feature-item">
							<uni-icons type="checkmarkempty" size="14" color="#00B578"></uni-icons>
							<text>智能推荐空闲机器</text>
						</view>
						<view class="feature-item">
							<uni-icons type="checkmarkempty" size="14" color="#00B578"></uni-icons>
							<text>在线预约与支付</text>
						</view>
						<view class="feature-item">
							<uni-icons type="checkmarkempty" size="14" color="#00B578"></uni-icons>
							<text>洗涤完成短信提醒</text>
						</view>
					</view>
					<view class="quick-actions">
						<button class="action-btn">立即预约</button>
						<button class="action-btn outline">查看订单</button>
					</view>
				</view>
			</view>

			<!-- 自助打印服务 -->
			<view class="service-card printing" @tap="navigateToPrinting">
				<view class="card-header">
					<view class="header-left">
						<image src="/static/images/printer-icon.png" mode="aspectFit" class="service-icon"></image>
						<text class="service-title">自助打印</text>
					</view>
					<view class="header-right">
						<text class="status-tag available">8台可用</text>
					</view>
				</view>
				<view class="card-content">
					<view class="feature-list">
						<view class="feature-item">
							<uni-icons type="checkmarkempty" size="14" color="#00B578"></uni-icons>
							<text>远程文件上传</text>
						</view>
						<view class="feature-item">
							<uni-icons type="checkmarkempty" size="14" color="#00B578"></uni-icons>
							<text>智能设备匹配</text>
						</view>
						<view class="feature-item">
							<uni-icons type="checkmarkempty" size="14" color="#00B578"></uni-icons>
							<text>取件路径规划</text>
						</view>
					</view>
					<view class="quick-actions">
						<button class="action-btn">开始打印</button>
						<button class="action-btn outline">打印记录</button>
					</view>
				</view>
			</view>
		</view>

		<!-- 附近设备 -->
		<view class="nearby-devices">
			<view class="section-header">
				<text class="section-title">附近设备</text>
				<view class="location-info">
					<uni-icons type="location" size="16" color="#666"></uni-icons>
					<text>图书馆一楼</text>
				</view>
			</view>

			<scroll-view scroll-x class="device-scroll" show-scrollbar="false">
				<view class="device-list">
					<view class="device-item" v-for="(device, index) in nearbyDevices" :key="index">
						<image :src="device.icon" mode="aspectFit" class="device-icon"></image>
						<text class="device-name">{{device.name}}</text>
						<text class="device-location">{{device.location}}</text>
						<text class="device-distance">{{device.distance}}</text>
						<text class="device-status" :class="device.statusClass">{{device.status}}</text>
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- 使用教程 -->
		<view class="usage-guide">
			<view class="section-header">
				<text class="section-title">使用教程</text>
				<view class="more-link">
					<text>查看全部</text>
					<uni-icons type="right" size="14" color="#666"></uni-icons>
				</view>
			</view>

			<scroll-view scroll-x class="guide-scroll" show-scrollbar="false">
				<view class="guide-list">
					<view class="guide-item" v-for="(guide, index) in usageGuides" :key="index">
						<image :src="guide.cover" mode="aspectFill" class="guide-cover"></image>
						<text class="guide-title">{{guide.title}}</text>
						<text class="guide-desc">{{guide.description}}</text>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			nearbyDevices: [
				{
					icon: '/static/images/washer-icon.png',
					name: '洗衣机 W001',
					location: '图书馆一楼',
					distance: '50m',
					status: '空闲中',
					statusClass: 'status-available'
				},
				{
					icon: '/static/images/washer-icon.png',
					name: '洗衣机 W002',
					location: '图书馆一楼',
					distance: '50m',
					status: '使用中',
					statusClass: 'status-busy'
				},
				{
					icon: '/static/images/printer-icon.png',
					name: '打印机 P001',
					location: '图书馆一楼',
					distance: '30m',
					status: '空闲中',
					statusClass: 'status-available'
				},
				{
					icon: '/static/images/printer-icon.png',
					name: '打印机 P002',
					location: '图书馆一楼',
					distance: '30m',
					status: '空闲中',
					statusClass: 'status-available'
				}
			],
			usageGuides: [
				{
					cover: '/static/images/guide-laundry.png',
					title: '如何使用智能洗衣服务',
					description: '3分钟快速了解智能洗衣全流程'
				},
				{
					cover: '/static/images/guide-printing.png',
					title: '自助打印使用指南',
					description: '远程打印全攻略'
				},
				{
					cover: '/static/images/guide-payment.png',
					title: '支付方式说明',
					description: '支持微信、支付宝、校园卡等多种支付方式'
				}
			]
		}
	},
	methods: {
		navigateToLaundry() {
			uni.navigateTo({
				url: '/pages/features/laundry'
			});
		},
		navigateToPrinting() {
			uni.navigateTo({
				url: '/pages/features/printing'
			});
		}
	}
}
</script>

<style>
.shared-devices {
	min-height: 100vh;
	background-color: #f5f5f5;
	padding: 30rpx;
}

/* 顶部状态栏样式 */
.status-bar {
	display: flex;
	justify-content: space-between;
	padding: 30rpx;
	background: linear-gradient(135deg, #007AFF, #00B578);
	border-radius: 20rpx;
	margin-bottom: 30rpx;
}

.status-item {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.status-number {
	font-size: 36rpx;
	color: #FFFFFF;
	font-weight: bold;
	margin-bottom: 8rpx;
}

.status-label {
	font-size: 24rpx;
	color: rgba(255, 255, 255, 0.8);
}

/* 服务卡片样式 */
.service-cards {
	margin-bottom: 30rpx;
}

.service-card {
	background-color: #FFFFFF;
	border-radius: 20rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.header-left {
	display: flex;
	align-items: center;
}

.service-icon {
	width: 48rpx;
	height: 48rpx;
	margin-right: 16rpx;
}

.service-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.status-tag {
	font-size: 24rpx;
	padding: 4rpx 16rpx;
	border-radius: 20rpx;
}

.status-tag.available {
	background-color: #e6fff2;
	color: #00B578;
}

.feature-list {
	margin-bottom: 20rpx;
}

.feature-item {
	display: flex;
	align-items: center;
	margin-bottom: 12rpx;
}

.feature-item text {
	font-size: 26rpx;
	color: #666;
	margin-left: 8rpx;
}

.quick-actions {
	display: flex;
	justify-content: space-between;
}

.action-btn {
	width: 48%;
	height: 80rpx;
	line-height: 80rpx;
	text-align: center;
	border-radius: 40rpx;
	font-size: 28rpx;
}

.action-btn:not(.outline) {
	background-color: #007AFF;
	color: #FFFFFF;
}

.action-btn.outline {
	background-color: #FFFFFF;
	color: #007AFF;
	border: 2rpx solid #007AFF;
}

/* 附近设备样式 */
.nearby-devices {
	background-color: #FFFFFF;
	border-radius: 20rpx;
	padding: 30rpx;
	margin-bottom: 30rpx;
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.location-info {
	display: flex;
	align-items: center;
	font-size: 26rpx;
	color: #666;
}

.location-info text {
	margin-left: 8rpx;
}

.device-scroll {
	white-space: nowrap;
}

.device-list {
	display: inline-flex;
	padding: 10rpx 0;
}

.device-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 200rpx;
	margin-right: 20rpx;
	background-color: #f9f9f9;
	border-radius: 16rpx;
	padding: 20rpx;
}

.device-icon {
	width: 64rpx;
	height: 64rpx;
	margin-bottom: 12rpx;
}

.device-name {
	font-size: 26rpx;
	color: #333;
	font-weight: bold;
	margin-bottom: 8rpx;
}

.device-location {
	font-size: 24rpx;
	color: #666;
	margin-bottom: 8rpx;
}

.device-distance {
	font-size: 22rpx;
	color: #999;
	margin-bottom: 8rpx;
}

.device-status {
	font-size: 24rpx;
	padding: 4rpx 16rpx;
	border-radius: 20rpx;
}

.status-available {
	background-color: #e6fff2;
	color: #00B578;
}

.status-busy {
	background-color: #fff2e6;
	color: #FF9500;
}

/* 使用教程样式 */
.usage-guide {
	background-color: #FFFFFF;
	border-radius: 20rpx;
	padding: 30rpx;
}

.more-link {
	display: flex;
	align-items: center;
	font-size: 26rpx;
	color: #666;
}

.more-link text {
	margin-right: 8rpx;
}

.guide-scroll {
	white-space: nowrap;
}

.guide-list {
	display: inline-flex;
	padding: 10rpx 0;
}

.guide-item {
	width: 300rpx;
	margin-right: 20rpx;
}

.guide-cover {
	width: 100%;
	height: 160rpx;
	border-radius: 12rpx;
	margin-bottom: 12rpx;
}

.guide-title {
	font-size: 28rpx;
	color: #333;
	font-weight: bold;
	margin-bottom: 8rpx;
	white-space: normal;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

.guide-desc {
	font-size: 24rpx;
	color: #666;
	white-space: normal;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}
</style> 
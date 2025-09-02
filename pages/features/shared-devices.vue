<template>
	<view class="shared-devices">
		<!-- 顶部状态栏 -->
		<view class="status-bar">
			<view class="status-item">
				<text class="status-number">{{ stats.availableLaundry }}</text>
				<text class="status-label">空闲洗衣机</text>
			</view>
			<view class="status-item">
				<text class="status-number">{{ stats.availablePrinters }}</text>
				<text class="status-label">空闲打印机</text>
			</view>
			<view class="status-item">
				<text class="status-number">{{ stats.deviceIntegrity }}</text>
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
						<text class="status-tag available">{{ stats.availableLaundry }}台可用</text>
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
						<button class="action-btn" @tap="navigateToLaundry">立即预约</button>
						<button class="action-btn outline" @tap="navigateToLaundryHistory">查看订单</button>
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
						<text class="status-tag available">{{ stats.availablePrinters }}台可用</text>
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
						<button class="action-btn" @tap="navigateToPrinting">开始打印</button>
						<button class="action-btn outline" @tap="navigateToPrintingHistory">打印记录</button>
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
// import KingdeeAgentService from '@/services/kingdeeAgent.js';

export default {
	data() {
		return {
			stats: {
				availableLaundry: 0,
				availablePrinters: 0,
				deviceIntegrity: '0%',
			},
			nearbyDevices: [],
			usageGuides: [
				{
					cover: '/static/images/guide-laundry.jpg',
					title: '如何使用智能洗衣服务',
					description: '3分钟快速了解智能洗衣全流程'
				},
				{
					cover: '/static/images/guide-printing.jpg',
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
	onShow() {
		this.loadPageData();
	},
	methods: {
		async loadPageData() {
			uni.showLoading({ title: '加载中...' });
			try {
				// 检查登录状态
				const token = uni.getStorageSync('token');
				if (!token) {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					});
					setTimeout(() => {
						uni.navigateTo({
							url: '/pages/login/login'
						});
					}, 1500);
					return;
				}

				// 1. 获取设备统计信息
				const statsRes = await uni.request({
					url: 'http://localhost:3000/api/shared-devices/devices/stats',
					method: 'GET',
					header: {
						'Authorization': `Bearer ${token}`
					}
				});

				if (statsRes.data.success) {
					const statsData = statsRes.data.data;
					this.stats.availableLaundry = statsData.laundry.available;
					this.stats.availablePrinters = statsData.printers.available;
					this.stats.deviceIntegrity = statsData.deviceIntegrity;
				}

				// 2. 获取所有设备
				const devicesRes = await uni.request({
					url: 'http://localhost:3000/api/shared-devices/devices',
					method: 'GET',
					header: {
						'Authorization': `Bearer ${token}`
					}
				});

				if (devicesRes.data.success) {
					const allDevices = devicesRes.data.data;
					
					// 3. 获取繁忙设备ID列表
					const [busyLaundryRes, busyPrinterRes] = await Promise.all([
						uni.request({
							url: 'http://localhost:3000/api/shared-devices/devices/busy?deviceType=洗衣机',
							method: 'GET',
							header: {
								'Authorization': `Bearer ${token}`
							}
						}),
						uni.request({
							url: 'http://localhost:3000/api/shared-devices/devices/busy?deviceType=打印机',
							method: 'GET',
							header: {
								'Authorization': `Bearer ${token}`
							}
						})
					]);

					const busyLaundryIds = new Set((busyLaundryRes.data.success ? busyLaundryRes.data.data : []).map(id => Number(id)));
					const busyPrinterIds = new Set((busyPrinterRes.data.success ? busyPrinterRes.data.data : []).map(id => Number(id)));

					// 4. 处理设备数据
					const processedDevices = allDevices.map(device => {
						let status = '';
						let statusClass = '';

						const isLaundry = device.device_type === '洗衣机';
						const isPrinter = device.device_type === '打印机';

						if (device.status !== '正常') {
							status = device.status === '故障' ? '故障' : '维护中';
							statusClass = 'status-fault';
						} else {
							let isBusy = false;
							if (isLaundry) isBusy = (device.usage_status === '使用中') || busyLaundryIds.has(device.id);
							if (isPrinter) isBusy = (device.usage_status === '使用中') || busyPrinterIds.has(device.id);

							if (isBusy) {
								status = '使用中';
								statusClass = 'status-busy';
							} else {
								status = '空闲中';
								statusClass = 'status-available';
							}
						}

						return {
							id: device.id,
							icon: isLaundry ? '/static/images/washer-icon.png' : '/static/images/printer-icon.png',
							name: device.device_name,
							location: device.location,
							status: status,
							statusClass: statusClass,
						};
					});

					this.nearbyDevices = processedDevices;
				}

			} catch (error) {
				console.error("加载共享设备页面数据失败:", error);
				uni.showToast({
					title: '数据加载失败',
					icon: 'error'
				});
			} finally {
				uni.hideLoading();
			}
		},
		formatDate(date) {
			const y = date.getFullYear();
			const m = (date.getMonth() + 1).toString().padStart(2, '0');
			const d = date.getDate().toString().padStart(2, '0');
			const h = date.getHours().toString().padStart(2, '0');
			const i = date.getMinutes().toString().padStart(2, '0');
			const s = date.getSeconds().toString().padStart(2, '0');
			return `${y}-${m}-${d} ${h}:${i}:${s}`;
		},
		navigateToLaundry() {
			uni.navigateTo({
				url: '/pages/features/laundry'
			});
		},
		navigateToPrinting() {
			uni.navigateTo({
				url: '/pages/features/printing'
			});
		},
		navigateToLaundryHistory() {
			uni.navigateTo({
				url: '/pages/features/laundry-history'
			});
		},
		navigateToPrintingHistory() {
			uni.navigateTo({
				url: '/pages/features/printing-history'
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

.status-fault {
	background-color: #ffe6e6;
	color: #ff3b30;
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
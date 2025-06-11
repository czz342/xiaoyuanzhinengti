<template>
	<view class="laundry-history-page">
		<view class="header">
			<text class="title">洗衣订单</text>
		</view>

		<!-- 筛选标签 -->
		<view class="filter-tabs">
			<view class="tab-item" :class="{ 'active': filter === 'all' }" @tap="filter = 'all'">全部</view>
			<view class="tab-item" :class="{ 'active': filter === 'completed' }" @tap="filter = 'completed'">已完成</view>
			<view class="tab-item" :class="{ 'active': filter === 'processing' }" @tap="filter = 'processing'">进行中</view>
		</view>

		<!-- 订单列表 -->
		<scroll-view scroll-y class="order-list">
			<view v-for="order in filteredOrders" :key="order.id" class="order-card">
				<view class="card-header">
					<text class="location">{{ order.location }} - {{ order.machine }}</text>
					<text class="status" :class="order.status">{{ order.statusText }}</text>
				</view>
				<view class="card-body">
					<view class="order-detail">
						<text class="detail-label">模式：</text>
						<text class="detail-value">{{ order.mode }}</text>
					</view>
					<view class="order-detail">
						<text class="detail-label">时间：</text>
						<text class="detail-value">{{ order.time }}</text>
					</view>
					<view class="order-detail">
						<text class="detail-label">金额：</text>
						<text class="detail-value price">¥ {{ order.cost }}</text>
					</view>
				</view>
				<view class="card-footer">
					<button class="footer-btn outline" @tap="viewDetails(order)">查看详情</button>
					<button class="footer-btn" @tap="orderAgain(order)">再来一单</button>
				</view>
			</view>
			<view v-if="filteredOrders.length === 0" class="empty-state">
				<image src="/static/images/empty-box.png" mode="aspectFit" class="empty-icon"></image>
				<text class="empty-text">暂无相关订单</text>
			</view>
		</scroll-view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			filter: 'all',
			orders: [
				{
					id: 1,
					location: '五栋宿舍楼',
					machine: '07号机',
					status: 'completed',
					statusText: '已完成',
					mode: '标准洗',
					time: '2024-05-20 18:30',
					cost: '4.00'
				},
				{
					id: 2,
					location: '二栋宿舍楼',
					machine: '03号机',
					status: 'completed',
					statusText: '已完成',
					mode: '快速洗',
					time: '2024-05-18 12:15',
					cost: '3.00'
				},
				{
					id: 3,
					location: '五栋宿舍楼',
					machine: '02号机',
					status: 'processing',
					statusText: '进行中',
					mode: '强力洗',
					time: '2024-05-21 09:00',
					cost: '5.00'
				}
			]
		}
	},
	computed: {
		filteredOrders() {
			if (this.filter === 'all') {
				return this.orders;
			}
			return this.orders.filter(order => order.status === this.filter);
		}
	},
	methods: {
		viewDetails(order) {
			uni.showToast({
				title: `查看订单 ${order.id} 详情`,
				icon: 'none'
			});
		},
		orderAgain(order) {
			uni.navigateTo({
				url: '/pages/features/laundry'
			});
		}
	}
}
</script>

<style>
.laundry-history-page {
	display: flex;
	flex-direction: column;
	height: 100vh;
	background-color: #f5f7fa;
}

.header {
	padding: 40rpx 30rpx 20rpx;
}

.title {
	font-size: 40rpx;
	font-weight: bold;
	color: #333;
}

.filter-tabs {
	display: flex;
	padding: 0 30rpx;
	margin-bottom: 20rpx;
}

.tab-item {
	padding: 15rpx 30rpx;
	font-size: 28rpx;
	color: #666;
	border-radius: 30rpx;
	margin-right: 20rpx;
	background-color: #fff;
}

.tab-item.active {
	background-color: #007AFF;
	color: #fff;
	font-weight: 500;
}

.order-list {
	flex: 1;
	padding: 0 30rpx;
}

.order-card {
	background-color: #fff;
	border-radius: 16rpx;
	padding: 25rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-bottom: 20rpx;
	border-bottom: 1rpx solid #f0f0f0;
}

.location {
	font-size: 28rpx;
	font-weight: 500;
	color: #333;
}

.status {
	font-size: 26rpx;
}
.status.completed { color: #999; }
.status.processing { color: #007AFF; }

.card-body {
	padding: 20rpx 0;
}

.order-detail {
	display: flex;
	font-size: 26rpx;
	margin-bottom: 10rpx;
}

.detail-label {
	color: #999;
	width: 120rpx;
}

.detail-value {
	color: #333;
}

.price {
	font-weight: 500;
	color: #ff8000;
}

.card-footer {
	display: flex;
	justify-content: flex-end;
	padding-top: 15rpx;
	border-top: 1rpx solid #f0f0f0;
}

.footer-btn {
	padding: 10rpx 30rpx;
	font-size: 26rpx;
	margin-left: 20rpx;
	border-radius: 30rpx;
}

.footer-btn.outline {
	border: 1rpx solid #ccc;
	color: #333;
	background-color: #fff;
}

.footer-btn:not(.outline) {
	background-color: #007AFF;
	color: #fff;
}

.empty-state {
	text-align: center;
	padding-top: 200rpx;
}

.empty-icon {
	width: 200rpx;
	height: 200rpx;
	margin-bottom: 20rpx;
}

.empty-text {
	font-size: 28rpx;
	color: #999;
}
</style> 
<template>
	<view class="laundry-history-page">
		<view class="header">
			<text class="title">洗衣订单</text>
		</view>

		<!-- 筛选标签 -->
		<view class="filter-tabs">
			<view class="tab-item" :class="{ 'active': filter === 'all' }" @tap="setFilter('all')">全部</view>
			<view class="tab-item" :class="{ 'active': filter === 'completed' }" @tap="setFilter('completed')">已完成</view>
			<view class="tab-item" :class="{ 'active': filter === 'processing' }" @tap="setFilter('processing')">进行中</view>
		</view>

		<!-- 订单列表 -->
		<scroll-view scroll-y class="order-list" @scrolltolower="loadMore" lower-threshold="50">
			<view v-if="isLoading" class="loading-state">
				<uni-load-more status="loading"></uni-load-more>
			</view>
			<view v-for="order in filteredOrders" :key="order.id" class="order-card">
				<view class="card-header">
					<text class="location">{{ order.location }}</text>
					<text class="status" :class="order.status">{{ order.statusText }}</text>
				</view>
				<view class="card-body">
					<view class="order-detail">
						<text class="detail-label">设备：</text>
						<text class="detail-value">{{ order.machine }}</text>
					</view>
					<view class="order-detail">
						<text class="detail-label">模式：</text>
						<text class="detail-value">{{ order.mode }}</text>
					</view>
					<view class="order-detail">
						<text class="detail-label">开始：</text>
						<text class="detail-value">{{ order.startTime }}</text>
					</view>
					<view class="order-detail">
						<text class="detail-label">结束：</text>
						<text class="detail-value">{{ order.endTime }}</text>
					</view>
					<view class="order-detail">
						<text class="detail-label">金额：</text>
						<text class="detail-value price">¥ {{ order.cost }}</text>
					</view>
				</view>
				<view class="card-footer">
					<button class="footer-btn" @tap="orderAgain(order)">再来一单</button>
					<button class="footer-btn outline" @tap="mockScan(order)">扫码取件</button>
				</view>
			</view>
			<view v-if="!isLoading && orders.length === 0" class="empty-state">
				<image src="/static/images/empty-box.png" mode="aspectFit" class="empty-icon"></image>
				<text class="empty-text">暂无相关订单</text>
			</view>
			<view v-if="!isLoading && orders.length > 0">
				<uni-load-more :status="loadMoreStatus"></uni-load-more>
			</view>
		</scroll-view>
	</view>
</template>

<script>

export default {
	data() {
		return {
			filter: 'all',
			orders: [],
			isLoading: true,
			pageNo: 1,
			pageSize: 10,
			hasMore: true,
			loadMoreStatus: 'more', // more, loading, noMore
			studentId: '645730151', // 测试学号
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
	onLoad(options) {
		if (options && options.filter) {
			this.filter = options.filter;
		}
		this.loadOrders(true);
	},
	methods: {
		formatDateTime(iso) {
			if (!iso) return '';
			const d = new Date(iso);
			const y = d.getFullYear();
			const m = String(d.getMonth() + 1).padStart(2, '0');
			const day = String(d.getDate()).padStart(2, '0');
			const hh = String(d.getHours()).padStart(2, '0');
			const mm = String(d.getMinutes()).padStart(2, '0');
			const ss = String(d.getSeconds()).padStart(2, '0');
			return `${y}-${m}-${day} ${hh}:${mm}:${ss}`;
		},
		async loadOrders(isRefresh = false) {
			if (isRefresh) {
				this.pageNo = 1;
				this.orders = [];
				this.hasMore = true;
				this.loadMoreStatus = 'more';
				this.isLoading = true;
			}
			
			if (!this.hasMore) {
				this.loadMoreStatus = 'noMore';
				return;
			}

			this.loadMoreStatus = 'loading';
			
			try {
				const token = uni.getStorageSync('token');
				const res = await uni.request({
					url: 'http://localhost:3000/api/shared-devices/laundry/orders',
					method: 'GET',
					header: { 'Authorization': `Bearer ${token}` }
				});
				const fetchedOrders = res.data.success ? res.data.data : [];

				if (fetchedOrders.length < this.pageSize) {
					this.hasMore = false;
					this.loadMoreStatus = 'noMore';
				}

				const formattedOrders = fetchedOrders.map(o => {
					const now = new Date();
					const endTime = new Date(o.end_time || o.created_at);
					const isProcessing = now < endTime;

					return {
						id: o.id,
						location: o.device_location,
						machine: o.device_name,
						status: isProcessing ? 'processing' : 'completed',
						statusText: isProcessing ? '进行中' : '已完成',
						mode: o.wash_type,
						startTime: this.formatDateTime(o.start_time || o.created_at),
						endTime: this.formatDateTime(o.end_time || o.created_at),
						cost: Number(o.actual_cost ?? o.estimated_cost ?? 0).toFixed(2)
					};
				});

				this.orders = [...this.orders, ...formattedOrders];
				this.pageNo++;

			} catch (error) {
				console.error("获取洗衣订单失败:", error);
				uni.showToast({ title: '加载失败', icon: 'error' });
				this.loadMoreStatus = 'more';
			} finally {
				this.isLoading = false;
			}
		},
		loadMore() {
			this.loadOrders();
		},
		setFilter(newFilter) {
			this.filter = newFilter;
			// 本地筛选，无需重新加载
		},
		viewDetails(order) {
			uni.showToast({
				title: `功能开发中`,
				icon: 'none'
			});
		},
		orderAgain(order) {
			uni.navigateTo({
				url: '/pages/features/laundry'
			});
		},
		mockScan(order) {
			uni.navigateTo({
				url: `/pages/demo/mock-scan?id=${order.id}&type=laundry`,
				events: {
					mockScanSuccess: (payload) => {
						// 更新本地状态为已完成
						const idx = this.orders.findIndex(o => o.id === payload.id);
						if (idx !== -1) {
							this.$set(this.orders, idx, { ...this.orders[idx], status: 'completed', statusText: '已完成' });
						}
					}
				}
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
	transition: all 0.3s;
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
	flex-shrink: 0;
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

.loading-state {
	padding: 40rpx 0;
}
</style> 
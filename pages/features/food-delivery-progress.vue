<template>
	<view class="delivery-progress-page">
		<view class="header">
			<view class="header-title">
				<text class="main-title">外卖配送进度</text>
				<text class="sub-title">实时跟踪您的订单状态</text>
			</view>
		</view>

		<view class="order-info" v-if="order">
			<view class="order-header">
				<text class="order-number">订单号：{{ order.order_number }}</text>
				<text class="order-status" :class="statusClass">
					{{ statusText }}
				</text>
			</view>
			<view class="order-details">
				<view class="detail-item">
					<text class="label">食堂：</text>
					<text class="value">{{ order.canteen_name }}</text>
				</view>
				<view class="detail-item">
					<text class="label">配送地址：</text>
					<text class="value">{{ order.delivery_address }}</text>
				</view>
				<view class="detail-item">
					<text class="label">联系电话：</text>
					<text class="value">{{ order.delivery_phone }}</text>
				</view>
				<view class="detail-item">
					<text class="label">订单金额：</text>
					<text class="value price">¥{{ order.final_amount }}</text>
				</view>
			</view>
		</view>

		<view class="progress-timeline">
			<view class="timeline-title">配送进度</view>
			<view class="timeline">
				<view 
					v-for="(step, index) in deliverySteps" 
					:key="index"
					class="timeline-step"
					:class="{ 
						'completed': step.completed, 
						'current': step.current,
						'pending': !step.completed && !step.current
					}"
				>
					<view class="step-icon">
						<view v-if="step.completed" class="completed-icon">✓</view>
						<view v-else-if="step.current" class="current-icon">●</view>
						<view v-else class="pending-icon">○</view>
					</view>
					<view class="step-content">
						<text class="step-title">{{ step.title }}</text>
						<text class="step-time" v-if="step.time">{{ step.time }}</text>
						<text class="step-desc">{{ step.description }}</text>
					</view>
				</view>
			</view>
		</view>

		<view class="order-items" v-if="orderItems.length > 0">
			<view class="section-title">订单详情</view>
			<view class="items-list">
				<view 
					v-for="(item, index) in orderItems" 
					:key="index"
					class="order-item"
				>
					<image :src="item.food_image" class="item-image"></image>
					<view class="item-info">
						<text class="item-name">{{ item.food_name }}</text>
						<text class="item-price">¥{{ item.unit_price }}</text>
					</view>
					<view class="item-quantity">
						<text>x{{ item.quantity }}</text>
					</view>
				</view>
			</view>
		</view>

		<view class="action-buttons">
			<button class="action-btn secondary" @tap="goToOrders">查看所有订单</button>
			<button class="action-btn primary" @tap="refreshProgress">刷新进度</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			orderId: null,
			order: null,
			orderItems: [],
			deliverySteps: [
				{
					title: '已下单',
					description: '订单已提交，等待确认',
					completed: false,
					current: false,
					time: null
				},
				{
					title: '已确认',
					description: '订单已确认，开始制作',
					completed: false,
					current: false,
					time: null
				},
				{
					title: '制作中',
					description: '厨师正在制作您的美食',
					completed: false,
					current: false,
					time: null
				},
				{
					title: '制作完成',
					description: '美食已制作完成，准备配送',
					completed: false,
					current: false,
					time: null
				},
				{
					title: '配送中',
					description: '配送员正在路上',
					completed: false,
					current: false,
					time: null
				},
				{
					title: '已送达',
					description: '美食已送达，请及时取餐',
					completed: false,
					current: false,
					time: null
				}
			]
		}
	},
	computed: {
		statusText() {
			if (!this.order) return '';
			const statusMap = {
				'pending': '待确认',
				'confirmed': '已确认',
				'preparing': '制作中',
				'ready': '制作完成',
				'delivering': '配送中',
				'delivered': '已送达',
				'cancelled': '已取消'
			};
			return statusMap[this.order.status] || this.order.status;
		},
		statusClass() {
			if (!this.order) return '';
			const classMap = {
				'pending': 'status-pending',
				'confirmed': 'status-confirmed',
				'preparing': 'status-preparing',
				'ready': 'status-ready',
				'delivering': 'status-delivering',
				'delivered': 'status-delivered',
				'cancelled': 'status-cancelled'
			};
			return classMap[this.order.status] || 'status-pending';
		}
	},
	onLoad(options) {
		if (options.orderId) {
			this.orderId = options.orderId;
			this.fetchOrderDetails();
		}
	},
	methods: {
		async fetchOrderDetails() {
			try {
				const token = uni.getStorageSync('token');
				if (!token) {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					});
					return;
				}

				const response = await uni.request({
					url: `http://localhost:3000/api/food/orders/${this.orderId}`,
					method: 'GET',
					header: {
						'Authorization': `Bearer ${token}`
					}
				});

				if (response.statusCode === 200 && response.data.success) {
					this.order = response.data.data;
					this.orderItems = response.data.data.items || [];
					this.updateDeliverySteps();
				} else {
					throw new Error(response.data.message || '获取订单详情失败');
				}
			} catch (error) {
				console.error('获取订单详情失败:', error);
				uni.showToast({
					title: error.message || '获取订单详情失败',
					icon: 'none'
				});
			}
		},

		updateDeliverySteps() {
			if (!this.order) return;

			const statusMap = {
				'pending': 0,
				'confirmed': 1,
				'preparing': 2,
				'ready': 3,
				'delivering': 4,
				'delivered': 5
			};

			const currentStep = statusMap[this.order.status] || 0;

			this.deliverySteps.forEach((step, index) => {
				step.completed = index < currentStep;
				step.current = index === currentStep;
				
				// 设置时间
				if (index === 0) {
					step.time = this.formatTime(this.order.order_time);
				} else if (index === 1 && this.order.confirmed_time) {
					step.time = this.formatTime(this.order.confirmed_time);
				} else if (index === 2 && this.order.preparing_time) {
					step.time = this.formatTime(this.order.preparing_time);
				} else if (index === 3 && this.order.ready_time) {
					step.time = this.formatTime(this.order.ready_time);
				} else if (index === 4 && this.order.delivery_start_time) {
					step.time = this.formatTime(this.order.delivery_start_time);
				} else if (index === 5 && this.order.delivered_time) {
					step.time = this.formatTime(this.order.delivered_time);
				}
			});
		},

		formatTime(timeStr) {
			if (!timeStr) return '';
			const date = new Date(timeStr);
			return date.toLocaleString('zh-CN', {
				month: '2-digit',
				day: '2-digit',
				hour: '2-digit',
				minute: '2-digit'
			});
		},

		async refreshProgress() {
			uni.showLoading({ title: '刷新中...' });
			await this.fetchOrderDetails();
			uni.hideLoading();
			uni.showToast({
				title: '进度已更新',
				icon: 'success'
			});
		},

		goToOrders() {
			uni.navigateTo({
				url: '/pages/features/food-history'
			});
		}
	}
}
</script>

<style>
.delivery-progress-page {
	min-height: 100vh;
	background-color: #f5f5f5;
	padding-bottom: 40rpx;
}

.header {
	padding: 30rpx;
	background-color: #ffffff;
	margin-bottom: 20rpx;
}

.header-title {
	display: flex;
	flex-direction: column;
}

.main-title {
	font-size: 36rpx;
	font-weight: bold;
	margin-bottom: 10rpx;
}

.sub-title {
	font-size: 24rpx;
	color: #666666;
}

.order-info {
	background-color: #ffffff;
	margin: 0 20rpx 20rpx;
	border-radius: 15rpx;
	padding: 30rpx;
}

.order-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
	padding-bottom: 20rpx;
	border-bottom: 1rpx solid #f0f0f0;
}

.order-number {
	font-size: 28rpx;
	color: #333;
	font-weight: bold;
}

.order-status {
	font-size: 24rpx;
	padding: 8rpx 16rpx;
	border-radius: 20rpx;
}

.status-pending { background-color: #fff3cd; color: #856404; }
.status-confirmed { background-color: #d1ecf1; color: #0c5460; }
.status-preparing { background-color: #d4edda; color: #155724; }
.status-ready { background-color: #cce5ff; color: #004085; }
.status-delivering { background-color: #fff3cd; color: #856404; }
.status-delivered { background-color: #d4edda; color: #155724; }
.status-cancelled { background-color: #f8d7da; color: #721c24; }

.order-details {
	display: flex;
	flex-direction: column;
}

.detail-item {
	display: flex;
	margin-bottom: 15rpx;
}

.detail-item:last-child {
	margin-bottom: 0;
}

.label {
	font-size: 26rpx;
	color: #666;
	width: 140rpx;
	flex-shrink: 0;
}

.value {
	font-size: 26rpx;
	color: #333;
	flex-grow: 1;
}

.value.price {
	color: #ff3b30;
	font-weight: bold;
}

.progress-timeline {
	background-color: #ffffff;
	margin: 0 20rpx 20rpx;
	border-radius: 15rpx;
	padding: 30rpx;
}

.timeline-title {
	font-size: 32rpx;
	font-weight: bold;
	margin-bottom: 30rpx;
	color: #333;
}

.timeline {
	position: relative;
}

.timeline::before {
	content: '';
	position: absolute;
	left: 25rpx;
	top: 0;
	bottom: 0;
	width: 2rpx;
	background-color: #e0e0e0;
}

.timeline-step {
	display: flex;
	align-items: flex-start;
	margin-bottom: 40rpx;
	position: relative;
}

.timeline-step:last-child {
	margin-bottom: 0;
}

.step-icon {
	width: 50rpx;
	height: 50rpx;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-right: 30rpx;
	flex-shrink: 0;
	z-index: 1;
}

.completed-icon {
	background-color: #4cd964;
	color: #ffffff;
	font-size: 24rpx;
	font-weight: bold;
}

.current-icon {
	background-color: #007AFF;
	color: #ffffff;
	font-size: 24rpx;
	font-weight: bold;
}

.pending-icon {
	background-color: #f0f0f0;
	color: #999;
	font-size: 24rpx;
}

.step-content {
	flex-grow: 1;
	padding-top: 5rpx;
}

.step-title {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 8rpx;
	display: block;
}

.step-time {
	font-size: 22rpx;
	color: #007AFF;
	margin-bottom: 5rpx;
	display: block;
}

.step-desc {
	font-size: 24rpx;
	color: #666;
}

.order-items {
	background-color: #ffffff;
	margin: 0 20rpx 20rpx;
	border-radius: 15rpx;
	padding: 30rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	margin-bottom: 20rpx;
	color: #333;
}

.items-list {
	display: flex;
	flex-direction: column;
}

.order-item {
	display: flex;
	align-items: center;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #f0f0f0;
}

.order-item:last-child {
	border-bottom: none;
}

.item-image {
	width: 80rpx;
	height: 80rpx;
	border-radius: 10rpx;
	margin-right: 20rpx;
}

.item-info {
	flex-grow: 1;
}

.item-name {
	font-size: 26rpx;
	color: #333;
	margin-bottom: 5rpx;
	display: block;
}

.item-price {
	font-size: 24rpx;
	color: #ff3b30;
}

.item-quantity {
	font-size: 24rpx;
	color: #666;
}

.action-buttons {
	display: flex;
	justify-content: space-between;
	padding: 0 20rpx;
}

.action-btn {
	flex: 1;
	height: 80rpx;
	border-radius: 10rpx;
	font-size: 28rpx;
	font-weight: bold;
	border: none;
}

.action-btn.secondary {
	background-color: #f5f5f5;
	color: #666;
	margin-right: 20rpx;
}

.action-btn.primary {
	background-color: #007AFF;
	color: #ffffff;
}
</style>

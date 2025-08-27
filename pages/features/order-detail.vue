<template>
	<view class="order-detail-page">
		<!-- 订单状态卡片 -->
		<view class="status-card">
			<view class="status-icon">📦</view>
			<view class="status-info">
				<text class="status-text">{{ getStatusText(orderDetail.status) }}</text>
				<text class="status-desc">{{ getStatusDesc(orderDetail.status) }}</text>
			</view>
		</view>

		<!-- 订单信息 -->
		<view class="order-info-card">
			<view class="card-title">
				<view class="title-icon">📋</view>
				<text>订单信息</text>
			</view>
			<view class="info-item">
				<text class="info-label">订单编号</text>
				<text class="info-value">#{{ orderDetail.id }}</text>
			</view>
			<view class="info-item">
				<text class="info-label">服务类型</text>
				<view class="service-type-tag">
					<image :src="getServiceTypeIcon(orderDetail.serviceType)" mode="aspectFit" class="service-icon"></image>
					<text>{{ getServiceTypeName(orderDetail.serviceType) }}</text>
				</view>
			</view>
			<view class="info-item">
				<text class="info-label">发布时间</text>
				<text class="info-value">{{ orderDetail.createdTime || '2025-01-23 14:30' }}</text>
			</view>
			<view class="info-item">
				<text class="info-label">期望完成</text>
				<text class="info-value">{{ orderDetail.expectedTime }}</text>
			</view>
		</view>

		<!-- 需求详情 -->
		<view class="detail-card">
			<view class="card-title">
				<view class="title-icon">📝</view>
				<text>需求详情</text>
			</view>
			<view class="detail-content">
				<text class="detail-title">{{ orderDetail.title }}</text>
				<text class="detail-desc">{{ orderDetail.description }}</text>
			</view>
		</view>

		<!-- 地点信息 -->
		<view class="location-card">
			<view class="card-title">
				<view class="title-icon">📍</view>
				<text>地点信息</text>
			</view>
			<view class="location-item">
				<view class="location-icon pickup">📥</view>
				<view class="location-info">
					<text class="location-label">取件地点</text>
					<text class="location-text">{{ orderDetail.pickupLocation }}</text>
				</view>
			</view>
			<view class="location-item">
				<view class="location-icon delivery">📤</view>
				<view class="location-info">
					<text class="location-label">送达地点</text>
					<text class="location-text">{{ orderDetail.deliveryLocation }}</text>
				</view>
			</view>
		</view>

		<!-- 费用信息 -->
		<view class="price-card">
			<view class="card-title">
				<view class="title-icon">💰</view>
				<text>费用信息</text>
			</view>
			<view class="price-info">
				<text class="price-label">跑腿费用</text>
				<text class="price-value">¥{{ orderDetail.price }}</text>
			</view>
		</view>

		<!-- 操作按钮 -->
		<view class="action-buttons">
			<button class="action-btn secondary" @tap="goBack">返回</button>
			<button class="action-btn primary" v-if="orderDetail.status === 'pending'" @tap="acceptOrder">接单</button>
			<button class="action-btn primary" v-if="orderDetail.status === 'accepted'" @tap="completeOrder">完成订单</button>
			<button class="action-btn danger" v-if="orderDetail.status === 'pending'" @tap="cancelOrder">取消订单</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			orderId: null,
			orderDetail: {
				id: 1,
				title: '帮忙取快递',
				description: '快递在菜鸟驿站，帮忙取一下送到宿舍',
				serviceType: 'express',
				status: 'pending',
				pickupLocation: '菜鸟驿站',
				deliveryLocation: '6号宿舍楼',
				price: 5,
				expectedTime: '18:00'
			}
		}
	},
	onLoad(options) {
		if (options.orderId) {
			this.orderId = options.orderId;
			this.loadOrderDetail();
		}
	},
	methods: {
		goBack() {
			uni.navigateBack();
		},
		loadOrderDetail() {
			console.log('加载订单详情:', this.orderId);
		},
		getStatusText(status) {
			const statusMap = {
				'pending': '待接单',
				'accepted': '进行中',
				'completed': '已完成',
				'cancelled': '已取消'
			};
			return statusMap[status] || '待接单';
		},
		getStatusDesc(status) {
			const descMap = {
				'pending': '等待其他同学接单',
				'accepted': '订单正在进行中',
				'completed': '订单已完成',
				'cancelled': '订单已取消'
			};
			return descMap[status] || '等待其他同学接单';
		},
		getServiceTypeIcon(type) {
			const iconMap = {
				'takeout': '/static/images/food.png',
				'express': '/static/images/express.png',
				'other': '/static/images/devices.png'
			};
			return iconMap[type] || '/static/images/devices.png';
		},
		getServiceTypeName(type) {
			const nameMap = {
				'takeout': '外卖代拿',
				'express': '快递代取',
				'other': '小事代办'
			};
			return nameMap[type] || '其他';
		},
		acceptOrder() {
			uni.showModal({
				title: '确认接单',
				content: '确定要接这个订单吗？',
				success: (res) => {
					if (res.confirm) {
						uni.showToast({
							title: '接单成功',
							icon: 'success'
						});
						this.orderDetail.status = 'accepted';
					}
				}
			});
		},
		completeOrder() {
			uni.showModal({
				title: '确认完成',
				content: '确定要完成这个订单吗？',
				success: (res) => {
					if (res.confirm) {
						uni.showToast({
							title: '订单已完成',
							icon: 'success'
						});
						this.orderDetail.status = 'completed';
					}
				}
			});
		},
		cancelOrder() {
			uni.showModal({
				title: '确认取消',
				content: '确定要取消这个订单吗？',
				success: (res) => {
					if (res.confirm) {
						uni.showToast({
							title: '订单已取消',
							icon: 'success'
						});
						this.orderDetail.status = 'cancelled';
					}
				}
			});
		}
	}
}
</script>

<style scoped>
.order-detail-page {
	min-height: 100vh;
	background-color: #f5f5f5;
	padding-bottom: 120rpx;
}

/* 状态卡片 */
.status-card {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	margin: 30rpx;
	padding: 40rpx;
	border-radius: 20rpx;
	display: flex;
	align-items: center;
	box-shadow: 0 8rpx 30rpx rgba(102, 126, 234, 0.3);
}

.status-icon {
	font-size: 60rpx;
	margin-right: 30rpx;
}

.status-info {
	flex: 1;
}

.status-text {
	display: block;
	font-size: 36rpx;
	font-weight: 600;
	color: #ffffff;
	margin-bottom: 10rpx;
}

.status-desc {
	font-size: 24rpx;
	color: rgba(255, 255, 255, 0.8);
}

/* 通用卡片样式 */
.order-info-card,
.detail-card,
.location-card,
.price-card {
	background: #ffffff;
	margin: 30rpx;
	padding: 30rpx;
	border-radius: 20rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.card-title {
	display: flex;
	align-items: center;
	margin-bottom: 30rpx;
	padding-bottom: 20rpx;
	border-bottom: 1rpx solid #f0f0f0;
}

.title-icon {
	font-size: 32rpx;
	margin-right: 15rpx;
}

.card-title text {
	font-size: 32rpx;
	font-weight: 600;
	color: #333333;
}

/* 信息项 */
.info-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 25rpx;
}

.info-label {
	font-size: 28rpx;
	color: #666666;
}

.info-value {
	font-size: 28rpx;
	color: #333333;
	font-weight: 500;
}

.service-type-tag {
	display: flex;
	align-items: center;
	background: #f8f9fa;
	padding: 10rpx 20rpx;
	border-radius: 20rpx;
}

.service-type-tag .service-icon {
	width: 30rpx;
	height: 30rpx;
	margin-right: 10rpx;
}

.service-type-tag text {
	font-size: 24rpx;
	color: #666666;
}

/* 需求详情 */
.detail-content {
	display: flex;
	flex-direction: column;
}

.detail-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #333333;
	margin-bottom: 20rpx;
}

.detail-desc {
	font-size: 28rpx;
	color: #666666;
	line-height: 1.6;
}

/* 地点信息 */
.location-item {
	display: flex;
	align-items: center;
	margin-bottom: 30rpx;
}

.location-item:last-child {
	margin-bottom: 0;
}

.location-icon {
	width: 60rpx;
	height: 60rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 32rpx;
	margin-right: 20rpx;
}

.location-icon.pickup {
	background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
}

.location-icon.delivery {
	background: linear-gradient(135deg, #007bff 0%, #6610f2 100%);
}

.location-info {
	flex: 1;
}

.location-label {
	display: block;
	font-size: 24rpx;
	color: #999999;
	margin-bottom: 8rpx;
}

.location-text {
	font-size: 28rpx;
	color: #333333;
	font-weight: 500;
}

/* 费用信息 */
.price-info {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.price-label {
	font-size: 28rpx;
	color: #666666;
}

.price-value {
	font-size: 48rpx;
	font-weight: 700;
	color: #ff6b35;
}

/* 操作按钮 */
.action-buttons {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background: #ffffff;
	padding: 20rpx 30rpx;
	border-top: 1rpx solid #e5e5e5;
	display: flex;
	gap: 20rpx;
}

.action-btn {
	flex: 1;
	height: 80rpx;
	border-radius: 40rpx;
	font-size: 28rpx;
	font-weight: 600;
	border: none;
	transition: all 0.3s ease;
}

.action-btn.secondary {
	background: #f8f9fa;
	color: #666666;
	border: 2rpx solid #e5e5e5;
}

.action-btn.primary {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: #ffffff;
	box-shadow: 0 4rpx 15rpx rgba(102, 126, 234, 0.3);
}

.action-btn.danger {
	background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
	color: #ffffff;
	box-shadow: 0 4rpx 15rpx rgba(220, 53, 69, 0.3);
}

.action-btn:active {
	transform: translateY(2rpx);
}
</style>

<template>
	<view class="order-history-page">
		<view v-if="loading" class="loading-state">
			<uni-load-more status="loading"></uni-load-more>
		</view>
		<view v-else-if="orders.length === 0" class="empty-state">
			<image src="/static/images/empty-box.png" mode="aspectFit" class="empty-image"></image>
			<text class="empty-text">您还没有任何订单哦</text>
		</view>
		<view v-else class="order-list">
			<view v-for="order in orders" :key="order.billno" class="order-card" @tap="openOrderDetail(order)">
				<view class="card-header">
					<view class="canteen-info">
						<uni-icons type="shop-filled" size="20" color="#007AFF"></uni-icons>
						<text class="canteen-name">{{ order.lb77_canteen_name }}</text>
					</view>
					<text class="order-status">已完成</text>
				</view>
				<view class="card-body">
					<!-- 动态菜品预览 -->
					<view class="dishes-preview">
						<image 
							v-for="(dish, index) in order.previewDishes" 
							:key="index"
							:src="dish.image" 
							class="dish-preview-image"
						></image>
						<view v-if="order.totalItems > 3" class="more-dishes-indicator">...</view>
					</view>
					<view class="price-section">
						<text class="price-label">实付</text>
						<text class="total-price">¥{{ parseFloat(order.lb77_total_price).toFixed(2) }}</text>
					</view>
				</view>
				<view class="card-footer">
					<text class="order-time">{{ order.formattedCreateTime }}</text>
					<button class="action-btn" size="mini" @tap.stop="reorder(order)">再来一单</button>
				</view>
			</view>
		</view>

		<!-- 订单详情弹窗 -->
		<uni-popup ref="orderPopup" type="center">
			<view class="order-popup-container" v-if="selectedOrder">
				<view class="popup-header">
					<text class="popup-canteen-name">{{ selectedOrder.lb77_canteen_name }}</text>
					<text class="popup-order-status">交易成功</text>
				</view>
				<scroll-view scroll-y class="popup-body">
					<view class="dish-list">
						<view v-for="dish in selectedOrder.lb77_entryentity" :key="dish.id" class="dish-item">
							<text class="dish-name">{{ dish.lb77_food_item_id_name || '菜品名称加载中...' }}</text>
							<text class="dish-quantity">x{{ dish.lb77_quantity }}</text>
							<text class="dish-price">¥{{ parseFloat(dish.lb77_unit_price).toFixed(2) }}</text>
						</view>
					</view>
					<view class="qrcode-section">
						<image src="/static/images/qrcode.png" class="qrcode-image"></image>
						<text class="qrcode-tip">请向食堂工作人员出示此码取餐</text>
					</view>
				</scroll-view>
				<view class="popup-footer">
					<view class="detail-row">
						<text class="label">订单总价</text>
						<text class="value">¥{{ parseFloat(selectedOrder.lb77_total_price).toFixed(2) }}</text>
					</view>
					<view class="detail-row">
						<text class="label">订单编号</text>
						<text class="value">{{ selectedOrder.billno }}</text>
					</view>
					<view class="detail-row">
						<text class="label">下单时间</text>
						<text class="value">{{ selectedOrder.formattedCreateTime }}</text>
					</view>
				</view>
				<view class="close-btn" @tap="closeOrderDetail">
					<uni-icons type="close" size="24" color="#999"></uni-icons>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
import KingdeeAgentService from '@/services/kingdeeAgent.js';

export default {
	data() {
		return {
			orders: [],
			loading: true,
			selectedOrder: null // 用于弹窗显示
		};
	},
	onLoad() {
		this.fetchOrderHistory();
	},
	methods: {
		async fetchOrderHistory() {
			this.loading = true;
			try {
				const response = await KingdeeAgentService.getPersonalOrderHistory('645730151'); // TODO: 真实学号
				
				if (response && response.data && response.data.rows) {
					this.orders = response.data.rows.map(order => {
						// 直接使用API返回的createtime字段
						order.formattedCreateTime = this.formatDate(order.createtime);
						
						order.totalItems = order.lb77_entryentity 
							? order.lb77_entryentity.reduce((total, item) => total + item.lb77_quantity, 0)
							: 0;
						
						// 基于新的API响应，直接处理菜品信息
						if (order.lb77_entryentity) {
							order.lb77_entryentity.forEach(entry => {
								// entry.lb77_food_item_id_name 已经由API直接提供
								// 我们只需要处理图片路径
								let imageName = 'default.png';
								if (entry.lb77_food_item_id_lb77_description) {
									// 修正路径分割符，来正确处理Windows路径
									const parts = entry.lb77_food_item_id_lb77_description.split('\\');
									imageName = parts[parts.length - 1];
								}
								entry.image = `/static/images/FoodList/${imageName}`;
							});
							order.previewDishes = order.lb77_entryentity.slice(0, 3);
						} else {
							order.previewDishes = [];
						}
							
						return order;
					}).sort((a, b) => {
						// 按真实下单时间倒序排序
						return new Date(b.createtime).getTime() - new Date(a.createtime).getTime();
					});
				}

			} catch (error) {
				console.error('加载数据失败:', error);
				uni.showToast({ title: '加载失败，请稍后重试', icon: 'none' });
			} finally {
				this.loading = false;
			}
		},
		formatDate(dateTimeString) {
			if (!dateTimeString) return '未知时间';
			// API返回的是 'YYYY-MM-DD HH:mm:ss' 格式，可以直接使用
			// 如果需要更复杂的格式化，可以在这里处理
			return dateTimeString;
		},
		openOrderDetail(order) {
			this.selectedOrder = order;
			this.$refs.orderPopup.open();
		},
		closeOrderDetail() {
			this.$refs.orderPopup.close();
		},
		reorder(order) {
			// TODO: 实现再来一单的逻辑
			uni.showToast({ title: '再来一单功能开发中...', icon: 'none' });
		}
	}
};
</script>

<style>
.order-history-page {
	min-height: 100vh;
	background-color: #f5f5f5;
}

.loading-state, .empty-state {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 80vh;
}

.empty-image {
	width: 200rpx;
	height: 200rpx;
	margin-bottom: 30rpx;
}

.empty-text {
	color: #999;
}

.order-list {
	padding: 20rpx;
}

.order-card {
	background-color: #ffffff;
	border-radius: 20rpx;
	padding: 30rpx;
	margin-bottom: 25rpx;
	box-shadow: 0 8rpx 20rpx rgba(0,0,0,0.06);
	transition: transform 0.2s, box-shadow 0.2s;
}
.order-card:active {
	transform: scale(0.98);
	box-shadow: 0 4rpx 15rpx rgba(0,0,0,0.08);
}

.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 25rpx;
}

.canteen-info {
	display: flex;
	align-items: center;
}

.canteen-name {
	font-size: 32rpx;
	font-weight: bold;
	margin-left: 15rpx;
}

.order-status {
	font-size: 28rpx;
	color: #28a745; /* 绿色表示成功 */
	font-weight: 500;
}

.card-body {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 25rpx 0;
	border-top: 1rpx dashed #eee;
	border-bottom: 1rpx dashed #eee;
}

.dishes-preview {
	display: flex;
	align-items: center;
}

.dish-preview-image {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	margin-right: -20rpx; /* 图片重叠效果 */
	border: 2rpx solid #ffffff;
	background-color: #f0f0f0;
}

.more-dishes-indicator {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	background-color: #f0f0f0;
	color: #999;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 28rpx;
	border: 2rpx solid #ffffff;
}

.price-section {
	text-align: right;
}
.price-label {
	font-size: 24rpx;
	color: #999;
	margin-right: 10rpx;
}
.total-price {
	font-size: 34rpx;
	font-weight: bold;
	color: #333;
}

.card-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-top: 25rpx;
}

.order-time {
	font-size: 24rpx;
	color: #999;
}

.action-btn {
	background-image: linear-gradient(to right, #007AFF, #0056b3);
	color: #ffffff;
	border-radius: 50rpx;
	padding: 0 30rpx;
	font-size: 26rpx;
	border: none;
	box-shadow: 0 4rpx 10rpx rgba(0, 122, 255, 0.3);
}

/* 弹窗样式 */
.order-popup-container {
	width: 600rpx;
	background-color: #ffffff;
	border-radius: 20rpx;
	padding: 30rpx;
	position: relative;
}
.popup-header {
	text-align: center;
	margin-bottom: 20rpx;
}
.popup-canteen-name {
	font-size: 28rpx;
	color: #666;
}
.popup-order-status {
	font-size: 36rpx;
	font-weight: bold;
	color: #28a745;
	margin-top: 10rpx;
	display: block;
}

.popup-body {
	max-height: 500rpx;
}

.dish-list {
	margin-bottom: 30rpx;
}

.dish-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 15rpx 0;
	font-size: 28rpx;
}
.dish-name { color: #333; }
.dish-quantity { color: #999; }
.dish-price { color: #666; }

.qrcode-section {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 30rpx 0;
	border-top: 1rpx dashed #eee;
	border-bottom: 1rpx dashed #eee;
	margin-bottom: 30rpx;
}
.qrcode-image {
	width: 280rpx;
	height: 280rpx;
	margin-bottom: 20rpx;
}
.qrcode-tip {
	font-size: 26rpx;
	color: #666;
}

.popup-footer .detail-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 26rpx;
	padding: 8rpx 0;
}
.detail-row .label { color: #999; }
.detail-row .value { color: #333; }

.close-btn {
	position: absolute;
	top: 15rpx;
	right: 15rpx;
	width: 50rpx;
	height: 50rpx;
	display: flex;
	justify-content: center;
	align-items: center;
}
</style> 
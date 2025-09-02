<template>
	<!-- 订单历史页面 -->
	<view class="order-history-page">
		<view v-if="loading" class="loading-state">
			<uni-load-more status="loading"></uni-load-more>
		</view>
		<view v-else-if="orders.length === 0" class="empty-state">
			<image src="/static/images/empty-box.png" mode="aspectFit" class="empty-image"></image>
			<text class="empty-text">您还没有任何订单哦</text>
		</view>
		<view v-else class="order-list">
			<view v-for="order in orders" :key="order.id" class="order-card" @tap="openOrderDetail(order)">
				<view class="card-header">
					<view class="canteen-info">
						<uni-icons type="shop-filled" size="20" color="#007AFF"></uni-icons>
						<text class="canteen-name">{{ order.canteen_name || '食堂' }}</text>
					</view>
					<text class="order-status" :class="{
						'status-pending': order.status === 'pending',
						'status-confirmed': order.status === 'confirmed',
						'status-preparing': order.status === 'preparing',
						'status-ready': order.status === 'ready',
						'status-delivering': order.status === 'delivering',
						'status-delivered': order.status === 'delivered',
						'status-cancelled': order.status === 'cancelled'
					}">
						{{ order.status === 'pending' ? '待确认' : 
						   order.status === 'confirmed' ? '已确认' : 
						   order.status === 'preparing' ? '制作中' : 
						   order.status === 'ready' ? '制作完成' : 
						   order.status === 'delivering' ? '配送中' : 
						   order.status === 'delivered' ? '已送达' : 
						   order.status === 'cancelled' ? '已取消' : order.status }}
					</text>
				</view>
				<view class="card-body">
					<!-- 动态菜品预览 -->
					<view class="dishes-preview">
						<image 
							v-for="(dish, index) in order.previewDishes" 
							:key="index"
							:src="dish.food_image || '/static/images/FoodList/default.png'" 
							class="dish-preview-image"
						></image>
						<view v-if="order.totalItems > 3" class="more-dishes-indicator">...</view>
					</view>
					<view class="price-section">
						<text class="price-label">实付</text>
						<text class="total-price">¥{{ parseFloat(order.final_amount).toFixed(2) }}</text>
					</view>
				</view>
				<view class="card-footer">
					<text class="order-time">{{ formatDate(order.order_time) }}</text>
					<view class="action-buttons">
						<button class="action-btn" size="mini" @tap.stop="viewOrderDetail(order)">查看详情</button>
						<button v-if="order.status === 'delivered'" class="action-btn reorder" size="mini" @tap.stop="reorder(order)">再来一单</button>
					</view>
				</view>
			</view>
		</view>

		<!-- 订单详情弹窗 -->
		<uni-popup ref="orderPopup" type="center">
			<view class="order-popup-container" v-if="selectedOrder">
				<view class="popup-header">
					<text class="popup-canteen-name">{{ selectedOrder.canteen_name || '食堂' }}</text>
					<text class="popup-order-status" :class="{
						'status-pending': selectedOrder.status === 'pending',
						'status-confirmed': selectedOrder.status === 'confirmed',
						'status-preparing': selectedOrder.status === 'preparing',
						'status-ready': selectedOrder.status === 'ready',
						'status-delivering': selectedOrder.status === 'delivering',
						'status-delivered': selectedOrder.status === 'delivered',
						'status-cancelled': selectedOrder.status === 'cancelled'
					}">
						{{ selectedOrder.status === 'pending' ? '待确认' : 
						   selectedOrder.status === 'confirmed' ? '已确认' : 
						   selectedOrder.status === 'preparing' ? '制作中' : 
						   selectedOrder.status === 'ready' ? '制作完成' : 
						   selectedOrder.status === 'delivering' ? '配送中' : 
						   selectedOrder.status === 'delivered' ? '已送达' : 
						   selectedOrder.status === 'cancelled' ? '已取消' : selectedOrder.status }}
					</text>
				</view>
				<scroll-view scroll-y class="popup-body">
					<view class="dish-list">
						<view v-for="dish in selectedOrder.items" :key="dish.id" class="dish-item">
							<image :src="dish.food_image || '/static/images/FoodList/default.png'" class="dish-image"></image>
							<view class="dish-info">
								<text class="dish-name">{{ dish.food_name }}</text>
								<view style="display: flex; align-items: center;">
									<text class="dish-quantity">x{{ dish.quantity }}</text>
									<text class="dish-price">¥{{ parseFloat(dish.unit_price).toFixed(2) }}</text>
								</view>
							</view>
						</view>
					</view>
					
					<!-- 订单信息 -->
					<view class="order-info">
						<view class="info-item">
							<text class="label">订单编号：</text>
							<text class="value">{{ selectedOrder.order_number }}</text>
						</view>
						<view class="info-item">
							<text class="label">用餐类型：</text>
							<text class="value">{{ selectedOrder.dining_type === 'dine_in' ? '堂食' : 
							   selectedOrder.dining_type === 'takeaway' ? '外带' : 
							   selectedOrder.dining_type === 'delivery' ? '外卖' : selectedOrder.dining_type }}</text>
						</view>
						<view v-if="selectedOrder.dining_type === 'delivery'" class="info-item">
							<text class="label">配送地址：</text>
							<text class="value">{{ selectedOrder.delivery_address }}</text>
						</view>
						<view v-if="selectedOrder.pickup_code" class="info-item">
							<text class="label">取餐码：</text>
							<text class="value pickup-code">{{ selectedOrder.pickup_code }}</text>
						</view>
					</view>
					
					<!-- 取餐二维码 -->
					<view v-if="selectedOrder.dining_type !== 'delivery' && selectedOrder.status !== 'cancelled'" class="qrcode-section">
						<image src="/static/images/qrcode.png" class="qrcode-image"></image>
						<text class="qrcode-tip">请向食堂工作人员出示此码取餐</text>
					</view>
				</scroll-view>
				<view class="popup-footer">
					<view class="detail-row">
						<text class="label">订单总价</text>
						<text class="value">¥{{ parseFloat(selectedOrder.total_amount).toFixed(2) }}</text>
					</view>
					<view v-if="selectedOrder.delivery_fee > 0" class="detail-row">
						<text class="label">配送费</text>
						<text class="value">¥{{ parseFloat(selectedOrder.delivery_fee).toFixed(2) }}</text>
					</view>
					<view class="detail-row">
						<text class="label">实付金额</text>
						<text class="value total">¥{{ parseFloat(selectedOrder.final_amount).toFixed(2) }}</text>
					</view>
					<view class="detail-row">
						<text class="label">下单时间</text>
						<text class="value">{{ formatDate(selectedOrder.order_time) }}</text>
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
export default {
	data() {
		return {
			orders: [],
			loading: true,
			selectedOrder: null // 用于弹窗显示
		};
	},
	onLoad(options) {
		this.fetchOrderHistory(options.orderId);
	},
	methods: {
		async fetchOrderHistory(targetOrderId = null) {
			this.loading = true;
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
					url: 'http://localhost:3000/api/food/orders/my',
					method: 'GET',
					header: {
						'Authorization': `Bearer ${token}`
					}
				});

				if (response.statusCode === 200 && response.data.success) {
					this.orders = response.data.data.map(order => {
						// 计算总菜品数量
						order.totalItems = order.items 
							? order.items.reduce((total, item) => total + item.quantity, 0)
							: 0;
						
						// 生成预览菜品（前3个）
						if (order.items && order.items.length > 0) {
							order.previewDishes = order.items.slice(0, 3);
						} else {
							order.previewDishes = [];
						}
						
						return order;
					}).sort((a, b) => {
						// 按下单时间倒序排序
						return new Date(b.order_time).getTime() - new Date(a.order_time).getTime();
					});

					// 如果传入了目标订单ID，自动弹出该订单的详情窗口
					if (targetOrderId) {
						const targetOrder = this.orders.find(order => order.id == targetOrderId);
						if (targetOrder) {
							// 延迟一下确保页面渲染完成
							this.$nextTick(() => {
								this.openOrderDetail(targetOrder);
							});
						}
					}
				} else {
					throw new Error(response.data.message || '获取订单失败');
				}

			} catch (error) {
				console.error('加载订单数据失败:', error);
				uni.showToast({ 
					title: error.message || '加载失败，请稍后重试', 
					icon: 'none' 
				});
			} finally {
				this.loading = false;
			}
		},
		
		formatDate(dateTimeString) {
			if (!dateTimeString) return '未知时间';
			const date = new Date(dateTimeString);
			return date.toLocaleString('zh-CN', {
				year: 'numeric',
				month: '2-digit',
				day: '2-digit',
				hour: '2-digit',
				minute: '2-digit'
			});
		},
		
		openOrderDetail(order) {
			this.selectedOrder = order;
			this.$refs.orderPopup.open();
		},
		
		viewOrderDetail(order) {
			// 如果是外卖订单，跳转到配送进度页面
			if (order.dining_type === 'delivery') {
				uni.navigateTo({
					url: `/pages/features/food-delivery-progress?orderId=${order.id}`
				});
			} else {
				// 堂食和外带订单，显示详情弹窗
				this.openOrderDetail(order);
			}
		},
		
		closeOrderDetail() {
			this.$refs.orderPopup.close();
		},
		
		reorder(order) {
			// 跳转回食堂点餐页面
			uni.navigateTo({
				url: '/pages/features/food'
			});
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
	box-shadow: 0 4rpx 10rpx rgba(0,0,0,0.1);
}

.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.canteen-info {
	display: flex;
	align-items: center;
}

.canteen-name {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
	margin-left: 10rpx;
}

.order-status {
	font-size: 24rpx;
	padding: 6rpx 12rpx;
	border-radius: 20rpx;
	font-weight: bold;
}

.status-pending { background-color: #fff3cd; color: #856404; }
.status-confirmed { background-color: #d1ecf1; color: #0c5460; }
.status-preparing { background-color: #d4edda; color: #155724; }
.status-ready { background-color: #cce5ff; color: #004085; }
.status-delivering { background-color: #fff3cd; color: #856404; }
.status-delivered { background-color: #d4edda; color: #155724; }
.status-cancelled { background-color: #f8d7da; color: #721c24; }

.card-body {
	margin-bottom: 20rpx;
}

.dishes-preview {
	display: flex;
	align-items: center;
	margin-bottom: 15rpx;
}

.dish-preview-image {
	width: 60rpx;
	height: 60rpx;
	border-radius: 10rpx;
	margin-right: 10rpx;
	border: 2rpx solid #f0f0f0;
}

.more-dishes-indicator {
	font-size: 24rpx;
	color: #999;
	margin-left: 10rpx;
}

.price-section {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.price-label {
	font-size: 26rpx;
	color: #666;
}

.total-price {
	font-size: 32rpx;
	font-weight: bold;
	color: #ff3b30;
}

.card-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-top: 20rpx;
	border-top: 1rpx solid #f0f0f0;
}

.order-time {
	font-size: 24rpx;
	color: #999;
}

.action-buttons {
	display: flex;
	gap: 10rpx;
}

.action-btn {
	background-color: #007AFF;
	color: #ffffff;
	border: none;
	border-radius: 20rpx;
	font-size: 24rpx;
	padding: 8rpx 16rpx;
}

.action-btn.reorder {
	background-color: #28a745;
}

.action-btn:active {
	transform: scale(0.95);
	box-shadow: 0 4rpx 10rpx rgba(0, 122, 255, 0.3);
}

/* 弹窗样式 */
.order-popup-container {
	background-color: #ffffff;
	border-radius: 20rpx;
	width: 600rpx;
	max-height: 80vh;
	overflow: hidden;
}

.popup-header {
	padding: 30rpx;
	text-align: center;
	border-bottom: 1rpx solid #f0f0f0;
	position: relative;
}

.popup-canteen-name {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 10rpx;
	display: block;
}

.popup-order-status {
	font-size: 26rpx;
	padding: 8rpx 16rpx;
	border-radius: 20rpx;
	font-weight: bold;
}

.popup-body {
	max-height: 50vh;
	padding: 30rpx;
}

.dish-list {
	margin-bottom: 30rpx;
}

.dish-item {
	display: flex;
	align-items: center;
	padding: 15rpx 0;
	border-bottom: 1rpx solid #f0f0f0;
}

.dish-item:last-child {
	border-bottom: none;
}

.dish-image {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	margin-right: 15rpx;
	flex-shrink: 0;
}

.dish-info {
	flex: 1;
	min-width: 0;
}

.dish-name { 
	color: #333; 
	font-size: 28rpx;
	margin-bottom: 5rpx;
	display: block;
}

.dish-quantity { 
	color: #999; 
	font-size: 24rpx;
	margin-right: 15rpx;
}

.dish-price { 
	color: #666; 
	font-size: 26rpx;
}

.order-info {
	margin-top: 30rpx;
	padding-top: 20rpx;
	border-top: 1rpx dashed #eee;
}

.info-item {
	display: flex;
	align-items: center;
	font-size: 26rpx;
	padding: 8rpx 0;
}

.info-item .label { 
	color: #999; 
	margin-right: 20rpx;
	flex-shrink: 0;
}

.info-item .value { 
	color: #333; 
	flex: 1;
}

.pickup-code {
	font-weight: bold;
	color: #007AFF;
}

.qrcode-section {
	margin-top: 30rpx;
	margin-left: -30rpx;
	padding: 20rpx 0;
	border-top: 1rpx dashed #eee;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	box-sizing: border-box;
}

.qrcode-image {
	width: 200rpx;
	height: 200rpx;
	margin-bottom: 15rpx;
	display: block;
}

.qrcode-tip {
	font-size: 24rpx;
	color: #666;
	text-align: center;
	line-height: 1.4;
	width: 100%;
}

.popup-footer {
	padding: 30rpx;
	border-top: 1rpx solid #f0f0f0;
	background-color: #f8f9fa;
}

.detail-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 15rpx;
	font-size: 28rpx;
}

.detail-row:last-child {
	margin-bottom: 0;
}

.detail-row .label { 
	color: #999; 
}

.detail-row .value { 
	color: #333; 
}

.detail-row .total {
	font-size: 34rpx;
	font-weight: bold;
	color: #333;
}

.close-btn {
	position: absolute;
	top: 20rpx;
	right: 20rpx;
	width: 60rpx;
	height: 60rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: #f0f0f0;
	border-radius: 50%;
}
</style> 
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

		<!-- 发布者信息 -->
		<view class="publisher-card" v-if="orderDetail.publisherInfo">
			<view class="card-title">
				<view class="title-icon">👤</view>
				<text>发布者信息</text>
			</view>
			<view class="publisher-info">
				<image :src="orderDetail.publisherInfo.avatar" mode="aspectFit" class="publisher-avatar"></image>
				<view class="publisher-details">
					<text class="publisher-name">{{ orderDetail.publisherInfo.name }}</text>
					<view class="publisher-stats">
						<view class="rating-info">
							<text class="rating-label">评分</text>
							<text class="rating-value">{{ (orderDetail.publisherInfo.rating || 5.0).toFixed(1) }}</text>
						</view>
						<view class="orders-info">
							<text class="rating-label">完成</text>
							<text class="orders-value">{{ orderDetail.publisherInfo.completedOrders }}单</text>
						</view>
					</view>
				</view>
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
			<view class="info-item" v-if="orderDetail.status === 'accepted' || orderDetail.status === 'completed'">
				<text class="info-label">接单时间</text>
				<text class="info-value">{{ orderDetail.acceptedTime || '2025-01-23 15:00' }}</text>
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
			<button class="action-btn rating" v-if="orderDetail.status === 'completed' && canRate" @tap="showRatingModal">评价用户</button>
		</view>

		<!-- 评分弹窗 -->
		<view class="rating-modal" v-if="showRating" @tap="hideRatingModal">
			<view class="rating-content" @tap.stop>
				<view class="rating-header">
					<text class="rating-title">评价用户</text>
					<text class="rating-subtitle">请对本次服务进行评价</text>
				</view>
				<view class="rating-form">
					<view class="rating-item">
						<text class="rating-label">评分：</text>
						<view class="rating-stars">
							<text 
								v-for="star in 5" 
								:key="star" 
								class="star" 
								:class="{ active: star <= selectedRating }"
								@tap="selectRating(star)"
							>★</text>
						</view>
					</view>
					<view class="rating-item">
						<text class="rating-label">评价：</text>
						<textarea 
							class="rating-comment" 
							v-model="ratingComment" 
							placeholder="请输入您的评价（可选）"
							maxlength="200"
						></textarea>
					</view>
				</view>
				<view class="rating-actions">
					<button class="rating-btn cancel" @tap="hideRatingModal" :disabled="isSubmitting">取消</button>
					<button class="rating-btn submit" @tap="submitRating" :disabled="isSubmitting">
						{{ isSubmitting ? '提交中...' : '提交评价' }}
					</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
			data() {
			return {
				orderId: null,
				orderDetail: {},
				showRating: false,
				selectedRating: 0,
				ratingComment: '',
				canRate: false,
				ratingTargets: [],
				isSubmitting: false
			}
		},
	onLoad(options) {
		if (options.orderId) {
			this.orderId = options.orderId;
			this.loadOrderDetail();
		}
	},
	onShow() {
		// 检查评分状态
		if (this.orderId && this.orderDetail.status === 'completed') {
			this.checkRatingStatus();
		}
	},
	methods: {
		goBack() {
			uni.navigateBack();
		},
		async loadOrderDetail() {
			try {
				const token = uni.getStorageSync('token');
				if (!token) throw new Error('请先登录');
				const res = await uni.request({
					url: `http://localhost:3000/api/errand/orders/${this.orderId}`,
					method: 'GET',
					header: { 'Authorization': `Bearer ${token}` }
				});
				if (res.statusCode === 200 && res.data.success) {
					const r = res.data.data;
					// 调试信息
					console.log('订单详情原始数据:', r);
					console.log('接单时间字段:', r.accepted_time);
					
					this.orderDetail = {
						id: r.id,
						title: r.title,
						description: r.description,
						serviceType: r.service_type,
						status: this.mapStatus(r.status),
						pickupLocation: r.pickup_location,
						deliveryLocation: r.delivery_location,
						price: r.price,
						expectedTime: this.formatDateTime(r.expected_time),
						createdTime: this.formatDateTime(r.created_time),
						acceptedTime: r.accepted_time ? this.formatDateTime(r.accepted_time) : null,
						publisherInfo: {
							name: r.publisher_name || '同学',
							avatar: this.resolveAvatar(r.publisher_avatar),
							rating: Number(r.creditScore || 5.0),
							completedOrders: Number(r.completedOrders || 0)
						}
					};
					
					console.log('处理后的订单详情:', this.orderDetail);
					
					// 如果订单已完成，检查评分状态
					if (this.orderDetail.status === 'completed') {
						this.checkRatingStatus();
					}
				} else {
					throw new Error(res.data.message || '加载失败');
				}
			} catch (e) {
				uni.showToast({ title: e.message || '加载失败', icon: 'none' });
			}
		},
		mapStatus(s) {
			switch (s) {
				case '待接单': return 'pending';
				case '已接单': return 'accepted';
				case '进行中': return 'accepted';
				case '已完成': return 'completed';
				case '已取消': return 'cancelled';
				default: return 'pending';
			}
		},
		formatDateTime(val) {
			if (!val) return '';
			const d = new Date(val);
			if (isNaN(d.getTime())) return String(val);
			const y = d.getFullYear();
			const m = String(d.getMonth()+1).padStart(2,'0');
			const day = String(d.getDate()).padStart(2,'0');
			const hh = String(d.getHours()).padStart(2,'0');
			const mm = String(d.getMinutes()).padStart(2,'0');
			return `${y}-${m}-${day} ${hh}:${mm}`;
		},
		resolveAvatar(path) {
			if (!path) return '/static/images/个人中心-active.png';
			// 已是绝对或以 http(s) 开头
			if (/^https?:\/\//.test(path)) return path;
			// 统一指向后端静态目录
			return `http://localhost:3000/${path.replace(/^\/+/, '')}`;
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
						this.acceptOrderRequest();
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
						this.completeOrderRequest();
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
						this.cancelOrderRequest();
					}
				}
			});
		},
		async acceptOrderRequest() {
			try {
				const token = uni.getStorageSync('token');
				if (!token) throw new Error('请先登录');
				const res = await uni.request({
					url: `http://localhost:3000/api/errand/orders/${this.orderId}/accept`,
					method: 'POST',
					header: { 'Authorization': `Bearer ${token}` }
				});
				if (res.statusCode === 200 && res.data.success) {
					uni.showToast({ title: '接单成功', icon: 'success' });
					this.orderDetail.status = 'accepted';
					// 接单成功后重新加载订单详情以获取接单时间
					await this.loadOrderDetail();
				} else {
					throw new Error(res.data.message || '接单失败');
				}
			} catch (e) {
				uni.showToast({ title: e.message || '接单失败', icon: 'none' });
			}
		},
		async completeOrderRequest() {
			try {
				const token = uni.getStorageSync('token');
				if (!token) throw new Error('请先登录');
				const res = await uni.request({
					url: `http://localhost:3000/api/errand/orders/${this.orderId}/complete`,
					method: 'POST',
					header: { 'Authorization': `Bearer ${token}` }
				});
				if (res.statusCode === 200 && res.data.success) {
					uni.showToast({ title: '订单已完成', icon: 'success' });
					this.orderDetail.status = 'completed';
					// 完成订单后重新加载订单详情以获取完成时间
					await this.loadOrderDetail();
				} else {
					throw new Error(res.data.message || '完成失败');
				}
			} catch (e) {
				uni.showToast({ title: e.message || '完成失败', icon: 'none' });
			}
		},
		async cancelOrderRequest() {
			try {
				const token = uni.getStorageSync('token');
				if (!token) throw new Error('请先登录');
				const res = await uni.request({
					url: `http://localhost:3000/api/errand/orders/${this.orderId}/cancel`,
					method: 'POST',
					header: { 'Authorization': `Bearer ${token}` }
				});
				if (res.statusCode === 200 && res.data.success) {
					uni.showToast({ title: '订单已取消', icon: 'success' });
					this.orderDetail.status = 'cancelled';
				} else {
					throw new Error(res.data.message || '取消失败');
				}
			} catch (e) {
				uni.showToast({ title: e.message || '取消失败', icon: 'none' });
			}
		},

		// 评分相关方法
		async checkRatingStatus() {
			try {
				const token = uni.getStorageSync('token');
				if (!token) return;
				
				const res = await uni.request({
					url: `http://localhost:3000/api/errand/orders/${this.orderId}/rating-status`,
					method: 'GET',
					header: { 'Authorization': `Bearer ${token}` }
				});
				
				if (res.statusCode === 200 && res.data.success) {
					const data = res.data.data;
					this.canRate = data.canRatePublisher || data.canRateAccepter;
					this.ratingTargets = [];
					
					if (data.canRatePublisher) {
						this.ratingTargets.push({
							id: data.publisherId,
							name: '发布者',
							type: 'publisher'
						});
					}
					if (data.canRateAccepter) {
						this.ratingTargets.push({
							id: data.accepterId,
							name: '接单者',
							type: 'accepter'
						});
					}
					
					// 如果没有可评价的用户，隐藏评价按钮
					if (!this.canRate) {
						this.canRate = false;
					}
				}
			} catch (e) {
				console.error('检查评分状态失败:', e);
				// 如果检查失败，默认隐藏评价按钮
				this.canRate = false;
			}
		},

		showRatingModal() {
			this.selectedRating = 0;
			this.ratingComment = '';
			this.showRating = true;
		},

		hideRatingModal() {
			this.showRating = false;
			this.selectedRating = 0;
			this.ratingComment = '';
		},

		selectRating(rating) {
			this.selectedRating = rating;
		},

		async submitRating() {
			if (this.isSubmitting) {
				uni.showToast({ title: '正在提交评价，请稍候...', icon: 'none' });
				return;
			}
			
			if (this.selectedRating === 0) {
				uni.showToast({ title: '请选择评分', icon: 'none' });
				return;
			}
			
			if (this.ratingTargets.length === 0) {
				uni.showToast({ title: '没有可评价的用户', icon: 'none' });
				return;
			}

			this.isSubmitting = true;

			try {
				const token = uni.getStorageSync('token');
				if (!token) throw new Error('请先登录');

				// 为每个可评价的用户提交评分
				for (const target of this.ratingTargets) {
					const res = await uni.request({
						url: `http://localhost:3000/api/errand/orders/${this.orderId}/rate`,
						method: 'POST',
						header: { 'Authorization': `Bearer ${token}` },
						data: {
							targetUserId: target.id,
							rating: this.selectedRating,
							comment: this.ratingComment
						}
					});

					if (res.statusCode !== 200 || !res.data.success) {
						// 检查是否是重复评价错误
						if (res.data.message && res.data.message.includes('Duplicate entry')) {
							throw new Error('您已经评价过此订单，不可重复评价');
						}
						throw new Error(`评价${target.name}失败: ${res.data.message}`);
					}
				}

				uni.showToast({ title: '评价提交成功', icon: 'success' });
				this.hideRatingModal();
				this.canRate = false; // 评价完成后隐藏评价按钮
				
			} catch (e) {
				// 如果是重复评价，直接关闭弹窗并提示
				if (e.message.includes('不可重复评价')) {
					uni.showToast({ title: '您已经评价过此订单', icon: 'none' });
					this.hideRatingModal();
					this.canRate = false; // 隐藏评价按钮
				} else {
					uni.showToast({ title: e.message || '评价提交失败', icon: 'none' });
				}
			} finally {
				this.isSubmitting = false;
			}
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
.price-card,
.publisher-card {
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

/* 发布者信息样式 */
.publisher-info {
	display: flex;
	align-items: center;
}

.publisher-avatar {
	width: 80rpx;
	height: 80rpx;
	border-radius: 40rpx;
	margin-right: 20rpx;
}

.publisher-details {
	flex: 1;
}

.publisher-name {
	font-size: 28rpx;
	font-weight: 600;
	color: #333333;
	margin-bottom: 15rpx;
	display: block;
}

.publisher-stats {
	display: flex;
	gap: 30rpx;
}

.rating-info, .orders-info {
	display: flex;
	align-items: baseline;
	gap: 12rpx;
}

.rating-label, .orders-label {
	font-size: 24rpx;
	color: #666666;
	font-weight: 500;
}

.rating-value, .orders-value {
	font-size: 26rpx;
	color: #333333;
	font-weight: 600;
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

.action-btn.rating {
	background: linear-gradient(135deg, #ffc107 0%, #e0a800 100%);
	color: #333333;
	box-shadow: 0 4rpx 15rpx rgba(255, 193, 7, 0.3);
}

/* 评分弹窗 */
.rating-modal {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
}

.rating-content {
	background: white;
	border-radius: 20rpx;
	width: 80%;
	max-width: 600rpx;
	padding: 40rpx;
	box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.3);
}

.rating-header {
	text-align: center;
	margin-bottom: 40rpx;
}

.rating-title {
	font-size: 36rpx;
	font-weight: 600;
	color: #333333;
	display: block;
	margin-bottom: 10rpx;
}

.rating-subtitle {
	font-size: 28rpx;
	color: #666666;
}

.rating-form {
	margin-bottom: 40rpx;
}

.rating-item {
	margin-bottom: 30rpx;
}

.rating-label {
	font-size: 28rpx;
	color: #333333;
	margin-bottom: 15rpx;
	display: block;
}

.rating-stars {
	display: flex;
	gap: 10rpx;
}

.rating-stars .star {
	font-size: 50rpx;
	color: #e0e0e0 !important;
	cursor: pointer;
	transition: all 0.3s ease;
	font-weight: bold;
}

.rating-stars .star.active {
	color: #ffd700 !important;
	text-shadow: 0 0 10rpx rgba(255, 215, 0, 0.5);
}

.rating-comment {
	width: 100%;
	height: 120rpx;
	border: 2rpx solid #e0e0e0;
	border-radius: 10rpx;
	padding: 20rpx;
	font-size: 28rpx;
	color: #333333;
	resize: none;
	box-sizing: border-box;
}

.rating-actions {
	display: flex;
	gap: 20rpx;
}

.rating-btn {
	flex: 1;
	height: 80rpx;
	border: none;
	border-radius: 10rpx;
	font-size: 28rpx;
	font-weight: 500;
	cursor: pointer;
}

.rating-btn.cancel {
	background: #f8f9fa;
	color: #666666;
}

.rating-btn.submit {
	background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
	color: white;
}

.rating-btn:disabled {
	opacity: 0.6;
	cursor: not-allowed;
}
</style>

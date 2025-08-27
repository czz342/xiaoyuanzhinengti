<template>
	<view class="errand-page">
		<!-- 顶部导航栏 -->
		<view class="nav-header">
			<view class="nav-left" @tap="goBack">
				<image src="/static/images/arrow-left.png" mode="aspectFit" class="nav-icon"></image>
			</view>
			<view class="nav-title">跑腿代办</view>
			<view class="nav-right" @tap="showMenu">
				<image src="/static/images/settings.png" mode="aspectFit" class="nav-icon"></image>
			</view>
		</view>

		<!-- 功能切换标签 -->
		<view class="tab-container">
			<view 
				class="tab-item" 
				:class="{ active: activeTab === 'publish' }"
				@tap="switchTab('publish')"
			>
				<view class="tab-icon">
					<image src="/static/images/food.png" mode="aspectFit" class="tab-icon-img"></image>
				</view>
				<text class="tab-text">发布需求</text>
			</view>
			<view 
				class="tab-item" 
				:class="{ active: activeTab === 'orders' }"
				@tap="switchTab('orders')"
			>
				<view class="tab-icon">
					<image src="/static/images/express.png" mode="aspectFit" class="tab-icon-img"></image>
				</view>
				<text class="tab-text">我的订单</text>
			</view>
			<view 
				class="tab-item" 
				:class="{ active: activeTab === 'available' }"
				@tap="switchTab('available')"
			>
				<view class="tab-icon">
					<image src="/static/images/devices.png" mode="aspectFit" class="tab-icon-img"></image>
				</view>
				<text class="tab-text">可接订单</text>
			</view>
		</view>

		<!-- 发布需求页面 -->
		<view class="tab-content" v-if="activeTab === 'publish'">
			<view class="publish-form">
				<!-- 服务类型选择 -->
				<view class="form-section">
					<view class="section-title">
						<view class="title-icon">🎯</view>
						<text>选择服务类型</text>
					</view>
					<view class="service-types">
						<view 
							class="service-type-item" 
							:class="{ selected: selectedServiceType === item.value }"
							v-for="item in serviceTypes" 
							:key="item.value"
							@tap="selectServiceType(item.value)"
						>
							<view class="service-icon-wrapper">
								<image :src="item.icon" mode="aspectFit" class="service-icon"></image>
							</view>
							<text class="service-name">{{ item.name }}</text>
						</view>
					</view>
				</view>

				<!-- 基本信息 -->
				<view class="form-section">
					<view class="section-title">
						<view class="title-icon">📝</view>
						<text>基本信息</text>
					</view>
					<view class="form-item">
						<text class="form-label">标题</text>
						<input 
							class="form-input" 
							v-model="publishForm.title" 
							placeholder="请输入需求标题"
							maxlength="50"
						/>
					</view>
					<view class="form-item">
						<text class="form-label">详细描述</text>
						<textarea 
							class="form-textarea" 
							v-model="publishForm.description" 
							placeholder="请详细描述您的需求"
							maxlength="200"
						></textarea>
					</view>
				</view>

				<!-- 地点信息 -->
				<view class="form-section">
					<view class="section-title">
						<view class="title-icon">📍</view>
						<text>地点信息</text>
					</view>
					<view class="form-item">
						<text class="form-label">取件地点</text>
						<input 
							class="form-input" 
							v-model="publishForm.pickupLocation" 
							placeholder="请输入取件地点"
						/>
					</view>
					<view class="form-item">
						<text class="form-label">送达地点</text>
						<input 
							class="form-input" 
							v-model="publishForm.deliveryLocation" 
							placeholder="请输入送达地点"
						/>
					</view>
				</view>

				<!-- 费用和时间 -->
				<view class="form-section">
					<view class="section-title">
						<view class="title-icon">💰</view>
						<text>费用和时间</text>
					</view>
					<view class="form-item">
						<text class="form-label">跑腿费用</text>
						<view class="price-input">
							<input 
								class="form-input price" 
								v-model="publishForm.price" 
								type="number"
								placeholder="0"
							/>
							<text class="price-unit">元</text>
						</view>
					</view>
					<view class="form-item">
						<text class="form-label">期望完成时间</text>
						<picker 
							mode="time" 
							:value="publishForm.expectedTime" 
							@change="onTimeChange"
						>
							<view class="time-picker">
								<text class="time-text">{{ publishForm.expectedTime || '请选择时间' }}</text>
								<image src="/static/images/arrow-right.png" mode="aspectFit" class="arrow-icon"></image>
							</view>
						</picker>
					</view>
				</view>

				<!-- 联系方式 -->
				<view class="form-section">
					<view class="section-title">
						<view class="title-icon">📞</view>
						<text>联系方式</text>
					</view>
					<view class="form-item">
						<text class="form-label">联系电话</text>
						<input 
							class="form-input" 
							v-model="publishForm.phone" 
							placeholder="请输入联系电话"
							type="number"
						/>
					</view>
				</view>

				<!-- 发布按钮 -->
				<view class="publish-actions">
					<button class="publish-btn" @tap="publishOrder">
						<image src="/static/images/food.png" mode="aspectFit" class="btn-icon"></image>
						<text>发布需求</text>
					</button>
				</view>
			</view>
		</view>

		<!-- 我的订单页面 -->
		<view class="tab-content" v-if="activeTab === 'orders'">
			<view class="page-header">
				<view class="header-icon">📋</view>
				<text class="header-title">我的订单</text>
				<text class="header-subtitle">管理您的跑腿订单</text>
			</view>
			
			<!-- 订单类型筛选器 -->
			<view class="order-filter-tabs">
				<view 
					class="filter-tab-item" 
					:class="{ active: orderFilterType === 'published' }"
					@tap="switchOrderFilter('published')"
				>
					<view class="filter-tab-icon">📤</view>
					<text class="filter-tab-text">我发布的</text>
				</view>
				<view 
					class="filter-tab-item" 
					:class="{ active: orderFilterType === 'accepted' }"
					@tap="switchOrderFilter('accepted')"
				>
					<view class="filter-tab-icon">📥</view>
					<text class="filter-tab-text">我接的</text>
				</view>
			</view>
			
			<view class="order-list">
				<view class="order-item" v-for="order in filteredOrders" :key="order.id" @tap="goToOrderDetail(order.id)">
					<view class="order-header">
						<view class="order-type">
							<image :src="getServiceTypeIcon(order.serviceType)" mode="aspectFit" class="type-icon"></image>
							<text class="type-name">{{ getServiceTypeName(order.serviceType) }}</text>
						</view>
						<view class="order-status" :class="{
							'status-pending': order.status === 'pending',
							'status-accepted': order.status === 'accepted',
							'status-completed': order.status === 'completed',
							'status-cancelled': order.status === 'cancelled'
						}">
							{{ order.status === 'pending' ? '待接单' : 
							   order.status === 'accepted' ? '进行中' : 
							   order.status === 'completed' ? '已完成' : 
							   order.status === 'cancelled' ? '已取消' : '待接单' }}
						</view>
					</view>
					<view class="order-content">
						<text class="order-title">{{ order.title }}</text>
						<text class="order-desc">{{ order.description }}</text>
						<view class="order-location">
							<text class="location-label">取件：</text>
							<text class="location-text">{{ order.pickupLocation }}</text>
						</view>
						<view class="order-location">
							<text class="location-label">送达：</text>
							<text class="location-text">{{ order.deliveryLocation }}</text>
						</view>
					</view>
					<view class="order-footer">
						<view class="order-price">
							<text class="price-label">费用：</text>
							<text class="price-value">¥{{ order.price }}</text>
						</view>
						<view class="order-actions">
							<button 
								class="action-btn cancel" 
								v-if="order.status === 'pending'"
								@tap="cancelOrder(order.id)"
							>
								取消订单
							</button>
							<button 
								class="action-btn primary" 
								v-if="order.status === 'completed'"
								@tap="reviewOrder(order.id)"
							>
								评价订单
							</button>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 可接订单页面 -->
		<view class="tab-content" v-if="activeTab === 'available'">
			<view class="page-header">
				<view class="header-icon">🔍</view>
				<text class="header-title">可接订单</text>
				<text class="header-subtitle">浏览并接取其他同学的跑腿需求</text>
			</view>
			<view class="filter-bar">
				<view class="filter-item" @tap="showServiceTypeFilter">
					<view class="filter-icon-wrapper">
						<image src="/static/images/express.png" mode="aspectFit" class="filter-type-icon"></image>
					</view>
					<text class="filter-text">{{ selectedFilter.serviceType || '全部类型' }}</text>
					<view class="filter-arrow-wrapper">
						<image src="/static/images/arrow-right.png" mode="aspectFit" class="filter-arrow"></image>
					</view>
				</view>
				<view class="filter-divider"></view>
				<view class="filter-item" @tap="showPriceFilter">
					<view class="filter-icon-wrapper">
						<image src="/static/images/food.png" mode="aspectFit" class="filter-type-icon"></image>
					</view>
					<text class="filter-text">{{ selectedFilter.priceRange || '全部价格' }}</text>
					<view class="filter-arrow-wrapper">
						<image src="/static/images/arrow-right.png" mode="aspectFit" class="filter-arrow"></image>
					</view>
				</view>
			</view>

			<view class="available-orders">
				<view class="order-item" v-for="order in availableOrders" :key="order.id" @tap="goToOrderDetail(order.id)">
					<view class="order-header">
						<view class="order-type">
							<image :src="getServiceTypeIcon(order.serviceType)" mode="aspectFit" class="type-icon"></image>
							<text class="type-name">{{ getServiceTypeName(order.serviceType) }}</text>
						</view>
						<view class="order-price">
							<text class="price-value">¥{{ order.price }}</text>
						</view>
					</view>
					<view class="order-content">
						<text class="order-title">{{ order.title }}</text>
						<text class="order-desc">{{ order.description }}</text>
						<view class="order-location">
							<text class="location-label">取件：</text>
							<text class="location-text">{{ order.pickupLocation }}</text>
						</view>
						<view class="order-location">
							<text class="location-label">送达：</text>
							<text class="location-text">{{ order.deliveryLocation }}</text>
						</view>
						<view class="order-time">
							<text class="time-label">期望完成：</text>
							<text class="time-text">{{ order.expectedTime }}</text>
						</view>
					</view>
					<view class="order-footer">
						<view class="publisher-info">
							<image :src="order.publisherAvatar" mode="aspectFit" class="publisher-avatar"></image>
							<text class="publisher-name">{{ order.publisherName }}</text>
							<view class="publisher-rating">
								<text class="rating-text">{{ order.publisherRating }}分</text>
							</view>
						</view>
						<button class="accept-btn" @tap="acceptOrder(order.id)">接单</button>
					</view>
				</view>
			</view>
		</view>

		<!-- 底部操作栏 -->
		<view class="bottom-actions" v-if="activeTab === 'available'">
			<button class="refresh-btn" @tap="refreshOrders">
				<view class="refresh-icon">🔄</view>
				<text>刷新订单</text>
			</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			activeTab: 'publish',
			orderFilterType: 'published', // 新增：订单筛选类型
			selectedServiceType: 'takeout',
			serviceTypes: [
				{ value: 'takeout', name: '外卖代拿', icon: '/static/images/food.png' },
				{ value: 'express', name: '快递代取', icon: '/static/images/express.png' },
				{ value: 'other', name: '小事代办', icon: '/static/images/devices.png' }
			],
			publishForm: {
				title: '',
				description: '',
				pickupLocation: '',
				deliveryLocation: '',
				price: '',
				expectedTime: '',
				phone: ''
			},
			myOrders: [
				{
					id: 1,
					type: 'published', // 新增：订单类型
					title: '帮忙取快递',
					description: '快递在菜鸟驿站，帮忙取一下送到宿舍',
					serviceType: 'express',
					status: 'pending',
					pickupLocation: '菜鸟驿站',
					deliveryLocation: '6号宿舍楼',
					price: 5,
					expectedTime: '18:00'
				},
				{
					id: 2,
					type: 'published', // 新增：订单类型
					title: '帮忙买午饭',
					description: '在食堂帮忙买一份黄焖鸡米饭',
					serviceType: 'takeout',
					status: 'completed',
					pickupLocation: '第一食堂',
					deliveryLocation: '图书馆',
					price: 3,
					expectedTime: '12:00'
				}
			],
			// 新增：我接的订单数据
			acceptedOrders: [
				{
					id: 5,
					type: 'accepted',
					title: '帮忙取外卖',
					description: '外卖在宿舍楼下，帮忙送到5楼',
					serviceType: 'takeout',
					status: 'accepted',
					pickupLocation: '宿舍楼下',
					deliveryLocation: '5楼宿舍',
					price: 4,
					expectedTime: '20:00',
					publisherName: '王同学',
					publisherAvatar: '/static/images/个人中心-active.png'
				},
				{
					id: 6,
					type: 'accepted',
					title: '帮忙买饮料',
					description: '在小卖部帮忙买两瓶可乐',
					serviceType: 'other',
					status: 'completed',
					pickupLocation: '小卖部',
					deliveryLocation: '篮球场',
					price: 3,
					expectedTime: '17:00',
					publisherName: '赵同学',
					publisherAvatar: '/static/images/个人中心-active.png'
				}
			],
			availableOrders: [
				{
					id: 3,
					title: '帮忙取外卖',
					description: '外卖在宿舍楼下，帮忙送到3楼',
					serviceType: 'takeout',
					price: 4,
					pickupLocation: '宿舍楼下',
					deliveryLocation: '3楼宿舍',
					expectedTime: '19:00',
					publisherName: '张同学',
					publisherAvatar: '/static/images/个人中心-active.png',
					publisherRating: 4.8
				},
				{
					id: 4,
					title: '帮忙买饮料',
					description: '在小卖部帮忙买一瓶可乐',
					serviceType: 'other',
					price: 2,
					pickupLocation: '小卖部',
					deliveryLocation: '操场',
					expectedTime: '16:00',
					publisherName: '李同学',
					publisherAvatar: '/static/images/个人中心-active.png',
					publisherRating: 4.9
				}
			],
			selectedFilter: {
				serviceType: '全部类型',
				priceRange: '全部价格'
			}
		}
	},
	methods: {
		goBack() {
			uni.navigateBack();
		},
		showMenu() {
			uni.showActionSheet({
				itemList: ['帮助', '反馈', '设置'],
				success: (res) => {
					console.log('选择了第' + (res.tapIndex + 1) + '个选项');
				}
			});
		},
		switchTab(tab) {
			this.activeTab = tab;
		},
		switchOrderFilter(type) {
			this.orderFilterType = type;
		},
		selectServiceType(type) {
			this.selectedServiceType = type;
		},
		onTimeChange(e) {
			this.publishForm.expectedTime = e.detail.value;
		},
		publishOrder() {
			if (!this.validateForm()) {
				return;
			}
			
			uni.showLoading({
				title: '发布中...'
			});
			
			// 模拟发布过程
			setTimeout(() => {
				uni.hideLoading();
				uni.showToast({
					title: '发布成功',
					icon: 'success'
				});
				
				// 重置表单
				this.resetForm();
				
				// 切换到我的订单页面
				this.activeTab = 'orders';
			}, 1500);
		},
		validateForm() {
			if (!this.publishForm.title.trim()) {
				uni.showToast({
					title: '请输入标题',
					icon: 'none'
				});
				return false;
			}
			if (!this.publishForm.description.trim()) {
				uni.showToast({
					title: '请输入详细描述',
					icon: 'none'
				});
				return false;
			}
			if (!this.publishForm.pickupLocation.trim()) {
				uni.showToast({
					title: '请输入取件地点',
					icon: 'none'
				});
				return false;
			}
			if (!this.publishForm.deliveryLocation.trim()) {
				uni.showToast({
					title: '请输入送达地点',
					icon: 'none'
				});
				return false;
			}
			if (!this.publishForm.price) {
				uni.showToast({
					title: '请输入跑腿费用',
					icon: 'none'
				});
				return false;
			}
			if (!this.publishForm.expectedTime) {
				uni.showToast({
					title: '请选择期望完成时间',
					icon: 'none'
				});
				return false;
			}
			if (!this.publishForm.phone.trim()) {
				uni.showToast({
					title: '请输入联系电话',
					icon: 'none'
				});
				return false;
			}
			return true;
		},
		resetForm() {
			this.publishForm = {
				title: '',
				description: '',
				pickupLocation: '',
				deliveryLocation: '',
				price: '',
				expectedTime: '',
				phone: ''
			};
		},
		cancelOrder(orderId) {
			uni.showModal({
				title: '确认取消',
				content: '确定要取消这个订单吗？',
				success: (res) => {
					if (res.confirm) {
						// 模拟取消订单
						const order = this.myOrders.find(o => o.id === orderId);
						if (order) {
							order.status = 'cancelled';
						}
						uni.showToast({
							title: '订单已取消',
							icon: 'success'
						});
					}
				}
			});
		},
		reviewOrder(orderId) {
			uni.navigateTo({
				url: `/pages/features/order-review?orderId=${orderId}`
			});
		},
		acceptOrder(orderId) {
			uni.showModal({
				title: '确认接单',
				content: '确定要接这个订单吗？',
				success: (res) => {
					if (res.confirm) {
						// 模拟接单过程
						uni.showLoading({
							title: '接单中...'
						});
						
						setTimeout(() => {
							uni.hideLoading();
							uni.showToast({
								title: '接单成功',
								icon: 'success'
							});
							
							// 从可接订单中移除
							this.availableOrders = this.availableOrders.filter(o => o.id !== orderId);
						}, 1000);
					}
				}
			});
		},
		refreshOrders() {
			uni.showLoading({
				title: '刷新中...'
			});
			
			setTimeout(() => {
				uni.hideLoading();
				uni.showToast({
					title: '刷新成功',
					icon: 'success'
				});
			}, 1000);
		},
		showServiceTypeFilter() {
			uni.showActionSheet({
				itemList: ['全部类型', '外卖代拿', '快递代取', '小事代办'],
				success: (res) => {
					const types = ['全部类型', '外卖代拿', '快递代取', '小事代办'];
					this.selectedFilter.serviceType = types[res.tapIndex];
				}
			});
		},
		showPriceFilter() {
			uni.showActionSheet({
				itemList: ['全部价格', '0-5元', '5-10元', '10元以上'],
				success: (res) => {
					const ranges = ['全部价格', '0-5元', '5-10元', '10元以上'];
					this.selectedFilter.priceRange = ranges[res.tapIndex];
				}
			});
		},
		getServiceTypeIcon(type) {
			const serviceType = this.serviceTypes.find(s => s.value === type);
			return serviceType ? serviceType.icon : '/static/images/devices.png';
		},
		getServiceTypeName(type) {
			const serviceType = this.serviceTypes.find(s => s.value === type);
			return serviceType ? serviceType.name : '其他';
		},
		getStatusClass(status) {
			const statusMap = {
				'pending': 'status-pending',
				'accepted': 'status-accepted',
				'completed': 'status-completed',
				'cancelled': 'status-cancelled'
			};
			return statusMap[status] || 'status-pending';
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
		goToOrderDetail(orderId) {
			uni.navigateTo({
				url: `/pages/features/order-detail?orderId=${orderId}`
			});
		}
	},
	computed: {
		// 根据筛选类型显示对应的订单
		filteredOrders() {
			if (this.orderFilterType === 'published') {
				return this.myOrders;
			} else {
				return this.acceptedOrders;
			}
		}
	}
	// 添加一个空的属性来测试语法
}
</script>

<style scoped>
.errand-page {
	min-height: 100vh;
	background-color: #f5f5f5;
}

/* 顶部导航栏 */
.nav-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20rpx 30rpx;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	border-bottom: none;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.nav-left, .nav-right {
	width: 60rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.nav-icon {
	width: 40rpx;
	height: 40rpx;
	filter: brightness(0) invert(1);
}

.nav-title {
	font-size: 36rpx;
	font-weight: 600;
	color: #ffffff;
	text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
}

/* 功能切换标签 */
.tab-container {
	display: flex;
	background-color: #ffffff;
	border-bottom: 1rpx solid #e5e5e5;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.tab-item {
	flex: 1;
	padding: 30rpx 0;
	text-align: center;
	position: relative;
	transition: all 0.3s ease;
}

.tab-text {
	font-size: 28rpx;
	color: #666666;
	transition: color 0.3s;
}

.tab-item.active .tab-text {
	color: #007aff;
	font-weight: 600;
}

.tab-item.active::after {
	content: '';
	position: absolute;
	bottom: 0;
	left: 50%;
	transform: translateX(-50%);
	width: 60rpx;
	height: 4rpx;
	background: linear-gradient(90deg, #667eea, #764ba2);
	border-radius: 2rpx;
	box-shadow: 0 2rpx 8rpx rgba(102, 126, 234, 0.4);
}

.tab-icon {
	width: 40rpx;
	height: 40rpx;
	margin: 0 auto 10rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.tab-icon-img {
	width: 32rpx;
	height: 32rpx;
	opacity: 0.6;
	transition: all 0.3s ease;
}

.tab-item.active .tab-icon-img {
	opacity: 1;
	transform: scale(1.1);
}

/* 标签页内容 */
.tab-content {
	padding: 30rpx;
}

/* 页面头部 */
.page-header {
	text-align: center;
	margin-bottom: 40rpx;
	padding: 40rpx 20rpx;
	background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
	border-radius: 20rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.header-icon {
	font-size: 60rpx;
	margin-bottom: 20rpx;
}

.header-title {
	display: block;
	font-size: 36rpx;
	font-weight: 600;
	color: #333333;
	margin-bottom: 10rpx;
}

.header-subtitle {
	font-size: 24rpx;
	color: #666666;
	line-height: 1.4;
}

/* 订单筛选标签 */
.order-filter-tabs {
	display: flex;
	background: #ffffff;
	border-radius: 20rpx;
	margin-bottom: 30rpx;
	overflow: hidden;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
	border: 1rpx solid rgba(102, 126, 234, 0.1);
}

.filter-tab-item {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 25rpx 20rpx;
	transition: all 0.3s ease;
	cursor: pointer;
}

.filter-tab-item.active {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: #ffffff;
}

.filter-tab-icon {
	font-size: 32rpx;
	margin-bottom: 10rpx;
}

.filter-tab-text {
	font-size: 26rpx;
	font-weight: 500;
	transition: all 0.3s ease;
}

.filter-tab-item.active .filter-tab-text {
	color: #ffffff;
	font-weight: 600;
}

/* 发布需求表单 */
.publish-form {
	background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
	border-radius: 20rpx;
	padding: 40rpx;
	box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.08);
	border: 1rpx solid rgba(102, 126, 234, 0.1);
}

.form-section {
	margin-bottom: 40rpx;
}

.section-title {
	display: flex;
	align-items: center;
	font-size: 32rpx;
	font-weight: 600;
	color: #333333;
	margin-bottom: 30rpx;
}

.title-icon {
	font-size: 36rpx;
	margin-right: 15rpx;
}

.service-types {
	display: flex;
	justify-content: space-between;
}

.service-type-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 30rpx 20rpx;
	border: 2rpx solid #e5e5e5;
	border-radius: 20rpx;
	width: 180rpx;
	transition: all 0.3s ease;
	cursor: pointer;
	background: #ffffff;
}

.service-type-item:hover {
	transform: translateY(-5rpx);
	box-shadow: 0 8rpx 25rpx rgba(0, 0, 0, 0.1);
}

.service-type-item.selected {
	border-color: #667eea;
	background: linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%);
	box-shadow: 0 4rpx 20rpx rgba(102, 126, 234, 0.2);
	transform: translateY(-3rpx);
}

.service-icon-wrapper {
	width: 80rpx;
	height: 80rpx;
	margin-bottom: 20rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
	border-radius: 50%;
	padding: 15rpx;
	transition: all 0.3s ease;
}

.service-type-item.selected .service-icon-wrapper {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	transform: scale(1.1);
}

.service-icon {
	width: 50rpx;
	height: 50rpx;
	transition: all 0.3s ease;
}

.service-type-item.selected .service-icon {
	filter: brightness(0) invert(1);
}

.service-name {
	font-size: 24rpx;
	color: #333333;
}

.form-item {
	margin-bottom: 30rpx;
}

.form-label {
	display: block;
	font-size: 28rpx;
	color: #333333;
	margin-bottom: 20rpx;
}

.form-input {
	width: 100%;
	height: 80rpx;
	border: 2rpx solid #e5e5e5;
	border-radius: 10rpx;
	padding: 0 20rpx;
	font-size: 28rpx;
	background-color: #ffffff;
}

.form-textarea {
	width: 100%;
	height: 160rpx;
	border: 2rpx solid #e5e5e5;
	border-radius: 10rpx;
	padding: 20rpx;
	font-size: 28rpx;
	background-color: #ffffff;
	resize: none;
}

.price-input {
	display: flex;
	align-items: center;
}

.price-input .form-input {
	flex: 1;
	margin-right: 20rpx;
}

.price-unit {
	font-size: 28rpx;
	color: #666666;
}

.time-picker {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 80rpx;
	border: 2rpx solid #e5e5e5;
	border-radius: 10rpx;
	padding: 0 20rpx;
	background-color: #ffffff;
}

.time-text {
	font-size: 28rpx;
	color: #333333;
}

.arrow-icon {
	width: 30rpx;
	height: 30rpx;
}

.publish-actions {
	margin-top: 60rpx;
}

.publish-btn {
	width: 100%;
	height: 88rpx;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: #ffffff;
	font-size: 32rpx;
	font-weight: 600;
	border-radius: 44rpx;
	border: none;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 8rpx 25rpx rgba(102, 126, 234, 0.3);
	transition: all 0.3s ease;
}

.publish-btn:active {
	transform: translateY(2rpx);
	box-shadow: 0 4rpx 15rpx rgba(102, 126, 234, 0.4);
}

.publish-btn .btn-icon {
	width: 32rpx;
	height: 32rpx;
	margin-right: 15rpx;
	filter: brightness(0) invert(1);
}

/* 订单列表 */
.order-list {
	background-color: #ffffff;
	border-radius: 20rpx;
	overflow: hidden;
}

.order-item {
	padding: 30rpx;
	border-bottom: 1rpx solid #f0f0f0;
}

.order-item:last-child {
	border-bottom: none;
}

.order-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.order-type {
	display: flex;
	align-items: center;
}

.type-icon {
	width: 40rpx;
	height: 40rpx;
	margin-right: 15rpx;
}

.type-name {
	font-size: 24rpx;
	color: #666666;
}

.order-status {
	padding: 8rpx 20rpx;
	border-radius: 20rpx;
	font-size: 22rpx;
}

.status-pending {
	background-color: #fff3cd;
	color: #856404;
}

.status-accepted {
	background-color: #d1ecf1;
	color: #0c5460;
}

.status-completed {
	background-color: #d4edda;
	color: #155724;
}

.status-cancelled {
	background-color: #f8d7da;
	color: #721c24;
}

.order-content {
	margin-bottom: 20rpx;
}

.order-title {
	display: block;
	font-size: 32rpx;
	font-weight: 600;
	color: #333333;
	margin-bottom: 15rpx;
}

.order-desc {
	display: block;
	font-size: 26rpx;
	color: #666666;
	margin-bottom: 20rpx;
	line-height: 1.5;
}

.order-location {
	display: flex;
	margin-bottom: 10rpx;
}

.location-label {
	font-size: 24rpx;
	color: #999999;
	width: 80rpx;
}

.location-text {
	font-size: 24rpx;
	color: #333333;
	flex: 1;
}

.order-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.order-price {
	display: flex;
	align-items: center;
}

.price-label {
	font-size: 24rpx;
	color: #999999;
}

.price-value {
	font-size: 28rpx;
	font-weight: 600;
	color: #ff6b35;
}

.order-actions {
	display: flex;
	gap: 20rpx;
}

.action-btn {
	padding: 15rpx 30rpx;
	border-radius: 25rpx;
	font-size: 24rpx;
	border: none;
}

.action-btn.cancel {
	background-color: #f8f9fa;
	color: #666666;
}

.action-btn.primary {
	background-color: #007aff;
	color: #ffffff;
}

/* 可接订单页面 */
.filter-bar {
	display: flex;
	background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
	border-radius: 20rpx;
	margin-bottom: 30rpx;
	overflow: hidden;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
	border: 1rpx solid rgba(102, 126, 234, 0.1);
}

.filter-item {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 30rpx 20rpx;
	position: relative;
	transition: all 0.3s ease;
}

.filter-item:active {
	background-color: rgba(102, 126, 234, 0.05);
}

.filter-divider {
	width: 1rpx;
	height: 60rpx;
	background: linear-gradient(to bottom, transparent, #e0e0e0, transparent);
	margin: 0 10rpx;
}

.filter-text {
	font-size: 28rpx;
	color: #333333;
	margin: 0 15rpx;
	font-weight: 500;
}

.filter-icon-wrapper {
	width: 50rpx;
	height: 50rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
	border-radius: 50%;
	padding: 10rpx;
}

.filter-type-icon {
	width: 30rpx;
	height: 30rpx;
	opacity: 0.7;
}

.filter-arrow-wrapper {
	width: 40rpx;
	height: 40rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.filter-arrow {
	width: 20rpx;
	height: 20rpx;
	opacity: 0.5;
	transition: all 0.3s ease;
}

.filter-item:active .filter-arrow {
	opacity: 0.8;
	transform: translateX(3rpx);
}

.available-orders {
	background: transparent;
	border-radius: 20rpx;
	overflow: hidden;
}

.available-orders .order-item {
	border-bottom: none;
	margin-bottom: 20rpx;
	background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
	border-radius: 20rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
	border: 1rpx solid rgba(102, 126, 234, 0.1);
	transition: all 0.3s ease;
}

.available-orders .order-item:active {
	transform: translateY(-2rpx);
	box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.1);
}

.available-orders .order-item:last-child {
	border-bottom: none;
}

.available-orders .order-price {
	margin: 0;
}

.available-orders .price-value {
	font-size: 32rpx;
	font-weight: 700;
	color: #ff6b35;
}

.order-time {
	display: flex;
	margin-bottom: 10rpx;
}

.time-label {
	font-size: 24rpx;
	color: #999999;
	width: 120rpx;
}

.time-text {
	font-size: 24rpx;
	color: #333333;
	flex: 1;
}

.publisher-info {
	display: flex;
	align-items: center;
}

.publisher-avatar {
	width: 50rpx;
	height: 50rpx;
	border-radius: 25rpx;
	margin-right: 15rpx;
}

.publisher-name {
	font-size: 24rpx;
	color: #333333;
	margin-right: 15rpx;
}

.publisher-rating {
	background-color: #fff3cd;
	padding: 5rpx 10rpx;
	border-radius: 10rpx;
}

.rating-text {
	font-size: 20rpx;
	color: #856404;
}

.accept-btn {
	background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
	color: #ffffff;
	padding: 18rpx 35rpx;
	border-radius: 25rpx;
	font-size: 26rpx;
	font-weight: 600;
	border: none;
	box-shadow: 0 4rpx 15rpx rgba(40, 167, 69, 0.3);
	transition: all 0.3s ease;
}

.accept-btn:active {
	transform: translateY(2rpx);
	box-shadow: 0 2rpx 10rpx rgba(40, 167, 69, 0.4);
}

/* 底部操作栏 */
.bottom-actions {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: #ffffff;
	padding: 20rpx 30rpx;
	border-top: 1rpx solid #e5e5e5;
}

.refresh-btn {
	width: 100%;
	height: 80rpx;
	background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
	color: #666666;
	font-size: 28rpx;
	font-weight: 500;
	border: 2rpx solid #e5e5e5;
	border-radius: 40rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.3s ease;
	box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.05);
}

.refresh-btn:active {
	background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%);
	transform: translateY(2rpx);
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.refresh-icon {
	font-size: 32rpx;
	margin-right: 15rpx;
	animation: spin 2s linear infinite;
}

@keyframes spin {
	from { transform: rotate(0deg); }
	to { transform: rotate(360deg); }
}

.btn-icon {
	width: 30rpx;
	height: 30rpx;
	margin-right: 10rpx;
}
</style>

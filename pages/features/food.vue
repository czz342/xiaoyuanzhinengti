<template>
	<view class="food-page">
		<view class="header">
			<view class="header-title">
				<text class="main-title">食堂点餐</text>
				<text class="sub-title">便捷订餐，无需排队</text>
			</view>
			<view class="history-btn" @tap="goToHistory">
				<uni-icons type="list" size="22" color="#333"></uni-icons>
				<text>我的订单</text>
			</view>
		</view>
		
		<view class="canteen-selector">
			<scroll-view scroll-x="true" class="canteen-scroll">
				<view 
					v-for="(canteen, index) in canteens" 
					:key="index" 
					class="canteen-item" 
					:class="{ active: selectedCanteen === index }"
					@tap="selectCanteen(index)"
				>
					<text>{{canteen.name}}</text>
					<view class="status-indicator" :class="canteen.status"></view>
				</view>
			</scroll-view>
		</view>
		
		<view class="menu-section">
			<view class="section-header">
				<text class="section-title">今日菜单</text>
				<view class="filter-buttons">
					<view 
						v-for="(filter, index) in filters" 
						:key="index" 
						class="filter-button" 
						:class="{ active: selectedFilter === index }"
						@tap="selectFilter(index)"
					>
						<text>{{filter}}</text>
					</view>
				</view>
			</view>
			
			<view class="food-grid">
				<view 
					v-for="(item, index) in filteredFoodItems" 
					:key="index" 
					class="food-item"
					@tap="viewFoodDetail(item)"
				>
					<image :src="item.image" mode="aspectFill" class="food-image"></image>
					<view class="food-info">
						<text class="food-name">{{item.name}}</text>
						<view class="food-meta">
							<text class="food-price">¥{{item.price.toFixed(2)}}</text>
							<text class="food-sales">月售{{item.monthlySales}}</text>
						</view>
						<view class="food-tags">
							<view v-for="(tag, tagIndex) in item.tags" :key="tagIndex" class="food-tag">
								<text>{{tag}}</text>
							</view>
						</view>
					</view>
					<view class="add-button" @tap.stop="addToCart(item)">
						<text>+</text>
					</view>
				</view>
			</view>
		</view>
		
		<view class="cart-bar" v-if="cart.length > 0">
			<view class="cart-info" @tap="openCartPopup">
				<view class="cart-icon-wrapper">
					<image src="/static/images/cart.png" mode="aspectFit" class="cart-icon-image"></image>
					<view class="cart-badge">{{cartCount}}</view>
				</view>
				<view class="cart-price">
					<text>¥{{cartTotal.toFixed(2)}}</text>
				</view>
			</view>
			<button class="checkout-button" @tap="checkout">去结算</button>
		</view>

		<!-- 购物车详情弹窗 -->
		<uni-popup ref="cartPopup" type="bottom">
			<view class="cart-popup-container">
				<view class="popup-header">
					<text class="popup-title">购物车详情</text>
					<view class="clear-cart-btn" @tap="clearCart">
						<uni-icons type="trash" size="16" color="#666"></uni-icons>
						<text>清空购物车</text>
					</view>
				</view>
				<scroll-view scroll-y class="popup-body">
					<view class="cart-item-row" v-for="(item, index) in cart" :key="index">
						<image :src="item.image" class="cart-item-image"></image>
						<view class="cart-item-details">
							<text class="item-name">{{item.name}}</text>
							<text class="item-price">¥{{item.price.toFixed(2)}}</text>
						</view>
						<view class="item-controls">
							<uni-number-box 
								:value="item.quantity" 
								:min="0" 
								@change="handleQuantityChange($event, item)"
							/>
						</view>
					</view>
				</scroll-view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
import KingdeeAgentService from '@/services/kingdeeAgent.js';

export default {
	data() {
		return {
			selectedCanteen: 0,
			selectedFilter: 0,
			cart: [],
			canteens: [],
			filters: ['全部', '特价', '热销', '套餐', '素食'],
			foodItems: []
		}
	},
	computed: {
		filteredFoodItems() {
			if (this.selectedFilter === 0) {
				return this.foodItems;
			} else {
				const filterText = this.filters[this.selectedFilter];
				return this.foodItems.filter(item => item.tags.includes(filterText));
			}
		},
		cartCount() {
			return this.cart.reduce((total, item) => total + item.quantity, 0);
		},
		cartTotal() {
			return this.cart.reduce((total, item) => total + (item.quantity * item.price), 0);
		}
	},
	onLoad() {
		this.fetchCanteens();
	},
	methods: {
		async fetchCanteens() {
			try {
				const response = await KingdeeAgentService.getCanteenList();
				console.log('获取食堂列表响应:', response);
				if (response && response.data && response.data.rows) {
					const canteens = response.data.rows;

					// 准备时间参数：当前时间 和 一小时前
					const now = new Date();
					const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
					const endTime = this.formatDateTime(now);
					const startTime = this.formatDateTime(oneHourAgo);

					// 并行获取每个食堂的人流量
					const statusPromises = canteens.map(async (canteen) => {
						const trafficResponse = await KingdeeAgentService.getTodaysCanteenOrders(canteen.number, startTime, endTime);
						const count = (trafficResponse && trafficResponse.data) ? parseInt(trafficResponse.data.totalCount, 10) : 0;
						canteen.status = this.calculateStatus(count);
						return canteen;
					});
					
					this.canteens = await Promise.all(statusPromises);

					// 如果食堂列表不为空，则默认加载第一个食堂的菜单
					if (this.canteens.length > 0) {
						this.selectCanteen(0);
					}
				} else {
					uni.showToast({
						title: '获取食堂列表失败',
						icon: 'none'
					});
				}
			} catch (error) {
				console.error('获取食堂列表失败:', error);
				uni.showToast({
					title: '获取食堂列表失败，请稍后再试',
					icon: 'none'
				});
			}
		},
		calculateStatus(count) {
			if (count <= 10) {
				return 'low'; // 空闲
			} else if (count <= 30) {
				return 'medium'; // 繁忙
			} else {
				return 'high'; // 拥挤
			}
		},
		formatDateTime(date) {
			const year = date.getFullYear();
			const month = String(date.getMonth() + 1).padStart(2, '0');
			const day = String(date.getDate()).padStart(2, '0');
			const hours = String(date.getHours()).padStart(2, '0');
			const minutes = String(date.getMinutes()).padStart(2, '0');
			const seconds = String(date.getSeconds()).padStart(2, '0');
			return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
		},
		selectCanteen(index) {
			this.selectedCanteen = index;
			const canteen = this.canteens[index];
			if (canteen && canteen.number) {
				this.fetchDishes(canteen.number);
			}
		},
		async fetchDishes(canteenId) {
			try {
				const response = await KingdeeAgentService.getDishList(canteenId);
				console.log(`获取食堂[${canteenId}]的菜品列表响应:`, response);
				if (response && response.data && response.data.rows) {
					this.foodItems = response.data.rows.map(item => {
						let imageName = 'default.png';
						if (item.lb77_description) {
							const parts = item.lb77_description.split('\\');
							imageName = parts[parts.length - 1];
						}
						item.image = `/static/images/FoodList/${imageName}`;

						item.price = item.lb77_price;
						item.tags = item.lb77_tags ? item.lb77_tags.split(',') : [];

						item.monthlySales = Math.floor(Math.random() * 500) + 50;

						return item;
					});
				} else {
					this.foodItems = [];
					uni.showToast({
						title: '该食堂暂无菜品',
						icon: 'none'
					});
				}
			} catch (error) {
				console.error(`获取食堂[${canteenId}]的菜品失败:`, error);
				uni.showToast({
					title: '获取菜品失败，请稍后再试',
					icon: 'none'
				});
			}
		},
		selectFilter(index) {
			this.selectedFilter = index;
		},
		viewFoodDetail(item) {
			uni.showToast({
				title: '查看详情: ' + item.name,
				icon: 'none'
			});
		},
		addToCart(item) {
			const existingItem = this.cart.find(cartItem => cartItem.number === item.number);
			if (existingItem) {
				existingItem.quantity++;
			} else {
				this.cart.push({ ...item, quantity: 1 });
			}
			
			uni.showToast({
				title: '已加入购物车',
				icon: 'success',
				duration: 1000
			});
		},
		// 打开购物车弹窗
		openCartPopup() {
			if (this.cart.length > 0) {
				this.$refs.cartPopup.open();
			}
		},
		// 清空购物车
		clearCart() {
			this.cart = [];
			this.$refs.cartPopup.close();
		},
		// 处理购物车内数量变化
		handleQuantityChange(newQuantity, item) {
			const cartItem = this.cart.find(ci => ci.number === item.number);
			if (cartItem) {
				if (newQuantity > 0) {
					cartItem.quantity = newQuantity;
				} else {
					// 如果数量为0，则从购物车中移除
					this.cart = this.cart.filter(ci => ci.number !== item.number);
				}
			}
			// 如果购物车空了，关闭弹窗
			if (this.cart.length === 0) {
				this.$refs.cartPopup.close();
			}
		},
		async checkout() {
			if (this.cart.length === 0) {
				uni.showToast({ title: '购物车是空的哦', icon: 'none' });
				return;
			}

			uni.showModal({
				title: '确认订单',
				content: `总计 ¥${this.cartTotal.toFixed(2)}，是否确认下单？`,
				success: async (res) => {
					if (res.confirm) {
						this.submitOrder();
					}
				}
			});
		},
		async submitOrder() {
			uni.showLoading({ title: '正在提交订单...' });
			
			// 准备API需要的数据
			const selectedCanteenInfo = this.canteens[this.selectedCanteen];
			const orderData = {
				billno: `food_order_${new Date().getTime()}`, // 动态生成唯一订单号
				lb77_canteen_number: selectedCanteenInfo.number, // 当前选择的食堂编码
				lb77_student_number: '645730151', //  TODO: 替换为真实的学生ID
				lb77_dining_type: '堂食', // 暂时固定为堂食
				lb77_total_price: this.cartTotal, // 订单总价
				lb77_entryentity: this.cart.map(item => {
					return {
						lb77_food_item_id_number: item.number, // 菜品编码
						lb77_quantity: item.quantity, // 购买数量
						// lb77_notes: '' // 备注（可选）
					};
				})
			};

			try {
				// 关闭购物车弹窗
				if (this.$refs.cartPopup) {
					this.$refs.cartPopup.close();
				}

				const response = await KingdeeAgentService.createCanteenOrder(orderData);
				console.log('创建食堂订单响应:', response);
				if (response && response.data && response.data.successCount > 0) {
					uni.hideLoading();
					uni.showToast({
						title: '下单成功！',
						icon: 'success'
					});
					// 清空购物车
					this.cart = [];
				} else {
					throw new Error(response.message || '下单失败，请重试');
				}
			} catch (error) {
				uni.hideLoading();
				console.error('创建订单失败:', error);
				uni.showToast({
					title: error.message || '下单失败，请稍后重试',
					icon: 'none'
				});
			}
		},
		goToHistory() {
			uni.navigateTo({
				url: '/pages/features/food-history'
			});
		}
	}
}
</script>

<style>
.food-page {
	min-height: 100vh;
	background-color: #f5f5f5;
	padding-bottom: 140rpx; /* 为购物车栏留出更多空间 */
}

.header {
	padding: 30rpx;
	background-color: #ffffff;
	margin-bottom: 20rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
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

.history-btn {
	display: flex;
	align-items: center;
	background-color: #f5f5f5;
	padding: 10rpx 20rpx;
	border-radius: 30rpx;
	font-size: 24rpx;
	color: #333;
}

.history-btn text {
	margin-left: 8rpx;
}

.canteen-selector {
	background-color: #ffffff;
	padding: 20rpx 0;
	margin-bottom: 20rpx;
}

.canteen-scroll {
	white-space: nowrap;
	padding: 0 20rpx;
}

.canteen-item {
	display: inline-block;
	padding: 15rpx 30rpx;
	margin-right: 20rpx;
	background-color: #f5f5f5;
	border-radius: 50rpx;
	font-size: 28rpx;
	position: relative;
}

.canteen-item.active {
	background-color: #e6f2ff;
	color: #007AFF;
}

.status-indicator {
	width: 16rpx;
	height: 16rpx;
	border-radius: 50%;
	position: absolute;
	top: 15rpx;
	right: 15rpx;
	border: 2rpx solid #fff;
}

.status-indicator.low {
	background-color: #4cd964; /* 绿色 - 空闲 */
}

.status-indicator.medium {
	background-color: #ffcc00; /* 黄色 - 繁忙 */
}

.status-indicator.high {
	background-color: #ff3b30; /* 红色 - 拥挤 */
}

.menu-section {
	background-color: #ffffff;
	padding: 30rpx;
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 30rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
}

.filter-buttons {
	display: flex;
}

.filter-button {
	padding: 10rpx 20rpx;
	font-size: 24rpx;
	margin-left: 15rpx;
	border-radius: 30rpx;
	background-color: #f5f5f5;
}

.filter-button.active {
	background-color: #007AFF;
	color: #ffffff;
}

.food-grid {
	display: flex;
	flex-wrap: wrap;
	margin: 0 -15rpx;
}

.food-item {
	width: calc(50% - 30rpx);
	margin: 15rpx;
	background-color: #f9f9f9;
	border-radius: 15rpx;
	overflow: hidden;
	position: relative;
	box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
}

.food-image {
	width: 100%;
	height: 200rpx;
}

.food-info {
	padding: 20rpx;
}

.food-name {
	font-size: 28rpx;
	font-weight: bold;
	margin-bottom: 10rpx;
}

.food-meta {
	display: flex;
	justify-content: space-between;
	margin-bottom: 10rpx;
}

.food-price {
	color: #ff3b30;
	font-weight: bold;
}

.food-sales {
	font-size: 24rpx;
	color: #999999;
}

.food-tags {
	display: flex;
	flex-wrap: wrap;
}

.food-tag {
	font-size: 20rpx;
	padding: 4rpx 12rpx;
	background-color: #f0f0f0;
	border-radius: 10rpx;
	margin-right: 10rpx;
	margin-bottom: 10rpx;
	color: #666666;
}

.add-button {
	position: absolute;
	bottom: 20rpx;
	right: 20rpx;
	width: 50rpx;
	height: 50rpx;
	background-color: #007AFF;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	color: #ffffff;
	font-size: 32rpx;
	font-weight: bold;
	box-shadow: 0 4rpx 12rpx rgba(0, 122, 255, 0.4);
	transition: transform 0.2s;
}

.add-button:active {
	transform: scale(0.9);
}

.cart-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	height: 120rpx;
	background-color: #ffffff;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 30rpx;
	box-shadow: 0 -4rpx 15rpx rgba(0,0,0,0.08);
	z-index: 100;
}

.cart-info {
	display: flex;
	align-items: center;
	height: 100%;
}

.cart-icon-wrapper {
	position: relative;
	margin-right: 25rpx;
	background-color: #007AFF;
	width: 90rpx;
	height: 90rpx;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: -30rpx; /* 向上偏移，创造悬浮感 */
	box-shadow: 0 6rpx 15rpx rgba(0, 122, 255, 0.3);
}

.cart-icon-image {
	width: 50rpx;
	height: 50rpx;
}

.cart-badge {
	position: absolute;
	top: -5rpx;
	right: -5rpx;
	background-color: #ff3b30;
	color: #ffffff;
	border-radius: 50%;
	min-width: 36rpx;
	height: 36rpx;
	padding: 0 6rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 22rpx;
	border: 2rpx solid #ffffff;
}

.cart-price {
	font-size: 36rpx;
	color: #ff3b30;
	font-weight: bold;
}

.checkout-button {
	background-color: #007AFF;
	color: #ffffff;
	border-radius: 50rpx;
	font-size: 28rpx;
	padding: 0 40rpx;
	height: 70rpx;
	line-height: 70rpx;
	border: none;
	box-shadow: 0 4rpx 12rpx rgba(0, 122, 255, 0.4);
	transition: background-color 0.2s;
}

.checkout-button:active {
	background-color: #0056b3;
}

/* 购物车弹窗样式 */
.cart-popup-container {
	background-color: #ffffff;
	border-top-left-radius: 20rpx;
	border-top-right-radius: 20rpx;
	padding: 20rpx 30rpx;
	padding-bottom: calc(40rpx + constant(safe-area-inset-bottom)); /* 增加底部安全边距 */
	padding-bottom: calc(40rpx + env(safe-area-inset-bottom));
}

.popup-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.popup-title {
	font-size: 32rpx;
	font-weight: bold;
}

.clear-cart-btn {
	display: flex;
	align-items: center;
	color: #666;
	font-size: 24rpx;
}

.clear-cart-btn text {
	margin-left: 8rpx;
}

.popup-body {
	max-height: 600rpx; /* 限制最大高度，超出可滚动 */
}

.cart-item-row {
	display: flex;
	align-items: center;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #f5f5f5;
}

.cart-item-image {
	width: 100rpx;
	height: 100rpx;
	border-radius: 10rpx;
	margin-right: 20rpx;
}

.cart-item-details {
	flex-grow: 1;
	display: flex;
	flex-direction: column;
}

.item-name {
	font-size: 28rpx;
	margin-bottom: 10rpx;
}

.item-price {
	font-size: 24rpx;
	color: #ff3b30;
}

.item-controls {
	/* 数量选择器样式会由uni-number-box组件自带 */
}
</style> 
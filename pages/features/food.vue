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
		
		<!-- 推荐来源提示 -->
		<view v-if="recommendationParams" class="recommendation-tip">
			<view class="tip-icon">🎯</view>
			<text class="tip-text">已为您选择 {{ recommendationParams.canteen }} {{ recommendationParams.window }}</text>
			<view class="tip-badge">{{ recommendationParams.windowType }}</view>
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
		
		<!-- 窗口选择器 -->
		<view v-if="windows.length > 0" class="window-selector">
			<scroll-view scroll-x="true" class="window-scroll">
				<view 
					v-for="(window, index) in windows" 
					:key="index" 
					class="window-item" 
					:class="{ active: selectedWindow === index, recommended: isRecommendedWindow(window) }"
					@tap="selectWindow(index)"
				>
					<view class="window-header">
						<text class="window-number">{{ window.window_number }}</text>
						<view v-if="isRecommendedWindow(window)" class="recommended-badge">推荐</view>
					</view>
					<text class="window-type">{{ window.window_type }}</text>
					<text class="food-count">{{ window.food_count || 0 }}道菜品</text>
					<view class="window-tags">
						<view v-for="tag in window.tags" :key="tag" class="window-tag">{{ tag }}</view>
					</view>
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

		<!-- 菜品详情弹窗 -->
		<uni-popup ref="foodDetailPopup" type="bottom">
			<view class="food-detail-popup-container" v-if="selectedFoodItem">
				<image :src="selectedFoodItem.image" mode="aspectFill" class="popup-food-image"></image>
				<view class="popup-close-btn" @tap="closeFoodDetailPopup">
					<uni-icons type="close" color="#333" size="24"></uni-icons>
				</view>
				<view class="popup-food-content">
					<text class="popup-food-name">{{ selectedFoodItem.name }}</text>
					<view class="food-tags popup-tags">
						<view v-for="(tag, tagIndex) in selectedFoodItem.tags" :key="tagIndex" class="food-tag">
							<text>{{ tag }}</text>
						</view>
					</view>
					<text class="popup-food-sales">月售{{ selectedFoodItem.monthlySales }}+</text>
					<view class="popup-footer">
						<text class="popup-food-price">¥{{ selectedFoodItem.price.toFixed(2) }}</text>
						<button class="popup-add-to-cart-btn" @tap="addToCartFromPopup">加入购物车</button>
					</view>
				</view>
			</view>
		</uni-popup>

		<!-- 用餐类型选择弹窗 -->
		<uni-popup ref="diningTypePopup" type="bottom">
			<view class="dining-type-popup-container">
				<view class="popup-header">
					<text class="popup-title">选择用餐方式</text>
					<view class="popup-close-btn" @tap="closeDiningTypePopup">
						<uni-icons type="close" color="#333" size="24"></uni-icons>
					</view>
				</view>
				<view class="dining-options">
					<view class="dining-option" @tap="selectDiningType('dine_in')">
						<view class="option-icon">🍽️</view>
						<view class="option-content">
							<text class="option-title">堂食</text>
							<text class="option-desc">在食堂内用餐</text>
						</view>
						<uni-icons type="right" color="#999" size="16"></uni-icons>
					</view>
					<view class="dining-option" @tap="selectDiningType('takeaway')">
						<view class="option-icon">🥡</view>
						<view class="option-content">
							<text class="option-title">外带</text>
							<text class="option-desc">打包带走</text>
						</view>
						<uni-icons type="right" color="#999" size="16"></uni-icons>
					</view>
					<view class="dining-option" @tap="selectDiningType('delivery')">
						<view class="option-icon">🚚</view>
						<view class="option-content">
							<text class="option-title">外卖</text>
							<text class="option-desc">配送到指定地点</text>
						</view>
						<uni-icons type="right" color="#999" size="16"></uni-icons>
					</view>
				</view>
			</view>
		</uni-popup>

		<!-- 外卖地址填写弹窗 -->
		<uni-popup ref="deliveryAddressPopup" type="bottom">
			<view class="delivery-address-popup-container">
				<view class="popup-header">
					<text class="popup-title">填写配送信息</text>
					<view class="popup-close-btn" @tap="closeDeliveryAddressPopup">
						<uni-icons type="close" color="#333" size="24"></uni-icons>
					</view>
				</view>
				<view class="form-content">
					<view class="form-item">
						<text class="form-label">配送地址</text>
						<input 
							class="form-input" 
							v-model="deliveryForm.address" 
							placeholder="请输入详细地址"
							maxlength="100"
						/>
					</view>
					<view class="form-item">
						<text class="form-label">联系电话</text>
						<input 
							class="form-input" 
							v-model="deliveryForm.phone" 
							placeholder="请输入手机号码"
							type="number"
							maxlength="11"
						/>
					</view>
					<view class="form-item">
						<text class="form-label">配送备注</text>
						<textarea 
							class="form-textarea" 
							v-model="deliveryForm.notes" 
							placeholder="请输入配送备注（选填）"
							maxlength="200"
						/>
					</view>
				</view>
				<view class="popup-footer">
					<button class="confirm-btn" @tap="confirmDeliveryInfo">确认下单</button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
// 移除金蝶服务，使用新的后端API

export default {
	data() {
		return {
			selectedCanteen: 0,
			selectedWindow: 0,
			selectedFilter: 0,
			cart: [],
			canteens: [],
			windows: [],
			filters: ['全部', '特价', '热销', '套餐', '素食'],
			foodItems: [],
			selectedFoodItem: null, // 用于菜品详情弹窗
			selectedDiningType: '', // 选择的用餐类型
			recommendationParams: null, // 来自推荐页面的参数
			deliveryForm: {
				address: '',
				phone: '',
				notes: ''
			}
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
	onLoad(options) {
		// 接收来自推荐页面的参数
		if (options.from === 'recommendation') {
			console.log('接收到的原始options:', options);
			
			this.recommendationParams = {
				canteen: decodeURIComponent(options.canteen || ''),
				window: decodeURIComponent(options.window || ''),
				windowType: decodeURIComponent(options.windowType || '')
			};
			
			console.log('解码后的推荐参数:', this.recommendationParams);
		}
		
		this.fetchCanteens();
	},
	methods: {
		async fetchCanteens() {
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
					url: 'http://localhost:3000/api/food/canteens',
					method: 'GET',
					header: {
						'Authorization': `Bearer ${token}`
					}
				});

				if (response.statusCode === 200 && response.data.success) {
					this.canteens = response.data.data.map(canteen => ({
						...canteen,
						status: canteen.current_status || 'open'
					}));

					// 如果有推荐参数，自动选择对应食堂
					if (this.recommendationParams && this.canteens.length > 0) {
						const canteenIndex = this.canteens.findIndex(c => c.name === this.recommendationParams.canteen);
						if (canteenIndex >= 0) {
							this.selectCanteen(canteenIndex);
						} else {
							this.selectCanteen(0);
						}
					} else if (this.canteens.length > 0) {
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
			this.selectedWindow = 0; // 重置窗口选择
			const canteen = this.canteens[index];
			if (canteen && canteen.number) {
				this.fetchWindows(canteen.number);
			}
		},
		
		// 获取指定食堂的窗口列表
		async fetchWindows(canteenId) {
			try {
				const token = uni.getStorageSync('token');
				console.log('获取窗口列表，食堂ID:', canteenId);
				
				const response = await uni.request({
					url: `http://localhost:3000/api/canteen-windows/canteens/${canteenId}/windows`,
					method: 'GET',
					header: {
						'Authorization': `Bearer ${token}`
					}
				});
				
				if (response.statusCode === 200 && response.data.success) {
					this.windows = response.data.data;
					console.log('获取到窗口:', this.windows);
					
					// 如果有推荐参数，自动选择对应窗口
					if (this.recommendationParams && this.windows.length > 0) {
						const windowIndex = this.windows.findIndex(w => 
							w.window_number === this.recommendationParams.window || 
							w.window_type === this.recommendationParams.windowType
						);
						if (windowIndex >= 0) {
							this.selectWindow(windowIndex);
						} else {
							this.selectWindow(0);
						}
					} else if (this.windows.length > 0) {
						this.selectWindow(0);
					}
				} else {
					console.log('获取窗口失败:', response.data);
					this.windows = [];
					// 如果没有窗口，直接获取食堂菜品
					this.fetchDishes(canteenId);
				}
			} catch (error) {
				console.error('获取窗口失败:', error);
				this.windows = [];
				// 出错时使用原来的方法
				this.fetchDishes(canteenId);
			}
		},
		
		// 选择窗口
		selectWindow(index) {
			this.selectedWindow = index;
			if (this.windows.length > 0) {
				const window = this.windows[index];
				if (window && window.id) {
					this.fetchWindowFoods(window.id);
				}
			}
		},
		
		// 获取窗口的菜品
		async fetchWindowFoods(windowId) {
			try {
				const token = uni.getStorageSync('token');
				console.log('获取窗口菜品，窗口ID:', windowId);
				
				const response = await uni.request({
					url: `http://localhost:3000/api/canteen-windows/windows/${windowId}/foods`,
					method: 'GET',
					header: {
						'Authorization': `Bearer ${token}`
					}
				});
				
				console.log('窗口菜品API响应:', response);
				
				if (response.statusCode === 200 && response.data.success) {
					this.foodItems = response.data.data.map(item => ({
						...item,
						number: item.number,
						name: item.name,
						image: item.image || 'http://localhost:3000/static/images/FoodList/default.png',
						price: parseFloat(item.price),
						tags: item.tags || [],
						monthlySales: item.monthly_sales || Math.floor(Math.random() * 500) + 50
					}));
					
					console.log('处理后的窗口菜品数据:', this.foodItems);
				} else {
					console.log('窗口菜品API返回错误:', response.data);
					this.foodItems = [];
				}
			} catch (error) {
				console.error(`获取窗口[${windowId}]的菜品失败:`, error);
				this.foodItems = [];
			}
		},
		
		// 判断是否为推荐窗口
		isRecommendedWindow(window) {
			if (!this.recommendationParams) return false;
			return window.window_number === this.recommendationParams.window || 
			       window.window_type === this.recommendationParams.windowType;
		},
		async fetchDishes(canteenId) {
			try {
				const token = uni.getStorageSync('token');
				console.log('获取菜品，食堂ID:', canteenId, 'token:', token);
				
				if (!token) {
					console.log('没有找到token，请先登录');
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					});
					return;
				}

				console.log('开始获取食堂菜品...');
				const response = await uni.request({
					url: `http://localhost:3000/api/food/canteens/${canteenId}/foods`,
					method: 'GET',
					header: {
						'Authorization': `Bearer ${token}`
					}
				});

				console.log('菜品API响应:', response);
				
				if (response.statusCode === 200 && response.data.success) {
					this.foodItems = response.data.data.map(item => ({
						...item,
						number: item.number,
						name: item.name,
						image: item.image || 'http://localhost:3000/static/images/FoodList/default.png',
						price: parseFloat(item.price),
						tags: item.tags ? (Array.isArray(item.tags) ? item.tags : JSON.parse(item.tags)) : [],
						monthlySales: item.monthly_sales || Math.floor(Math.random() * 500) + 50
					}));
					
					console.log('处理后的菜品数据:', this.foodItems);
				} else {
					console.log('菜品API返回错误:', response.data);
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
			this.selectedFoodItem = item;
			this.$refs.foodDetailPopup.open();
		},
		closeFoodDetailPopup() {
			this.$refs.foodDetailPopup.close();
		},
		addToCartFromPopup() {
			if (this.selectedFoodItem) {
				this.addToCart(this.selectedFoodItem);
				this.closeFoodDetailPopup();
			}
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

			// 显示用餐类型选择弹窗
			this.$refs.diningTypePopup.open();
		},
		// 选择用餐类型
		selectDiningType(type) {
			this.selectedDiningType = type;
			this.$refs.diningTypePopup.close();
			
			if (type === 'delivery') {
				// 如果是外卖，显示地址填写弹窗
				this.$refs.deliveryAddressPopup.open();
			} else {
				// 如果是堂食或外带，直接提交订单
				this.submitOrder();
			}
		},
		// 关闭用餐类型选择弹窗
		closeDiningTypePopup() {
			this.$refs.diningTypePopup.close();
		},
		// 关闭外卖地址填写弹窗
		closeDeliveryAddressPopup() {
			this.$refs.deliveryAddressPopup.close();
		},
		// 确认外卖信息并下单
		confirmDeliveryInfo() {
			if (!this.deliveryForm.address || !this.deliveryForm.phone) {
				uni.showToast({
					title: '请填写配送地址和联系电话',
					icon: 'none'
				});
				return;
			}
			
			this.$refs.deliveryAddressPopup.close();
			this.submitOrder();
		},
		async submitOrder() {
			uni.showLoading({ title: '正在提交订单...' });
			
			try {
				const token = uni.getStorageSync('token');
				if (!token) {
					throw new Error('请先登录');
				}

				// 准备API需要的数据
				const selectedCanteenInfo = this.canteens[this.selectedCanteen];
				const orderData = {
					canteenId: selectedCanteenInfo.id,
					diningType: this.selectedDiningType,
					items: this.cart.map(item => ({
						foodId: item.id,
						foodName: item.name,
						foodImage: item.image,
						quantity: item.quantity,
						unitPrice: item.price,
						notes: ''
					})),
					deliveryAddress: this.selectedDiningType === 'delivery' ? this.deliveryForm.address : null,
					deliveryPhone: this.selectedDiningType === 'delivery' ? this.deliveryForm.phone : null,
					deliveryNotes: this.selectedDiningType === 'delivery' ? this.deliveryForm.notes : null,
					notes: ''
				};

				// 关闭购物车弹窗
				if (this.$refs.cartPopup) {
					this.$refs.cartPopup.close();
				}

				const response = await uni.request({
					url: 'http://localhost:3000/api/food/orders',
					method: 'POST',
					header: {
						'Authorization': `Bearer ${token}`,
						'Content-Type': 'application/json'
					},
					data: orderData
				});

				if (response.statusCode === 200 && response.data.success) {
					uni.hideLoading();
					
					const orderResult = response.data.data;
					
					// 根据用餐类型处理不同的结果
					if (this.selectedDiningType === 'delivery') {
						// 外卖：跳转到外卖进度页面
						uni.navigateTo({
							url: `/pages/features/food-delivery-progress?orderId=${orderResult.order.id}`
						});
					} else {
						// 堂食和外带：显示取餐二维码
						this.showPickupQRCode(orderResult.order);
					}
					
					// 清空购物车和表单
					this.cart = [];
					this.deliveryForm = { address: '', phone: '', notes: '' };
					this.selectedDiningType = '';
				} else {
					throw new Error(response.data.message || '下单失败，请重试');
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

		// 显示取餐二维码
		showPickupQRCode(order) {
			// 这里可以显示取餐二维码弹窗
			uni.showModal({
				title: '下单成功！',
				content: `取餐码：${order.pickupCode || 'A12345'}\n请到${order.canteen_name}取餐`,
				showCancel: false,
				confirmText: '知道了',
				success: () => {
					// 跳转到我的订单页面并传递订单ID，自动弹出详情窗口
					uni.navigateTo({
						url: `/pages/features/food-history?orderId=${order.id}`
					});
				}
			});
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

/* 推荐来源提示 */
.recommendation-tip {
	display: flex;
	align-items: center;
	background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
	margin: 20rpx;
	padding: 20rpx;
	border-radius: 12rpx;
	border-left: 4rpx solid #28a745;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.tip-icon {
	font-size: 32rpx;
	margin-right: 15rpx;
}

.tip-text {
	flex: 1;
	color: #495057;
	font-size: 28rpx;
	font-weight: 500;
}

.tip-badge {
	background-color: #28a745;
	color: #ffffff;
	padding: 6rpx 16rpx;
	border-radius: 16rpx;
	font-size: 24rpx;
	font-weight: 500;
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

/* 窗口选择器 */
.window-selector {
	background-color: #ffffff;
	padding: 20rpx 0;
	margin-bottom: 20rpx;
}

.window-scroll {
	white-space: nowrap;
	padding: 0 20rpx;
}

.window-item {
	display: inline-block;
	width: 200rpx;
	margin-right: 16rpx;
	background-color: #ffffff;
	border-radius: 12rpx;
	padding: 20rpx;
	border: 2rpx solid #e9ecef;
	transition: all 0.3s ease;
	vertical-align: top;
	box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
}

.window-item.active {
	border-color: #28a745;
	background-color: #f8fff9;
	box-shadow: 0 4rpx 12rpx rgba(40, 167, 69, 0.15);
}

.window-item.recommended {
	background: #fff8e1;
	border-color: #ffc107;
	box-shadow: 0 4rpx 12rpx rgba(255, 193, 7, 0.2);
}

.window-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 10rpx;
}

.window-number {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
}

.recommended-badge {
	background-color: #ffc107;
	color: #212529;
	font-size: 20rpx;
	padding: 4rpx 8rpx;
	border-radius: 8rpx;
	font-weight: 600;
}

.window-type {
	display: block;
	font-size: 26rpx;
	color: #666;
	margin-bottom: 8rpx;
}

.food-count {
	display: block;
	font-size: 22rpx;
	color: #999;
	margin-bottom: 10rpx;
}

.window-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 8rpx;
}

.window-tag {
	background-color: #e9ecef;
	color: #6c757d;
	font-size: 20rpx;
	padding: 4rpx 8rpx;
	border-radius: 8rpx;
}

.canteen-item {
	display: inline-block;
	padding: 16rpx 32rpx;
	margin-right: 16rpx;
	background-color: #f8f9fa;
	border-radius: 24rpx;
	font-size: 28rpx;
	position: relative;
	border: 2rpx solid transparent;
	transition: all 0.3s ease;
	color: #6c757d;
}

.canteen-item.active {
	background-color: #ffffff;
	color: #28a745;
	border-color: #28a745;
	box-shadow: 0 2rpx 8rpx rgba(40, 167, 69, 0.2);
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
	padding: 12rpx 24rpx;
	font-size: 24rpx;
	margin-left: 12rpx;
	border-radius: 20rpx;
	background-color: #f8f9fa;
	color: #6c757d;
	border: 2rpx solid transparent;
	transition: all 0.3s ease;
}

.filter-button.active {
	background-color: #28a745;
	color: #ffffff;
	border-color: #28a745;
	box-shadow: 0 2rpx 8rpx rgba(40, 167, 69, 0.3);
}

.food-grid {
	display: flex;
	flex-wrap: wrap;
	margin: 0 -15rpx;
	width: 100%;
	box-sizing: border-box;
}

.food-item {
	width: calc(50% - 30rpx);
	margin: 15rpx;
	background-color: #ffffff;
	border-radius: 12rpx;
	overflow: hidden;
	position: relative;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
	border: 1rpx solid #f1f3f4;
	transition: all 0.3s ease;
	flex-shrink: 0;
	box-sizing: border-box;
}

.food-item:active {
	transform: translateY(-2rpx);
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.12);
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
	flex-shrink: 0;
}

/* 菜品详情弹窗样式 */
.food-detail-popup-container {
	background-color: #ffffff;
	border-top-left-radius: 30rpx;
	border-top-right-radius: 30rpx;
	padding-bottom: constant(safe-area-inset-bottom);
	padding-bottom: env(safe-area-inset-bottom);
	position: relative;
	overflow: hidden;
}

.popup-food-image {
	width: 100%;
	height: 450rpx;
}

.popup-close-btn {
	position: absolute;
	top: 30rpx;
	right: 30rpx;
	width: 60rpx;
	height: 60rpx;
	background-color: rgba(255, 255, 255, 0.8);
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	backdrop-filter: blur(5px);
}

.popup-food-content {
	padding: 30rpx;
}

.popup-food-name {
	font-size: 40rpx;
	font-weight: bold;
	margin-bottom: 20rpx;
	display: block;
}

.popup-tags {
	margin-bottom: 20rpx;
}

.popup-food-sales {
	font-size: 24rpx;
	color: #999;
	margin-bottom: 30rpx;
	display: block;
}

.popup-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 20rpx;
}

.popup-food-price {
	font-size: 44rpx;
	color: #ff3b30;
	font-weight: bold;
}

.popup-add-to-cart-btn {
	background-color: #007AFF;
	color: #ffffff;
	border: none;
	border-radius: 50rpx;
	padding: 0 50rpx;
	height: 80rpx;
	line-height: 80rpx;
	font-size: 28rpx;
	font-weight: bold;
	box-shadow: 0 6rpx 15rpx rgba(0, 122, 255, 0.4);
}

/* 用餐类型选择弹窗样式 */
.dining-type-popup-container {
	background-color: #ffffff;
	border-top-left-radius: 30rpx;
	border-top-right-radius: 30rpx;
	padding: 30rpx;
	padding-bottom: calc(40rpx + constant(safe-area-inset-bottom));
	padding-bottom: calc(40rpx + env(safe-area-inset-bottom));
}

.dining-options {
	margin-top: 30rpx;
}

.dining-option {
	display: flex;
	align-items: center;
	padding: 30rpx 0;
	border-bottom: 1rpx solid #f5f5f5;
}

.dining-option:last-child {
	border-bottom: none;
}

.option-icon {
	font-size: 40rpx;
	margin-right: 20rpx;
}

.option-content {
	flex-grow: 1;
}

.option-title {
	font-size: 32rpx;
	font-weight: bold;
	margin-bottom: 8rpx;
	display: block;
}

.option-desc {
	font-size: 24rpx;
	color: #666;
}

/* 外卖地址弹窗样式 */
.delivery-address-popup-container {
	background-color: #ffffff;
	border-top-left-radius: 30rpx;
	border-top-right-radius: 30rpx;
	padding: 30rpx;
	padding-bottom: calc(40rpx + constant(safe-area-inset-bottom));
	padding-bottom: calc(40rpx + env(safe-area-inset-bottom));
	max-height: 80vh;
}

.form-content {
	margin-top: 30rpx;
}

.form-item {
	margin-bottom: 30rpx;
}

.form-label {
	font-size: 28rpx;
	font-weight: bold;
	margin-bottom: 15rpx;
	display: block;
	color: #333;
}

.form-input {
	width: 100%;
	height: 80rpx;
	border: 2rpx solid #e5e5e5;
	border-radius: 10rpx;
	padding: 0 20rpx;
	font-size: 28rpx;
	box-sizing: border-box;
}

.form-textarea {
	width: 100%;
	height: 120rpx;
	border: 2rpx solid #e5e5e5;
	border-radius: 10rpx;
	padding: 20rpx;
	font-size: 28rpx;
	box-sizing: border-box;
	resize: none;
}

.popup-footer {
	margin-top: 40rpx;
}

.confirm-btn {
	width: 100%;
	height: 80rpx;
	background-color: #007AFF;
	color: #ffffff;
	border: none;
	border-radius: 10rpx;
	font-size: 32rpx;
	font-weight: bold;
}
</style> 
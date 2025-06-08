<template>
	<view class="food-page">
		<view class="header">
			<view class="header-title">
				<text class="main-title">食堂点餐</text>
				<text class="sub-title">便捷订餐，无需排队</text>
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
		
		<view class="cart-bar" v-if="cartTotal > 0">
			<view class="cart-info">
				<view class="cart-icon">
					<image src="/static/images/cart.png" mode="aspectFit"></image>
					<view class="cart-badge">{{cartCount}}</view>
				</view>
				<view class="cart-price">
					<text>¥{{cartTotal.toFixed(2)}}</text>
				</view>
			</view>
			<button class="checkout-button" @tap="checkout">去结算</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			selectedCanteen: 0,
			selectedFilter: 0,
			cartCount: 0,
			cartTotal: 0,
			canteens: [
				{ name: '第一食堂', status: 'medium' },
				{ name: '第二食堂', status: 'low' },
				{ name: '第三食堂', status: 'high' },
				{ name: '第四食堂', status: 'medium' },
				{ name: '教工食堂', status: 'low' }
			],
			filters: ['全部', '特价', '热销', '套餐', '素食'],
			foodItems: [
				{
					id: 1,
					name: '红烧排骨',
					price: 15.00,
					monthlySales: 320,
					image: '/static/images/food1.png',
					tags: ['特价', '热销'],
					category: '荤菜'
				},
				{
					id: 2,
					name: '麻婆豆腐',
					price: 10.00,
					monthlySales: 280,
					image: '/static/images/food2.png',
					tags: ['素食'],
					category: '素菜'
				},
				{
					id: 3,
					name: '宫保鸡丁',
					price: 14.00,
					monthlySales: 250,
					image: '/static/images/food3.png',
					tags: ['热销'],
					category: '荤菜'
				},
				{
					id: 4,
					name: '西红柿鸡蛋',
					price: 8.00,
					monthlySales: 210,
					image: '/static/images/food4.png',
					tags: ['素食'],
					category: '素菜'
				},
				{
					id: 5,
					name: '酸菜鱼套餐',
					price: 22.00,
					monthlySales: 180,
					image: '/static/images/food5.png',
					tags: ['套餐', '热销'],
					category: '套餐'
				},
				{
					id: 6,
					name: '青椒土豆丝',
					price: 7.00,
					monthlySales: 150,
					image: '/static/images/food6.png',
					tags: ['素食', '特价'],
					category: '素菜'
				}
			]
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
		}
	},
	methods: {
		selectCanteen(index) {
			this.selectedCanteen = index;
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
			this.cartCount++;
			this.cartTotal += item.price;
			
			uni.showToast({
				title: '已加入购物车',
				icon: 'success'
			});
		},
		checkout() {
			uni.showToast({
				title: '结算中...',
				icon: 'loading'
			});
			
			setTimeout(() => {
				uni.showToast({
					title: '订单已提交',
					icon: 'success'
				});
				
				this.cartCount = 0;
				this.cartTotal = 0;
			}, 1500);
		}
	}
}
</script>

<style>
.food-page {
	min-height: 100vh;
	background-color: #f5f5f5;
	padding-bottom: 120rpx;
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
}

.status-indicator.low {
	background-color: #4cd964;
}

.status-indicator.medium {
	background-color: #ffcc00;
}

.status-indicator.high {
	background-color: #ff3b30;
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
}

.cart-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 100rpx;
	background-color: #ffffff;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 30rpx;
	box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.1);
}

.cart-info {
	display: flex;
	align-items: center;
}

.cart-icon {
	position: relative;
	margin-right: 20rpx;
}

.cart-icon image {
	width: 60rpx;
	height: 60rpx;
}

.cart-badge {
	position: absolute;
	top: -10rpx;
	right: -10rpx;
	background-color: #ff3b30;
	color: #ffffff;
	border-radius: 20rpx;
	min-width: 40rpx;
	height: 40rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 24rpx;
}

.cart-price {
	font-size: 32rpx;
	color: #ff3b30;
	font-weight: bold;
}

.checkout-button {
	background-color: #007AFF;
	color: #ffffff;
	border-radius: 50rpx;
	font-size: 28rpx;
	padding: 10rpx 40rpx;
	border: none;
}
</style> 
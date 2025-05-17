<template>
	<view class="laundry-page">
		<!-- 顶部状态卡片 -->
		<view class="status-card">
			<view class="status-header">
				<text class="location-name">图书馆一楼洗衣房</text>
				<view class="distance-info">
					<uni-icons type="location" size="14" color="#666"></uni-icons>
					<text>50m</text>
				</view>
			</view>
			<view class="status-grid">
				<view class="status-item">
					<text class="status-number available">12</text>
					<text class="status-label">空闲机器</text>
				</view>
				<view class="status-item">
					<text class="status-number busy">8</text>
					<text class="status-label">使用中</text>
				</view>
				<view class="status-item">
					<text class="status-number">5</text>
					<text class="status-label">分钟等待</text>
				</view>
				<view class="status-item">
					<text class="status-number">￥3</text>
					<text class="status-label">起步价</text>
				</view>
			</view>
		</view>

		<!-- 智能推荐 -->
		<view class="recommendation-section" v-if="recommendedMachine">
			<view class="section-header">
				<text class="section-title">智能推荐</text>
				<text class="refresh-text" @tap="refreshRecommendation">
					<uni-icons type="refresh" size="14" color="#666"></uni-icons>
					刷新推荐
				</text>
			</view>
			<view class="recommendation-card">
				<view class="machine-info">
					<image src="/static/images/washer-large.png" mode="aspectFit" class="machine-image"></image>
					<view class="machine-details">
						<text class="machine-name">{{recommendedMachine.name}}</text>
						<text class="machine-location">{{recommendedMachine.location}}</text>
						<view class="machine-features">
							<text class="feature-tag" v-for="(feature, index) in recommendedMachine.features" :key="index">{{feature}}</text>
						</view>
					</view>
				</view>
				<view class="booking-info">
					<view class="price-info">
						<text class="price-amount">￥{{recommendedMachine.price}}</text>
						<text class="price-unit">/次</text>
					</view>
					<button class="book-btn" @tap="bookMachine(recommendedMachine)">立即预约</button>
				</view>
			</view>
		</view>

		<!-- 所有洗衣机列表 -->
		<view class="machines-section">
			<view class="section-header">
				<text class="section-title">全部洗衣机</text>
				<view class="filter-options">
					<text :class="['filter-option', currentFilter === 'all' ? 'active' : '']" @tap="setFilter('all')">全部</text>
					<text :class="['filter-option', currentFilter === 'available' ? 'active' : '']" @tap="setFilter('available')">空闲</text>
					<text :class="['filter-option', currentFilter === 'busy' ? 'active' : '']" @tap="setFilter('busy')">使用中</text>
				</view>
			</view>
			
			<view class="machines-list">
				<view class="machine-item" v-for="(machine, index) in filteredMachines" :key="index">
					<view class="machine-header">
						<view class="machine-basic">
							<image :src="machine.image" mode="aspectFit" class="machine-icon"></image>
							<view class="machine-info">
								<text class="machine-name">{{machine.name}}</text>
								<text class="machine-type">{{machine.type}}</text>
							</view>
						</view>
						<text :class="['machine-status', machine.statusClass]">{{machine.status}}</text>
					</view>
					<view class="machine-body">
						<view class="machine-details">
							<view class="detail-item">
								<uni-icons type="location" size="14" color="#666"></uni-icons>
								<text>{{machine.location}}</text>
							</view>
							<view class="detail-item" v-if="machine.remainingTime">
								<uni-icons type="timer" size="14" color="#666"></uni-icons>
								<text>剩余{{machine.remainingTime}}分钟</text>
							</view>
							<view class="detail-item">
								<uni-icons type="medal" size="14" color="#666"></uni-icons>
								<text>{{machine.rating}}分</text>
							</view>
						</view>
						<view class="machine-price">
							<text class="price-amount">￥{{machine.price}}</text>
							<text class="price-unit">/次</text>
						</view>
					</view>
					<view class="machine-footer">
						<view class="feature-tags">
							<text class="feature-tag" v-for="(feature, fIndex) in machine.features" :key="fIndex">{{feature}}</text>
						</view>
						<button class="action-btn" 
							:class="machine.status === '空闲' ? 'available' : 'busy'"
							@tap="machine.status === '空闲' ? bookMachine(machine) : null">
							{{machine.status === '空闲' ? '立即预约' : '查看详情'}}
						</button>
					</view>
				</view>
			</view>
		</view>

		<!-- 预约确认弹窗 -->
		<view class="booking-popup" v-if="showBookingPopup">
			<view class="popup-mask" @tap="cancelBooking"></view>
			<view class="popup-content">
				<view class="popup-header">
					<text class="popup-title">预约确认</text>
					<view class="popup-close" @tap="cancelBooking">
						<uni-icons type="closeempty" size="20" color="#999"></uni-icons>
					</view>
				</view>
				<view class="popup-body">
					<view class="selected-machine">
						<image :src="selectedMachine.image" mode="aspectFit" class="machine-icon"></image>
						<view class="machine-info">
							<text class="machine-name">{{selectedMachine.name}}</text>
							<text class="machine-location">{{selectedMachine.location}}</text>
						</view>
					</view>
					<view class="booking-details">
						<view class="detail-row">
							<text class="detail-label">洗衣模式</text>
							<view class="mode-options">
								<text 
									v-for="(mode, index) in washingModes" 
									:key="index"
									:class="['mode-option', selectedMode === mode.id ? 'active' : '']"
									@tap="selectMode(mode.id)">
									{{mode.name}}
								</text>
							</view>
						</view>
						<view class="detail-row">
							<text class="detail-label">预计费用</text>
							<view class="price-detail">
								<text class="price-amount">￥{{calculatePrice()}}</text>
								<text class="price-unit">/次</text>
							</view>
						</view>
						<view class="detail-row">
							<text class="detail-label">支付方式</text>
							<view class="payment-options">
								<view 
									v-for="(method, index) in paymentMethods" 
									:key="index"
									:class="['payment-option', selectedPayment === method.id ? 'active' : '']"
									@tap="selectPayment(method.id)">
									<image :src="method.icon" mode="aspectFit" class="payment-icon"></image>
									<text>{{method.name}}</text>
								</view>
							</view>
						</view>
					</view>
					<view class="notification-settings">
						<text class="settings-title">完成提醒</text>
						<view class="notification-options">
							<checkbox-group @change="updateNotifications">
								<label class="notification-option">
									<checkbox value="sms" checked />
									<text>短信提醒</text>
								</label>
								<label class="notification-option">
									<checkbox value="wechat" checked />
									<text>微信提醒</text>
								</label>
							</view>
						</view>
					</view>
				</view>
				<view class="popup-footer">
					<button class="cancel-btn" @tap="cancelBooking">取消</button>
					<button class="confirm-btn" @tap="confirmBooking">确认预约</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			currentFilter: 'all',
			showBookingPopup: false,
			selectedMachine: null,
			selectedMode: 'normal',
			selectedPayment: 'wechat',
			notifications: ['sms', 'wechat'],
			
			recommendedMachine: {
				id: 'W001',
				name: '洗衣机 W001',
				location: '图书馆一楼 A区',
				image: '/static/images/washer-large.png',
				features: ['智能杀菌', '大容量', '省电模式'],
				price: 3,
				status: '空闲',
				rating: 4.8
			},
			
			washingModes: [
				{ id: 'quick', name: '快速洗', price: 3 },
				{ id: 'normal', name: '标准洗', price: 4 },
				{ id: 'heavy', name: '大件洗', price: 5 }
			],
			
			paymentMethods: [
				{ id: 'wechat', name: '微信支付', icon: '/static/images/wechat-pay.png' },
				{ id: 'alipay', name: '支付宝', icon: '/static/images/alipay.png' },
				{ id: 'campus', name: '校园卡', icon: '/static/images/campus-card.png' }
			],
			
			machines: [
				{
					id: 'W001',
					name: '洗衣机 W001',
					type: '海尔智能洗衣机',
					location: '图书馆一楼 A区',
					status: '空闲',
					statusClass: 'status-available',
					image: '/static/images/washer-icon.png',
					features: ['智能杀菌', '大容量', '省电模式'],
					price: 3,
					rating: 4.8
				},
				{
					id: 'W002',
					name: '洗衣机 W002',
					type: '海尔智能洗衣机',
					location: '图书馆一楼 A区',
					status: '使用中',
					statusClass: 'status-busy',
					remainingTime: 15,
					image: '/static/images/washer-icon.png',
					features: ['智能杀菌', '大容量'],
					price: 3,
					rating: 4.6
				},
				// 更多洗衣机数据...
			]
		}
	},
	computed: {
		filteredMachines() {
			if (this.currentFilter === 'all') return this.machines;
			return this.machines.filter(machine => {
				if (this.currentFilter === 'available') return machine.status === '空闲';
				if (this.currentFilter === 'busy') return machine.status === '使用中';
			});
		}
	},
	methods: {
		setFilter(filter) {
			this.currentFilter = filter;
		},
		refreshRecommendation() {
			uni.showToast({
				title: '推荐已更新',
				icon: 'success'
			});
		},
		bookMachine(machine) {
			this.selectedMachine = machine;
			this.showBookingPopup = true;
		},
		cancelBooking() {
			this.showBookingPopup = false;
			this.selectedMachine = null;
			this.selectedMode = 'normal';
			this.selectedPayment = 'wechat';
		},
		selectMode(modeId) {
			this.selectedMode = modeId;
		},
		selectPayment(paymentId) {
			this.selectedPayment = paymentId;
		},
		updateNotifications(e) {
			this.notifications = e.detail.value;
		},
		calculatePrice() {
			const mode = this.washingModes.find(m => m.id === this.selectedMode);
			return mode ? mode.price : 3;
		},
		confirmBooking() {
			uni.showLoading({
				title: '预约中...'
			});
			
			// 模拟预约请求
			setTimeout(() => {
				uni.hideLoading();
				uni.showToast({
					title: '预约成功',
					icon: 'success'
				});
				this.showBookingPopup = false;
				
				// 模拟发送通知
				if (this.notifications.includes('sms')) {
					console.log('发送短信通知');
				}
				if (this.notifications.includes('wechat')) {
					console.log('发送微信通知');
				}
			}, 1500);
		}
	}
}
</script>

<style>
.laundry-page {
	min-height: 100vh;
	background-color: #f5f5f5;
	padding: 30rpx;
}

/* 状态卡片样式 */
.status-card {
	background: linear-gradient(135deg, #007AFF, #00B578);
	border-radius: 20rpx;
	padding: 30rpx;
	color: #FFFFFF;
	margin-bottom: 30rpx;
}

.status-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.location-name {
	font-size: 32rpx;
	font-weight: bold;
}

.distance-info {
	display: flex;
	align-items: center;
	font-size: 24rpx;
}

.distance-info text {
	margin-left: 8rpx;
}

.status-grid {
	display: flex;
	justify-content: space-between;
}

.status-item {
	text-align: center;
}

.status-number {
	font-size: 36rpx;
	font-weight: bold;
	display: block;
	margin-bottom: 8rpx;
}

.status-number.available {
	color: #00B578;
}

.status-number.busy {
	color: #FF9500;
}

.status-label {
	font-size: 24rpx;
	color: rgba(255, 255, 255, 0.8);
}

/* 推荐区域样式 */
.recommendation-section {
	background-color: #FFFFFF;
	border-radius: 20rpx;
	padding: 30rpx;
	margin-bottom: 30rpx;
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.refresh-text {
	font-size: 26rpx;
	color: #666;
	display: flex;
	align-items: center;
}

.refresh-text uni-icons {
	margin-right: 8rpx;
}

.recommendation-card {
	background-color: #f9f9f9;
	border-radius: 16rpx;
	padding: 20rpx;
}

.machine-info {
	display: flex;
	margin-bottom: 20rpx;
}

.machine-image {
	width: 160rpx;
	height: 160rpx;
	margin-right: 20rpx;
}

.machine-details {
	flex: 1;
}

.machine-name {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 8rpx;
}

.machine-location {
	font-size: 26rpx;
	color: #666;
	margin-bottom: 16rpx;
}

.machine-features {
	display: flex;
	flex-wrap: wrap;
}

.feature-tag {
	font-size: 24rpx;
	color: #007AFF;
	background-color: rgba(0, 122, 255, 0.1);
	padding: 4rpx 16rpx;
	border-radius: 20rpx;
	margin-right: 12rpx;
	margin-bottom: 8rpx;
}

.booking-info {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.price-info {
	display: flex;
	align-items: baseline;
}

.price-amount {
	font-size: 36rpx;
	font-weight: bold;
	color: #FF3B30;
}

.price-unit {
	font-size: 24rpx;
	color: #999;
	margin-left: 4rpx;
}

.book-btn {
	background-color: #007AFF;
	color: #FFFFFF;
	font-size: 28rpx;
	padding: 16rpx 40rpx;
	border-radius: 30rpx;
}

/* 洗衣机列表样式 */
.machines-section {
	background-color: #FFFFFF;
	border-radius: 20rpx;
	padding: 30rpx;
}

.filter-options {
	display: flex;
	gap: 20rpx;
}

.filter-option {
	font-size: 26rpx;
	color: #666;
	padding: 8rpx 24rpx;
	border-radius: 20rpx;
	background-color: #f5f5f5;
}

.filter-option.active {
	color: #007AFF;
	background-color: rgba(0, 122, 255, 0.1);
}

.machines-list {
	margin-top: 20rpx;
}

.machine-item {
	background-color: #f9f9f9;
	border-radius: 16rpx;
	padding: 20rpx;
	margin-bottom: 20rpx;
}

.machine-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16rpx;
}

.machine-basic {
	display: flex;
	align-items: center;
}

.machine-icon {
	width: 80rpx;
	height: 80rpx;
	margin-right: 16rpx;
}

.machine-type {
	font-size: 24rpx;
	color: #666;
}

.machine-status {
	font-size: 24rpx;
	padding: 4rpx 16rpx;
	border-radius: 20rpx;
}

.status-available {
	background-color: #e6fff2;
	color: #00B578;
}

.status-busy {
	background-color: #fff2e6;
	color: #FF9500;
}

.machine-body {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16rpx;
}

.machine-details {
	flex: 1;
}

.detail-item {
	display: flex;
	align-items: center;
	font-size: 24rpx;
	color: #666;
	margin-bottom: 8rpx;
}

.detail-item uni-icons {
	margin-right: 8rpx;
}

.machine-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.feature-tags {
	flex: 1;
	display: flex;
	flex-wrap: wrap;
	gap: 8rpx;
}

.action-btn {
	font-size: 26rpx;
	padding: 12rpx 32rpx;
	border-radius: 30rpx;
	margin-left: 16rpx;
}

.action-btn.available {
	background-color: #007AFF;
	color: #FFFFFF;
}

.action-btn.busy {
	background-color: #f5f5f5;
	color: #666;
}

/* 预约弹窗样式 */
.booking-popup {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 999;
}

.popup-mask {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
}

.popup-content {
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #FFFFFF;
	border-radius: 30rpx 30rpx 0 0;
	padding: 30rpx;
}

.popup-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 30rpx;
}

.popup-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.selected-machine {
	display: flex;
	align-items: center;
	padding: 20rpx;
	background-color: #f9f9f9;
	border-radius: 16rpx;
	margin-bottom: 30rpx;
}

.booking-details {
	margin-bottom: 30rpx;
}

.detail-row {
	margin-bottom: 20rpx;
}

.detail-label {
	font-size: 28rpx;
	color: #333;
	margin-bottom: 12rpx;
	display: block;
}

.mode-options {
	display: flex;
	gap: 16rpx;
}

.mode-option {
	flex: 1;
	text-align: center;
	font-size: 26rpx;
	padding: 16rpx;
	background-color: #f5f5f5;
	border-radius: 12rpx;
	color: #666;
}

.mode-option.active {
	background-color: #007AFF;
	color: #FFFFFF;
}

.payment-options {
	display: flex;
	gap: 16rpx;
}

.payment-option {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 16rpx;
	background-color: #f5f5f5;
	border-radius: 12rpx;
}

.payment-option.active {
	background-color: rgba(0, 122, 255, 0.1);
}

.payment-icon {
	width: 48rpx;
	height: 48rpx;
	margin-bottom: 8rpx;
}

.payment-option text {
	font-size: 24rpx;
	color: #666;
}

.notification-settings {
	margin-bottom: 30rpx;
}

.settings-title {
	font-size: 28rpx;
	color: #333;
	margin-bottom: 16rpx;
	display: block;
}

.notification-options {
	display: flex;
	gap: 30rpx;
}

.notification-option {
	display: flex;
	align-items: center;
	font-size: 26rpx;
	color: #666;
}

.notification-option checkbox {
	margin-right: 8rpx;
}

.popup-footer {
	display: flex;
	gap: 20rpx;
}

.popup-footer button {
	flex: 1;
	height: 88rpx;
	line-height: 88rpx;
	font-size: 28rpx;
	border-radius: 44rpx;
}

.cancel-btn {
	background-color: #f5f5f5;
	color: #666;
}

.confirm-btn {
	background-color: #007AFF;
	color: #FFFFFF;
}
</style> 
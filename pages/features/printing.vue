<template>
	<view class="printing-page">
		<!-- 顶部状态卡片 -->
		<view class="status-card">
			<view class="status-header">
				<text class="location-name">图书馆一楼打印区</text>
				<view class="distance-info">
					<uni-icons type="location" size="14" color="#666"></uni-icons>
					<text>30m</text>
				</view>
			</view>
			<view class="status-grid">
				<view class="status-item">
					<text class="status-number available">8</text>
					<text class="status-label">空闲打印机</text>
				</view>
				<view class="status-item">
					<text class="status-number busy">2</text>
					<text class="status-label">使用中</text>
				</view>
				<view class="status-item">
					<text class="status-number">2</text>
					<text class="status-label">分钟等待</text>
				</view>
				<view class="status-item">
					<text class="status-number">￥0.2</text>
					<text class="status-label">每张</text>
				</view>
			</view>
		</view>

		<!-- 快速打印 -->
		<view class="quick-print">
			<view class="section-header">
				<text class="section-title">快速打印</text>
				<text class="upload-history" @tap="viewHistory">上传历史</text>
			</view>
			<view class="upload-area" @tap="uploadFile">
				<image src="/static/images/upload.png" mode="aspectFit" class="upload-icon"></image>
				<text class="upload-text">点击上传文件或将文件拖拽至此处</text>
				<text class="upload-desc">支持 PDF、Word、PPT、Excel 等格式</text>
			</view>
		</view>

		<!-- 打印机列表 -->
		<view class="printers-section">
			<view class="section-header">
				<text class="section-title">打印机列表</text>
				<view class="filter-options">
					<text :class="['filter-option', currentFilter === 'all' ? 'active' : '']" @tap="setFilter('all')">全部</text>
					<text :class="['filter-option', currentFilter === 'available' ? 'active' : '']" @tap="setFilter('available')">空闲</text>
					<text :class="['filter-option', currentFilter === 'color' ? 'active' : '']" @tap="setFilter('color')">彩色</text>
				</view>
			</view>

			<view class="printers-list">
				<view class="printer-item" v-for="(printer, index) in filteredPrinters" :key="index">
					<view class="printer-header">
						<view class="printer-basic">
							<image :src="printer.image" mode="aspectFit" class="printer-icon"></image>
							<view class="printer-info">
								<text class="printer-name">{{printer.name}}</text>
								<text class="printer-type">{{printer.type}}</text>
							</view>
						</view>
						<text :class="['printer-status', printer.statusClass]">{{printer.status}}</text>
					</view>
					<view class="printer-body">
						<view class="printer-details">
							<view class="detail-item">
								<uni-icons type="location" size="14" color="#666"></uni-icons>
								<text>{{printer.location}}</text>
							</view>
							<view class="detail-item">
								<uni-icons type="paperplane" size="14" color="#666"></uni-icons>
								<text>{{printer.speed}}页/分钟</text>
							</view>
							<view class="detail-item">
								<uni-icons type="medal" size="14" color="#666"></uni-icons>
								<text>{{printer.rating}}分</text>
							</view>
						</view>
						<view class="printer-price">
							<text class="price-amount">￥{{printer.price}}</text>
							<text class="price-unit">/张</text>
						</view>
					</view>
					<view class="printer-features">
						<text class="feature-tag" v-for="(feature, fIndex) in printer.features" :key="fIndex">{{feature}}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 打印设置弹窗 -->
		<view class="print-popup" v-if="showPrintPopup">
			<view class="popup-mask" @tap="cancelPrint"></view>
			<view class="popup-content">
				<view class="popup-header">
					<text class="popup-title">打印设置</text>
					<view class="popup-close" @tap="cancelPrint">
						<uni-icons type="closeempty" size="20" color="#999"></uni-icons>
					</view>
				</view>
				<view class="popup-body">
					<view class="file-info">
						<image src="/static/images/file-icon.png" mode="aspectFit" class="file-icon"></image>
						<view class="file-details">
							<text class="file-name">{{currentFile.name}}</text>
							<text class="file-size">{{currentFile.size}}</text>
						</view>
					</view>
					<view class="print-settings">
						<view class="setting-row">
							<text class="setting-label">打印份数</text>
							<view class="copies-control">
								<button class="control-btn" @tap="decreaseCopies">-</button>
								<input type="number" v-model="copies" class="copies-input" />
								<button class="control-btn" @tap="increaseCopies">+</button>
							</view>
						</view>
						<view class="setting-row">
							<text class="setting-label">打印颜色</text>
							<view class="color-options">
								<text 
									v-for="(option, index) in colorOptions" 
									:key="index"
									:class="['color-option', selectedColor === option.id ? 'active' : '']"
									@tap="selectColor(option.id)">
									{{option.name}}
								</text>
							</view>
						</view>
						<view class="setting-row">
							<text class="setting-label">双面打印</text>
							<switch :checked="doubleSided" @change="toggleDoubleSided" color="#007AFF" />
						</view>
						<view class="setting-row">
							<text class="setting-label">页面范围</text>
							<input type="text" v-model="pageRange" placeholder="如: 1-5,8,11-13" class="page-input" />
						</view>
						<view class="setting-row">
							<text class="setting-label">打印机选择</text>
							<view class="printer-selection">
								<text>推荐打印机：{{recommendedPrinter.name}}</text>
								<text class="change-printer" @tap="showPrinterList">更换</text>
							</view>
						</view>
					</view>
					<view class="price-summary">
						<view class="price-row">
							<text>单价</text>
							<text>￥{{unitPrice}}/张</text>
						</view>
						<view class="price-row">
							<text>份数</text>
							<text>{{copies}}份</text>
						</view>
						<view class="price-row">
							<text>页数</text>
							<text>{{pageCount}}页</text>
						</view>
						<view class="price-row total">
							<text>预计总价</text>
							<text class="total-price">￥{{calculateTotal()}}</text>
						</view>
					</view>
				</view>
				<view class="popup-footer">
					<button class="cancel-btn" @tap="cancelPrint">取消</button>
					<button class="confirm-btn" @tap="confirmPrint">确认打印</button>
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
			showPrintPopup: false,
			currentFile: null,
			copies: 1,
			selectedColor: 'black',
			doubleSided: false,
			pageRange: '',
			pageCount: 0,
			unitPrice: 0.2,
			
			colorOptions: [
				{ id: 'black', name: '黑白' },
				{ id: 'color', name: '彩色' }
			],
			
			recommendedPrinter: {
				id: 'P001',
				name: '打印机 P001',
				type: '惠普激光打印机',
				location: '图书馆一楼',
				status: '空闲',
				image: '/static/images/printer-icon.png'
			},
			
			printers: [
				{
					id: 'P001',
					name: '打印机 P001',
					type: '惠普激光打印机',
					location: '图书馆一楼',
					status: '空闲',
					statusClass: 'status-available',
					speed: 30,
					image: '/static/images/printer-icon.png',
					features: ['双面打印', '黑白', '彩色'],
					price: 0.2,
					rating: 4.8
				},
				{
					id: 'P002',
					name: '打印机 P002',
					type: '惠普激光打印机',
					location: '图书馆一楼',
					status: '使用中',
					statusClass: 'status-busy',
					speed: 30,
					image: '/static/images/printer-icon.png',
					features: ['双面打印', '黑白'],
					price: 0.2,
					rating: 4.6
				},
				// 更多打印机数据...
			]
		}
	},
	computed: {
		filteredPrinters() {
			if (this.currentFilter === 'all') return this.printers;
			return this.printers.filter(printer => {
				if (this.currentFilter === 'available') return printer.status === '空闲';
				if (this.currentFilter === 'color') return printer.features.includes('彩色');
			});
		}
	},
	methods: {
		setFilter(filter) {
			this.currentFilter = filter;
		},
		uploadFile() {
			// 模拟文件上传
			this.currentFile = {
				name: '课程作业.pdf',
				size: '2.5MB',
				pages: 10
			};
			this.pageCount = this.currentFile.pages;
			this.showPrintPopup = true;
		},
		viewHistory() {
			uni.showToast({
				title: '查看历史记录',
				icon: 'none'
			});
		},
		decreaseCopies() {
			if (this.copies > 1) {
				this.copies--;
			}
		},
		increaseCopies() {
			this.copies++;
		},
		selectColor(colorId) {
			this.selectedColor = colorId;
			this.unitPrice = colorId === 'color' ? 0.5 : 0.2;
		},
		toggleDoubleSided(e) {
			this.doubleSided = e.detail.value;
		},
		showPrinterList() {
			uni.showToast({
				title: '选择打印机',
				icon: 'none'
			});
		},
		calculateTotal() {
			return (this.unitPrice * this.pageCount * this.copies).toFixed(2);
		},
		cancelPrint() {
			this.showPrintPopup = false;
			this.currentFile = null;
			this.copies = 1;
			this.selectedColor = 'black';
			this.doubleSided = false;
			this.pageRange = '';
		},
		confirmPrint() {
			uni.showLoading({
				title: '正在打印...'
			});
			
			// 模拟打印请求
			setTimeout(() => {
				uni.hideLoading();
				uni.showToast({
					title: '打印任务已提交',
					icon: 'success'
				});
				this.showPrintPopup = false;
				
				// 模拟推送打印完成通知
				setTimeout(() => {
					uni.showModal({
						title: '打印完成通知',
						content: '您的文件已打印完成，请前往图书馆一楼取件处领取。预计取件时间3分钟。',
						showCancel: false,
						confirmText: '我知道了'
					});
				}, 3000);
			}, 1500);
		}
	}
}
</script>

<style>
.printing-page {
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

/* 快速打印区域样式 */
.quick-print {
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

.upload-history {
	font-size: 26rpx;
	color: #007AFF;
}

.upload-area {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 300rpx;
	background-color: #f9f9f9;
	border: 2rpx dashed #ddd;
	border-radius: 16rpx;
}

.upload-icon {
	width: 80rpx;
	height: 80rpx;
	margin-bottom: 20rpx;
}

.upload-text {
	font-size: 28rpx;
	color: #333;
	margin-bottom: 8rpx;
}

.upload-desc {
	font-size: 24rpx;
	color: #999;
}

/* 打印机列表样式 */
.printers-section {
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

.printer-item {
	background-color: #f9f9f9;
	border-radius: 16rpx;
	padding: 20rpx;
	margin-bottom: 20rpx;
}

.printer-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16rpx;
}

.printer-basic {
	display: flex;
	align-items: center;
}

.printer-icon {
	width: 80rpx;
	height: 80rpx;
	margin-right: 16rpx;
}

.printer-info {
	display: flex;
	flex-direction: column;
}

.printer-name {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
}

.printer-type {
	font-size: 24rpx;
	color: #666;
}

.printer-status {
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

.printer-body {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16rpx;
}

.printer-details {
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

.printer-price {
	display: flex;
	align-items: baseline;
}

.price-amount {
	font-size: 32rpx;
	font-weight: bold;
	color: #FF3B30;
}

.price-unit {
	font-size: 24rpx;
	color: #999;
	margin-left: 4rpx;
}

.printer-features {
	display: flex;
	flex-wrap: wrap;
	gap: 8rpx;
}

.feature-tag {
	font-size: 24rpx;
	color: #007AFF;
	background-color: rgba(0, 122, 255, 0.1);
	padding: 4rpx 16rpx;
	border-radius: 20rpx;
}

/* 打印设置弹窗样式 */
.print-popup {
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

.file-info {
	display: flex;
	align-items: center;
	padding: 20rpx;
	background-color: #f9f9f9;
	border-radius: 16rpx;
	margin-bottom: 30rpx;
}

.file-icon {
	width: 80rpx;
	height: 80rpx;
	margin-right: 16rpx;
}

.file-details {
	display: flex;
	flex-direction: column;
}

.file-name {
	font-size: 28rpx;
	color: #333;
	margin-bottom: 4rpx;
}

.file-size {
	font-size: 24rpx;
	color: #999;
}

.print-settings {
	margin-bottom: 30rpx;
}

.setting-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.setting-label {
	font-size: 28rpx;
	color: #333;
}

.copies-control {
	display: flex;
	align-items: center;
}

.control-btn {
	width: 60rpx;
	height: 60rpx;
	line-height: 60rpx;
	text-align: center;
	background-color: #f5f5f5;
	border-radius: 30rpx;
	font-size: 28rpx;
	color: #333;
}

.copies-input {
	width: 80rpx;
	text-align: center;
	margin: 0 16rpx;
}

.color-options {
	display: flex;
	gap: 16rpx;
}

.color-option {
	padding: 8rpx 24rpx;
	border-radius: 20rpx;
	font-size: 26rpx;
	background-color: #f5f5f5;
	color: #666;
}

.color-option.active {
	background-color: #007AFF;
	color: #FFFFFF;
}

.page-input {
	width: 300rpx;
	height: 60rpx;
	background-color: #f5f5f5;
	border-radius: 30rpx;
	padding: 0 20rpx;
	font-size: 26rpx;
}

.printer-selection {
	display: flex;
	align-items: center;
	font-size: 26rpx;
	color: #666;
}

.change-printer {
	color: #007AFF;
	margin-left: 16rpx;
}

.price-summary {
	background-color: #f9f9f9;
	border-radius: 16rpx;
	padding: 20rpx;
	margin-bottom: 30rpx;
}

.price-row {
	display: flex;
	justify-content: space-between;
	font-size: 26rpx;
	color: #666;
	margin-bottom: 12rpx;
}

.price-row.total {
	margin-top: 16rpx;
	padding-top: 16rpx;
	border-top: 2rpx solid #eee;
	font-size: 28rpx;
	color: #333;
}

.total-price {
	color: #FF3B30;
	font-weight: bold;
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
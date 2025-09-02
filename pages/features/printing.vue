<template>
	<view class="printing-page">
		<!-- 顶部状态卡片 -->
		<view class="status-card">
			<view class="status-header">
				<text class="location-name">校园打印区</text>
				<view class="distance-info">
					<uni-icons type="location" size="14" color="#666"></uni-icons>
					<text>多地点</text>
				</view>
			</view>
			<view class="status-grid">
				<view class="status-item">
					<text class="status-number available">{{ availablePrinters.length }}</text>
					<text class="status-label">空闲打印机</text>
				</view>
				<view class="status-item">
					<text class="status-number busy">{{ busyPrinters.length }}</text>
					<text class="status-label">使用中</text>
				</view>
				<view class="status-item">
					<text class="status-number">~{{ estimatedWaitTime }}</text>
					<text class="status-label">分钟等待</text>
				</view>
				<view class="status-item">
					<text class="status-number">￥{{ startingPrice }}</text>
					<text class="status-label">每张</text>
				</view>
			</view>
		</view>

		<!-- 快速打印 -->
		<view class="quick-print">
			<view class="section-header">
				<text class="section-title">快速打印</text>
				<text class="upload-history" @tap="viewHistory">打印历史</text>
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
							<text class="price-amount">￥{{startingPrice}}</text>
							<text class="price-unit">/张起</text>
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
									:class="['color-option', selectedColor.number === option.number ? 'active' : '']"
									@tap="selectColor(option)">
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
								<text v-if="recommendedPrinter">推荐：{{recommendedPrinter.name}}</text>
								<text v-else>暂无推荐</text>
								<text class="change-printer" @tap="showPrinterList">更换</text>
							</view>
						</view>
					</view>
					<view class="price-summary">
						<view class="price-row">
							<text>单价</text>
							<text>￥{{unitPrice.toFixed(2)}}/张</text>
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
		
		<!-- 打印机选择弹窗 -->
		<view class="printer-selection-popup" v-if="showPrinterSelectionPopup">
			<view class="popup-mask" @tap="closePrinterSelection"></view>
			<view class="popup-content">
				<view class="popup-header">
					<text class="popup-title">选择打印机</text>
					<view class="popup-close" @tap="closePrinterSelection">
						<uni-icons type="closeempty" size="20" color="#999"></uni-icons>
					</view>
				</view>
				<scroll-view scroll-y class="printer-scroll-list">
					<view class="list-item" v-for="printer in availablePrinters" :key="printer.id" @tap="selectPrinter(printer)">
						<image src="/static/images/printer-icon.png" mode="aspectFit" class="list-item-icon"></image>
						<view class="list-item-info">
							<text class="list-item-name">{{ printer.name }}</text>
							<text class="list-item-location">{{ printer.location }}</text>
						</view>
						<view v-if="recommendedPrinter && recommendedPrinter.id === printer.id" class="list-item-check">
							 <uni-icons type="checkmarkempty" size="24" color="#007AFF"></uni-icons>
						</view>
					</view>
					<view v-if="availablePrinters.length === 0" class="empty-list-text">
						暂无其他空闲打印机
					</view>
				</scroll-view>
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
			showPrinterSelectionPopup: false, // 控制打印机选择弹窗
			currentFile: null,
			copies: 1,
			selectedColor: null, // 将存储整个价格对象
			doubleSided: false,
			pageRange: '',
			pageCount: 0,
			unitPrice: 0.0,
			
			colorOptions: [], // 从API获取
			recommendedPrinter: null,
			printers: [], // 从API获取
			busyPrinters: [],
			estimatedWaitTime: 0,
			startingPrice: 0.0,
			recommendedDeviceIdFromQuery: null,
		}
	},
	computed: {
		availablePrinters() {
			return this.printers.filter(p => p.status === '空闲');
		},
		filteredPrinters() {
			if (this.currentFilter === 'all') return this.printers;
			return this.printers.filter(printer => {
				if (this.currentFilter === 'available') return printer.status === '空闲';
				if (this.currentFilter === 'color') return printer.features.includes('彩色'); // 模拟筛选
			});
		}
	},
	async onLoad(options) {
		if (options.recommendDeviceId) {
			this.recommendedDeviceIdFromQuery = options.recommendDeviceId;
		}
		await this.loadPageData();

		if (this.recommendedDeviceIdFromQuery) {
			const recommended = this.availablePrinters.find(p => p.id === this.recommendedDeviceIdFromQuery);
			if (recommended) {
				this.recommendedPrinter = recommended;
				// 模拟一个文件并打开打印窗口
				this.uploadFile(true); 
			} else {
				uni.showToast({
					title: '推荐的打印机当前不可用',
					icon: 'none'
				});
				// 即使推荐的不可用，也刷新一个随机的推荐
				this.refreshRecommendation();
			}
		} else {
			// 正常加载时，刷新随机推荐
			this.refreshRecommendation();
		}
	},
	methods: {
		async loadPageData() {
			uni.showLoading({ title: '加载中...' });
			try {
				const token = uni.getStorageSync('token');
				const [devicesRes, busyRes, pricingRes] = await Promise.all([
					uni.request({
						url: 'http://localhost:3000/api/shared-devices/devices?deviceType=打印机',
						method: 'GET',
						header: { 'Authorization': `Bearer ${token}` }
					}),
					uni.request({
						url: 'http://localhost:3000/api/shared-devices/devices/busy?deviceType=打印机',
						method: 'GET',
						header: { 'Authorization': `Bearer ${token}` }
					}),
					uni.request({
						url: 'http://localhost:3000/api/shared-devices/pricing?serviceType=打印&deviceType=打印机',
						method: 'GET',
						header: { 'Authorization': `Bearer ${token}` }
					})
				]);

				const allPrinters = devicesRes.data.success ? devicesRes.data.data : [];
				const busyPrinterIds = new Set(busyRes.data.success ? busyRes.data.data : []);
				this.colorOptions = (pricingRes.data.success ? pricingRes.data.data : [])
					.sort((a,b) => Number(a.unit_price) - Number(b.unit_price))
					.map(p => ({ id: p.id, name: p.service_name, unit_price: p.unit_price }));
				
				if (this.colorOptions.length > 0) {
					this.startingPrice = Number(this.colorOptions[0].unit_price).toFixed(2);
					this.selectedColor = this.colorOptions[0];
					this.unitPrice = Number(this.colorOptions[0].unit_price);
				}

				this.printers = allPrinters.map(device => {
					let status = '';
					let statusClass = '';

					if (device.status !== '正常') {
						status = '故障';
						statusClass = 'status-fault';
					} else {
						if (busyPrinterIds.has(device.id)) {
							status = '使用中';
							statusClass = 'status-busy';
						} else {
							status = '空闲';
							statusClass = 'status-available';
						}
					}
					
					return {
						id: device.id,
						name: device.device_name,
						type: device.device_model,
						location: device.location,
						status: status,
						statusClass: statusClass,
						speed: 30, // 模拟
						image: '/static/images/printer-icon.png',
						features: ['双面打印', '彩色'],
						rating: (Math.random() * 0.5 + 4.5).toFixed(1)
					};
				});

				this.busyPrinters = this.printers.filter(p => p.status === '使用中');
				this.refreshRecommendation();
				
			} catch (error) {
				console.error("加载打印页数据失败:", error);
				uni.showToast({ title: '数据加载失败', icon: 'error' });
			} finally {
				uni.hideLoading();
			}
		},
		formatDate(date) {
			const y = date.getFullYear();
			const m = (date.getMonth() + 1).toString().padStart(2, '0');
			const d = date.getDate().toString().padStart(2, '0');
			const h = date.getHours().toString().padStart(2, '0');
			const i = date.getMinutes().toString().padStart(2, '0');
			const s = date.getSeconds().toString().padStart(2, '0');
			return `${y}-${m}-${d} ${h}:${i}:${s}`;
		},
		refreshRecommendation() {
			const available = this.availablePrinters;
			if (available.length > 0) {
				const randomIndex = Math.floor(Math.random() * available.length);
				this.recommendedPrinter = available[randomIndex];
			} else {
				this.recommendedPrinter = null;
			}
		},
		setFilter(filter) {
			this.currentFilter = filter;
		},
		uploadFile(isAutoTrigger = false) {
			// 模拟文件上传
			this.currentFile = {
				name: isAutoTrigger ? '智能助手推荐打印任务.pdf' : '课程作业.pdf',
				size: '2.5MB',
				pages: 10
			};
			this.pageCount = this.currentFile.pages;
			this.showPrintPopup = true;
			if (!isAutoTrigger) {
				this.refreshRecommendation(); // 只有手动上传才刷新推荐
			}
		},
		viewHistory() {
			uni.navigateTo({ url: '/pages/features/printing-history' });
		},
		decreaseCopies() {
			if (this.copies > 1) this.copies--;
		},
		increaseCopies() {
			this.copies++;
		},
		selectColor(colorOption) {
			this.selectedColor = colorOption;
			this.unitPrice = Number(colorOption.unit_price);
		},
		toggleDoubleSided(e) {
			this.doubleSided = e.detail.value;
		},
		showPrinterList() {
			this.showPrinterSelectionPopup = true;
		},
		closePrinterSelection() {
			this.showPrinterSelectionPopup = false;
		},
		selectPrinter(printer) {
			this.recommendedPrinter = printer;
			this.closePrinterSelection();
		},
		calculateTotal() {
			return (this.unitPrice * this.pageCount * this.copies).toFixed(2);
		},
		cancelPrint() {
			this.showPrintPopup = false;
			this.currentFile = null;
			this.copies = 1;
			if (this.colorOptions.length > 0) {
				this.selectedColor = this.colorOptions[0];
				this.unitPrice = this.colorOptions[0].lb77_unit_price;
			}
			this.doubleSided = false;
			this.pageRange = '';
		},
		async confirmPrint() {
			if (!this.recommendedPrinter) {
				uni.showToast({ title: '当前无可用打印机', icon: 'none' });
				return;
			}
			
			uni.showLoading({ title: '正在提交...' });
			
			const token = uni.getStorageSync('token');
			const totalPages = this.pageCount * this.copies;
			const totalCost = (this.unitPrice * totalPages).toFixed(2);
			const jobData = {
				deviceId: this.recommendedPrinter.id,
				deviceNumber: String(this.recommendedPrinter.id),
				deviceName: this.recommendedPrinter.name,
				deviceLocation: this.recommendedPrinter.location,
				fileName: this.currentFile?.name || '打印任务.pdf',
				filePath: '/uploads/virtual/打印任务.pdf',
				fileSize: 0,
				fileType: 'pdf',
				printType: this.selectedColor?.name?.includes('彩色') ? '彩色' : '黑白',
				paperSize: 'A4',
				paperType: '普通纸',
				printQuality: '标准',
				copies: this.copies,
				pages: totalPages,
				duplex: this.doubleSided ? '双面' : '单面',
				colorPages: this.selectedColor?.name?.includes('彩色') ? totalPages : 0,
				blackPages: this.selectedColor?.name?.includes('彩色') ? 0 : totalPages,
				estimatedCost: Number(totalCost),
				actualCost: Number(totalCost),
				status: '待支付',
				paymentMethod: '微信支付'
			};
			
			try {
				const res = await uni.request({
					url: 'http://localhost:3000/api/shared-devices/printing/jobs',
					method: 'POST',
					header: {
						'Authorization': `Bearer ${token}`,
						'Content-Type': 'application/json'
					},
					data: jobData
				});
				if (res.data && res.data.success) {
					uni.hideLoading();
					uni.showToast({ title: '打印任务已提交', icon: 'success' });
					this.showPrintPopup = false;
					
					setTimeout(() => {
						uni.navigateTo({
							url: '/pages/features/printing-history?filter=pending'
						});
					}, 1500);

				} else {
					throw new Error(res.data?.message || '提交失败');
				}
			} catch(error) {
				uni.hideLoading();
				uni.showToast({ title: error.message || '提交失败，请重试', icon: 'error' });
			}
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

/* 打印机选择弹窗 */
.printer-selection-popup {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 1000; /* 需要比打印设置弹窗的z-index高 */
}
.printer-scroll-list {
    max-height: 60vh;
}
.list-item {
    display: flex;
    align-items: center;
    padding: 24rpx 0;
    border-bottom: 1rpx solid #f0f0f0;
}
.list-item:last-child {
    border-bottom: none;
}
.list-item-icon {
    width: 64rpx;
    height: 64rpx;
    margin-right: 20rpx;
}
.list-item-info {
    flex: 1;
    display: flex;
    flex-direction: column;
}
.list-item-name {
    font-size: 28rpx;
    color: #333;
    margin-bottom: 4rpx;
}
.list-item-location {
    font-size: 24rpx;
    color: #999;
}
.list-item-check {
    margin-left: 20rpx;
}
.empty-list-text {
    text-align: center;
    padding: 40rpx;
    font-size: 26rpx;
    color: #999;
}
</style> 
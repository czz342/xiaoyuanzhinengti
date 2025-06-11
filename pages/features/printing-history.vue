<template>
	<view class="printing-history-page">
		<view class="header">
			<text class="title">打印记录</text>
		</view>

		<!-- 筛选标签 -->
		<view class="filter-tabs">
			<view class="tab-item" :class="{ 'active': filter === 'all' }" @tap="filter = 'all'">全部</view>
			<view class="tab-item" :class="{ 'active': filter === 'completed' }" @tap="filter = 'completed'">已完成</view>
			<view class="tab-item" :class="{ 'active': filter === 'pending' }" @tap="filter = 'pending'">待取件</view>
		</view>

		<!-- 打印记录列表 -->
		<scroll-view scroll-y class="record-list">
			<view v-for="record in filteredRecords" :key="record.id" class="record-card">
				<view class="card-header">
					<text class="file-name">{{ record.fileName }}</text>
					<text class="status" :class="record.status">{{ record.statusText }}</text>
				</view>
				<view class="card-body">
					<view class="record-detail">
						<text class="detail-label">地点：</text>
						<text class="detail-value">{{ record.location }} - {{ record.printer }}</text>
					</view>
					<view class="record-detail">
						<text class="detail-label">时间：</text>
						<text class="detail-value">{{ record.time }}</text>
					</view>
					<view class="record-detail">
						<text class="detail-label">详情：</text>
						<text class="detail-value">{{ record.pages }}页 / {{ record.copies }}份 / {{ record.color }}</text>
					</view>
					<view class="record-detail">
						<text class="detail-label">金额：</text>
						<text class="detail-value price">¥ {{ record.cost }}</text>
					</view>
				</view>
				<view class="card-footer">
					<button v-if="record.status === 'pending'" class="footer-btn outline" @tap="showPickupCode(record)">查看取件码</button>
					<button class="footer-btn" @tap="printAgain(record)">再次打印</button>
				</view>
			</view>
			<view v-if="filteredRecords.length === 0" class="empty-state">
				<image src="/static/images/empty-box.png" mode="aspectFit" class="empty-icon"></image>
				<text class="empty-text">暂无相关记录</text>
			</view>
		</scroll-view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			filter: 'all',
			records: [
				{
					id: 1,
					fileName: '毕业论文_v3.pdf',
					status: 'completed',
					statusText: '已取件',
					location: '图书馆二楼',
					printer: 'A-01',
					time: '2024-05-15 10:20',
					pages: 25,
					copies: 1,
					color: '黑白',
					cost: '2.50'
				},
				{
					id: 2,
					fileName: '软件杯参赛文档.docx',
					status: 'pending',
					statusText: '待取件',
					location: '图书馆二楼',
					printer: 'A-03',
					time: '2024-05-21 11:05',
					pages: 10,
					copies: 2,
					color: '彩色',
					cost: '4.00',
					pickupCode: '5278'
				},
				{
					id: 3,
					fileName: '考研英语资料.zip',
					status: 'completed',
					statusText: '已取件',
					location: '文印中心',
					printer: 'B-02',
					time: '2024-05-10 16:45',
					pages: 50,
					copies: 1,
					color: '黑白',
					cost: '5.00'
				}
			]
		}
	},
	computed: {
		filteredRecords() {
			if (this.filter === 'all') {
				return this.records;
			}
			return this.records.filter(record => record.status === this.filter);
		}
	},
	methods: {
		showPickupCode(record) {
			uni.showModal({
				title: '取件码',
				content: `请在打印机 ${record.printer} 上输入取件码：${record.pickupCode}`,
				showCancel: false,
				confirmText: '我知道了'
			});
		},
		printAgain(record) {
			uni.showToast({
				title: '正在重新发起打印...',
				icon: 'loading'
			});
			setTimeout(() => {
				uni.navigateTo({
					url: '/pages/features/printing'
				});
			}, 1500);
		}
	}
}
</script>

<style>
.printing-history-page {
	display: flex;
	flex-direction: column;
	height: 100vh;
	background-color: #f5f7fa;
}

.header {
	padding: 40rpx 30rpx 20rpx;
}

.title {
	font-size: 40rpx;
	font-weight: bold;
	color: #333;
}

.filter-tabs {
	display: flex;
	padding: 0 30rpx;
	margin-bottom: 20rpx;
}

.tab-item {
	padding: 15rpx 30rpx;
	font-size: 28rpx;
	color: #666;
	border-radius: 30rpx;
	margin-right: 20rpx;
	background-color: #fff;
}

.tab-item.active {
	background-color: #007AFF;
	color: #fff;
	font-weight: 500;
}

.record-list {
	flex: 1;
	padding: 0 30rpx;
}

.record-card {
	background-color: #fff;
	border-radius: 16rpx;
	padding: 25rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-bottom: 20rpx;
	border-bottom: 1rpx solid #f0f0f0;
}

.file-name {
	font-size: 28rpx;
	font-weight: 500;
	color: #333;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.status {
	font-size: 26rpx;
	flex-shrink: 0;
	margin-left: 20rpx;
}
.status.completed { color: #999; }
.status.pending { color: #ff8000; }

.card-body {
	padding: 20rpx 0;
}

.record-detail {
	display: flex;
	font-size: 26rpx;
	margin-bottom: 10rpx;
}

.detail-label {
	color: #999;
	width: 120rpx;
}

.detail-value {
	color: #333;
}

.price {
	font-weight: 500;
	color: #ff8000;
}

.card-footer {
	display: flex;
	justify-content: flex-end;
	padding-top: 15rpx;
	border-top: 1rpx solid #f0f0f0;
}

.footer-btn {
	padding: 10rpx 30rpx;
	font-size: 26rpx;
	margin-left: 20rpx;
	border-radius: 30rpx;
}

.footer-btn.outline {
	border: 1rpx solid #ff8000;
	color: #ff8000;
	background-color: #fff;
}

.footer-btn:not(.outline) {
	background-color: #007AFF;
	color: #fff;
}

.empty-state {
	text-align: center;
	padding-top: 200rpx;
}

.empty-icon {
	width: 200rpx;
	height: 200rpx;
	margin-bottom: 20rpx;
}

.empty-text {
	font-size: 28rpx;
	color: #999;
}
</style> 
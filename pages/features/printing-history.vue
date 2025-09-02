<template>
	<view class="printing-history-page">
		<view class="header">
			<text class="title">打印记录</text>
		</view>

		<!-- 筛选标签 -->
		<view class="filter-tabs">
			<view class="tab-item" :class="{ 'active': filter === 'all' }" @tap="setFilter('all')">全部</view>
			<view class="tab-item" :class="{ 'active': filter === 'completed' }" @tap="setFilter('completed')">已完成</view>
			<view class="tab-item" :class="{ 'active': filter === 'pending' }" @tap="setFilter('pending')">待取件</view>
		</view>

		<!-- 打印记录列表 -->
		<scroll-view scroll-y class="record-list" @scrolltolower="loadMore" lower-threshold="50">
			<view v-if="isLoading" class="loading-state">
				<uni-load-more status="loading"></uni-load-more>
			</view>
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
			<view v-if="!isLoading && records.length === 0" class="empty-state">
				<image src="/static/images/empty-box.png" mode="aspectFit" class="empty-icon"></image>
				<text class="empty-text">暂无相关记录</text>
			</view>
			<view v-if="!isLoading && records.length > 0">
				<uni-load-more :status="loadMoreStatus"></uni-load-more>
			</view>
		</scroll-view>
	</view>
</template>

<script>

export default {
	data() {
		return {
			filter: 'all',
			records: [],
			isLoading: true,
			pageNo: 1,
			pageSize: 10,
			hasMore: true,
			loadMoreStatus: 'more',
			studentId: '645730151',
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
	onLoad(options) {
		if (options.filter) {
			this.filter = options.filter;
		}
		this.loadRecords(true);
	},
	methods: {
		formatDateTime(iso) {
			if (!iso) return '';
			const d = new Date(iso);
			const y = d.getFullYear();
			const m = String(d.getMonth() + 1).padStart(2, '0');
			const day = String(d.getDate()).padStart(2, '0');
			const hh = String(d.getHours()).padStart(2, '0');
			const mm = String(d.getMinutes()).padStart(2, '0');
			const ss = String(d.getSeconds()).padStart(2, '0');
			return `${y}-${m}-${day} ${hh}:${mm}:${ss}`;
		},
		async loadRecords(isRefresh = false) {
			if (isRefresh) {
				this.pageNo = 1;
				this.records = [];
				this.hasMore = true;
				this.loadMoreStatus = 'more';
				this.isLoading = true;
			}
			
			if (!this.hasMore) {
				this.loadMoreStatus = 'noMore';
				return;
			}

			this.loadMoreStatus = 'loading';
			
			try {
				const token = uni.getStorageSync('token');
				const res = await uni.request({
					url: 'http://localhost:3000/api/shared-devices/printing/jobs',
					method: 'GET',
					header: { 'Authorization': `Bearer ${token}` }
				});
				const fetchedRecords = res.data.success ? res.data.data : [];

				if (fetchedRecords.length < this.pageSize) {
					this.hasMore = false;
					this.loadMoreStatus = 'noMore';
				}

				const formattedRecords = fetchedRecords.map(r => {
					// 模拟状态：5分钟内的订单视为"待取件"
					const createTime = new Date(r.created_at);
					const now = new Date();
					const isPending = (now - createTime) < 5 * 60 * 1000;

					return {
						id: r.id,
						fileName: r.file_name || `打印任务-${r.job_number}`,
						status: isPending ? 'pending' : 'completed',
						statusText: isPending ? '待取件' : '已完成',
						location: r.device_location,
						printer: r.device_name,
						time: this.formatDateTime(r.created_at),
						pages: r.pages,
						copies: 1, // API未返回份数，默认为1
						color: r.print_type,
						cost: Number(r.actual_cost ?? r.estimated_cost ?? 0).toFixed(2),
						pickupCode: (r.job_number || '').slice(-4)
					};
				});

				this.records = [...this.records, ...formattedRecords];
				this.pageNo++;

			} catch (error) {
				console.error("获取打印记录失败:", error);
				uni.showToast({ title: '加载失败', icon: 'error' });
				this.loadMoreStatus = 'more';
			} finally {
				this.isLoading = false;
			}
		},
		loadMore() {
			this.loadRecords();
		},
		setFilter(newFilter) {
			this.filter = newFilter;
		},
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
				title: '正在准备重新打印...',
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
	transition: all 0.3s;
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
	flex-shrink: 0;
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

.loading-state {
	padding: 40rpx 0;
}
</style> 
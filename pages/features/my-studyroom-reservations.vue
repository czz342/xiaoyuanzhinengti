<template>
	<view class="container">
		<view class="header">
			<text class="title">我的自习室预约</text>
		</view>
		<!-- 暂时移除日期筛选，因为新API返回所有预约记录 -->
		<!-- <view class="filter-section">
			<uni-datetime-picker type="date" :value="selectedDate" @change="onDateChange" />
		</view> -->
		<view v-if="loading" class="loading-container">
			<text>正在加载预约记录...</text>
		</view>
		<view v-else-if="reservations.length === 0" class="empty-container">
			<text>暂无预约记录</text>
			<text class="empty-tip">快去预约一个座位吧！</text>
		</view>
		<scroll-view v-else scroll-y="true" class="list-container">
			<view v-for="item in reservations" :key="item.id" class="reservation-card" @click="showQrCodeModal(item)">
				<view class="card-header">
					<text class="classroom-name">{{ item.studyRoomName }} - {{ item.seatLabel }}</text>
					<text :class="['status', getStatusClass(item.status)]">{{ item.status }}</text>
				</view>
				<view class="card-body">
					<view class="info-row">
						<text class="label">预约日期:</text>
						<text class="value">{{ item.date }}</text>
					</view>
					<view class="info-row">
						<text class="label">预约时间:</text>
						<text class="value">{{ item.time }}</text>
					</view>
				</view>
			</view>
		</scroll-view>

		<!-- 二维码凭证弹窗 -->
		<uni-popup ref="qrPopup" type="center">
			<view class="popup-content">
				<text class="popup-title">预约凭证</text>
				<view class="qr-code-container">
					<!-- 使用静态图片作为占位二维码 -->
					<image src="/static/images/qrcode.png" style="width: 400rpx; height: 400rpx;" />
				</view>
				<view class="popup-info" v-if="selectedReservation">
					<view class="info-row">
						<text class="label">自习室:</text>
						<text class="value">{{ selectedReservation.studyRoomName }}</text>
					</view>
                    <view class="info-row">
						<text class="label">座位号:</text>
						<text class="value">{{ selectedReservation.seatLabel }}</text>
					</view>
					<view class="info-row">
						<text class="label">时间:</text>
						<text class="value">{{ selectedReservation.date }} {{ selectedReservation.time }}</text>
					</view>
				</view>
				<text class="popup-tip">凭此二维码或校园卡进入自习室</text>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	// 移除 KingdeeAgentService 导入，使用新的后端API

	export default {
		data() {
			return {
				loading: true,
				reservations: [], // 预约列表
				selectedReservation: null, // 当前选中的预约
				selectedDate: '' // 用于存储选中的日期
			};
		},
		onLoad(options) {
			const { reservationId, date } = options;
			console.log('[my-studyroom-reservations] onLoad options:', { reservationId, date });

			this.fetchReservations().then(() => {
				if (reservationId && this.reservations.length > 0) {
					// 将 reservationId 转换为数字进行比较，因为后端返回的 id 是数字类型
					const targetId = parseInt(reservationId, 10);
					console.log('[my-studyroom-reservations] 查找预约记录, targetId:', targetId, '所有预约ID:', this.reservations.map(r => ({ id: r.id, type: typeof r.id })));
					
					const reservation = this.reservations.find(r => {
						// 同时支持字符串和数字类型比较
						return r.id === targetId || r.id === reservationId || String(r.id) === String(reservationId);
					});
					
					if (reservation) {
						console.log('[my-studyroom-reservations] 找到预约记录:', reservation);
						this.showQrCodeModal(reservation);
					} else {
						console.warn(`[my-studyroom-reservations] 未找到预约记录, reservationId: ${reservationId}, type: ${typeof reservationId}, 可用预约:`, this.reservations.map(r => r.id));
						uni.showToast({
							title: '未找到预约记录',
							icon: 'none',
							duration: 2000
						});
					}
				}
			});
		},
		methods: {
			// 暂时移除日期筛选功能
			// onDateChange(date) {
			// 	this.selectedDate = date;
			// 	this.fetchReservations();
			// },

			showQrCodeModal(reservation) {
				// 允许查看所有状态的预约记录
				this.selectedReservation = reservation;
				this.$refs.qrPopup.open();
			},

			async fetchReservations() {
				this.loading = true;
				try {
					// 检查用户是否已登录
					const token = uni.getStorageSync('token');
					if (!token) {
						uni.showToast({
							title: '请先登录',
							icon: 'none'
						});
						this.reservations = [];
						return;
					}

					const response = await uni.request({
						url: 'http://localhost:3000/api/studyroom/my',
						method: 'GET',
						header: {
							'Authorization': `Bearer ${token}`
						}
					});

					if (response.statusCode === 200 && response.data.success) {
						console.log('[my-studyroom-reservations] 后端返回的原始数据:', JSON.stringify(response.data.data.slice(0, 2), null, 2));
						this.reservations = response.data.data.map(item => {
							const formattedDate = this.formatDate(item.booking_date);
							console.log('[my-studyroom-reservations] 日期转换 - 原始:', item.booking_date, '类型:', typeof item.booking_date, '转换后:', formattedDate);
							return {
								id: item.id, // 确保 id 保持为数字类型（或字符串，取决于后端返回）
								studyRoomName: item.room_name || '未知自习室',
								seatLabel: item.seat_label || '未知座位',
								date: formattedDate,
								time: this.formatTimeRange(item.start_time_sec, item.end_time_sec),
								status: this.getBookingStatus(item.booking_date, item.end_time_sec, item.status)
							};
						});
						console.log('[my-studyroom-reservations] 加载预约记录成功，数量:', this.reservations.length, '预约列表:', this.reservations.map(r => ({ id: r.id, date: r.date })));
					} else {
						throw new Error(response.data.message || '获取预约记录失败');
					}
				} catch (error) {
					console.error('fetchReservations error:', error);
					uni.showToast({
						title: error.message || '网络请求失败，请稍后重试',
						icon: 'none'
					});
					this.reservations = []; // 清空以防显示旧数据
				} finally {
					this.loading = false;
				}
			},

			getFormattedDate(date) {
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, '0');
				const day = String(date.getDate()).padStart(2, '0');
				return `${year}-${month}-${day}`;
			},

			formatDate(dateStr) {
				// 处理日期字符串，只显示日期部分
				if (!dateStr || dateStr.trim() === '') return '';
				
				// 如果是Date对象，转换为字符串
				if (dateStr instanceof Date) {
					const year = dateStr.getFullYear();
					const month = String(dateStr.getMonth() + 1).padStart(2, '0');
					const day = String(dateStr.getDate()).padStart(2, '0');
					return `${year}-${month}-${day}`;
				}
				
				const dateString = String(dateStr).trim();
				
				// 如果已经是YYYY-MM-DD格式，直接返回
				if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
					return dateString;
				}
				
				// 如果是ISO格式（带T），提取日期部分
				if (dateString.includes('T')) {
					return dateString.split('T')[0];
				}
				
				// 处理 "Sat Nov 01 2025 00:00:00 GM" 这种格式
				// 或者 "Sat Nov 01 2025" 这种格式
				if (dateString.match(/\w+\s+\w+\s+\d+\s+\d{4}/)) {
					try {
						const date = new Date(dateString);
						if (!isNaN(date.getTime())) {
							const year = date.getFullYear();
							const month = String(date.getMonth() + 1).padStart(2, '0');
							const day = String(date.getDate()).padStart(2, '0');
							return `${year}-${month}-${day}`;
						}
					} catch (e) {
						console.warn('日期解析失败:', dateString, e);
					}
				}
				
				// 如果包含空格和时分秒，尝试提取YYYY-MM-DD格式
				const dateMatch = dateString.match(/(\d{4})-(\d{2})-(\d{2})/);
				if (dateMatch) {
					return `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}`;
				}
				
				// 最后尝试用Date对象解析
				try {
					const date = new Date(dateString);
					if (!isNaN(date.getTime())) {
						const year = date.getFullYear();
						const month = String(date.getMonth() + 1).padStart(2, '0');
						const day = String(date.getDate()).padStart(2, '0');
						return `${year}-${month}-${day}`;
					}
				} catch (e) {
					console.warn('日期解析失败:', dateString, e);
				}
				
				return dateString; // 如果所有方法都失败，返回原值
			},

			getBookingStatus(dateStr, endTimeSeconds, status) {
				// 如果状态是已取消，直接返回
				if (status === 'cancelled') {
					return '已取消';
				}

				const now = new Date();
				const endDateTime = new Date(`${dateStr}T00:00:00`);
				endDateTime.setSeconds(endTimeSeconds);

				if (now > endDateTime) {
					return '已结束';
				}
				return '已预约';
			},

			formatTimeRange(startSeconds, endSeconds) {
				const format = (seconds) => {
					const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
					const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
					return `${h}:${m}`;
				};
				return `${format(startSeconds)} - ${format(endSeconds)}`;
			},

			getStatusClass(status) {
				if (status === '已预约') return 'status-booked';
				if (status === '已结束') return 'status-finished';
				if (status === '已取消') return 'status-cancelled';
				return 'status-booked'; // 默认样式
			}
		}
	};
</script>

<style scoped>
	.container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		background-color: #f5f5f5;
	}

	.header {
		padding: 30rpx;
		background-color: #ffffff;
		border-bottom: 1px solid #e0e0e0;
		text-align: center;
	}

	.title {
		font-size: 36rpx;
		font-weight: bold;
	}

	.filter-section {
		padding: 20rpx;
		background-color: #ffffff;
	}

	.loading-container,
	.empty-container {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		color: #888;
		font-size: 30rpx;
		gap: 20rpx;
	}

	.empty-tip {
		font-size: 26rpx;
		color: #aaa;
	}

	.list-container {
		flex: 1;
		padding: 20rpx;
	}

	.reservation-card {
		background-color: #ffffff;
		border-radius: 16rpx;
		margin-bottom: 20rpx;
		padding: 30rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid #f0f0f0;
		padding-bottom: 20rpx;
		margin-bottom: 20rpx;
	}

	.classroom-name {
		font-size: 32rpx;
		font-weight: bold;
	}

	.status {
		font-size: 26rpx;
		padding: 8rpx 16rpx;
		border-radius: 20rpx;
		font-weight: 500;
	}

	.status-booked {
		color: #ffffff;
		background-color: #007aff;
	}

	.status-finished {
		color: #888;
		background-color: #e5e5e5;
	}

	.status-cancelled {
		color: #ffffff;
		background-color: #ff3b30;
	}

	.card-body {
		display: flex;
		flex-direction: column;
		gap: 15rpx;
	}

	.info-row {
		display: flex;
		justify-content: space-between;
		font-size: 28rpx;
	}

	.label {
		color: #666;
	}

	.value {
		color: #333;
		font-weight: 500;
	}

	.popup-content {
		background-color: white;
		padding: 40rpx;
		border-radius: 24rpx;
		width: 600rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.popup-title {
		font-size: 36rpx;
		font-weight: bold;
		margin-bottom: 30rpx;
	}

	.qr-code-container {
		margin-bottom: 30rpx;
	}

	.popup-info {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 20rpx;
		margin-bottom: 30rpx;
	}

	.popup-tip {
		font-size: 24rpx;
		color: #999;
	}
</style> 
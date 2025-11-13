<template>
	<view class="container">
		<view class="header">
			<text class="title">我的教室预约</text>
		</view>
		<view class="filter-section">
			<uni-datetime-picker type="date" :value="selectedDate" @change="onDateChange" />
		</view>
		<view v-if="loading" class="loading-container">
			<text>正在加载预约记录...</text>
		</view>
		<view v-else-if="reservations.length === 0" class="empty-container">
			<text>暂无预约记录</text>
		</view>
		<scroll-view v-else scroll-y="true" class="list-container">
			<view v-for="item in reservations" :key="item.id" class="reservation-card" @click="showQrCodeModal(item)">
				<view class="card-header">
					<text class="classroom-name">{{ item.classroomName }}</text>
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
					<view class="info-row">
						<text class="label">预约用途:</text>
						<text class="value">{{ item.purpose }}</text>
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
						<text class="label">教室:</text>
						<text class="value">{{ selectedReservation.classroomName }}</text>
					</view>
					<view class="info-row">
						<text class="label">时间:</text>
						<text class="value">{{ selectedReservation.date }} {{ selectedReservation.time }}</text>
					</view>
				</view>
				<text class="popup-tip">用此二维码开门或使用校园卡NFC功能开门</text>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	

	export default {
		data() {
			return {
				loading: true,
				reservations: [], // 预约列表
				selectedReservation: null, // 当前选中的预约
				selectedDate: '', // 用于存储选中的日期
				bookingNumberFromLink: null // 用于存储从链接传入的预约number
			};
		},
		onLoad(options) {
			console.log('页面加载，options:', options);
			this.selectedDate = this.getFormattedDate(new Date());
			if (options && options.number) {
				this.bookingNumberFromLink = options.number;
				console.log('从链接获取预约编号:', this.bookingNumberFromLink);
			}
			this.fetchReservations();
		},
		methods: {
			onDateChange(date) {
				this.selectedDate = date;
				this.fetchReservations();
			},

			showQrCodeModal(reservation) {
				if (reservation.status !== '已预约') {
					uni.showToast({
						title: '只有"已预约"的记录才能查看凭证',
						icon: 'none'
					});
					return;
				}
				this.selectedReservation = reservation;
				this.$refs.qrPopup.open();
			},

			async fetchReservations() {
				this.loading = true;
				try {
					// 检查登录状态
					const token = uni.getStorageSync('token');
					if (!token) {
						uni.showToast({
							title: '请先登录',
							icon: 'none'
						});
						this.loading = false;
						return;
					}

					const response = await uni.request({
						url: 'http://localhost:3000/api/classroom/reservations/my',
						method: 'GET',
						header: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${token}`
						}
					});

					if (response.statusCode === 200 && response.data.success) {
						this.reservations = response.data.data.map(item => {
							// 格式化日期：如果后端返回的是ISO格式字符串，转换为YYYY-MM-DD格式
							let formattedDate = item.reservationDate;
							if (formattedDate) {
								// 处理ISO格式日期字符串 (如: "2025-11-04T16:00:00.000Z")
								if (typeof formattedDate === 'string' && formattedDate.includes('T')) {
									formattedDate = formattedDate.split('T')[0];
								}
								// 如果是Date对象，转换为YYYY-MM-DD格式
								else if (formattedDate instanceof Date) {
									formattedDate = this.getFormattedDate(formattedDate);
								}
								// 如果已经是YYYY-MM-DD格式，直接使用
								else if (typeof formattedDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(formattedDate)) {
									// 已经是正确格式，无需转换
								}
								// 其他情况，尝试解析
								else {
									try {
										const dateObj = new Date(formattedDate);
										if (!isNaN(dateObj.getTime())) {
											formattedDate = this.getFormattedDate(dateObj);
										}
									} catch (e) {
										console.warn('日期格式化失败:', formattedDate);
									}
								}
							}
							
							return {
								id: item.id,
								reservationNumber: item.reservationNumber || item.reservation_number, // 保存预约编号
								classroomName: item.classroomName,
								date: formattedDate,
								time: this.formatTimeRange(item.startTime, item.endTime),
								purpose: item.purpose || '',
								status: this.getBookingStatus(item.reservationDate, item.endTime, item.status)
							};
						});

						// 处理来自深层链接的预约编号
						if (this.bookingNumberFromLink) {
							console.log('查找预约编号:', this.bookingNumberFromLink);
							console.log('当前预约列表:', this.reservations.map(r => ({ id: r.id, number: r.reservationNumber })));
							const targetReservation = this.reservations.find(r => 
								r.reservationNumber === this.bookingNumberFromLink || 
								r.reservationNumber === String(this.bookingNumberFromLink)
							);
							if (targetReservation) {
								console.log('找到目标预约:', targetReservation);
								// 使用setTimeout确保DOM更新后再打开弹窗
								setTimeout(() => {
									this.showQrCodeModal(targetReservation);
								}, 300); // 增加延迟时间，确保数据加载完成
							} else {
								console.warn('未找到匹配的预约编号:', this.bookingNumberFromLink);
							}
							this.bookingNumberFromLink = null; // 处理后重置
						}
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
				return '';
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
		justify-content: center;
		align-items: center;
		color: #888;
		font-size: 30rpx;
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

	.card-body {}

	.info-row {
		display: flex;
		margin-bottom: 10rpx;
		font-size: 28rpx;
	}

	.label {
		color: #666;
		width: 150rpx;
	}

	.value {
		color: #333;
		flex: 1;
	}

	.popup-content {
		width: 600rpx;
		background-color: #ffffff;
		border-radius: 20rpx;
		padding: 40rpx;
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
		width: 400rpx;
		height: 400rpx;
		margin: 20rpx 0;
		border: 1px solid #eee;
	}

	.popup-info {
		width: 100%;
		margin-top: 30rpx;
	}
	
	.popup-info .info-row {
		font-size: 28rpx;
		margin-bottom: 15rpx;
	}
	
	.popup-info .label {
		color: #888;
	}
	
	.popup-info .value {
		color: #333;
		font-weight: 500;
	}

	.popup-tip {
		margin-top: 30rpx;
		font-size: 26rpx;
		color: #999;
	}
</style> 
<template>
	<view class="container">
		<view class="header">
			<text class="title">我的自习室预约</text>
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
	import KingdeeAgentService from '@/services/kingdeeAgent.js';

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
			const {
				reservationId,
				date
			} = options;

			if (date) {
				this.selectedDate = date;
			} else {
				this.selectedDate = this.getFormattedDate(new Date());
			}

			this.fetchReservations().then(() => {
				if (reservationId && this.reservations.length > 0) {
					const reservation = this.reservations.find(r => r.id === reservationId);
					if (reservation) {
						this.showQrCodeModal(reservation);
					} else {
						console.warn(`[my-studyroom-reservations] Reservation with id ${reservationId} not found on date ${this.selectedDate}`);
						uni.showToast({
							title: '未在指定日期找到预约记录',
							icon: 'none'
						});
					}
				}
			});
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
					// TODO: 替换为从全局状态或本地存储中获取的真实学号
					const studentId = '645730151';

					const response = await KingdeeAgentService.getPersonalStudyRoomBookings(studentId, this.selectedDate);

					if (response && response.status === true) {
						this.reservations = response.data.rows.map(item => {
							return {
								id: item.number,
                                studyRoomName: item.lb77_seat_id_lb77_studyroom_id_name,
                                seatLabel: item.lb77_seat_id_name ? item.lb77_seat_id_name.split('-').slice(-2).join('-') : 'N/A',
								date: item.lb77_booking_date.split(' ')[0],
								time: this.formatTimeRange(item.lb77_start_time, item.lb77_end_time),
								status: this.getBookingStatus(item.lb77_booking_date, item.lb77_end_time)
							};
						});
					} else {
						throw new Error(response.message || '获取预约记录失败');
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

			getBookingStatus(dateStr, endTimeSeconds) {
				const now = new Date();
				const endDateTime = new Date(`${dateStr.split(' ')[0]}T00:00:00`);
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
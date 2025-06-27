<template>
	<view class="classroom-page">
		<!-- 楼层选择器 -->
		<view class="floor-selector">
			<view class="building-picker">
				<picker @change="onBuildingChange" :value="currentBuildingIndex" :range="buildings">
					<view class="picker-item">
						<text class="picker-text">{{buildings[currentBuildingIndex]}}</text>
						<text class="picker-arrow">▼</text>
					</view>
				</picker>
			</view>
			<view class="floor-tabs">
				<view 
					class="floor-tab" 
					v-for="(floor, index) in floors" 
					:key="index"
					:class="{'active': currentFloorIndex === index}"
					@tap="selectFloor(index)"
				>
					<text>{{floor}}</text>
				</view>
			</view>
		</view>
		
		<!-- 设备筛选器 -->
		<view class="equipment-filter">
			<view 
				class="filter-tag"
				v-for="(equipment, index) in allEquipments" 
				:key="index"
				:class="{'active': selectedEquipments.includes(equipment)}"
				@tap="toggleEquipment(equipment)"
			>
				<text>{{equipment}}</text>
			</view>
		</view>
		
		<!-- 3D楼层平面图 -->
		<view class="floor-map-container">
			<view class="map-legend">
				<view class="legend-item">
					<view class="legend-color available"></view>
					<text>可用</text>
				</view>
				<view class="legend-item">
					<view class="legend-color occupied"></view>
					<text>已占用</text>
				</view>
				<view class="legend-item">
					<view class="legend-color maintenance"></view>
					<text>维护中</text>
				</view>
			</view>
			
			<!-- 可交互地图区域 -->
			<movable-area class="movable-area" scale-area>
				<movable-view 
					class="movable-view" 
					direction="all" 
					@change="onMapChange"
					:scale-value="mapScaleValue"
					scale="true" 
					scale-min="0.5" 
					scale-max="3"
				>
				<image src="/static/images/floor-map.png" mode="aspectFit" class="map-image"></image>
				
				<!-- 教室标记点 -->
				<view 
					class="room-marker" 
					v-for="(room, index) in currentFloorRooms" 
					:key="index"
					:class="room.status"
					:style="{ left: room.position.x + 'rpx', top: room.position.y + 'rpx' }"
					@tap="selectRoom(room)"
				>
					<text class="room-code">{{room.code}}</text>
				</view>
				</movable-view>
			</movable-area>
			
			<view class="map-controls">
				<view class="control-btn zoom-in" @tap="zoomIn">
					<image src="/static/images/zoom-in.png" mode="aspectFit"></image>
				</view>
				<view class="control-btn zoom-out" @tap="zoomOut">
					<image src="/static/images/zoom-out.png" mode="aspectFit"></image>
				</view>
				<view class="control-btn rotate" @tap="resetMap">
					<image src="/static/images/refresh.png" mode="aspectFit"></image>
				</view>
			</view>
		</view>
		
		<!-- 教室列表 -->
		<view class="room-list">
			<text class="list-title">当前楼层教室</text>
			<scroll-view scroll-y="true" class="list-scroll">
				<view 
					class="room-item" 
					v-for="(room, index) in currentFloorRooms" 
					:key="index"
					:class="{'selected': selectedRoom && selectedRoom.id === room.id}"
					@tap="selectRoom(room)"
				>
					<view class="room-status-dot" :class="room.status"></view>
					<view class="room-info">
						<text class="room-name">{{room.name}}</text>
						<text class="room-capacity">容量: {{room.capacity}}人</text>
					</view>
					<view class="room-equipment">
						<view class="equipment-icon" v-if="room.hasProjector">
							<image src="/static/images/projector.png" mode="aspectFit"></image>
						</view>
						<view class="equipment-icon" v-if="room.hasComputer">
							<image src="/static/images/computer.png" mode="aspectFit"></image>
						</view>
						<view class="equipment-icon" v-if="room.hasAirConditioner">
							<image src="/static/images/ac.png" mode="aspectFit"></image>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		
		<!-- 时间选择器 -->
		<view class="time-selector" v-if="selectedRoom">
			<view class="selected-room-info">
				<text class="room-title">{{selectedRoom.name}}</text>
				<button class="close-btn" @tap="closeRoomSelection">×</button>
			</view>
			
			<view class="date-selector">
				<view class="date-title">选择日期</view>
				<picker mode="date" :value="currentDate" :start="startDate" :end="endDate" @change="onDateChange">
					<view class="date-picker">
						<text>{{currentDate}}</text>
						<text class="picker-arrow">▼</text>
					</view>
				</picker>
			</view>
			
			<view class="time-slots-container">
				<view class="time-title">选择时段</view>
				<scroll-view scroll-x="true" class="time-slots">
					<view 
						class="time-slot-item" 
						v-for="(slot, index) in timeSlots" 
						:key="index"
						:class="{'selected': selectedTimeSlots.includes(index), 'disabled': !isSlotAvailable(slot)}"
						@tap="toggleTimeSlot(index, slot)"
					>
						<text class="time-text">{{slot.time}}</text>
						<text class="slot-status">{{isSlotAvailable(slot) ? '可用' : '已约'}}</text>
					</view>
				</scroll-view>
			</view>
			
			<view class="booking-summary" v-if="selectedTimeSlots.length > 0">
				<view class="summary-title">预约信息</view>
				<view class="summary-content">
					<view class="summary-item">
						<text class="summary-label">教室:</text>
						<text class="summary-value">{{selectedRoom.name}}</text>
					</view>
					<view class="summary-item">
						<text class="summary-label">日期:</text>
						<text class="summary-value">{{currentDate}}</text>
					</view>
					<view class="summary-item">
						<text class="summary-label">时间:</text>
						<text class="summary-value">{{getSelectedTimeRange()}}</text>
					</view>
				</view>
			</view>
			
			<button class="submit-btn" :disabled="selectedTimeSlots.length === 0" @tap="submitBooking">提交预约</button>
		</view>
		
		<!-- 我的预约 FAB -->
		<view class="fab" @tap="goToMyReservations">
			<image class="fab-icon" src="/static/images/预约凭证.png"></image>
			<text class="fab-text">我的预约</text>
		</view>
	</view>
</template>

<script>
import KingdeeAgentService from '@/services/kingdeeAgent.js';

export default {
	data() {
		return {
			// 建筑物和楼层数据
			buildings: [], // 将由API动态填充
			currentBuildingIndex: 0,
			floors: [], // 将由API动态填充
			currentFloorIndex: 0,
			
			// 地图缩放和旋转控制
			mapScaleValue: 1,
			mapX: 0,
			mapY: 0,
			
			// 选中的教室
			selectedRoom: null,
			
			// 日期选择
			currentDate: '', // 初始化为空
			startDate: '',   // 初始化为空
			endDate: '',     // 初始化为空
			
			// 时间段选择
			selectedTimeSlots: [],
			
			// 模拟的楼层教室数据 - 将由API填充
			roomsData: {},

			// 当天所有教室的预定记录
			dailyBookings: [],
			
			// 时间段数据
			timeSlots: [
				{ id: 0, time: '08:00-09:00' },
				{ id: 1, time: '09:00-10:00' },
				{ id: 2, time: '10:00-11:00' },
				{ id: 3, time: '11:00-12:00' },
				{ id: 4, time: '13:00-14:00' },
				{ id: 5, time: '14:00-15:00' },
				{ id: 6, time: '15:00-16:00' },
				{ id: 7, time: '16:00-17:00' },
				{ id: 8, time: '18:00-19:00' },
				{ id: 9, time: '19:00-20:00' }
			],

			// 设备筛选器相关数据
			allEquipments: ['投影仪', '电脑', '空调', '智慧黑板'],
			selectedEquipments: []
		}
	},
	onLoad() {
		this.fetchClassrooms();
		
		// 初始化日期选择器的范围
		const today = new Date();
		const oneMonthLater = new Date(today);
		oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

		this.currentDate = this.formatDate(today);
		this.startDate = this.formatDate(today);
		this.endDate = this.formatDate(oneMonthLater);

		// 获取当天的预定数据
		this.fetchBookingsForDate(this.currentDate);
	},
	computed: {
		currentFloorRooms() {
			const building = this.buildings[this.currentBuildingIndex];
			const floor = this.floors[this.currentFloorIndex];
			
			if (this.roomsData[building] && this.roomsData[building][floor]) {
				let rooms = this.roomsData[building][floor];
				
				// 如果有选中的设备，则进行筛选
				if (this.selectedEquipments.length > 0) {
					rooms = rooms.filter(room => {
						// 检查该教室是否包含所有选中的设备
						return this.selectedEquipments.every(equipment => {
							// 我们需要一种方式来检查room是否含有该equipment
							// 假设 room.equipment 是一个像 "投影仪,电脑" 这样的字符串
							return room.equipment && room.equipment.includes(equipment);
						});
					});
				}
				
				return rooms;
			}
			return [];
		}
	},
	methods: {
		async fetchClassrooms() {
			uni.showLoading({ title: '加载教室中...' });
			try {
				const response = await KingdeeAgentService.getClassroomList();
				if (response && response.data && Array.isArray(response.data.rows)) {
					this.processClassroomData(response.data.rows);
				} else {
					console.error("获取到的教室数据格式不正确", response);
					uni.showToast({ title: '教室数据加载失败', icon: 'none' });
				}
			} catch (error) {
				console.error('获取教室列表失败:', error);
				uni.showToast({ title: '网络错误，请稍后重试', icon: 'none' });
			} finally {
				uni.hideLoading();
			}
		},
		
		processClassroomData(apiRows) {
			const roomsData = {};
			const buildings = new Set();
			
			apiRows.forEach(row => {
				const buildingName = row.lb77_building_name;
				if (buildingName) {
					buildings.add(buildingName);
					if (!roomsData[buildingName]) {
						roomsData[buildingName] = {};
					}

					const floorName = row.lb77_floor;
					if (floorName) {
						if (!roomsData[buildingName][floorName]) {
							roomsData[buildingName][floorName] = [];
						}
						
						const equipment = row.lb77_equipment || '';
						roomsData[buildingName][floorName].push({
							id: row.masterid,
							code: row.number,
							name: row.name,
							capacity: row.lb77_capacity,
							status: row.lb77_status || '可用',
							hasProjector: equipment.includes('投影仪'),
							hasComputer: equipment.includes('电脑'),
							hasAirConditioner: equipment.includes('空调'),
							equipment: equipment, // 直接保存设备字符串，用于筛选
							position: {
								x: row.lb77_position_x || 0,
								y: row.lb77_position_y || 0
							},
							// 暂定所有时间段可用
							availableTimeSlots: Array.from({ length: 12 }, (_, i) => i) 
						});
					}
				}
			});

			this.buildings = Array.from(buildings);
			this.roomsData = roomsData;
			
			// 初始化楼层数据
			this.updateFloorsForCurrentBuilding();
		},

		updateFloorsForCurrentBuilding() {
			const currentBuildingName = this.buildings[this.currentBuildingIndex];
			if (currentBuildingName && this.roomsData[currentBuildingName]) {
				const floorKeys = Object.keys(this.roomsData[currentBuildingName]);
				floorKeys.sort((a, b) => parseInt(a) - parseInt(b));
				this.floors = floorKeys;
			} else {
				this.floors = [];
			}
			this.currentFloorIndex = 0; // 重置楼层选择
		},

		onBuildingChange(e) {
			this.currentBuildingIndex = e.detail.value;
			this.updateFloorsForCurrentBuilding();
			this.selectedRoom = null; // 切换教学楼后清空选择
		},
		
		formatDate(date) {
			const year = date.getFullYear();
			const month = String(date.getMonth() + 1).padStart(2, '0');
			const day = String(date.getDate()).padStart(2, '0');
			return `${year}-${month}-${day}`;
		},
		selectFloor(index) {
			this.currentFloorIndex = index;
			this.selectedRoom = null; // 切换楼层后清空选择
		},
		selectRoom(room) {
			if (room.status === 'maintenance') {
				uni.showToast({
					title: '该教室正在维护中',
					icon: 'none'
				});
				return;
			}
			
			this.selectedRoom = room;
			this.selectedTimeSlots = []; // 重置时间段选择
		},
		closeRoomSelection() {
			this.selectedRoom = null;
			this.selectedTimeSlots = [];
		},
		zoomIn() {
			this.mapScaleValue = Math.min(this.mapScaleValue + 0.2, 3);
		},
		zoomOut() {
			this.mapScaleValue = Math.max(this.mapScaleValue - 0.2, 0.5);
		},
		resetMap() {
			this.mapScaleValue = 1;
			// 重置位置可能需要更复杂的逻辑，暂时只重置缩放
		},
		onDateChange(e) {
			this.currentDate = e.detail.value;
			this.selectedTimeSlots = []; // 切换日期时重置时间段选择
			this.fetchBookingsForDate(this.currentDate); // 切换日期后，重新获取预定数据
		},
		toggleTimeSlot(index, slot) {
			if (!this.isSlotAvailable(slot)) return;
			
			const slotIndex = this.selectedTimeSlots.indexOf(index);
			
			// 如果时间段未被选中，则添加
			if (slotIndex === -1) {
				// 检查是否是连续的时间段
				if (this.selectedTimeSlots.length > 0) {
					const selectedSlots = [...this.selectedTimeSlots].sort((a, b) => a - b);
					const lastSlot = selectedSlots[selectedSlots.length - 1];
					const firstSlot = selectedSlots[0];
					
					// 只允许选择连续的时间段
					if (index === lastSlot + 1 || index === firstSlot - 1) {
						this.selectedTimeSlots.push(index);
					} else {
						uni.showToast({
							title: '请选择连续的时间段',
							icon: 'none'
						});
					}
				} else {
					// 第一次选择
					this.selectedTimeSlots.push(index);
				}
			} else {
				// 如果时间段已被选中，检查是否可以取消选择
				// 只能取消两端的时间段，不能从中间取消
				const selectedSlots = [...this.selectedTimeSlots].sort((a, b) => a - b);
				if (index === selectedSlots[0] || index === selectedSlots[selectedSlots.length - 1]) {
					this.selectedTimeSlots.splice(slotIndex, 1);
				} else {
					uni.showToast({
						title: '只能取消两端的时间段',
						icon: 'none'
					});
				}
			}
		},
		isSlotAvailable(slot) {
			if (!this.selectedRoom) return false;
			
			// 1. 获取当前时间段的开始小时 (e.g., "08:00-09:00" -> 8)
			const slotStartHour = parseInt(slot.time.split('-')[0].split(':')[0]);

			// 2. 遍历当天的所有预定记录
			for (const booking of this.dailyBookings) {
				// 3. 检查这条预定记录是否属于当前选中的教室
				if (booking.lb77_classroom_id_number === this.selectedRoom.code) {
					// 4. 将预定记录的开始/结束时间从秒转换为小时
					const bookingStartHour = booking.lb77_start_time / 3600;
					const bookingEndHour = booking.lb77_end_time / 3600;
					
					// 5. 判断当前时间段的开始小时，是否落在 [预定开始小时, 预定结束小时) 这个区间内
					if (slotStartHour >= bookingStartHour && slotStartHour < bookingEndHour) {
						return false; // 时间段重叠，不可用
					}
				}
			}
			
			return true; // 没有发现冲突，可用
		},
		getSelectedTimeRange() {
			if (this.selectedTimeSlots.length === 0) return '';
			
			const sortedSlots = [...this.selectedTimeSlots].sort((a, b) => a - b);
			const startSlot = this.timeSlots[sortedSlots[0]];
			const endSlot = this.timeSlots[sortedSlots[sortedSlots.length - 1]];
			
			// 提取开始和结束时间
			const startTime = startSlot.time.split('-')[0];
			const endTime = endSlot.time.split('-')[1];
			
			return `${startTime}-${endTime}`;
		},
		
		generateRandomString(length) {
			const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
			let result = '';
			const charactersLength = characters.length;
			for (let i = 0; i < length; i++) {
				result += characters.charAt(Math.floor(Math.random() * charactersLength));
			}
			return result;
		},

		async submitBooking() {
			if (this.selectedTimeSlots.length === 0) {
				uni.showToast({
					title: '请选择时间段',
					icon: 'none'
				});
				return;
			}
			
			uni.showLoading({
				title: '正在提交预约...'
			});
			
			const timeRange = this.getSelectedTimeRange();
			const [startTimeStr, endTimeStr] = timeRange.split('-');

			// 根据API报错信息和数据存储结果，时间参数必须为Integer类型，且单位为秒
			const startTimeInHours = parseInt(startTimeStr.split(':')[0]);
			const endTimeInHours = parseInt(endTimeStr.split(':')[0]);

			const startTime = startTimeInHours * 3600; // 将小时转换为秒
			const endTime = endTimeInHours * 3600;   // 将小时转换为秒
			
			const bookingData = {
				number: this.generateRandomString(5), // 随机生成一个5位数的单据编号
				name: `预约-${this.selectedRoom.name}-${this.currentDate}`,
				lb77_booking_date: this.currentDate,
				lb77_start_time: startTime, // 发送换算后的秒数, e.g., 28800
				lb77_end_time: endTime,     // 发送换算后的秒数, e.g., 32400
				lb77_status: 'confirmed', // 状态直接设置为 confirmed
				lb77_classroom_id_number: this.selectedRoom.code // 关联教室的编号
			};

			try {
				const response = await KingdeeAgentService.saveClassroomBooking(bookingData);
				uni.hideLoading();

				if (response && response.data && response.data.successCount > 0) {
				uni.showModal({
					title: '预约成功',
						content: `您已成功预约${this.selectedRoom.name}，日期：${this.currentDate}，时间：${timeRange}`,
					showCancel: false,
					success: (res) => {
						if (res.confirm) {
								// 刷新当天的预定数据，以立即反映出刚刚完成的预定
								this.fetchBookingsForDate(this.currentDate); 
								
							// 重置选择
							this.selectedRoom = null;
							this.selectedTimeSlots = [];
						}
					}
				});
				} else {
					// 尝试从金蝶返回的复杂结构中提取更详细的错误信息
					const errorResult = response?.data?.result?.[0];
					const errorMessage = errorResult?.errors?.[0]?.msg || '未知错误，请联系管理员';
					uni.showToast({
						title: `预约失败: ${errorMessage}`,
						icon: 'none',
						duration: 3000
					});
				}
			} catch (error) {
				uni.hideLoading();
				console.error('提交预约请求失败:', error);
				uni.showToast({
					title: '网络错误，提交失败',
					icon: 'none'
				});
			}
		},
		onMapChange(e) {
			// 记录地图的位移和缩放，如果需要的话
			this.mapX = e.detail.x;
			this.mapY = e.detail.y;
		},
		async fetchBookingsForDate(date) {
			this.dailyBookings = []; // 查询前先清空
			try {
				// 这里不显示loading，因为是后台更新，避免频繁闪烁
				const response = await KingdeeAgentService.getClassroomBookings(date);
				if (response && response.data && Array.isArray(response.data.rows)) {
					this.dailyBookings = response.data.rows;
					console.log(`获取到 ${date} 的 ${this.dailyBookings.length} 条预定记录。`);
				}
			} catch (error) {
				console.error(`获取日期 ${date} 的预定记录失败:`, error);
				// 即使失败也要保证页面流程继续
			}
		},
		toggleEquipment(equipment) {
			const index = this.selectedEquipments.indexOf(equipment);
			if (index > -1) {
				// 如果已选中，则取消选中
				this.selectedEquipments.splice(index, 1);
			} else {
				// 如果未选中，则添加选中
				this.selectedEquipments.push(equipment);
			}
			// 筛选后清空已选中的教室，避免UI显示异常
			this.selectedRoom = null;
		},
		goToMyReservations() {
			uni.navigateTo({
				url: '/pages/features/my-classroom-reservations'
			});
		}
	}
}
</script>

<style>
.classroom-page {
	display: flex;
	flex-direction: column;
	height: 100vh;
	background-color: #FFFFFF;
}

/* 楼层选择器样式 */
.floor-selector {
	padding: 20rpx;
	background-color: #FFFFFF;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
	z-index: 10;
}

.building-picker {
	margin-bottom: 20rpx;
}

.picker-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 80rpx;
	padding: 0 20rpx;
	background-color: #f5f5f5;
	border-radius: 10rpx;
}

.picker-text {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.picker-arrow {
	font-size: 24rpx;
	color: #999;
}

.floor-tabs {
	display: flex;
	justify-content: space-around;
	background-color: #fff;
}

.floor-tab {
	padding: 15rpx 30rpx;
	font-size: 28rpx;
	color: #666;
	border-bottom: 4rpx solid transparent;
	transition: all 0.3s;
}

.floor-tab.active {
	color: #2979ff;
	font-weight: bold;
	border-bottom-color: #2979ff;
}

/* 设备筛选器样式 */
.equipment-filter {
	display: flex;
	flex-wrap: wrap;
	padding: 10rpx 20rpx;
	background-color: #f8f8f8;
	border-top: 1rpx solid #eee;
	border-bottom: 1rpx solid #eee;
}

.filter-tag {
	padding: 8rpx 20rpx;
	margin: 10rpx;
	background-color: #fff;
	border: 1rpx solid #ddd;
	border-radius: 30rpx;
	font-size: 24rpx;
	color: #555;
	transition: all 0.3s ease;
}

.filter-tag.active {
	background-color: #eaf2ff;
	color: #2979ff;
	border-color: #a3c7ff;
	font-weight: bold;
}

/* 3D楼层平面图样式 */
.floor-map-container {
	flex: 1;
	position: relative;
	padding: 20rpx;
	overflow: hidden;
}

.map-legend {
	display: flex;
	margin-bottom: 10rpx;
}

.legend-item {
	display: flex;
	align-items: center;
	margin-right: 20rpx;
	font-size: 24rpx;
	color: #666;
}

.legend-color {
	width: 20rpx;
	height: 20rpx;
	border-radius: 4rpx;
	margin-right: 6rpx;
}

.legend-color.available {
	background-color: #4CD964;
}

.legend-color.occupied {
	background-color: #FF3B30;
}

.legend-color.maintenance {
	background-color: #FFCC00;
}

.floor-map {
	width: 100%;
	height: 100%;
	position: relative;
	background-color: #f9f9f9;
	border-radius: 10rpx;
	overflow: hidden;
}

.movable-area {
	width: 100%;
	height: 100%;
}

.movable-view {
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.map-image {
	width: 100%;
	height: 100%;
}

.room-marker {
	position: absolute;
	width: 60rpx;
	height: 60rpx;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.2);
	transform: translate(-50%, -50%);
	z-index: 5;
}

.room-marker.available {
	background-color: #4CD964;
}

.room-marker.occupied {
	background-color: #FF3B30;
}

.room-marker.maintenance {
	background-color: #FFCC00;
}

.room-code {
	font-size: 20rpx;
	color: #FFFFFF;
	font-weight: bold;
}

.map-controls {
	position: absolute;
	right: 30rpx;
	bottom: 30rpx;
	display: flex;
	flex-direction: column;
}

.control-btn {
	width: 80rpx;
	height: 80rpx;
	background-color: #FFFFFF;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 20rpx;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.control-btn image {
	width: 40rpx;
	height: 40rpx;
}

/* 教室列表样式 */
.room-list {
	height: 300rpx;
	background-color: #FFFFFF;
	padding: 20rpx;
	border-top: 1rpx solid #f0f0f0;
}

.list-title {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 20rpx;
}

.list-scroll {
	height: calc(100% - 50rpx);
}

.room-item {
	display: flex;
	align-items: center;
	padding: 20rpx;
	border-bottom: 1rpx solid #f0f0f0;
}

.room-item.selected {
	background-color: #f0f8ff;
}

.room-status-dot {
	width: 20rpx;
	height: 20rpx;
	border-radius: 50%;
	margin-right: 20rpx;
}

.room-status-dot.available {
	background-color: #4CD964;
}

.room-status-dot.occupied {
	background-color: #FF3B30;
}

.room-status-dot.maintenance {
	background-color: #FFCC00;
}

.room-info {
	flex: 1;
}

.room-name {
	font-size: 28rpx;
	color: #333;
	font-weight: bold;
}

.room-capacity {
	font-size: 24rpx;
	color: #999;
	margin-top: 6rpx;
}

.room-equipment {
	display: flex;
	margin-left: 20rpx;
}

.equipment-icon {
	width: 40rpx;
	height: 40rpx;
	margin-left: 10rpx;
}

.equipment-icon image {
	width: 100%;
	height: 100%;
}

/* 时间选择器样式 */
.time-selector {
	background-color: #FFFFFF;
	padding: 20rpx;
	border-top: 1rpx solid #f0f0f0;
	animation: slideUp 0.3s ease;
}

@keyframes slideUp {
	from {
		transform: translateY(100%);
	}
	to {
		transform: translateY(0);
	}
}

.selected-room-info {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.room-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.close-btn {
	width: 60rpx;
	height: 60rpx;
	line-height: 60rpx;
	text-align: center;
	font-size: 40rpx;
	color: #999;
	background: none;
	padding: 0;
}

.date-selector, .time-slots-container {
	margin-bottom: 30rpx;
}

.date-title, .time-title {
	font-size: 28rpx;
	color: #666;
	margin-bottom: 10rpx;
}

.date-picker {
	height: 80rpx;
	background-color: #f5f5f5;
	border-radius: 10rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 20rpx;
	font-size: 28rpx;
}

.time-slots {
	white-space: nowrap;
	height: 120rpx;
}

.time-slot-item {
	display: inline-block;
	width: 180rpx;
	height: 100rpx;
	margin-right: 20rpx;
	border-radius: 10rpx;
	background-color: #f5f5f5;
	padding: 10rpx;
	position: relative;
}

.time-slot-item.selected {
	background-color: #e6f2ff;
	border: 2rpx solid #007AFF;
}

.time-slot-item.disabled {
	background-color: #f5f5f5;
	opacity: 0.5;
}

.time-text {
	font-size: 28rpx;
	color: #333;
	display: block;
}

.slot-status {
	font-size: 24rpx;
	color: #999;
	margin-top: 10rpx;
	display: block;
}

.time-slot-item.selected .slot-status {
	color: #007AFF;
}

.booking-summary {
	background-color: #f9f9f9;
	border-radius: 10rpx;
	padding: 20rpx;
	margin-bottom: 30rpx;
}

.summary-title {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 10rpx;
}

.summary-item {
	display: flex;
	margin-top: 10rpx;
}

.summary-label {
	width: 100rpx;
	font-size: 26rpx;
	color: #666;
}

.summary-value {
	flex: 1;
	font-size: 26rpx;
	color: #333;
}

.submit-btn {
	height: 90rpx;
	line-height: 90rpx;
	background-color: #007AFF;
	color: #FFFFFF;
	font-size: 32rpx;
	border-radius: 45rpx;
}

.submit-btn:disabled {
	background-color: #C8C7CC;
	cursor: not-allowed;
}

/* 我的预约 FAB */
.fab {
	position: fixed;
	bottom: 160rpx;
	right: 40rpx;
	background-color: #007AFF;
	color: white;
	border-radius: 50px;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 20rpx 30rpx;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	z-index: 1000;
	transition: background-color 0.3s;
}

.fab:active {
	background-color: #0056b3;
}

.fab-icon {
	width: 40rpx;
	height: 40rpx;
	margin-right: 10rpx;
}

.fab-text {
	font-size: 28rpx;
	font-weight: 500;
	color: white;
}
</style> 
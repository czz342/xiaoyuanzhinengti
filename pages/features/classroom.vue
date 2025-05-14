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
			
			<!-- 3D楼层图，实际应用中这里应该是WebGL渲染的3D视图 -->
			<view class="floor-map">
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
			</view>
			
			<view class="map-controls">
				<view class="control-btn zoom-in" @tap="zoomIn">
					<image src="/static/images/zoom-in.png" mode="aspectFit"></image>
				</view>
				<view class="control-btn zoom-out" @tap="zoomOut">
					<image src="/static/images/zoom-out.png" mode="aspectFit"></image>
				</view>
				<view class="control-btn rotate" @tap="rotate">
					<image src="/static/images/rotate.png" mode="aspectFit"></image>
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
	</view>
</template>

<script>
export default {
	data() {
		return {
			// 建筑物和楼层数据
			buildings: ['理科楼', '工科楼', '文科楼', '图书馆'],
			currentBuildingIndex: 0,
			floors: ['1F', '2F', '3F', '4F', '5F'],
			currentFloorIndex: 0,
			
			// 地图缩放和旋转控制
			mapScale: 1,
			mapRotation: 0,
			
			// 选中的教室
			selectedRoom: null,
			
			// 日期选择
			currentDate: '2023-05-15',
			startDate: '2023-05-15',
			endDate: '2023-06-15',
			
			// 时间段选择
			selectedTimeSlots: [],
			
			// 模拟的楼层教室数据
			roomsData: {
				'理科楼': {
					'1F': [
						{
							id: 101,
							code: 'A101',
							name: '理科楼 A101',
							capacity: 60,
							status: 'available',
							hasProjector: true,
							hasComputer: true,
							hasAirConditioner: true,
							position: { x: 150, y: 180 },
							availableTimeSlots: [0, 1, 2, 3, 4, 7, 8, 9]
						},
						{
							id: 102,
							code: 'A102',
							name: '理科楼 A102',
							capacity: 120,
							status: 'occupied',
							hasProjector: true,
							hasComputer: true,
							hasAirConditioner: true,
							position: { x: 300, y: 180 },
							availableTimeSlots: [4, 5, 6, 7, 8, 9]
						},
						{
							id: 103,
							code: 'A103',
							name: '理科楼 A103',
							capacity: 40,
							status: 'maintenance',
							hasProjector: false,
							hasComputer: false,
							hasAirConditioner: true,
							position: { x: 450, y: 180 },
							availableTimeSlots: []
						},
						{
							id: 104,
							code: 'A104',
							name: '理科楼 A104',
							capacity: 80,
							status: 'available',
							hasProjector: true,
							hasComputer: true,
							hasAirConditioner: true,
							position: { x: 150, y: 300 },
							availableTimeSlots: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
						},
						{
							id: 105,
							code: 'A105',
							name: '理科楼 A105',
							capacity: 60,
							status: 'available',
							hasProjector: true,
							hasComputer: false,
							hasAirConditioner: true,
							position: { x: 300, y: 300 },
							availableTimeSlots: [0, 1, 2, 5, 6, 7, 8, 9]
						}
					],
					'2F': [
						// 2楼教室数据
					]
				}
			},
			
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
			]
		}
	},
	computed: {
		currentFloorRooms() {
			const building = this.buildings[this.currentBuildingIndex];
			const floor = this.floors[this.currentFloorIndex];
			
			if (this.roomsData[building] && this.roomsData[building][floor]) {
				return this.roomsData[building][floor];
			}
			return [];
		}
	},
	methods: {
		onBuildingChange(e) {
			this.currentBuildingIndex = e.detail.value;
			this.currentFloorIndex = 0; // 重置为1楼
			this.selectedRoom = null;
			this.selectedTimeSlots = [];
		},
		selectFloor(index) {
			this.currentFloorIndex = index;
			this.selectedRoom = null;
			this.selectedTimeSlots = [];
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
			if (this.mapScale < 2) {
				this.mapScale += 0.1;
			}
		},
		zoomOut() {
			if (this.mapScale > 0.5) {
				this.mapScale -= 0.1;
			}
		},
		rotate() {
			this.mapRotation = (this.mapRotation + 90) % 360;
		},
		onDateChange(e) {
			this.currentDate = e.detail.value;
			this.selectedTimeSlots = []; // 切换日期时重置时间段选择
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
			return this.selectedRoom.availableTimeSlots.includes(slot.id);
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
		submitBooking() {
			if (this.selectedTimeSlots.length === 0) {
				uni.showToast({
					title: '请选择时间段',
					icon: 'none'
				});
				return;
			}
			
			// 模拟提交预约
			uni.showLoading({
				title: '正在提交预约...'
			});
			
			setTimeout(() => {
				uni.hideLoading();
				uni.showModal({
					title: '预约成功',
					content: `您已成功预约${this.selectedRoom.name}，日期：${this.currentDate}，时间：${this.getSelectedTimeRange()}`,
					showCancel: false,
					success: (res) => {
						if (res.confirm) {
							// 重置选择
							this.selectedRoom = null;
							this.selectedTimeSlots = [];
						}
					}
				});
			}, 1500);
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
	border-bottom: 1rpx solid #f0f0f0;
}

.floor-tab {
	flex: 1;
	height: 80rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 28rpx;
	color: #666;
	position: relative;
}

.floor-tab.active {
	color: #007AFF;
	font-weight: bold;
}

.floor-tab.active::after {
	content: '';
	position: absolute;
	bottom: 0;
	left: 25%;
	width: 50%;
	height: 6rpx;
	background-color: #007AFF;
	border-radius: 3rpx;
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

.map-image {
	width: 100%;
	height: 100%;
	transform-origin: center;
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

.submit-btn[disabled] {
	background-color: #cccccc;
	color: #FFFFFF;
}
</style> 
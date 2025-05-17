<template>
	<view class="services-page">
		<!-- 九宫格导航区域 -->
		<view class="grid-container">
			<view class="grid-header">
				<text class="header-title">校园服务大厅</text>
				<view class="header-subtitle">便捷获取各项校园服务</view>
			</view>
			
			<!-- 学业事务区域 -->
			<view class="grid-section">
				<view class="section-title">学业事务</view>
				<view class="grid-row">
					<!-- 课表查询 -->
					<view class="grid-item" @tap="navigateTo('/pages/features/schedule')">
						<view class="grid-icon academic">
							<image src="/static/images/schedule.png" mode="aspectFit"></image>
						</view>
						<text class="grid-text">课表查询</text>
						<view class="grid-badge" v-if="scheduleCount > 0">{{scheduleCount}}</view>
					</view>
					
					<!-- 教室预约 -->
					<view class="grid-item" @tap="navigateTo('/pages/features/classroom')">
						<view class="grid-icon academic">
							<image src="/static/images/classroom.png" mode="aspectFit"></image>
						</view>
						<text class="grid-text">教室预约</text>
						<view class="grid-badge" v-if="classroomCount > 0">{{classroomCount}}</view>
					</view>
					
					<!-- 图书借阅 -->
					<view class="grid-item" @tap="navigateTo('/pages/features/library')">
						<view class="grid-icon academic">
							<image src="/static/images/library.png" mode="aspectFit"></image>
						</view>
						<text class="grid-text">图书借阅</text>
						<view class="grid-badge" v-if="libraryCount > 0">{{libraryCount}}</view>
					</view>
					
					<!-- 自习室预约 -->
					<view class="grid-item" @tap="navigateTo('/pages/features/studyroom')">
						<view class="grid-icon academic">
							<image src="/static/images/study.png" mode="aspectFit"></image>
						</view>
						<text class="grid-text">自习室预约</text>
						<view class="grid-badge" v-if="studyRoomCount > 0">{{studyRoomCount}}</view>
					</view>
				</view>
			</view>
			
			<!-- 生活服务区域 -->
			<view class="grid-section">
				<view class="section-title">生活服务</view>
				<view class="grid-row">
					<!-- 食堂点餐 -->
					<view class="grid-item" @tap="navigateTo('/pages/features/food')">
						<view class="grid-icon lifestyle">
							<image src="/static/images/food.png" mode="aspectFit"></image>
						</view>
						<text class="grid-text">食堂点餐</text>
						<view class="grid-badge" v-if="foodSpecialCount > 0">{{foodSpecialCount}}</view>
					</view>
					
					<!-- 快递服务 -->
					<view class="grid-item" @tap="navigateTo('/pages/features/express')">
						<view class="grid-icon lifestyle">
							<image src="/static/images/express.png" mode="aspectFit"></image>
						</view>
						<text class="grid-text">快递服务</text>
						<view class="grid-badge" v-if="expressCount > 0">{{expressCount}}</view>
					</view>
					
					<!-- 共享设备 -->
					<view class="grid-item" @tap="navigateTo('/pages/features/shared-devices')">
						<view class="grid-icon lifestyle">
							<image src="/static/images/devices.png" mode="aspectFit"></image>
						</view>
						<text class="grid-text">共享设备</text>
						<view class="grid-badge" v-if="deviceCount > 0">{{deviceCount}}</view>
					</view>
				</view>
			</view>
			
			<!-- 健康保障区域 -->
			<view class="grid-section">
				<view class="section-title">健康保障</view>
				<view class="grid-row">
					<!-- 心理测评 -->
					<view class="grid-item" @tap="navigateTo('/pages/features/psychological-assessment')">
						<view class="grid-icon health">
							<image src="/static/images/psychology.png" mode="aspectFit"></image>
						</view>
						<text class="grid-text">心理测评</text>
						<view class="grid-badge" v-if="psychologyCount > 0">{{psychologyCount}}</view>
					</view>
					
					<!-- 校医挂号 -->
					<view class="grid-item" @tap="navigateTo('/pages/features/medical')">
						<view class="grid-icon health">
							<image src="/static/images/medical.png" mode="aspectFit"></image>
						</view>
						<text class="grid-text">校医挂号</text>
						<view class="grid-badge" v-if="medicalCount > 0">{{medicalCount}}</view>
					</view>
					
					<!-- 紧急求助 -->
					<view class="grid-item" @tap="navigateTo('/pages/features/emergency')">
						<view class="grid-icon health emergency">
							<image src="/static/images/emergency.png" mode="aspectFit"></image>
						</view>
						<text class="grid-text">紧急求助</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 智能推荐信息流 -->
		<view class="recommendation-section">
			<view class="recommendation-header">
				<text class="recommendation-title">智能推荐</text>
				<view class="recommendation-filter" @tap="showFilterOptions">
					<text>筛选</text>
					<image src="/static/images/filter.png" mode="aspectFit"></image>
				</view>
			</view>
			
			<!-- 推荐卡片列表 -->
			<view class="recommendation-list">
				<!-- 教室导航卡片 -->
				<view class="recommendation-card" v-if="isBeforeClass">
					<view class="card-header classroom-header">
						<image src="/static/images/classroom.png" mode="aspectFit" class="card-icon"></image>
						<text class="card-title">即将上课</text>
						<text class="card-time">距离上课还有 {{nextClassTime}} 分钟</text>
					</view>
					<view class="card-content">
						<view class="class-info">
							<text class="class-name">{{nextClass.name}}</text>
							<text class="class-location">{{nextClass.location}}</text>
							<text class="class-teacher">{{nextClass.teacher}}</text>
						</view>
						<view class="navigation-section">
							<view class="navigation-map">
								<image src="/static/images/map.png" mode="aspectFit"></image>
							</view>
							<view class="navigation-actions">
								<button class="nav-btn primary" @tap="startNavigation">立即导航</button>
								<button class="nav-btn secondary" @tap="downloadMaterials">课件下载</button>
							</view>
						</view>
					</view>
				</view>
				
				<!-- 食堂人流量热力图卡片 -->
				<view class="recommendation-card" v-if="isLunchTime">
					<view class="card-header canteen-header">
						<image src="/static/images/food.png" mode="aspectFit" class="card-icon"></image>
						<text class="card-title">食堂人流量</text>
						<text class="card-time">{{currentTime}} 更新</text>
					</view>
					<view class="card-content">
						<view class="heatmap-container">
							<image src="/static/images/heatmap.png" mode="aspectFit" class="heatmap-image"></image>
							<view class="heatmap-legend">
								<view class="legend-item">
									<view class="legend-color low"></view>
									<text>空闲</text>
								</view>
								<view class="legend-item">
									<view class="legend-color medium"></view>
									<text>适中</text>
								</view>
								<view class="legend-item">
									<view class="legend-color high"></view>
									<text>拥挤</text>
								</view>
							</view>
						</view>
						<view class="canteen-recommendation">
							<text class="recommendation-label">推荐食堂：</text>
							<view class="canteen-badges">
								<view class="canteen-badge">
									<text>二食堂</text>
									<view class="badge-status low"></view>
								</view>
								<view class="canteen-badge">
									<text>四食堂</text>
									<view class="badge-status medium"></view>
								</view>
							</view>
						</view>
					</view>
				</view>
				
				<!-- 自习室空位信息卡片 -->
				<view class="recommendation-card" v-if="isExamPeriod">
					<view class="card-header study-header">
						<image src="/static/images/study.png" mode="aspectFit" class="card-icon"></image>
						<text class="card-title">自习室空位</text>
						<text class="card-time">{{currentTime}} 更新</text>
					</view>
					<view class="card-content">
						<view class="study-rooms">
							<view class="study-room" v-for="(room, index) in studyRooms" :key="index">
								<view class="room-header">
									<text class="room-name">{{room.name}}</text>
									<text class="room-status" :class="room.statusClass">{{room.statusText}}</text>
								</view>
								<view class="room-capacity">
									<progress :percent="room.occupancyRate" stroke-width="3" :activeColor="room.statusColor" backgroundColor="#f5f5f5" />
									<text class="capacity-text">空位：{{room.availableSeats}}/{{room.totalSeats}}</text>
								</view>
							</view>
						</view>
						<button class="study-btn" @tap="navigateTo('/pages/features/studyroom')">预约自习座位</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			// 九宫格角标数据
			scheduleCount: 3,
			classroomCount: 0,
			libraryCount: 2,
			foodSpecialCount: 5,
			expressCount: 1,
			deviceCount: 0,
			psychologyCount: 0,
			medicalCount: 0,
			studyRoomCount: 8,
			
			// 场景判断
			isBeforeClass: true,
			isLunchTime: true,
			isExamPeriod: true,
			
			// 时间数据
			currentTime: '12:30',
			nextClassTime: 45,
			
			// 下一节课信息
			nextClass: {
				name: '高等数学（II）',
				location: '理科楼 A306',
				teacher: '张教授'
			},
			
			// 自习室数据
			studyRooms: [
				{
					name: '中央图书馆 3F',
					statusText: '空位较多',
					statusClass: 'status-good',
					statusColor: '#00B578',
					occupancyRate: 60,
					availableSeats: 42,
					totalSeats: 105
				},
				{
					name: '理科楼 自习室',
					statusText: '即将满座',
					statusClass: 'status-warning',
					statusColor: '#FF9500',
					occupancyRate: 85,
					availableSeats: 15,
					totalSeats: 100
				},
				{
					name: '工科楼 自习室',
					statusText: '已满座',
					statusClass: 'status-full',
					statusColor: '#FF3B30',
					occupancyRate: 100,
					availableSeats: 0,
					totalSeats: 80
				}
			]
		}
	},
	onLoad() {
		// 页面加载时可以根据当前时间判断显示哪些推荐卡片
		this.getCurrentTimeInfo();
	},
	methods: {
		navigateTo(url) {
			uni.navigateTo({
				url: url
			});
		},
		showFilterOptions() {
			uni.showActionSheet({
				itemList: ['全部', '学业相关', '生活服务', '健康服务'],
				success: (res) => {
					uni.showToast({
						title: '已选择：' + ['全部', '学业相关', '生活服务', '健康服务'][res.tapIndex],
						icon: 'none'
					});
				}
			});
		},
		getCurrentTimeInfo() {
			// 获取当前时间，并判断场景
			const now = new Date();
			const hours = now.getHours();
			const minutes = now.getMinutes();
			
			this.currentTime = hours + ':' + (minutes < 10 ? '0' + minutes : minutes);
			
			// 这里可以根据当前时间判断场景，暂时用固定值模拟
			// this.isBeforeClass = (hours >= 7 && hours < 9) || (hours >= 13 && hours < 15);
			// this.isLunchTime = hours >= 11 && hours < 13;
			// this.isExamPeriod = this.checkIfExamPeriod();
		},
		startNavigation() {
			uni.showToast({
				title: '正在导航至：' + this.nextClass.location,
				icon: 'none'
			});
		},
		downloadMaterials() {
			uni.showLoading({
				title: '课件下载中...'
			});
			
			setTimeout(() => {
				uni.hideLoading();
				uni.showToast({
					title: '下载完成',
					icon: 'success'
				});
			}, 2000);
		},
		bookStudyRoom() {
			uni.navigateTo({
				url: '/pages/features/studyroom'
			});
		},
		checkIfExamPeriod() {
			// 检查当前是否为考试周，这里用固定值模拟
			return true;
		}
	}
}
</script>

<style>
.services-page {
	background-color: #f5f5f5;
	min-height: 100vh;
	padding-bottom: 30rpx;
}

/* 九宫格导航区域样式 */
.grid-container {
	background-color: #ffffff;
	padding: 30rpx 30rpx 10rpx;
	border-radius: 0 0 30rpx 30rpx;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	margin-bottom: 20rpx;
}

.grid-header {
	margin-bottom: 30rpx;
}

.header-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
}

.header-subtitle {
	font-size: 24rpx;
	color: #999;
	margin-top: 10rpx;
}

.grid-section {
	margin-bottom: 30rpx;
}

.section-title {
	font-size: 28rpx;
	color: #666;
	margin-bottom: 20rpx;
}

.grid-row {
	display: flex;
	justify-content: space-between;
}

.grid-item {
	width: 30%;
	text-align: center;
	position: relative;
	margin-bottom: 30rpx;
}

.grid-icon {
	width: 100rpx;
	height: 100rpx;
	margin: 0 auto;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
}

.grid-icon.academic {
	background-color: #e6f2ff;
}

.grid-icon.lifestyle {
	background-color: #e6fff2;
}

.grid-icon.health {
	background-color: #fff2e6;
}

.grid-icon.emergency {
	background-color: #ffe6e6;
}

.grid-icon image {
	width: 60rpx;
	height: 60rpx;
}

.grid-text {
	font-size: 26rpx;
	color: #333;
	margin-top: 10rpx;
	display: block;
}

.grid-badge {
	position: absolute;
	top: -10rpx;
	right: 20rpx;
	background-color: #FF3B30;
	color: #fff;
	border-radius: 20rpx;
	font-size: 20rpx;
	padding: 2rpx 10rpx;
	min-width: 16rpx;
	height: 32rpx;
	line-height: 32rpx;
}

/* 智能推荐卡片区域样式 */
.recommendation-section {
	padding: 0 30rpx;
}

.recommendation-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.recommendation-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.recommendation-filter {
	display: flex;
	align-items: center;
	font-size: 24rpx;
	color: #666;
}

.recommendation-filter image {
	width: 28rpx;
	height: 28rpx;
	margin-left: 6rpx;
}

.recommendation-list {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.recommendation-card {
	background-color: #fff;
	border-radius: 20rpx;
	overflow: hidden;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
}

.card-header {
	padding: 20rpx;
	display: flex;
	align-items: center;
}

.classroom-header {
	background-color: #e6f2ff;
}

.canteen-header {
	background-color: #e6fff2;
}

.study-header {
	background-color: #fff2e6;
}

.card-icon {
	width: 40rpx;
	height: 40rpx;
	margin-right: 10rpx;
}

.card-title {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
	flex: 1;
}

.card-time {
	font-size: 24rpx;
	color: #999;
}

.card-content {
	padding: 20rpx;
}

/* 即将上课卡片样式 */
.class-info {
	margin-bottom: 20rpx;
}

.class-name {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	display: block;
}

.class-location, .class-teacher {
	font-size: 26rpx;
	color: #666;
	margin-top: 10rpx;
	display: block;
}

.navigation-section {
	display: flex;
	border-top: 1rpx solid #f0f0f0;
	padding-top: 20rpx;
}

.navigation-map {
	flex: 1;
	height: 150rpx;
	border-radius: 10rpx;
	overflow: hidden;
	margin-right: 20rpx;
}

.navigation-map image {
	width: 100%;
	height: 100%;
}

.navigation-actions {
	width: 180rpx;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

.nav-btn {
	height: 70rpx;
	line-height: 70rpx;
	border-radius: 35rpx;
	font-size: 26rpx;
	padding: 0;
}

.nav-btn.primary {
	background-color: #007AFF;
	color: #fff;
}

.nav-btn.secondary {
	background-color: #f5f5f5;
	color: #333;
}

/* 食堂人流量卡片样式 */
.heatmap-container {
	margin-bottom: 20rpx;
}

.heatmap-image {
	width: 100%;
	height: 200rpx;
	border-radius: 10rpx;
}

.heatmap-legend {
	display: flex;
	justify-content: flex-end;
	margin-top: 10rpx;
}

.legend-item {
	display: flex;
	align-items: center;
	margin-left: 20rpx;
	font-size: 22rpx;
	color: #999;
}

.legend-color {
	width: 20rpx;
	height: 10rpx;
	border-radius: 5rpx;
	margin-right: 6rpx;
}

.legend-color.low {
	background-color: #00B578;
}

.legend-color.medium {
	background-color: #FF9500;
}

.legend-color.high {
	background-color: #FF3B30;
}

.canteen-recommendation {
	display: flex;
	align-items: center;
}

.recommendation-label {
	font-size: 26rpx;
	color: #666;
}

.canteen-badges {
	display: flex;
	flex: 1;
}

.canteen-badge {
	display: flex;
	align-items: center;
	background-color: #f5f5f5;
	padding: 6rpx 16rpx;
	border-radius: 20rpx;
	margin-left: 20rpx;
	font-size: 24rpx;
	color: #333;
}

.badge-status {
	width: 16rpx;
	height: 16rpx;
	border-radius: 50%;
	margin-left: 10rpx;
}

.badge-status.low {
	background-color: #00B578;
}

.badge-status.medium {
	background-color: #FF9500;
}

.badge-status.high {
	background-color: #FF3B30;
}

/* 自习室空位卡片样式 */
.study-rooms {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
	margin-bottom: 20rpx;
}

.study-room {
	background-color: #f9f9f9;
	border-radius: 10rpx;
	padding: 15rpx;
}

.room-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 10rpx;
}

.room-name {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
}

.room-status {
	font-size: 22rpx;
	padding: 4rpx 10rpx;
	border-radius: 6rpx;
}

.status-good {
	background-color: #e6fff2;
	color: #00B578;
}

.status-warning {
	background-color: #fff9e6;
	color: #FF9500;
}

.status-full {
	background-color: #ffe6e6;
	color: #FF3B30;
}

.room-capacity {
	margin-top: 10rpx;
}

.capacity-text {
	font-size: 22rpx;
	color: #999;
	display: block;
	margin-top: 6rpx;
}

.study-btn {
	margin-top: 20rpx;
	background-color: #007AFF;
	color: #fff;
	height: 80rpx;
	line-height: 80rpx;
	border-radius: 40rpx;
	font-size: 28rpx;
}
</style>
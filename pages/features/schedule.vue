<template>
	<view class="schedule-page">
		<!-- 日期选择器 -->
		<view class="date-selector">
			<view class="date-arrow" @tap="changeDate(-1)">
				<image src="/static/images/arrow-left.png" mode="aspectFit"></image>
			</view>
			<view class="date-display" @tap="showDatePicker">
				<text class="date-text">{{currentDateDisplay}}</text>
				<text class="date-label">{{currentWeekday}}</text>
			</view>
			<view class="date-arrow" @tap="changeDate(1)">
				<image src="/static/images/arrow-right.png" mode="aspectFit"></image>
			</view>
		</view>
		
		<!-- 时间轴课表视图 -->
		<scroll-view scroll-y="true" class="schedule-container">
			<view class="timeline-container">
				<!-- 时间刻度 -->
				<view class="timeline-scale">
					<view class="time-slot" v-for="slot in timeSlots" :key="slot.id">
						<text class="time-text">{{slot.time}}</text>
						<view class="time-line"></view>
					</view>
				</view>
				
				<!-- 课程列表 -->
				<view class="course-container">
					<view 
						class="course-card" 
						v-for="course in courses" 
						:key="course.id" 
						:style="{ top: calculateTop(course.startTime) + 'rpx', height: calculateHeight(course.startTime, course.endTime) + 'rpx', backgroundColor: course.color }"
						@tap="showCourseDetail(course)"
					>
						<view class="course-content">
							<text class="course-name">{{course.name}}</text>
							<text class="course-location">{{course.location}}</text>
							<text class="course-time">{{course.startTime}} - {{course.endTime}}</text>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		
		<!-- 课程详情弹窗 -->
		<view class="course-detail-popup" v-if="showDetail">
			<view class="popup-mask" @tap="hideDetail"></view>
			<view class="popup-content">
				<view class="popup-header" :style="{ backgroundColor: currentCourse.color }">
					<text class="popup-title">{{currentCourse.name}}</text>
					<view class="popup-close" @tap="hideDetail">
						<image src="/static/images/close.png" mode="aspectFit"></image>
					</view>
				</view>
				
				<view class="popup-body">
					<view class="detail-item">
						<view class="detail-icon">
							<image src="/static/images/time.png" mode="aspectFit"></image>
						</view>
						<view class="detail-info">
							<text class="detail-label">上课时间</text>
							<text class="detail-value">{{currentCourse.startTime}} - {{currentCourse.endTime}}</text>
						</view>
					</view>
					
					<view class="detail-item">
						<view class="detail-icon">
							<image src="/static/images/location.png" mode="aspectFit"></image>
						</view>
						<view class="detail-info">
							<text class="detail-label">上课地点</text>
							<text class="detail-value">{{currentCourse.location}}</text>
						</view>
					</view>
					
					<view class="detail-item">
						<view class="detail-icon">
							<image src="/static/images/teacher.png" mode="aspectFit"></image>
						</view>
						<view class="detail-info">
							<text class="detail-label">任课教师</text>
							<text class="detail-value">{{currentCourse.teacher}}</text>
						</view>
					</view>
					
					<view class="detail-item">
						<view class="detail-icon">
							<image src="/static/images/book.png" mode="aspectFit"></image>
						</view>
						<view class="detail-info">
							<text class="detail-label">课程教材</text>
							<text class="detail-value">{{currentCourse.textbook}}</text>
						</view>
					</view>
					
					<view class="action-buttons">
						<button class="action-btn primary" @tap="navigateToCourse">
							<image src="/static/images/navigation.png" mode="aspectFit"></image>
							<text>一键导航</text>
						</button>
						<button class="action-btn secondary" @tap="downloadMaterials">
							<image src="/static/images/download.png" mode="aspectFit"></image>
							<text>课件下载</text>
						</button>
						<button class="action-btn secondary" @tap="setReminder">
							<image src="/static/images/reminder.png" mode="aspectFit"></image>
							<text>上课提醒</text>
						</button>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 日期选择器弹窗 -->
		<uni-calendar 
			:insert="false"
			:lunar="true"
			:start-date="'2023-01-01'"
			:end-date="'2023-12-31'"
			@confirm="onDateConfirm"
			v-if="showCalendar"
		/>
	</view>
</template>

<script>
export default {
	data() {
		return {
			currentDate: new Date(),
			showCalendar: false,
			showDetail: false,
			currentCourse: {},
			timeSlots: [
				{ id: 1, time: '08:00' },
				{ id: 2, time: '09:00' },
				{ id: 3, time: '10:00' },
				{ id: 4, time: '11:00' },
				{ id: 5, time: '12:00' },
				{ id: 6, time: '13:00' },
				{ id: 7, time: '14:00' },
				{ id: 8, time: '15:00' },
				{ id: 9, time: '16:00' },
				{ id: 10, time: '17:00' },
				{ id: 11, time: '18:00' },
				{ id: 12, time: '19:00' },
				{ id: 13, time: '20:00' },
				{ id: 14, time: '21:00' }
			],
			courses: [
				{
					id: 1,
					name: '高等数学（II）',
					teacher: '张教授',
					location: '理科楼 A306',
					startTime: '08:00',
					endTime: '09:40',
					textbook: '《高等数学》（第七版）同济大学数学系',
					color: '#DFEEFF'
				},
				{
					id: 2,
					name: '大学英语（4）',
					teacher: '李教授',
					location: '外语楼 B201',
					startTime: '10:00',
					endTime: '11:40',
					textbook: '《大学英语》（第四册）外研社',
					color: '#E6FFF2'
				},
				{
					id: 3,
					name: '数据结构',
					teacher: '王教授',
					location: '计算机楼 C305',
					startTime: '14:00',
					endTime: '15:40',
					textbook: '《数据结构》（C语言版）严蔚敏',
					color: '#FFF2E6'
				},
				{
					id: 4,
					name: '面向对象程序设计',
					teacher: '刘教授',
					location: '计算机楼 机房3',
					startTime: '16:00',
					endTime: '17:40',
					textbook: '《Java程序设计》第5版 耿祥义',
					color: '#FFECF5'
				}
			]
		}
	},
	computed: {
		currentDateDisplay() {
			const year = this.currentDate.getFullYear();
			const month = this.currentDate.getMonth() + 1;
			const day = this.currentDate.getDate();
			return `${year}年${month}月${day}日`;
		},
		currentWeekday() {
			const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
			return weekdays[this.currentDate.getDay()];
		}
	},
	methods: {
		changeDate(offset) {
			const newDate = new Date(this.currentDate);
			newDate.setDate(newDate.getDate() + offset);
			this.currentDate = newDate;
			
			// 在实际应用中，这里应该根据日期加载对应的课程数据
			this.loadCoursesForDate(this.currentDate);
		},
		showDatePicker() {
			this.showCalendar = true;
		},
		onDateConfirm(e) {
			this.currentDate = new Date(e.fulldate);
			this.showCalendar = false;
			
			// 在实际应用中，这里应该根据日期加载对应的课程数据
			this.loadCoursesForDate(this.currentDate);
		},
		loadCoursesForDate(date) {
			// 这里应该是从API获取指定日期的课程数据
			console.log('加载日期的课程：', date);
			// 为演示，这里不做实际加载
		},
		calculateTop(startTime) {
			// 将时间转换为距离顶部的像素值
			const [hours, minutes] = startTime.split(':').map(Number);
			const timeInMinutes = hours * 60 + minutes;
			const startOfDay = 8 * 60; // 8:00 AM
			
			return (timeInMinutes - startOfDay) * 2 + 10; // 2rpx per minute + 10rpx padding
		},
		calculateHeight(startTime, endTime) {
			// 计算课程块的高度
			const [startHours, startMinutes] = startTime.split(':').map(Number);
			const [endHours, endMinutes] = endTime.split(':').map(Number);
			
			const startInMinutes = startHours * 60 + startMinutes;
			const endInMinutes = endHours * 60 + endMinutes;
			
			return (endInMinutes - startInMinutes) * 2 - 20; // 2rpx per minute - 20rpx for gaps
		},
		showCourseDetail(course) {
			this.currentCourse = course;
			this.showDetail = true;
		},
		hideDetail() {
			this.showDetail = false;
		},
		navigateToCourse() {
			uni.showToast({
				title: '正在导航至：' + this.currentCourse.location,
				icon: 'none',
				duration: 2000
			});
			
			// 实际应用中，这里应该调用地图API进行导航
			// 例如调用高德地图API
			setTimeout(() => {
				this.hideDetail();
			}, 2000);
		},
		downloadMaterials() {
			uni.showLoading({
				title: '课件下载中...'
			});
			
			// 模拟下载过程
			setTimeout(() => {
				uni.hideLoading();
				uni.showToast({
					title: '下载完成',
					icon: 'success'
				});
			}, 2000);
		},
		setReminder() {
			// 设置上课提醒
			uni.showToast({
				title: '已设置上课提醒',
				icon: 'success'
			});
		}
	}
}
</script>

<style>
.schedule-page {
	display: flex;
	flex-direction: column;
	height: 100vh;
	background-color: #FFFFFF;
}

/* 日期选择器样式 */
.date-selector {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20rpx 40rpx;
	background-color: #ffffff;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.date-arrow {
	width: 60rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.date-arrow image {
	width: 30rpx;
	height: 30rpx;
}

.date-display {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.date-text {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.date-label {
	font-size: 24rpx;
	color: #999;
	margin-top: 6rpx;
}

/* 时间轴样式 */
.schedule-container {
	flex: 1;
	overflow-y: auto;
}

.timeline-container {
	display: flex;
	padding: 20rpx 0;
	position: relative;
	min-height: 1700rpx; /* 足够高以容纳所有时间段 */
}

.timeline-scale {
	width: 120rpx;
	border-right: 1rpx solid #f0f0f0;
	flex-shrink: 0;
}

.time-slot {
	height: 120rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
}

.time-text {
	font-size: 24rpx;
	color: #999;
	transform: translateY(-50%);
}

.time-line {
	position: absolute;
	right: 0;
	top: 0;
	width: 20rpx;
	height: 1rpx;
	background-color: #f0f0f0;
}

.course-container {
	flex: 1;
	padding: 0 20rpx;
	position: relative;
}

.course-card {
	position: absolute;
	left: 20rpx;
	right: 20rpx;
	border-radius: 16rpx;
	padding: 20rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.course-content {
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

.course-name {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
}

.course-location {
	font-size: 24rpx;
	color: #666;
	margin-top: 10rpx;
}

.course-time {
	font-size: 22rpx;
	color: #999;
	margin-top: auto;
}

/* 课程详情弹窗样式 */
.course-detail-popup {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 9999;
	display: flex;
	align-items: center;
	justify-content: center;
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
	width: 80%;
	background-color: #ffffff;
	border-radius: 20rpx;
	overflow: hidden;
	z-index: 10000;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.15);
}

.popup-header {
	padding: 30rpx;
	position: relative;
}

.popup-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
}

.popup-close {
	position: absolute;
	top: 30rpx;
	right: 30rpx;
	width: 40rpx;
	height: 40rpx;
}

.popup-close image {
	width: 100%;
	height: 100%;
}

.popup-body {
	padding: 30rpx;
}

.detail-item {
	display: flex;
	margin-bottom: 30rpx;
}

.detail-icon {
	width: 40rpx;
	height: 40rpx;
	margin-right: 20rpx;
}

.detail-icon image {
	width: 100%;
	height: 100%;
}

.detail-info {
	flex: 1;
}

.detail-label {
	font-size: 24rpx;
	color: #999;
}

.detail-value {
	font-size: 28rpx;
	color: #333;
	margin-top: 6rpx;
}

.action-buttons {
	display: flex;
	justify-content: space-between;
	margin-top: 40rpx;
}

.action-btn {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 30%;
	height: 160rpx;
	border-radius: 16rpx;
	padding: 0;
}

.action-btn image {
	width: 60rpx;
	height: 60rpx;
	margin-bottom: 10rpx;
}

.action-btn text {
	font-size: 24rpx;
}

.action-btn.primary {
	background-color: #007AFF;
	color: #fff;
}

.action-btn.secondary {
	background-color: #f5f5f5;
	color: #333;
}
</style> 
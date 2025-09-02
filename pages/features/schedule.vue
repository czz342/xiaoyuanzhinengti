<template>
	<view class="schedule-page">
		<!-- 日期选择器和视图切换 -->
		<view class="header-controls">
			<view class="date-selector">
				<view class="date-arrow" @tap="changeDate(-1)">
					<image src="/static/images/arrow-left.png" mode="aspectFit"></image>
				</view>
				<view class="date-display" @tap="showDatePicker">
					<text class="date-text">{{currentDateDisplay}}</text>
					<text class="date-label">{{isWeeklyView ? currentWeekRange : currentWeekday}}</text>
				</view>
				<view class="date-arrow" @tap="changeDate(1)">
					<image src="/static/images/arrow-right.png" mode="aspectFit"></image>
				</view>
			</view>
			<view class="view-toggle" @tap="toggleView">
				<text>{{isWeeklyView ? '切换到日视图' : '切换到周视图'}}</text>
			</view>
		</view>
		
		<!-- 周视图 -->
		<view v-if="isWeeklyView" class="weekly-view">
			<!-- 星期标题栏 -->
			<view class="weekday-header">
				<view class="timeline-scale-header"></view>
				<view class="weekday-labels">
					<view v-for="(day, index) in weekdays" :key="index" class="weekday-label">
						<text>{{day}}</text>
					</view>
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
					
					<!-- 网格线 -->
					<view class="grid-lines">
						<view 
							class="grid-line" 
							v-for="(slot, index) in timeSlots" 
							:key="index"
							:style="{ top: (index * 120) + 'rpx' }"
						></view>
					</view>
					
					<!-- 周课程网格 -->
					<view class="week-grid">
						<view v-for="(day, dayIndex) in 5" :key="dayIndex" class="day-column">
							<view 
								class="course-card" 
								v-for="course in getCoursesForDay(dayIndex)"
								:key="course.id" 
								:style="{ 
									top: calculateTop(course.startTime) + 'rpx', 
									height: calculateHeight(course.startTime, course.endTime) + 'rpx', 
									backgroundColor: course.color 
								}"
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
				</view>
			</scroll-view>
		</view>
		
		<!-- 日视图 -->
		<scroll-view v-else scroll-y="true" class="schedule-container">
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
						v-for="course in getCoursesForDay(currentDate.getDay() - 1)"
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
// 已移除金蝶服务导入，现在使用新的后端API

// 预定义颜色列表，用于课程卡片
const courseColors = ['#DFEEFF', '#E6FFF2', '#FFF2E6', '#FFF0F0', '#F0F2FF', '#E6FAFF', '#FFFBE6'];

// 将秒数转换为 HH:mm 格式的辅助函数
function formatTimeFromSeconds(seconds) {
    if (typeof seconds !== 'number' || isNaN(seconds)) {
        return 'N/A';
    }
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const formattedH = String(h).padStart(2, '0');
    const formattedM = String(m).padStart(2, '0');
    return `${formattedH}:${formattedM}`;
}

export default {
	data() {
		return {
			currentDate: new Date(),
			showCalendar: false,
			showDetail: false,
			currentCourse: {},
			isWeeklyView: true,
			weekdays: ['周一', '周二', '周三', '周四', '周五'],
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
			courses: []
		}
	},
	onLoad(options) {
		console.log("课程表页面 onLoad, options:", options);
		this.fetchScheduleData();
		
		if (options && options.courseName) {
			console.log("接收到要查询的课程名称:", options.courseName);
			// 数据加载后，尝试查找并显示课程详情
			// 注意：因为数据是异步加载的，直接在这里查找可能为时过早
			// 我们将使用一个计时器或在数据加载完成后执行
			this.findAndShowCourse(options.courseName);
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
		},
		currentWeekRange() {
			const weekStart = new Date(this.currentDate);
			weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
			const weekEnd = new Date(weekStart);
			weekEnd.setDate(weekEnd.getDate() + 4);
			
			const formatDate = (date) => `${date.getMonth() + 1}/${date.getDate()}`;
			return `${formatDate(weekStart)}-${formatDate(weekEnd)}`;
		}
	},
	methods: {
		toggleView() {
			this.isWeeklyView = !this.isWeeklyView;
		},
		changeDate(offset) {
			const newDate = new Date(this.currentDate);
			if (this.isWeeklyView) {
				newDate.setDate(newDate.getDate() + offset * 7);
			} else {
				newDate.setDate(newDate.getDate() + offset);
			}
			this.currentDate = newDate;
			
			this.loadCoursesForDate(this.currentDate);
		},
		async fetchScheduleData() {
			try {
				// 检查用户登录状态
				const userInfo = uni.getStorageSync('userInfo');
				if (!userInfo) {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					});
					// 跳转到登录页面
					setTimeout(() => {
						uni.navigateTo({
							url: '/pages/login/index'
						});
					}, 1500);
					return;
				}

				const studentId = userInfo.studentId || userInfo.userId;
				if (!studentId) {
					uni.showToast({
						title: '用户信息不完整，请重新登录',
						icon: 'none'
					});
					return;
				}

				uni.showLoading({ title: '正在加载课程表...' });
				
				// 调用新的后端API
				const response = await uni.request({
					url: `http://localhost:3000/api/course/schedule/student/${studentId}`,
					method: 'GET',
					header: {
						'Authorization': `Bearer ${uni.getStorageSync('token')}`
					}
				});

				if (response.data.success) {
					this.courses = this.mapApiToCourses(response.data.data);
				} else {
					throw new Error(response.data.message || '获取课程表失败');
				}
			} catch (error) {
				console.error('加载课程表失败:', error);
				uni.showToast({
					title: '加载失败，请稍后重试',
					icon: 'none'
				});
			} finally {
				uni.hideLoading();
			}
		},
		
		mapApiToCourses(apiCourses) {
			if (!Array.isArray(apiCourses)) {
				return [];
			}
			
			// 预定义课程颜色
			const courseColors = [
				'#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
				'#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
			];
			
			return apiCourses.map((apiCourse, index) => {
				// 从课程安排中获取课程信息
				const courseInfo = apiCourse.course || {};
				
				return {
					id: apiCourse.id,
					name: courseInfo.courseName || '未知课程',
					teacher: apiCourse.teacherName || '未知教师',
					location: apiCourse.location || '未知地点',
					weekday: parseInt(apiCourse.weekday, 10) - 1, // 后端周一为1，前端为0
					startTime: apiCourse.startTime || '00:00',
					endTime: apiCourse.endTime || '00:00',
					textbook: '', // 暂时留空
					color: courseColors[index % courseColors.length],
					startWeek: apiCourse.startWeek,
					endWeek: apiCourse.endWeek,
					semester: apiCourse.semester,
					academicYear: apiCourse.academicYear,
					// 添加更多课程信息
					courseCode: courseInfo.courseCode,
					credits: courseInfo.credits,
					courseType: courseInfo.courseType,
					department: courseInfo.department
				};
			});
		},
		
		// 之前用于从助手的聊天中跳转过来的函数
		async findAndShowCourse(courseName) {
			// 等待数据加载完成
			await this.fetchScheduleData();
			
			const course = this.courses.find(c => c.name === courseName);
			if (course) {
				console.log("已找到课程，准备显示详情:", course);
				this.showCourseDetail(course);
			} else {
				console.warn("未在课程列表中找到名为 '", courseName, "' 的课程。");
			}
		},
		
		getCoursesForDay(dayIndex) {
			// 过滤当前周的课程
			return this.courses.filter(course => course.weekday === dayIndex);
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

.header-controls {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx;
	background-color: #ffffff;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.view-toggle {
	padding: 10rpx 20rpx;
	background-color: #f5f5f5;
	border-radius: 30rpx;
	font-size: 24rpx;
	color: #666;
}

.weekday-header {
	display: flex;
	background-color: #f9f9f9;
	border-bottom: 1rpx solid #f0f0f0;
	position: sticky;
	top: 0;
	z-index: 2;
}

.timeline-scale-header {
	width: 120rpx;
	flex-shrink: 0;
}

.weekday-labels {
	flex: 1;
	display: flex;
}

.weekday-label {
	flex: 1;
	text-align: center;
	padding: 16rpx 4rpx;
	font-size: 26rpx;
	color: #333;
	font-weight: 500;
	box-sizing: border-box;
	border-left: 1rpx solid #f0f0f0;
}

.week-grid {
	flex: 1;
	display: flex;
	position: relative;
}

.day-column {
	flex: 1;
	position: relative;
	border-left: 1rpx solid #f0f0f0;
	min-height: 1700rpx;
	padding: 0 4rpx;
	box-sizing: border-box;
}

.day-column .course-card {
	position: absolute;
	left: 4rpx;
	right: 4rpx;
	border-radius: 8rpx;
	padding: 8rpx;
	box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
	z-index: 1;
	min-width: 120rpx;
	box-sizing: border-box;
}

.day-column .course-content {
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	gap: 4rpx;
}

.day-column .course-name {
	font-size: 22rpx;
	font-weight: bold;
	color: #333;
	line-height: 1.2;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	overflow: hidden;
	word-break: break-all;
}

.day-column .course-location {
	font-size: 18rpx;
	color: #666;
	line-height: 1.2;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 1;
	overflow: hidden;
}

.day-column .course-time {
	font-size: 18rpx;
	color: #999;
	margin-top: auto;
	line-height: 1.2;
}

/* 添加网格线 */
.timeline-container {
	position: relative;
}

.grid-lines {
	position: absolute;
	top: 0;
	left: 120rpx;
	right: 0;
	bottom: 0;
	pointer-events: none;
}

.grid-line {
	position: absolute;
	left: 0;
	right: 0;
	height: 1rpx;
	background-color: #f5f5f5;
	z-index: 0;
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
	min-height: 1700rpx;
}

.timeline-scale {
	width: 120rpx;
	border-right: 1rpx solid #f0f0f0;
	flex-shrink: 0;
	background-color: #f9f9f9;
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

.weekday-labels > .weekday-label:first-child,
.week-grid > .day-column:first-child {
	border-left: none;
}
</style> 
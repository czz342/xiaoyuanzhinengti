<template>
	<view class="health-page">
		<!-- 顶部banner -->
		<view class="health-banner">
			<image src="/static/images/health-banner.png" mode="aspectFill" class="banner-image"></image>
			<view class="banner-content">
				<text class="banner-title">校园健康中心</text>
				<text class="banner-subtitle">为您的身心健康保驾护航</text>
			</view>
		</view>
		
		<!-- 快捷服务区域 -->
		<view class="quick-services">
			<view class="service-item" @tap="navigateTo('medical')">
				<view class="service-icon medical">
					<image src="/static/images/medical.png" mode="aspectFit"></image>
				</view>
				<text class="service-text">校医预约</text>
			</view>
			<view class="service-item" @tap="navigateTo('psychology')">
				<view class="service-icon psychology">
					<image src="/static/images/psychology.png" mode="aspectFit"></image>
				</view>
				<text class="service-text">心理咨询</text>
			</view>
			<view class="service-item" @tap="navigateTo('examination')">
				<view class="service-icon examination">
					<image src="/static/images/examination.png" mode="aspectFit"></image>
				</view>
				<text class="service-text">体检管理</text>
			</view>
			<view class="service-item" @tap="navigateTo('emergency')">
				<view class="service-icon emergency">
					<image src="/static/images/emergency.png" mode="aspectFit"></image>
				</view>
				<text class="service-text">紧急求助</text>
			</view>
		</view>
		
		<!-- 健康数据面板 -->
		<view class="health-panel">
			<view class="panel-header">
				<text class="panel-title">健康数据</text>
				<view class="panel-more" @tap="viewAllHealthData">
					<text>查看全部</text>
					<image src="/static/images/arrow-right.png" mode="aspectFit"></image>
				</view>
			</view>
			
			<view class="data-cards">
				<view class="data-card steps">
					<view class="card-value">
						<text class="value-num">8,253</text>
						<text class="value-unit">步</text>
					</view>
					<view class="card-label">
						<image src="/static/images/steps.png" mode="aspectFit"></image>
						<text>今日步数</text>
					</view>
					<view class="card-progress">
						<progress :percent="85" stroke-width="4" activeColor="#00B578" backgroundColor="#e0e0e0" />
					</view>
				</view>
				
				<view class="data-card sleep">
					<view class="card-value">
						<text class="value-num">7.5</text>
						<text class="value-unit">小时</text>
					</view>
					<view class="card-label">
						<image src="/static/images/sleep.png" mode="aspectFit"></image>
						<text>昨晚睡眠</text>
					</view>
					<view class="card-progress">
						<progress :percent="80" stroke-width="4" activeColor="#7B68EE" backgroundColor="#e0e0e0" />
					</view>
				</view>
				
				<view class="data-card weight">
					<view class="card-value">
						<text class="value-num">65</text>
						<text class="value-unit">kg</text>
					</view>
					<view class="card-label">
						<image src="/static/images/weight.png" mode="aspectFit"></image>
						<text>体重</text>
					</view>
					<view class="card-progress">
						<progress :percent="60" stroke-width="4" activeColor="#FF9500" backgroundColor="#e0e0e0" />
					</view>
				</view>
				
				<view class="data-card heartrate">
					<view class="card-value">
						<text class="value-num">72</text>
						<text class="value-unit">bpm</text>
					</view>
					<view class="card-label">
						<image src="/static/images/heart.png" mode="aspectFit"></image>
						<text>平均心率</text>
					</view>
					<view class="card-progress">
						<progress :percent="75" stroke-width="4" activeColor="#FF3B30" backgroundColor="#e0e0e0" />
					</view>
				</view>
			</view>
		</view>
		
		<!-- 预约记录 -->
		<view class="appointment-section">
			<view class="section-header">
				<text class="section-title">我的预约</text>
				<view class="section-more" @tap="viewAllAppointments">
					<text>查看全部</text>
					<image src="/static/images/arrow-right.png" mode="aspectFit"></image>
				</view>
			</view>
			
			<view class="appointment-cards">
				<view class="appointment-card" v-for="(appointment, index) in appointments" :key="index" @tap="viewAppointmentDetail(appointment)">
					<view class="appointment-type" :class="appointment.typeCls">
						<image :src="appointment.typeIcon" mode="aspectFit"></image>
					</view>
					<view class="appointment-info">
						<text class="appointment-title">{{appointment.title}}</text>
						<text class="appointment-time">{{appointment.time}}</text>
					</view>
					<view class="appointment-status" :class="appointment.statusCls">
						<text>{{appointment.status}}</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 健康资讯 -->
		<view class="health-news">
			<view class="news-header">
				<text class="news-title">健康资讯</text>
				<view class="news-more" @tap="viewAllNews">
					<text>更多</text>
					<image src="/static/images/arrow-right.png" mode="aspectFit"></image>
				</view>
			</view>
			
			<view class="news-list">
				<view class="news-item" v-for="(news, index) in healthNews" :key="index" @tap="readNews(news)">
					<image :src="news.cover" mode="aspectFill" class="news-cover"></image>
					<view class="news-content">
						<text class="news-headline">{{news.title}}</text>
						<text class="news-desc">{{news.description}}</text>
						<view class="news-meta">
							<text class="news-source">{{news.source}}</text>
							<text class="news-date">{{news.date}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 预约详情弹窗 -->
		<view class="appointment-detail-popup" v-if="showAppointmentDetail">
			<view class="popup-mask" @tap="hideAppointmentDetail"></view>
			<view class="popup-content">
				<view class="popup-header">
					<text class="popup-title">预约详情</text>
					<view class="popup-close" @tap="hideAppointmentDetail">
						<image src="/static/images/close.png" mode="aspectFit"></image>
					</view>
				</view>
				
				<view class="popup-body">
					<view class="detail-item">
						<text class="detail-label">预约项目</text>
						<text class="detail-value">{{currentAppointment.title}}</text>
					</view>
					<view class="detail-item">
						<text class="detail-label">预约时间</text>
						<text class="detail-value">{{currentAppointment.time}}</text>
					</view>
					<view class="detail-item">
						<text class="detail-label">预约地点</text>
						<text class="detail-value">{{currentAppointment.location}}</text>
					</view>
					<view class="detail-item">
						<text class="detail-label">医生/顾问</text>
						<text class="detail-value">{{currentAppointment.doctor}}</text>
					</view>
					<view class="detail-item">
						<text class="detail-label">预约状态</text>
						<text class="detail-value" :class="currentAppointment.statusCls">{{currentAppointment.status}}</text>
					</view>
					<view class="detail-item">
						<text class="detail-label">备注</text>
						<text class="detail-value">{{currentAppointment.notes || '无'}}</text>
					</view>
					
					<view class="action-buttons">
						<button class="action-btn primary" v-if="currentAppointment.status === '待就诊'" @tap="startAppointment">
							<text>开始就诊</text>
						</button>
						<button class="action-btn secondary" v-if="currentAppointment.status === '待就诊'" @tap="rescheduleAppointment">
							<text>改期</text>
						</button>
						<button class="action-btn cancel" v-if="currentAppointment.status === '待就诊'" @tap="cancelAppointment">
							<text>取消</text>
						</button>
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
			// 预约数据
			appointments: [
				{
					id: 1,
					title: '心理咨询 - 学业压力',
					time: '2023-05-20 14:00-15:00',
					location: '心理咨询中心 203室',
					doctor: '王医生',
					status: '待就诊',
					statusCls: 'status-pending',
					typeCls: 'type-psychology',
					typeIcon: '/static/images/psychology.png',
					notes: '带上前次咨询的记录表'
				},
				{
					id: 2,
					title: '校医预约 - 过敏症状',
					time: '2023-05-18 09:30-10:00',
					location: '校医院 门诊部',
					doctor: '李医生',
					status: '已完成',
					statusCls: 'status-completed',
					typeCls: 'type-medical',
					typeIcon: '/static/images/medical.png',
					notes: ''
				},
				{
					id: 3,
					title: '体检 - 入学体检',
					time: '2023-04-15 08:00-10:00',
					location: '校医院 体检中心',
					doctor: '体检中心',
					status: '已完成',
					statusCls: 'status-completed',
					typeCls: 'type-examination',
					typeIcon: '/static/images/examination.png',
					notes: '空腹'
				}
			],
			
			// 健康资讯
			healthNews: [
				{
					id: 1,
					title: '大学生如何保持良好作息？',
					description: '科学的作息时间对于大学生的学习和健康至关重要，本文将为您介绍...',
					source: '校园健康中心',
					date: '2023-05-15',
					cover: '/static/images/news1.png'
				},
				{
					id: 2,
					title: '心理健康月活动预告',
					description: '5月是心理健康月，校心理中心将举办一系列活动，包括心理电影展、团体辅导...',
					source: '心理咨询中心',
					date: '2023-05-10',
					cover: '/static/images/news2.png'
				},
				{
					id: 3,
					title: '季节交替，如何预防感冒？',
					description: '春夏交替时节，气温变化大，是感冒的高发期，本文带你了解预防措施...',
					source: '校医院',
					date: '2023-05-05',
					cover: '/static/images/news3.png'
				}
			],
			
			// 弹窗控制
			showAppointmentDetail: false,
			currentAppointment: {}
		}
	},
	methods: {
		navigateTo(type) {
			// 根据类型导航到不同的健康服务页面
			switch(type) {
				case 'medical':
					uni.navigateTo({
						url: '/pages/features/medical'
					});
					break;
				case 'psychology':
					uni.navigateTo({
						url: '/pages/features/psychological-assessment'
					});
					break;
				case 'examination':
					uni.showToast({
						title: '前往体检管理',
						icon: 'none'
					});
					break;
				case 'emergency':
					uni.navigateTo({
						url: '/pages/features/emergency'
					});
					break;
			}
		},
		viewAllHealthData() {
			uni.showToast({
				title: '查看全部健康数据',
				icon: 'none'
			});
		},
		viewAllAppointments() {
			uni.showToast({
				title: '查看全部预约记录',
				icon: 'none'
			});
		},
		viewAllNews() {
			uni.showToast({
				title: '查看全部健康资讯',
				icon: 'none'
			});
		},
		viewAppointmentDetail(appointment) {
			this.currentAppointment = appointment;
			this.showAppointmentDetail = true;
		},
		hideAppointmentDetail() {
			this.showAppointmentDetail = false;
		},
		readNews(news) {
			uni.showToast({
				title: '阅读资讯：' + news.title,
				icon: 'none'
			});
		},
		startAppointment() {
			uni.showToast({
				title: '开始就诊',
				icon: 'success'
			});
			this.hideAppointmentDetail();
		},
		rescheduleAppointment() {
			uni.showToast({
				title: '预约改期',
				icon: 'none'
			});
			this.hideAppointmentDetail();
		},
		cancelAppointment() {
			uni.showModal({
				title: '取消预约',
				content: '是否确认取消此次预约？',
				success: (res) => {
					if (res.confirm) {
						uni.showToast({
							title: '预约已取消',
							icon: 'success'
						});
						this.hideAppointmentDetail();
					}
				}
			});
		}
	}
}
</script>

<style>
.health-page {
	background-color: #f5f5f5;
	min-height: 100vh;
	padding-bottom: 40rpx;
}

/* 顶部banner样式 */
.health-banner {
	position: relative;
	height: 300rpx;
	overflow: hidden;
}

.banner-image {
	width: 100%;
	height: 100%;
}

.banner-content {
	position: absolute;
	left: 40rpx;
	bottom: 40rpx;
	color: #FFFFFF;
	z-index: 1;
}

.banner-title {
	font-size: 40rpx;
	font-weight: bold;
	margin-bottom: 10rpx;
	display: block;
	text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
}

.banner-subtitle {
	font-size: 28rpx;
	display: block;
	text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
}

/* 快捷服务样式 */
.quick-services {
	margin: -50rpx 30rpx 30rpx;
	background-color: #FFFFFF;
	border-radius: 20rpx;
	padding: 30rpx;
	display: flex;
	justify-content: space-between;
	position: relative;
	z-index: 2;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.service-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 25%;
}

.service-icon {
	width: 100rpx;
	height: 100rpx;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-bottom: 16rpx;
}

.service-icon.medical {
	background-color: #e6f2ff;
}

.service-icon.psychology {
	background-color: #e6fff2;
}

.service-icon.examination {
	background-color: #fff2e6;
}

.service-icon.emergency {
	background-color: #ffe6e6;
}

.service-icon image {
	width: 60rpx;
	height: 60rpx;
}

.service-text {
	font-size: 26rpx;
	color: #333;
}

/* 健康数据面板样式 */
.health-panel {
	margin: 0 30rpx 30rpx;
	background-color: #FFFFFF;
	border-radius: 20rpx;
	padding: 30rpx;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.panel-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.panel-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.panel-more {
	display: flex;
	align-items: center;
	font-size: 24rpx;
	color: #999;
}

.panel-more image {
	width: 24rpx;
	height: 24rpx;
	margin-left: 6rpx;
}

.data-cards {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
}

.data-card {
	width: 48%;
	background-color: #f9f9f9;
	border-radius: 16rpx;
	padding: 20rpx;
	margin-bottom: 20rpx;
}

.card-value {
	display: flex;
	align-items: baseline;
	font-weight: bold;
}

.value-num {
	font-size: 36rpx;
	color: #333;
}

.value-unit {
	font-size: 24rpx;
	color: #999;
	margin-left: 6rpx;
}

.card-label {
	display: flex;
	align-items: center;
	margin: 10rpx 0 16rpx;
}

.card-label image {
	width: 32rpx;
	height: 32rpx;
	margin-right: 8rpx;
}

.card-label text {
	font-size: 24rpx;
	color: #666;
}

/* 预约记录样式 */
.appointment-section {
	margin: 0 30rpx 30rpx;
	background-color: #FFFFFF;
	border-radius: 20rpx;
	padding: 30rpx;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.section-more {
	display: flex;
	align-items: center;
	font-size: 24rpx;
	color: #999;
}

.section-more image {
	width: 24rpx;
	height: 24rpx;
	margin-left: 6rpx;
}

.appointment-cards {
	display: flex;
	flex-direction: column;
}

.appointment-card {
	display: flex;
	align-items: center;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #f0f0f0;
}

.appointment-card:last-child {
	border-bottom: none;
}

.appointment-type {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-right: 20rpx;
}

.type-psychology {
	background-color: #e6fff2;
}

.type-medical {
	background-color: #e6f2ff;
}

.type-examination {
	background-color: #fff2e6;
}

.appointment-type image {
	width: 40rpx;
	height: 40rpx;
}

.appointment-info {
	flex: 1;
}

.appointment-title {
	font-size: 28rpx;
	color: #333;
	font-weight: bold;
}

.appointment-time {
	font-size: 24rpx;
	color: #999;
	margin-top: 6rpx;
}

.appointment-status {
	font-size: 24rpx;
	padding: 6rpx 16rpx;
	border-radius: 20rpx;
}

.status-pending {
	background-color: #e6f2ff;
	color: #007AFF;
}

.status-completed {
	background-color: #e6fff2;
	color: #00B578;
}

.status-canceled {
	background-color: #f5f5f5;
	color: #999;
}

/* 健康资讯样式 */
.health-news {
	margin: 0 30rpx 30rpx;
	background-color: #FFFFFF;
	border-radius: 20rpx;
	padding: 30rpx;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.news-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.news-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.news-more {
	display: flex;
	align-items: center;
	font-size: 24rpx;
	color: #999;
}

.news-more image {
	width: 24rpx;
	height: 24rpx;
	margin-left: 6rpx;
}

.news-list {
	display: flex;
	flex-direction: column;
}

.news-item {
	display: flex;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #f0f0f0;
}

.news-item:last-child {
	border-bottom: none;
}

.news-cover {
	width: 160rpx;
	height: 120rpx;
	border-radius: 10rpx;
	margin-right: 20rpx;
}

.news-content {
	flex: 1;
	display: flex;
	flex-direction: column;
}

.news-headline {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 10rpx;
}

.news-desc {
	font-size: 24rpx;
	color: #666;
	margin-bottom: 10rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
}

.news-meta {
	display: flex;
	justify-content: space-between;
	font-size: 22rpx;
	color: #999;
	margin-top: auto;
}

/* 预约详情弹窗样式 */
.appointment-detail-popup {
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
	background-color: #FFFFFF;
	border-radius: 20rpx;
	overflow: hidden;
	z-index: 10000;
}

.popup-header {
	padding: 30rpx;
	border-bottom: 1rpx solid #f0f0f0;
	position: relative;
}

.popup-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	text-align: center;
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
	margin-bottom: 20rpx;
}

.detail-label {
	font-size: 26rpx;
	color: #999;
	margin-bottom: 6rpx;
	display: block;
}

.detail-value {
	font-size: 28rpx;
	color: #333;
}

.action-buttons {
	display: flex;
	justify-content: space-between;
	margin-top: 40rpx;
}

.action-btn {
	width: 30%;
	height: 80rpx;
	line-height: 80rpx;
	font-size: 28rpx;
	border-radius: 40rpx;
}

.action-btn.primary {
	background-color: #007AFF;
	color: #FFFFFF;
}

.action-btn.secondary {
	background-color: #f5f5f5;
	color: #333;
}

.action-btn.cancel {
	background-color: #fff1f0;
	color: #FF3B30;
}
</style>
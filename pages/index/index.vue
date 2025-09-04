<template>
	<view class="home-page">
		<!-- 轮播图区域 -->
		<view class="banner-section">
			<swiper class="banner-swiper" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="500" circular>
				<swiper-item v-for="(item, index) in bannerImages" :key="index">
					<image :src="item" class="banner-image" mode="aspectFill"></image>
				</swiper-item>
			</swiper>
		</view>
		
		<!-- 智慧校园通卡片 -->
		<view class="smart-campus-card">
			<view class="card-content">
				<view class="title-section">
					<text class="main-title">智慧校园通</text>
					<text class="sub-title">Smart Campus Pass</text>
				</view>
				<view class="icon-section">
					<image src="/static/images/g.png" class="graduation-icon"></image>
				</view>
			</view>
			<view class="divider"></view>
			<view class="bottom-section">
				<view class="info-row">
					<view class="location-info">
						<image src="/static/images/定位-位置.png" class="info-icon"></image>
						<text class="info-text">学校地址</text>
					</view>
					<view class="contact-info">
						<image src="/static/images/电话.png" class="info-icon"></image>
						<text class="info-text">联系学校</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 最新活动卡片 -->
		<view class="news-card" @tap="viewNewsDetail">
			<view class="news-badge">news</view>
			<view class="news-content">
				<view class="news-scroll-container">
					<view class="news-scroll-text">
						<text class="news-text">{{ scrollText }}</text>
					</view>
				</view>
			</view>
			<image src="/static/images/arrow-right.png" class="arrow-icon"></image>
		</view>
		
		<!-- 校园景色展示 -->
		<view class="campus-scenery-section">
			<text class="section-title">校园景色</text>
			<view class="scenery-list">
				<view class="scenery-item" v-for="(item, index) in sceneryImages" :key="index" @tap="viewSceneryDetail(item)">
					<image :src="item" class="scenery-image" mode="aspectFill"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			// 轮播图图片 - 来自 @slide/ 目录
			bannerImages: [
				'/static/images/slide/3925d815-a433-4784-841f-f9c2c4ad5389.jpg',
				'/static/images/slide/0071ee17-d7fe-476a-b499-765e38b27802.png',
				'/static/images/slide/b26974c9-6d5c-4fea-81bd-f3c2e7af1ed0.jpg'
			],
			// 校园景色图片 - 来自 @inslide/ 目录
			sceneryImages: [
				'/static/images/slide/inslide/194f050b-9e5a-4e14-8a55-4a2866a04058_s.jpg',
				'/static/images/slide/inslide/c5a335d7-716f-49c6-8bb2-a351a7c35a84.jpg'
			],
			// 新闻滚动效果
			scrollText: '',
			newsList: [
				'最新活动-22届毕业典礼-8月3号'
			],
			currentNewsIndex: 0
		}
	},

	onLoad() {
		console.log('首页加载完成');
		this.initScrollText();
	},
	methods: {
		// 跳转到智慧校园
		goToSmartCampus() {
			uni.showToast({
				title: '智慧校园功能开发中',
				icon: 'none'
			});
		},
		
		// 查看新闻详情
		viewNewsDetail() {
			uni.showToast({
				title: '新闻详情功能开发中',
				icon: 'none'
			});
		},
		
		// 查看校园景色详情
		viewSceneryDetail(imageUrl) {
			uni.previewImage({
				urls: this.sceneryImages,
				current: imageUrl
			});
		},
		
		// 初始化滚动文本
		initScrollText() {
			// 将所有新闻连接成一个长字符串，用分隔符分开
			this.scrollText = this.newsList.join('　　');
		}
	}
}
</script>

<style scoped>
.home-page {
	background-color: #f5f5f5;
	min-height: 100vh;
}

/* 轮播图区域 - 增加高度占据原导航栏空间 */
.banner-section {
	width: 100%;
	height: 500rpx; /* 增加高度，占据原导航栏空间 */
	position: relative;
}

.banner-swiper {
	width: 100%;
	height: 100%;
}

.banner-image {
	width: 100%;
	height: 100%;
}

/* 智慧校园通卡片 - 圆角4px */
.smart-campus-card {
	margin: -50rpx 30rpx 30rpx;
	background-color: #fff;
	border-radius: 8rpx; /* 4px = 8rpx */
	box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
	position: relative;
	z-index: 10;
}

.card-content {
	padding: 30rpx 30rpx 30rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.title-section {
	flex: 1;
}

.main-title {
	font-size: 36rpx; /* 调整字体大小 */
	font-weight: bold;
	color: #333;
	display: block;
	margin-bottom: 8rpx;
}

.sub-title {
	font-size: 22rpx; /* 调整字体大小 */
	color: #999;
	display: block;
}

.icon-section {
	display: flex;
	align-items: center;
	margin-right: 90rpx; /* 让图标更靠左一点 */
}

.graduation-icon {
	width: 140rpx; /* 图标原始大小 */
	height: 180rpx; /* 图标原始大小 */
}

.divider {
	height: 1rpx;
	background-color: #eee;
	margin: 0 30rpx;
}

.bottom-section {
	padding: 30rpx 30rpx 40rpx;
}

.info-row {
	display: flex;
	justify-content: space-between; /* 左右分布 */
	align-items: center;
	width: 100%;
}

.location-info {
	display: flex;
	align-items: center;
	flex-shrink: 0; /* 防止压缩 */
}

.contact-info {
	display: flex;
	align-items: center;
	flex-shrink: 0; /* 防止压缩 */
	margin-left: auto; /* 推到最右边 */
}

.info-icon {
	width: 24rpx;
	height: 24rpx;
	margin-right: 8rpx;
	flex-shrink: 0; /* 防止图标被压缩 */
}

.info-text {
	font-size: 24rpx;
	color: #666;
	white-space: nowrap; /* 防止文字换行 */
}

/* 最新活动卡片 - 圆角4px */
.news-card {
	margin: 0 30rpx 30rpx;
	background-color: #fff;
	border-radius: 8rpx; /* 4px = 8rpx */
	padding: 30rpx;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
	display: flex;
	align-items: center;
}

.news-badge {
	background-color: #007AFF;
	color: #fff;
	padding: 8rpx 16rpx;
	border-radius: 20rpx;
	font-size: 22rpx;
	margin-right: 20rpx;
}

.news-content {
	flex: 1;
	overflow: hidden;
}

.news-scroll-container {
	width: 100%;
	overflow: hidden;
	position: relative;
}

.news-scroll-text {
	display: inline-block;
	animation: scroll-left 10s linear infinite;
	white-space: nowrap;
	width: max-content;
	position: relative;
}

.news-text {
	font-size: 28rpx;
	color: #333;
	white-space: nowrap;
}

@keyframes scroll-left {
	0% {
		transform: translateX(100%);
	}
	100% {
		transform: translateX(-100%);
	}
}

.arrow-icon {
	width: 24rpx;
	height: 24rpx;
}

/* 校园景色展示 - 圆角8px */
.campus-scenery-section {
	margin: 0 30rpx 30rpx;
}

.section-title {
	font-size: 26rpx;
	font-weight: normal;
	color: #333;
	margin-bottom: 20rpx;
	display: block;
}

.scenery-list {
	display: flex;
	flex-direction: column;
	gap: 40rpx;
}

.scenery-item {
	width: 100%;
	height: 300rpx;
	border-radius: 16rpx; /* 8px = 16rpx */
	overflow: hidden;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
}

.scenery-image {
	width: 100%;
	height: 100%;
}
</style>
<template>
	<view class="campus-community-page">
		<!-- 顶部导航 -->
		<view class="nav-bar">
			<view class="nav-left" @tap="goBack">
				<image src="/static/images/back.png" mode="aspectFit"></image>
			</view>
			<text class="nav-title">校园圈子</text>
			<view class="nav-right"></view>
		</view>

		<!-- 页面内容 -->
		<view class="page-content">
			<view class="placeholder-container">
				<image src="/static/images/placeholder.png" mode="aspectFit" class="placeholder-image"></image>
				<text class="placeholder-title">功能开发中</text>
				<text class="placeholder-desc">校园圈子功能正在开发中，敬请期待...</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	methods: {
		goBack() {
			uni.navigateBack();
		}
	}
}
</script>

<style>
.campus-community-page {
	background-color: #f5f5f5;
	min-height: 100vh;
}

.nav-bar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20rpx 30rpx;
	background-color: #fff;
	border-bottom: 1rpx solid #f0f0f0;
}

.nav-left {
	width: 60rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.nav-left image {
	width: 40rpx;
	height: 40rpx;
}

.nav-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.nav-right {
	width: 60rpx;
}

.page-content {
	padding: 100rpx 30rpx;
}

.placeholder-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	text-align: center;
}

.placeholder-image {
	width: 200rpx;
	height: 200rpx;
	margin-bottom: 40rpx;
	opacity: 0.6;
}

.placeholder-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 20rpx;
}

.placeholder-desc {
	font-size: 26rpx;
	color: #999;
	line-height: 1.5;
}
</style>

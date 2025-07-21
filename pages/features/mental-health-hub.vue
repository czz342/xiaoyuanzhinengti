<template>
	<view class="hub-container">
		<view class="hub-header">
			<image class="header-bg" src="/static/images/features/hub-bg-2.png" mode="aspectFill"></image>
			<view class="header-content">
				<text class="header-title animate__animated animate__fadeInDown">心灵港湾</text>
				<text class="header-subtitle animate__animated animate__fadeInUp">一个属于你的、温暖安全的角落</text>
			</view>
		</view>

		<view class="features-grid">
			<!-- AI心理伙伴 -->
			<view class="feature-card ai-card" hover-class="feature-card-hover" @tap="navigateToFeature('/pages/features/ai-companion')">
				<view class="card-left">
					<text class="card-title">AI心理伙伴</text>
					<text class="card-description">你的专属AI伙伴“小晴”，随时倾听</text>
				</view>
				<view class="card-right">
					<image class="card-icon" src="/static/images/features/icon-ai-companion.png"></image>
				</view>
			</view>

			<!-- 心情日记 -->
			<view class="feature-card journal-card" hover-class="feature-card-hover" @tap="navigateToFeature('/pages/features/journal')">
				<view class="card-left">
					<text class="card-title">心情日记</text>
					<text class="card-description">记录你的点滴，发现内心的声音</text>
				</view>
				<view class="card-right">
					<image class="card-icon" src="/static/images/features/icon-journal.png"></image>
				</view>
			</view>

			<!-- 匿名互助社区 -->
			<view class="feature-card community-card" hover-class="feature-card-hover" @tap="navigateToFeature('/pages/features/community')">
				<view class="card-left">
					<text class="card-title">互助社区</text>
					<text class="card-description">在匿名的世界里，与温暖的灵魂相遇</text>
				</view>
				<view class="card-right">
					<image class="card-icon" src="/static/images/features/icon-community.png"></image>
				</view>
			</view>
		</view>

		<view class="privacy-section animate__animated animate__fadeInUp" style="animation-delay: 0.3s;">
			<view class="privacy-text">
				<text class="privacy-title">你的秘密，我们用心守护</text>
				<text class="privacy-desc">所有个人数据均在本地处理，绝不上传或分享，请放心使用。</text>
			</view>
		</view>
		
		<view class="footer-quote">
			<text>"我们并非生来就勇敢，勇敢是我们在一次次跌倒又爬起中学会的。"</text>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	methods: {
		navigateToFeature(url) {
			uni.navigateTo({
				url: url
			});
		}
	}
};
</script>

<style>
/* 引入动画库 */
@import url("/static/animate.min.css");

.hub-container {
	background: linear-gradient(180deg, #e6f0ff 0%, #f5f7fa 30%, #f8f9fa 100%);
	min-height: 100vh;
	overflow-x: hidden;
}

.hub-header {
	position: relative;
	height: 450rpx;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	color: #fff;
	text-align: center;
	overflow: hidden;
}

.header-bg {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 1;
	filter: brightness(0.9);
}

.header-content {
	position: relative;
	z-index: 2;
	padding: 0 40rpx;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	background: linear-gradient(to top, rgba(0, 0, 0, 0.2), transparent);
}

.header-title {
	font-size: 56rpx;
	font-weight: bold;
	margin-bottom: 20rpx;
	text-shadow: 0 4rpx 8rpx rgba(0,0,0,0.3);
}

.header-subtitle {
	font-size: 30rpx;
	opacity: 0.95;
	text-shadow: 0 2rpx 4rpx rgba(0,0,0,0.2);
}

.features-grid {
	padding: 40rpx 30rpx;
	display: flex;
	flex-direction: column;
	gap: 35rpx;
	margin-top: -80rpx; /* 让卡片和头部有重叠效果 */
	position: relative;
	z-index: 3;
}

.feature-card {
	background-color: #ffffff;
	border-radius: 24rpx;
	box-shadow: 0 10rpx 40rpx rgba(0, 91, 255, 0.08);
	transition: all 0.3s ease;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 40rpx;
	animation: card-enter 0.6s ease-out backwards;
}

/* staggered animation delay */
.feature-card:nth-child(2) {
	animation-delay: 0.1s;
}
.feature-card:nth-child(3) {
	animation-delay: 0.2s;
}

@keyframes card-enter {
	from {
		opacity: 0;
		transform: translateY(40rpx) scale(0.98);
	}
	to {
		opacity: 1;
		transform: translateY(0) scale(1);
	}
}

.feature-card-hover {
	transform: translateY(-8rpx) scale(1.02);
	box-shadow: 0 18rpx 50rpx rgba(0, 91, 255, 0.12);
}

.feature-card:active {
	transform: scale(0.97);
	box-shadow: 0 6rpx 25rpx rgba(0, 91, 255, 0.1);
}

.card-left {
	display: flex;
	flex-direction: column;
}

.card-right {
	flex-shrink: 0;
	margin-left: 30rpx;
}

.card-icon {
	width: 100rpx;
	height: 100rpx;
}

.card-title {
	font-size: 38rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 12rpx;
}

.card-description {
	font-size: 26rpx;
	color: #777;
}

/* 个性化卡片颜色 */
.ai-card {
	background-image: linear-gradient(135deg, #f0f7ff 0%, #ffffff 100%);
	border: 1rpx solid #e0f0ff;
}
.journal-card {
	background-image: linear-gradient(135deg, #fffaf0 0%, #ffffff 100%);
	border: 1rpx solid #fff0e0;
}
.community-card {
	background-image: linear-gradient(135deg, #f3fdf5 0%, #ffffff 100%);
	border: 1rpx solid #e0f5e5;
}

.privacy-section {
	margin: 20rpx 30rpx 0;
	padding: 30rpx;
	background-color: #ffffff;
	border-radius: 20rpx;
	display: flex;
	align-items: center;
	border: 1rpx solid #e8e8e8;
	background-image: linear-gradient(135deg, #f7f9fc 0%, #ffffff 100%);
}

.privacy-text {
	display: flex;
	flex-direction: column;
}

.privacy-title {
	font-size: 28rpx;
	font-weight: bold;
	color: #555;
	margin-bottom: 8rpx;
}

.privacy-desc {
	font-size: 24rpx;
	color: #999;
	line-height: 1.5;
}

.footer-quote {
	text-align: center;
	padding: 50rpx 40rpx 60rpx;
	font-size: 24rpx;
	color: #aaa;
	line-height: 1.6;
}
</style> 
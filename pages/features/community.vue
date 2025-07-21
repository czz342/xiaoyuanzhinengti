<template>
	<view class="community-container">
		<!-- 页面头部 -->
		<view class="header">
			<view>
				<view class="title">回音壁</view>
				<view class="subtitle">在这里，每个低语都有回响</view>
			</view>
			<view class="notice">
				<uni-icons type="info-filled" size="14" color="#909399"></uni-icons>
				<text class="notice-text">所有评论都将经过审核</text>
			</view>
		</view>

		<!-- 帖子列表 -->
		<scroll-view scroll-y class="post-list">
			<view v-for="post in posts" :key="post.id" class="post-card animate__animated animate__fadeInUp" @click="navigateToPostDetail(post.id)">
				<!-- 帖子头部：头像和昵称 -->
				<view class="post-header">
					<view class="author-info">
						<view class="avatar" :style="{ backgroundColor: post.avatarColor }">
							<text>{{ post.anonymousName.charAt(0) }}</text>
						</view>
						<text class="anonymous-name">{{ post.anonymousName }}</text>
					</view>
					<text class="post-time">{{ post.time }}</text>
				</view>

				<!-- 帖子内容 -->
				<view class="post-content">
					<text>{{ post.content }}</text>
				</view>

				<!-- 帖子底部：互动信息 -->
				<view class="post-footer">
					<view class="footer-item">
						<uni-icons type="chatbubble" size="18" color="#a0a0a0"></uni-icons>
						<text class="footer-text">{{ post.comments }}</text>
					</view>
					<view class="footer-item">
						<uni-icons type="heart" size="18" color="#a0a0a0"></uni-icons>
						<text class="footer-text">{{ post.hugs }} 抱一抱</text>
					</view>
				</view>
			</view>
		</scroll-view>

		<!-- 发布新帖按钮 -->
		<view class="fab">
			<button class="fab-button" @click="navigateToCreatePost">
				<uni-icons type="plusempty" size="24" color="#fff"></uni-icons>
			</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				posts: [{
						id: 1,
						anonymousName: '匿名的向日葵',
						avatarColor: '#f9d56e',
						time: '2小时前',
						content: '感觉最近做什么都提不起劲，明明有很多事要做，但就是不想开始。大家有过这种情况吗？是怎么调整的呀？',
						comments: 12,
						hugs: 45
					},
					{
						id: 2,
						anonymousName: '迷路的旅人',
						avatarColor: '#a0d2eb',
						time: '5小时前',
						content: '要毕业了，看着身边的同学都拿到了很好的offer，我却还在海投简历，真的好焦虑，感觉自己好失败...',
						comments: 28,
						hugs: 98
					},
					{
						id: 3,
						anonymousName: '深夜的猫头鹰',
						avatarColor: '#e57373',
						time: '昨天 23:10',
						content: '和好朋友因为一点小事吵架了，现在不知道该怎么和好，又很珍惜这段友谊，好烦恼。',
						comments: 19,
						hugs: 67
					},
					{
						id: 4,
						anonymousName: '想晒太阳的鱼',
						avatarColor: '#81c784',
						time: '昨天 18:45',
						content: '分享一个今天的小确幸！在图书馆看书的时候，偶然一抬头，看到了窗外超美的晚霞，一瞬间所有的疲惫都消失了。',
						comments: 35,
						hugs: 152
					}
				]
			};
		},
		methods: {
			navigateToCreatePost() {
				uni.navigateTo({
					url: '/pages/features/community-create-post'
				});
			},
			navigateToPostDetail(postId) {
				uni.navigateTo({
					url: `/pages/features/community-post-detail?id=${postId}`
				});
			}
		}
	};
</script>

<style scoped>
	@import url('@/static/animate.min.css');

	.community-container {
		background-color: #f7f8fc;
		min-height: 100vh;
		padding: 40rpx;
		padding-bottom: 180rpx; /* 为发布按钮留出空间 */
		box-sizing: border-box;
	}

	.header {
		margin-bottom: 40rpx;
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
	}

	.title {
		font-size: 52rpx;
		font-weight: bold;
		color: #303133;
		margin-bottom: 10rpx;
	}

	.subtitle {
		font-size: 30rpx;
		color: #909399;
	}

	.notice {
		display: flex;
		align-items: center;
		background-color: #e9eaec;
		padding: 8rpx 15rpx;
		border-radius: 20rpx;
		margin-top: 10rpx;
	}

	.notice-text {
		font-size: 22rpx;
		color: #909399;
		margin-left: 8rpx;
	}
	
	.post-list {
		height: calc(100vh - 200rpx); /* 设定一个大致的高度 */
	}

	.post-card {
		background-color: #ffffff;
		border-radius: 24rpx;
		padding: 30rpx;
		margin-bottom: 30rpx;
		box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.05);
		transition: transform 0.2s ease-in-out;
	}
	
	.post-card:active {
		transform: scale(0.98);
	}

	.post-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 25rpx;
	}

	.author-info {
		display: flex;
		align-items: center;
	}

	.avatar {
		width: 70rpx;
		height: 70rpx;
		border-radius: 50%;
		margin-right: 20rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #fff;
		font-weight: bold;
		font-size: 32rpx;
	}

	.anonymous-name {
		font-size: 30rpx;
		font-weight: 500;
		color: #303133;
	}
	
	.post-time {
		font-size: 24rpx;
		color: #c0c4cc;
	}

	.post-content {
		font-size: 28rpx;
		line-height: 1.7;
		color: #606266;
		margin-bottom: 30rpx;
	}

	.post-footer {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		padding-top: 20rpx;
		border-top: 1rpx solid #f2f2f2;
	}

	.footer-item {
		display: flex;
		align-items: center;
		margin-left: 40rpx;
		font-size: 26rpx;
		color: #909399;
	}
	
	.footer-text {
		margin-left: 10rpx;
	}

	.fab {
		position: fixed;
		bottom: 80rpx;
		right: 40rpx;
		z-index: 100;
	}

	.fab-button {
		width: 110rpx;
		height: 110rpx;
		border-radius: 50%;
		background: linear-gradient(45deg, #82c4b8, #a0d2eb);
		box-shadow: 0 10rpx 30rpx rgba(130, 196, 184, 0.4);
		display: flex;
		justify-content: center;
		align-items: center;
		transition: transform 0.2s ease;
	}
	
	.fab-button:active {
		transform: scale(0.95);
	}
</style> 
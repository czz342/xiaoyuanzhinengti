<template>
	<view class="detail-container">
		<scroll-view scroll-y class="scroll-view-content">
			<!-- 原始帖子卡片 -->
			<view v-if="post" class="post-card">
				<view class="post-header">
					<view class="author-info">
						<view class="avatar" :style="{ backgroundColor: post.avatarColor }">
							<text>{{ post.anonymousName.charAt(0) }}</text>
						</view>
						<text class="anonymous-name">{{ post.anonymousName }}</text>
					</view>
					<text class="post-time">{{ post.time }}</text>
				</view>
				<view class="post-content">
					<text>{{ post.content }}</text>
				</view>
			</view>

			<!-- 评论区 -->
			<view class="comments-section">
				<view class="comments-header">
					<text>大家的鼓励 ({{ comments.length }})</text>
				</view>
				<view v-if="comments.length > 0" class="comments-list">
					<view v-for="comment in comments" :key="comment.id" class="comment-item animate__animated animate__fadeInUp">
						<view class="comment-author-info">
							<view class="comment-avatar" :style="{ backgroundColor: comment.avatarColor }">
								<text>{{ comment.anonymousName.charAt(0) }}</text>
							</view>
							<text class="comment-anonymous-name">{{ comment.anonymousName }}</text>
						</view>
						<view class="comment-content">
							{{ comment.content }}
						</view>
						<view class="comment-time">{{ comment.time }}</view>
					</view>
				</view>
				<view v-else class="no-comments">
					<text>还没有人评论，快来送上你的鼓励吧！</text>
				</view>
			</view>
		</scroll-view>

		<!-- 评论输入框 -->
		<view class="comment-input-area">
			<input v-model="newCommentText" class="comment-input" placeholder="写下你的鼓励..." cursor-spacing="15" />
			<button @click="submitComment" class="submit-button" :disabled="!newCommentText.trim()">发送</button>
		</view>
	</view>
</template>

<script>
	const allPosts = [{
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
	];

	const allComments = {
		'1': [{
			id: 101,
			anonymousName: '温暖的毛毯',
			avatarColor: '#bcaaa4',
			time: '1小时前',
			content: '抱抱你，完全理解这种感觉。试试看把大任务拆成很小很小的步骤？比如“打开电脑”、“新建一个文档”，每完成一步都给自己一点奖励！'
		}, {
			id: 102,
			anonymousName: '奔跑的蜗牛',
			avatarColor: '#c5e1a5',
			time: '45分钟前',
			content: '一样一样！我之前也是这样。后来发现出去散散步，或者看个搞笑视频会好很多，转换一下心情再回来做事效率会更高。'
		}],
		'2': [{
			id: 201,
			anonymousName: '匿名的学长',
			avatarColor: '#8e9aaf',
			time: '4小时前',
			content: '毕业季焦虑是正常的，我也是这么过来的。不要只看到别人的offer，每个人都有自己的节奏，相信你只是需要多一点时间。加油！'
		}, {
			id: 202,
			anonymousName: '一起加油鸭',
			avatarColor: '#ffd54f',
			time: '3小时前',
			content: '我也是！咱俩情况好像，要不要私聊交流一下面试经验？一个人扛太难了。'
		}],
		'3': [],
		'4': [{
			id: 401,
			anonymousName: '追光者',
			avatarColor: '#ffb74d',
			time: '昨天 19:00',
			content: '哇，好美的画面！谢谢你的分享，感觉也被治愈了~'
		}]
	};

	const anonymousAvatars = [
		{ name: '温柔的海洋', color: '#81d4fa' },
		{ name: '安静的森林', color: '#a5d6a7' },
		{ name: '害羞的云朵', color: '#e6e6e6' },
		{ name: '好奇的星辰', color: '#b39ddb' },
	];

	export default {
		data() {
			return {
				post: null,
				comments: [],
				newCommentText: ''
			};
		},
		onLoad(options) {
			const postId = parseInt(options.id);
			this.post = allPosts.find(p => p.id === postId) || null;
			if (this.post) {
				this.comments = allComments[postId] || [];
			}
		},
		methods: {
			submitComment() {
				if (!this.newCommentText.trim()) return;

				const randomAvatar = anonymousAvatars[Math.floor(Math.random() * anonymousAvatars.length)];
				
				const newComment = {
					id: Date.now(),
					anonymousName: randomAvatar.name,
					avatarColor: randomAvatar.color,
					time: '刚刚',
					content: this.newCommentText.trim()
				};
				
				this.comments.push(newComment);
				this.newCommentText = '';

				uni.showToast({
					title: '评论已发布',
					icon: 'success',
					duration: 1500
				});
			}
		}
	};
</script>

<style scoped>
	@import url('@/static/animate.min.css');

	.detail-container {
		background-color: #f7f8fc;
		height: 100vh;
		display: flex;
		flex-direction: column;
	}
	
	.scroll-view-content {
		flex: 1;
		padding-bottom: 140rpx;
		box-sizing: border-box;
	}

	.post-card {
		background-color: #ffffff;
		margin: 30rpx;
		padding: 30rpx;
		border-radius: 24rpx;
		box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.05);
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
	}

	.comments-section {
		padding: 0 30rpx;
		margin-top: 20rpx;
	}

	.comments-header {
		font-size: 32rpx;
		font-weight: bold;
		color: #303133;
		margin-bottom: 30rpx;
		padding-bottom: 10rpx;
		border-bottom: 1rpx solid #e0e0e0;
	}
	
	.comment-item {
		background-color: #fff;
		border-radius: 20rpx;
		padding: 25rpx;
		margin-bottom: 25rpx;
	}
	
	.comment-author-info {
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
	}
	
	.comment-avatar {
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
		margin-right: 20rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #fff;
		font-weight: bold;
		font-size: 28rpx;
	}
	
	.comment-anonymous-name {
		font-size: 28rpx;
		color: #606266;
	}
	
	.comment-content {
		font-size: 28rpx;
		line-height: 1.6;
		color: #303133;
		margin-bottom: 15rpx;
	}
	
	.comment-time {
		font-size: 22rpx;
		color: #c0c4cc;
		text-align: right;
	}
	
	.no-comments {
		text-align: center;
		color: #909399;
		padding: 60rpx 0;
	}

	.comment-input-area {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: #ffffff;
		padding: 20rpx 30rpx;
		padding-bottom: calc(20rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
		display: flex;
		align-items: center;
		border-top: 1rpx solid #f2f2f2;
		z-index: 100;
	}

	.comment-input {
		flex: 1;
		background-color: #f7f8fc;
		height: 72rpx;
		border-radius: 36rpx;
		padding: 0 30rpx;
		font-size: 28rpx;
	}

	.submit-button {
		margin-left: 20rpx;
		height: 72rpx;
		line-height: 72rpx;
		font-size: 28rpx;
		color: #fff;
		background-color: #82c4b8;
		border-radius: 36rpx;
		padding: 0 40rpx;
	}
	
	.submit-button[disabled] {
		background-color: #c8c9cc;
		color: #ffffff;
	}
</style> 
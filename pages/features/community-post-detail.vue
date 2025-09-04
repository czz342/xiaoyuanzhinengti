<template>
	<view class="post-detail-page">
		<!-- 顶部导航栏 -->
		<view class="navbar">
			<view class="nav-left" @tap="goBack">
				<image src="/static/images/arrow-left.png" mode="aspectFit"></image>
			</view>
			<text class="nav-title">帖子详情</text>
			<view class="nav-right" @tap="showMoreActions">
				<image src="/static/images/more.png" mode="aspectFit"></image>
			</view>
		</view>
		
		<!-- 帖子内容 -->
		<scroll-view class="content-container" scroll-y="true" v-if="post">
			<!-- 帖子主体 -->
			<view class="post-main">
				<!-- 用户信息 -->
				<view class="post-header">
					<view class="user-info">
						<image :src="post.author_avatar" mode="aspectFill" class="user-avatar"></image>
						<view class="user-details">
							<text class="user-name">{{ post.author_name }}</text>
							<text class="post-time">{{ formatTime(post.created_at) }}</text>
						</view>
					</view>
					<view class="post-category">
						<text class="category-tag" :class="'category-' + post.category">
							{{ getCategoryName(post.category) }}
						</text>
					</view>
				</view>
				
				<!-- 帖子内容 -->
				<view class="post-content">
					<text class="post-title">{{ post.title }}</text>
					<text class="post-text">{{ post.content }}</text>
					
					<!-- 图片展示 -->
					<view class="post-images" v-if="post.images && post.images.length > 0">
						<view 
							class="image-item" 
							v-for="(image, index) in post.images" 
							:key="index"
							@tap="previewImages(post.images, index)"
						>
							<image :src="image" mode="aspectFill" class="post-image"></image>
						</view>
					</view>
				</view>
				
				<!-- 互动统计 -->
				<view class="post-stats">
					<text class="stat-item">{{ post.view_count || 0 }} 浏览</text>
					<text class="stat-item">{{ post.like_count || 0 }} 点赞</text>
					<text class="stat-item">{{ post.comment_count || 0 }} 评论</text>
				</view>
				
				<!-- 互动按钮 -->
				<view class="post-actions">
					<view class="action-btn" :class="{ active: post.is_liked }" @tap="toggleLike">
						<image 
							:src="post.is_liked ? '/static/images/like-filled.png' : '/static/images/like.png'" 
							mode="aspectFit" 
							class="action-icon"
						></image>
						<text class="action-text">{{ post.is_liked ? '已赞' : '点赞' }}</text>
					</view>
					
					<view class="action-btn" @tap="focusComment">
						<image src="/static/images/comment.png" mode="aspectFit" class="action-icon"></image>
						<text class="action-text">评论</text>
					</view>
					
					<view class="action-btn" @tap="sharePost">
						<image src="/static/images/share.png" mode="aspectFit" class="action-icon"></image>
						<text class="action-text">分享</text>
					</view>
				</view>
			</view>
			
			<!-- 评论列表 -->
			<view class="comments-section">
				<view class="section-header">
					<text class="section-title">评论 ({{ comments.length }})</text>
				</view>
				
				<view class="comments-list" v-if="comments.length > 0">
					<view 
						class="comment-item" 
						v-for="comment in comments" 
						:key="comment.id"
					>
						<image :src="comment.user_avatar" mode="aspectFill" class="comment-avatar"></image>
						<view class="comment-content">
							<view class="comment-header">
								<text class="comment-author">{{ comment.user_name }}</text>
								<text class="comment-time">{{ formatTime(comment.created_at) }}</text>
							</view>
							<text class="comment-text">{{ comment.content }}</text>
							<view class="comment-actions">
								<view class="comment-action" @tap="likeComment(comment)">
									<image 
										:src="comment.is_liked ? '/static/images/like-filled.png' : '/static/images/like.png'" 
										mode="aspectFit" 
										class="comment-action-icon"
										:class="{ liked: comment.is_liked }"
									></image>
									<text class="comment-action-text" :class="{ liked: comment.is_liked }">
										{{ comment.like_count || 0 }}
									</text>
								</view>
								<view class="comment-action" @tap="replyComment(comment)">
									<image src="/static/images/reply.png" mode="aspectFit" class="comment-action-icon"></image>
									<text class="comment-action-text">回复</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				
				<!-- 评论空状态 -->
				<view class="empty-comments" v-else>
					<image src="/static/images/empty-comments.png" mode="aspectFit" class="empty-image"></image>
					<text class="empty-text">暂无评论</text>
					<text class="empty-desc">快来发表第一个评论吧！</text>
				</view>
			</view>
		</scroll-view>
		
		<!-- 加载状态 -->
		<view class="loading-state" v-if="isLoading">
			<text class="loading-text">加载中...</text>
		</view>
		
		<!-- 评论输入框 -->
		<view class="comment-input-container" v-if="post && post.allow_comments">
			<view class="comment-input-wrapper">
				<input 
					class="comment-input" 
					v-model="commentText" 
					placeholder="写评论..."
					:focus="isCommentFocused"
					@focus="onCommentFocus"
					@blur="onCommentBlur"
				/>
				<view class="comment-send" @tap="sendComment" :class="{ active: commentText.trim() }">
					<text class="send-text">发送</text>
				</view>
			</view>
		</view>
		
		<!-- 更多操作弹窗 -->
		<view class="action-popup" v-if="showActionModal" @tap="hideMoreActions">
			<view class="action-content" @tap.stop>
				<view class="action-item" @tap="reportPost">
					<image src="/static/images/report.png" mode="aspectFit" class="action-item-icon"></image>
					<text class="action-item-text">举报</text>
				</view>
				<view class="action-item" @tap="blockUser" v-if="!isMyPost">
					<image src="/static/images/block.png" mode="aspectFit" class="action-item-icon"></image>
					<text class="action-item-text">屏蔽用户</text>
				</view>
				<view class="action-item" @tap="deletePost" v-if="isMyPost">
					<image src="/static/images/delete.png" mode="aspectFit" class="action-item-icon"></image>
					<text class="action-item-text">删除帖子</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			postId: null,
			post: null,
			comments: [],
			isLoading: true,
			commentText: '',
			isCommentFocused: false,
			showActionModal: false
		}
	},
	
	computed: {
		isMyPost() {
			if (!this.post) return false;
			const token = uni.getStorageSync('token');
			if (!token) return false;
			
			try {
				const jwt = require('jsonwebtoken');
				const decoded = jwt.verify(token, 'your-secret-key');
				const userId = decoded.studentId || decoded.userId || decoded.id;
				return this.post.author_id === userId;
			} catch (error) {
				return false;
			}
		}
	},
	
	onLoad(options) {
		if (options.id) {
			this.postId = options.id;
			this.loadPostDetail();
		}
	},
	
	methods: {
		// 返回上一页
		goBack() {
			uni.navigateBack();
		},
		
		// 加载帖子详情
		async loadPostDetail() {
			if (!this.postId) return;
			
			this.isLoading = true;
			
			try {
				const token = uni.getStorageSync('token');
				const headers = {};
				if (token) {
					headers['Authorization'] = `Bearer ${token}`;
				}
				
				const response = await uni.request({
					url: `http://localhost:3000/api/community/posts/${this.postId}`,
					method: 'GET',
					header: headers
				});
				
				console.log('帖子详情响应:', response);
				
				if (response.data && response.data.success) {
					const p = response.data.data || {};
					// 头像与昵称前端回退
					p.author_avatar = p.author_avatar || '/static/images/default-avatar.png';
					p.author_name = p.author_nickname || p.nickName || p.displayName || p.author_name || '匿名用户';
					this.post = p;
					this.loadComments();
				} else {
					uni.showToast({
						title: response.data.message || '加载失败',
						icon: 'none'
					});
				}
			} catch (error) {
				console.error('加载帖子详情失败:', error);
				uni.showToast({
					title: '网络错误',
					icon: 'none'
				});
			} finally {
				this.isLoading = false;
			}
		},
		
		// 加载评论列表
		async loadComments() {
			try {
				const token = uni.getStorageSync('token');
				const headers = {};
				if (token) {
					headers['Authorization'] = `Bearer ${token}`;
				}
				
				const response = await uni.request({
					url: `http://localhost:3000/api/community/posts/${this.postId}/comments`,
					method: 'GET',
					header: headers
				});
				
				if (response.data && response.data.success) {
					const list = response.data.data.comments || [];
					// 为评论头像/昵称做回退
					this.comments = list.map(c => ({
						...c,
						user_avatar: c.user_avatar || '/static/images/default-avatar.png',
						user_name: c.user_nickname || c.nickName || c.displayName || c.user_name || '匿名用户'
					}));
				}
			} catch (error) {
				console.error('加载评论失败:', error);
			}
		},
		
		// 切换点赞状态
		async toggleLike() {
			const token = uni.getStorageSync('token');
			if (!token) {
				uni.showToast({
					title: '请先登录',
					icon: 'none'
				});
				return;
			}
			
			try {
				const response = await uni.request({
					url: 'http://localhost:3000/api/community/like',
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`
					},
					data: {
						target_type: 'post',
						target_id: this.post.id
					}
				});
				
				if (response.data && response.data.success) {
					this.post.is_liked = response.data.data.is_liked;
					this.post.like_count = response.data.data.is_liked 
						? this.post.like_count + 1 
						: Math.max(0, this.post.like_count - 1);
				} else {
					uni.showToast({
						title: response.data.message || '操作失败',
						icon: 'none'
					});
				}
			} catch (error) {
				console.error('点赞操作失败:', error);
				uni.showToast({
					title: '网络错误',
					icon: 'none'
				});
			}
		},
		
		// 点赞评论
		async likeComment(comment) {
			const token = uni.getStorageSync('token');
			if (!token) {
				uni.showToast({
					title: '请先登录',
					icon: 'none'
				});
				return;
			}
			
			try {
				const response = await uni.request({
					url: 'http://localhost:3000/api/community/like',
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`
					},
					data: {
						target_type: 'comment',
						target_id: comment.id
					}
				});
				
				if (response.data && response.data.success) {
					comment.is_liked = response.data.data.is_liked;
					comment.like_count = response.data.data.is_liked 
						? comment.like_count + 1 
						: Math.max(0, comment.like_count - 1);
				}
			} catch (error) {
				console.error('点赞评论失败:', error);
			}
		},
		
		// 发送评论
		async sendComment() {
			if (!this.commentText.trim()) {
				uni.showToast({
					title: '请输入评论内容',
					icon: 'none'
				});
				return;
			}
			
			const token = uni.getStorageSync('token');
			if (!token) {
				uni.showToast({
					title: '请先登录',
					icon: 'none'
				});
				return;
			}
			
			try {
				const response = await uni.request({
					url: `http://localhost:3000/api/community/posts/${this.postId}/comments`,
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`
					},
					data: {
						content: this.commentText.trim()
					}
				});
				
				if (response.data && response.data.success) {
					this.commentText = '';
					this.isCommentFocused = false;
					uni.showToast({
						title: '评论成功',
						icon: 'success'
					});
					this.loadComments();
					this.loadPostDetail(); // 刷新帖子数据
				} else {
					uni.showToast({
						title: response.data.message || '评论失败',
						icon: 'none'
					});
				}
			} catch (error) {
				console.error('发送评论失败:', error);
				uni.showToast({
					title: '网络错误',
					icon: 'none'
				});
			}
		},
		
		// 回复评论
		replyComment(comment) {
			this.commentText = `@${comment.user_name} `;
			this.isCommentFocused = true;
		},
		
		// 聚焦评论输入框
		focusComment() {
			this.isCommentFocused = true;
		},
		
		// 评论输入框聚焦
		onCommentFocus() {
			this.isCommentFocused = true;
		},
		
		// 评论输入框失焦
		onCommentBlur() {
			this.isCommentFocused = false;
		},
		
		// 分享帖子
		sharePost() {
			uni.showActionSheet({
				itemList: ['分享到微信', '分享到QQ', '复制链接'],
				success: (res) => {
					const actions = ['分享到微信', '分享到QQ', '复制链接'];
					uni.showToast({
						title: actions[res.tapIndex],
						icon: 'none'
					});
				}
			});
		},
		
		// 预览图片
		previewImages(images, current) {
			uni.previewImage({
				urls: images,
				current: current
			});
		},
		
		// 显示更多操作
		showMoreActions() {
			this.showActionModal = true;
		},
		
		// 隐藏更多操作
		hideMoreActions() {
			this.showActionModal = false;
		},
		
		// 举报帖子
		reportPost() {
			this.hideMoreActions();
			uni.showModal({
				title: '举报帖子',
				content: '确定要举报这个帖子吗？',
				success: (res) => {
					if (res.confirm) {
						uni.showToast({
							title: '举报成功',
							icon: 'success'
						});
					}
				}
			});
		},
		
		// 屏蔽用户
		blockUser() {
			this.hideMoreActions();
			uni.showModal({
				title: '屏蔽用户',
				content: '确定要屏蔽这个用户吗？',
				success: (res) => {
					if (res.confirm) {
						uni.showToast({
							title: '屏蔽成功',
							icon: 'success'
						});
					}
				}
			});
		},
		
		// 删除帖子
		deletePost() {
			this.hideMoreActions();
			uni.showModal({
				title: '删除帖子',
				content: '确定要删除这个帖子吗？删除后无法恢复。',
				success: (res) => {
					if (res.confirm) {
						this.performDeletePost();
					}
				}
			});
		},
		
		// 执行删除帖子
		async performDeletePost() {
			const token = uni.getStorageSync('token');
			if (!token) return;
			
			try {
				const response = await uni.request({
					url: `http://localhost:3000/api/community/posts/${this.postId}`,
					method: 'DELETE',
					header: {
						'Authorization': `Bearer ${token}`
					}
				});
				
				if (response.data && response.data.success) {
					uni.showToast({
						title: '删除成功',
						icon: 'success'
					});
					setTimeout(() => {
						uni.navigateBack();
					}, 1500);
				} else {
					uni.showToast({
						title: response.data.message || '删除失败',
						icon: 'none'
					});
				}
			} catch (error) {
				console.error('删除帖子失败:', error);
				uni.showToast({
					title: '网络错误',
					icon: 'none'
				});
			}
		},
		
		// 获取分类名称
		getCategoryName(category) {
			const categoryMap = {
				'second_hand': '二手市场',
				'dating': '恋爱交友',
				'help': '打听求助',
				'part_time': '发布兼职',
				'gossip': '校园八卦'
			};
			return categoryMap[category] || category;
		},
		
		// 格式化时间
		formatTime(timeStr) {
			const time = new Date(timeStr);
			const now = new Date();
			const diff = now - time;
			
			if (diff < 60000) { // 1分钟内
				return '刚刚';
			} else if (diff < 3600000) { // 1小时内
				return Math.floor(diff / 60000) + '分钟前';
			} else if (diff < 86400000) { // 1天内
				return Math.floor(diff / 3600000) + '小时前';
			} else if (diff < 604800000) { // 1周内
				return Math.floor(diff / 86400000) + '天前';
			} else {
				return time.toLocaleDateString();
			}
		}
	}
}
</script>

<style scoped>
.post-detail-page {
	min-height: 100vh;
	background-color: #f5f5f5;
}

/* 导航栏 */
.navbar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding:12rpx 30rpx;
	padding-top: calc(16rpx + env(safe-area-inset-top));
	background-color: #fff;
	box-shadow: 0 6rpx 16rpx rgba(0,0,0,0.06);
	position: sticky;
	top: 0;
	z-index: 100;
}

.nav-left, .nav-right {
	width: 60rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.nav-left image, .nav-right image {
	width: 40rpx;
	height: 40rpx;
}

.nav-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
}

/* 内容容器 */
.content-container {
	height: calc(100vh - 260rpx);
}

/* 帖子主体 */
.post-main {
	background-color: #fff;
	margin: 20rpx;
	border-radius: 20rpx;
	padding: 30rpx;
	box-shadow: 0 6rpx 18rpx rgba(0, 0, 0, 0.06);
	transition: box-shadow 0.18s ease;
}

/* 帖子头部 */
.post-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 30rpx;
}

.user-info {
	display: flex;
	align-items: center;
}

.user-avatar {
	width: 100rpx;
	height: 100rpx;
	border-radius: 50rpx;
	margin-right: 20rpx;
	box-shadow: 0 4rpx 10rpx rgba(0,0,0,0.08);
}

.user-details {
	display: flex;
	flex-direction: column;
}

.user-name {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 8rpx;
}

.post-time {
	font-size: 24rpx;
	color: #999;
}

.post-category {
	margin-left: auto;
}

.category-tag {
	padding: 10rpx 20rpx;
	border-radius: 25rpx;
	font-size: 24rpx;
	color: #fff;
}

.category-second_hand { background-color: #FF6B6B; }
.category-dating { background-color: #4ECDC4; }
.category-help { background-color: #45B7D1; }
.category-part_time { background-color: #96CEB4; }
.category-gossip { background-color: #FFEAA7; color: #333; }

/* 帖子内容 */
.post-content {
	margin-bottom: 30rpx;
}

.post-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 20rpx;
	display: block;
}

.post-text {
	font-size: 30rpx;
	color: #666;
	line-height: 1.6;
	display: block;
	margin-bottom: 30rpx;
}

/* 图片展示 */
.post-images {
	display: flex;
	flex-wrap: wrap;
	gap: 15rpx;
}

.image-item {
	width: 200rpx;
	height: 200rpx;
	border-radius: 12rpx;
	overflow: hidden;
}

.post-image {
	width: 100%;
	height: 100%;
}

/* 互动统计 */
.post-stats {
	display: flex;
	gap: 30rpx;
	margin-bottom: 30rpx;
	padding: 20rpx 0;
	border-top: 1rpx solid #f0f0f0;
	border-bottom: 1rpx solid #f0f0f0;
}

.stat-item {
	font-size: 26rpx;
	color: #999;
}

/* 互动按钮 */
.post-actions {
	display: flex;
	gap: 36rpx;
}

.action-btn {
	display: flex;
	align-items: center;
	gap: 10rpx;
	padding: 15rpx 25rpx;
	border-radius: 25rpx;
	background-color: #f5f5f5;
	transition: background-color 0.18s ease, transform 0.18s ease;
}

.action-btn.active {
	background-color: #FFE6E6;
}

.action-icon {
	width: 36rpx;
	height: 36rpx;
}

.action-text {
	font-size: 26rpx;
	color: #666;
}

.action-btn.active .action-text {
	color: #FF6B6B;
}

.action-btn:active {
	background-color: #f0f3f6;
	transform: scale(0.98);
}

/* 评论区域 */
.comments-section {
	background-color: #fff;
	margin: 20rpx;
	border-radius: 20rpx;
	padding: 30rpx;
	box-shadow: 0 6rpx 18rpx rgba(0, 0, 0, 0.06);
}

.section-header {
	margin-bottom: 30rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

/* 评论列表 */
.comments-list {
	display: flex;
	flex-direction: column;
	gap: 30rpx;
}

.comment-item {
	display: flex;
	gap: 20rpx;
}

.comment-avatar {
	width: 80rpx;
	height: 80rpx;
	border-radius: 40rpx;
	flex-shrink: 0;
}

.comment-content {
	flex: 1;
}

.comment-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 10rpx;
}

.comment-author {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
}

.comment-time {
	font-size: 24rpx;
	color: #999;
}

.comment-text {
	font-size: 28rpx;
	color: #666;
	line-height: 1.5;
	margin-bottom: 15rpx;
	display: block;
}

.comment-actions {
	display: flex;
	gap: 30rpx;
}

.comment-action {
	display: flex;
	align-items: center;
	gap: 8rpx;
}

.comment-action-icon {
	width: 32rpx;
	height: 32rpx;
}

.comment-action-icon.liked {
	filter: hue-rotate(0deg) saturate(2);
}

.comment-action-text {
	font-size: 24rpx;
	color: #999;
}

.comment-action-text.liked {
	color: #FF6B6B;
}

/* 空状态 */
.empty-comments {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 60rpx 40rpx;
}

.empty-image {
	width: 150rpx;
	height: 150rpx;
	margin-bottom: 20rpx;
	opacity: 0.6;
}

.empty-text {
	font-size: 28rpx;
	color: #666;
	margin-bottom: 10rpx;
}

.empty-desc {
	font-size: 24rpx;
	color: #999;
}

/* 加载状态 */
.loading-state {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 400rpx;
}

.loading-text {
	font-size: 28rpx;
	color: #999;
}

/* 评论输入框 */
.comment-input-container {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: #fff;
	border-top: 1rpx solid #eee;
	padding: 20rpx 30rpx;
	padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
	z-index: 99;
}

.comment-input-wrapper {
	display: flex;
	align-items: center;
	gap: 20rpx;
}

.comment-input {
	flex: 1;
	height: 80rpx;
	padding: 0 20rpx;
	border: 1rpx solid #ddd;
	border-radius: 40rpx;
	font-size: 28rpx;
	background-color: #f5f5f5;
}

.comment-send {
	padding: 20rpx 30rpx;
	border-radius: 40rpx;
	background-color: #f5f5f5;
	transition: all 0.3s ease;
}

.comment-send.active {
	background-color: #007AFF;
}

.send-text {
	font-size: 28rpx;
	color: #999;
}

.comment-send.active .send-text {
	color: #fff;
}

/* 操作弹窗 */
.action-popup {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
}

.action-content {
	background-color: #fff;
	border-radius: 20rpx;
	padding: 20rpx 0;
	margin: 0 40rpx;
	min-width: 400rpx;
}

.action-item {
	display: flex;
	align-items: center;
	gap: 20rpx;
	padding: 30rpx 40rpx;
}

.action-item-icon {
	width: 40rpx;
	height: 40rpx;
}

.action-item-text {
	font-size: 30rpx;
	color: #333;
}
</style>
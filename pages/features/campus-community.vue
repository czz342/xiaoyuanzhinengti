<template>
	<view class="community-page">
		<!-- 顶部导航栏 -->
		<view class="navbar">
			<view class="nav-left" @tap="goBack">
				<image src="/static/images/arrow-left.png" mode="aspectFit"></image>
			</view>
			<text class="nav-title">校园圈子</text>
			<view class="nav-right" @tap="showSearch">
				<image src="/static/images/search.png" mode="aspectFit"></image>
			</view>
		</view>
		
		<!-- 分类标签 -->
		<view class="category-tabs">
			<scroll-view class="tabs-scroll" scroll-x="true" show-scrollbar="false">
				<view class="tabs-container">
					<view 
						class="tab-item" 
						:class="{ active: currentCategory === item.key }"
						v-for="item in categories" 
						:key="item.key"
						@tap="switchCategory(item.key)"
					>
						<text class="tab-text">{{ item.label }}</text>
					</view>
				</view>
			</scroll-view>
		</view>
		
		<!-- 帖子列表 -->
		<scroll-view 
			class="posts-container" 
			scroll-y="true" 
			@scrolltolower="loadMore"
			refresher-enabled="true"
			@refresherrefresh="onRefresh"
			:refresher-triggered="isRefreshing"
		>
			<view class="posts-list">
				<view 
					class="post-card" 
					v-for="post in posts" 
					:key="post.id"
					@tap="viewPostDetail(post.id)"
				>
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
								v-for="(image, index) in post.images.slice(0, 9)" 
								:key="index"
								@tap.stop="previewImages(post.images, index)"
							>
								<image :src="image" mode="aspectFill" class="post-image"></image>
							</view>
						</view>
					</view>
					
					<!-- 互动区域 -->
					<view class="post-actions">
						<view class="action-item" @tap.stop="toggleLike(post)">
							<image 
								:src="post.is_liked ? '/static/images/like-filled.png' : '/static/images/like.png'" 
								mode="aspectFit" 
								class="action-icon"
								:class="{ liked: post.is_liked }"
							></image>
							<text class="action-text" :class="{ liked: post.is_liked }">
								{{ post.like_count || 0 }}
							</text>
						</view>
						
						<view class="action-item" @tap.stop="viewPostDetail(post.id)">
							<image src="/static/images/comment.png" mode="aspectFit" class="action-icon"></image>
							<text class="action-text">{{ post.comment_count || 0 }}</text>
						</view>
						
						<view class="action-item" @tap.stop="sharePost(post)">
							<image src="/static/images/share.png" mode="aspectFit" class="action-icon"></image>
							<text class="action-text">分享</text>
						</view>
						
						<view class="action-item view-count">
							<image src="/static/images/view.png" mode="aspectFit" class="action-icon"></image>
							<text class="action-text">{{ post.view_count || 0 }}</text>
						</view>
					</view>
				</view>
				
				<!-- 加载更多 -->
				<view class="load-more" v-if="hasMore && !isLoading">
					<text class="load-text">上拉加载更多</text>
				</view>
				
				<!-- 加载中 -->
				<view class="loading" v-if="isLoading">
					<text class="loading-text">加载中...</text>
				</view>
				
				<!-- 没有更多 -->
				<view class="no-more" v-if="!hasMore && posts.length > 0">
					<text class="no-more-text">没有更多内容了</text>
				</view>
				
				<!-- 空状态 -->
				<view class="empty-state" v-if="posts.length === 0 && !isLoading">
					<image src="/static/images/empty-posts.png" mode="aspectFit" class="empty-image"></image>
					<text class="empty-text">暂无帖子</text>
					<text class="empty-desc">快来发布第一个帖子吧！</text>
				</view>
			</view>
		</scroll-view>
		
		<!-- 发布按钮 -->
		<view class="fab-button" @tap="createPost">
			<image src="/static/images/add.png" mode="aspectFit" class="fab-icon"></image>
		</view>
		
		<!-- 搜索弹窗 -->
		<view class="search-popup" v-if="showSearchModal" @tap="hideSearch">
			<view class="search-content" @tap.stop>
				<view class="search-header">
					<text class="search-title">搜索帖子</text>
					<view class="search-close" @tap="hideSearch">
						<image src="/static/images/close.png" mode="aspectFit"></image>
					</view>
				</view>
				<view class="search-input-container">
					<input 
						class="search-input" 
						v-model="searchKeyword" 
						placeholder="输入关键词搜索..."
						@confirm="performSearch"
					/>
					<view class="search-btn" @tap="performSearch">
						<image src="/static/images/search.png" mode="aspectFit"></image>
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
			// 分类数据
			categories: [
				{ key: 'all', label: '全部' },
				{ key: 'second_hand', label: '二手市场' },
				{ key: 'dating', label: '恋爱交友' },
				{ key: 'help', label: '打听求助' },
				{ key: 'part_time', label: '发布兼职' },
				{ key: 'gossip', label: '校园八卦' }
			],
			currentCategory: 'all',
			
			// 帖子数据
			posts: [],
			page: 1,
			limit: 10,
			hasMore: true,
			isLoading: false,
			isRefreshing: false,
			
			// 搜索
			showSearchModal: false,
			searchKeyword: ''
		}
	},
	
	onLoad() {
		this.loadPosts();
	},
	
	onShow() {
		// 页面显示时刷新数据
		this.refreshPosts();
	},
	
	methods: {
		// 返回上一页
		goBack() {
			uni.navigateBack();
		},
		
		// 切换分类
		switchCategory(category) {
			if (this.currentCategory === category) return;
			
			this.currentCategory = category;
			this.page = 1;
			this.hasMore = true;
			this.posts = [];
			this.loadPosts();
		},
		
		// 加载帖子列表
		async loadPosts() {
			if (this.isLoading) return;
			
			this.isLoading = true;
			
			try {
				const params = {
					page: this.page,
					limit: this.limit,
					sort_by: 'created_at',
					sort_order: 'DESC'
				};
				
				// 添加分类筛选
				if (this.currentCategory !== 'all') {
					params.category = this.currentCategory;
				}
				
				// 添加搜索关键词
				if (this.searchKeyword) {
					params.keyword = this.searchKeyword;
				}
				
				const token = uni.getStorageSync('token');
				const headers = {};
				if (token) {
					headers['Authorization'] = `Bearer ${token}`;
				}
				
				const response = await uni.request({
					url: 'http://localhost:3000/api/community/posts',
					method: 'GET',
					data: params,
					header: headers
				});
				
				console.log('帖子列表响应:', response);
				
				if (response.data && response.data.success) {
					const rawPosts = response.data.data.posts || [];
					// 回退映射：头像与昵称
					const mapped = rawPosts.map(p => ({
						...p,
						author_avatar: p.author_avatar || '/static/images/default-avatar.png',
						author_name: p.author_nickname || p.nickName || p.displayName || p.author_name || '匿名用户'
					}));
					
					if (this.page === 1) {
						this.posts = mapped;
					} else {
						this.posts = [...this.posts, ...mapped];
					}
					
					this.hasMore = rawPosts.length === this.limit;
				} else {
					uni.showToast({
						title: response.data.message || '加载失败',
						icon: 'none'
					});
				}
			} catch (error) {
				console.error('加载帖子失败:', error);
				uni.showToast({
					title: '网络错误',
					icon: 'none'
				});
			} finally {
				this.isLoading = false;
				this.isRefreshing = false;
			}
		},
		
		// 刷新帖子
		refreshPosts() {
			this.page = 1;
			this.hasMore = true;
			this.posts = [];
			this.loadPosts();
		},
		
		// 下拉刷新
		onRefresh() {
			this.isRefreshing = true;
			this.refreshPosts();
		},
		
		// 加载更多
		loadMore() {
			if (this.hasMore && !this.isLoading) {
				this.page++;
				this.loadPosts();
			}
		},
		
		// 查看帖子详情
		viewPostDetail(postId) {
			uni.navigateTo({
				url: `/pages/features/community-post-detail?id=${postId}`
			});
		},
		
		// 创建帖子
		createPost() {
			uni.navigateTo({
				url: '/pages/features/community-create-post'
			});
		},
		
		// 切换点赞状态
		async toggleLike(post) {
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
						target_id: post.id
					}
				});
				
				if (response.data && response.data.success) {
					// 更新本地状态
					const postIndex = this.posts.findIndex(p => p.id === post.id);
					if (postIndex !== -1) {
						this.posts[postIndex].is_liked = response.data.data.is_liked;
						this.posts[postIndex].like_count = response.data.data.is_liked 
							? this.posts[postIndex].like_count + 1 
							: Math.max(0, this.posts[postIndex].like_count - 1);
					}
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
		
		// 分享帖子
		sharePost(post) {
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
		
		// 显示搜索
		showSearch() {
			this.showSearchModal = true;
		},
		
		// 隐藏搜索
		hideSearch() {
			this.showSearchModal = false;
			this.searchKeyword = '';
		},
		
		// 执行搜索
		performSearch() {
			if (!this.searchKeyword.trim()) {
				uni.showToast({
					title: '请输入搜索关键词',
					icon: 'none'
				});
				return;
			}
			
			this.hideSearch();
			this.refreshPosts();
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
.community-page {
	min-height: 100vh;
	background-color: #f5f5f5;
}

/* 导航栏 */
.navbar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 12rpx 30rpx;
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

/* 分类标签 */
.category-tabs {
	background-color: #fff;
	border-bottom: 1rpx solid #eee;
	position: sticky;
	top: calc(96rpx + env(safe-area-inset-top));
	z-index: 90;
}

.tabs-scroll {
	white-space: nowrap;
}

.tabs-container {
	display: flex;
	padding: 10rpx 30rpx 16rpx;
}

.tab-item {
	padding: 18rpx 30rpx;
	margin-right: 20rpx;
	border-radius: 30rpx;
	background-color: #f7f8fa;
	transition: all 0.24s ease;
}

.tab-item.active {
	background: linear-gradient(135deg, #007AFF 0%, #0056CC 100%);
	box-shadow: 0 6rpx 16rpx rgba(0,122,255,0.25);
}

.tab-text {
	font-size: 28rpx;
	color: #666;
	white-space: nowrap;
}

.tab-item.active .tab-text {
	color: #fff;
	font-weight: bold;
}

/* 帖子列表 */
.posts-container {
	height: calc(100vh - 260rpx);
	padding: 24rpx 24rpx 120rpx;
}

.posts-list {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

/* 帖子卡片 */
.post-card {
	background-color: #fff;
	border-radius: 20rpx;
	padding: 30rpx;
	box-shadow: 0 6rpx 18rpx rgba(0, 0, 0, 0.06);
	transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.post-card:active {
	transform: scale(0.996);
	box-shadow: 0 8rpx 22rpx rgba(0,0,0,0.1);
}

/* 帖子头部 */
.post-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.user-info {
	display: flex;
	align-items: center;
}

.user-avatar {
	width: 80rpx;
	height: 80rpx;
	border-radius: 40rpx;
	margin-right: 20rpx;
	box-shadow: 0 4rpx 10rpx rgba(0,0,0,0.08);
}

.user-details {
	display: flex;
	flex-direction: column;
}

.user-name {
	font-size: 28rpx;
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
	padding: 8rpx 16rpx;
	border-radius: 20rpx;
	font-size: 22rpx;
	color: #fff;
}

.category-second_hand { background-color: #FF6B6B; }
.category-dating { background-color: #4ECDC4; }
.category-help { background-color: #45B7D1; }
.category-part_time { background-color: #96CEB4; }
.category-gossip { background-color: #FFEAA7; color: #333; }

/* 帖子内容 */
.post-content {
	margin-bottom: 20rpx;
}

.post-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 16rpx;
	display: block;
}

.post-text {
	font-size: 28rpx;
	color: #666;
	line-height: 1.6;
	display: block;
	margin-bottom: 20rpx;
}

/* 图片展示 */
.post-images {
	display: flex;
	flex-wrap: wrap;
	gap: 10rpx;
}

.image-item {
	width: 220rpx;
	height: 200rpx;
	border-radius: 12rpx;
	overflow: hidden;
}

.post-image {
	width: 100%;
	height: 100%;
}

/* 互动区域 */
.post-actions {
	display: flex;
	align-items: center;
	gap: 36rpx;
	padding-top: 22rpx;
	border-top: 1rpx solid #f0f0f0;
}

.action-item {
	display: flex;
	align-items: center;
	gap: 10rpx;
	padding: 8rpx 12rpx;
	border-radius: 24rpx;
	transition: background-color 0.18s ease, transform 0.18s ease;
}

.action-item.view-count {
	margin-left: auto;
}

.action-icon {
	width: 36rpx;
	height: 36rpx;
}

.action-icon.liked {
	filter: hue-rotate(0deg) saturate(2);
	transform: scale(1.05);
}

.action-text {
	font-size: 24rpx;
	color: #666;
}

.action-text.liked {
	color: #FF6B6B;
}

.action-item:active {
	background-color: #f5f7fa;
	transform: scale(0.98);
}

/* 加载状态 */
.load-more, .loading, .no-more {
	text-align: center;
	padding: 40rpx;
}

.load-text, .loading-text, .no-more-text {
	font-size: 28rpx;
	color: #999;
}

/* 空状态 */
.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 100rpx 40rpx;
}

.empty-image {
	width: 200rpx;
	height: 200rpx;
	margin-bottom: 30rpx;
	opacity: 0.6;
}

.empty-text {
	font-size: 32rpx;
	color: #666;
	margin-bottom: 15rpx;
}

.empty-desc {
	font-size: 28rpx;
	color: #999;
}

/* 发布按钮 */
.fab-button {
	position: fixed;
	right: 40rpx;
	bottom: 40rpx;
	width: 120rpx;
	height: 120rpx;
	background: linear-gradient(135deg, #007AFF 0%, #0056CC 100%);
	border-radius: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 12rpx 28rpx rgba(0, 122, 255, 0.32);
	z-index: 99;
	animation: fabPulse 2.2s ease-in-out infinite;
}

.fab-icon {
	width: 60rpx;
	height: 60rpx;
}

@keyframes fabPulse {
	0% { transform: translateZ(0) scale(1); }
	50% { transform: translateZ(0) scale(1.04); }
	100% { transform: translateZ(0) scale(1); }
}

/* 搜索弹窗 */
.search-popup {
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

.search-content {
	width: 80%;
	background-color: #fff;
	border-radius: 20rpx;
	padding: 40rpx;
}

.search-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 30rpx;
}

.search-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.search-close {
	width: 40rpx;
	height: 40rpx;
}

.search-close image {
	width: 100%;
	height: 100%;
}

.search-input-container {
	display: flex;
	align-items: center;
	gap: 20rpx;
}

.search-input {
	flex: 1;
	height: 80rpx;
	padding: 0 20rpx;
	border: 1rpx solid #ddd;
	border-radius: 40rpx;
	font-size: 28rpx;
}

.search-btn {
	width: 80rpx;
	height: 80rpx;
	background-color: #007AFF;
	border-radius: 40rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.search-btn image {
	width: 40rpx;
	height: 40rpx;
}
</style>
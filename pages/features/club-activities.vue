<template>
	<view class="activity-center">
		<!-- 顶部导航栏 -->
		<view class="header">
			<view class="header-content">
				<text class="header-title">活动中心</text>
				<view class="header-actions">
					<view class="search-btn" @tap="showSearch">
						<image src="/static/images/search.png" mode="aspectFit"></image>
					</view>
					<view class="filter-btn" @tap="showFilter">
						<image src="/static/images/filter.png" mode="aspectFit"></image>
					</view>
				</view>
			</view>
		</view>

		<!-- 用户积分和诚信度卡片 -->
		<view class="user-stats-card">
			<view class="stats-row">
				<view class="stat-item">
					<text class="stat-value">{{userPoints.current_points}}</text>
					<text class="stat-label">当前积分</text>
					<view class="progress-bar">
						<view class="progress-fill" :style="{width: progressPercentage + '%'}"></view>
					</view>
					<text class="progress-text">{{userPoints.current_points}}/{{userPoints.semester_target}}</text>
				</view>
				<view class="stat-divider"></view>
				<view class="stat-item">
					<text class="stat-value">{{userCredibility.credibility_score}}</text>
					<text class="stat-label">诚信度</text>
					<view class="credibility-level" :class="credibilityLevel.level">
						<text>{{credibilityLevel.name}}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 轮播图区域 -->
		<view class="banner-section" v-if="(featuredActivities || []).length > 0">
			<swiper class="banner-swiper" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="500">
				<swiper-item v-for="(activity, index) in (featuredActivities || [])" :key="index" :data-activity-id="activity.id" @tap="goToActivityDetail">
					<view class="banner-item">
						<image :src="activity.image_url || '/static/images/activity/校园摄影大赛.png'" mode="aspectFill" class="banner-image"></image>
						<view class="banner-overlay">
							<view class="banner-content">
								<text class="banner-title">{{activity.title}}</text>
								<text class="banner-club">{{activity.club_name}}</text>
								<view class="banner-meta">
									<text class="banner-time">{{formatTime(activity.start_time)}}</text>
									<text class="banner-location">{{activity.location}}</text>
								</view>
								<view class="banner-points">
									<text>+{{activity.points_reward}} 积分</text>
								</view>
							</view>
						</view>
					</view>
				</swiper-item>
			</swiper>
		</view>

		<!-- 分类筛选 -->
		<view class="filter-section">
			<scroll-view class="filter-scroll" scroll-x="true" show-scrollbar="false">
				<view class="filter-list">
					<view 
						class="filter-item" 
						:class="{active: currentFilter === filter.key}"
						v-for="filter in filterOptions" 
						:key="filter.key"
						@tap="changeFilter(filter.key)"
					>
						<text>{{filter.label}}</text>
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- 活动列表 -->
		<view class="activity-list">
			<view class="list-header">
				<text class="list-title">活动列表</text>
				<text class="list-count">共 {{activities ? activities.length : 0}} 个活动</text>
			</view>
			
			<view class="activity-cards">
				<view 
					class="activity-card" 
					v-for="activity in (activities || [])" 
					:key="activity.id"
					:data-activity-id="activity.id"
					@tap="goToActivityDetail"
				>
					<view class="card-image">
						<image :src="activity.image_url || '/static/images/activity/校园摄影大赛.png'" mode="aspectFill"></image>
						<view class="card-badge" v-if="activity.is_featured">推荐</view>
						<view class="card-status" :class="activity.status_class">
							{{getActivityStatusText(activity)}}
						</view>
					</view>
					
					<view class="card-content">
						<view class="card-header">
							<text class="card-title">{{activity.title}}</text>
							<view class="card-points">+{{activity.points_reward}}</view>
						</view>
						
						<text class="card-club">{{activity.club_name}}</text>
						
						<view class="card-meta">
							<view class="meta-item">
								<image src="/static/images/time.png" mode="aspectFit"></image>
								<text>{{formatTime(activity.start_time)}}</text>
							</view>
							<view class="meta-item">
								<image src="/static/images/location.png" mode="aspectFit"></image>
								<text>{{activity.location}}</text>
							</view>
						</view>
						
						<view class="card-footer">
							<view class="participants">
								<image src="/static/images/people.png" mode="aspectFit"></image>
								<text>{{activity.current_participants}}/{{activity.max_participants || '∞'}}</text>
							</view>
							<view class="credibility-req" v-if="activity.min_credibility > 0">
								<text>诚信度 ≥ {{activity.min_credibility}}</text>
							</view>
						</view>
						
					</view>
				</view>
			</view>
			
			<!-- 加载更多 -->
			<view class="load-more" v-if="hasMore" @tap="loadMore">
				<text>加载更多</text>
		</view>

			<!-- 空状态 -->
			<view class="empty-state" v-if="(!activities || activities.length === 0) && !loading">
				<image src="/static/images/empty-activity.png" mode="aspectFit"></image>
				<text class="empty-text">暂无活动</text>
				<text class="empty-desc">快来参与校园活动吧！</text>
			</view>
		</view>

		<!-- 搜索弹窗 -->
		<view class="search-modal" v-if="showSearchModal" @tap="hideSearch">
			<view class="search-content" @tap.stop>
				<view class="search-header">
					<input 
						class="search-input" 
						v-model="searchKeyword" 
						placeholder="搜索活动名称、社团..."
						@confirm="performSearch"
					/>
					<text class="search-cancel" @tap="hideSearch">取消</text>
				</view>
				<view class="search-results" v-if="(searchResults || []).length > 0">
					<view 
						class="search-item" 
						v-for="activity in (searchResults || [])" 
						:key="activity.id"
						:data-activity-id="activity.id"
						@tap="goToActivityDetail"
					>
						<text class="search-title">{{activity.title}}</text>
						<text class="search-club">{{activity.club_name}}</text>
							</view>
						</view>
					</view>
				</view>
				
		<!-- 筛选弹窗 -->
		<view class="filter-modal" v-if="showFilterModal" @tap="hideFilter">
			<view class="filter-content" @tap.stop>
				<view class="filter-header">
					<text class="filter-title">筛选条件</text>
					<text class="filter-close" @tap="hideFilter">×</text>
				</view>
				<view class="filter-options">
					<view class="option-group">
						<text class="option-title">活动状态</text>
						<view class="option-list">
							<view 
								class="option-item" 
								:class="{active: selectedFilters.status === option.value}"
								v-for="option in statusOptions" 
								:key="option.value"
								@tap="selectFilter('status', option.value)"
							>
								<text>{{option.label}}</text>
							</view>
						</view>
					</view>
					<view class="option-group">
						<text class="option-title">积分范围</text>
						<view class="option-list">
							<view 
								class="option-item" 
								:class="{active: selectedFilters.points === option.value}"
								v-for="option in pointsOptions" 
								:key="option.value"
								@tap="selectFilter('points', option.value)"
							>
								<text>{{option.label}}</text>
					</view>
						</view>
					</view>
				</view>
				<view class="filter-actions">
					<button class="filter-reset" @tap="resetFilters">重置</button>
					<button class="filter-confirm" @tap="applyFilters">确定</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			// 用户数据
			userPoints: {
				current_points: 0,
				semester_target: 100,
				earned_points: 0
			},
			userCredibility: {
				credibility_score: 5.00,
				total_activities: 0,
				attended_activities: 0
			},
			credibilityLevel: {
				level: 'average',
				name: '一般',
				color: '#FF9500'
			},
			
			// 活动数据
			featuredActivities: [],
			activities: [],
			searchResults: [],
			
			// 筛选和搜索
			currentFilter: 'all',
			filterOptions: [
				{ key: 'all', label: '全部' },
				{ key: 'ongoing', label: '进行中' },
				{ key: 'upcoming', label: '即将开始' },
				{ key: 'my', label: '我的活动' }
			],
			showSearchModal: false,
			showFilterModal: false,
			searchKeyword: '',
			selectedFilters: {
				status: 'all',
				points: 'all'
			},
			statusOptions: [
				{ value: 'all', label: '全部' },
				{ value: 'published', label: '已发布' },
				{ value: 'ongoing', label: '进行中' },
				{ value: 'completed', label: '已结束' }
			],
			pointsOptions: [
				{ value: 'all', label: '全部' },
				{ value: 'high', label: '10分以上' },
				{ value: 'medium', label: '5-10分' },
				{ value: 'low', label: '5分以下' }
			],
			
			// 分页
			page: 1,
			limit: 10,
			hasMore: true,
			loading: false
		}
	},
	computed: {
		progressPercentage() {
			if (this.userPoints.semester_target === 0) return 0;
			return Math.min(100, (this.userPoints.current_points / this.userPoints.semester_target) * 100);
		}
	},
	onLoad() {
		console.log('页面加载，开始初始化数据');
		this.loadUserData();
		this.loadFeaturedActivities();
		this.loadActivities();
	},
	onShow() {
		// 页面显示时刷新数据
		this.loadUserData();
	},
	onPullDownRefresh() {
		this.refreshData();
	},
	onReachBottom() {
		if (this.hasMore && !this.loading) {
			this.loadMore();
		}
	},
	methods: {
		// 加载用户数据
		async loadUserData() {
			try {
				const token = uni.getStorageSync('token');
				if (!token) return;

				// 并行加载积分和诚信度数据
				const [pointsRes, credibilityRes] = await Promise.all([
					uni.request({
						url: 'http://localhost:3000/api/activities/my/points',
						method: 'GET',
						header: { 'Authorization': `Bearer ${token}` }
					}),
					uni.request({
						url: 'http://localhost:3000/api/activities/my/credibility',
						method: 'GET',
						header: { 'Authorization': `Bearer ${token}` }
					})
				]);

				if (pointsRes.statusCode === 200 && pointsRes.data.success) {
					this.userPoints = pointsRes.data.data;
				}

				if (credibilityRes.statusCode === 200 && credibilityRes.data.success) {
					this.userCredibility = credibilityRes.data.data;
					this.credibilityLevel = credibilityRes.data.data.level;
				}
			} catch (err) {
				console.error('加载用户数据失败:', err);
			}
		},

		// 加载推荐活动
		async loadFeaturedActivities() {
			try {
				const res = await uni.request({
					url: 'http://localhost:3000/api/activities/featured',
					method: 'GET'
				});

				if (res.statusCode === 200 && res.data.success) {
					const activities = res.data.data.activities || [];
					// 为每个推荐活动添加状态类
					this.featuredActivities = activities.map(activity => ({
						...activity,
						status_class: this.calculateActivityStatusClass(activity)
					}));
				} else {
					this.featuredActivities = [];
				}
			} catch (err) {
				console.error('加载推荐活动失败:', err);
				this.featuredActivities = [];
			}
		},

		// 加载活动列表
		async loadActivities() {
			if (this.loading) return;
			
			this.loading = true;
			try {
				const params = {
					page: this.page,
					limit: this.limit
				};

				console.log('开始加载活动列表，当前筛选条件:', this.currentFilter);

				// 根据当前筛选条件添加参数
				if (this.currentFilter === 'my') {
					// 加载我的活动
					const token = uni.getStorageSync('token');
					if (!token) {
						this.activities = [];
						return;
					}

					const res = await uni.request({
						url: 'http://localhost:3000/api/activities/my/activities',
						method: 'GET',
						header: { 'Authorization': `Bearer ${token}` }
					});

					console.log('我的活动API响应:', res);

					if (res.statusCode === 200 && res.data.success) {
						const activities = res.data.data.activities || [];
						// 为每个活动添加状态类
						this.activities = activities.map(activity => ({
							...activity,
							status_class: this.calculateActivityStatusClass(activity)
						}));
					} else {
						this.activities = [];
					}
				} else {
					// 加载所有活动
					const res = await uni.request({
						url: 'http://localhost:3000/api/activities/list',
						method: 'GET',
						data: params
					});

					console.log('活动列表API响应:', res);

					if (res.statusCode === 200 && res.data.success) {
						const newActivities = res.data.data.activities || [];
						console.log('API返回的原始活动数据:', newActivities);
						
						// 为每个活动添加状态类
						const processedActivities = newActivities.map(activity => {
							console.log('处理活动数据:', activity);
							return {
								...activity,
								status_class: this.calculateActivityStatusClass(activity)
							};
						});
						
						console.log('处理后的活动数据:', processedActivities);
						
						if (this.page === 1) {
							this.activities = processedActivities;
						} else {
							this.activities = [...this.activities, ...processedActivities];
						}
						this.hasMore = newActivities.length === this.limit;
					} else {
						// 如果API请求失败，使用测试数据
						console.log('API请求失败，使用测试数据');
						const testActivity = {
							id: 1,
							title: '测试活动1',
							description: '这是一个测试活动',
							club_name: '测试社团',
							start_time: '2024-12-25 09:00:00',
							end_time: '2024-12-25 17:00:00',
							location: '测试地点',
							points_reward: 10,
							current_participants: 5,
							max_participants: 20,
							is_featured: true,
							image_url: '/static/images/activity/校园摄影大赛.png'
						};
						this.activities = [{
							...testActivity,
							status_class: this.calculateActivityStatusClass(testActivity)
						}];
					}
				}

				console.log('活动列表加载完成，数量:', this.activities.length);
			} catch (err) {
				console.error('加载活动列表失败:', err);
				// 使用测试数据
				const testActivity = {
					id: 1,
					title: '测试活动1',
					description: '这是一个测试活动',
					club_name: '测试社团',
					start_time: '2024-12-25 09:00:00',
					end_time: '2024-12-25 17:00:00',
					location: '测试地点',
					points_reward: 10,
					current_participants: 5,
					max_participants: 20,
					is_featured: true,
					image_url: '/static/images/activity/校园摄影大赛.png'
				};
				this.activities = [{
					...testActivity,
					status_class: this.calculateActivityStatusClass(testActivity)
				}];
			} finally {
				this.loading = false;
			}
		},

		// 刷新数据
		async refreshData() {
			this.page = 1;
			this.hasMore = true;
			await Promise.all([
				this.loadUserData(),
				this.loadFeaturedActivities(),
				this.loadActivities()
			]);
			uni.stopPullDownRefresh();
		},

		// 加载更多
		loadMore() {
			if (this.hasMore && !this.loading) {
				this.page++;
				this.loadActivities();
			}
		},

		// 切换筛选条件
		changeFilter(filterKey) {
			this.currentFilter = filterKey;
			this.page = 1;
			this.hasMore = true;
			this.loadActivities();
		},

		// 显示搜索
		showSearch() {
			this.showSearchModal = true;
		},

		// 隐藏搜索
		hideSearch() {
			this.showSearchModal = false;
			this.searchKeyword = '';
			this.searchResults = [];
		},

		// 执行搜索
		async performSearch() {
			if (!this.searchKeyword.trim()) return;

			try {
				const res = await uni.request({
					url: 'http://localhost:3000/api/activities/list',
					method: 'GET',
					data: { keyword: this.searchKeyword }
				});

				if (res.statusCode === 200 && res.data.success) {
					this.searchResults = res.data.data.activities || [];
				} else {
					this.searchResults = [];
				}
			} catch (err) {
				console.error('搜索失败:', err);
				this.searchResults = [];
			}
		},

		// 显示筛选
		showFilter() {
			this.showFilterModal = true;
		},

		// 隐藏筛选
		hideFilter() {
			this.showFilterModal = false;
		},

		// 选择筛选条件
		selectFilter(type, value) {
			this.selectedFilters[type] = value;
		},

		// 重置筛选
		resetFilters() {
			this.selectedFilters = {
				status: 'all',
				points: 'all'
			};
		},

		// 应用筛选
		applyFilters() {
			this.hideFilter();
			// 这里可以根据筛选条件重新加载数据
			this.loadActivities();
		},

		// 跳转到活动详情
		goToActivityDetail(event) {
			console.log('点击事件对象:', event);
			
			// 从事件对象的currentTarget中获取data-activity-id
			const activityId = event.currentTarget?.dataset?.activityId;
			console.log('活动ID:', activityId);
			console.log('活动ID类型:', typeof activityId);
			
			if (!activityId) {
				console.error('无法获取活动ID:', event);
			uni.showToast({
					title: '活动数据错误',
				icon: 'none'
			});
				return;
			}
			
			uni.navigateTo({
				url: `/pages/features/activity-detail?id=${activityId}`
			});
		},

		// 处理活动操作（参与/取消）


		// 获取活动状态
		getActivityStatus(activity) {
			const now = new Date();
			const startTime = new Date(activity.start_time);
			const endTime = new Date(activity.end_time);

			if (now < startTime) return 'upcoming';
			if (now >= startTime && now <= endTime) return 'ongoing';
			return 'completed';
		},

		// 计算活动状态样式类（用于数据处理）
		calculateActivityStatusClass(activity) {
			console.log('计算活动状态类，原始活动数据:', activity);
			
			const now = new Date();
			const startTime = new Date(activity.start_time);
			const endTime = new Date(activity.end_time);

			console.log('活动时间计算:', {
				id: activity.id,
				title: activity.title,
				now: now.toISOString(),
				startTime: startTime.toISOString(),
				endTime: endTime.toISOString(),
				nowTime: now.getTime(),
				startTimeTime: startTime.getTime(),
				endTimeTime: endTime.getTime()
			});

			if (now < startTime) return 'upcoming';
			if (now >= startTime && now <= endTime) return 'ongoing';
			return 'completed';
		},


		// 获取活动状态文本
		getActivityStatusText(activity) {
			const status = this.getActivityStatus(activity);
			const statusMap = {
				upcoming: '即将开始',
				ongoing: '进行中',
				completed: '已结束'
			};
			return statusMap[status] || '未知';
		},

		// 格式化时间
		formatTime(timeStr) {
			const date = new Date(timeStr);
			const month = date.getMonth() + 1;
			const day = date.getDate();
			const hours = date.getHours();
			const minutes = date.getMinutes();
			return `${month}/${day} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
		}
	}
}
</script>

<style>
.activity-center {
	background-color: #f5f5f5;
	min-height: 100vh;
}

/* 顶部导航栏 */
.header {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	padding: 20rpx 30rpx;
	position: sticky;
	top: 0;
	z-index: 100;
}

.header-content {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.header-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #fff;
}

.header-actions {
	display: flex;
	gap: 20rpx;
}

.search-btn, .filter-btn {
	width: 60rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: rgba(255, 255, 255, 0.2);
	border-radius: 30rpx;
}

.search-btn image, .filter-btn image {
	width: 32rpx;
	height: 32rpx;
}

/* 用户统计卡片 */
.user-stats-card {
	background-color: #fff;
	margin: 20rpx 30rpx;
	border-radius: 20rpx;
	padding: 30rpx;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.stats-row {
	display: flex;
	align-items: center;
}

.stat-item {
	flex: 1;
	text-align: center;
}

.stat-value {
	font-size: 48rpx;
	font-weight: bold;
	color: #333;
	display: block;
}

.stat-label {
	font-size: 24rpx;
	color: #666;
	margin-top: 10rpx;
	display: block;
}

.progress-bar {
	width: 100%;
	height: 8rpx;
	background-color: #f0f0f0;
	border-radius: 4rpx;
	margin: 15rpx 0 10rpx;
	overflow: hidden;
}

.progress-fill {
	height: 100%;
	background: linear-gradient(90deg, #4cd964 0%, #00B578 100%);
	border-radius: 4rpx;
	transition: width 0.3s ease;
}

.progress-text {
	font-size: 20rpx;
	color: #999;
}

.stat-divider {
	width: 2rpx;
	height: 80rpx;
	background-color: #f0f0f0;
	margin: 0 30rpx;
}

.credibility-level {
	padding: 8rpx 16rpx;
	border-radius: 20rpx;
	margin-top: 10rpx;
	display: inline-block;
}

.credibility-level.excellent {
	background-color: #e6fff2;
	color: #00B578;
}

.credibility-level.good {
	background-color: #e6f7ff;
	color: #4cd964;
}

.credibility-level.average {
	background-color: #fff9e6;
	color: #FF9500;
}

.credibility-level.poor {
	background-color: #ffe6e6;
	color: #FF3B30;
}

.credibility-level.very_poor {
	background-color: #f0f0f0;
	color: #8B0000;
}

/* 轮播图区域 */
.banner-section {
	margin: 20rpx 30rpx;
	border-radius: 20rpx;
	overflow: hidden;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.banner-swiper {
	height: 400rpx;
}

.banner-item {
	position: relative;
	height: 100%;
}

.banner-image {
	width: 100%;
	height: 100%;
}

.banner-overlay {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: linear-gradient(transparent 0%, rgba(0, 0, 0, 0.6) 100%);
	display: flex;
	align-items: flex-end;
	padding: 30rpx;
}

.banner-content {
	color: #fff;
}

.banner-title {
	font-size: 32rpx;
	font-weight: bold;
	display: block;
	margin-bottom: 10rpx;
}

.banner-club {
	font-size: 24rpx;
	opacity: 0.9;
	display: block;
	margin-bottom: 15rpx;
}

.banner-meta {
	display: flex;
	gap: 20rpx;
	margin-bottom: 15rpx;
}

.banner-time, .banner-location {
	font-size: 22rpx;
	opacity: 0.8;
}

.banner-points {
	background-color: rgba(76, 217, 100, 0.9);
	padding: 8rpx 16rpx;
	border-radius: 20rpx;
	display: inline-block;
	font-size: 22rpx;
	font-weight: bold;
}

/* 筛选区域 */
.filter-section {
	background-color: #fff;
	margin: 20rpx 30rpx;
	border-radius: 20rpx;
	padding: 20rpx 0;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.filter-scroll {
	white-space: nowrap;
}

.filter-list {
	display: flex;
	padding: 0 30rpx;
	gap: 20rpx;
}

.filter-item {
	padding: 16rpx 32rpx;
	border-radius: 30rpx;
	background-color: #f5f5f5;
	color: #666;
	font-size: 26rpx;
	white-space: nowrap;
	transition: all 0.3s ease;
}

.filter-item.active {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: #fff;
}

/* 活动列表 */
.activity-list {
	margin: 0 30rpx 30rpx;
}

.list-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.list-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.list-count {
	font-size: 24rpx;
	color: #999;
}

.activity-cards {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.activity-card {
	background-color: #fff;
	border-radius: 20rpx;
	overflow: hidden;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.card-image {
	position: relative;
	height: 300rpx;
}

.card-image image {
	width: 100%;
	height: 100%;
}

.card-badge {
	position: absolute;
	top: 20rpx;
	left: 20rpx;
	background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
	color: #fff;
	padding: 8rpx 16rpx;
	border-radius: 20rpx;
	font-size: 20rpx;
	font-weight: bold;
}

.card-status {
	position: absolute;
	top: 20rpx;
	right: 20rpx;
	padding: 8rpx 16rpx;
	border-radius: 20rpx;
	font-size: 20rpx;
	color: #fff;
}

.card-status.upcoming {
	background-color: #4cd964;
}

.card-status.ongoing {
	background-color: #ff9500;
}

.card-status.completed {
	background-color: #999;
}

.card-content {
	padding: 30rpx;
}

.card-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-bottom: 15rpx;
}

.card-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	flex: 1;
	margin-right: 20rpx;
}

.card-points {
	background: linear-gradient(135deg, #4cd964 0%, #00B578 100%);
	color: #fff;
	padding: 8rpx 16rpx;
	border-radius: 20rpx;
	font-size: 22rpx;
	font-weight: bold;
}

.card-club {
	font-size: 26rpx;
	color: #666;
	margin-bottom: 20rpx;
	display: block;
}

.card-meta {
	display: flex;
	flex-direction: column;
	gap: 10rpx;
	margin-bottom: 20rpx;
}

.meta-item {
	display: flex;
	align-items: center;
	gap: 10rpx;
}

.meta-item image {
	width: 24rpx;
	height: 24rpx;
}

.meta-item text {
	font-size: 24rpx;
	color: #666;
}

.card-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.participants {
	display: flex;
	align-items: center;
	gap: 8rpx;
}

.participants image {
	width: 24rpx;
	height: 24rpx;
}

.participants text {
	font-size: 24rpx;
	color: #666;
}

.credibility-req {
	background-color: #f0f0f0;
	padding: 6rpx 12rpx;
	border-radius: 12rpx;
	font-size: 20rpx;
	color: #666;
}


/* 加载更多 */
.load-more {
	text-align: center;
	padding: 30rpx;
	color: #666;
	font-size: 26rpx;
}

/* 空状态 */
.empty-state {
	text-align: center;
	padding: 100rpx 0;
}

.empty-state image {
	width: 200rpx;
	height: 200rpx;
	margin-bottom: 30rpx;
}

.empty-text {
	font-size: 32rpx;
	color: #333;
	display: block;
	margin-bottom: 15rpx;
}

.empty-desc {
	font-size: 26rpx;
	color: #999;
}

/* 搜索弹窗 */
.search-modal {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	z-index: 1000;
	display: flex;
	align-items: flex-start;
	justify-content: center;
	padding-top: 100rpx;
}

.search-content {
	background-color: #fff;
	border-radius: 20rpx;
	width: 90%;
	max-height: 80vh;
	overflow: hidden;
}

.search-header {
	display: flex;
	align-items: center;
	padding: 30rpx;
	border-bottom: 1rpx solid #f0f0f0;
}

.search-input {
	flex: 1;
	height: 60rpx;
	background-color: #f5f5f5;
	border-radius: 30rpx;
	padding: 0 30rpx;
	font-size: 28rpx;
}

.search-cancel {
	margin-left: 20rpx;
	color: #666;
	font-size: 28rpx;
}

.search-results {
	max-height: 60vh;
	overflow-y: auto;
}

.search-item {
	padding: 30rpx;
	border-bottom: 1rpx solid #f0f0f0;
}

.search-title {
	font-size: 28rpx;
	color: #333;
	display: block;
	margin-bottom: 10rpx;
}

.search-club {
	font-size: 24rpx;
	color: #666;
}

/* 筛选弹窗 */
.filter-modal {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	z-index: 1000;
	display: flex;
	align-items: flex-end;
	justify-content: center;
}

.filter-content {
	background-color: #fff;
	border-radius: 20rpx 20rpx 0 0;
	width: 100%;
	max-height: 80vh;
	overflow: hidden;
}

.filter-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 30rpx;
	border-bottom: 1rpx solid #f0f0f0;
}

.filter-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.filter-close {
	font-size: 40rpx;
	color: #666;
}

.filter-options {
	padding: 30rpx;
	max-height: 60vh;
	overflow-y: auto;
}

.option-group {
	margin-bottom: 40rpx;
}

.option-title {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 20rpx;
	display: block;
}

.option-list {
	display: flex;
	flex-wrap: wrap;
	gap: 20rpx;
}

.option-item {
	padding: 16rpx 32rpx;
	border-radius: 30rpx;
	background-color: #f5f5f5;
	color: #666;
	font-size: 26rpx;
	transition: all 0.3s ease;
}

.option-item.active {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: #fff;
}

.filter-actions {
	display: flex;
	gap: 20rpx;
	padding: 30rpx;
	border-top: 1rpx solid #f0f0f0;
}

.filter-reset, .filter-confirm {
	flex: 1;
	height: 80rpx;
	border-radius: 40rpx;
	font-size: 28rpx;
	border: none;
}

.filter-reset {
	background-color: #f5f5f5;
	color: #666;
}

.filter-confirm {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: #fff;
}
</style> 
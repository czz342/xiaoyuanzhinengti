<template>
	<view class="container">
		<view class="header">
			<text class="title">社团活动</text>
			<text class="subtitle">发现精彩，点燃青春</text>
		</view>

		<view class="content">
			<uni-segmented-control
				:current="currentTab"
				:values="['热门活动', '我的社团']"
				@clickItem="onTabClick"
				style-type="button"
				active-color="#007aff"
			></uni-segmented-control>
			
			<view class="tab-content">
				<!-- 热门活动 -->
				<view v-if="currentTab === 0" class="activity-list">
					<view class="activity-card" v-for="activity in hotActivities" :key="activity.id">
						<image class="activity-banner" :src="activity.banner" mode="aspectFill"></image>
						<view class="activity-info">
							<text class="activity-title">{{ activity.title }}</text>
							<view class="activity-meta">
								<text class="meta-item club">{{ activity.club }}</text>
								<text class="meta-item time">{{ activity.time }}</text>
							</view>
						</view>
						<button class="signup-btn" @tap="signUp(activity)">立即报名</button>
					</view>
				</view>
				
				<!-- 我的社团 -->
				<view v-if="currentTab === 1" class="my-clubs-list">
					<view class="club-card" v-for="club in myClubs" :key="club.id">
						<image class="club-logo" :src="club.logo" mode="aspectFill"></image>
						<view class="club-info">
							<text class="club-name">{{ club.name }}</text>
							<text class="club-desc">{{ club.description }}</text>
						</view>
						<button class="enter-club-btn" @tap="enterClub(club)">进入社团</button>
					</view>
					<view v-if="myClubs.length === 0" class="empty-placeholder">
						<text>您还没有加入任何社团</text>
						<button class="primary-btn">发现更多社团</button>
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
			currentTab: 0,
			hotActivities: [
				{
					id: 1,
					title: '「迎新晚会」歌手&舞者招募',
					club: '校学生会文艺部',
					time: '2023-09-15 截止',
					banner: '/static/images/activity-banner-1.jpg'
				},
				{
					id: 2,
					title: 'AI技术创新与应用系列讲座',
					club: '计算机爱好者协会',
					time: '2023-09-20 19:00',
					banner: '/static/images/activity-banner-2.jpg'
				},
				{
					id: 3,
					title: '每周五晚「狼人杀」主题桌游夜',
					club: '推理社',
					time: '每周五 18:30',
					banner: '/static/images/activity-banner-3.jpg'
				}
			],
			myClubs: [
				{
					id: 1,
					name: '计算机爱好者协会',
					description: '探索前沿技术，分享编程乐趣。',
					logo: '/static/images/club-logo-cs.png'
				},
				{
					id: 2,
					name: '校报记者团',
					description: '记录校园动态，发出青年声音。',
					logo: '/static/images/club-logo-reporter.png'
				}
			]
		}
	},
	methods: {
		onTabClick(e) {
			if (this.currentTab !== e.currentIndex) {
				this.currentTab = e.currentIndex;
			}
		},
		signUp(activity) {
			uni.showToast({
				title: `已报名：${activity.title}`,
				icon: 'none'
			});
		},
		enterClub(club) {
			uni.showToast({
				title: `进入 ${club.name}`,
				icon: 'none'
			});
		}
	}
}
</script>

<style>
.container {
	background-color: #f5f5f5;
	min-height: 100vh;
}

.header {
	background: linear-gradient(to bottom, #007aff, #0056b3);
	color: white;
	padding: 40rpx;
	padding-top: 80rpx; /* for status bar */
	text-align: center;
}

.title {
	font-size: 44rpx;
	font-weight: bold;
}

.subtitle {
	font-size: 26rpx;
	margin-top: 10rpx;
	display: block;
	opacity: 0.9;
}

.content {
	padding: 20rpx;
}

.tab-content {
	padding-top: 30rpx;
}

.activity-list, .my-clubs-list {
	display: flex;
	flex-direction: column;
	gap: 30rpx;
}

.activity-card {
	background-color: #fff;
	border-radius: 20rpx;
	overflow: hidden;
	box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.05);
}

.activity-banner {
	width: 100%;
	height: 300rpx;
}

.activity-info {
	padding: 20rpx 30rpx;
}

.activity-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	display: block;
	margin-bottom: 10rpx;
}

.activity-meta {
	display: flex;
	align-items: center;
	font-size: 24rpx;
	color: #999;
}

.meta-item {
	margin-right: 20rpx;
}

.signup-btn {
	background-color: #007aff;
	color: white;
	margin: 0 30rpx 30rpx;
	border-radius: 40rpx;
}

.club-card {
	display: flex;
	align-items: center;
	background-color: #fff;
	padding: 30rpx;
	border-radius: 20rpx;
}

.club-logo {
	width: 100rpx;
	height: 100rpx;
	border-radius: 50rpx;
	margin-right: 30rpx;
}

.club-info {
	flex: 1;
}

.club-name {
	font-size: 30rpx;
	font-weight: bold;
	color: #333;
}

.club-desc {
	font-size: 24rpx;
	color: #999;
	margin-top: 8rpx;
}

.enter-club-btn {
	background-color: #fff;
	color: #007aff;
	border: 1rpx solid #007aff;
	font-size: 26rpx;
	border-radius: 30rpx;
	padding: 10rpx 24rpx;
	line-height: 1;
	margin: 0;
}

.empty-placeholder {
	text-align: center;
	padding-top: 100rpx;
	color: #999;
}

.primary-btn {
	background-color: #007AFF;
	color: white;
	margin-top: 40rpx;
	font-size: 30rpx;
	border-radius: 50rpx;
}
</style> 
<template>
	<view class="dining-recommendation-page">
		<!-- 页面标题 -->
		<view class="page-header">
			<text class="page-title">🍽️ 智能就餐推荐</text>
			<text class="page-subtitle">基于您的偏好，为您推荐最佳就餐方案</text>
		</view>
		
		<!-- 加载状态 -->
		<view v-if="loading" class="loading-container">
			<uni-load-more status="loading"></uni-load-more>
		</view>
		
		<!-- 用户偏好分析卡片 -->
		<view v-if="!loading && userPreference.hasData" class="preference-analysis-card">
			<view class="analysis-header" @tap="togglePreferenceDetails">
				<view class="header-left">
					<image src="/static/images/ai-analysis.png" mode="aspectFit" class="analysis-icon"></image>
					<text class="analysis-title">AI 偏好分析</text>
				</view>
				<view class="toggle-btn" @tap.stop="togglePreferenceDetails">
					<text class="toggle-text">{{ showPreferenceDetails ? '收起' : '展开' }}</text>
					<text class="toggle-arrow">{{ showPreferenceDetails ? '▲' : '▼' }}</text>
				</view>
			</view>
			
			<view class="analysis-content" :class="{ 'collapsed': !showPreferenceDetails }">
				<!-- 分析状态 -->
				<view class="analysis-status">
					<view class="status-icon">✅</view>
					<text class="status-text">基于历史订单数据分析完成</text>
				</view>
				
				<!-- 数据概览 -->
				<view class="data-overview">
					<text class="overview-text">
						正在从数据库检索用户的历史订单数据，共有{{ userPreference.analyzedOrderCount }}条订单记录，其中包含{{ userPreference.analyzedItemCount }}个菜品项...
					</text>
				</view>
				
				<!-- 菜系偏好分析 -->
				<view class="analysis-section">
					<view class="section-header">
						<view class="section-icon">🍽️</view>
						<text class="section-title">菜系偏好分析</text>
					</view>
					<view class="preference-tags">
						<view v-for="(data, category) in topCategories" :key="category" class="preference-tag">
							{{ category }} {{ data.percentage }}%
						</view>
					</view>
				</view>
				
				<!-- 口味偏好分析 -->
				<view v-if="Object.keys(topTastes).length > 0" class="analysis-section">
					<view class="section-header">
						<view class="section-icon">🌶️</view>
						<text class="section-title">口味偏好分析</text>
					</view>
					
					<!-- 近日口味偏好 -->
					<view class="taste-analysis-subsection">
						<text class="subsection-title">近7日口味偏好</text>
						<view class="taste-trend-container">
							<view v-for="(data, taste) in recentTastePreferences" :key="taste" class="taste-trend-item">
								<view class="taste-info">
									<text class="taste-name">{{ taste }}</text>
									<text class="taste-percentage">{{ data.percentage }}%</text>
								</view>
								<view class="taste-progress">
									<view class="taste-progress-bar" :style="{ width: data.percentage + '%' }"></view>
								</view>
								<view class="taste-trend">
									<text class="trend-icon" :class="data.trend">{{ getTrendIcon(data.trend) }}</text>
									<text class="trend-text">{{ data.trendText }}</text>
								</view>
							</view>
						</view>
					</view>
					
					<!-- 整体口味分析对比 -->
					<view class="taste-comparison-subsection">
						<text class="subsection-title">整体口味分析对比</text>
						<view class="comparison-container">
							<view class="comparison-legends">
								<view class="legend-item">
									<view class="legend-color recent"></view>
									<text class="legend-text">近期偏好</text>
								</view>
								<view class="legend-item">
									<view class="legend-color overall"></view>
									<text class="legend-text">历史平均</text>
								</view>
							</view>
							<view class="taste-comparison-chart">
								<view v-for="(data, taste) in tasteComparison" :key="taste" class="comparison-item">
									<text class="comparison-taste-name">{{ taste }}</text>
									<view class="comparison-bars">
										<view class="comparison-bar recent" :style="{ width: data.recent + '%' }">
											<text class="bar-label">{{ data.recent }}%</text>
										</view>
										<view class="comparison-bar overall" :style="{ width: data.overall + '%' }">
											<text class="bar-label">{{ data.overall }}%</text>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
					
					<!-- 口味标签云 -->
					<view class="taste-tags">
						<view v-for="(count, taste) in topTastes" :key="taste" class="taste-tag" :class="[
							taste.includes('辣') ? 'spicy' : 
							['甜味', '酸甜', '香甜'].includes(taste) ? 'sweet' :
							['清淡', '原味', '清香'].includes(taste) ? 'light' : 'default'
						]">
							{{ taste }}
						</view>
					</view>
				</view>
				
				<!-- 分析统计 -->
				<view class="stats-section">
					<view class="section-header">
						<view class="section-icon">📊</view>
						<text class="section-title">分析统计</text>
					</view>
					<view class="stats-cards">
						<view class="stat-card">
							<text class="stat-number">{{ userPreference.analyzedOrderCount }}</text>
							<text class="stat-label">条历史订单</text>
						</view>
						<view class="stat-card">
							<text class="stat-number">{{ Object.keys(topCategories).length }}</text>
							<text class="stat-label">个偏好菜系</text>
						</view>
						<view class="stat-card">
							<text class="stat-number">{{ Object.keys(topTastes).length }}</text>
							<text class="stat-label">个味型特征</text>
						</view>
					</view>
				</view>
				
				<!-- 智能洞察 -->
				<view class="insight-section">
					<view class="insight-header">
						<view class="insight-icon">💡</view>
						<text class="insight-title">智能洞察</text>
					</view>
					<view class="insight-content">
						<text class="insight-text">
							基于您的订单偏好分析，AI发现：您偏好{{ Object.keys(topCategories)[0] || '中式' }}菜系，建议在{{ Object.keys(userPreference.preferences.mealTimes || {})[0] || '午餐' }}时段前往相应食堂用餐。
						</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 推荐方案列表 -->
		<view class="recommendations-container">
			<view v-for="(rec, index) in recommendations" :key="index" class="recommendation-card">
				<!-- 推荐等级标识 -->
				<view class="rank-badge" :class="'rank-' + rec.rank">
					<text v-if="rec.rank === 1">🏆 最佳推荐</text>
					<text v-else>推荐方案 {{ rec.rank }}</text>
				</view>
				
				<!-- 食堂和窗口信息 -->
				<view class="location-info">
					<text class="canteen-name">{{ rec.canteen }}</text>
					<text class="window-info">{{ rec.window }} · {{ rec.windowType }}</text>
				</view>
				
				<!-- 等待时间信息 -->
				<view class="wait-time-info">
					<view class="time-item current">
						<text class="time-label">当前等待</text>
						<text class="time-value" :class="rec.currentWaitTime === 0 ? 'excellent' : rec.currentWaitTime <= 2 ? 'good' : rec.currentWaitTime <= 5 ? 'medium' : 'busy'">
							{{ rec.currentWaitTime }} 分钟
						</text>
					</view>
					<view class="time-arrow">→</view>
					<view class="time-item predicted">
						<text class="time-label">{{ rec.recommendedTime }} 预计等待</text>
						<text class="time-value" :class="rec.predictedWaitTime === 0 ? 'excellent' : rec.predictedWaitTime <= 2 ? 'good' : rec.predictedWaitTime <= 5 ? 'medium' : 'busy'">
							{{ rec.predictedWaitTime }} 分钟
						</text>
					</view>
				</view>
				
				<!-- 推荐理由 -->
				<view class="match-reason">
					<text class="reason-icon">💡</text>
					<text class="reason-text">{{ rec.matchReason }}</text>
				</view>
				
				<!-- 标签 -->
				<view class="tags-container">
					<view v-for="(tag, tagIndex) in rec.tags" :key="tagIndex" class="tag">
						{{ tag }}
					</view>
				</view>
				
				<!-- 操作按钮 -->
				<view class="action-buttons">
					<button class="action-btn secondary" @tap="viewMenu(rec)">
						📱 查看菜单
					</button>
					<button class="action-btn primary" @tap="navigate(rec)">
						🗺️ 前往食堂
					</button>
				</view>
			</view>
		</view>
		
		<!-- 无数据提示 -->
		<view v-if="!loading && !userPreference.hasData" class="no-data-container">
			<image src="/static/images/empty-dining.png" mode="aspectFit" class="empty-image"></image>
			<text class="no-data-text">暂无就餐记录</text>
			<text class="no-data-hint">快去点餐，系统将为您分析偏好</text>
			<button class="goto-order-btn" @tap="gotoOrder">去点餐</button>
		</view>
		
		<!-- 查看人流热力图 -->
		<view class="view-heatmap-btn" @tap="viewHeatmap">
			<text>📊 查看实时热力图</text>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			loading: true,
			userPreference: {
				hasData: false,
				recentTasteAnalysis: {},
				tasteComparison: {},
				preferences: {
					categories: {},
					tastes: {}
				}
			},
			recommendations: [],
			token: '',
			showPreferenceDetails: false // 偏好详情展开状态
		};
	},
	
	computed: {
		// 获取Top 3菜系偏好
		topCategories() {
			if (!this.userPreference.hasData || !this.userPreference.preferences.categories) {
				return {};
			}
			const categories = this.userPreference.preferences.categories;
			return Object.keys(categories)
				.slice(0, 3)
				.reduce((obj, key) => {
					obj[key] = categories[key];
					return obj;
				}, {});
		},
		
		// 获取Top 5口味标签
		topTastes() {
			if (!this.userPreference.hasData || !this.userPreference.preferences.tastes) {
				return {};
			}
			const tastes = this.userPreference.preferences.tastes;
			return Object.keys(tastes)
				.slice(0, 5)
				.reduce((obj, key) => {
					obj[key] = tastes[key];
					return obj;
				}, {});
		},
		
		// 近期口味偏好趋势
		recentTastePreferences() {
			if (!this.userPreference || !this.userPreference.hasData || !this.userPreference.recentTasteAnalysis) {
				return {};
			}
			return this.userPreference.recentTasteAnalysis;
		},
		
		// 口味对比分析
		tasteComparison() {
			if (!this.userPreference || !this.userPreference.hasData || !this.userPreference.tasteComparison) {
				return {};
			}
			return this.userPreference.tasteComparison;
		}
	},
	
	onLoad() {
		this.token = uni.getStorageSync('token') || '';
		this.loadRecommendations();
	},
	
	methods: {
		async loadRecommendations() {
			this.loading = true;
			try {
				const res = await uni.request({
					url: 'http://localhost:3000/api/dining-analysis/recommendation',
					method: 'GET',
					header: {
						'Authorization': `Bearer ${this.token}`
					}
				});
				
				console.log('🔍 API完整响应:', res);
				console.log('🔍 响应状态码:', res.statusCode);
				console.log('🔍 响应数据:', res.data);
				
				if (res.statusCode === 200 && res.data && res.data.success === true) {
					console.log('✅ API调用成功');
					console.log('📊 用户偏好数据:', res.data.data.userPreference);
					console.log('📋 推荐数据:', res.data.data.recommendations);
					
					// 使用对象展开确保响应式更新
					this.userPreference = {
						...this.userPreference,
						...res.data.data.userPreference
					};
					this.recommendations = res.data.data.recommendations;
					
				} else {
					console.log('❌ API调用失败:', res.data);
					uni.showToast({
						title: res.data.message || '获取推荐失败',
						icon: 'none'
					});
				}
			} catch (error) {
				console.error('❌ 网络请求异常:', error);
				uni.showToast({
					title: '网络请求失败',
					icon: 'none'
				});
			} finally {
				this.loading = false;
			}
		},
		
		viewMenu(rec) {
			// 跳转到食堂点餐页面，并传递推荐信息
			const params = {
				canteen: rec.canteen,
				window: rec.window,
				windowType: rec.windowType,
				from: 'recommendation'
			};
			
			console.log('跳转前的原始参数:', params);
			
			const queryString = Object.keys(params)
				.map(key => `${key}=${encodeURIComponent(params[key])}`)
				.join('&');
			
			console.log('编码后的查询字符串:', queryString);
			
			const finalUrl = `/pages/features/food?${queryString}`;
			console.log('最终跳转URL:', finalUrl);
				
			uni.navigateTo({
				url: finalUrl
			});
		},
		
		navigate(rec) {
			// 跳转到食堂点餐页面，和查看菜单功能一样
			this.viewMenu(rec);
		},
		
		
		gotoOrder() {
			// 跳转到食堂点餐页面
			uni.navigateTo({
				url: '/pages/features/food'
			});
		},
		
		viewHeatmap() {
			uni.navigateTo({
				url: '/pages/features/canteen-traffic'
			});
		},
		
		// 展开/收起偏好详情
		togglePreferenceDetails() {
			this.showPreferenceDetails = !this.showPreferenceDetails;
		},
		
		// 获取趋势图标
		getTrendIcon(trend) {
			const icons = {
				'up': '📈',
				'down': '📉', 
				'stable': '📊'
			};
			return icons[trend] || '📊';
		}
	}
};
</script>

<style scoped>
.dining-recommendation-page {
	min-height: 100vh;
	background: linear-gradient(to bottom, #f8f9fa 0%, #ffffff 200rpx);
	padding: 20rpx;
}

.page-header {
	text-align: center;
	padding: 40rpx 20rpx 30rpx;
}

.page-title {
	display: block;
	font-size: 44rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 10rpx;
}

.page-subtitle {
	display: block;
	font-size: 26rpx;
	color: #999;
}

.loading-container {
	padding: 100rpx 0;
	text-align: center;
}

/* AI 偏好分析卡片 */
.preference-analysis-card {
	background-color: #ffffff;
	border-radius: 20rpx;
	margin: 20rpx 0 30rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
	overflow: hidden;
}

.analysis-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 25rpx 30rpx;
	background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
	border-bottom: 2rpx solid #e8f0fe;
}

.header-left {
	display: flex;
	align-items: center;
}

.analysis-icon {
	width: 40rpx;
	height: 40rpx;
	margin-right: 15rpx;
}

.analysis-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #1a73e8;
}

.toggle-btn {
	display: flex;
	align-items: center;
	background-color: #f5f5f5;
	border-radius: 20rpx;
	padding: 8rpx 16rpx;
	border: 2rpx solid #e0e0e0;
	transition: all 0.3s ease;
}

.toggle-btn:hover {
	background-color: #e8f4fd;
	border-color: #1a73e8;
}

.toggle-text {
	font-size: 24rpx;
	color: #666;
	margin-right: 8rpx;
}

.toggle-arrow {
	font-size: 20rpx;
	color: #999;
}

.analysis-content {
	padding: 0 30rpx;
	max-height: 2000rpx;
	overflow: hidden;
	transition: all 0.3s ease;
}

.analysis-content.collapsed {
	max-height: 0;
	padding: 0 30rpx;
}

.analysis-status {
	display: flex;
	align-items: center;
	padding: 25rpx 0;
	border-bottom: 2rpx solid #f0f0f0;
}

.status-icon {
	margin-right: 15rpx;
	font-size: 32rpx;
}

.status-text {
	font-size: 28rpx;
	color: #4caf50;
	font-weight: 500;
}

.data-overview {
	padding: 20rpx 0;
	border-bottom: 2rpx solid #f0f0f0;
}

.overview-text {
	font-size: 26rpx;
	color: #666;
	line-height: 1.6;
}

.analysis-section, .stats-section, .insight-section {
	padding: 25rpx 0;
	border-bottom: 2rpx solid #f0f0f0;
}

.section-header, .insight-header {
	display: flex;
	align-items: center;
	margin-bottom: 20rpx;
}

.section-icon, .insight-icon {
	margin-right: 10rpx;
	font-size: 28rpx;
}

.section-title, .insight-title {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
}

.preference-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 15rpx;
}

.preference-tag {
	background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
	color: #1976d2;
	padding: 12rpx 24rpx;
	border-radius: 30rpx;
	font-size: 24rpx;
	font-weight: 500;
	border: 2rpx solid #e3f2fd;
}

.taste-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 12rpx;
}

.taste-tag {
	background-color: #fff3e0;
	color: #f57c00;
	padding: 8rpx 16rpx;
	border-radius: 20rpx;
	font-size: 22rpx;
	border: 2rpx solid #ffcc02;
}

.stats-cards {
	display: flex;
	gap: 20rpx;
}

.stat-card {
	flex: 1;
	background: linear-gradient(135deg, #f1f8e9 0%, #dcedc8 100%);
	border-radius: 15rpx;
	padding: 20rpx;
	text-align: center;
	border: 2rpx solid #aed581;
}

.stat-number {
	display: block;
	font-size: 36rpx;
	font-weight: bold;
	color: #689f38;
	margin-bottom: 8rpx;
}

.stat-label {
	font-size: 22rpx;
	color: #689f38;
}

.insight-content {
	background-color: #fffbf2;
	border-radius: 15rpx;
	padding: 20rpx;
	border-left: 8rpx solid #ff9800;
}

.insight-text {
	font-size: 26rpx;
	color: #e65100;
	line-height: 1.6;
}

/* 推荐卡片 */
.recommendations-container {
	margin-top: 20rpx;
}

.recommendation-card {
	background-color: #ffffff;
	border-radius: 20rpx;
	padding: 30rpx;
	margin-bottom: 25rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
	position: relative;
}

.rank-badge {
	position: absolute;
	top: 0;
	right: 30rpx;
	padding: 10rpx 20rpx;
	border-radius: 0 0 15rpx 15rpx;
	font-size: 24rpx;
	font-weight: bold;
	color: #ffffff;
}

.rank-badge.rank-1 {
	background: linear-gradient(135deg, #FFD700, #FFA500);
}

.rank-badge.rank-2 {
	background: linear-gradient(135deg, #C0C0C0, #808080);
}

.rank-badge.rank-3 {
	background: linear-gradient(135deg, #CD7F32, #8B4513);
}

.location-info {
	margin-top: 15rpx;
	margin-bottom: 20rpx;
}

.canteen-name {
	display: block;
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 10rpx;
}

.window-info {
	display: block;
	font-size: 28rpx;
	color: #666;
}

/* 等待时间 */
.wait-time-info {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin: 20rpx 0;
	padding: 20rpx;
	background-color: #f8f9fa;
	border-radius: 15rpx;
}

.time-item {
	flex: 1;
	text-align: center;
}

.time-label {
	display: block;
	font-size: 22rpx;
	color: #999;
	margin-bottom: 10rpx;
}

.time-value {
	display: block;
	font-size: 32rpx;
	font-weight: bold;
}

.time-value.excellent {
	color: #4cd964;
}

.time-value.good {
	color: #5ac8fa;
}

.time-value.medium {
	color: #ff9500;
}

.time-value.busy {
	color: #ff3b30;
}

.time-arrow {
	font-size: 32rpx;
	color: #ccc;
	padding: 0 20rpx;
}

/* 推荐理由 */
.match-reason {
	display: flex;
	align-items: flex-start;
	padding: 20rpx;
	background-color: #fff8dc;
	border-radius: 15rpx;
	margin: 20rpx 0;
}

.reason-icon {
	font-size: 28rpx;
	margin-right: 10rpx;
}

.reason-text {
	flex: 1;
	font-size: 26rpx;
	color: #666;
	line-height: 1.6;
}

/* 标签 */
.tags-container {
	display: flex;
	flex-wrap: wrap;
	gap: 15rpx;
	margin: 20rpx 0;
}

.tag {
	padding: 8rpx 16rpx;
	background-color: #f0f0f0;
	border-radius: 20rpx;
	font-size: 22rpx;
	color: #666;
}

/* 操作按钮 */
.action-buttons {
	display: flex;
	gap: 20rpx;
	margin-top: 25rpx;
}

.action-btn {
	flex: 1;
	height: 80rpx;
	line-height: 80rpx;
	border-radius: 40rpx;
	font-size: 28rpx;
	border: none;
}

.action-btn.primary {
	background: linear-gradient(135deg, #11C67A 0%, #4ECDC4 100%);
	color: #ffffff;
}

.action-btn.secondary {
	background-color: #f8f9fa;
	color: #667eea;
	border: 2rpx solid #667eea;
}

/* 无数据状态 */
.no-data-container {
	text-align: center;
	padding: 100rpx 40rpx;
}

.empty-image {
	width: 300rpx;
	height: 300rpx;
	margin-bottom: 40rpx;
}

.no-data-text {
	display: block;
	font-size: 32rpx;
	color: #333;
	margin-bottom: 15rpx;
}

.no-data-hint {
	display: block;
	font-size: 26rpx;
	color: #999;
	margin-bottom: 40rpx;
}

.goto-order-btn {
	width: 300rpx;
	height: 80rpx;
	line-height: 80rpx;
	background: linear-gradient(135deg, #11C67A 0%, #4ECDC4 100%);
	color: #ffffff;
	border-radius: 40rpx;
	font-size: 28rpx;
	border: none;
	margin: 0 auto;
}

/* 底部按钮 */
.view-heatmap-btn {
	position: fixed;
	bottom: 40rpx;
	left: 50%;
	transform: translateX(-50%);
	background-color: #ffffff;
	padding: 20rpx 40rpx;
	border-radius: 50rpx;
	box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.15);
	font-size: 28rpx;
	color: #667eea;
	font-weight: bold;
}

/* 口味分析新增样式 */
.taste-analysis-subsection, .taste-comparison-subsection {
	margin-top: 20rpx;
	padding: 20rpx;
	background-color: #f8fffe;
	border-radius: 12rpx;
	border-left: 4rpx solid #26a69a;
}

.subsection-title {
	display: block;
	font-size: 26rpx;
	font-weight: bold;
	color: #26a69a;
	margin-bottom: 15rpx;
}

/* 近期口味趋势 */
.taste-trend-container {
	margin-top: 10rpx;
}

.taste-trend-item {
	display: flex;
	align-items: center;
	margin-bottom: 15rpx;
	padding: 12rpx;
	background-color: #ffffff;
	border-radius: 8rpx;
	box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
}

.taste-info {
	min-width: 120rpx;
	margin-right: 15rpx;
}

.taste-name {
	display: block;
	font-size: 24rpx;
	font-weight: bold;
	color: #333333;
}

.taste-percentage {
	display: block;
	font-size: 20rpx;
	color: #26a69a;
	margin-top: 2rpx;
}

.taste-progress {
	flex: 1;
	height: 6rpx;
	background-color: #e0f2f1;
	border-radius: 3rpx;
	margin: 0 15rpx;
	position: relative;
}

.taste-progress-bar {
	height: 100%;
	background: linear-gradient(90deg, #26a69a 0%, #4db6ac 100%);
	border-radius: 3rpx;
	transition: width 0.6s ease;
}

.taste-trend {
	display: flex;
	align-items: center;
	min-width: 80rpx;
}

.trend-icon {
	font-size: 20rpx;
	margin-right: 5rpx;
}

.trend-icon.up {
	color: #4caf50;
}

.trend-icon.down {
	color: #f44336;
}

.trend-icon.stable {
	color: #ff9800;
}

.trend-text {
	font-size: 18rpx;
	color: #666666;
}

/* 口味对比分析 */
.comparison-container {
	margin-top: 10rpx;
}

.comparison-legends {
	display: flex;
	gap: 20rpx;
	margin-bottom: 15rpx;
}

.legend-item {
	display: flex;
	align-items: center;
}

.legend-color {
	width: 12rpx;
	height: 12rpx;
	border-radius: 2rpx;
	margin-right: 8rpx;
}

.legend-color.recent {
	background-color: #26a69a;
}

.legend-color.overall {
	background-color: #b0bec5;
}

.legend-text {
	font-size: 20rpx;
	color: #666666;
}

.taste-comparison-chart {
	margin-top: 15rpx;
}

.comparison-item {
	margin-bottom: 20rpx;
}

.comparison-taste-name {
	display: block;
	font-size: 22rpx;
	font-weight: bold;
	color: #333333;
	margin-bottom: 8rpx;
}

.comparison-bars {
	position: relative;
}

.comparison-bar {
	height: 20rpx;
	border-radius: 10rpx;
	margin-bottom: 4rpx;
	position: relative;
	transition: width 0.8s ease;
}

.comparison-bar.recent {
	background: linear-gradient(90deg, #26a69a 0%, #4db6ac 100%);
}

.comparison-bar.overall {
	background: linear-gradient(90deg, #b0bec5 0%, #90a4ae 100%);
}

.bar-label {
	position: absolute;
	right: 8rpx;
	top: 50%;
	transform: translateY(-50%);
	font-size: 16rpx;
	color: #ffffff;
	font-weight: bold;
}

/* 口味标签云增强 */
.taste-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 10rpx;
	margin-top: 15rpx;
}

.taste-tag {
	padding: 8rpx 16rpx;
	border-radius: 20rpx;
	font-size: 22rpx;
	font-weight: bold;
	transition: all 0.3s ease;
}

.taste-tag.default {
	background-color: #e8f5e8;
	color: #4caf50;
	border: 1rpx solid #a5d6a7;
}

.taste-tag.spicy {
	background-color: #ffebee;
	color: #f44336;
	border: 1rpx solid #ef9a9a;
}

.taste-tag.sweet {
	background-color: #fff3e0;
	color: #ff9800;
	border: 1rpx solid #ffcc02;
}

.taste-tag.light {
	background-color: #e3f2fd;
	color: #2196f3;
	border: 1rpx solid #90caf9;
}
</style>

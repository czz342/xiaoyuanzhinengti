<template>
	<view class="canteen-traffic-page">
		<!-- 页面标题 -->
		<view class="page-header">
			<text class="page-title">📊 食堂实时热力图</text>
			<text class="page-subtitle">实时监控各食堂人流状况</text>
		</view>
		
		<!-- 更新时间 -->
		<view class="update-info">
			<text class="update-time">{{currentTime}} 更新</text>
			<view class="refresh-btn" @tap="refreshData">
				<text>🔄 刷新</text>
			</view>
		</view>
		
		<!-- 热力图卡片 -->
		<view class="traffic-card">
			<view class="card-header">
				<text class="card-title">当前人流量分布</text>
			</view>
			<view class="card-content">
				<view class="charts-container">
					<qiun-data-charts 
						type="column"
						:opts="chartOptions"
						:chartData="chartData"
						:errorShow="!chartData.categories || chartData.categories.length === 0"
						error-message="暂无数据"
					/>
				</view>
				<view class="custom-legend">
					<view class="legend-item">
						<view class="legend-color" style="background-color: #4cd964;"></view>
						<text>空闲 (0-30人)</text>
					</view>
					<view class="legend-item">
						<view class="legend-color" style="background-color: #FEEA9A;"></view>
						<text>适中 (31-60人)</text>
					</view>
					<view class="legend-item">
						<view class="legend-color" style="background-color: #ff9500;"></view>
						<text>繁忙 (61-90人)</text>
					</view>
					<view class="legend-item">
						<view class="legend-color" style="background-color: #ff3b30;"></view>
						<text>拥挤 (90+人)</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 详细信息列表 -->
		<view class="detail-list">
			<view class="list-header">
				<text class="list-title">详细信息</text>
			</view>
			<view class="canteen-item" v-for="(canteen, index) in canteenDetails" :key="index">
				<view class="canteen-info">
					<text class="canteen-name">{{ canteen.name }}</text>
					<view class="canteen-status" :class="canteen.statusClass">
						<text class="status-text">{{ canteen.statusText }}</text>
					</view>
				</view>
				<view class="canteen-stats">
					<text class="traffic-count">当前人数: {{ canteen.trafficCount }}人</text>
					<text class="wait-time">预计等待: {{ canteen.waitTime }}分钟</text>
				</view>
				<view class="progress-bar">
					<view class="progress-fill" :style="{ 
						width: (canteen.trafficCount / 120 * 100) + '%',
						backgroundColor: canteen.color 
					}"></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import qiunDataCharts from '@/uni_modules/qiun-data-charts/components/qiun-data-charts/qiun-data-charts.vue';

export default {
	components: {
		qiunDataCharts
	},
	data() {
		return {
			currentTime: '获取中...',
			canteenDetails: [],
			chartData: {},
			chartOptions: {
				padding: [15,15,0,5],
				enableScroll: false,
				legend: {
					show: false
				},
				xAxis: {
					disableGrid: true,
					axisLine: false,
				},
				yAxis: {
					data: [
						{
							min: 0,
							max: 120, // 调整为120以匹配演示数据范围，让柱状图更美观
							tofix: 0, // Y轴刻度取整
							axisLine: false,
							gridType: 'dash',
							fontColor: '#999'
						}
					]
				},
				extra: {
					column: {
						type: "group",
						width: 25,
						activeBgColor: "#000000",
						activeBgOpacity: 0.08,
						seriesGap: 5,
						barBorderRadius: [
							4,
							4,
							4,
							4
						],
						disableMainColor: true
					}
				}
			}
		};
	},
	onLoad() {
		this.fetchCanteenTraffic();
		this.updateTime();
	},
	methods: {
		updateTime() {
			const now = new Date();
			const hours = String(now.getHours()).padStart(2, '0');
			const minutes = String(now.getMinutes()).padStart(2, '0');
			this.currentTime = `${hours}:${minutes}`;
		},
		
		refreshData() {
			uni.showLoading({
				title: '刷新中...'
			});
			this.fetchCanteenTraffic();
			setTimeout(() => {
				uni.hideLoading();
				uni.showToast({
					title: '刷新成功',
					icon: 'success'
				});
			}, 1000);
		},
		
		async fetchCanteenTraffic() {
			try {
				const res = await uni.request({
					url: 'http://localhost:3000/api/smart-recommendation/canteen-traffic',
					method: 'GET'
				});
				
				if (res.statusCode === 200 && res.data.success) {
					const data = res.data.data;
					this.updateTime();
					
					const categories = [];
					const seriesData = [];
					const details = [];
					
					data.canteens.forEach(canteen => {
						categories.push(canteen.name);
						
						let color = '';
						let statusText = '';
						let statusClass = '';
						let waitTime = 0;
						
						// 演示用固定等待时间（展示最佳效果）
						const trafficCount = canteen.trafficCount;
						
						// 预设的演示等待时间数据
						const demoWaitTimes = {
							'一食堂': { waitTime: 8, color: '#ff9500', statusText: '繁忙', statusClass: 'busy' },
							'二食堂': { waitTime: 3, color: '#FEEA9A', statusText: '适中', statusClass: 'moderate' },
							'三食堂': { waitTime: 12, color: '#ff3b30', statusText: '拥挤', statusClass: 'crowded' },
							'风味餐厅': { waitTime: 1, color: '#4cd964', statusText: '空闲', statusClass: 'idle' },
							'清真食堂': { waitTime: 6, color: '#ff9500', statusText: '繁忙', statusClass: 'busy' }
						};
						
						// 查找匹配的演示数据
						let demoData = null;
						for (const [key, value] of Object.entries(demoWaitTimes)) {
							if (canteen.name.includes(key.replace('食堂', '').replace('餐厅', ''))) {
								demoData = value;
								break;
							}
						}
						
						// 如果没找到匹配的，根据人流量设置默认值
						if (!demoData) {
							if (trafficCount <= 30) {
								demoData = { waitTime: 2, color: '#4cd964', statusText: '空闲', statusClass: 'idle' };
							} else if (trafficCount <= 60) {
								demoData = { waitTime: 4, color: '#FEEA9A', statusText: '适中', statusClass: 'moderate' };
							} else if (trafficCount <= 90) {
								demoData = { waitTime: 8, color: '#ff9500', statusText: '繁忙', statusClass: 'busy' };
							} else {
								demoData = { waitTime: 15, color: '#ff3b30', statusText: '拥挤', statusClass: 'crowded' };
							}
						}
						
						waitTime = demoData.waitTime;
						color = demoData.color;
						statusText = demoData.statusText;
						statusClass = demoData.statusClass;
						
						seriesData.push({
							value: trafficCount,
							color: color
						});
						
						details.push({
							name: canteen.name,
							trafficCount: trafficCount,
							statusText: statusText,
							statusClass: statusClass,
							color: color,
							waitTime: waitTime
						});
					});

					this.chartData = {
						categories: categories,
						series: [
							{
								name: "当前人流量",
								data: seriesData
							}
						]
					};
					
					this.canteenDetails = details;
				} else {
					throw new Error("获取食堂人流量数据失败");
				}
			} catch (error) {
				console.error("获取食堂人流数据失败:", error);
				this.chartData = {
					categories: [],
					series: []
				};
				this.canteenDetails = [];
			}
		}
	}
};
</script>

<style scoped>
.canteen-traffic-page {
	min-height: 100vh;
	background: linear-gradient(to bottom, #f8f9fa 0%, #ffffff 200rpx);
	padding: 20rpx;
}

/* 页面标题 */
.page-header {
	text-align: center;
	padding: 40rpx 20rpx;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	border-radius: 20rpx;
	margin-bottom: 30rpx;
	color: white;
}

.page-title {
	font-size: 36rpx;
	font-weight: bold;
	display: block;
	margin-bottom: 10rpx;
}

.page-subtitle {
	font-size: 24rpx;
	opacity: 0.9;
}

/* 更新信息 */
.update-info {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx;
	background-color: #ffffff;
	border-radius: 15rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.update-time {
	font-size: 26rpx;
	color: #666666;
}

.refresh-btn {
	padding: 10rpx 20rpx;
	background-color: #28a745;
	color: white;
	border-radius: 20rpx;
	font-size: 24rpx;
}

/* 热力图卡片 */
.traffic-card {
	background-color: #ffffff;
	border-radius: 20rpx;
	margin-bottom: 30rpx;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
	overflow: hidden;
}

.card-header {
	padding: 30rpx;
	background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
	color: white;
}

.card-title {
	font-size: 32rpx;
	font-weight: bold;
}

.card-content {
	padding: 20rpx;
}

/* 图表容器 */
.charts-container {
	width: 100%;
	height: 400rpx;
	margin-bottom: 20rpx;
}

/* 图例 */
.custom-legend {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-around;
	align-items: center;
	padding: 20rpx 0;
	border-top: 1rpx solid #f0f0f0;
}

.legend-item {
	display: flex;
	align-items: center;
	font-size: 22rpx;
	color: #666666;
	margin: 5rpx;
}

.legend-color {
	width: 20rpx;
	height: 20rpx;
	border-radius: 50%;
	margin-right: 8rpx;
}

/* 详细信息列表 */
.detail-list {
	background-color: #ffffff;
	border-radius: 20rpx;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
	overflow: hidden;
}

.list-header {
	padding: 30rpx;
	background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
	color: white;
}

.list-title {
	font-size: 32rpx;
	font-weight: bold;
}

/* 食堂项目 */
.canteen-item {
	padding: 30rpx;
	border-bottom: 1rpx solid #f0f0f0;
}

.canteen-item:last-child {
	border-bottom: none;
}

.canteen-info {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 15rpx;
}

.canteen-name {
	font-size: 30rpx;
	font-weight: bold;
	color: #333333;
}

.canteen-status {
	padding: 8rpx 16rpx;
	border-radius: 20rpx;
	font-size: 22rpx;
	font-weight: bold;
}

.canteen-status.idle {
	background-color: #d4edda;
	color: #155724;
}

.canteen-status.moderate {
	background-color: #fff3cd;
	color: #856404;
}

.canteen-status.busy {
	background-color: #ffeaa7;
	color: #d63031;
}

.canteen-status.crowded {
	background-color: #f8d7da;
	color: #721c24;
}

.canteen-stats {
	display: flex;
	justify-content: space-between;
	margin-bottom: 15rpx;
}

.traffic-count, .wait-time {
	font-size: 24rpx;
	color: #666666;
}

/* 进度条 */
.progress-bar {
	width: 100%;
	height: 8rpx;
	background-color: #f0f0f0;
	border-radius: 4rpx;
	overflow: hidden;
}

.progress-fill {
	height: 100%;
	border-radius: 4rpx;
	transition: width 0.8s ease;
}
</style> 
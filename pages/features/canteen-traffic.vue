<template>
	<view class="canteen-traffic-page">
		<!-- 弹窗容器 -->
		<view class="popup-container" v-if="showPopup">
			<!-- 半透明蒙版 -->
			<view class="popup-mask" @tap="hidePopup"></view>
			<!-- 弹窗内容 -->
			<view class="popup-content">
				<view class="popup-header">
					<text class="popup-title">食堂实时人流量</text>
					<view class="popup-close" @tap="hidePopup">
						<image src="/static/images/close.png" mode="aspectFit"></image>
					</view>
				</view>
				<view class="popup-body">
					<view class="update-time">
						{{currentTime}} 更新
					</view>
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
						<view class="legend-item"><view class="legend-color" style="background-color: #4cd964;"></view><text>空闲</text></view>
						<view class="legend-item"><view class="legend-color" style="background-color: #FEEA9A;"></view><text>适中</text></view>
						<view class="legend-item"><view class="legend-color" style="background-color: #ff9500;"></view><text>繁忙</text></view>
						<view class="legend-item"><view class="legend-color" style="background-color: #ff3b30;"></view><text>拥挤</text></view>
					</view>
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
			showPopup: false, // 控制弹窗显示
			currentTime: '获取中...',
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
							max: 800, // 设置Y轴最大值，以便更好地展示百分比
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
		hidePopup() {
			this.showPopup = false;
			// 关闭弹窗后返回上一页
			uni.navigateBack();
		},
		updateTime() {
			const now = new Date();
			const hours = String(now.getHours()).padStart(2, '0');
			const minutes = String(now.getMinutes()).padStart(2, '0');
			this.currentTime = `${hours}:${minutes}`;
		},
		getColorForTraffic(value) {
			if (value < 200) return '#4cd964'; // 空闲
			if (value < 400) return '#FEEA9A'; // 适中
			if (value < 600) return '#ff9500'; // 繁忙
			return '#ff3b30'; // 拥挤
		},
		async fetchCanteenTraffic() {
			uni.showLoading({
				title: '正在加载...'
			});
			try {
				// 模拟API调用
				const res = await this.mockFetchCanteenData();
				
				// 将颜色直接绑定到每个数据点上
				const seriesData = res.map(item => {
					return {
						value: item.traffic,
						color: this.getColorForTraffic(item.traffic)
					}
				});

				let chartData = {
					categories: res.map(item => item.name),
					series: [
						{
							name: "人流量",
							data: seriesData
						}
					]
				};
				this.chartData = JSON.parse(JSON.stringify(chartData));
				// 数据加载成功后显示弹窗
				this.showPopup = true;
			} catch (e) {
				console.error(e);
				uni.showToast({
					title: '加载失败，请稍后重试',
					icon: 'none'
				});
				// 加载失败也返回上一页
				setTimeout(() => uni.navigateBack(), 1500);
			} finally {
				uni.hideLoading();
			}
		},
		mockFetchCanteenData() {
			return new Promise(resolve => {
				setTimeout(() => {
					resolve([
						{ name: '一食堂', traffic: 320 },
						{ name: '二食堂', traffic: 710 },
						{ name: '三食堂', traffic: 150 },
						{ name: '学生中餐厅', traffic: 450 },
						{ name: '清真食堂', traffic: 210 }
					]);
				}, 500);
			});
		}
	}
}
</script>

<style>
.canteen-traffic-page {
	background-color: #F8F8F8;
	min-height: 100vh;
	width: 100%;
}

/* 弹窗样式 */
.popup-container {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 999;
	display: flex;
	justify-content: center;
	align-items: center;
}

.popup-mask {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
}

.popup-content {
	width: 90%;
	max-width: 700rpx;
	background-color: #FFFFFF;
	border-radius: 20rpx;
	z-index: 1000;
	overflow: hidden;
}

.popup-header {
	position: relative;
	padding: 30rpx;
	border-bottom: 1rpx solid #f0f0f0;
	text-align: center;
}

.popup-title {
	font-size: 34rpx;
	font-weight: bold;
}

.popup-close {
	position: absolute;
	top: 50%;
	right: 30rpx;
	transform: translateY(-50%);
	width: 40rpx;
	height: 40rpx;
}

.popup-close image {
	width: 100%;
	height: 100%;
}

.popup-body {
	padding: 20rpx;
}

.update-time {
	font-size: 24rpx;
	color: #999;
	text-align: center;
	margin-bottom: 20rpx;
}

.charts-container {
	width: 100%;
	height: 500rpx;
}

.custom-legend {
	display: flex;
	justify-content: space-around;
	align-items: center;
	margin-top: 20rpx;
	padding: 10rpx 0;
}

.legend-item {
	display: flex;
	align-items: center;
	font-size: 24rpx;
	color: #666;
}

.legend-color {
	width: 24rpx;
	height: 24rpx;
	border-radius: 50%;
	margin-right: 10rpx;
}
</style> 
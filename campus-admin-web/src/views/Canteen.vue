<template>
  <div class="canteen-page">
    <div class="page-header">
      <h2>食堂管理</h2>
      <div class="header-actions">
        <el-button v-if="isManageMode" type="primary" @click="handleAddCanteen">
          <el-icon><Plus /></el-icon>
          添加食堂
        </el-button>
        <el-button type="success" plain @click="toggleMode">{{ isManageMode ? '返回可视化看板' : '管理详细数据' }}</el-button>
      </div>
    </div>

    <!-- 高级KPI指标卡片 -->
    <div v-if="!isManageMode" class="kpi-section">
      <div class="kpi-card kpi-primary">
        <div class="kpi-value">{{ kpi.totalOrders }}</div>
        <div class="kpi-label">今日订单</div>
        <div class="kpi-trend positive">+12.5%</div>
      </div>
      <div class="kpi-card kpi-success">
        <div class="kpi-value">¥{{ kpi.todayRevenue }}</div>
        <div class="kpi-label">今日营收</div>
        <div class="kpi-trend positive">+8.3%</div>
      </div>
      <div class="kpi-card kpi-warning">
        <div class="kpi-value">{{ kpi.activeCanteens }}</div>
        <div class="kpi-label">营业食堂</div>
        <div class="kpi-trend neutral">持平</div>
      </div>
      <div class="kpi-card kpi-info">
        <div class="kpi-value">{{ kpi.avgWaitTime }}min</div>
        <div class="kpi-label">平均等候时长</div>
        <div class="kpi-trend negative">-2.1%</div>
      </div>
    </div>

    <!-- 食堂列表 -->
    <el-card v-if="isManageMode" class="canteen-list">
      <template #header>
        <span>食堂列表</span>
      </template>
      <el-table :data="canteenList" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="食堂名称" width="150" />
        <el-table-column prop="location" label="位置" width="200" />
        <el-table-column prop="capacity" label="容量" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === 'active' ? '营业中' : '暂停营业' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="handleEditCanteen(row)">编辑</el-button>
            <el-button size="small" type="primary" @click="handleManageFood(row)">菜品管理</el-button>
            <el-button size="small" type="danger" @click="handleDeleteCanteen(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 实时数据可视化 -->
    <el-row v-if="!isManageMode" :gutter="20" class="realtime-section">
      <el-col :span="12">
        <el-card class="glass-card">
          <template #header>
            <div class="card-header">
              <span>实时订单数</span>
              <el-tag type="success">实时</el-tag>
            </div>
          </template>
          <div class="realtime-orders">
            <div
              v-for="order in realtimeOrders"
              :key="order.id"
              class="order-item"
            >
              <span class="order-time">{{ order.time }}</span>
              <span class="order-canteen">{{ order.canteen }}</span>
              <span class="order-count">{{ order.count }}单</span>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-card class="glass-card">
          <template #header>
            <div class="card-header">
              <span>人流热力图</span>
              <el-tag type="info">实时</el-tag>
            </div>
          </template>
          <div class="traffic-heatmap">
            <div
              v-for="area in trafficAreas"
              :key="area.id"
              class="traffic-area"
              :class="getTrafficLevel(area.level)"
            >
              <span class="area-name">{{ area.name }}</span>
              <span class="area-level">{{ area.level }}级</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 数据分析 -->
    <el-row v-if="!isManageMode" :gutter="20" class="charts-section">
      <el-col :span="8">
        <el-card class="glass-card">
          <template #header>
            <span>菜品销量排行</span>
          </template>
          <div ref="foodRankingChart" class="chart-container"></div>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card class="glass-card">
          <template #header>
            <span>时段分析</span>
          </template>
          <div ref="timeAnalysisChart" class="chart-container"></div>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card class="glass-card">
          <template #header>
            <span>用户口味偏好</span>
          </template>
          <div ref="tastePreferenceChart" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 炫图表：堆叠面积 + 口味雷达 -->
    <el-row v-if="!isManageMode" :gutter="20" class="charts-section">
      <el-col :span="12">
        <el-card class="glass-card">
          <template #header>
            <span>就餐高峰堆叠面积</span>
          </template>
          <div ref="peakAreaChart" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="glass-card">
          <template #header>
            <span>菜品口味雷达</span>
          </template>
          <div ref="tasteRadarChart" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import * as echarts from 'echarts'

// KPI模拟数据
const kpi = reactive({
  totalOrders: 1260,
  todayRevenue: 23890,
  activeCanteens: 3,
  avgWaitTime: 6.5
})

// 食堂列表
const canteenList = ref([
  {
    id: 1,
    name: '第一食堂',
    location: '东区学生公寓旁',
    capacity: 500,
    status: 'active'
  },
  {
    id: 2,
    name: '第二食堂',
    location: '西区教学楼附近',
    capacity: 400,
    status: 'active'
  },
  {
    id: 3,
    name: '第三食堂',
    location: '南区图书馆旁',
    capacity: 300,
    status: 'inactive'
  }
])

// 实时订单数据
const realtimeOrders = ref([
  { id: 1, time: '12:00', canteen: '第一食堂', count: 45 },
  { id: 2, time: '12:01', canteen: '第二食堂', count: 52 },
  { id: 3, time: '12:02', canteen: '第三食堂', count: 38 },
  { id: 4, time: '12:03', canteen: '第一食堂', count: 41 },
  { id: 5, time: '12:04', canteen: '第二食堂', count: 48 }
])

// 人流区域数据
const trafficAreas = ref([
  { id: 1, name: '入口区域', level: 5 },
  { id: 2, name: '取餐区', level: 4 },
  { id: 3, name: '就餐区A', level: 3 },
  { id: 4, name: '就餐区B', level: 2 },
  { id: 5, name: '出口区域', level: 1 }
])

// 图表引用
// 页面模式：默认看板
const isManageMode = ref(false)
const toggleMode = () => { isManageMode.value = !isManageMode.value }
const foodRankingChart = ref<HTMLElement>()
const timeAnalysisChart = ref<HTMLElement>()
const tastePreferenceChart = ref<HTMLElement>()
const peakAreaChart = ref<HTMLElement>()
const tasteRadarChart = ref<HTMLElement>()

// 获取人流等级样式
const getTrafficLevel = (level: number) => {
  if (level >= 4) return 'high'
  if (level >= 2) return 'medium'
  return 'low'
}

// 添加食堂
const handleAddCanteen = () => {
  ElMessage.info('添加食堂功能待实现')
}

// 编辑食堂
const handleEditCanteen = (row: any) => {
  ElMessage.info(`编辑食堂: ${row.name}`)
}

// 菜品管理
const handleManageFood = (row: any) => {
  ElMessage.info(`管理食堂 ${row.name} 的菜品`)
}

// 删除食堂
const handleDeleteCanteen = (row: any) => {
  ElMessage.info(`删除食堂: ${row.name}`)
}

// 初始化图表
const initCharts = () => {
  nextTick(() => {
    const palette = ['#4f8cff', '#43e97b', '#f6d365', '#a18cd1', '#fda085']
    const axisStyle = {
      axisLine: { lineStyle: { color: 'rgba(0,0,0,0.15)' } },
      splitLine: { lineStyle: { color: 'rgba(0,0,0,0.08)' } }
    }
    const grid = { top: 30, left: 18, right: 12, bottom: 26, containLabel: true }

    // 菜品销量排行（横向圆角渐变柱）
    if (foodRankingChart.value) {
      const chart = echarts.init(foodRankingChart.value)
      const option: any = {
        tooltip: { trigger: 'axis' },
        grid,
        xAxis: { type: 'value', ...axisStyle },
        yAxis: { type: 'category', data: ['宫保鸡丁', '红烧肉', '糖醋里脊', '麻婆豆腐', '清炒小白菜'], ...axisStyle },
        series: [{
          data: [120, 200, 150, 80, 70],
          type: 'bar',
          barWidth: 16,
          itemStyle: {
            borderRadius: [0, 10, 10, 0],
            color: { type: 'linear', x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: palette[0] }, { offset: 1, color: 'rgba(79,140,255,0.35)' }] }
          }
        }]
      }
      chart.setOption(option)
    }

    // 时段分析（平滑折线+渐变面积）
    if (timeAnalysisChart.value) {
      const chart = echarts.init(timeAnalysisChart.value)
      const option: any = {
        tooltip: { trigger: 'axis' },
        grid,
        xAxis: { type: 'category', data: ['6:00', '8:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'], ...axisStyle },
        yAxis: { type: 'value', ...axisStyle },
        series: [{
          data: [20, 40, 30, 80, 50, 60, 90, 40],
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: { width: 3, color: palette[1] },
          itemStyle: { color: '#fff', borderColor: palette[1], borderWidth: 2 },
          areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(67,233,123,0.3)' }, { offset: 1, color: 'rgba(56,249,215,0.06)' }] } }
        }]
      }
      chart.setOption(option)
    }

    // 口味偏好（圆环+白描边+高亮阴影）
    if (tastePreferenceChart.value) {
      const chart = echarts.init(tastePreferenceChart.value)
      const option: any = {
        tooltip: { trigger: 'item' },
        series: [{
          type: 'pie',
          radius: ['48%', '70%'],
          center: ['50%', '54%'],
          avoidLabelOverlap: false,
          itemStyle: { borderColor: '#fff', borderWidth: 2 },
          label: { color: '#666', formatter: '{b}: {d}%' },
          emphasis: { itemStyle: { shadowBlur: 12, shadowColor: 'rgba(0,0,0,0.18)' } },
          data: [
            { value: 35, name: '川菜', itemStyle: { color: palette[0] } },
            { value: 25, name: '粤菜', itemStyle: { color: palette[1] } },
            { value: 20, name: '湘菜', itemStyle: { color: palette[2] } },
            { value: 15, name: '鲁菜', itemStyle: { color: palette[3] } },
            { value: 5, name: '其他', itemStyle: { color: palette[4] } }
          ]
        }]
      }
      chart.setOption(option)
    }

    // 就餐高峰堆叠面积（多系列渐变面积）
    if (peakAreaChart.value) {
      const chart = echarts.init(peakAreaChart.value)
      const option: any = {
        tooltip: { trigger: 'axis' },
        legend: { data: ['第一食堂', '第二食堂', '第三食堂'] },
        grid,
        xAxis: { type: 'category', boundaryGap: false, data: ['10:00','11:00','12:00','13:00','17:00','18:00','19:00'], ...axisStyle },
        yAxis: { type: 'value', ...axisStyle },
        series: [
          { name: '第一食堂', type: 'line', stack: 'Total', smooth: true, symbol: 'none', areaStyle: { opacity: 0.35, color: palette[0] }, lineStyle: { width: 0 }, data: [30,50,120,80,40,90,60] },
          { name: '第二食堂', type: 'line', stack: 'Total', smooth: true, symbol: 'none', areaStyle: { opacity: 0.35, color: palette[1] }, lineStyle: { width: 0 }, data: [20,40,100,90,30,80,55] },
          { name: '第三食堂', type: 'line', stack: 'Total', smooth: true, symbol: 'none', areaStyle: { opacity: 0.35, color: palette[2] }, lineStyle: { width: 0 }, data: [10,20,60,50,20,60,40] }
        ]
      }
      chart.setOption(option)
    }

    // 菜品口味雷达（填充+线样式）
    if (tasteRadarChart.value) {
      const chart = echarts.init(tasteRadarChart.value)
      const option: any = {
        tooltip: { trigger: 'item' },
        radar: { indicator: [
          { name: '麻辣', max: 100 }, { name: '清淡', max: 100 }, { name: '酸甜', max: 100 }, { name: '咸鲜', max: 100 }, { name: '香辣', max: 100 }
        ], splitLine: { lineStyle: { color: 'rgba(0,0,0,0.08)' } }, splitArea: { areaStyle: { color: ['rgba(79,140,255,0.02)','rgba(79,140,255,0.04)'] } } },
        series: [{ type: 'radar',
          lineStyle: { color: palette[3], width: 2 },
          areaStyle: { color: 'rgba(161,140,209,0.25)' },
          symbol: 'circle', symbolSize: 4, itemStyle: { color: palette[3] },
          data: [{ value: [85, 60, 70, 80, 90], name: '口味偏好' }]
        }]
      }
      chart.setOption(option)
    }
  })
}

onMounted(() => {
  initCharts()
  
  // 模拟实时数据更新
  setInterval(() => {
    const newOrder = {
      id: Date.now(),
      time: new Date().toLocaleTimeString('zh-CN', { hour12: false }).slice(0, 5),
      canteen: ['第一食堂', '第二食堂', '第三食堂'][Math.floor(Math.random() * 3)],
      count: Math.floor(Math.random() * 50) + 20
    }
    realtimeOrders.value.unshift(newOrder)
    if (realtimeOrders.value.length > 10) {
      realtimeOrders.value.pop()
    }
  }, 5000)
})

// 切回看板时重建图表
watch(isManageMode, (val) => {
  if (!val) {
    nextTick(() => initCharts())
  }
})
</script>

<style scoped>
.canteen-page {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  color: #333;
}

/* 高级KPI卡片样式 */
.kpi-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

/* 参考 Users.vue：多色卡片主题 */
.kpi-card { position: relative; border-radius: 14px; padding: 18px 20px; color: #fff; box-shadow: 0 10px 24px rgba(0,0,0,0.08); overflow: hidden; }
.kpi-card::after { content: ''; position: absolute; right: -30px; top: -30px; width: 120px; height: 120px; background: rgba(255,255,255,0.15); border-radius: 50%; filter: blur(2px); }
.kpi-primary { background: linear-gradient(135deg, #4f8cff 0%, #6cc1ff 100%); }
.kpi-success { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
.kpi-warning { background: linear-gradient(135deg, #f6d365 0%, #fda085 100%); }
.kpi-info { background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%); }

.kpi-value {
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 6px;
  text-shadow: 0 2px 6px rgba(0,0,0,0.18);
}

.kpi-label {
  font-size: 13px;
  color: rgba(255,255,255,0.9);
  margin-bottom: 10px;
}

.kpi-trend {
  display: inline-block;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
  backdrop-filter: blur(4px);
}
.kpi-trend.positive { color: #bdfbd2; background: rgba(0,0,0,0.15); }
.kpi-trend.negative { color: #ffe8e6; background: rgba(0,0,0,0.18); }
.kpi-trend.neutral { color: #fff; background: rgba(0,0,0,0.12); }

.canteen-list {
  margin-bottom: 20px;
}

.realtime-section {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.realtime-orders {
  max-height: 200px;
  overflow-y: auto;
}

.order-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.order-item:last-child {
  border-bottom: none;
}

.order-time {
  color: #666;
  font-size: 12px;
}

.order-canteen {
  color: #333;
  font-weight: 500;
}

.order-count {
  color: #409eff;
  font-weight: bold;
}

.traffic-heatmap {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.traffic-area {
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  color: white;
  font-weight: bold;
}

.traffic-area.high {
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
}

.traffic-area.medium {
  background: linear-gradient(135deg, #feca57, #ff9ff3);
}

.traffic-area.low {
  background: linear-gradient(135deg, #48dbfb, #0abde3);
}

.area-name {
  display: block;
  margin-bottom: 5px;
}

.area-level {
  font-size: 12px;
  opacity: 0.8;
}

.charts-section {
  margin-bottom: 20px;
}

.chart-container {
  height: 250px;
}

/* 玻璃拟态 */
.glass-card :deep(.el-card__body) { backdrop-filter: saturate(180%) blur(8px); }
.glass-card { background: rgba(255,255,255,0.6); border: none; box-shadow: 0 8px 30px rgba(31,38,135,0.08); }
.glass-card :deep(.el-card__header) { background: transparent; border-bottom: 1px solid rgba(255,255,255,0.4); }
</style>

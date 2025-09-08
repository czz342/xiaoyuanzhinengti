<template>
  <div class="dashboard">
    <h1>数据看板</h1>
    
    <!-- 今日总览 -->
    <el-row :gutter="20" class="overview-cards">
      <el-col :span="6">
        <el-card class="overview-card">
          <div class="card-content">
            <div class="card-icon user-icon">
              <el-icon><User /></el-icon>
            </div>
            <div class="card-info">
              <div class="card-title">活跃用户</div>
              <div class="card-value">{{ overviewData.activeUsers }}</div>
              <div class="card-trend">+12.5%</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="overview-card">
          <div class="card-content">
            <div class="card-icon order-icon">
              <el-icon><ShoppingCart /></el-icon>
            </div>
            <div class="card-info">
              <div class="card-title">今日订单</div>
              <div class="card-value">{{ overviewData.todayOrders }}</div>
              <div class="card-trend">+8.3%</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="overview-card">
          <div class="card-content">
            <div class="card-icon reservation-icon">
              <el-icon><Calendar /></el-icon>
            </div>
            <div class="card-info">
              <div class="card-title">今日预约</div>
              <div class="card-value">{{ overviewData.todayReservations }}</div>
              <div class="card-trend">+15.2%</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="overview-card">
          <div class="card-content">
            <div class="card-icon activity-icon">
              <el-icon><Trophy /></el-icon>
            </div>
            <div class="card-info">
              <div class="card-title">活动参与</div>
              <div class="card-value">{{ overviewData.activityParticipants }}</div>
              <div class="card-trend">+22.1%</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 实时数据流 -->
    <el-row :gutter="20" class="realtime-section">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>食堂订单实时滚动</span>
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
        <el-card>
          <template #header>
            <div class="card-header">
              <span>自习室占用率</span>
              <el-tag type="info">实时</el-tag>
            </div>
          </template>
          <div class="studyroom-occupancy">
            <div
              v-for="room in studyRoomOccupancy"
              :key="room.id"
              class="room-item"
            >
              <span class="room-name">{{ room.name }}</span>
              <el-progress
                :percentage="room.occupancyRate"
                :color="getOccupancyColor(room.occupancyRate)"
                :stroke-width="8"
              />
              <span class="room-count">{{ room.occupied }}/{{ room.total }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 异常告警 -->
    <el-card class="alerts-section">
      <template #header>
        <div class="card-header">
          <span>异常告警</span>
          <el-badge :value="alerts.length" class="alert-badge">
            <el-icon><Bell /></el-icon>
          </el-badge>
        </div>
      </template>
      <div class="alerts-list">
        <div
          v-for="alert in alerts"
          :key="alert.id"
          class="alert-item"
          :class="alert.type"
        >
          <el-icon>
            <component :is="getAlertIcon(alert.type)" />
          </el-icon>
          <span class="alert-message">{{ alert.message }}</span>
          <span class="alert-time">{{ alert.time }}</span>
        </div>
      </div>
    </el-card>

    <!-- 趋势图表 -->
    <el-row :gutter="20" class="charts-section">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>7天数据趋势</span>
              <el-radio-group v-model="chartPeriod" size="small">
                <el-radio-button label="7">7天</el-radio-button>
                <el-radio-button label="30">30天</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="trendChart" class="chart-container"></div>
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>各模块数据对比</span>
          </template>
          <div ref="moduleChart" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { User, ShoppingCart, Calendar, Trophy, Bell, Warning, InfoFilled, SuccessFilled } from '@element-plus/icons-vue'
import * as echarts from 'echarts'

// 今日总览数据
const overviewData = reactive({
  activeUsers: 1248,
  todayOrders: 356,
  todayReservations: 89,
  activityParticipants: 234
})

// 实时订单数据
const realtimeOrders = ref([
  { id: 1, time: '12:00', canteen: '第一食堂', count: 45 },
  { id: 2, time: '12:01', canteen: '第二食堂', count: 52 },
  { id: 3, time: '12:02', canteen: '第三食堂', count: 38 },
  { id: 4, time: '12:03', canteen: '第一食堂', count: 41 },
  { id: 5, time: '12:04', canteen: '第二食堂', count: 48 }
])

// 自习室占用率
const studyRoomOccupancy = ref([
  { id: 1, name: 'A101', occupied: 32, total: 50, occupancyRate: 64 },
  { id: 2, name: 'A102', occupied: 45, total: 50, occupancyRate: 90 },
  { id: 3, name: 'A103', occupied: 28, total: 50, occupancyRate: 56 },
  { id: 4, name: 'B101', occupied: 40, total: 50, occupancyRate: 80 }
])

// 异常告警
const alerts = ref([
  { id: 1, type: 'warning', message: 'A栋洗衣设备故障', time: '10分钟前' },
  { id: 2, type: 'error', message: '图书馆库存不足', time: '25分钟前' },
  { id: 3, type: 'info', message: '3个订单超时未处理', time: '1小时前' }
])

const chartPeriod = ref('7')
const trendChart = ref<HTMLElement>()
const moduleChart = ref<HTMLElement>()

// 获取占用率颜色
const getOccupancyColor = (rate: number) => {
  if (rate >= 80) return '#f56c6c'
  if (rate >= 60) return '#e6a23c'
  return '#67c23a'
}

// 获取告警图标
const getAlertIcon = (type: string) => {
  switch (type) {
    case 'warning': return Warning
    case 'error': return InfoFilled
    case 'info': return SuccessFilled
    default: return Bell
  }
}

// 初始化图表
const initCharts = () => {
  nextTick(() => {
    // 趋势图
    if (trendChart.value) {
      const trendChartInstance = echarts.init(trendChart.value)
      const trendOption = {
        title: { text: '用户活跃度趋势' },
        tooltip: { trigger: 'axis' },
        xAxis: {
          type: 'category',
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: { type: 'value' },
        series: [{
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line',
          smooth: true,
          areaStyle: {}
        }]
      }
      trendChartInstance.setOption(trendOption)
    }

    // 模块对比图
    if (moduleChart.value) {
      const moduleChartInstance = echarts.init(moduleChart.value)
      const moduleOption = {
        title: { text: '各模块使用量' },
        tooltip: { trigger: 'item' },
        series: [{
          type: 'pie',
          data: [
            { value: 335, name: '食堂点餐' },
            { value: 310, name: '图书馆' },
            { value: 234, name: '自习室' },
            { value: 135, name: '快递驿站' },
            { value: 1548, name: '其他' }
          ]
        }]
      }
      moduleChartInstance.setOption(moduleOption)
    }
  })
}

onMounted(() => {
  initCharts()
  
  // 模拟实时数据更新
  setInterval(() => {
    // 更新实时订单
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
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.dashboard h1 {
  margin-bottom: 20px;
  color: #333;
}

.overview-cards {
  margin-bottom: 20px;
}

.overview-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.card-content {
  display: flex;
  align-items: center;
}

.card-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  font-size: 24px;
  color: white;
}

.user-icon { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.order-icon { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
.reservation-icon { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
.activity-icon { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }

.card-info {
  flex: 1;
}

.card-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.card-value {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}

.card-trend {
  font-size: 12px;
  color: #67c23a;
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

.studyroom-occupancy {
  max-height: 200px;
}

.room-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.room-name {
  width: 60px;
  font-weight: 500;
}

.room-count {
  margin-left: 12px;
  font-size: 12px;
  color: #666;
}

.alerts-section {
  margin-bottom: 20px;
}

.alert-badge {
  margin-left: 10px;
}

.alerts-list {
  max-height: 200px;
  overflow-y: auto;
}

.alert-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.alert-item:last-child {
  border-bottom: none;
}

.alert-item.warning .el-icon {
  color: #e6a23c;
}

.alert-item.error .el-icon {
  color: #f56c6c;
}

.alert-item.info .el-icon {
  color: #409eff;
}

.alert-message {
  flex: 1;
  margin-left: 12px;
  color: #333;
}

.alert-time {
  font-size: 12px;
  color: #666;
}

.charts-section {
  margin-bottom: 20px;
}

.chart-container {
  height: 300px;
}
</style>

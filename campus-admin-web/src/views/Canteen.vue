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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import * as echarts from 'echarts'

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
    // 菜品销量排行
    if (foodRankingChart.value) {
      const chart = echarts.init(foodRankingChart.value)
      const option = {
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'value' },
        yAxis: {
          type: 'category',
          data: ['宫保鸡丁', '红烧肉', '糖醋里脊', '麻婆豆腐', '清炒小白菜']
        },
        series: [{
          data: [120, 200, 150, 80, 70],
          type: 'bar',
          itemStyle: { color: '#409eff' }
        }]
      }
      chart.setOption(option)
    }

    // 时段分析
    if (timeAnalysisChart.value) {
      const chart = echarts.init(timeAnalysisChart.value)
      const option = {
        tooltip: { trigger: 'axis' },
        xAxis: {
          type: 'category',
          data: ['6:00', '8:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00']
        },
        yAxis: { type: 'value' },
        series: [{
          data: [20, 40, 30, 80, 50, 60, 90, 40],
          type: 'line',
          smooth: true,
          areaStyle: {}
        }]
      }
      chart.setOption(option)
    }

    // 口味偏好
    if (tastePreferenceChart.value) {
      const chart = echarts.init(tastePreferenceChart.value)
      const option = {
        tooltip: { trigger: 'item' },
        series: [{
          type: 'pie',
          data: [
            { value: 35, name: '川菜' },
            { value: 25, name: '粤菜' },
            { value: 20, name: '湘菜' },
            { value: 15, name: '鲁菜' },
            { value: 5, name: '其他' }
          ]
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

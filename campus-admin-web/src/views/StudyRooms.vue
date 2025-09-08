<template>
  <div class="studyrooms-page">
    <div class="page-header">
      <h2>自习室管理</h2>
      <el-button type="primary" @click="handleAddRoom">
        <el-icon><Plus /></el-icon>
        添加自习室
      </el-button>
    </div>

    <!-- 自习室列表 -->
    <el-card class="rooms-list">
      <template #header>
        <span>自习室列表</span>
      </template>
      <el-table :data="studyRoomList" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="自习室名称" width="150" />
        <el-table-column prop="location" label="位置" width="200" />
        <el-table-column prop="totalSeats" label="总座位数" width="100" />
        <el-table-column prop="availableSeats" label="可用座位" width="100" />
        <el-table-column prop="occupancyRate" label="占用率" width="100">
          <template #default="{ row }">
            <el-progress
              :percentage="row.occupancyRate"
              :color="getOccupancyColor(row.occupancyRate)"
              :stroke-width="6"
            />
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === 'active' ? '开放' : '维护中' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="handleEditRoom(row)">编辑</el-button>
            <el-button size="small" type="primary" @click="handleManageSeats(row)">座位管理</el-button>
            <el-button size="small" type="danger" @click="handleDeleteRoom(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 实时座位占用率 -->
    <el-card class="occupancy-section">
      <template #header>
        <div class="card-header">
          <span>实时座位占用率</span>
          <el-tag type="info">实时</el-tag>
        </div>
      </template>
      <div class="occupancy-grid">
        <div
          v-for="room in realtimeOccupancy"
          :key="room.id"
          class="room-card"
        >
          <div class="room-header">
            <span class="room-name">{{ room.name }}</span>
            <span class="room-rate">{{ room.occupancyRate }}%</span>
          </div>
          <el-progress
            :percentage="room.occupancyRate"
            :color="getOccupancyColor(room.occupancyRate)"
            :stroke-width="8"
          />
          <div class="room-details">
            <span>已占用: {{ room.occupied }}</span>
            <span>总座位: {{ room.total }}</span>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 数据分析 -->
    <el-row :gutter="20" class="charts-section">
      <el-col :span="8">
        <el-card>
          <template #header>
            <span>预约时段分析</span>
          </template>
          <div ref="timeAnalysisChart" class="chart-container"></div>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card>
          <template #header>
            <span>高峰时段识别</span>
          </template>
          <div ref="peakTimeChart" class="chart-container"></div>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card>
          <template #header>
            <span>用户偏好分析</span>
          </template>
          <div ref="userPreferenceChart" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import * as echarts from 'echarts'

// 自习室列表
const studyRoomList = ref([
  {
    id: 1,
    name: 'A101',
    location: 'A栋1楼',
    totalSeats: 50,
    availableSeats: 18,
    occupancyRate: 64,
    status: 'active'
  },
  {
    id: 2,
    name: 'A102',
    location: 'A栋1楼',
    totalSeats: 50,
    availableSeats: 5,
    occupancyRate: 90,
    status: 'active'
  },
  {
    id: 3,
    name: 'A103',
    location: 'A栋1楼',
    totalSeats: 50,
    availableSeats: 22,
    occupancyRate: 56,
    status: 'active'
  },
  {
    id: 4,
    name: 'B101',
    location: 'B栋1楼',
    totalSeats: 50,
    availableSeats: 10,
    occupancyRate: 80,
    status: 'maintenance'
  }
])

// 实时占用率数据
const realtimeOccupancy = ref([
  { id: 1, name: 'A101', occupied: 32, total: 50, occupancyRate: 64 },
  { id: 2, name: 'A102', occupied: 45, total: 50, occupancyRate: 90 },
  { id: 3, name: 'A103', occupied: 28, total: 50, occupancyRate: 56 },
  { id: 4, name: 'B101', occupied: 40, total: 50, occupancyRate: 80 },
  { id: 5, name: 'B102', occupied: 15, total: 50, occupancyRate: 30 },
  { id: 6, name: 'C101', occupied: 35, total: 50, occupancyRate: 70 }
])

// 图表引用
const timeAnalysisChart = ref<HTMLElement>()
const peakTimeChart = ref<HTMLElement>()
const userPreferenceChart = ref<HTMLElement>()

// 获取占用率颜色
const getOccupancyColor = (rate: number) => {
  if (rate >= 80) return '#f56c6c'
  if (rate >= 60) return '#e6a23c'
  return '#67c23a'
}

// 添加自习室
const handleAddRoom = () => {
  ElMessage.info('添加自习室功能待实现')
}

// 编辑自习室
const handleEditRoom = (row: any) => {
  ElMessage.info(`编辑自习室: ${row.name}`)
}

// 座位管理
const handleManageSeats = (row: any) => {
  ElMessage.info(`管理自习室 ${row.name} 的座位`)
}

// 删除自习室
const handleDeleteRoom = (row: any) => {
  ElMessage.info(`删除自习室: ${row.name}`)
}

// 初始化图表
const initCharts = () => {
  nextTick(() => {
    // 预约时段分析
    if (timeAnalysisChart.value) {
      const chart = echarts.init(timeAnalysisChart.value)
      const option = {
        tooltip: { trigger: 'axis' },
        xAxis: {
          type: 'category',
          data: ['8:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00']
        },
        yAxis: { type: 'value' },
        series: [{
          data: [20, 40, 30, 60, 80, 90, 70, 40],
          type: 'bar',
          itemStyle: { color: '#409eff' }
        }]
      }
      chart.setOption(option)
    }

    // 高峰时段识别
    if (peakTimeChart.value) {
      const chart = echarts.init(peakTimeChart.value)
      const option = {
        tooltip: { trigger: 'axis' },
        xAxis: {
          type: 'category',
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: { type: 'value' },
        series: [{
          data: [85, 90, 88, 92, 95, 70, 65],
          type: 'line',
          smooth: true,
          areaStyle: {}
        }]
      }
      chart.setOption(option)
    }

    // 用户偏好分析
    if (userPreferenceChart.value) {
      const chart = echarts.init(userPreferenceChart.value)
      const option = {
        tooltip: { trigger: 'item' },
        series: [{
          type: 'pie',
          data: [
            { value: 40, name: '靠窗座位' },
            { value: 30, name: '安静区域' },
            { value: 20, name: '电源附近' },
            { value: 10, name: '其他' }
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
    realtimeOccupancy.value.forEach(room => {
      const change = Math.floor(Math.random() * 6) - 3 // -3 到 +3 的变化
      const newOccupied = Math.max(0, Math.min(room.total, room.occupied + change))
      room.occupied = newOccupied
      room.occupancyRate = Math.round((newOccupied / room.total) * 100)
    })
  }, 10000)
})
</script>

<style scoped>
.studyrooms-page {
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

.rooms-list {
  margin-bottom: 20px;
}

.occupancy-section {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.occupancy-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.room-card {
  padding: 20px;
  border: 1px solid #e6e6e6;
  border-radius: 8px;
  background: white;
}

.room-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.room-name {
  font-weight: bold;
  font-size: 16px;
  color: #333;
}

.room-rate {
  font-size: 18px;
  font-weight: bold;
  color: #409eff;
}

.room-details {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 12px;
  color: #666;
}

.charts-section {
  margin-bottom: 20px;
}

.chart-container {
  height: 250px;
}
</style>

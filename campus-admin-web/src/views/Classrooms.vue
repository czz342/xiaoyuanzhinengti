<template>
  <div class="classrooms-page">
    <div class="page-header">
      <h2>教室管理</h2>
      <el-button type="primary" @click="handleAddClassroom">
        <el-icon><Plus /></el-icon>
        添加教室
      </el-button>
    </div>

    <!-- 教室列表 -->
    <el-card class="classrooms-list">
      <template #header>
        <span>教室列表</span>
      </template>
      <el-table :data="classroomList" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="code" label="教室编号" width="120" />
        <el-table-column prop="name" label="教室名称" width="150" />
        <el-table-column prop="building" label="教学楼" width="120" />
        <el-table-column prop="floor" label="楼层" width="80" />
        <el-table-column prop="capacity" label="容量" width="80" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="equipment" label="设备" width="150" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="handleEditClassroom(row)">编辑</el-button>
            <el-button size="small" type="primary" @click="handleManageReservations(row)">预约管理</el-button>
            <el-button size="small" type="danger" @click="handleDeleteClassroom(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 数据分析 -->
    <el-row :gutter="20" class="charts-section">
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>教室使用率热力图</span>
          </template>
          <div ref="usageHeatmapChart" class="chart-container"></div>
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>预约趋势分析</span>
          </template>
          <div ref="reservationTrendChart" class="chart-container"></div>
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

// 教室列表
const classroomList = ref([
  {
    id: 1,
    code: 'A101',
    name: 'A101教室',
    building: 'A栋',
    floor: '1楼',
    capacity: 50,
    status: 'available',
    equipment: '投影仪,音响,空调'
  },
  {
    id: 2,
    code: 'A102',
    name: 'A102教室',
    building: 'A栋',
    floor: '1楼',
    capacity: 80,
    status: 'occupied',
    equipment: '投影仪,音响,空调'
  },
  {
    id: 3,
    code: 'B201',
    name: 'B201教室',
    building: 'B栋',
    floor: '2楼',
    capacity: 100,
    status: 'maintenance',
    equipment: '投影仪,音响,空调,白板'
  }
])

// 图表引用
const usageHeatmapChart = ref<HTMLElement>()
const reservationTrendChart = ref<HTMLElement>()

// 获取状态类型
const getStatusType = (status: string) => {
  switch (status) {
    case 'available': return 'success'
    case 'occupied': return 'warning'
    case 'maintenance': return 'danger'
    default: return 'info'
  }
}

// 获取状态文本
const getStatusText = (status: string) => {
  switch (status) {
    case 'available': return '可用'
    case 'occupied': return '使用中'
    case 'maintenance': return '维护中'
    default: return '未知'
  }
}

// 添加教室
const handleAddClassroom = () => {
  ElMessage.info('添加教室功能待实现')
}

// 编辑教室
const handleEditClassroom = (row: any) => {
  ElMessage.info(`编辑教室: ${row.name}`)
}

// 预约管理
const handleManageReservations = (row: any) => {
  ElMessage.info(`管理教室 ${row.name} 的预约`)
}

// 删除教室
const handleDeleteClassroom = (row: any) => {
  ElMessage.info(`删除教室: ${row.name}`)
}

// 初始化图表
const initCharts = () => {
  nextTick(() => {
    // 使用率热力图
    if (usageHeatmapChart.value) {
      const chart = echarts.init(usageHeatmapChart.value)
      const option = {
        tooltip: { position: 'top' },
        grid: { height: '50%', top: '10%' },
        xAxis: {
          type: 'category',
          data: ['A101', 'A102', 'A103', 'B101', 'B102', 'B103'],
          splitArea: { show: true }
        },
        yAxis: {
          type: 'category',
          data: ['8:00', '10:00', '12:00', '14:00', '16:00', '18:00'],
          splitArea: { show: true }
        },
        visualMap: {
          min: 0,
          max: 100,
          calculable: true,
          orient: 'horizontal',
          left: 'center',
          bottom: '15%'
        },
        series: [{
          name: '使用率',
          type: 'heatmap',
          data: [
            [0, 0, 85], [0, 1, 90], [0, 2, 75], [0, 3, 80], [0, 4, 85], [0, 5, 70],
            [1, 0, 90], [1, 1, 95], [1, 2, 85], [1, 3, 90], [1, 4, 95], [1, 5, 80],
            [2, 0, 75], [2, 1, 80], [2, 2, 70], [2, 3, 75], [2, 4, 80], [2, 5, 65],
            [3, 0, 80], [3, 1, 85], [3, 2, 75], [3, 3, 80], [3, 4, 85], [3, 5, 70],
            [4, 0, 85], [4, 1, 90], [4, 2, 80], [4, 3, 85], [4, 4, 90], [4, 5, 75],
            [5, 0, 70], [5, 1, 75], [5, 2, 65], [5, 3, 70], [5, 4, 75], [5, 5, 60]
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      }
      chart.setOption(option)
    }

    // 预约趋势
    if (reservationTrendChart.value) {
      const chart = echarts.init(reservationTrendChart.value)
      const option = {
        tooltip: { trigger: 'axis' },
        xAxis: {
          type: 'category',
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: { type: 'value' },
        series: [{
          data: [25, 30, 35, 40, 45, 20, 15],
          type: 'line',
          smooth: true,
          areaStyle: {}
        }]
      }
      chart.setOption(option)
    }
  })
}

onMounted(() => {
  initCharts()
})
</script>

<style scoped>
.classrooms-page {
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

.classrooms-list {
  margin-bottom: 20px;
}

.charts-section {
  margin-bottom: 20px;
}

.chart-container {
  height: 300px;
}
</style>

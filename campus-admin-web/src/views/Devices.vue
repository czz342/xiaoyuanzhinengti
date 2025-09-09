<template>
  <div class="devices-page">
    <div class="page-header">
      <h2>共享设备管理</h2>
      <div class="header-actions">
        <el-button v-if="isManageMode" type="primary" @click="handleAddDevice">
          <el-icon><Plus /></el-icon>
          添加设备
        </el-button>
        <el-button type="success" plain @click="toggleMode">{{ isManageMode ? '返回可视化看板' : '管理详细数据' }}</el-button>
      </div>
    </div>

    <!-- 设备列表 -->
    <el-card v-if="isManageMode" class="devices-list">
      <template #header>
        <span>设备列表</span>
      </template>
      <el-table :data="deviceList" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="deviceName" label="设备名称" width="150" />
        <el-table-column prop="deviceType" label="设备类型" width="120" />
        <el-table-column prop="location" label="位置" width="200" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="usageCount" label="使用次数" width="100" />
        <el-table-column prop="revenue" label="收益" width="100" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="handleEditDevice(row)">编辑</el-button>
            <el-button size="small" type="primary" @click="handleManageOrders(row)">订单管理</el-button>
            <el-button size="small" type="danger" @click="handleDeleteDevice(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 数据分析 -->
    <el-row v-if="!isManageMode" :gutter="20" class="charts-section">
      <el-col :span="8">
        <el-card class="glass-card">
          <template #header>
            <span>设备使用率统计</span>
          </template>
          <div ref="usageRateChart" class="chart-container"></div>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card class="glass-card">
          <template #header>
            <span>收益统计</span>
          </template>
          <div ref="revenueChart" class="chart-container"></div>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card class="glass-card">
          <template #header>
            <span>设备故障率</span>
          </template>
          <div ref="faultRateChart" class="chart-container"></div>
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

// 设备列表
const deviceList = ref([
  {
    id: 1,
    deviceName: '洗衣机A001',
    deviceType: '洗衣机',
    location: 'A栋1楼洗衣房',
    status: 'available',
    usageCount: 156,
    revenue: 780
  },
  {
    id: 2,
    deviceName: '洗衣机A002',
    deviceType: '洗衣机',
    location: 'A栋1楼洗衣房',
    status: 'busy',
    usageCount: 203,
    revenue: 1015
  },
  {
    id: 3,
    deviceName: '打印机B001',
    deviceType: '打印机',
    location: 'B栋2楼打印室',
    status: 'maintenance',
    usageCount: 89,
    revenue: 445
  }
])

// 图表引用
// 页面模式：默认看板
const isManageMode = ref(false)
const toggleMode = () => { isManageMode.value = !isManageMode.value }
const usageRateChart = ref<HTMLElement>()
const revenueChart = ref<HTMLElement>()
const faultRateChart = ref<HTMLElement>()

// 获取状态类型
const getStatusType = (status: string) => {
  switch (status) {
    case 'available': return 'success'
    case 'busy': return 'warning'
    case 'maintenance': return 'danger'
    default: return 'info'
  }
}

// 获取状态文本
const getStatusText = (status: string) => {
  switch (status) {
    case 'available': return '可用'
    case 'busy': return '使用中'
    case 'maintenance': return '维护中'
    default: return '未知'
  }
}

// 添加设备
const handleAddDevice = () => {
  ElMessage.info('添加设备功能待实现')
}

// 编辑设备
const handleEditDevice = (row: any) => {
  ElMessage.info(`编辑设备: ${row.deviceName}`)
}

// 订单管理
const handleManageOrders = (row: any) => {
  ElMessage.info(`管理设备 ${row.deviceName} 的订单`)
}

// 删除设备
const handleDeleteDevice = (row: any) => {
  ElMessage.info(`删除设备: ${row.deviceName}`)
}

// 初始化图表
const initCharts = () => {
  nextTick(() => {
    // 设备使用率统计
    if (usageRateChart.value) {
      const chart = echarts.init(usageRateChart.value)
      const option = {
        tooltip: { trigger: 'axis' },
        xAxis: {
          type: 'category',
          data: ['洗衣机A001', '洗衣机A002', '打印机B001', '打印机B002', '烘干机C001']
        },
        yAxis: { type: 'value' },
        series: [{
          data: [85, 92, 78, 88, 75],
          type: 'bar',
          itemStyle: { color: '#409eff' }
        }]
      }
      chart.setOption(option)
    }

    // 收益统计
    if (revenueChart.value) {
      const chart = echarts.init(revenueChart.value)
      const option = {
        tooltip: { trigger: 'axis' },
        xAxis: {
          type: 'category',
          data: ['1月', '2月', '3月', '4月', '5月', '6月']
        },
        yAxis: { type: 'value' },
        series: [{
          data: [1200, 1500, 1800, 1600, 2000, 2200],
          type: 'line',
          smooth: true,
          areaStyle: {}
        }]
      }
      chart.setOption(option)
    }

    // 设备故障率
    if (faultRateChart.value) {
      const chart = echarts.init(faultRateChart.value)
      const option = {
        tooltip: { trigger: 'item' },
        series: [{
          type: 'pie',
          data: [
            { value: 85, name: '正常' },
            { value: 10, name: '轻微故障' },
            { value: 5, name: '严重故障' }
          ]
        }]
      }
      chart.setOption(option)
    }
  })
}

onMounted(() => {
  initCharts()
})

// 切回看板时重建图表
watch(isManageMode, (val) => {
  if (!val) {
    nextTick(() => initCharts())
  }
})
</script>

<style scoped>
.devices-page {
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

.devices-list {
  margin-bottom: 20px;
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

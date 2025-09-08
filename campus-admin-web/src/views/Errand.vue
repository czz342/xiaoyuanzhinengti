<template>
  <div class="errand-page">
    <div class="page-header">
      <h2>跑腿服务管理</h2>
      <el-button type="primary" @click="handleAddOrder">
        <el-icon><Plus /></el-icon>
        创建订单
      </el-button>
    </div>

    <!-- 订单列表 -->
    <el-card class="orders-list">
      <template #header>
        <span>订单列表</span>
      </template>
      <el-table :data="orderList" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="orderNumber" label="订单号" width="150" />
        <el-table-column prop="customer" label="客户" width="120" />
        <el-table-column prop="runner" label="跑腿员" width="120" />
        <el-table-column prop="serviceType" label="服务类型" width="120" />
        <el-table-column prop="amount" label="金额" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdTime" label="创建时间" width="160" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="handleViewOrder(row)">查看</el-button>
            <el-button size="small" type="primary" @click="handleEditOrder(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDeleteOrder(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 数据分析 -->
    <el-row :gutter="20" class="charts-section">
      <el-col :span="8">
        <el-card>
          <template #header>
            <span>订单量趋势</span>
          </template>
          <div ref="orderTrendChart" class="chart-container"></div>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card>
          <template #header>
            <span>服务类型分布</span>
          </template>
          <div ref="serviceTypeChart" class="chart-container"></div>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card>
          <template #header>
            <span>用户信誉度分布</span>
          </template>
          <div ref="credibilityChart" class="chart-container"></div>
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

// 订单列表
const orderList = ref([
  {
    id: 1,
    orderNumber: 'ER20230901001',
    customer: '张三',
    runner: '李四',
    serviceType: '代取快递',
    amount: 5.00,
    status: 'completed',
    createdTime: '2023-09-01 10:00:00'
  },
  {
    id: 2,
    orderNumber: 'ER20230901002',
    customer: '王五',
    runner: '赵六',
    serviceType: '代买午餐',
    amount: 8.00,
    status: 'in_progress',
    createdTime: '2023-09-01 11:00:00'
  },
  {
    id: 3,
    orderNumber: 'ER20230901003',
    customer: '钱七',
    runner: '孙八',
    serviceType: '代送文件',
    amount: 3.00,
    status: 'pending',
    createdTime: '2023-09-01 12:00:00'
  }
])

// 图表引用
const orderTrendChart = ref<HTMLElement>()
const serviceTypeChart = ref<HTMLElement>()
const credibilityChart = ref<HTMLElement>()

// 获取状态类型
const getStatusType = (status: string) => {
  switch (status) {
    case 'pending': return 'warning'
    case 'in_progress': return 'primary'
    case 'completed': return 'success'
    case 'cancelled': return 'danger'
    default: return 'info'
  }
}

// 获取状态文本
const getStatusText = (status: string) => {
  switch (status) {
    case 'pending': return '待接单'
    case 'in_progress': return '进行中'
    case 'completed': return '已完成'
    case 'cancelled': return '已取消'
    default: return '未知'
  }
}

// 创建订单
const handleAddOrder = () => {
  ElMessage.info('创建订单功能待实现')
}

// 查看订单
const handleViewOrder = (row: any) => {
  ElMessage.info(`查看订单: ${row.orderNumber}`)
}

// 编辑订单
const handleEditOrder = (row: any) => {
  ElMessage.info(`编辑订单: ${row.orderNumber}`)
}

// 删除订单
const handleDeleteOrder = (row: any) => {
  ElMessage.info(`删除订单: ${row.orderNumber}`)
}

// 初始化图表
const initCharts = () => {
  nextTick(() => {
    // 订单量趋势
    if (orderTrendChart.value) {
      const chart = echarts.init(orderTrendChart.value)
      const option = {
        tooltip: { trigger: 'axis' },
        xAxis: {
          type: 'category',
          data: ['1月', '2月', '3月', '4月', '5月', '6月']
        },
        yAxis: { type: 'value' },
        series: [{
          data: [80, 100, 120, 110, 140, 150],
          type: 'line',
          smooth: true,
          areaStyle: {}
        }]
      }
      chart.setOption(option)
    }

    // 服务类型分布
    if (serviceTypeChart.value) {
      const chart = echarts.init(serviceTypeChart.value)
      const option = {
        tooltip: { trigger: 'item' },
        series: [{
          type: 'pie',
          data: [
            { value: 35, name: '代取快递' },
            { value: 25, name: '代买午餐' },
            { value: 20, name: '代送文件' },
            { value: 15, name: '代排队' },
            { value: 5, name: '其他' }
          ]
        }]
      }
      chart.setOption(option)
    }

    // 用户信誉度分布
    if (credibilityChart.value) {
      const chart = echarts.init(credibilityChart.value)
      const option = {
        tooltip: { trigger: 'axis' },
        xAxis: {
          type: 'category',
          data: ['4.5-5.0', '4.0-4.5', '3.5-4.0', '3.0-3.5', '2.5-3.0']
        },
        yAxis: { type: 'value' },
        series: [{
          data: [45, 38, 32, 28, 25],
          type: 'bar',
          itemStyle: { color: '#409eff' }
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
.errand-page {
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

.orders-list {
  margin-bottom: 20px;
}

.charts-section {
  margin-bottom: 20px;
}

.chart-container {
  height: 250px;
}
</style>

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

    <!-- 高级KPI指标卡片 -->
    <div v-if="!isManageMode" class="kpi-section">
      <div class="kpi-card kpi-primary">
        <div class="kpi-value">{{ kpi.totalDevices }}</div>
        <div class="kpi-label">设备总数</div>
        <div class="kpi-trend positive">+3 新增</div>
      </div>
      <div class="kpi-card kpi-success">
        <div class="kpi-value">{{ kpi.activeRate }}%</div>
        <div class="kpi-label">在线率</div>
        <div class="kpi-trend positive">+1.2%</div>
      </div>
      <div class="kpi-card kpi-warning">
        <div class="kpi-value">¥{{ kpi.monthRevenue }}</div>
        <div class="kpi-label">本月收益</div>
        <div class="kpi-trend positive">+6.4%</div>
      </div>
      <div class="kpi-card kpi-info">
        <div class="kpi-value">{{ kpi.faultRate }}%</div>
        <div class="kpi-label">故障率</div>
        <div class="kpi-trend negative">-0.6%</div>
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

    <!-- 高级图表 · 桑基 + 实时心跳 -->
    <el-row v-if="!isManageMode" :gutter="20" class="charts-section">
      <el-col :span="12">
        <el-card class="glass-card">
          <template #header>
            <span>设备使用路径桑基图</span>
          </template>
          <div ref="sankeyChart" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="glass-card">
          <template #header>
            <div class="card-header"><span>实时心跳流水</span><el-tag type="success">在线</el-tag></div>
          </template>
          <div class="stream-list">
            <div v-for="item in heartbeatList" :key="item.id" class="stream-item">
              <span class="time">{{ item.time }}</span>
              <span class="content">{{ item.device }} 心跳 {{ item.latency }}ms</span>
            </div>
          </div>
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
  totalDevices: 58,
  activeRate: 96,
  monthRevenue: 32890,
  faultRate: 2.8
})

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
const sankeyChart = ref<HTMLElement>()
const heartbeatList = ref<any[]>([
  { id: 1, time: '12:00:01', device: '打印机-A01', latency: 42 },
  { id: 2, time: '12:00:03', device: '充电宝-C12', latency: 35 },
  { id: 3, time: '12:00:05', device: '电脑房-D07', latency: 51 }
])

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
    const palette = ['#4f8cff', '#43e97b', '#f6d365', '#a18cd1', '#fda085']
    const axisStyle = {
      axisLine: { lineStyle: { color: 'rgba(0,0,0,0.15)' } },
      axisLabel: { color: '#666' },
      splitLine: { lineStyle: { color: 'rgba(0,0,0,0.08)' } }
    }
    const grid = { top: 30, left: 18, right: 12, bottom: 26, containLabel: true }
    // 设备使用率统计（圆角+渐变）
    if (usageRateChart.value) {
      const chart = echarts.init(usageRateChart.value)
      const option: any = {
        tooltip: { trigger: 'axis' },
        grid,
        xAxis: { type: 'category', data: ['洗衣机A001', '洗衣机A002', '打印机B001', '打印机B002', '烘干机C001'], ...axisStyle },
        yAxis: { type: 'value', ...axisStyle },
        series: [{
          data: [85, 92, 78, 88, 75],
          type: 'bar',
          barWidth: 18,
          itemStyle: {
            borderRadius: [8, 8, 0, 0],
            color: {
              type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: palette[0] },
                { offset: 1, color: 'rgba(79,140,255,0.35)' }
              ]
            }
          }
        }],
        animationDuration: 800
      }
      chart.setOption(option)
    }

    // 收益统计（平滑折线+渐变面积）
    if (revenueChart.value) {
      const chart = echarts.init(revenueChart.value)
      const option: any = {
        tooltip: { trigger: 'axis' },
        grid,
        xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月'], ...axisStyle },
        yAxis: { type: 'value', ...axisStyle },
        series: [{
          data: [1200, 1500, 1800, 1600, 2000, 2200],
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: { width: 3, color: palette[1] },
          itemStyle: { color: '#fff', borderColor: palette[1], borderWidth: 2 },
          areaStyle: {
            color: {
              type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(67,233,123,0.35)' },
                { offset: 1, color: 'rgba(56,249,215,0.05)' }
              ]
            }
          }
        }]
      }
      chart.setOption(option)
    }

    // 设备故障率（圆环+高亮）
    if (faultRateChart.value) {
      const chart = echarts.init(faultRateChart.value)
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
            { value: 85, name: '正常', itemStyle: { color: palette[1] } },
            { value: 10, name: '轻微故障', itemStyle: { color: palette[2] } },
            { value: 5, name: '严重故障', itemStyle: { color: '#ff6b6b' } }
          ]
        }]
      }
      chart.setOption(option)
    }

    // 桑基：使用路径（选择→排队→使用→完成/故障），样式优化
    if (sankeyChart.value) {
      const chart = echarts.init(sankeyChart.value)
      const option: any = {
        tooltip: { trigger: 'item' },
        series: [
          {
            type: 'sankey',
            layout: 'none',
            emphasis: { focus: 'adjacency' },
            nodeWidth: 18,
            nodeGap: 10,
            label: { color: '#555', fontSize: 12 },
            itemStyle: { borderWidth: 0, color: '#91c9ff' },
            lineStyle: { color: 'gradient', curveness: 0.5, opacity: 0.55 },
            data: [
              { name: '选择设备' },
              { name: '排队中' },
              { name: '使用中' },
              { name: '已完成' },
              { name: '发生故障' }
            ],
            links: [
              { source: '选择设备', target: '排队中', value: 120 },
              { source: '排队中', target: '使用中', value: 100 },
              { source: '使用中', target: '已完成', value: 85 },
              { source: '使用中', target: '发生故障', value: 15 }
            ]
          }
        ]
      }
      chart.setOption(option)
    }
  })
}

onMounted(() => {
  initCharts()
  // 模拟实时心跳
  setInterval(() => {
    const devices = ['打印机-A01', '打印机-A02', '充电宝-C12', '电脑房-D07', '投影仪-P03']
    const item = {
      id: Date.now(),
      time: new Date().toLocaleTimeString('zh-CN', { hour12: false }),
      device: devices[Math.floor(Math.random()*devices.length)],
      latency: Math.floor(Math.random()*60)+20
    }
    heartbeatList.value.unshift(item)
    if (heartbeatList.value.length > 14) heartbeatList.value.pop()
  }, 4000)
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

/* 高级KPI卡片样式 */
.kpi-section { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 20px; }
.kpi-card { position: relative; border-radius: 14px; padding: 18px 20px; color: #fff; box-shadow: 0 10px 24px rgba(0,0,0,0.08); overflow: hidden; }
.kpi-card::after { content: ''; position: absolute; right: -30px; top: -30px; width: 120px; height: 120px; background: rgba(255,255,255,0.15); border-radius: 50%; filter: blur(2px); }
.kpi-primary { background: linear-gradient(135deg, #4f8cff 0%, #6cc1ff 100%); }
.kpi-success { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
.kpi-warning { background: linear-gradient(135deg, #f6d365 0%, #fda085 100%); }
.kpi-info { background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%); }
.kpi-value { font-size: 28px; font-weight: 700; color: #fff; margin-bottom: 6px; text-shadow: 0 2px 6px rgba(0,0,0,0.18); }
.kpi-label { font-size: 13px; color: rgba(255,255,255,0.9); margin-bottom: 10px; }
.kpi-trend { display: inline-block; font-size: 12px; padding: 2px 8px; border-radius: 10px; backdrop-filter: blur(4px); }
.kpi-trend.positive { color: #c0ffb3; background: rgba(0,0,0,0.15); }
.kpi-trend.negative { color: #ffe8e6; background: rgba(0,0,0,0.18); }

.devices-list {
  margin-bottom: 20px;
}

.charts-section {
  margin-bottom: 20px;
}

.chart-container {
  height: 250px;
}
.stream-list { max-height: 260px; overflow: auto; }
.stream-item { display: flex; gap: 10px; padding: 8px 0; border-bottom: 1px solid #f0f0f0; }
.stream-item .time { color: #909399; font-size: 12px; width: 86px; }
.stream-item .content { color: #333; }

/* 玻璃拟态 */
.glass-card :deep(.el-card__body) { backdrop-filter: saturate(180%) blur(8px); }
.glass-card { background: rgba(255,255,255,0.6); border: none; box-shadow: 0 8px 30px rgba(31,38,135,0.08); }
.glass-card :deep(.el-card__header) { background: transparent; border-bottom: 1px solid rgba(255,255,255,0.4); }
</style>

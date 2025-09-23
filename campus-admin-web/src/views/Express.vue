<template>
  <div class="express-page">
    <div class="page-header">
      <h2>快递驿站管理</h2>
      <div class="header-actions">
        <el-button v-if="isManageMode" type="primary" @click="handleAddStation">
          <el-icon><Plus /></el-icon>
          添加驿站
        </el-button>
        <el-button type="success" plain @click="toggleMode">{{ isManageMode ? '返回可视化看板' : '管理详细数据' }}</el-button>
      </div>
    </div>

    <!-- 高级KPI指标卡片 -->
    <div v-if="!isManageMode" class="kpi-section">
      <div class="kpi-card kpi-primary">
        <div class="kpi-value">{{ kpi.todayParcels }}</div>
        <div class="kpi-label">今日入库</div>
        <div class="kpi-trend positive">+9.2%</div>
      </div>
      <div class="kpi-card kpi-success">
        <div class="kpi-value">{{ kpi.pendingPickup }}</div>
        <div class="kpi-label">待取包裹</div>
        <div class="kpi-trend negative">-3.1%</div>
      </div>
      <div class="kpi-card kpi-warning">
        <div class="kpi-value">{{ kpi.capacityUsage }}%</div>
        <div class="kpi-label">平均容量使用率</div>
        <div class="kpi-trend positive">+1.4%</div>
      </div>
      <div class="kpi-card kpi-info">
        <div class="kpi-value">{{ kpi.overdueParcels }}</div>
        <div class="kpi-label">滞留包裹</div>
        <div class="kpi-trend neutral">--</div>
      </div>
    </div>

    <!-- 驿站列表 -->
    <el-card v-if="isManageMode" class="stations-list">
      <template #header>
        <span>驿站列表</span>
      </template>
      <el-table :data="stationList" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="stationName" label="驿站名称" width="150" />
        <el-table-column prop="stationCode" label="驿站代码" width="120" />
        <el-table-column prop="stationAddress" label="地址" width="200" />
        <el-table-column prop="contactPhone" label="联系电话" width="130" />
        <el-table-column prop="capacity" label="容量" width="100" />
        <el-table-column prop="currentCount" label="当前包裹数" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === 'active' ? '营业中' : '暂停营业' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="handleEditStation(row)">编辑</el-button>
            <el-button size="small" type="primary" @click="handleManagePackages(row)">包裹管理</el-button>
            <el-button size="small" type="danger" @click="handleDeleteStation(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 数据分析 -->
    <el-row v-if="!isManageMode" :gutter="20" class="charts-section">
      <el-col :span="8">
        <el-card class="glass-card">
          <template #header>
            <span>包裹流转图</span>
          </template>
          <div ref="packageFlowChart" class="chart-container"></div>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card class="glass-card">
          <template #header>
            <span>驿站容量使用率</span>
          </template>
          <div ref="capacityUsageChart" class="chart-container"></div>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card class="glass-card">
          <template #header>
            <span>快递公司分布</span>
          </template>
          <div ref="companyDistributionChart" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 高级图表 · 热力 + 实时流 -->
    <el-row v-if="!isManageMode" :gutter="20" class="charts-section">
      <el-col :span="12">
        <el-card class="glass-card">
          <template #header>
            <span>快递时效分析</span>
          </template>
          <div ref="heatRegionChart" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="glass-card">
          <template #header>
            <div class="card-header"><span>实时通知流水</span><el-tag type="success">实时</el-tag></div>
          </template>
          <div class="stream-list">
            <div v-for="item in streamList" :key="item.id" class="stream-item">
              <span class="time">{{ item.time }}</span>
              <span class="content">{{ item.content }}</span>
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
  todayParcels: 820,
  pendingPickup: 312,
  capacityUsage: 70,
  overdueParcels: 24
})

// 驿站列表
const stationList = ref([
  {
    id: 1,
    stationName: '东区驿站',
    stationCode: 'EAST001',
    stationAddress: '东区学生公寓1号楼',
    contactPhone: '13800138001',
    capacity: 1000,
    currentCount: 650,
    status: 'active'
  },
  {
    id: 2,
    stationName: '西区驿站',
    stationCode: 'WEST001',
    stationAddress: '西区教学楼附近',
    contactPhone: '13800138002',
    capacity: 800,
    currentCount: 520,
    status: 'active'
  },
  {
    id: 3,
    stationName: '南区驿站',
    stationCode: 'SOUTH001',
    stationAddress: '南区图书馆旁',
    contactPhone: '13800138003',
    capacity: 600,
    currentCount: 480,
    status: 'inactive'
  }
])

// 图表引用
const packageFlowChart = ref<HTMLElement>()
const capacityUsageChart = ref<HTMLElement>()
const companyDistributionChart = ref<HTMLElement>()
const heatRegionChart = ref<HTMLElement>()
const streamList = ref<any[]>([
  { id: 1, time: '12:01', content: '东区驿站 新入库 12 件' },
  { id: 2, time: '12:02', content: '西区驿站 已取件 8 件' },
  { id: 3, time: '12:03', content: '南区驿站 滞留清点 3 件' }
])

// 添加驿站
const handleAddStation = () => {
  ElMessage.info('添加驿站功能待实现')
}

// 编辑驿站
const handleEditStation = (row: any) => {
  ElMessage.info(`编辑驿站: ${row.stationName}`)
}

// 包裹管理
const handleManagePackages = (row: any) => {
  ElMessage.info(`管理驿站 ${row.stationName} 的包裹`)
}

// 删除驿站
const handleDeleteStation = (row: any) => {
  ElMessage.info(`删除驿站: ${row.stationName}`)
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

    // 包裹流转图（桑基样式优化）
    if (packageFlowChart.value) {
      const chart = echarts.init(packageFlowChart.value)
      const option: any = {
        tooltip: { trigger: 'item' },
        series: [{
          type: 'sankey',
          layout: 'none',
          nodeWidth: 18,
          nodeGap: 10,
          label: { color: '#555', fontSize: 12 },
          lineStyle: { color: 'gradient', curveness: 0.5, opacity: 0.55 },
          data: [
            { name: '入库' },
            { name: '待取' },
            { name: '已取' },
            { name: '滞留' }
          ],
          links: [
            { source: '入库', target: '待取', value: 100 },
            { source: '待取', target: '已取', value: 80 },
            { source: '待取', target: '滞留', value: 20 }
          ]
        }]
      }
      chart.setOption(option)
    }

    // 容量使用率（圆角+渐变柱）
    if (capacityUsageChart.value) {
      const chart = echarts.init(capacityUsageChart.value)
      const option: any = {
        tooltip: { trigger: 'axis' },
        grid,
        xAxis: { type: 'category', data: ['东区驿站', '西区驿站', '南区驿站'], ...axisStyle },
        yAxis: { type: 'value', ...axisStyle },
        series: [{
          data: [65, 65, 80],
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
        }]
      }
      chart.setOption(option)
    }

    // 快递公司分布（圆环+白描边）
    if (companyDistributionChart.value) {
      const chart = echarts.init(companyDistributionChart.value)
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
            { value: 35, name: '顺丰', itemStyle: { color: '#50a3ba' } },
            { value: 25, name: '圆通', itemStyle: { color: '#eac736' } },
            { value: 20, name: '中通', itemStyle: { color: '#d94e5d' } },
            { value: 15, name: '韵达', itemStyle: { color: '#91cc75' } },
            { value: 5, name: '其他', itemStyle: { color: '#fac858' } }
          ]
        }]
      }
      chart.setOption(option)
    }

    // 快递时效分析（散点：满意度映射尺寸+配色）
    if (heatRegionChart.value) {
      const chart = echarts.init(heatRegionChart.value)
      const data: any[] = []
      const companies = ['顺丰', '圆通', '中通', '韵达', '申通', '京东']
      for (let i = 0; i < 50; i++) {
        data.push([
          Math.random() * 5 + 0.5, // 重量 0.5-5.5kg
          Math.random() * 3 + 1,   // 时效 1-4天
          companies[Math.floor(Math.random() * companies.length)],
          Math.random() * 100 + 50 // 满意度 50-150
        ])
      }
      const option: any = {
        title: { text: '包裹重量 vs 配送时效', left: 'center', textStyle: { fontSize: 14 } },
        tooltip: {
          formatter: (params: any) => {
            return `公司: ${params.data[2]}<br/>重量: ${params.data[0].toFixed(1)}kg<br/>时效: ${params.data[1].toFixed(1)}天<br/>满意度: ${params.data[3].toFixed(0)}`
          }
        },
        grid,
        xAxis: { type: 'value', name: '包裹重量(kg)', nameLocation: 'middle', nameGap: 30, axisLabel: { formatter: '{value}kg', color: '#666' }, ...axisStyle },
        yAxis: { type: 'value', name: '配送时效(天)', nameLocation: 'middle', nameGap: 40, axisLabel: { formatter: '{value}天', color: '#666' }, ...axisStyle },
        visualMap: {
          min: 50,
          max: 150,
          dimension: 3,
          orient: 'horizontal',
          left: 'center',
          bottom: 10,
          inRange: { color: ['#50a3ba', '#eac736', '#d94e5d'] },
          text: ['高', '低'],
          textStyle: { color: '#333' }
        },
        series: [{
          type: 'scatter',
          data: data,
          symbolSize: (data: any) => Math.sqrt(data[3]) * 2,
          itemStyle: {
            opacity: 0.7,
            borderColor: '#fff',
            borderWidth: 1
          }
        }]
      }
      chart.setOption(option)
    }
  })
}

onMounted(() => {
  initCharts()
  // 模拟实时流水
  setInterval(() => {
    const names = ['东区驿站', '西区驿站', '南区驿站']
    const actions = ['新入库', '已取件', '入库异常', '滞留清点']
    const item = {
      id: Date.now(),
      time: new Date().toLocaleTimeString('zh-CN', { hour12: false }).slice(0,5),
      content: `${names[Math.floor(Math.random()*3)]} ${actions[Math.floor(Math.random()*actions.length)]} ${Math.floor(Math.random()*15)+1} 件`
    }
    streamList.value.unshift(item)
    if (streamList.value.length > 12) streamList.value.pop()
  }, 5000)
})

// 看板/管理切换
const isManageMode = ref(false)
const toggleMode = () => {
  isManageMode.value = !isManageMode.value
}

// 切回看板后重绘图表
watch(isManageMode, (val) => {
  if (!val) {
    nextTick(() => initCharts())
  }
})
</script>

<style scoped>
.express-page {
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
/* 主题色：驿站 蓝青渐变 */
.kpi-card { position: relative; border-radius: 14px; padding: 18px 20px; color: #fff; box-shadow: 0 10px 24px rgba(0,0,0,0.08); overflow: hidden; }
.kpi-card::after { content: ''; position: absolute; right: -30px; top: -30px; width: 120px; height: 120px; background: rgba(255,255,255,0.15); border-radius: 50%; filter: blur(2px); }
.kpi-primary { background: linear-gradient(135deg, #4f8cff 0%, #6cc1ff 100%); }
.kpi-success { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
.kpi-warning { background: linear-gradient(135deg, #f6d365 0%, #fda085 100%); }
.kpi-info { background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%); }
.kpi-value { font-size: 28px; font-weight: 700; color: #fff; margin-bottom: 6px; text-shadow: 0 2px 6px rgba(0,0,0,0.18); }
.kpi-label { font-size: 13px; color: rgba(255,255,255,0.9); margin-bottom: 10px; }
.kpi-trend { display: inline-block; font-size: 12px; padding: 2px 8px; border-radius: 10px; backdrop-filter: blur(4px); }
.kpi-trend.positive { color: #b2ff59; background: rgba(0,0,0,0.15); }
.kpi-trend.negative { color: #ffe8e6; background: rgba(0,0,0,0.18); }
.kpi-trend.neutral { color: #fff; background: rgba(0,0,0,0.12); }

.stations-list {
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
.stream-item .time { color: #909399; font-size: 12px; width: 56px; }
.stream-item .content { color: #333; }

.glass-card {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.18);
  transition: all 0.3s ease;
}

.header-actions {
  display: flex;
  gap: 12px;
}
</style>

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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import * as echarts from 'echarts'

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
    // 包裹流转图
    if (packageFlowChart.value) {
      const chart = echarts.init(packageFlowChart.value)
      const option = {
        tooltip: { trigger: 'item' },
        series: [{
          type: 'sankey',
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

    // 容量使用率
    if (capacityUsageChart.value) {
      const chart = echarts.init(capacityUsageChart.value)
      const option = {
        tooltip: { trigger: 'axis' },
        xAxis: {
          type: 'category',
          data: ['东区驿站', '西区驿站', '南区驿站']
        },
        yAxis: { type: 'value' },
        series: [{
          data: [65, 65, 80],
          type: 'bar',
          itemStyle: { color: '#409eff' }
        }]
      }
      chart.setOption(option)
    }

    // 快递公司分布
    if (companyDistributionChart.value) {
      const chart = echarts.init(companyDistributionChart.value)
      const option = {
        tooltip: { trigger: 'item' },
        series: [{
          type: 'pie',
          data: [
            { value: 35, name: '顺丰' },
            { value: 25, name: '圆通' },
            { value: 20, name: '中通' },
            { value: 15, name: '韵达' },
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

.stations-list {
  margin-bottom: 20px;
}

.charts-section {
  margin-bottom: 20px;
}

.chart-container {
  height: 250px;
}

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

<template>
  <div class="psychology-page">
    <div class="page-header">
      <h2>心理中心管理</h2>
      <div class="header-actions">
        <el-button v-if="isManageMode" type="primary" @click="handleAddCounselor">
          <el-icon><Plus /></el-icon>
          添加咨询师
        </el-button>
        <el-button type="success" plain @click="toggleMode">{{ isManageMode ? '返回可视化看板' : '管理详细数据' }}</el-button>
      </div>
    </div>

    <!-- 咨询师列表 -->
    <el-card v-if="isManageMode" class="counselors-list">
      <template #header>
        <span>咨询师列表</span>
      </template>
      <el-table :data="counselorList" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="specialty" label="专业领域" width="150" />
        <el-table-column prop="experience" label="工作经验" width="120" />
        <el-table-column prop="appointmentCount" label="今日预约" width="100" />
        <el-table-column prop="rating" label="评分" width="100">
          <template #default="{ row }">
            <el-rate v-model="row.rating" disabled show-score />
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === 'active' ? '在线' : '离线' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="handleEditCounselor(row)">编辑</el-button>
            <el-button size="small" type="primary" @click="handleManageSchedule(row)">排班管理</el-button>
            <el-button size="small" type="success" @click="handleManageAppointments(row)">预约管理</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 数据分析 -->
    <el-row v-if="!isManageMode" :gutter="20" class="charts-section">
      <el-col :span="8">
        <el-card class="glass-card">
          <template #header>
            <span>咨询量趋势</span>
          </template>
          <div ref="consultationTrendChart" class="chart-container"></div>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card class="glass-card">
          <template #header>
            <span>心理问题类型分布</span>
          </template>
          <div ref="problemTypeChart" class="chart-container"></div>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card class="glass-card">
          <template #header>
            <span>用户满意度</span>
          </template>
          <div ref="satisfactionChart" class="chart-container"></div>
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

// 咨询师列表
const counselorList = ref([
  {
    id: 1,
    name: '张心理师',
    specialty: '焦虑抑郁',
    experience: '5年',
    appointmentCount: 8,
    rating: 4.8,
    status: 'active'
  },
  {
    id: 2,
    name: '李心理师',
    specialty: '人际关系',
    experience: '3年',
    appointmentCount: 6,
    rating: 4.6,
    status: 'active'
  },
  {
    id: 3,
    name: '王心理师',
    specialty: '学习压力',
    experience: '7年',
    appointmentCount: 10,
    rating: 4.9,
    status: 'active'
  }
])

// 图表引用
const consultationTrendChart = ref<HTMLElement>()
const problemTypeChart = ref<HTMLElement>()
const satisfactionChart = ref<HTMLElement>()

// 添加咨询师
const handleAddCounselor = () => {
  ElMessage.info('添加咨询师功能待实现')
}

// 编辑咨询师
const handleEditCounselor = (row: any) => {
  ElMessage.info(`编辑咨询师: ${row.name}`)
}

// 排班管理
const handleManageSchedule = (row: any) => {
  ElMessage.info(`管理咨询师 ${row.name} 的排班`)
}

// 预约管理
const handleManageAppointments = (row: any) => {
  ElMessage.info(`管理咨询师 ${row.name} 的预约`)
}

// 初始化图表
const initCharts = () => {
  nextTick(() => {
    // 咨询量趋势
    if (consultationTrendChart.value) {
      const chart = echarts.init(consultationTrendChart.value)
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

    // 心理问题类型分布
    if (problemTypeChart.value) {
      const chart = echarts.init(problemTypeChart.value)
      const option = {
        tooltip: { trigger: 'item' },
        series: [{
          type: 'pie',
          data: [
            { value: 30, name: '学习压力' },
            { value: 25, name: '人际关系' },
            { value: 20, name: '焦虑抑郁' },
            { value: 15, name: '情感问题' },
            { value: 10, name: '其他' }
          ]
        }]
      }
      chart.setOption(option)
    }

    // 用户满意度
    if (satisfactionChart.value) {
      const chart = echarts.init(satisfactionChart.value)
      const option = {
        tooltip: { trigger: 'axis' },
        xAxis: {
          type: 'category',
          data: ['张心理师', '李心理师', '王心理师', '赵心理师', '钱心理师']
        },
        yAxis: { type: 'value' },
        series: [{
          data: [4.8, 4.6, 4.9, 4.7, 4.5],
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
.psychology-page {
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

.counselors-list {
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

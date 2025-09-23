<template>
  <div class="medical-page">
    <div class="page-header">
      <h2>医务室管理</h2>
      <el-button type="primary" @click="handleAddDepartment">
        <el-icon><Plus /></el-icon>
        添加科室
      </el-button>
    </div>

    <!-- 高级KPI指标卡片 -->
    <div class="kpi-section">
      <div class="kpi-card kpi-primary">
        <div class="kpi-value">{{ kpi.todayVisits }}</div>
        <div class="kpi-label">今日就诊</div>
        <div class="kpi-trend positive">+7.3%</div>
      </div>
      <div class="kpi-card kpi-success">
        <div class="kpi-value">{{ kpi.waitingPatients }}</div>
        <div class="kpi-label">候诊人数</div>
        <div class="kpi-trend neutral">--</div>
      </div>
      <div class="kpi-card kpi-warning">
        <div class="kpi-value">{{ kpi.avgWait }}min</div>
        <div class="kpi-label">平均等候时长</div>
        <div class="kpi-trend negative">-1.1%</div>
      </div>
      <div class="kpi-card kpi-info">
        <div class="kpi-value">{{ kpi.availableDoctors }}</div>
        <div class="kpi-label">在线医生</div>
        <div class="kpi-trend positive">+1</div>
      </div>
    </div>

    <!-- 科室列表 -->
    <el-card class="departments-list">
      <template #header>
        <span>科室列表</span>
      </template>
      <el-table :data="departmentList" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="deptName" label="科室名称" width="150" />
        <el-table-column prop="deptNumber" label="科室编号" width="120" />
        <el-table-column prop="location" label="位置" width="200" />
        <el-table-column prop="doctorCount" label="医生数量" width="100" />
        <el-table-column prop="appointmentCount" label="今日预约" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === 'active' ? '开放' : '暂停' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280">
          <template #default="{ row }">
            <div class="op-actions">
              <el-button size="small" @click="handleEditDepartment(row)">编辑</el-button>
              <el-button size="small" type="primary" @click="handleManageDoctors(row)">医生管理</el-button>
              <el-button size="small" type="success" @click="handleManageAppointments(row)">预约管理</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 数据分析 -->
    <el-row :gutter="20" class="charts-section">
      <el-col :span="8">
        <el-card>
          <template #header>
            <span>就诊量趋势</span>
          </template>
          <div ref="visitTrendChart" class="chart-container"></div>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card>
          <template #header>
            <span>科室分布</span>
          </template>
          <div ref="departmentDistributionChart" class="chart-container"></div>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card>
          <template #header>
            <span>医生工作量</span>
          </template>
          <div ref="doctorWorkloadChart" class="chart-container"></div>
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
  todayVisits: 156,
  waitingPatients: 23,
  avgWait: 11.5,
  availableDoctors: 6
})

// 科室列表
const departmentList = ref([
  {
    id: 1,
    deptName: '内科',
    deptNumber: 'MED001',
    location: '医务室1楼',
    doctorCount: 3,
    appointmentCount: 25,
    status: 'active'
  },
  {
    id: 2,
    deptName: '外科',
    deptNumber: 'SUR001',
    location: '医务室1楼',
    doctorCount: 2,
    appointmentCount: 18,
    status: 'active'
  },
  {
    id: 3,
    deptName: '眼科',
    deptNumber: 'EYE001',
    location: '医务室2楼',
    doctorCount: 1,
    appointmentCount: 12,
    status: 'active'
  }
])

// 图表引用
const visitTrendChart = ref<HTMLElement>()
const departmentDistributionChart = ref<HTMLElement>()
const doctorWorkloadChart = ref<HTMLElement>()

// 添加科室
const handleAddDepartment = () => {
  ElMessage.info('添加科室功能待实现')
}

// 编辑科室
const handleEditDepartment = (row: any) => {
  ElMessage.info(`编辑科室: ${row.deptName}`)
}

// 医生管理
const handleManageDoctors = (row: any) => {
  ElMessage.info(`管理科室 ${row.deptName} 的医生`)
}

// 预约管理
const handleManageAppointments = (row: any) => {
  ElMessage.info(`管理科室 ${row.deptName} 的预约`)
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

    // 就诊量趋势（平滑折线+渐变面积）
    if (visitTrendChart.value) {
      const chart = echarts.init(visitTrendChart.value)
      const option: any = {
        tooltip: { trigger: 'axis' },
        grid,
        xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月'], ...axisStyle },
        yAxis: { type: 'value', ...axisStyle },
        series: [{
          data: [120, 150, 180, 160, 200, 220],
          type: 'line', smooth: true,
          symbol: 'circle', symbolSize: 6,
          lineStyle: { width: 3, color: palette[0] },
          itemStyle: { color: '#fff', borderColor: palette[0], borderWidth: 2 },
          areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(79,140,255,0.28)' }, { offset: 1, color: 'rgba(79,140,255,0.06)' }] } }
        }]
      }
      chart.setOption(option)
    }

    // 科室分布（圆环+白描边+高亮阴影）
    if (departmentDistributionChart.value) {
      const chart = echarts.init(departmentDistributionChart.value)
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
            { value: 35, name: '内科', itemStyle: { color: palette[0] } },
            { value: 25, name: '外科', itemStyle: { color: palette[1] } },
            { value: 20, name: '眼科', itemStyle: { color: palette[2] } },
            { value: 15, name: '耳鼻喉科', itemStyle: { color: palette[3] } },
            { value: 5, name: '其他', itemStyle: { color: palette[4] } }
          ]
        }]
      }
      chart.setOption(option)
    }

    // 医生工作量（横向圆角渐变柱）
    if (doctorWorkloadChart.value) {
      const chart = echarts.init(doctorWorkloadChart.value)
      const option: any = {
        tooltip: { trigger: 'axis' },
        grid,
        xAxis: { type: 'value', ...axisStyle },
        yAxis: { type: 'category', data: ['张医生', '李医生', '王医生', '赵医生', '钱医生'], ...axisStyle },
        series: [{
          data: [25, 30, 20, 35, 28],
          type: 'bar', barWidth: 16,
          itemStyle: { borderRadius: [0, 10, 10, 0], color: { type: 'linear', x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: palette[0] }, { offset: 1, color: 'rgba(79,140,255,0.35)' }] } }
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
.medical-page {
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
.kpi-trend.positive { color: #eaffc0; background: rgba(0,0,0,0.15); }
.kpi-trend.negative { color: #ffe8e6; background: rgba(0,0,0,0.18); }
.kpi-trend.neutral { color: #fff; background: rgba(0,0,0,0.12); }

.departments-list {
  margin-bottom: 20px;
}

.charts-section {
  margin-bottom: 20px;
}

.chart-container {
  height: 250px;
}

/* 操作列样式：按钮不换行 */
.op-actions { display: inline-flex; gap: 8px; align-items: center; white-space: nowrap; }

/* 玻璃拟态卡片样式，与全局风格保持一致 */
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

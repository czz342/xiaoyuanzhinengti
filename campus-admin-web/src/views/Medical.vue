<template>
  <div class="medical-page">
    <div class="page-header">
      <h2>医务室管理</h2>
      <el-button type="primary" @click="handleAddDepartment">
        <el-icon><Plus /></el-icon>
        添加科室
      </el-button>
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
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="handleEditDepartment(row)">编辑</el-button>
            <el-button size="small" type="primary" @click="handleManageDoctors(row)">医生管理</el-button>
            <el-button size="small" type="success" @click="handleManageAppointments(row)">预约管理</el-button>
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
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import * as echarts from 'echarts'

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
    // 就诊量趋势
    if (visitTrendChart.value) {
      const chart = echarts.init(visitTrendChart.value)
      const option = {
        tooltip: { trigger: 'axis' },
        xAxis: {
          type: 'category',
          data: ['1月', '2月', '3月', '4月', '5月', '6月']
        },
        yAxis: { type: 'value' },
        series: [{
          data: [120, 150, 180, 160, 200, 220],
          type: 'line',
          smooth: true,
          areaStyle: {}
        }]
      }
      chart.setOption(option)
    }

    // 科室分布
    if (departmentDistributionChart.value) {
      const chart = echarts.init(departmentDistributionChart.value)
      const option = {
        tooltip: { trigger: 'item' },
        series: [{
          type: 'pie',
          data: [
            { value: 35, name: '内科' },
            { value: 25, name: '外科' },
            { value: 20, name: '眼科' },
            { value: 15, name: '耳鼻喉科' },
            { value: 5, name: '其他' }
          ]
        }]
      }
      chart.setOption(option)
    }

    // 医生工作量
    if (doctorWorkloadChart.value) {
      const chart = echarts.init(doctorWorkloadChart.value)
      const option = {
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'value' },
        yAxis: {
          type: 'category',
          data: ['张医生', '李医生', '王医生', '赵医生', '钱医生']
        },
        series: [{
          data: [25, 30, 20, 35, 28],
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

.departments-list {
  margin-bottom: 20px;
}

.charts-section {
  margin-bottom: 20px;
}

.chart-container {
  height: 250px;
}
</style>

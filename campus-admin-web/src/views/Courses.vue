<template>
  <div class="courses-page">
    <div class="page-header">
      <h2>课程管理</h2>
      <el-button type="primary" @click="handleAddCourse">
        <el-icon><Plus /></el-icon>
        添加课程
      </el-button>
    </div>

    <!-- 课程列表 -->
    <el-card class="courses-list">
      <template #header>
        <span>课程列表</span>
      </template>
      <el-table :data="courseList" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="courseCode" label="课程代码" width="120" />
        <el-table-column prop="courseName" label="课程名称" width="200" />
        <el-table-column prop="credits" label="学分" width="80" />
        <el-table-column prop="courseType" label="类型" width="100" />
        <el-table-column prop="department" label="院系" width="120" />
        <el-table-column prop="teacher" label="任课教师" width="120" />
        <el-table-column prop="studentCount" label="选课人数" width="100" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="handleEditCourse(row)">编辑</el-button>
            <el-button size="small" type="primary" @click="handleManageSchedule(row)">课表管理</el-button>
            <el-button size="small" type="danger" @click="handleDeleteCourse(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 数据分析 -->
    <el-row :gutter="20" class="charts-section">
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>课程分布统计</span>
          </template>
          <div ref="courseDistributionChart" class="chart-container"></div>
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>选课人数趋势</span>
          </template>
          <div ref="enrollmentTrendChart" class="chart-container"></div>
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

// 课程列表
const courseList = ref([
  {
    id: 1,
    courseCode: 'CS101',
    courseName: '计算机基础',
    credits: 3,
    courseType: '必修',
    department: '计算机学院',
    teacher: '张教授',
    studentCount: 120
  },
  {
    id: 2,
    courseCode: 'CS102',
    courseName: '数据结构',
    credits: 4,
    courseType: '必修',
    department: '计算机学院',
    teacher: '李教授',
    studentCount: 95
  },
  {
    id: 3,
    courseCode: 'CS201',
    courseName: 'Web开发',
    credits: 3,
    courseType: '选修',
    department: '计算机学院',
    teacher: '王教授',
    studentCount: 80
  }
])

// 图表引用
const courseDistributionChart = ref<HTMLElement>()
const enrollmentTrendChart = ref<HTMLElement>()

// 添加课程
const handleAddCourse = () => {
  ElMessage.info('添加课程功能待实现')
}

// 编辑课程
const handleEditCourse = (row: any) => {
  ElMessage.info(`编辑课程: ${row.courseName}`)
}

// 课表管理
const handleManageSchedule = (row: any) => {
  ElMessage.info(`管理课程 ${row.courseName} 的课表`)
}

// 删除课程
const handleDeleteCourse = (row: any) => {
  ElMessage.info(`删除课程: ${row.courseName}`)
}

// 初始化图表
const initCharts = () => {
  nextTick(() => {
    // 课程分布统计
    if (courseDistributionChart.value) {
      const chart = echarts.init(courseDistributionChart.value)
      const option = {
        tooltip: { trigger: 'item' },
        series: [{
          type: 'pie',
          data: [
            { value: 45, name: '计算机学院' },
            { value: 30, name: '数学学院' },
            { value: 15, name: '物理学院' },
            { value: 10, name: '其他' }
          ]
        }]
      }
      chart.setOption(option)
    }

    // 选课人数趋势
    if (enrollmentTrendChart.value) {
      const chart = echarts.init(enrollmentTrendChart.value)
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
  })
}

onMounted(() => {
  initCharts()
})
</script>

<style scoped>
.courses-page {
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

.courses-list {
  margin-bottom: 20px;
}

.charts-section {
  margin-bottom: 20px;
}

.chart-container {
  height: 300px;
}
</style>

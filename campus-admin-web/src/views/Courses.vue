<template>
  <div class="courses-page">
    <div class="page-header">
      <h2>课程管理</h2>
      <div class="header-actions">
        <el-button v-if="isManageMode" type="primary" @click="handleAddCourse">
          <el-icon><Plus /></el-icon>
          添加课程
        </el-button>
        <el-button v-if="isManageMode" type="success" @click="handleAddToSchedule">
          <el-icon><Calendar /></el-icon>
          添加到课程表
        </el-button>
        <el-button type="success" plain @click="toggleMode">{{ isManageMode ? '返回可视化看板' : '管理详细数据' }}</el-button>
      </div>
    </div>


    <!-- 顶部KPI概览（看板模式） -->
    <el-row v-if="!isManageMode" :gutter="20" class="kpi-section">
      <el-col :span="6">
        <div class="kpi-card kpi-primary">
          <div class="kpi-meta">
            <div class="kpi-title">总课程</div>
            <div class="kpi-sub">Total Courses</div>
          </div>
          <div class="kpi-value">{{ kpi.totalCourses }}</div>
          <div class="kpi-delta">较上月 +{{ kpiDelta.totalCourses }}%</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="kpi-card kpi-success">
          <div class="kpi-meta">
            <div class="kpi-title">选课总人数</div>
            <div class="kpi-sub">Total Enrollment</div>
          </div>
          <div class="kpi-value">{{ kpi.totalEnrollment }}</div>
          <div class="kpi-delta">较上月 +{{ kpiDelta.totalEnrollment }}%</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="kpi-card kpi-warning">
          <div class="kpi-meta">
            <div class="kpi-title">本周课时</div>
            <div class="kpi-sub">Weekly Hours</div>
          </div>
          <div class="kpi-value">{{ kpi.weeklyHours }}</div>
          <div class="kpi-delta">工作日(周一-周五)</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="kpi-card kpi-info">
          <div class="kpi-meta">
            <div class="kpi-title">冲突预警</div>
            <div class="kpi-sub">Conflict Alerts</div>
          </div>
          <div class="kpi-value">{{ kpi.conflictAlerts }}</div>
          <div class="kpi-delta">建议检查排课与教室</div>
        </div>
      </el-col>
    </el-row>

    <!-- 搜索筛选 -->
    <el-card class="search-card" v-if="isManageMode">
      <el-form :model="searchForm" inline>
        <el-form-item label="用户">
          <el-select v-model="searchForm.userId" placeholder="选择用户" clearable filterable>
            <el-option
              v-for="user in userList"
              :key="user.id"
              :label="`${user.userName} (${user.studentId})`"
              :value="user.userId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="学期">
          <el-select v-model="searchForm.semester" placeholder="选择学期" clearable>
            <el-option label="2024春季" value="2024-1" />
            <el-option label="2024秋季" value="2024-2" />
            <el-option label="2025春季" value="2025-1" />
          </el-select>
        </el-form-item>
        <el-form-item label="学年">
          <el-select v-model="searchForm.academicYear" placeholder="选择学年" clearable>
            <el-option label="2023-2024" value="2023-2024" />
            <el-option label="2024-2025" value="2024-2025" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 课程表列表 -->
    <el-card class="schedule-list" v-if="isManageMode">
      <template #header>
        <span>个人课程表</span>
      </template>
      <el-table :data="scheduleList" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="courseCode" label="课程代码" width="120" />
        <el-table-column prop="courseName" label="课程名称" width="200" />
        <el-table-column prop="teacher" label="任课教师" width="120" />
        <el-table-column prop="classroom" label="教室" width="120" />
        <el-table-column prop="dayOfWeek" label="星期" width="80">
          <template #default="{ row }">
            {{ getDayOfWeekText(row.dayOfWeek) }}
          </template>
        </el-table-column>
        <el-table-column prop="startTime" label="开始时间" width="100" />
        <el-table-column prop="endTime" label="结束时间" width="100" />
        <el-table-column prop="semester" label="学期" width="100" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="handleEditSchedule(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDeleteSchedule(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 课程表日历视图（移至管理页） -->
    <el-card class="calendar-view glass-card" v-if="isManageMode">
      <template #header>
        <span>课程表日历</span>
      </template>
      <div class="calendar-container">
        <div class="calendar-header">
          <el-button @click="prevWeek">上一周</el-button>
          <span class="week-title">{{ currentWeekTitle }}</span>
          <el-button @click="nextWeek">下一周</el-button>
        </div>
        <div class="calendar-grid">
          <div class="calendar-day" v-for="day in weekDays" :key="day.date">
            <div class="day-header">
              <div class="day-name">{{ day.name }}</div>
              <div class="day-date">{{ day.date }}</div>
            </div>
            <div class="day-schedules">
              <div
                v-for="schedule in day.schedules"
                :key="schedule.id"
                class="schedule-item"
                :style="{ backgroundColor: getScheduleColor(schedule.courseCode) }"
              >
                <div class="schedule-time">{{ schedule.startTime }}-{{ schedule.endTime }}</div>
                <div class="schedule-course">{{ schedule.courseName }}</div>
                <div class="schedule-teacher">{{ schedule.teacher }}</div>
                <div class="schedule-classroom">{{ schedule.classroom }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 数据分析：看板模式 -->
    <el-row v-if="!isManageMode" :gutter="20" class="charts-section">
      <el-col :span="12">
        <el-card class="glass-card">
          <template #header>
            <span>课程分布统计</span>
          </template>
          <div ref="courseDistributionChart" class="chart-container"></div>
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-card class="glass-card">
          <template #header>
            <span>选课人数趋势</span>
          </template>
          <div ref="enrollmentTrendChart" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 高阶图：热力图 + 雷达图 -->
    <el-row v-if="!isManageMode" :gutter="20" class="charts-section">
      <el-col :span="12">
        <el-card class="glass-card">
          <template #header>
            <span>时间段占用热力图</span>
          </template>
          <div ref="courseHeatmapChart" class="chart-container tall"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="glass-card">
          <template #header>
            <span>学院教学负载雷达</span>
          </template>
          <div ref="deptRadarChart" class="chart-container tall"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Calendar } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import { getPersonalSchedule, getAllSchedules, addToSchedule, updateSchedule, removeFromSchedule } from '@/api/course'
import { getUserList } from '@/api/user'
import type { PersonalSchedule, User } from '@/types/api'

// KPI 假数据（看板样式展示）
const kpi = reactive({
  totalCourses: 356,
  totalEnrollment: 12840,
  weeklyHours: 168,
  conflictAlerts: 7
})
const kpiDelta = reactive({
  totalCourses: 8.6,
  totalEnrollment: 5.2
})

// 搜索表单
const searchForm = reactive({
  userId: '',
  semester: '',
  academicYear: ''
})

// 用户列表
const userList = ref<User[]>([])

// 课程表列表
const scheduleList = ref<PersonalSchedule[]>([])
const loading = ref(false)

// 当前周
const currentWeek = ref(new Date())

// 图表引用
const courseDistributionChart = ref<HTMLElement>()
const enrollmentTrendChart = ref<HTMLElement>()
const courseHeatmapChart = ref<HTMLElement>()
const deptRadarChart = ref<HTMLElement>()
// 页面模式：默认展示看板
const isManageMode = ref(false)
const toggleMode = () => { isManageMode.value = !isManageMode.value }

// 计算属性
const currentWeekTitle = computed(() => {
  const start = new Date(currentWeek.value)
  start.setDate(start.getDate() - start.getDay() + 1)
  const end = new Date(start)
  // 仅显示工作日，结束日为周五
  end.setDate(end.getDate() + 4)
  
  return `${start.getMonth() + 1}/${start.getDate()} - ${end.getMonth() + 1}/${end.getDate()}`
})

const weekDays = computed(() => {
  const start = new Date(currentWeek.value)
  start.setDate(start.getDate() - start.getDay() + 1)
  
  const days = []
  // 仅显示工作日
  const dayNames = ['周一', '周二', '周三', '周四', '周五']
  
  for (let i = 0; i < 5; i++) {
    const day = new Date(start)
    day.setDate(start.getDate() + i)
    
    const daySchedules = scheduleList.value.filter(schedule => 
      schedule.dayOfWeek === i + 1
    )
    
    days.push({
      name: dayNames[i],
      date: `${day.getMonth() + 1}/${day.getDate()}`,
      schedules: daySchedules
    })
  }
  
  return days
})

// 获取星期文本
const getDayOfWeekText = (dayOfWeek: number) => {
  const dayNames = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  return dayNames[dayOfWeek - 1] || '未知'
}

// 获取课程颜色
const getScheduleColor = (courseCode: string) => {
  const colors = [
    '#409eff', '#67c23a', '#e6a23c', '#f56c6c', '#909399',
    '#9c27b0', '#ff9800', '#4caf50', '#2196f3', '#f44336'
  ]
  const index = courseCode.charCodeAt(0) % colors.length
  return colors[index]
}

// 搜索
const handleSearch = async () => {
  loading.value = true
  try {
    if (searchForm.userId) {
      const response = await getPersonalSchedule(searchForm.userId, {
        semester: searchForm.semester,
        academicYear: searchForm.academicYear
      })
      scheduleList.value = response.data
    } else {
      const response = await getAllSchedules({
        semester: searchForm.semester,
        academicYear: searchForm.academicYear
      })
      scheduleList.value = response.data.list
    }
  } catch (error) {
    ElMessage.error('获取课程表失败')
  } finally {
    loading.value = false
  }
}

// 重置
const handleReset = () => {
  Object.assign(searchForm, {
    userId: '',
    semester: '',
    academicYear: ''
  })
  handleSearch()
}

// 添加课程
const handleAddCourse = () => {
  ElMessage.info('添加课程功能待实现')
}

// 添加到课程表
const handleAddToSchedule = () => {
  ElMessage.info('添加到课程表功能待实现')
}

// 编辑课程表
const handleEditSchedule = (row: PersonalSchedule) => {
  ElMessage.info(`编辑课程表: ${row.courseName}`)
}

// 删除课程表
const handleDeleteSchedule = (row: PersonalSchedule) => {
  ElMessage.confirm(
    `确定要删除课程 ${row.courseName} 吗？`,
    '确认删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      await removeFromSchedule(row.id)
      ElMessage.success('删除成功')
      handleSearch()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  })
}

// 上一周
const prevWeek = () => {
  const newWeek = new Date(currentWeek.value)
  newWeek.setDate(newWeek.getDate() - 7)
  currentWeek.value = newWeek
}

// 下一周
const nextWeek = () => {
  const newWeek = new Date(currentWeek.value)
  newWeek.setDate(newWeek.getDate() + 7)
  currentWeek.value = newWeek
}

// 初始化图表
const initCharts = () => {
  nextTick(() => {
    // 课程分布统计（参考用户状态分布图样式）
    if (courseDistributionChart.value) {
      const chart = echarts.init(courseDistributionChart.value)
      const option = {
        tooltip: { trigger: 'item' },
        legend: {
          top: 8,
          textStyle: { color: '#333' }
        },
        series: [{
          type: 'pie',
          radius: ['36%','62%'],
          center: ['50%','55%'],
          avoidLabelOverlap: true,
          label: {
            show: true,
            color: '#333',
            formatter: '{name|{b}}\n{value|{c}} ({d}%)',
            rich: {
              name: { fontSize: 12, lineHeight: 16, color: '#333' },
              value: { fontSize: 14, fontWeight: 600, lineHeight: 18, color: '#111' }
            }
          },
          labelLine: { show: true, length: 12, length2: 10, lineStyle: { color: 'rgba(0,0,0,0.25)' } },
          itemStyle: {
            borderRadius: 6,
            borderColor: '#fff',
            borderWidth: 2
          },
          data: [
            { value: 45, name: '计算机学院' },
            { value: 30, name: '数学学院' },
            { value: 15, name: '物理学院' },
            { value: 10, name: '其他' }
          ]
        }],
        color: ['#4f8cff','#67c23a','#e6a23c','#909399']
      }
      chart.setOption(option)
    }

    // 选课人数趋势（参考用户增长趋势图样式）
    if (enrollmentTrendChart.value) {
      const chart = echarts.init(enrollmentTrendChart.value)
      const option = {
        tooltip: { trigger: 'axis' },
        grid: { left: 40, right: 16, bottom: 24, top: 18 },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['1月', '2月', '3月', '4月', '5月', '6月'],
          axisLine: { lineStyle: { color: 'rgba(0,0,0,0.25)' } },
          axisLabel: { color: '#666' },
          axisTick: { show: false }
        },
        yAxis: {
          type: 'value',
          axisLine: { show: false },
          splitLine: { lineStyle: { color: 'rgba(0,0,0,0.08)' } },
          axisLabel: { color: '#666' }
        },
        series: [{
          data: [1200, 1500, 1800, 1600, 2000, 2200],
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 8,
          lineStyle: { width: 3, color: '#4f8cff' },
          itemStyle: { color: '#4f8cff' },
          areaStyle: {
            color: new (echarts as any).graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(79,140,255,0.35)' },
              { offset: 1, color: 'rgba(79,140,255,0.05)' }
            ])
          }
        }]
      }
      chart.setOption(option)
    }

    // 时间段占用热力图（工作日 x 节次）
    if (courseHeatmapChart.value) {
      const chart = echarts.init(courseHeatmapChart.value)
      const hours = ['第1节','第2节','第3节','第4节','第5节','第6节','第7节','第8节','第9节','第10节']
      const days = ['周一','周二','周三','周四','周五']
      const data: number[][] = []
      for (let i = 0; i < days.length; i++) {
        for (let j = 0; j < hours.length; j++) {
          // 生成更有层次的示例数据
          const base = 10 + i * 5 + Math.round(Math.random() * 8)
          const peakBonus = (j === 2 || j === 3 || j === 6) ? 12 : 0
          data.push([j, i, base + peakBonus])
        }
      }
      const maxVal = Math.max(...data.map(d => d[2]))
      const option = {
        tooltip: {
          formatter: (p: any) => `${days[p.value[1]]} ${hours[p.value[0]]}<br/>占用量：${p.value[2]}`
        },
        grid: { top: 24, left: 60, right: 20, bottom: 50, containLabel: true },
        xAxis: { type: 'category', data: hours, splitArea: { show: true }, axisLabel: { color: '#666' } },
        yAxis: { type: 'category', data: days, splitArea: { show: true }, axisLabel: { color: '#666' } },
        visualMap: {
          min: 0,
          max: Math.max(40, maxVal),
          calculable: true,
          orient: 'horizontal',
          left: 'center',
          bottom: 6,
          inRange: { color: ['#e0f3ff','#a9caff','#4f8cff'] }
        },
        series: [{
          name: '占用量',
          type: 'heatmap',
          data: data,
          progressive: 2000,
          label: { show: false },
          emphasis: { itemStyle: { shadowBlur: 12, shadowColor: 'rgba(0,0,0,0.35)' } }
        }]
      }
      chart.setOption(option)
    }

    // 学院教学负载雷达
    if (deptRadarChart.value) {
      const chart = echarts.init(deptRadarChart.value)
      const option = {
        tooltip: {},
        legend: { top: 8, data: ['课程数量','选课人数'] },
        radar: {
          indicator: [
            { name: '计算机', max: 100 },
            { name: '数学', max: 100 },
            { name: '物理', max: 100 },
            { name: '化学', max: 100 },
            { name: '外语', max: 100 }
          ],
          radius: '62%',
          splitNumber: 5,
          splitArea: { areaStyle: { color: ['#f9fbff','#f3f7ff'] } },
          splitLine: { lineStyle: { color: 'rgba(79,140,255,0.35)' } },
          axisLine: { lineStyle: { color: 'rgba(79,140,255,0.35)' } }
        },
        series: [{
          type: 'radar',
          areaStyle: { opacity: 0.18 },
          lineStyle: { width: 2 },
          symbol: 'circle',
          symbolSize: 6,
          data: [
            { value: [85, 70, 60, 55, 65], name: '课程数量', itemStyle: { color: '#4f8cff' } },
            { value: [78, 62, 68, 50, 72], name: '选课人数', itemStyle: { color: '#67c23a' } }
          ]
        }]
      }
      chart.setOption(option)
    }
  })
}

onMounted(async () => {
  initCharts()
  
  // 加载用户列表
  try {
    const userResponse = await getUserList({ limit: 1000 })
    userList.value = userResponse.data.list
  } catch (error) {
    console.error('加载用户列表失败:', error)
  }
  
  // 初始加载课程表
  await handleSearch()
})

// 切回看板时重建图表
watch(isManageMode, (val) => {
  if (!val) {
    nextTick(() => initCharts())
  }
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

.header-actions {
  display: flex;
  gap: 10px;
}

.search-card {
  margin-bottom: 20px;
}

.schedule-list {
  margin-bottom: 20px;
}

.calendar-view {
  margin-bottom: 20px;
}

.calendar-container {
  padding: 20px;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.week-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
}

.calendar-day {
  border: 1px solid #e6e6e6;
  border-radius: 8px;
  min-height: 200px;
}

.day-header {
  background: #f5f5f5;
  padding: 10px;
  text-align: center;
  border-bottom: 1px solid #e6e6e6;
}

.day-name {
  font-weight: bold;
  color: #333;
}

.day-date {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

.day-schedules {
  padding: 10px;
  min-height: 150px;
}

.schedule-item {
  background: #409eff;
  color: white;
  padding: 8px;
  margin-bottom: 8px;
  border-radius: 4px;
  font-size: 12px;
}

.schedule-time {
  font-weight: bold;
  margin-bottom: 4px;
}

.schedule-course {
  font-weight: bold;
  margin-bottom: 2px;
}

.schedule-teacher {
  font-size: 11px;
  opacity: 0.9;
}

.schedule-classroom {
  font-size: 11px;
  opacity: 0.9;
}

.charts-section {
  margin-bottom: 20px;
}

.chart-container {
  height: 300px;
}

.chart-container.tall {
  height: 360px;
}

/* 高级感样式增强 */
.glass-card {
  border-radius: 14px;
  overflow: hidden;
}
.glass-card :deep(.el-card__header) {
  font-weight: 600;
}
.glass-card :deep(.el-card__body) {
  padding: 16px 16px 8px 16px;
}

/* 玻璃拟态 */
.glass-card :deep(.el-card__body) {
  backdrop-filter: saturate(180%) blur(8px);
}
.glass-card {
  background: rgba(255,255,255,0.6);
  border: none;
  box-shadow: 0 8px 30px rgba(31, 38, 135, 0.08);
}
.glass-card :deep(.el-card__header) {
  background: transparent;
  border-bottom: 1px solid rgba(255,255,255,0.4);
}

/* 背景与KPI样式 */
/* 背景已移除 */

.kpi-section {
  margin-bottom: 16px;
}
/* KPI 风格（与 Users.vue 统一） */
.kpi-card { position: relative; border-radius: 14px; padding: 18px 20px; color: #fff; box-shadow: 0 10px 24px rgba(0,0,0,0.08); overflow: hidden; }
.kpi-card::after { content: ''; position: absolute; right: -30px; top: -30px; width: 120px; height: 120px; background: rgba(255,255,255,0.15); border-radius: 50%; filter: blur(2px); }
.kpi-meta { opacity: .9; }
.kpi-title { font-size: 14px; letter-spacing: .5px; }
.kpi-sub { font-size: 12px; opacity: .8; }
.kpi-value { font-size: 28px; font-weight: 700; margin-top: 6px; }
.kpi-delta { font-size: 12px; margin-top: 4px; opacity: .85; }
.kpi-primary { background: linear-gradient(135deg, #4f8cff 0%, #6cc1ff 100%); }
.kpi-success { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
.kpi-warning { background: linear-gradient(135deg, #f6d365 0%, #fda085 100%); }
.kpi-info { background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%); }
</style>

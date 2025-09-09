<template>
  <div class="studyrooms-page">
    <div class="page-header">
      <h2>自习室管理</h2>
      <div class="header-actions">
        <el-button v-if="isManageMode" type="primary" @click="handleAddRoom">
          <el-icon><Plus /></el-icon>
          添加自习室
        </el-button>
        <el-button v-if="isManageMode" :type="is3DView ? 'primary' : 'default'" @click="is3DView = !is3DView">
          {{ is3DView ? '列表视图' : '三维视图' }}
        </el-button>
        <el-button type="success" plain @click="toggleMode">{{ isManageMode ? '返回可视化看板' : '管理详细数据' }}</el-button>
      </div>
    </div>

    <!-- 三维视图 -->
    <el-card v-if="isManageMode && is3DView" class="rooms-3d">
      <template #header>
        <div class="chart-header">
          <span>自习室三维视图</span>
          <div class="legend">
            <div class="legend-item">
              <span class="legend-color" style="background: #2ed573;"></span>
              <span>可用</span>
            </div>
            <div class="legend-item">
              <span class="legend-color" style="background: #ffa502;"></span>
              <span>已预约</span>
            </div>
            <div class="legend-item">
              <span class="legend-color" style="background: #ff4757;"></span>
              <span>已占用</span>
            </div>
          </div>
        </div>
      </template>
      <div ref="chart3DRef" class="chart-3d-container"></div>
    </el-card>

    <!-- 自习室列表 -->
    <el-card v-if="isManageMode && !is3DView" class="rooms-list">
      <template #header>
        <span>自习室列表</span>
      </template>
      <el-table :data="studyRoomList" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="自习室名称" width="150" />
        <el-table-column prop="location" label="位置" width="200" />
        <el-table-column prop="totalSeats" label="总座位数" width="100" />
        <el-table-column prop="availableSeats" label="可用座位" width="100" />
        <el-table-column prop="occupancyRate" label="占用率" width="100">
          <template #default="{ row }">
            <el-progress
              :percentage="row.occupancyRate"
              :color="getOccupancyColor(row.occupancyRate)"
              :stroke-width="6"
            />
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === 'active' ? '开放' : '维护中' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="handleEditRoom(row)">编辑</el-button>
            <el-button size="small" type="primary" @click="handleManageSeats(row)">座位管理</el-button>
            <el-button size="small" type="danger" @click="handleDeleteRoom(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- KPI 指标卡片 -->
    <el-row v-if="!isManageMode" :gutter="20" class="kpi-section">
      <el-col :span="6">
        <div class="kpi-card kpi-card-1">
          <div class="kpi-icon">
            <el-icon size="32"><School /></el-icon>
          </div>
          <div class="kpi-content">
            <div class="kpi-value">{{ totalRooms }}</div>
            <div class="kpi-label">自习室总数</div>
            <div class="kpi-trend">
              <el-icon><TrendCharts /></el-icon>
              <span>+2 本月</span>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="kpi-card kpi-card-2">
          <div class="kpi-icon">
            <el-icon size="32"><User /></el-icon>
          </div>
          <div class="kpi-content">
            <div class="kpi-value">{{ totalSeats }}</div>
            <div class="kpi-label">总座位数</div>
            <div class="kpi-trend">
              <el-icon><TrendCharts /></el-icon>
              <span>+15 本周</span>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="kpi-card kpi-card-3">
          <div class="kpi-icon">
            <el-icon size="32"><DataAnalysis /></el-icon>
          </div>
          <div class="kpi-content">
            <div class="kpi-value">{{ averageOccupancy }}%</div>
            <div class="kpi-label">平均占用率</div>
            <div class="kpi-trend">
              <el-icon><TrendCharts /></el-icon>
              <span>+5.2% 今日</span>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="kpi-card kpi-card-4">
          <div class="kpi-icon">
            <el-icon size="32"><Clock /></el-icon>
          </div>
          <div class="kpi-content">
            <div class="kpi-value">{{ peakHours }}</div>
            <div class="kpi-label">高峰时段</div>
            <div class="kpi-trend">
              <el-icon><TrendCharts /></el-icon>
              <span>14:00-16:00</span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 实时座位占用率热力图 -->
    <el-card v-if="!isManageMode" class="occupancy-section glass-card">
      <template #header>
        <div class="card-header">
          <span>实时座位占用率热力图</span>
          <el-tag type="success" effect="dark">实时更新</el-tag>
        </div>
      </template>
      <div class="heatmap-container">
        <div class="heatmap-legend">
          <div class="legend-item">
            <span class="legend-color" style="background: #2ed573;"></span>
            <span>空闲 (0-30%)</span>
          </div>
          <div class="legend-item">
            <span class="legend-color" style="background: #ffa502;"></span>
            <span>适中 (30-70%)</span>
          </div>
          <div class="legend-item">
            <span class="legend-color" style="background: #ff4757;"></span>
            <span>拥挤 (70-100%)</span>
          </div>
        </div>
        <div class="occupancy-grid">
          <div
            v-for="room in realtimeOccupancy"
            :key="room.id"
            class="room-card"
          >
            <div class="room-header">
              <span class="room-name">{{ room.name }}</span>
              <span class="room-rate">{{ room.occupancyRate }}%</span>
            </div>
            <el-progress
              :percentage="room.occupancyRate"
              :color="getOccupancyColor(room.occupancyRate)"
              :stroke-width="8"
            />
            <div class="room-details">
              <span>已占用: {{ room.occupied }}</span>
              <span>总座位: {{ room.total }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 高级图表分析 -->
    <el-row v-if="!isManageMode" :gutter="20" class="charts-section">
      <el-col :span="8">
        <el-card class="glass-card chart-card">
          <template #header>
            <div class="card-header">
              <span>预约时段分析</span>
              <el-icon><DataAnalysis /></el-icon>
            </div>
          </template>
          <div ref="timeAnalysisChart" class="chart-container"></div>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card class="glass-card chart-card">
          <template #header>
            <div class="card-header">
              <span>高峰时段识别</span>
              <el-icon><TrendCharts /></el-icon>
            </div>
          </template>
          <div ref="peakTimeChart" class="chart-container"></div>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card class="glass-card chart-card">
          <template #header>
            <div class="card-header">
              <span>座位类型偏好</span>
              <el-icon><PieChart /></el-icon>
            </div>
          </template>
          <div ref="seatTypeChart" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 深度分析图表 -->
    <el-row v-if="!isManageMode" :gutter="20" class="charts-section">
      <el-col :span="12">
        <el-card class="glass-card chart-card">
          <template #header>
            <div class="card-header">
              <span>用户行为分析</span>
              <el-icon><User /></el-icon>
            </div>
          </template>
          <div ref="userPreferenceChart" class="chart-container"></div>
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-card class="glass-card chart-card">
          <template #header>
            <div class="card-header">
              <span>自习室使用趋势</span>
              <el-icon><TrendCharts /></el-icon>
            </div>
          </template>
          <div ref="usageTrendChart" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 实时监控面板 -->
    <el-row v-if="!isManageMode" :gutter="20" class="charts-section">
      <el-col :span="24">
        <el-card class="glass-card chart-card">
          <template #header>
            <div class="card-header">
              <span>实时监控面板</span>
              <el-tag type="warning" effect="dark">实时数据</el-tag>
            </div>
          </template>
          <div ref="realtimeMonitorChart" class="chart-container-large"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
  
  <!-- 座位与预约抽屉 -->
  <el-drawer v-model="seatDrawer" :title="currentRoom ? `座位与预约 - ${currentRoom.name}` : '座位与预约'" direction="rtl" size="50%">
    <div class="drawer-content">
      <el-row :gutter="16">
        <el-col :span="12">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>座位列表</span>
              </div>
            </template>
            <el-table :data="seats" height="300">
              <el-table-column prop="id" label="ID" width="70" />
              <el-table-column prop="label" label="座位" />
              <el-table-column prop="status" label="状态" width="100">
                <template #default="{ row }">
                  <el-tag :type="row.status === 'available' ? 'success' : 'warning'">{{ row.status === 'available' ? '可用' : '占用/维护' }}</el-tag>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>当日预约</span>
                <el-date-picker v-model="bookingDate" type="date" value-format="YYYY-MM-DD" @change="reloadBookings" size="small" />
              </div>
            </template>
            <el-table :data="bookings" height="240">
              <el-table-column prop="id" label="ID" width="70" />
              <el-table-column prop="seat_id" label="座位ID" width="80" />
              <el-table-column prop="booking_date" label="日期" width="110" />
              <el-table-column label="时间" width="140">
                <template #default="{ row }">{{ secToTime(row.start_time_sec) }} - {{ secToTime(row.end_time_sec) }}</template>
              </el-table-column>
              <el-table-column prop="status" label="状态" width="90" />
              <el-table-column label="操作" width="120">
                <template #default="{ row }">
                  <el-button size="small" type="danger" link @click="onCancelBooking(row)">取消</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="create-booking">
              <el-form :inline="true" @submit.prevent>
                <el-form-item label="座位">
                  <el-select v-model="bookingForm.seatId" placeholder="选择座位" style="width: 120px">
                    <el-option v-for="s in seats" :key="s.id" :label="s.label" :value="s.id" />
                  </el-select>
                </el-form-item>
                <el-form-item label="日期">
                  <el-date-picker v-model="bookingForm.date" type="date" value-format="YYYY-MM-DD" style="width: 140px" />
                </el-form-item>
                <el-form-item label="开始">
                  <el-time-picker v-model="bookingForm.start" format="HH:mm" value-format="HH:mm" placeholder="开始" style="width: 110px" />
                </el-form-item>
                <el-form-item label="结束">
                  <el-time-picker v-model="bookingForm.end" format="HH:mm" value-format="HH:mm" placeholder="结束" style="width: 110px" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="onCreateBooking">新建预约</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import 'echarts-gl'
import { getStudyRoomList, getSeatsByRoom, getRoomBookingsByDate, bookSeat, cancelBooking } from '@/api/studyroom'

// 自习室列表
const studyRoomList = ref<any[]>([])
const loading = ref(false)
const seatDrawer = ref(false)
const isManageMode = ref(false)
const is3DView = ref(false)
const currentRoom = ref<any | null>(null)
const seats = ref<any[]>([])
const bookings = ref<any[]>([])
const bookingDate = ref<string>('')
const bookingForm = ref<{ seatId: number | null; date: string; start: string; end: string }>({ seatId: null, date: '', start: '08:00', end: '10:00' })

// 图表引用
const chart3DRef = ref<HTMLElement>()

// 实时占用率数据
const realtimeOccupancy = ref([
  { id: 1, name: 'A101', occupied: 32, total: 50, occupancyRate: 64 },
  { id: 2, name: 'A102', occupied: 45, total: 50, occupancyRate: 90 },
  { id: 3, name: 'A103', occupied: 28, total: 50, occupancyRate: 56 },
  { id: 4, name: 'B101', occupied: 40, total: 50, occupancyRate: 80 },
  { id: 5, name: 'B102', occupied: 15, total: 50, occupancyRate: 30 },
  { id: 6, name: 'C101', occupied: 35, total: 50, occupancyRate: 70 }
])

// 图表引用
const toggleMode = () => { 
  isManageMode.value = !isManageMode.value
  is3DView.value = isManageMode.value // 进入管理模式时默认显示三维视图
  if (!isManageMode.value) {
    nextTick(() => {
      initCharts()
    })
  } else {
    nextTick(() => {
      init3DChart()
    })
  }
}

const timeAnalysisChart = ref<HTMLElement>()
const peakTimeChart = ref<HTMLElement>()
const userPreferenceChart = ref<HTMLElement>()
const seatTypeChart = ref<HTMLElement>()
const usageTrendChart = ref<HTMLElement>()
const realtimeMonitorChart = ref<HTMLElement>()

// KPI 数据
const totalRooms = ref(6)
const totalSeats = ref(300)
const averageOccupancy = ref(68)
const peakHours = ref('14:00-16:00')

// 获取占用率颜色
const getOccupancyColor = (rate: number) => {
  if (rate >= 80) return '#f56c6c'
  if (rate >= 60) return '#e6a23c'
  return '#67c23a'
}

// 添加自习室
const handleAddRoom = () => {
  ElMessage.info('添加自习室功能待实现')
}

// 编辑自习室
const handleEditRoom = (row: any) => {
  ElMessage.info(`编辑自习室: ${row.name}`)
}

// 座位管理
const handleManageSeats = async (row: any) => {
  currentRoom.value = row
  seatDrawer.value = true
  seats.value = []
  bookings.value = []
  bookingDate.value = new Date().toISOString().slice(0,10)
  try {
    const [seatRes, bookRes] = await Promise.all([
      getSeatsByRoom(row.id),
      getRoomBookingsByDate(row.id, bookingDate.value)
    ])
    seats.value = seatRes.data || []
    bookings.value = bookRes.data || []
    bookingForm.value = { seatId: seats.value[0]?.id ?? null, date: bookingDate.value, start: '08:00', end: '10:00' }
  } catch (e) {
    ElMessage.error('加载座位/预约失败')
  }
}

// 删除自习室
const handleDeleteRoom = (row: any) => {
  ElMessage.info(`删除自习室: ${row.name}`)
}

// 初始化图表
const initCharts = () => {
  nextTick(() => {
    initTimeAnalysisChart()
    initPeakTimeChart()
    initUserPreferenceChart()
    initSeatTypeChart()
    initUsageTrendChart()
    initRealtimeMonitorChart()
  })
}

// 预约时段分析图表
const initTimeAnalysisChart = () => {
  if (timeAnalysisChart.value) {
    const chart = echarts.init(timeAnalysisChart.value)
    const option: any = {
      tooltip: { 
        trigger: 'axis',
        backgroundColor: 'rgba(50, 50, 50, 0.9)',
        borderColor: '#666',
        textStyle: { color: '#fff' }
      },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'category',
        data: ['8:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
        axisLine: { lineStyle: { color: '#666' } },
        axisLabel: { color: '#999' }
      },
      yAxis: { 
        type: 'value',
        axisLine: { lineStyle: { color: '#666' } },
        axisLabel: { color: '#999' },
        splitLine: { lineStyle: { color: '#f0f0f0' } }
      },
      series: [{
        data: [20, 40, 30, 60, 80, 90, 70, 40],
        type: 'bar',
        itemStyle: { 
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#667eea' },
            { offset: 1, color: '#764ba2' }
          ]),
          borderRadius: [4, 4, 0, 0]
        },
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#5a6fd8' },
              { offset: 1, color: '#6a4190' }
            ])
          }
        }
      }]
    }
    chart.setOption(option as any)
  }
}

// 高峰时段识别图表
const initPeakTimeChart = () => {
  if (peakTimeChart.value) {
    const chart = echarts.init(peakTimeChart.value)
    const option: any = {
      tooltip: { 
        trigger: 'item',
        backgroundColor: 'rgba(50, 50, 50, 0.9)',
        borderColor: '#666',
        textStyle: { color: '#fff' }
      },
      series: [{
        data: [
          { value: 35, name: '8:00-10:00', itemStyle: { color: '#ff6b6b' } },
          { value: 45, name: '10:00-12:00', itemStyle: { color: '#ffa726' } },
          { value: 25, name: '12:00-14:00', itemStyle: { color: '#66bb6a' } },
          { value: 80, name: '14:00-16:00', itemStyle: { color: '#ff4757' } },
          { value: 90, name: '16:00-18:00', itemStyle: { color: '#ff3742' } },
          { value: 60, name: '18:00-20:00', itemStyle: { color: '#ffa502' } },
          { value: 30, name: '20:00-22:00', itemStyle: { color: '#2ed573' } }
        ],
        type: 'pie',
        radius: ['40%', '70%'],
        itemStyle: { borderRadius: 8, borderWidth: 2, borderColor: '#fff' },
        label: {
          show: true,
          formatter: '{b}\n{d}%',
          fontSize: 12,
          color: '#333'
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    }
    chart.setOption(option as any)
  }
}

// 用户偏好分析图表
const initUserPreferenceChart = () => {
  if (userPreferenceChart.value) {
    const chart = echarts.init(userPreferenceChart.value)
    const option: any = {
      tooltip: { 
        trigger: 'axis',
        backgroundColor: 'rgba(50, 50, 50, 0.9)',
        borderColor: '#666',
        textStyle: { color: '#fff' }
      },
      radar: {
        indicator: [
          { name: '安静程度', max: 100 },
          { name: '网络质量', max: 100 },
          { name: '座位舒适度', max: 100 },
          { name: '采光条件', max: 100 },
          { name: '温度适宜', max: 100 }
        ],
        axisName: { color: '#666' },
        splitArea: { areaStyle: { color: ['rgba(114, 172, 209, 0.2)', 'rgba(114, 172, 209, 0.4)'] } }
      },
      series: [{
        data: [{
          value: [85, 90, 75, 80, 70],
          name: '用户满意度',
          itemStyle: { color: '#667eea' },
          areaStyle: { color: 'rgba(102, 126, 234, 0.3)' }
        }],
        type: 'radar',
        symbol: 'circle',
        symbolSize: 6
      }]
    }
    chart.setOption(option as any)
  }
}

// 座位类型偏好图表
const initSeatTypeChart = () => {
  if (seatTypeChart.value) {
    const chart = echarts.init(seatTypeChart.value)
    const option: any = {
      tooltip: { 
        trigger: 'item',
        backgroundColor: 'rgba(50, 50, 50, 0.9)',
        borderColor: '#666',
        textStyle: { color: '#fff' }
      },
      series: [{
        data: [
          { value: 45, name: '靠窗座位', itemStyle: { color: '#ff6b6b' } },
          { value: 30, name: '靠墙座位', itemStyle: { color: '#4ecdc4' } },
          { value: 15, name: '中央座位', itemStyle: { color: '#45b7d1' } },
          { value: 10, name: '角落座位', itemStyle: { color: '#96ceb4' } }
        ],
        type: 'pie',
        radius: ['30%', '60%'],
        roseType: 'area',
        itemStyle: { borderRadius: 8, borderWidth: 2, borderColor: '#fff' },
        label: {
          show: true,
          formatter: '{b}\n{d}%',
          fontSize: 12,
          color: '#333'
        }
      }]
    }
    chart.setOption(option as any)
  }
}

// 使用趋势图表
const initUsageTrendChart = () => {
  if (usageTrendChart.value) {
    const chart = echarts.init(usageTrendChart.value)
    const option: any = {
      tooltip: { 
        trigger: 'axis',
        backgroundColor: 'rgba(50, 50, 50, 0.9)',
        borderColor: '#666',
        textStyle: { color: '#fff' }
      },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'category',
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        axisLine: { lineStyle: { color: '#666' } },
        axisLabel: { color: '#999' }
      },
      yAxis: { 
        type: 'value',
        axisLine: { lineStyle: { color: '#666' } },
        axisLabel: { color: '#999' },
        splitLine: { lineStyle: { color: '#f0f0f0' } }
      },
      series: [{
        data: [65, 70, 75, 80, 85, 60, 55],
        type: 'line',
        smooth: true,
        lineStyle: { 
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#667eea' },
            { offset: 1, color: '#764ba2' }
          ]),
          width: 3
        },
        itemStyle: { color: '#667eea' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(102, 126, 234, 0.3)' },
            { offset: 1, color: 'rgba(102, 126, 234, 0.1)' }
          ])
        }
      }]
    }
    chart.setOption(option as any)
  }
}

// 实时监控图表
const initRealtimeMonitorChart = () => {
  if (realtimeMonitorChart.value) {
    const chart = echarts.init(realtimeMonitorChart.value)
    const option: any = {
      tooltip: { 
        trigger: 'axis',
        backgroundColor: 'rgba(50, 50, 50, 0.9)',
        borderColor: '#666',
        textStyle: { color: '#fff' }
      },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'category',
        data: ['A101', 'A102', 'A103', 'B101', 'B102', 'C101'],
        axisLine: { lineStyle: { color: '#666' } },
        axisLabel: { color: '#999' }
      },
      yAxis: { 
        type: 'value',
        axisLine: { lineStyle: { color: '#666' } },
        axisLabel: { color: '#999' },
        splitLine: { lineStyle: { color: '#f0f0f0' } }
      },
      series: [{
        data: [64, 90, 56, 80, 30, 70],
        type: 'bar',
        itemStyle: {
          color: function(params: any) {
            const colors = ['#ff6b6b', '#ffa726', '#66bb6a', '#ff4757', '#2ed573', '#ffa502']
            return colors[params.dataIndex]
          }
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    }
    chart.setOption(option as any)
  }
}

onMounted(async () => {
  initCharts()
  await loadRooms()
  // 模拟实时数据更新
  setInterval(() => {
    realtimeOccupancy.value.forEach(room => {
      const change = Math.floor(Math.random() * 6) - 3
      const newOccupied = Math.max(0, Math.min(room.total, room.occupied + change))
      room.occupied = newOccupied
      room.occupancyRate = Math.round((newOccupied / room.total) * 100)
    })
  }, 10000)
})

// 切回看板时重建图表
watch(isManageMode, (val) => {
  if (!val) {
    nextTick(() => initCharts())
  }
})

// 监听三维视图切换
watch(is3DView, (newVal) => {
  if (newVal && isManageMode.value) {
    nextTick(() => {
      init3DChart()
    })
  }
})

// 监听管理模式切换，确保进入管理模式时显示三维视图
watch(isManageMode, (newVal) => {
  if (newVal) {
    is3DView.value = true
    nextTick(() => {
      init3DChart()
    })
  }
})

// 加载房间
async function loadRooms() {
  loading.value = true
  try {
    const res = await getStudyRoomList()
    studyRoomList.value = (res.data || []).map((r: any) => ({
      id: r.id,
      name: r.name || r.number,
      location: r.location,
      totalSeats: r.total_seats,
      availableSeats: undefined,
      occupancyRate: 0,
      status: r.status
    }))
  } catch (e) {
    ElMessage.error('获取自习室列表失败')
  } finally {
    loading.value = false
  }
}

// 刷新当日预约
async function reloadBookings() {
  if (!currentRoom.value || !bookingDate.value) return
  try {
    const res = await getRoomBookingsByDate(currentRoom.value.id, bookingDate.value)
    bookings.value = res.data || []
  } catch (e) {
    ElMessage.error('刷新预约失败')
  }
}

// 工具：秒转 HH:mm
function secToTime(sec: number) {
  const h = Math.floor(sec / 3600).toString().padStart(2, '0')
  const m = Math.floor((sec % 3600) / 60).toString().padStart(2, '0')
  return `${h}:${m}`
}

// 工具：HH:mm -> 秒
function timeToSec(t: string) {
  const [h, m] = t.split(':').map(Number)
  return (h * 60 + m) * 60
}

// 创建预约
async function onCreateBooking() {
  if (!currentRoom.value) return
  if (!bookingForm.value.seatId || !bookingForm.value.date) {
    ElMessage.warning('请选择座位与日期')
    return
  }
  const startSec = timeToSec(bookingForm.value.start)
  const endSec = timeToSec(bookingForm.value.end)
  if (endSec <= startSec) {
    ElMessage.warning('结束时间需晚于开始时间')
    return
  }
  try {
    await bookSeat({
      roomId: currentRoom.value.id,
      seatId: bookingForm.value.seatId,
      date: bookingForm.value.date,
      startTimeSec: startSec,
      endTimeSec: endSec
    })
    ElMessage.success('预约成功')
    await reloadBookings()
  } catch (e: any) {
    ElMessage.error(e?.response?.data?.message || '预约失败')
  }
}

// 取消预约
async function onCancelBooking(row: any) {
  try {
    await cancelBooking(row.id)
    ElMessage.success('已取消')
    await reloadBookings()
  } catch (e) {
    ElMessage.error('取消失败')
  }
}

// 初始化三维图表
function init3DChart() {
  if (!chart3DRef.value) return
  
  const chart = echarts.init(chart3DRef.value)
  
  // 生成座位数据
  const seatData: any[] = []
  const roomData: any[] = []
  
  // 为每个自习室生成座位
  studyRoomList.value.forEach((room, roomIndex) => {
    const roomX = roomIndex * 15
    const roomZ = 0
    
    // 添加房间
    roomData.push({
      name: room.name,
      value: [roomX, 0, roomZ, 8, 5, 3],
      itemStyle: {
        color: room.occupancyRate > 80 ? '#ff4757' : room.occupancyRate > 50 ? '#ffa502' : '#2ed573',
        opacity: 0.9,
        borderColor: room.occupancyRate > 80 ? '#ff3742' : room.occupancyRate > 50 ? '#ff9500' : '#20bf6b',
        borderWidth: 2
      }
    })
    
    // 为每个房间生成座位
    const seatsPerRow = 8
    const rows = Math.ceil(room.totalSeats / seatsPerRow)
    
    for (let i = 0; i < room.totalSeats; i++) {
      const row = Math.floor(i / seatsPerRow)
      const col = i % seatsPerRow
      const seatX = roomX + (col - seatsPerRow/2) * 0.8
      const seatZ = roomZ + (row - rows/2) * 0.8
      
      // 随机生成座位状态
      const isOccupied = Math.random() < (room.occupancyRate / 100)
      const isReserved = Math.random() < 0.1 // 10% 概率为预约状态
      
      let seatColor, seatBorderColor
      if (isOccupied) {
        seatColor = '#ff4757'
        seatBorderColor = '#ff3742'
      } else if (isReserved) {
        seatColor = '#ffa502'
        seatBorderColor = '#ff9500'
      } else {
        seatColor = '#2ed573'
        seatBorderColor = '#20bf6b'
      }
      
      seatData.push({
        name: `${room.name}-${i+1}`,
        value: [seatX, 0.5, seatZ, 0.8, 0.8, 0.8],
        itemStyle: {
          color: seatColor,
          opacity: 0.95,
          borderColor: seatBorderColor,
          borderWidth: 1
        },
        roomId: room.id,
        seatId: i + 1,
        status: isOccupied ? 'occupied' : isReserved ? 'reserved' : 'available'
      })
    }
  })
  
  const option = {
    title: {
      text: '自习室三维视图',
      left: 'center',
      textStyle: {
        color: '#333'
      }
    },
    tooltip: {
      backgroundColor: 'rgba(50, 50, 50, 0.9)',
      borderColor: '#666',
      borderWidth: 1,
      textStyle: {
        color: '#fff',
        fontSize: 14
      },
      formatter: (params: any) => {
        if (params.data.roomId) {
          const statusText = params.data.status === 'occupied' ? '已占用' : 
                           params.data.status === 'reserved' ? '已预约' : '可用'
          const statusColor = params.data.status === 'occupied' ? '#ff4757' : 
                             params.data.status === 'reserved' ? '#ffa502' : '#2ed573'
          return `<div style="padding: 8px;">
                    <div style="font-weight: bold; margin-bottom: 4px;">座位: ${params.data.name}</div>
                    <div style="color: ${statusColor}; font-weight: bold;">状态: ${statusText}</div>
                  </div>`
        } else {
          const room = studyRoomList.value.find(r => r.name === params.data.name)
          return `<div style="padding: 8px;">
                    <div style="font-weight: bold; margin-bottom: 4px;">房间: ${params.data.name}</div>
                    <div style="color: #74b9ff;">占用率: ${room?.occupancyRate || 0}%</div>
                  </div>`
        }
      }
    },
    xAxis3D: {
      type: 'value',
      name: 'X',
      min: -10,
      max: 50
    },
    yAxis3D: {
      type: 'value',
      name: 'Y',
      min: -2,
      max: 5
    },
    zAxis3D: {
      type: 'value',
      name: 'Z',
      min: -10,
      max: 10
    },
    grid3D: {
      boxWidth: 50,
      boxHeight: 10,
      boxDepth: 20,
      viewControl: {
        projection: 'perspective',
        autoRotate: true,
        autoRotateDirection: 'cw',
        autoRotateSpeed: 8,
        rotateSensitivity: 1,
        zoomSensitivity: 1,
        panSensitivity: 1,
        alpha: 25,
        beta: 45,
        distance: 80
      },
      light: {
        main: {
          intensity: 2.5,
          shadow: true,
          shadowQuality: 'high',
          color: '#ffffff'
        },
        ambient: {
          intensity: 0.8,
          color: '#f0f8ff'
        }
      },
      environment: 'rgba(240, 248, 255, 0.1)',
      postEffect: {
        enable: true,
        bloom: {
          enable: true,
          intensity: 0.1
        },
        SSAO: {
          enable: true,
          intensity: 1.2,
          radius: 5
        }
      }
    },
    series: [
      {
        type: 'scatter3D',
        name: '房间',
        data: roomData,
        symbolSize: 25,
        itemStyle: {
          opacity: 0.9
        },
        emphasis: {
          itemStyle: {
            opacity: 1,
            borderWidth: 3
          }
        }
      },
      {
        type: 'scatter3D',
        name: '座位',
        data: seatData,
        symbolSize: 12,
        itemStyle: {
          opacity: 0.95
        },
        emphasis: {
          itemStyle: {
            opacity: 1,
            borderWidth: 2
          }
        }
      }
    ]
  }
  
  chart.setOption(option)
  
  // 点击事件
  chart.on('click', async (params: any) => {
    if (params.data.roomId) {
      // 点击座位，打开座位管理抽屉
      const room = studyRoomList.value.find(r => r.id === params.data.roomId)
      if (room) {
        currentRoom.value = room
        seatDrawer.value = true
        // 加载座位和预约数据
        await handleManageSeats(room)
      }
    }
  })
  
  // 窗口大小变化时重新调整
  window.addEventListener('resize', () => {
    chart.resize()
  })
}
</script>

<style scoped>
.studyrooms-page {
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

.rooms-list {
  margin-bottom: 20px;
}

.rooms-3d {
  margin-bottom: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.legend {
  display: flex;
  gap: 20px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #fff;
  font-size: 14px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.chart-3d-container {
  height: 500px;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}

.chart-3d-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 70% 80%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
  pointer-events: none;
  z-index: 1;
}

/* KPI 卡片样式 */
.kpi-section {
  margin-bottom: 30px;
}

.kpi-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 24px;
  color: white;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
  height: 140px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.kpi-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(102, 126, 234, 0.4);
}

.kpi-card-1 {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.kpi-card-2 {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.kpi-card-3 {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.kpi-card-4 {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.kpi-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.kpi-icon {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 12px;
  backdrop-filter: blur(10px);
}

.kpi-content {
  flex: 1;
  position: relative;
  z-index: 1;
}

.kpi-value {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 8px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.kpi-label {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 8px;
}

.kpi-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  opacity: 0.8;
}

/* 热力图样式 */
.heatmap-container {
  position: relative;
}

.heatmap-legend {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 20px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.heatmap-legend .legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 14px;
  font-weight: 500;
}

.heatmap-legend .legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* 图表卡片样式 */
.chart-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.chart-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.chart-card .card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  color: #333;
}

.chart-container {
  height: 320px;
}

.chart-container-large {
  height: 400px;
}

/* 房间卡片样式优化 */
.room-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.room-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.room-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.room-name {
  font-weight: 600;
  font-size: 16px;
  color: #333;
}

.room-rate {
  font-weight: bold;
  font-size: 18px;
  color: #667eea;
}

.room-details {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
  font-size: 14px;
  color: #666;
}

.occupancy-section {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.occupancy-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.room-card {
  padding: 20px;
  border: 1px solid #e6e6e6;
  border-radius: 8px;
  background: white;
}

.room-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.room-name {
  font-weight: bold;
  font-size: 16px;
  color: #333;
}

.room-rate {
  font-size: 18px;
  font-weight: bold;
  color: #409eff;
}

.room-details {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 12px;
  color: #666;
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

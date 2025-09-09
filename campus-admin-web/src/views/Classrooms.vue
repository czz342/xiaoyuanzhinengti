<template>
  <div class="classrooms-page">
    <div class="page-header">
      <h2>教室管理</h2>
      <div class="header-actions">
        <el-button v-if="isManageMode" type="primary" @click="handleAddClassroom">
          <el-icon><Plus /></el-icon>
          添加教室
        </el-button>
        <el-button type="success" plain @click="toggleMode">{{ isManageMode ? '返回可视化看板' : '管理详细数据' }}</el-button>
      </div>
    </div>

    <!-- 教室列表 + 筛选 + 分页 / 楼层视图 -->
    <el-card v-if="isManageMode" class="classrooms-list">
      <template #header>
        <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;">
          <span>教室管理</span>
          <div>
            <el-button-group>
              <el-button :type="isFloorView ? 'primary' : 'default'" @click="isFloorView = true">楼层视图</el-button>
              <el-button :type="!isFloorView ? 'primary' : 'default'" @click="isFloorView = false">列表视图</el-button>
            </el-button-group>
          </div>
        </div>
      </template>
      <div class="filters">
        <el-form :inline="true" :model="filters">
          <el-form-item label="教学楼">
            <el-select v-model="filters.building" placeholder="选择教学楼" clearable @change="loadFloors">
              <el-option v-for="b in buildings" :key="b" :label="b" :value="b" />
            </el-select>
          </el-form-item>
          <el-form-item label="楼层">
            <el-select v-model="filters.floor" placeholder="选择楼层" clearable :disabled="!filters.building">
              <el-option v-for="f in floors" :key="f" :label="f" :value="f" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="filters.status" placeholder="全部" clearable>
              <el-option label="可用" value="available" />
              <el-option label="使用中" value="occupied" />
              <el-option label="维护中" value="maintenance" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 楼层可视化视图 -->
      <div v-if="isFloorView" class="floor-view">
        <el-alert v-if="!filters.building" type="info" show-icon :closable="false" title="请选择教学楼以查看楼层视图" style="margin-bottom:12px;" />
        <template v-else>
          <div class="legend">
            <span class="legend-item"><i class="dot dot-success"></i> 可用</span>
            <span class="legend-item"><i class="dot dot-warning"></i> 使用中</span>
            <span class="legend-item"><i class="dot dot-danger"></i> 维护中</span>
          </div>
          <div v-for="fl in floorsInView" :key="fl" class="floor-section glass-card">
            <div class="floor-title">{{ filters.building }} - {{ fl }} 层</div>
            <div class="rooms-row">
              <div
                v-for="room in roomsByFloor(fl)"
                :key="room.id"
                class="room-dot"
                :class="statusClass(room.status)"
                :title="`${room.name} (${room.code}) · 容量${room.capacity}`"
                @click="handleManageReservations(room)"
              >
                <span class="room-code">{{ roomLabel(room) }}</span>
              </div>
              <div v-if="roomsByFloor(fl).length === 0" class="empty-row">暂无教室</div>
            </div>
          </div>
        </template>
      </div>

      <!-- 列表视图 -->
      <el-table v-else :data="classroomList" :loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="code" label="教室编号" width="120" />
        <el-table-column prop="name" label="教室名称" width="150" />
        <el-table-column prop="building" label="教学楼" width="120" />
        <el-table-column prop="floor" label="楼层" width="80" />
        <el-table-column prop="capacity" label="容量" width="80" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="equipment" label="设备" width="150" />
        <el-table-column label="操作" width="240" class-name="ops-col">
          <template #default="{ row }">
            <el-button size="small" @click="handleEditClassroom(row)">编辑</el-button>
            <el-button size="small" type="primary" @click="handleManageReservations(row)">预约管理</el-button>
            <el-button size="small" type="danger" @click="handleDeleteClassroom(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="!isFloorView" class="pagination">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :current-page="page"
          :page-size="pageSize"
          :page-sizes="[10,20,30,50]"
          @size-change="handlePageSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- 教室预约管理抽屉 -->
    <el-drawer
      v-model="reservationsVisible"
      :title="`预约管理 - ${currentClassroom?.name || ''}`"
      size="50%"
    >
      <el-tabs v-model="activeTab">
        <el-tab-pane label="预约记录" name="records">
          <div class="reservation-toolbar">
            <el-date-picker
              v-model="reservationDate"
              type="date"
              placeholder="选择日期"
              value-format="YYYY-MM-DD"
            />
            <el-button type="primary" @click="loadReservations">查询</el-button>
          </div>
          <el-table :data="reservationList" :loading="reservationsLoading" stripe>
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="displayName" label="用户" width="150">
              <template #default="{ row }">{{ row.displayName || row.userName || '-' }}</template>
            </el-table-column>
            <el-table-column prop="reservationDate" label="日期" width="150">
              <template #default="{ row }">{{ formatDate(row.reservationDate) }}</template>
            </el-table-column>
            <el-table-column prop="startTime" label="开始时间" width="120">
              <template #default="{ row }">{{ secondsToHHmm(row.startTime) }}</template>
            </el-table-column>
            <el-table-column prop="endTime" label="结束时间" width="120">
              <template #default="{ row }">{{ secondsToHHmm(row.endTime) }}</template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">{{ statusText(row.status) }}</template>
            </el-table-column>
            <el-table-column label="操作" width="140">
              <template #default="{ row }">
                <el-button size="small" type="danger" @click="handleCancelReservation(row)">取消</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="新建预约" name="create">
          <el-form :model="createForm" label-width="90px" class="create-form">
            <el-form-item label="日期" required>
              <el-date-picker v-model="createForm.reservationDate" type="date" placeholder="选择日期" value-format="YYYY-MM-DD" />
            </el-form-item>
            <el-form-item label="开始时间" required>
              <el-time-select v-model="createForm.startTime" start="08:00" step="00:30" end="22:00" placeholder="选择开始时间" />
            </el-form-item>
            <el-form-item label="结束时间" required>
              <el-time-select v-model="createForm.endTime" start="08:30" step="00:30" end="23:00" placeholder="选择结束时间" />
            </el-form-item>
            <el-form-item label="用途">
              <el-input v-model="createForm.purpose" placeholder="如：自习/上课/考试" />
            </el-form-item>
            <el-form-item>
              <el-button type="success" :disabled="!canSubmitReservation" @click="handleCreateReservation">提交预约</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="教室详情" name="detail">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="编号">{{ currentClassroom?.code }}</el-descriptions-item>
            <el-descriptions-item label="名称">{{ currentClassroom?.name }}</el-descriptions-item>
            <el-descriptions-item label="教学楼">{{ currentClassroom?.building }}</el-descriptions-item>
            <el-descriptions-item label="楼层">{{ currentClassroom?.floor }}</el-descriptions-item>
            <el-descriptions-item label="容量">{{ currentClassroom?.capacity }}</el-descriptions-item>
            <el-descriptions-item label="状态">{{ getStatusText(currentClassroom?.status || '') }}</el-descriptions-item>
            <el-descriptions-item :span="2" label="设备">{{ (currentClassroom as any)?.equipment || '—' }}</el-descriptions-item>
          </el-descriptions>
        </el-tab-pane>
      </el-tabs>
    </el-drawer>

    <!-- 看板：KPI 概览 -->
    <el-row v-if="!isManageMode" :gutter="20" class="kpi-section">
      <el-col :span="6">
        <div class="kpi-card kpi-blue">
          <div class="kpi-meta">
            <div class="kpi-title">教室总数</div>
            <div class="kpi-sub">Total Rooms</div>
          </div>
          <div class="kpi-value">{{ usageKpi.total }}</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="kpi-card kpi-teal">
          <div class="kpi-meta">
            <div class="kpi-title">当前可用</div>
            <div class="kpi-sub">Available Now</div>
          </div>
          <div class="kpi-value">{{ usageKpi.available }}</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="kpi-card kpi-amber">
          <div class="kpi-meta">
            <div class="kpi-title">整体使用率</div>
            <div class="kpi-sub">Utilization</div>
          </div>
          <div class="kpi-value">{{ usageKpi.usageRate }}%</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="kpi-card kpi-rose">
          <div class="kpi-meta">
            <div class="kpi-title">今日预约</div>
            <div class="kpi-sub">Reservations Today</div>
          </div>
          <div class="kpi-value">{{ usageKpi.todayReservations }}</div>
        </div>
      </el-col>
    </el-row>

    <!-- 数据分析图表 -->
    <el-row v-if="!isManageMode" :gutter="20" class="charts-section">
      <el-col :span="12">
        <el-card class="glass-card">
          <template #header>
            <span>教室使用率热力图</span>
          </template>
          <div ref="usageHeatmapChart" class="chart-container"></div>
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-card class="glass-card">
          <template #header>
            <span>预约趋势分析</span>
          </template>
          <div ref="reservationTrendChart" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 高阶图：旭日图 + 玫瑰图（模拟数据） -->
    <el-row v-if="!isManageMode" :gutter="20" class="charts-section">
      <el-col :span="12">
        <el-card class="glass-card">
          <template #header>
            <span>楼栋-楼层-教室使用分布（旭日图）</span>
          </template>
          <div ref="sunburstChart" class="chart-container tall"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="glass-card">
          <template #header>
            <span>高峰时段占用（南丁格尔玫瑰图）</span>
          </template>
          <div ref="roseChart" class="chart-container tall"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import { getClassroomList, getBuildings, getFloors, getClassroomReservations, createClassroomReservation, cancelClassroomReservation, getClassroomUsageStats, getClassroomReservationStats } from '@/api/classroom'
import type { Classroom } from '@/types/api'

// 教室列表
const classroomList = ref<Classroom[]>([])
const loading = ref(false)
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const filters = reactive({ building: '', floor: '', status: '' })
const buildings = ref<string[]>([])
const floors = ref<string[]>([])
const isFloorView = ref(true)

// 页面模式切换
const isManageMode = ref(false)
const toggleMode = () => { isManageMode.value = !isManageMode.value }

// 图表引用
const usageHeatmapChart = ref<HTMLElement>()
const reservationTrendChart = ref<HTMLElement>()
const sunburstChart = ref<HTMLElement>()
const roseChart = ref<HTMLElement>()
// 看板模拟 KPI（不连后端）
const usageKpi = reactive<any>({
  total: 128,
  available: 92,
  occupied: 28,
  usageRate: 68,
  todayReservations: 24,
  hotClassroom: 'A101'
})

// 获取状态类型
const getStatusType = (status: string) => {
  switch (status) {
    case 'available': return 'success'
    case 'occupied': return 'warning'
    case 'maintenance': return 'danger'
    default: return 'info'
  }
}

// 获取状态文本
const getStatusText = (status: string) => {
  switch (status) {
    case 'available': return '可用'
    case 'occupied': return '使用中'
    case 'maintenance': return '维护中'
    default: return '未知'
  }
}

const statusText = (status: string) => {
  switch (status) {
    case 'pending': return '待确认'
    case 'confirmed': return '已确认'
    case 'cancelled': return '已取消'
    case 'completed': return '已完成'
    default: return '未知'
  }
}

// 添加教室
const handleAddClassroom = () => {
  ElMessage.info('添加教室功能待实现')
}

// 编辑教室
const handleEditClassroom = (row: any) => {
  ElMessage.info(`编辑教室: ${row.name}`)
}

// 预约管理
const reservationsVisible = ref(false)
const currentClassroom = ref<Classroom | null>(null)
const reservationsLoading = ref(false)
const reservationList = ref<Array<any>>([])
const reservationDate = ref<string>('')
const activeTab = ref('records')
const createForm = reactive({ reservationDate: '', startTime: '', endTime: '', purpose: '' })
const canSubmitReservation = computed(() => !!createForm.reservationDate && !!createForm.startTime && !!createForm.endTime)
const handleManageReservations = (row: any) => {
  currentClassroom.value = row
  reservationsVisible.value = true
  loadReservations()
  activeTab.value = 'records'
}

const loadReservations = async () => {
  if (!currentClassroom.value) return
  reservationsLoading.value = true
  try {
    const res = await getClassroomReservations({
      classroomId: (currentClassroom.value as any).id,
      date: reservationDate.value || undefined
    })
    const list = (res as any).data ?? []
    reservationList.value = list
  } catch (e) {
    ElMessage.error('获取预约列表失败')
  } finally {
    reservationsLoading.value = false
  }
}

// 预约列表当前接口不分页，如需分页可在后端支持后再开启

const timeToSeconds = (t: string) => {
  if (!t) return 0
  // support HH:mm or HH:mm:ss
  const parts = t.split(':').map(p => parseInt(p, 10))
  const h = parts[0] || 0
  const m = parts[1] || 0
  const s = parts[2] || 0
  return h * 3600 + m * 60 + s
}

const handleCreateReservation = async () => {
  if (!currentClassroom.value) return
  try {
    if (!canSubmitReservation.value) {
      ElMessage.warning('请先选择日期与时间段')
      return
    }
    await createClassroomReservation({
      classroomId: (currentClassroom.value as any).id,
      reservationDate: createForm.reservationDate,
      startTime: timeToSeconds(createForm.startTime),
      endTime: timeToSeconds(createForm.endTime),
      purpose: createForm.purpose
    })
    ElMessage.success('创建预约成功')
    await loadReservations()
    activeTab.value = 'records'
  } catch (e: any) {
    ElMessage.error(e?.message || '创建预约失败')
  }
}

const handleCancelReservation = async (row: any) => {
  try {
    await cancelClassroomReservation(row.id)
    ElMessage.success('取消预约成功')
    await loadReservations()
  } catch (e) {
    ElMessage.error('取消预约失败')
  }
}

// 删除教室
const handleDeleteClassroom = (row: any) => {
  ElMessage.info(`删除教室: ${row.name}`)
}

// 初始化图表
const initCharts = () => {
  nextTick(() => {
    // 使用率热力图
    if (usageHeatmapChart.value) {
      const chart = echarts.init(usageHeatmapChart.value)
      const option = {
        tooltip: { position: 'top' },
        grid: { height: '60%', top: '12%', left: 60, right: 24, bottom: 40 },
        xAxis: {
          type: 'category',
          data: ['A101', 'A102', 'A103', 'B101', 'B102', 'B103'],
          splitArea: { show: true },
          axisLine: { lineStyle: { color: 'rgba(0,0,0,0.25)' } },
          axisLabel: { color: '#666' }
        },
        yAxis: {
          type: 'category',
          data: ['8:00', '10:00', '12:00', '14:00', '16:00', '18:00'],
          splitArea: { show: true },
          axisLabel: { color: '#666' }
        },
        visualMap: {
          min: 0,
          max: 100,
          calculable: true,
          orient: 'horizontal',
          left: 'center',
          bottom: 8,
          inRange: { color: ['#e0f3ff','#a9caff','#4f8cff'] }
        },
        series: [{
          name: '使用率',
          type: 'heatmap',
          data: [
            [0, 0, 85], [0, 1, 90], [0, 2, 75], [0, 3, 80], [0, 4, 85], [0, 5, 70],
            [1, 0, 90], [1, 1, 95], [1, 2, 85], [1, 3, 90], [1, 4, 95], [1, 5, 80],
            [2, 0, 75], [2, 1, 80], [2, 2, 70], [2, 3, 75], [2, 4, 80], [2, 5, 65],
            [3, 0, 80], [3, 1, 85], [3, 2, 75], [3, 3, 80], [3, 4, 85], [3, 5, 70],
            [4, 0, 85], [4, 1, 90], [4, 2, 80], [4, 3, 85], [4, 4, 90], [4, 5, 75],
            [5, 0, 70], [5, 1, 75], [5, 2, 65], [5, 3, 70], [5, 4, 75], [5, 5, 60]
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      }
      chart.setOption(option)
    }

    // 预约趋势
    if (reservationTrendChart.value) {
      const chart = echarts.init(reservationTrendChart.value)
      const option = {
        tooltip: { trigger: 'axis' },
        grid: { left: 40, right: 16, bottom: 24, top: 18 },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          axisLine: { lineStyle: { color: 'rgba(0,0,0,0.25)' } },
          axisLabel: { color: '#666' },
          axisTick: { show: false }
        },
        yAxis: { type: 'value', axisLine: { show: false }, splitLine: { lineStyle: { color: 'rgba(0,0,0,0.08)' } }, axisLabel: { color: '#666' } },
        series: [{
          data: [25, 30, 35, 40, 45, 20, 15],
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 8,
          lineStyle: { width: 3, color: '#67c23a' },
          itemStyle: { color: '#67c23a' },
          areaStyle: { color: new (echarts as any).graphic.LinearGradient(0,0,0,1, [
            { offset: 0, color: 'rgba(103,194,58,0.28)' },
            { offset: 1, color: 'rgba(103,194,58,0.05)' }
          ]) }
        }]
      }
      chart.setOption(option)
    }

    // 旭日图（模拟数据）
    if (sunburstChart.value) {
      const chart = echarts.init(sunburstChart.value)
      const option = {
        series: [{
          type: 'sunburst',
          radius: ['10%','85%'],
          sort: undefined,
          emphasis: { focus: 'ancestor' },
          label: { color: '#333' },
          data: [
            { name: '教学楼A', children: [
              { name: '1层', children: [{ name: 'A101', value: 5 }, { name: 'A102', value: 3 }, { name: 'A103', value: 4 }] },
              { name: '2层', children: [{ name: 'A201', value: 4 }, { name: 'A202', value: 6 }] }
            ]},
            { name: '教学楼B', children: [
              { name: '1层', children: [{ name: 'B101', value: 7 }, { name: 'B102', value: 2 }] },
              { name: '2层', children: [{ name: 'B201', value: 5 }, { name: 'B202', value: 3 }] }
            ]}
          ]
        }]
      }
      chart.setOption(option)
    }

    // 南丁格尔玫瑰图（模拟数据）
    if (roseChart.value) {
      const chart = echarts.init(roseChart.value)
      const option = {
        tooltip: { trigger: 'item' },
        legend: { top: 8 },
        series: [{
          name: '占用',
          type: 'pie',
          roseType: 'radius',
          radius: [20, 120],
          center: ['50%','55%'],
          itemStyle: { borderRadius: 6 },
          label: { color: '#333' },
          data: [
            { value: 23, name: '08:00-10:00' },
            { value: 28, name: '10:00-12:00' },
            { value: 18, name: '12:00-14:00' },
            { value: 32, name: '14:00-16:00' },
            { value: 26, name: '16:00-18:00' },
            { value: 12, name: '18:00-20:00' }
          ]
        }]
      }
      chart.setOption(option)
    }
  })
}

const loadClassrooms = async () => {
  loading.value = true
  try {
    const res = await getClassroomList({ page: page.value, limit: pageSize.value, building: filters.building, floor: filters.floor, status: filters.status })
    const list = (res as any).data?.list ?? (res as any).data ?? []
    classroomList.value = list
    total.value = (res as any).pagination?.total ?? list.length
  } catch (e) {
    ElMessage.error('获取教室列表失败')
  } finally {
    loading.value = false
  }
}

const loadBuildings = async () => {
  try {
    const res = await getBuildings()
    buildings.value = (res as any).data ?? []
    // 默认选择 教学楼A，如不存在则选择第一个
    if (!filters.building) {
      const preferred = buildings.value.find(b => String(b).includes('教学楼A'))
      filters.building = preferred || buildings.value[0] || ''
    }
    // 加载默认楼层列表
    if (filters.building) {
      const fr = await getFloors(filters.building)
      floors.value = (fr as any).data ?? []
    }
  } catch {}
}

const loadFloors = async () => {
  floors.value = []
  filters.floor = ''
  if (!filters.building) return
  try {
    const res = await getFloors(filters.building)
    floors.value = (res as any).data ?? []
  } catch {}
}

const handleSearch = async () => {
  page.value = 1
  await loadClassrooms()
}

const handleReset = async () => {
  filters.building = ''
  filters.floor = ''
  filters.status = ''
  page.value = 1
  await loadClassrooms()
}

const handlePageChange = async (p: number) => {
  page.value = p
  await loadClassrooms()
}

const handlePageSizeChange = async (s: number) => {
  pageSize.value = s
  page.value = 1
  await loadClassrooms()
}

// 楼层视图辅助
const floorsInView = computed(() => {
  if (!filters.building) return [] as string[]
  // 如果选择了具体楼层，仅展示该楼层；否则展示接口返回的楼层集合
  if (filters.floor) return [filters.floor]
  return floors.value
})

const roomsByFloor = (fl: string) => {
  return classroomList.value.filter(r => String(r.floor) === String(fl) && r.building === filters.building)
}

const statusClass = (status: string) => {
  switch (status) {
    case 'available': return 'status-success'
    case 'occupied': return 'status-warning'
    case 'maintenance': return 'status-danger'
    default: return 'status-info'
  }
}

const roomLabel = (room: any) => {
  // 仅保留英文+数字（如 A101），去掉汉字
  const base = room.name || room.code || ''
  const match = String(base).match(/[A-Za-z]\d+/)
  return match ? match[0] : (room.code || '—')
}

const formatDate = (d: any) => {
  // 支持 Date/字符串（YYYY-MM-DD）/ISO
  try {
    const dateObj = typeof d === 'string' && d.length > 10 ? new Date(d) : new Date(d)
    if (Number.isNaN(dateObj.getTime())) {
      // 可能是 "2025-09-08" 这类字符串
      return String(d)
    }
    const y = dateObj.getFullYear()
    const m = String(dateObj.getMonth() + 1).padStart(2, '0')
    const day = String(dateObj.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  } catch { return String(d || '') }
}

const secondsToHHmm = (sec: number) => {
  const s = Number(sec) || 0
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`
}

onMounted(async () => {
  await loadBuildings()
  await loadClassrooms()
  initCharts()
})

// 切回看板时重建图表
watch(isManageMode, (val) => {
  if (!val) {
    nextTick(() => initCharts())
  }
})
</script>

<style scoped>
.classrooms-page {
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

.classrooms-list {
  margin-bottom: 20px;
}

.filters { margin-bottom: 12px; }
.pagination { margin-top: 12px; display: flex; justify-content: flex-end; }

/* 楼层视图 */
.floor-view { padding: 8px 4px 0; }
.legend { display: flex; gap: 16px; align-items: center; margin-bottom: 10px; color: #666; font-size: 12px; }
.legend .dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 6px; }
.dot-success { background: #67c23a; }
.dot-warning { background: #e6a23c; }
.dot-danger { background: #f56c6c; }
.floor-section { margin-bottom: 16px; }
.floor-title { font-weight: 600; color: #333; margin-bottom: 8px; }
.rooms-row { display: flex; flex-wrap: wrap; gap: 12px; min-height: 40px; justify-content: center; }
.floor-view { display: flex; flex-direction: column; align-items: center; }
.floor-section { width: 100%; max-width: 1100px; padding: 12px; border-radius: 12px; }
.legend { justify-content: center; }
.room-dot { width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; cursor: pointer; box-shadow: 0 6px 14px rgba(0,0,0,0.08); transition: transform .15s ease, box-shadow .15s ease; }
.room-dot:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,0,0,0.12); }
.room-code { font-size: 12px; font-weight: 700; text-shadow: 0 1px 2px rgba(0,0,0,0.18); }
.status-success { background: linear-gradient(135deg, #67c23a, #8be06a); }
.status-warning { background: linear-gradient(135deg, #e6a23c, #f4c776); }
.status-danger { background: linear-gradient(135deg, #f56c6c, #ff8a8a); }
.status-info { background: linear-gradient(135deg, #909399, #b4b5b7); }
.empty-row { color: #888; font-size: 12px; padding: 6px 0; }

/* 操作列按钮排成一行并对齐 */
:deep(.ops-col .cell) { display: flex; gap: 8px; align-items: center; }

.charts-section {
  margin-bottom: 20px;
}

.chart-container {
  height: 300px;
}

/* KPI 样式 */
.kpi-section { margin-bottom: 12px; }
/* KPI 风格（参考 Users.vue，但颜色做区分） */
.kpi-card { position: relative; border-radius: 14px; padding: 18px 20px; color: #fff; box-shadow: 0 10px 24px rgba(0,0,0,0.08); overflow: hidden; }
.kpi-card::after { content: ''; position: absolute; right: -30px; top: -30px; width: 120px; height: 120px; background: rgba(255,255,255,0.15); border-radius: 50%; filter: blur(2px); }
.kpi-meta { opacity: .92; }
.kpi-title { font-size: 14px; letter-spacing: .5px; }
.kpi-sub { font-size: 12px; opacity: .82; }
.kpi-value { font-size: 28px; font-weight: 700; margin-top: 6px; }
.kpi-blue { background: linear-gradient(135deg, #4f8cff 0%, #6cc1ff 100%); }
.kpi-teal { background: linear-gradient(135deg, #1dd1a1 0%, #48dbfb 100%); }
.kpi-amber { background: linear-gradient(135deg, #f6d365 0%, #fda085 100%); }
.kpi-rose { background: linear-gradient(135deg, #f5576c 0%, #f093fb 100%); }
/* KPI 背景增强（与课程页一致） */
.kpi-card--primary { background: linear-gradient(135deg, rgba(79,140,255,0.12), rgba(79,140,255,0.02)); }
.kpi-card--success { background: linear-gradient(135deg, rgba(103,194,58,0.12), rgba(103,194,58,0.02)); }
.kpi-card--warning { background: linear-gradient(135deg, rgba(230,162,60,0.12), rgba(230,162,60,0.02)); }
.kpi-card--danger { background: linear-gradient(135deg, rgba(245,108,108,0.12), rgba(245,108,108,0.02)); }

/* 玻璃拟态卡片 */
.glass-card :deep(.el-card__body) { backdrop-filter: saturate(180%) blur(8px); }
.glass-card { background: rgba(255,255,255,0.6); border: none; box-shadow: 0 8px 30px rgba(31,38,135,0.08); }
.glass-card :deep(.el-card__header) { background: transparent; border-bottom: 1px solid rgba(255,255,255,0.4); }

/* 预约抽屉 */
.reservation-toolbar { display: flex; gap: 8px; margin-bottom: 12px; }
</style>

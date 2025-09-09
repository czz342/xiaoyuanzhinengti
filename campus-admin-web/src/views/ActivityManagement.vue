<template>
  <div class="activity-management">
    <div class="page-header">
      <h2>活动管理</h2>
      <div class="header-actions">
        <el-button v-if="isManageMode" type="primary" @click="handleAddActivity">
          <el-icon><Plus /></el-icon>
          发布活动
        </el-button>
        <el-button type="success" plain @click="toggleMode">
          {{ isManageMode ? '返回可视化看板' : '管理详细数据' }}
        </el-button>
      </div>
    </div>

    <!-- KPI 指标卡片 -->
    <el-row v-if="!isManageMode" :gutter="20" class="kpi-section">
      <el-col :span="6">
        <div class="kpi-card kpi-card-1">
          <div class="kpi-icon">
            <el-icon size="32"><Calendar /></el-icon>
          </div>
          <div class="kpi-content">
            <div class="kpi-value">{{ totalActivities }}</div>
            <div class="kpi-label">总活动数</div>
            <div class="kpi-trend">
              <el-icon><TrendCharts /></el-icon>
              <span>+12 本月</span>
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
            <div class="kpi-value">{{ totalParticipants }}</div>
            <div class="kpi-label">总参与人数</div>
            <div class="kpi-trend">
              <el-icon><TrendCharts /></el-icon>
              <span>+25.6% 本月</span>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="kpi-card kpi-card-3">
          <div class="kpi-icon">
            <el-icon size="32"><VideoPlay /></el-icon>
          </div>
          <div class="kpi-content">
            <div class="kpi-value">{{ ongoingActivities }}</div>
            <div class="kpi-label">进行中活动</div>
            <div class="kpi-trend">
              <el-icon><TrendCharts /></el-icon>
              <span>+3 本周</span>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="kpi-card kpi-card-4">
          <div class="kpi-icon">
            <el-icon size="32"><Star /></el-icon>
          </div>
          <div class="kpi-content">
            <div class="kpi-value">{{ avgParticipants }}</div>
            <div class="kpi-label">平均参与人数</div>
            <div class="kpi-trend">
              <el-icon><TrendCharts /></el-icon>
              <span>+8.2% 本月</span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 活动列表 -->
    <el-card v-if="isManageMode" class="activity-list glass-card">
      <template #header>
        <div class="card-header">
          <span>活动列表</span>
          <div class="header-filters">
            <el-select v-model="filters.status" placeholder="活动状态" clearable style="width: 120px; margin-right: 10px;">
              <el-option label="全部" value="" />
              <el-option label="草稿" value="draft" />
              <el-option label="已发布" value="published" />
              <el-option label="进行中" value="ongoing" />
              <el-option label="已完成" value="completed" />
              <el-option label="已取消" value="cancelled" />
            </el-select>
            <el-select v-model="filters.club_id" placeholder="选择社团" clearable style="width: 150px; margin-right: 10px;">
              <el-option label="全部社团" value="" />
              <el-option 
                v-for="club in clubList" 
                :key="club.id" 
                :label="club.name" 
                :value="club.id" 
              />
            </el-select>
            <el-input v-model="filters.keyword" placeholder="搜索活动" style="width: 200px; margin-right: 10px;">
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-button type="primary" @click="handleSearch">
              <el-icon><Search /></el-icon>
              搜索
            </el-button>
          </div>
        </div>
      </template>
      
      <el-table :data="activityList" stripe v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="活动标题" width="200" show-overflow-tooltip />
        <el-table-column prop="club_name" label="主办社团" width="150" />
        <el-table-column prop="start_time" label="开始时间" width="160">
          <template #default="{ row }">
            {{ formatDateTime(row.start_time) }}
          </template>
        </el-table-column>
        <el-table-column prop="location" label="活动地点" width="150" show-overflow-tooltip />
        <el-table-column label="参与人数" width="120">
          <template #default="{ row }">
            {{ row.current_participants }}/{{ row.max_participants }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280" class-name="op-actions">
          <template #default="{ row }">
            <el-button size="small" @click="handleViewActivity(row)">查看</el-button>
            <el-button size="small" type="primary" @click="handleEditActivity(row)">编辑</el-button>
            <el-button size="small" type="success" @click="handleManageParticipants(row)">参与者</el-button>
            <el-button size="small" type="danger" @click="handleDeleteActivity(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.limit"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 添加/编辑活动对话框 -->
    <el-dialog
      v-model="activityDialogVisible"
      :title="isEditMode ? '编辑活动' : '发布活动'"
      width="800px"
      :before-close="handleDialogClose"
    >
      <el-form
        ref="activityFormRef"
        :model="activityForm"
        :rules="activityFormRules"
        label-width="100px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="活动标题" prop="title">
              <el-input v-model="activityForm.title" placeholder="请输入活动标题" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="主办社团" prop="club_id">
              <el-select v-model="activityForm.club_id" placeholder="请选择社团" style="width: 100%">
                <el-option 
                  v-for="club in clubList" 
                  :key="club.id" 
                  :label="club.name" 
                  :value="club.id" 
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="活动描述" prop="description">
          <el-input
            v-model="activityForm.description"
            type="textarea"
            :rows="4"
            placeholder="请输入活动描述"
          />
        </el-form-item>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="开始时间" prop="start_time">
              <el-date-picker
                v-model="activityForm.start_time"
                type="datetime"
                placeholder="选择开始时间"
                style="width: 100%"
                format="YYYY-MM-DD HH:mm"
                value-format="YYYY-MM-DD HH:mm:ss"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束时间" prop="end_time">
              <el-date-picker
                v-model="activityForm.end_time"
                type="datetime"
                placeholder="选择结束时间"
                style="width: 100%"
                format="YYYY-MM-DD HH:mm"
                value-format="YYYY-MM-DD HH:mm:ss"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="活动地点" prop="location">
              <el-input v-model="activityForm.location" placeholder="请输入活动地点" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最大参与人数" prop="max_participants">
              <el-input-number 
                v-model="activityForm.max_participants" 
                :min="1" 
                :max="1000" 
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="报名截止时间" prop="registration_deadline">
          <el-date-picker
            v-model="activityForm.registration_deadline"
            type="datetime"
            placeholder="选择报名截止时间"
            style="width: 100%"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        
        <el-form-item label="活动标签" prop="tags">
          <el-select
            v-model="activityForm.tags"
            multiple
            filterable
            allow-create
            placeholder="请选择或输入活动标签"
            style="width: 100%"
          >
            <el-option label="技术分享" value="技术分享" />
            <el-option label="学术讲座" value="学术讲座" />
            <el-option label="文艺表演" value="文艺表演" />
            <el-option label="体育竞技" value="体育竞技" />
            <el-option label="志愿服务" value="志愿服务" />
            <el-option label="社会实践" value="社会实践" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="活动状态" prop="status">
          <el-select v-model="activityForm.status" placeholder="请选择状态" style="width: 100%">
            <el-option label="草稿" value="draft" />
            <el-option label="已发布" value="published" />
            <el-option label="进行中" value="ongoing" />
            <el-option label="已完成" value="completed" />
            <el-option label="已取消" value="cancelled" />
          </el-select>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleDialogClose">取消</el-button>
          <el-button type="primary" @click="handleSubmitActivity" :loading="submitting">
            {{ isEditMode ? '更新' : '发布' }}
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 参与者管理对话框 -->
    <el-dialog
      v-model="participantDialogVisible"
      title="参与者管理"
      width="1000px"
    >
      <div class="participant-header">
        <h3>{{ currentActivity?.title }}</h3>
        <div class="participant-stats">
          <el-tag type="success">已报名: {{ participantStats.registered }}</el-tag>
          <el-tag type="primary">已参与: {{ participantStats.attended }}</el-tag>
          <el-tag type="warning">缺席: {{ participantStats.absent }}</el-tag>
        </div>
      </div>
      
      <el-table :data="participantList" stripe v-loading="participantLoading">
        <el-table-column prop="user_name" label="参与者" width="150" />
        <el-table-column prop="registration_time" label="报名时间" width="160">
          <template #default="{ row }">
            {{ formatDateTime(row.registration_time) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="getParticipantStatusType(row.status)">
              {{ getParticipantStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button 
              size="small" 
              type="success" 
              @click="handleUpdateParticipantStatus(row, 'attended')"
              :disabled="row.status === 'attended'"
            >
              标记参与
            </el-button>
            <el-button 
              size="small" 
              type="warning" 
              @click="handleUpdateParticipantStatus(row, 'absent')"
              :disabled="row.status === 'absent'"
            >
              标记缺席
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 活动数据可视化 -->
    <el-row v-if="!isManageMode" :gutter="20" class="charts-section">
      <el-col :span="8">
        <el-card class="glass-card">
          <template #header>
            <span>热门活动排行</span>
          </template>
          <div ref="popularActivitiesChart" class="chart-container"></div>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card class="glass-card">
          <template #header>
            <span>活动类型分布</span>
          </template>
          <div ref="categoryDistributionChart" class="chart-container"></div>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card class="glass-card">
          <template #header>
            <span>活动发布趋势</span>
          </template>
          <div ref="activityTrendChart" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 活动参与度分析 -->
    <el-card v-if="!isManageMode" class="participation-section glass-card">
      <template #header>
        <span>活动参与度分析</span>
      </template>
      <div ref="participationAnalysisChart" class="participation-chart"></div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, watch, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Plus, Search, Calendar, User, VideoPlay, Star, TrendCharts 
} from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import { 
  getActivityList, 
  getActivityDetail, 
  createActivity, 
  updateActivity, 
  deleteActivity,
  getActivityParticipants,
  updateParticipantStatus,
  getActivityStats,
  type Activity,
  type ActivityParticipant
} from '@/api/activity'
import { getClubList, type Club } from '@/api/club'

// 数据状态
const activityList = ref<Activity[]>([])
const clubList = ref<Club[]>([])
const participantList = ref<ActivityParticipant[]>([])
const loading = ref(false)
const participantLoading = ref(false)

// KPI 数据
const totalActivities = ref(0)
const totalParticipants = ref(0)
const ongoingActivities = ref(0)
const avgParticipants = ref(0)

// 筛选条件
const filters = reactive({
  status: '',
  club_id: '',
  keyword: ''
})

// 分页
const pagination = reactive({
  page: 1,
  limit: 10,
  total: 0
})

// 对话框状态
const activityDialogVisible = ref(false)
const participantDialogVisible = ref(false)
const isEditMode = ref(false)
const submitting = ref(false)
const activityFormRef = ref()
const currentActivity = ref<Activity | null>(null)

// 活动表单
const activityForm = reactive({
  id: 0,
  club_id: 0,
  title: '',
  description: '',
  start_time: '',
  end_time: '',
  location: '',
  max_participants: 50,
  registration_deadline: '',
  cover_image: '',
  tags: [],
  status: 'draft'
})

// 表单验证规则
const activityFormRules = {
  title: [
    { required: true, message: '请输入活动标题', trigger: 'blur' },
    { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
  ],
  club_id: [
    { required: true, message: '请选择主办社团', trigger: 'change' }
  ],
  start_time: [
    { required: true, message: '请选择开始时间', trigger: 'change' }
  ],
  end_time: [
    { required: true, message: '请选择结束时间', trigger: 'change' }
  ],
  location: [
    { required: true, message: '请输入活动地点', trigger: 'blur' }
  ],
  max_participants: [
    { required: true, message: '请输入最大参与人数', trigger: 'blur' }
  ],
  registration_deadline: [
    { required: true, message: '请选择报名截止时间', trigger: 'change' }
  ],
  status: [
    { required: true, message: '请选择活动状态', trigger: 'change' }
  ]
}

// 参与者统计
const participantStats = computed(() => {
  const stats = {
    registered: 0,
    attended: 0,
    absent: 0
  }
  
  participantList.value.forEach(participant => {
    if (participant.status === 'registered') stats.registered++
    else if (participant.status === 'attended') stats.attended++
    else if (participant.status === 'absent') stats.absent++
  })
  
  return stats
})

// 图表引用
const popularActivitiesChart = ref<HTMLElement>()
const categoryDistributionChart = ref<HTMLElement>()
const activityTrendChart = ref<HTMLElement>()
const participationAnalysisChart = ref<HTMLElement>()

// 获取状态类型
const getStatusType = (status: string) => {
  switch (status) {
    case 'draft': return 'info'
    case 'published': return 'success'
    case 'ongoing': return 'primary'
    case 'completed': return 'success'
    case 'cancelled': return 'danger'
    default: return 'info'
  }
}

// 获取状态文本
const getStatusText = (status: string) => {
  switch (status) {
    case 'draft': return '草稿'
    case 'published': return '已发布'
    case 'ongoing': return '进行中'
    case 'completed': return '已完成'
    case 'cancelled': return '已取消'
    default: return '未知'
  }
}

// 获取参与者状态类型
const getParticipantStatusType = (status: string) => {
  switch (status) {
    case 'registered': return 'info'
    case 'attended': return 'success'
    case 'absent': return 'warning'
    default: return 'info'
  }
}

// 获取参与者状态文本
const getParticipantStatusText = (status: string) => {
  switch (status) {
    case 'registered': return '已报名'
    case 'attended': return '已参与'
    case 'absent': return '缺席'
    default: return '未知'
  }
}

// 格式化日期时间
const formatDateTime = (dateTime: string) => {
  if (!dateTime) return ''
  return new Date(dateTime).toLocaleString('zh-CN')
}

// 加载活动列表
const loadActivityList = async () => {
  loading.value = true
  try {
    const response = await getActivityList({
      page: pagination.page,
      limit: pagination.limit,
      ...filters
    })
    activityList.value = response.data.activities
    pagination.total = response.data.pagination.total
  } catch (error) {
    ElMessage.error('加载活动列表失败')
  } finally {
    loading.value = false
  }
}

// 加载社团列表
const loadClubList = async () => {
  try {
    const response = await getClubList({ page: 1, limit: 1000 })
    clubList.value = response.data.clubs
  } catch (error) {
    ElMessage.error('加载社团列表失败')
  }
}

// 加载统计数据
const loadStats = async () => {
  try {
    const response = await getActivityStats()
    const stats = response.data.overview
    totalActivities.value = stats.total_activities || 0
    totalParticipants.value = stats.total_participants || 0
    ongoingActivities.value = stats.ongoing_activities || 0
    avgParticipants.value = stats.avg_participants_per_activity || 0
  } catch (error) {
    ElMessage.error('加载统计数据失败')
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  loadActivityList()
}

// 分页变化
const handleSizeChange = (val: number) => {
  pagination.limit = val
  pagination.page = 1
  loadActivityList()
}

const handleCurrentChange = (val: number) => {
  pagination.page = val
  loadActivityList()
}

// 重置表单
const resetForm = () => {
  Object.assign(activityForm, {
    id: 0,
    club_id: 0,
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    location: '',
    max_participants: 50,
    registration_deadline: '',
    cover_image: '',
    tags: [],
    status: 'draft'
  })
  if (activityFormRef.value) {
    activityFormRef.value.clearValidate()
  }
}

// 添加活动
const handleAddActivity = () => {
  resetForm()
  isEditMode.value = false
  activityDialogVisible.value = true
}

// 编辑活动
const handleEditActivity = (row: Activity) => {
  resetForm()
  Object.assign(activityForm, {
    id: row.id,
    club_id: row.club_id,
    title: row.title,
    description: row.description || '',
    start_time: row.start_time,
    end_time: row.end_time,
    location: row.location,
    max_participants: row.max_participants,
    registration_deadline: row.registration_deadline,
    cover_image: row.cover_image || '',
    tags: row.tags || [],
    status: row.status
  })
  isEditMode.value = true
  activityDialogVisible.value = true
}

// 查看活动
const handleViewActivity = (row: Activity) => {
  ElMessage.info(`查看活动: ${row.title}`)
}

// 关闭对话框
const handleDialogClose = () => {
  activityDialogVisible.value = false
  resetForm()
}

// 提交活动表单
const handleSubmitActivity = async () => {
  if (!activityFormRef.value) return
  
  try {
    await activityFormRef.value.validate()
    submitting.value = true
    
    if (isEditMode.value) {
      await updateActivity(activityForm.id, activityForm)
      ElMessage.success('更新活动成功')
    } else {
      await createActivity(activityForm)
      ElMessage.success('发布活动成功')
    }
    
    activityDialogVisible.value = false
    resetForm()
    loadActivityList()
    loadStats()
  } catch (error) {
    ElMessage.error(isEditMode.value ? '更新活动失败' : '发布活动失败')
  } finally {
    submitting.value = false
  }
}

// 参与者管理
const handleManageParticipants = async (row: Activity) => {
  currentActivity.value = row
  participantDialogVisible.value = true
  await loadParticipants(row.id)
}

// 加载参与者列表
const loadParticipants = async (activityId: number) => {
  participantLoading.value = true
  try {
    const response = await getActivityParticipants(activityId)
    participantList.value = response.data.participants
  } catch (error) {
    ElMessage.error('加载参与者列表失败')
  } finally {
    participantLoading.value = false
  }
}

// 更新参与者状态
const handleUpdateParticipantStatus = async (participant: ActivityParticipant, status: string) => {
  try {
    await updateParticipantStatus(participant.activity_id, participant.id, status)
    ElMessage.success('状态更新成功')
    await loadParticipants(participant.activity_id)
  } catch (error) {
    ElMessage.error('状态更新失败')
  }
}

// 删除活动
const handleDeleteActivity = async (row: Activity) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除活动 "${row.title}" 吗？此操作不可恢复。`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    await deleteActivity(row.id)
    ElMessage.success('删除成功')
    loadActivityList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 初始化图表
const initCharts = () => {
  nextTick(() => {
    // 热门活动排行
    if (popularActivitiesChart.value) {
      const chart = echarts.init(popularActivitiesChart.value)
      const option = {
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'value' },
        yAxis: {
          type: 'category',
          data: ['编程竞赛', '摄影展', '篮球赛', '音乐会', '讲座']
        },
        series: [{
          data: [45, 38, 32, 28, 25],
          type: 'bar',
          itemStyle: { 
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: '#667eea' },
              { offset: 1, color: '#764ba2' }
            ])
          }
        }]
      }
      chart.setOption(option)
    }

    // 活动类型分布
    if (categoryDistributionChart.value) {
      const chart = echarts.init(categoryDistributionChart.value)
      const option = {
        tooltip: { trigger: 'item' },
        series: [{
          type: 'pie',
          radius: ['40%', '70%'],
          data: [
            { value: 8, name: '技术类' },
            { value: 6, name: '艺术类' },
            { value: 4, name: '体育类' },
            { value: 3, name: '文化类' }
          ],
          itemStyle: {
            borderRadius: 8,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: true,
            formatter: '{b}: {c}'
          }
        }]
      }
      chart.setOption(option)
    }

    // 活动发布趋势
    if (activityTrendChart.value) {
      const chart = echarts.init(activityTrendChart.value)
      const option = {
        tooltip: { trigger: 'axis' },
        xAxis: {
          type: 'category',
          data: ['1月', '2月', '3月', '4月', '5月', '6月']
        },
        yAxis: { type: 'value' },
        series: [{
          data: [12, 15, 18, 22, 25, 28],
          type: 'line',
          smooth: true,
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(102, 126, 234, 0.3)' },
              { offset: 1, color: 'rgba(102, 126, 234, 0.1)' }
            ])
          },
          lineStyle: {
            color: '#667eea'
          }
        }]
      }
      chart.setOption(option)
    }

    // 活动参与度分析
    if (participationAnalysisChart.value) {
      const chart = echarts.init(participationAnalysisChart.value)
      const option = {
        tooltip: { trigger: 'axis' },
        xAxis: {
          type: 'category',
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: { type: 'value' },
        series: [{
          name: '参与人数',
          data: [120, 200, 150, 80, 70, 110, 130],
          type: 'bar',
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#4facfe' },
              { offset: 1, color: '#00f2fe' }
            ])
          }
        }]
      }
      chart.setOption(option)
    }
  })
}

onMounted(async () => {
  await Promise.all([
    loadStats(),
    loadClubList()
  ])
  if (!isManageMode.value) {
    initCharts()
  }
})

// 看板/管理切换
const isManageMode = ref(false)
const toggleMode = () => {
  isManageMode.value = !isManageMode.value
  if (isManageMode.value) {
    loadActivityList()
  } else {
    nextTick(() => initCharts())
  }
}

// 切回看板后重绘图表
watch(isManageMode, (val) => {
  if (!val) {
    nextTick(() => initCharts())
  }
})
</script>

<style scoped>
.activity-management {
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

.activity-list {
  margin-bottom: 20px;
}

.charts-section {
  margin-bottom: 20px;
}

.chart-container {
  height: 250px;
}

.participation-section {
  margin-bottom: 20px;
}

.participation-chart {
  height: 400px;
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

/* KPI 卡片样式 */
.kpi-section {
  margin-bottom: 30px;
}

.kpi-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
}

.kpi-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.kpi-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2, #f093fb);
}

.kpi-card-1::before {
  background: linear-gradient(90deg, #667eea, #764ba2);
}

.kpi-card-2::before {
  background: linear-gradient(90deg, #f093fb, #f5576c);
}

.kpi-card-3::before {
  background: linear-gradient(90deg, #4facfe, #00f2fe);
}

.kpi-card-4::before {
  background: linear-gradient(90deg, #43e97b, #38f9d7);
}

.kpi-card {
  display: flex;
  align-items: center;
  gap: 20px;
}

.kpi-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 32px;
}

.kpi-card-1 .kpi-icon {
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.kpi-card-2 .kpi-icon {
  background: linear-gradient(135deg, #f093fb, #f5576c);
}

.kpi-card-3 .kpi-icon {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
}

.kpi-card-4 .kpi-icon {
  background: linear-gradient(135deg, #43e97b, #38f9d7);
}

.kpi-content {
  flex: 1;
}

.kpi-value {
  font-size: 32px;
  font-weight: 800;
  color: #2c3e50;
  margin-bottom: 8px;
  line-height: 1;
}

.kpi-label {
  font-size: 14px;
  color: #7f8c8d;
  margin-bottom: 8px;
  font-weight: 500;
}

.kpi-trend {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #27ae60;
  font-weight: 600;
}

/* 卡片头部样式 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-filters {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* 分页样式 */
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

/* 操作按钮不换行 */
.op-actions {
  white-space: nowrap;
}

/* 参与者管理样式 */
.participant-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #ebeef5;
}

.participant-header h3 {
  margin: 0;
  color: #303133;
}

.participant-stats {
  display: flex;
  gap: 10px;
}
</style>




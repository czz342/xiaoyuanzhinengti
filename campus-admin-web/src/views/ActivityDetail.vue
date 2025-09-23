<template>
  <div class="activity-detail">
    <!-- 返回按钮 -->
    <div class="back-button">
      <el-button @click="goBack" :icon="ArrowLeft">返回</el-button>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="8" animated />
    </div>

    <!-- 活动详情内容 -->
    <div v-else-if="activity" class="activity-content">
      <!-- 活动头部信息 -->
      <el-card class="activity-header">
        <div class="header-content">
          <div class="activity-image">
            <img v-if="activity.image_url" :src="activity.image_url" :alt="activity.title" />
            <div v-else class="no-image">
              <el-icon size="64"><Picture /></el-icon>
              <p>暂无图片</p>
            </div>
          </div>
          <div class="activity-info">
            <h1 class="activity-title">{{ activity.title }}</h1>
            <div class="activity-meta">
              <div class="meta-item">
                <el-icon><Calendar /></el-icon>
                <span>{{ formatDateTime(activity.start_time) }} - {{ formatDateTime(activity.end_time) }}</span>
              </div>
              <div class="meta-item">
                <el-icon><Location /></el-icon>
                <span>{{ activity.location }}</span>
              </div>
              <div class="meta-item">
                <el-icon><User /></el-icon>
                <span>{{ activity.club_name }}</span>
              </div>
              <div class="meta-item">
                <el-icon><Users /></el-icon>
                <span>{{ activity.current_participants }}/{{ activity.max_participants }} 人</span>
              </div>
            </div>
            <div class="activity-status">
              <el-tag :type="getStatusType(activity.status)" size="large">
                {{ getStatusText(activity.status) }}
              </el-tag>
              <el-tag v-if="activity.is_featured" type="warning" size="large">精选</el-tag>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 活动描述 -->
      <el-card class="activity-description">
        <template #header>
          <h3>活动描述</h3>
        </template>
        <div class="description-content">
          {{ activity.description }}
        </div>
      </el-card>

      <!-- 活动统计 -->
      <el-row :gutter="20" class="stats-section">
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon">
              <el-icon size="24"><Trophy /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ activity.points_reward }}</div>
              <div class="stat-label">积分奖励</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon">
              <el-icon size="24"><Star /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ activity.min_credibility }}</div>
              <div class="stat-label">最低诚信度</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon">
              <el-icon size="24"><Clock /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ getDuration(activity.start_time, activity.end_time) }}</div>
              <div class="stat-label">活动时长</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon">
              <el-icon size="24"><User /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ activity.created_by }}</div>
              <div class="stat-label">创建者</div>
            </div>
          </div>
        </el-col>
      </el-row>

      <!-- 参与者管理 -->
      <el-card class="participants-section">
        <template #header>
          <div class="participants-header">
            <h3>参与者管理</h3>
            <div class="participants-actions">
              <el-button @click="loadParticipants" :loading="participantsLoading">
                <el-icon><Refresh /></el-icon>
                刷新
              </el-button>
            </div>
          </div>
        </template>

        <!-- 参与者列表 -->
        <el-table :data="participants" v-loading="participantsLoading">
          <el-table-column label="参与者" width="150">
            <template #default="{ row }">
              <div class="participant-info">
                <el-avatar :src="row.user_avatar" :size="32">
                  <el-icon><User /></el-icon>
                </el-avatar>
                <span class="participant-name">{{ row.user_display_name || row.user_name }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="getParticipantStatusType(row.status)">
                {{ getParticipantStatusText(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="registration_time" label="报名时间" width="180">
            <template #default="{ row }">
              {{ formatDateTime(row.registration_time) }}
            </template>
          </el-table-column>
          <el-table-column prop="attendance_time" label="签到时间" width="180">
            <template #default="{ row }">
              {{ row.attendance_time ? formatDateTime(row.attendance_time) : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="{ row }">
              <el-button size="small" @click="handleMarkAttendance(row)" v-if="row.status === 'registered'">
                签到
              </el-button>
              <el-button size="small" type="danger" @click="handleRemoveParticipant(row)">
                移除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination
            v-model:current-page="participantsPagination.page"
            v-model:page-size="participantsPagination.limit"
            :page-sizes="[10, 20, 50, 100]"
            :total="participantsPagination.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="loadParticipants"
            @current-change="loadParticipants"
          />
        </div>
      </el-card>
    </div>

    <!-- 错误状态 -->
    <div v-else class="error-container">
      <el-empty description="活动不存在或已被删除">
        <el-button @click="goBack">返回列表</el-button>
      </el-empty>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  ArrowLeft, Calendar, Location, User, Picture, 
  Trophy, Star, Clock, Refresh 
} from '@element-plus/icons-vue'
import { getActivityDetail, getActivityParticipants, markAttendance, removeParticipant } from '@/api/activity'

const route = useRoute()
const router = useRouter()

// 响应式数据
const loading = ref(true)
const activity = ref<any>(null)
const participants = ref<any[]>([])
const participantsLoading = ref(false)
const participantsPagination = ref({
  page: 1,
  limit: 10,
  total: 0
})

// 获取活动ID
const activityId = computed(() => route.params.id as string)

// 加载活动详情
const loadActivityDetail = async () => {
  try {
    loading.value = true
    const response = await getActivityDetail(Number(activityId.value))
    if (response.data) {
      activity.value = response.data
    } else {
      ElMessage.error('获取活动详情失败')
    }
  } catch (error) {
    console.error('加载活动详情失败:', error)
    ElMessage.error('加载活动详情失败')
  } finally {
    loading.value = false
  }
}

// 加载参与者列表
const loadParticipants = async () => {
  try {
    participantsLoading.value = true
    const response = await getActivityParticipants(Number(activityId.value), {
      page: participantsPagination.value.page,
      limit: participantsPagination.value.limit
    })
    if (response.data) {
      participants.value = response.data.participants
      participantsPagination.value.total = response.data.pagination.total
    } else {
      ElMessage.error('获取参与者列表失败')
    }
  } catch (error) {
    console.error('加载参与者列表失败:', error)
    ElMessage.error('加载参与者列表失败')
  } finally {
    participantsLoading.value = false
  }
}

// 格式化日期时间
const formatDateTime = (dateTime: string) => {
  if (!dateTime) return '-'
  return new Date(dateTime).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 获取活动状态类型
const getStatusType = (status: string) => {
  const statusMap: Record<string, string> = {
    'draft': 'info',
    'published': 'success',
    'cancelled': 'danger',
    'completed': 'warning'
  }
  return statusMap[status] || 'info'
}

// 获取活动状态文本
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'draft': '草稿',
    'published': '已发布',
    'cancelled': '已取消',
    'completed': '已完成'
  }
  return statusMap[status] || '未知'
}

// 获取参与者状态类型
const getParticipantStatusType = (status: string) => {
  const statusMap: Record<string, string> = {
    'registered': 'primary',
    'attended': 'success',
    'absent': 'danger',
    'cancelled': 'info'
  }
  return statusMap[status] || 'info'
}

// 获取参与者状态文本
const getParticipantStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'registered': '已报名',
    'attended': '已签到',
    'absent': '缺席',
    'cancelled': '已取消'
  }
  return statusMap[status] || '未知'
}

// 计算活动时长
const getDuration = (startTime: string, endTime: string) => {
  if (!startTime || !endTime) return '-'
  const start = new Date(startTime)
  const end = new Date(endTime)
  const diff = end.getTime() - start.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  return `${hours}小时${minutes}分钟`
}

// 处理签到
const handleMarkAttendance = async (participant: any) => {
  try {
    await ElMessageBox.confirm('确认标记为已签到？', '确认操作', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    const response = await markAttendance(participant.id)
    if (response.data) {
      ElMessage.success('签到成功')
      loadParticipants()
    } else {
      ElMessage.error('签到失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('签到失败:', error)
      ElMessage.error('签到失败')
    }
  }
}

// 处理移除参与者
const handleRemoveParticipant = async (participant: any) => {
  try {
    await ElMessageBox.confirm('确认移除该参与者？', '确认操作', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    const response = await removeParticipant(participant.id)
    if (response.data) {
      ElMessage.success('移除成功')
      loadParticipants()
    } else {
      ElMessage.error('移除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('移除失败:', error)
      ElMessage.error('移除失败')
    }
  }
}

// 返回上一页
const goBack = () => {
  router.go(-1)
}

// 组件挂载时加载数据
onMounted(() => {
  loadActivityDetail()
  loadParticipants()
})
</script>

<style scoped>
.activity-detail {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.back-button {
  margin-bottom: 20px;
}

.loading-container {
  padding: 40px;
}

.activity-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.activity-header {
  margin-bottom: 20px;
}

.header-content {
  display: flex;
  gap: 20px;
}

.activity-image {
  width: 200px;
  height: 150px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.activity-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  color: #909399;
}

.activity-info {
  flex: 1;
}

.activity-title {
  font-size: 24px;
  font-weight: bold;
  margin: 0 0 16px 0;
  color: #303133;
}

.activity-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #606266;
  font-size: 14px;
}

.activity-status {
  display: flex;
  gap: 8px;
}

.activity-description {
  margin-bottom: 20px;
}

.description-content {
  line-height: 1.6;
  color: #606266;
  white-space: pre-wrap;
}

.stats-section {
  margin-bottom: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.stat-icon {
  margin-right: 16px;
  opacity: 0.9;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  opacity: 0.9;
}

.participants-section {
  margin-bottom: 20px;
}

.participants-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.participants-header h3 {
  margin: 0;
}

.participant-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.participant-name {
  font-weight: 500;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.error-container {
  padding: 40px;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
  }
  
  .activity-image {
    width: 100%;
    height: 200px;
  }
  
  .stats-section .el-col {
    margin-bottom: 16px;
  }
}
</style>

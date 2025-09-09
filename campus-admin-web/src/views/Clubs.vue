<template>
  <div class="clubs-page">
    <div class="page-header">
      <h2>社团活动管理</h2>
      <div class="header-actions">
        <el-button v-if="isManageMode" type="primary" @click="handleAddClub">
          <el-icon><Plus /></el-icon>
          添加社团
        </el-button>
        <el-button type="success" plain @click="toggleMode">{{ isManageMode ? '返回可视化看板' : '管理详细数据' }}</el-button>
      </div>
    </div>

    <!-- KPI 指标卡片 -->
    <el-row v-if="!isManageMode" :gutter="20" class="kpi-section">
      <el-col :span="6">
        <div class="kpi-card kpi-card-1">
          <div class="kpi-icon">
            <el-icon size="32"><UserFilled /></el-icon>
          </div>
          <div class="kpi-content">
            <div class="kpi-value">{{ totalClubs }}</div>
            <div class="kpi-label">总社团数</div>
            <div class="kpi-trend">
              <el-icon><TrendCharts /></el-icon>
              <span>+5 本月</span>
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
            <div class="kpi-value">{{ totalMembers }}</div>
            <div class="kpi-label">总成员数</div>
            <div class="kpi-trend">
              <el-icon><TrendCharts /></el-icon>
              <span>+12.5% 本月</span>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="kpi-card kpi-card-3">
          <div class="kpi-icon">
            <el-icon size="32"><Calendar /></el-icon>
          </div>
          <div class="kpi-content">
            <div class="kpi-value">{{ totalActivities }}</div>
            <div class="kpi-label">总活动数</div>
            <div class="kpi-trend">
              <el-icon><TrendCharts /></el-icon>
              <span>+8 本周</span>
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
            <div class="kpi-value">{{ activeClubs }}</div>
            <div class="kpi-label">活跃社团</div>
            <div class="kpi-trend">
              <el-icon><TrendCharts /></el-icon>
              <span>+2 本周</span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 社团列表 -->
    <el-card v-if="isManageMode" class="clubs-list glass-card">
      <template #header>
        <div class="card-header">
          <span>社团列表</span>
          <div class="header-filters">
            <el-select v-model="filters.category" placeholder="社团类别" clearable style="width: 120px; margin-right: 10px;">
              <el-option label="全部" value="" />
              <el-option label="技术类" value="技术类" />
              <el-option label="艺术类" value="艺术类" />
              <el-option label="体育类" value="体育类" />
              <el-option label="文化类" value="文化类" />
            </el-select>
            <el-select v-model="filters.status" placeholder="社团状态" clearable style="width: 120px; margin-right: 10px;">
              <el-option label="全部" value="" />
              <el-option label="活跃" value="active" />
              <el-option label="暂停" value="inactive" />
              <el-option label="停用" value="suspended" />
            </el-select>
            <el-select v-model="filters.level" placeholder="社团等级" clearable style="width: 120px; margin-right: 10px;">
              <el-option label="全部" value="" />
              <el-option label="A级" value="A" />
              <el-option label="B级" value="B" />
              <el-option label="C级" value="C" />
            </el-select>
            <el-input v-model="filters.keyword" placeholder="搜索社团" style="width: 200px; margin-right: 10px;">
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
      <el-table :data="clubList" stripe v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="社团名称" width="150" />
        <el-table-column prop="category" label="类别" width="120" />
        <el-table-column prop="leader_name" label="负责人" width="120" />
        <el-table-column prop="member_count" label="成员数" width="100" />
        <el-table-column prop="activity_count" label="活动数" width="100" />
        <el-table-column prop="level" label="等级" width="100">
          <template #default="{ row }">
            <el-tag :type="getLevelType(row.level)">
              {{ getLevelText(row.level) }}
            </el-tag>
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
            <el-button size="small" @click="handleEditClub(row)">编辑</el-button>
            <el-button size="small" type="primary" @click="handleManageMembers(row)">成员管理</el-button>
            <el-button size="small" type="success" @click="handleManageActivities(row)">活动管理</el-button>
            <el-button size="small" type="danger" @click="handleDeleteClub(row)">删除</el-button>
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

    <!-- 添加/编辑社团对话框 -->
    <el-dialog
      v-model="clubDialogVisible"
      :title="isEditMode ? '编辑社团' : '添加社团'"
      width="600px"
      :before-close="handleDialogClose"
    >
      <el-form
        ref="clubFormRef"
        :model="clubForm"
        :rules="clubFormRules"
        label-width="100px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="社团名称" prop="name">
              <el-input v-model="clubForm.name" placeholder="请输入社团名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="社团类别" prop="category">
              <el-select v-model="clubForm.category" placeholder="请选择类别" style="width: 100%">
                <el-option label="技术类" value="技术类" />
                <el-option label="艺术类" value="艺术类" />
                <el-option label="体育类" value="体育类" />
                <el-option label="文化类" value="文化类" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="社团描述" prop="description">
          <el-input
            v-model="clubForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入社团描述"
          />
        </el-form-item>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="社长姓名" prop="leader_name">
              <el-input v-model="clubForm.leader_name" placeholder="请输入社长姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="社长电话" prop="leader_phone">
              <el-input v-model="clubForm.leader_phone" placeholder="请输入社长电话" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="联系邮箱" prop="contact_email">
              <el-input v-model="clubForm.contact_email" placeholder="请输入联系邮箱" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="contact_phone">
              <el-input v-model="clubForm.contact_phone" placeholder="请输入联系电话" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="活动地点" prop="meeting_place">
              <el-input v-model="clubForm.meeting_place" placeholder="请输入活动地点" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="活动时间" prop="meeting_time">
              <el-input v-model="clubForm.meeting_time" placeholder="请输入活动时间" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="社团等级" prop="level">
              <el-select v-model="clubForm.level" placeholder="请选择等级" style="width: 100%">
                <el-option label="A级" value="A" />
                <el-option label="B级" value="B" />
                <el-option label="C级" value="C" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="社团状态" prop="status">
              <el-select v-model="clubForm.status" placeholder="请选择状态" style="width: 100%">
                <el-option label="活跃" value="active" />
                <el-option label="暂停" value="inactive" />
                <el-option label="停用" value="suspended" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="入社要求" prop="requirements">
          <el-input
            v-model="clubForm.requirements"
            type="textarea"
            :rows="2"
            placeholder="请输入入社要求"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleDialogClose">取消</el-button>
          <el-button type="primary" @click="handleSubmitClub" :loading="submitting">
            {{ isEditMode ? '更新' : '创建' }}
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 社团数据可视化 -->
    <el-row v-if="!isManageMode" :gutter="20" class="charts-section">
      <el-col :span="8">
        <el-card class="glass-card">
          <template #header>
            <span>社团活跃度排行</span>
          </template>
          <div ref="activityRankingChart" class="chart-container"></div>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card class="glass-card">
          <template #header>
            <span>社团类型分布</span>
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

    <!-- 社团协作网络 -->
    <el-card v-if="!isManageMode" class="network-section glass-card">
      <template #header>
        <span>社团协作网络</span>
      </template>
      <div ref="collaborationNetworkChart" class="network-chart"></div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, UserFilled, User, Calendar, Star, TrendCharts } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import { getClubList, getClubStats, deleteClub, createClub, updateClub, type Club } from '@/api/club'

// 数据状态
const clubList = ref<Club[]>([])
const loading = ref(false)

// KPI 数据
const totalClubs = ref(0)
const totalMembers = ref(0)
const totalActivities = ref(0)
const activeClubs = ref(0)

// 筛选条件
const filters = reactive({
  category: '',
  status: '',
  level: '',
  keyword: ''
})

// 分页
const pagination = reactive({
  page: 1,
  limit: 10,
  total: 0
})

// 对话框状态
const clubDialogVisible = ref(false)
const isEditMode = ref(false)
const submitting = ref(false)
const clubFormRef = ref()

// 社团表单
const clubForm = reactive({
  id: 0,
  name: '',
  description: '',
  category: '',
  leader_name: '',
  leader_phone: '',
  contact_email: '',
  contact_phone: '',
  meeting_place: '',
  meeting_time: '',
  level: 'C',
  status: 'active',
  requirements: ''
})

// 表单验证规则
const clubFormRules = {
  name: [
    { required: true, message: '请输入社团名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择社团类别', trigger: 'change' }
  ],
  leader_name: [
    { required: true, message: '请输入社长姓名', trigger: 'blur' }
  ],
  level: [
    { required: true, message: '请选择社团等级', trigger: 'change' }
  ],
  status: [
    { required: true, message: '请选择社团状态', trigger: 'change' }
  ]
}

// 图表引用
const activityRankingChart = ref<HTMLElement>()
const categoryDistributionChart = ref<HTMLElement>()
const activityTrendChart = ref<HTMLElement>()
const collaborationNetworkChart = ref<HTMLElement>()

// 获取等级类型
const getLevelType = (level: string) => {
  switch (level) {
    case 'A': return 'success'
    case 'B': return 'warning'
    case 'C': return 'info'
    default: return 'info'
  }
}

// 获取等级文本
const getLevelText = (level: string) => {
  switch (level) {
    case 'A': return 'A级'
    case 'B': return 'B级'
    case 'C': return 'C级'
    default: return '未知'
  }
}

// 获取状态类型
const getStatusType = (status: string) => {
  switch (status) {
    case 'active': return 'success'
    case 'inactive': return 'warning'
    case 'suspended': return 'danger'
    default: return 'info'
  }
}

// 获取状态文本
const getStatusText = (status: string) => {
  switch (status) {
    case 'active': return '活跃'
    case 'inactive': return '暂停'
    case 'suspended': return '停用'
    default: return '未知'
  }
}

// 加载社团列表
const loadClubList = async () => {
  loading.value = true
  try {
    const response = await getClubList({
      page: pagination.page,
      limit: pagination.limit,
      ...filters
    })
    clubList.value = response.data.clubs
    pagination.total = response.data.pagination.total
  } catch (error) {
    ElMessage.error('加载社团列表失败')
  } finally {
    loading.value = false
  }
}

// 加载统计数据
const loadStats = async () => {
  try {
    const response = await getClubStats()
    const stats = response.data.overview
    totalClubs.value = stats.total_clubs || 0
    totalMembers.value = stats.total_members || 0
    totalActivities.value = stats.total_activities || 0
    activeClubs.value = stats.active_clubs || 0
  } catch (error) {
    ElMessage.error('加载统计数据失败')
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  loadClubList()
}

// 分页变化
const handleSizeChange = (val: number) => {
  pagination.limit = val
  pagination.page = 1
  loadClubList()
}

const handleCurrentChange = (val: number) => {
  pagination.page = val
  loadClubList()
}

// 重置表单
const resetForm = () => {
  Object.assign(clubForm, {
    id: 0,
    name: '',
    description: '',
    category: '',
    leader_name: '',
    leader_phone: '',
    contact_email: '',
    contact_phone: '',
    meeting_place: '',
    meeting_time: '',
    level: 'C',
    status: 'active',
    requirements: ''
  })
  if (clubFormRef.value) {
    clubFormRef.value.clearValidate()
  }
}

// 添加社团
const handleAddClub = () => {
  resetForm()
  isEditMode.value = false
  clubDialogVisible.value = true
}

// 编辑社团
const handleEditClub = (row: Club) => {
  resetForm()
  Object.assign(clubForm, {
    id: row.id,
    name: row.name,
    description: row.description || '',
    category: row.category,
    leader_name: row.leader_name,
    leader_phone: row.leader_phone || '',
    contact_email: row.contact_email || '',
    contact_phone: row.contact_phone || '',
    meeting_place: row.meeting_place || '',
    meeting_time: row.meeting_time || '',
    level: row.level,
    status: row.status,
    requirements: row.requirements || ''
  })
  isEditMode.value = true
  clubDialogVisible.value = true
}

// 关闭对话框
const handleDialogClose = () => {
  clubDialogVisible.value = false
  resetForm()
}

// 提交社团表单
const handleSubmitClub = async () => {
  if (!clubFormRef.value) return
  
  try {
    await clubFormRef.value.validate()
    submitting.value = true
    
    if (isEditMode.value) {
      await updateClub(clubForm.id, clubForm)
      ElMessage.success('更新社团成功')
    } else {
      await createClub(clubForm)
      ElMessage.success('创建社团成功')
    }
    
    clubDialogVisible.value = false
    resetForm()
    loadClubList()
    loadStats()
  } catch (error) {
    ElMessage.error(isEditMode.value ? '更新社团失败' : '创建社团失败')
  } finally {
    submitting.value = false
  }
}

// 成员管理
const handleManageMembers = (row: Club) => {
  ElMessage.info(`管理社团 ${row.name} 的成员`)
}

// 活动管理
const handleManageActivities = (row: Club) => {
  // 跳转到活动管理页面，并传递社团ID
  window.open(`/activity-management?club_id=${row.id}`, '_blank')
}

// 删除社团
const handleDeleteClub = async (row: Club) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除社团 "${row.name}" 吗？此操作不可恢复。`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    await deleteClub(row.id)
    ElMessage.success('删除成功')
    loadClubList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 初始化图表
const initCharts = () => {
  nextTick(() => {
    // 社团活跃度排行
    if (activityRankingChart.value) {
      const chart = echarts.init(activityRankingChart.value)
      const option = {
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'value' },
        yAxis: {
          type: 'category',
          data: ['篮球社', '计算机协会', '摄影社', '音乐社', '文学社']
        },
        series: [{
          data: [20, 15, 12, 10, 8],
          type: 'bar',
          itemStyle: { color: '#409eff' }
        }]
      }
      chart.setOption(option)
    }

    // 社团类型分布
    if (categoryDistributionChart.value) {
      const chart = echarts.init(categoryDistributionChart.value)
      const option = {
        tooltip: { trigger: 'item' },
        series: [{
          type: 'pie',
          data: [
            { value: 2, name: '技术类' },
            { value: 2, name: '艺术类' },
            { value: 1, name: '体育类' },
            { value: 1, name: '文化类' }
          ]
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
          data: [8, 12, 15, 18, 20, 22],
          type: 'line',
          smooth: true,
          areaStyle: {}
        }]
      }
      chart.setOption(option)
    }

    // 社团协作网络
    if (collaborationNetworkChart.value) {
      const chart = echarts.init(collaborationNetworkChart.value)
      const option = {
        title: { text: '社团协作关系图' },
        tooltip: {},
        series: [{
          type: 'graph',
          layout: 'force',
          data: [
            { name: '计算机协会', category: 0 },
            { name: '摄影社', category: 1 },
            { name: '篮球社', category: 2 },
            { name: '文学社', category: 3 },
            { name: '音乐社', category: 1 }
          ],
          links: [
            { source: '计算机协会', target: '摄影社' },
            { source: '摄影社', target: '音乐社' },
            { source: '篮球社', target: '音乐社' },
            { source: '文学社', target: '音乐社' }
          ],
          categories: [
            { name: '技术类' },
            { name: '艺术类' },
            { name: '体育类' },
            { name: '文化类' }
          ],
          force: {
            repulsion: 100
          }
        }]
      }
      chart.setOption(option)
    }
  })
}

onMounted(async () => {
  await loadStats()
  if (!isManageMode.value) {
    initCharts()
  }
})

// 看板/管理切换
const isManageMode = ref(false)
const toggleMode = () => {
  isManageMode.value = !isManageMode.value
  if (isManageMode.value) {
    loadClubList()
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
.clubs-page {
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

.clubs-list {
  margin-bottom: 20px;
}

.charts-section {
  margin-bottom: 20px;
}

.chart-container {
  height: 250px;
}

.network-section {
  margin-bottom: 20px;
}

.network-chart {
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
</style>

<template>
  <div class="community-page">
    <div class="page-header">
      <h2>校园圈子管理</h2>
      <div class="header-actions">
        <el-button v-if="isManageMode" type="primary" @click="handleAddPost">
          <el-icon><Plus /></el-icon>
          发布公告
        </el-button>
        <el-button type="success" plain @click="toggleMode">{{ isManageMode ? '返回可视化看板' : '管理详细数据' }}</el-button>
      </div>
    </div>

    <!-- KPI 指标卡片 -->
    <el-row v-if="!isManageMode" :gutter="20" class="kpi-section">
      <el-col :span="6">
        <div class="kpi-card kpi-card-1">
          <div class="kpi-icon">
            <el-icon size="32"><Document /></el-icon>
          </div>
          <div class="kpi-content">
            <div class="kpi-value">{{ totalPosts }}</div>
            <div class="kpi-label">总帖子数</div>
            <div class="kpi-trend">
              <el-icon><TrendCharts /></el-icon>
              <span>+12 本周</span>
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
            <div class="kpi-value">{{ activeUsers }}</div>
            <div class="kpi-label">活跃用户</div>
            <div class="kpi-trend">
              <el-icon><TrendCharts /></el-icon>
              <span>+8 今日</span>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="kpi-card kpi-card-3">
          <div class="kpi-icon">
            <el-icon size="32"><ChatDotRound /></el-icon>
          </div>
          <div class="kpi-content">
            <div class="kpi-value">{{ totalComments }}</div>
            <div class="kpi-label">总评论数</div>
            <div class="kpi-trend">
              <el-icon><TrendCharts /></el-icon>
              <span>+45 今日</span>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="kpi-card kpi-card-4">
          <div class="kpi-icon">
            <el-icon size="32"><Warning /></el-icon>
          </div>
          <div class="kpi-content">
            <div class="kpi-value">{{ pendingReports }}</div>
            <div class="kpi-label">待处理举报</div>
            <div class="kpi-trend">
              <el-icon><TrendCharts /></el-icon>
              <span>+3 今日</span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 帖子列表 -->
    <el-card v-if="isManageMode" class="posts-list glass-card">
      <template #header>
        <div class="card-header">
          <span>帖子列表</span>
          <div class="header-filters">
            <el-select v-model="postFilters.category" placeholder="选择分类" clearable style="width: 120px; margin-right: 10px;">
              <el-option label="全部" value="" />
              <el-option label="二手市场" value="second_hand" />
              <el-option label="恋爱交友" value="dating" />
              <el-option label="打听求助" value="help" />
              <el-option label="发布兼职" value="part_time" />
              <el-option label="校园八卦" value="gossip" />
            </el-select>
            <el-input v-model="postFilters.keyword" placeholder="搜索帖子" style="width: 200px; margin-right: 10px;">
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-button type="primary" @click="loadPosts">搜索</el-button>
          </div>
        </div>
      </template>
      <el-table :data="postList" stripe v-loading="postLoading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="标题" width="200" show-overflow-tooltip />
        <el-table-column prop="author_name" label="作者" width="120" />
        <el-table-column prop="category" label="分类" width="120">
          <template #default="{ row }">
            <el-tag :type="getCategoryType(row.category)">
              {{ getCategoryText(row.category) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="like_count" label="点赞数" width="100" />
        <el-table-column prop="comment_count" label="评论数" width="100" />
        <el-table-column prop="view_count" label="浏览数" width="100" />
        <el-table-column prop="created_at" label="发布时间" width="160">
          <template #default="{ row }">
            {{ formatDate(row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <div class="action-buttons">
              <el-button size="small" @click="handleViewPost(row)">查看详情</el-button>
              <el-button size="small" type="primary" @click="handleEditPost(row)">编辑</el-button>
              <el-button size="small" type="danger" @click="handleDeletePost(row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="postPagination.page"
          v-model:page-size="postPagination.limit"
          :page-sizes="[10, 20, 50, 100]"
          :total="postPagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="loadPosts"
          @current-change="loadPosts"
        />
      </div>
    </el-card>

    <!-- 举报管理 -->
    <el-card v-if="isManageMode" class="reports-list glass-card">
      <template #header>
        <div class="card-header">
          <span>举报管理</span>
          <div class="header-filters">
            <el-select v-model="reportFilters.status" placeholder="处理状态" clearable style="width: 120px; margin-right: 10px;">
              <el-option label="全部" value="" />
              <el-option label="待处理" value="pending" />
              <el-option label="已通过" value="approved" />
              <el-option label="已驳回" value="rejected" />
            </el-select>
            <el-select v-model="reportFilters.type" placeholder="举报类型" clearable style="width: 120px; margin-right: 10px;">
              <el-option label="全部" value="" />
              <el-option label="帖子" value="post" />
              <el-option label="评论" value="comment" />
            </el-select>
            <el-button type="primary" @click="loadReports">筛选</el-button>
          </div>
        </div>
      </template>
      <el-table :data="reportList" stripe v-loading="reportLoading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="type" label="类型" width="80">
          <template #default="{ row }">
            <el-tag :type="row.type === 'post' ? 'primary' : 'success'">
              {{ row.type === 'post' ? '帖子' : '评论' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="target_title" label="被举报内容" width="200" show-overflow-tooltip />
        <el-table-column prop="reporter_name" label="举报人" width="120" />
        <el-table-column prop="reason_text" label="举报原因" width="120" />
        <el-table-column prop="status" label="处理状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getReportStatusType(row.status)">
              {{ getReportStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="举报时间" width="160">
          <template #default="{ row }">
            {{ formatDate(row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button v-if="row.status === 'pending'" size="small" type="success" @click="handleApproveReport(row)">通过</el-button>
            <el-button v-if="row.status === 'pending'" size="small" type="warning" @click="handleRejectReport(row)">驳回</el-button>
            <el-button size="small" type="info" @click="handleViewReportDetail(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="reportPagination.page"
          v-model:page-size="reportPagination.limit"
          :page-sizes="[10, 20, 50, 100]"
          :total="reportPagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="loadReports"
          @current-change="loadReports"
        />
      </div>
    </el-card>

    <!-- 数据分析 -->
    <el-row v-if="!isManageMode" :gutter="20" class="charts-section">
      <el-col :span="8">
        <el-card class="glass-card chart-card">
          <template #header>
            <div class="card-header">
              <span>帖子发布趋势</span>
              <el-icon><TrendCharts /></el-icon>
            </div>
          </template>
          <div ref="postTrendChart" class="chart-container"></div>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card class="glass-card chart-card">
          <template #header>
            <div class="card-header">
              <span>分类分布</span>
              <el-icon><PieChart /></el-icon>
            </div>
          </template>
          <div ref="categoryChart" class="chart-container"></div>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card class="glass-card chart-card">
          <template #header>
            <div class="card-header">
              <span>用户互动分析</span>
              <el-icon><ChatDotRound /></el-icon>
            </div>
          </template>
          <div ref="interactionChart" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>


    <!-- 举报详情对话框 -->
    <el-dialog v-model="reportDetailVisible" title="举报详情" width="60%">
      <div v-if="currentReport" class="report-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="举报ID">{{ currentReport.id }}</el-descriptions-item>
          <el-descriptions-item label="举报类型">
            <el-tag :type="currentReport.type === 'post' ? 'primary' : 'success'">
              {{ currentReport.type === 'post' ? '帖子' : '评论' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="被举报内容" :span="2">{{ currentReport.target_title }}</el-descriptions-item>
          <el-descriptions-item label="举报人">{{ currentReport.reporter_name }}</el-descriptions-item>
          <el-descriptions-item label="举报原因">{{ currentReport.reason_text }}</el-descriptions-item>
          <el-descriptions-item label="举报描述" :span="2">{{ currentReport.description }}</el-descriptions-item>
          <el-descriptions-item label="处理状态">
            <el-tag :type="getReportStatusType(currentReport.status)">
              {{ getReportStatusText(currentReport.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="举报时间">{{ formatDate(currentReport.created_at) }}</el-descriptions-item>
          <el-descriptions-item v-if="currentReport.admin_comment" label="管理员备注" :span="2">{{ currentReport.admin_comment }}</el-descriptions-item>
        </el-descriptions>
        
        <div v-if="currentReport.status === 'pending'" class="report-actions">
          <el-button type="success" @click="handleApproveReport(currentReport)">通过举报</el-button>
          <el-button type="warning" @click="handleRejectReport(currentReport)">驳回举报</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, Document, User, ChatDotRound, Warning, View, Star, TrendCharts, PieChart } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import { getPostList, deletePost, getReportList, handleReport, type Post, type Report } from '@/api/community'

// 数据状态
const router = useRouter()
const isManageMode = ref(false)
const postList = ref<Post[]>([])
const reportList = ref<Report[]>([])
const postLoading = ref(false)
const reportLoading = ref(false)

// 分页数据
const postPagination = reactive({
  page: 1,
  limit: 10,
  total: 0
})

const reportPagination = reactive({
  page: 1,
  limit: 10,
  total: 0
})

// 筛选条件
const postFilters = reactive({
  category: '',
  keyword: ''
})

const reportFilters = reactive({
  status: '',
  type: ''
})

// KPI 数据
const totalPosts = ref(156)
const activeUsers = ref(89)
const totalComments = ref(1234)
const pendingReports = ref(23)

// 对话框状态
const reportDetailVisible = ref(false)
const currentReport = ref<Report | null>(null)

// 图表引用
const postTrendChart = ref<HTMLElement>()
const categoryChart = ref<HTMLElement>()
const interactionChart = ref<HTMLElement>()

// 获取分类类型
const getCategoryType = (category: string) => {
  switch (category) {
    case 'second_hand': return 'success'
    case 'dating': return 'warning'
    case 'help': return 'info'
    case 'part_time': return 'primary'
    case 'gossip': return 'danger'
    default: return 'info'
  }
}

// 获取分类文本
const getCategoryText = (category: string) => {
  switch (category) {
    case 'second_hand': return '二手市场'
    case 'dating': return '恋爱交友'
    case 'help': return '打听求助'
    case 'part_time': return '发布兼职'
    case 'gossip': return '校园八卦'
    default: return '其他'
  }
}

// 获取举报状态类型
const getReportStatusType = (status: string) => {
  switch (status) {
    case 'pending': return 'warning'
    case 'approved': return 'success'
    case 'rejected': return 'danger'
    default: return 'info'
  }
}

// 获取举报状态文本
const getReportStatusText = (status: string) => {
  switch (status) {
    case 'pending': return '待处理'
    case 'approved': return '已通过'
    case 'rejected': return '已驳回'
    default: return '未知'
  }
}

// 格式化日期
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('zh-CN')
}

// 格式化内容
const formatContent = (content: string) => {
  return content.replace(/\n/g, '<br>')
}

// 加载帖子列表
const loadPosts = async () => {
  postLoading.value = true
  try {
    const response = await getPostList({
      page: postPagination.page,
      limit: postPagination.limit,
      category: postFilters.category || undefined,
      keyword: postFilters.keyword || undefined
    })
    postList.value = response.data.posts
    postPagination.total = response.data.pagination.total
  } catch (error) {
    ElMessage.error('加载帖子列表失败')
  } finally {
    postLoading.value = false
  }
}

// 加载举报列表
const loadReports = async () => {
  reportLoading.value = true
  try {
    const response = await getReportList({
      page: reportPagination.page,
      limit: reportPagination.limit,
      status: reportFilters.status || undefined,
      type: reportFilters.type || undefined
    })
    reportList.value = response.data.reports
    reportPagination.total = response.data.pagination.total
  } catch (error) {
    ElMessage.error('加载举报列表失败')
  } finally {
    reportLoading.value = false
  }
}

// 查看帖子详情
const handleViewPost = (post: Post) => {
  router.push(`/post/${post.id}`)
}

// 编辑帖子
const handleEditPost = (post: Post) => {
  ElMessage.info(`编辑帖子: ${post.title}`)
}

// 删除帖子
const handleDeletePost = async (post: Post) => {
  try {
    await ElMessageBox.confirm('确定要删除这个帖子吗？', '确认删除', {
      type: 'warning'
    })
    await deletePost(post.id)
    ElMessage.success('删除成功')
    await loadPosts()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 查看举报详情
const handleViewReportDetail = (report: Report) => {
  currentReport.value = report
  reportDetailVisible.value = true
}

// 通过举报
const handleApproveReport = async (report: Report) => {
  try {
    await handleReport(report.id, {
      status: 'approved',
      admin_comment: '举报内容确实存在违规，已处理'
    })
    ElMessage.success('举报处理成功')
    await loadReports()
    if (reportDetailVisible.value) {
      reportDetailVisible.value = false
    }
  } catch (error) {
    ElMessage.error('处理举报失败')
  }
}

// 驳回举报
const handleRejectReport = async (report: Report) => {
  try {
    await handleReport(report.id, {
      status: 'rejected',
      admin_comment: '举报内容未发现违规'
    })
    ElMessage.success('举报处理成功')
    await loadReports()
    if (reportDetailVisible.value) {
      reportDetailVisible.value = false
    }
  } catch (error) {
    ElMessage.error('处理举报失败')
  }
}

// 发布公告
const handleAddPost = () => {
  ElMessage.info('发布公告功能待实现')
}

// 初始化图表
const initCharts = () => {
  nextTick(() => {
    // 帖子发布趋势
    if (postTrendChart.value) {
      const chart = echarts.init(postTrendChart.value)
      const option = {
        tooltip: { 
          trigger: 'axis',
          backgroundColor: 'rgba(50, 50, 50, 0.9)',
          borderColor: '#666',
          textStyle: { color: '#fff' }
        },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: {
          type: 'category',
          data: ['1月', '2月', '3月', '4月', '5月', '6月'],
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
          data: [120, 150, 180, 160, 200, 220],
          type: 'line',
          smooth: true,
          lineStyle: { 
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: '#667eea' },
              { offset: 1, color: '#764ba2' }
            ]),
            width: 3
          },
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

    // 分类分布
    if (categoryChart.value) {
      const chart = echarts.init(categoryChart.value)
      const option = {
        tooltip: { 
          trigger: 'item',
          backgroundColor: 'rgba(50, 50, 50, 0.9)',
          borderColor: '#666',
          textStyle: { color: '#fff' }
        },
        series: [{
          data: [
            { value: 45, name: '二手市场', itemStyle: { color: '#ff6b6b' } },
            { value: 38, name: '恋爱交友', itemStyle: { color: '#4ecdc4' } },
            { value: 32, name: '打听求助', itemStyle: { color: '#45b7d1' } },
            { value: 28, name: '发布兼职', itemStyle: { color: '#96ceb4' } },
            { value: 25, name: '校园八卦', itemStyle: { color: '#feca57' } }
          ],
          type: 'pie',
          radius: ['40%', '70%'],
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

    // 用户互动分析
    if (interactionChart.value) {
      const chart = echarts.init(interactionChart.value)
      const option = {
        tooltip: { 
          trigger: 'item',
          backgroundColor: 'rgba(50, 50, 50, 0.9)',
          borderColor: '#666',
          textStyle: { color: '#fff' }
        },
        series: [{
          data: [
            { value: 40, name: '点赞', itemStyle: { color: '#ff6b6b' } },
            { value: 30, name: '评论', itemStyle: { color: '#4ecdc4' } },
            { value: 20, name: '分享', itemStyle: { color: '#45b7d1' } },
            { value: 10, name: '收藏', itemStyle: { color: '#96ceb4' } }
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
  })
}

// 看板/管理切换
const toggleMode = () => {
  isManageMode.value = !isManageMode.value
  if (isManageMode.value) {
    loadPosts()
    loadReports()
  }
}

// 切回看板后重绘图表
watch(isManageMode, (val) => {
  if (!val) {
    nextTick(() => initCharts())
  }
})

onMounted(() => {
  initCharts()
})
</script>

<style scoped>
.community-page {
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
  gap: 12px;
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

/* 卡片样式 */
.glass-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  margin-bottom: 20px;
}

.glass-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  color: #333;
}

.header-filters {
  display: flex;
  align-items: center;
  gap: 10px;
}

.chart-card {
  height: 400px;
}

.chart-container {
  height: 320px;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

/* 帖子详情样式 */
.post-detail {
  max-height: 70vh;
  overflow-y: auto;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.author-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.author-name {
  font-weight: 600;
  color: #333;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #666;
}

.post-stats {
  display: flex;
  gap: 20px;
  color: #666;
  font-size: 14px;
}

.post-stats span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.post-content {
  margin-bottom: 30px;
}

.content-text {
  line-height: 1.6;
  color: #333;
  margin-bottom: 20px;
}

.post-images {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.post-image {
  width: 120px;
  height: 120px;
  border-radius: 8px;
  cursor: pointer;
}

.comments-section {
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.comments-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.comments-header h4 {
  margin: 0;
  color: #333;
}

.comment-form {
  margin-bottom: 20px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.comment-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}

.comments-list {
  max-height: 400px;
  overflow-y: auto;
}

.comment-item {
  display: flex;
  gap: 12px;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
}

.comment-item:last-child {
  border-bottom: none;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.comment-author {
  font-weight: 600;
  color: #333;
}

.comment-time {
  font-size: 12px;
  color: #666;
}

.comment-text {
  line-height: 1.5;
  color: #333;
  margin-bottom: 8px;
}

.comment-actions {
  display: flex;
  gap: 16px;
}

/* 举报详情样式 */
.report-detail {
  padding: 20px 0;
}

.report-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

/* 操作按钮样式 */
.action-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: nowrap;
  align-items: center;
}

.action-buttons .el-button {
  margin: 0;
  flex-shrink: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .action-buttons {
    flex-direction: column;
    gap: 4px;
  }
  
  .action-buttons .el-button {
    width: 100%;
    font-size: 12px;
    padding: 4px 8px;
  }
}
</style>
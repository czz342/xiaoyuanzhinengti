<template>
  <div class="community-page">
    <div class="page-header">
      <h2>校园圈子管理</h2>
      <el-button type="primary" @click="handleAddPost">
        <el-icon><Plus /></el-icon>
        发布公告
      </el-button>
    </div>

    <!-- 帖子列表 -->
    <el-card class="posts-list">
      <template #header>
        <span>帖子列表</span>
      </template>
      <el-table :data="postList" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="标题" width="200" />
        <el-table-column prop="author" label="作者" width="120" />
        <el-table-column prop="category" label="分类" width="120">
          <template #default="{ row }">
            <el-tag :type="getCategoryType(row.category)">
              {{ getCategoryText(row.category) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="likeCount" label="点赞数" width="100" />
        <el-table-column prop="commentCount" label="评论数" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'published' ? 'success' : 'warning'">
              {{ row.status === 'published' ? '已发布' : '待审核' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdTime" label="发布时间" width="160" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="handleViewPost(row)">查看</el-button>
            <el-button size="small" type="primary" @click="handleEditPost(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDeletePost(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 举报管理 -->
    <el-card class="reports-list">
      <template #header>
        <span>举报管理</span>
      </template>
      <el-table :data="reportList" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="postTitle" label="被举报帖子" width="200" />
        <el-table-column prop="reporter" label="举报人" width="120" />
        <el-table-column prop="reason" label="举报原因" width="150" />
        <el-table-column prop="status" label="处理状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getReportStatusType(row.status)">
              {{ getReportStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdTime" label="举报时间" width="160" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" type="success" @click="handleApproveReport(row)">通过</el-button>
            <el-button size="small" type="warning" @click="handleRejectReport(row)">驳回</el-button>
            <el-button size="small" type="danger" @click="handleDeleteReport(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 数据分析 -->
    <el-row :gutter="20" class="charts-section">
      <el-col :span="8">
        <el-card>
          <template #header>
            <span>帖子发布趋势</span>
          </template>
          <div ref="postTrendChart" class="chart-container"></div>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card>
          <template #header>
            <span>热门话题</span>
          </template>
          <div ref="hotTopicsChart" class="chart-container"></div>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card>
          <template #header>
            <span>用户互动分析</span>
          </template>
          <div ref="interactionChart" class="chart-container"></div>
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

// 帖子列表
const postList = ref([
  {
    id: 1,
    title: '校园生活分享',
    author: '张三',
    category: 'gossip',
    likeCount: 25,
    commentCount: 8,
    status: 'published',
    createdTime: '2023-09-01 10:00:00'
  },
  {
    id: 2,
    title: '二手书籍出售',
    author: '李四',
    category: 'second_hand',
    likeCount: 15,
    commentCount: 5,
    status: 'published',
    createdTime: '2023-09-02 11:00:00'
  },
  {
    id: 3,
    title: '求助：寻找学习伙伴',
    author: '王五',
    category: 'help',
    likeCount: 30,
    commentCount: 12,
    status: 'pending',
    createdTime: '2023-09-03 12:00:00'
  }
])

// 举报列表
const reportList = ref([
  {
    id: 1,
    postTitle: '不当言论帖子',
    reporter: '用户A',
    reason: '内容不当',
    status: 'pending',
    createdTime: '2023-09-01 14:00:00'
  },
  {
    id: 2,
    postTitle: '虚假信息',
    reporter: '用户B',
    reason: '信息不实',
    status: 'approved',
    createdTime: '2023-09-02 15:00:00'
  }
])

// 图表引用
const postTrendChart = ref<HTMLElement>()
const hotTopicsChart = ref<HTMLElement>()
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

// 发布公告
const handleAddPost = () => {
  ElMessage.info('发布公告功能待实现')
}

// 查看帖子
const handleViewPost = (row: any) => {
  ElMessage.info(`查看帖子: ${row.title}`)
}

// 编辑帖子
const handleEditPost = (row: any) => {
  ElMessage.info(`编辑帖子: ${row.title}`)
}

// 删除帖子
const handleDeletePost = (row: any) => {
  ElMessage.info(`删除帖子: ${row.title}`)
}

// 通过举报
const handleApproveReport = (row: any) => {
  ElMessage.info(`通过举报: ${row.postTitle}`)
}

// 驳回举报
const handleRejectReport = (row: any) => {
  ElMessage.info(`驳回举报: ${row.postTitle}`)
}

// 删除举报
const handleDeleteReport = (row: any) => {
  ElMessage.info(`删除举报: ${row.postTitle}`)
}

// 初始化图表
const initCharts = () => {
  nextTick(() => {
    // 帖子发布趋势
    if (postTrendChart.value) {
      const chart = echarts.init(postTrendChart.value)
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

    // 热门话题
    if (hotTopicsChart.value) {
      const chart = echarts.init(hotTopicsChart.value)
      const option = {
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'value' },
        yAxis: {
          type: 'category',
          data: ['校园生活', '学习交流', '二手交易', '求职招聘', '情感话题']
        },
        series: [{
          data: [45, 38, 32, 28, 25],
          type: 'bar',
          itemStyle: { color: '#409eff' }
        }]
      }
      chart.setOption(option)
    }

    // 用户互动分析
    if (interactionChart.value) {
      const chart = echarts.init(interactionChart.value)
      const option = {
        tooltip: { trigger: 'item' },
        series: [{
          type: 'pie',
          data: [
            { value: 40, name: '点赞' },
            { value: 30, name: '评论' },
            { value: 20, name: '分享' },
            { value: 10, name: '收藏' }
          ]
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

.posts-list {
  margin-bottom: 20px;
}

.reports-list {
  margin-bottom: 20px;
}

.charts-section {
  margin-bottom: 20px;
}

.chart-container {
  height: 250px;
}
</style>

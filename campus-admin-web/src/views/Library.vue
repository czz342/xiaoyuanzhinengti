<template>
  <div class="library-page">
    <div class="page-header">
      <h2>图书馆管理</h2>
      <el-button type="primary" @click="handleAddBook">
        <el-icon><Plus /></el-icon>
        添加图书
      </el-button>
    </div>

    <!-- 图书统计概览 -->
    <el-row :gutter="20" class="overview-cards">
      <el-col :span="6">
        <el-card class="overview-card">
          <div class="card-content">
            <div class="card-icon book-icon">
              <el-icon><Reading /></el-icon>
            </div>
            <div class="card-info">
              <div class="card-title">图书总数</div>
              <div class="card-value">{{ overviewData.totalBooks }}</div>
              <div class="card-trend">+5.2%</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="overview-card">
          <div class="card-content">
            <div class="card-icon borrow-icon">
              <el-icon><Document /></el-icon>
            </div>
            <div class="card-info">
              <div class="card-title">借阅中</div>
              <div class="card-value">{{ overviewData.borrowedBooks }}</div>
              <div class="card-trend">+12.3%</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="overview-card">
          <div class="card-content">
            <div class="card-icon overdue-icon">
              <el-icon><Warning /></el-icon>
            </div>
            <div class="card-info">
              <div class="card-title">逾期未还</div>
              <div class="card-value">{{ overviewData.overdueBooks }}</div>
              <div class="card-trend">-8.1%</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="overview-card">
          <div class="card-content">
            <div class="card-icon reservation-icon">
              <el-icon><Calendar /></el-icon>
            </div>
            <div class="card-info">
              <div class="card-title">预约中</div>
              <div class="card-value">{{ overviewData.reservedBooks }}</div>
              <div class="card-trend">+18.7%</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图书列表 -->
    <el-card class="books-list">
      <template #header>
        <span>图书列表</span>
      </template>
      <el-table :data="bookList" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="书名" width="200" />
        <el-table-column prop="author" label="作者" width="150" />
        <el-table-column prop="category" label="分类" width="120" />
        <el-table-column prop="totalCopies" label="总册数" width="100" />
        <el-table-column prop="availableCopies" label="可借册数" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === 'active' ? '可借' : '维护中' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="handleEditBook(row)">编辑</el-button>
            <el-button size="small" type="primary" @click="handleViewBorrowings(row)">借阅记录</el-button>
            <el-button size="small" type="danger" @click="handleDeleteBook(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 数据分析 -->
    <el-row :gutter="20" class="charts-section">
      <el-col :span="8">
        <el-card>
          <template #header>
            <span>借阅量趋势</span>
          </template>
          <div ref="borrowingTrendChart" class="chart-container"></div>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card>
          <template #header>
            <span>热门图书排行</span>
          </template>
          <div ref="popularBooksChart" class="chart-container"></div>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card>
          <template #header>
            <span>图书分类借阅分布</span>
          </template>
          <div ref="categoryDistributionChart" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Reading, Document, Warning, Calendar } from '@element-plus/icons-vue'
import * as echarts from 'echarts'

// 概览数据
const overviewData = reactive({
  totalBooks: 12580,
  borrowedBooks: 3240,
  overdueBooks: 156,
  reservedBooks: 89
})

// 图书列表
const bookList = ref([
  {
    id: 1,
    title: 'JavaScript高级程序设计',
    author: 'Nicholas C. Zakas',
    category: '计算机',
    totalCopies: 5,
    availableCopies: 2,
    status: 'active'
  },
  {
    id: 2,
    title: 'Vue.js设计与实现',
    author: '霍春阳',
    category: '计算机',
    totalCopies: 3,
    availableCopies: 1,
    status: 'active'
  },
  {
    id: 3,
    title: '红楼梦',
    author: '曹雪芹',
    category: '文学',
    totalCopies: 8,
    availableCopies: 5,
    status: 'active'
  }
])

// 图表引用
const borrowingTrendChart = ref<HTMLElement>()
const popularBooksChart = ref<HTMLElement>()
const categoryDistributionChart = ref<HTMLElement>()

// 添加图书
const handleAddBook = () => {
  ElMessage.info('添加图书功能待实现')
}

// 编辑图书
const handleEditBook = (row: any) => {
  ElMessage.info(`编辑图书: ${row.title}`)
}

// 查看借阅记录
const handleViewBorrowings = (row: any) => {
  ElMessage.info(`查看图书 ${row.title} 的借阅记录`)
}

// 删除图书
const handleDeleteBook = (row: any) => {
  ElMessage.info(`删除图书: ${row.title}`)
}

// 初始化图表
const initCharts = () => {
  nextTick(() => {
    // 借阅量趋势
    if (borrowingTrendChart.value) {
      const chart = echarts.init(borrowingTrendChart.value)
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

    // 热门图书排行
    if (popularBooksChart.value) {
      const chart = echarts.init(popularBooksChart.value)
      const option = {
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'value' },
        yAxis: {
          type: 'category',
          data: ['JavaScript高级程序设计', 'Vue.js设计与实现', '红楼梦', 'Java核心技术', 'Python编程']
        },
        series: [{
          data: [45, 38, 32, 28, 25],
          type: 'bar',
          itemStyle: { color: '#409eff' }
        }]
      }
      chart.setOption(option)
    }

    // 分类分布
    if (categoryDistributionChart.value) {
      const chart = echarts.init(categoryDistributionChart.value)
      const option = {
        tooltip: { trigger: 'item' },
        series: [{
          type: 'pie',
          data: [
            { value: 35, name: '计算机' },
            { value: 25, name: '文学' },
            { value: 20, name: '历史' },
            { value: 15, name: '科学' },
            { value: 5, name: '其他' }
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
.library-page {
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

.overview-cards {
  margin-bottom: 20px;
}

.overview-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.card-content {
  display: flex;
  align-items: center;
}

.card-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  font-size: 24px;
  color: white;
}

.book-icon { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.borrow-icon { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
.overdue-icon { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
.reservation-icon { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }

.card-info {
  flex: 1;
}

.card-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.card-value {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}

.card-trend {
  font-size: 12px;
  color: #67c23a;
}

.books-list {
  margin-bottom: 20px;
}

.charts-section {
  margin-bottom: 20px;
}

.chart-container {
  height: 250px;
}
</style>

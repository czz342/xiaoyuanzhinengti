<template>
  <div class="library-page">
    <div class="page-header">
      <h2>图书馆管理</h2>
      <div class="header-actions">
        <el-button v-if="isManageMode" type="primary" @click="handleAddBook">
          <el-icon><Plus /></el-icon>
          添加图书
        </el-button>
        <el-button type="success" plain @click="toggleMode">{{ isManageMode ? '返回可视化看板' : '管理详细数据' }}</el-button>
      </div>
    </div>

    <!-- 高级KPI指标卡片 -->
    <div v-if="!isManageMode" class="kpi-section">
      <div class="kpi-card">
        <div class="kpi-icon">
          <el-icon><Reading /></el-icon>
        </div>
        <div class="kpi-content">
          <div class="kpi-value">{{ overviewData.totalBooks }}</div>
          <div class="kpi-label">图书总数</div>
          <div class="kpi-trend positive">+5.2%</div>
        </div>
      </div>
      
      <div class="kpi-card">
        <div class="kpi-icon">
          <el-icon><Document /></el-icon>
        </div>
        <div class="kpi-content">
          <div class="kpi-value">{{ overviewData.borrowedBooks }}</div>
          <div class="kpi-label">借阅中</div>
          <div class="kpi-trend positive">+12.3%</div>
        </div>
      </div>
      
      <div class="kpi-card">
        <div class="kpi-icon">
          <el-icon><Warning /></el-icon>
        </div>
        <div class="kpi-content">
          <div class="kpi-value">{{ overviewData.overdueBooks }}</div>
          <div class="kpi-label">逾期未还</div>
          <div class="kpi-trend negative">-8.1%</div>
        </div>
      </div>
      
      <div class="kpi-card">
        <div class="kpi-icon">
          <el-icon><Calendar /></el-icon>
        </div>
        <div class="kpi-content">
          <div class="kpi-value">{{ overviewData.reservedBooks }}</div>
          <div class="kpi-label">预约中</div>
          <div class="kpi-trend positive">+18.7%</div>
        </div>
      </div>
    </div>

    <!-- 图书列表 -->
    <el-card v-if="isManageMode" class="books-list">
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
        <el-table-column label="操作" width="280">
          <template #default="{ row }">
            <div class="action-buttons">
              <el-button size="small" @click="handleEditBook(row)">编辑</el-button>
              <el-button size="small" type="primary" @click="handleViewBorrowings(row)">借阅记录</el-button>
              <el-button size="small" type="danger" @click="handleDeleteBook(row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 高级图表分析 -->
    <div v-if="!isManageMode" class="advanced-charts">
      <div class="chart-row">
        <div class="chart-card">
          <div class="chart-header">
            <h3>借阅量趋势分析</h3>
            <div class="chart-subtitle">近6个月借阅数据变化</div>
          </div>
          <div ref="borrowingTrendChart" class="chart-container"></div>
        </div>
        
        <div class="chart-card">
          <div class="chart-header">
            <h3>热门图书排行</h3>
            <div class="chart-subtitle">借阅次数最多的图书</div>
          </div>
          <div ref="popularBooksChart" class="chart-container"></div>
        </div>
      </div>
      
      <div class="chart-row">
        <div class="chart-card">
          <div class="chart-header">
            <h3>图书分类借阅分布</h3>
            <div class="chart-subtitle">各分类图书借阅占比</div>
          </div>
          <div ref="categoryDistributionChart" class="chart-container"></div>
        </div>
        
        <div class="chart-card">
          <div class="chart-header">
            <h3>借阅时段分析</h3>
            <div class="chart-subtitle">24小时借阅活跃度</div>
          </div>
          <div ref="timeAnalysisChart" class="chart-container"></div>
        </div>
      </div>
      
      <div class="chart-row">
        <div class="chart-card">
          <div class="chart-header">
            <h3>用户借阅行为分析</h3>
            <div class="chart-subtitle">借阅频率与用户类型分布</div>
          </div>
          <div ref="userBehaviorChart" class="chart-container"></div>
        </div>
        
        <div class="chart-card">
          <div class="chart-header">
            <h3>图书利用率热力图</h3>
            <div class="chart-subtitle">不同位置图书使用情况</div>
          </div>
          <div ref="utilizationHeatmap" class="chart-container"></div>
        </div>
      </div>
    </div>

    <!-- 编辑图书对话框 -->
    <el-dialog v-model="editDialogVisible" title="编辑图书" width="600px">
      <el-form :model="editForm" label-width="100px">
        <el-form-item label="书名">
          <el-input v-model="editForm.title" />
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="editForm.author" />
        </el-form-item>
        <el-form-item label="分类">
          <el-input v-model="editForm.category" />
        </el-form-item>
        <el-form-item label="总册数">
          <el-input-number v-model="editForm.totalCopies" :min="0" />
        </el-form-item>
        <el-form-item label="可借册数">
          <el-input-number v-model="editForm.availableCopies" :min="0" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="editForm.status">
            <el-option label="可借" value="active" />
            <el-option label="维护中" value="maintenance" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveBook">保存</el-button>
      </template>
    </el-dialog>

    <!-- 借阅记录对话框 -->
    <el-dialog v-model="borrowingDialogVisible" title="借阅记录" width="800px">
      <el-table :data="borrowingList" stripe>
        <el-table-column prop="userName" label="借阅人" width="120" />
        <el-table-column prop="borrowDate" label="借阅日期" width="120" />
        <el-table-column prop="dueDate" label="应还日期" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'borrowed' ? 'warning' : 'success'">
              {{ row.status === 'borrowed' ? '借阅中' : '已归还' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="notes" label="备注" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Reading, Document, Warning, Calendar } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import { getBookList, getBookStats, createBook, updateBook, deleteBook } from '@/api/library'
import type { Book } from '@/types/api'

// 概览数据（从后端拉取）
const overviewData = reactive({
  totalBooks: 1256,
  borrowedBooks: 342,
  overdueBooks: 23,
  reservedBooks: 67
})

// 图书列表（从后端拉取）
const bookList = ref<Book[]>([])
const loading = ref(false)

// 对话框状态
const editDialogVisible = ref(false)
const borrowingDialogVisible = ref(false)

// 编辑表单
const editForm = reactive({
  id: 0,
  title: '',
  author: '',
  category: '',
  totalCopies: 0,
  availableCopies: 0,
  status: 'active'
})

// 借阅记录列表
const borrowingList = ref<any[]>([])

// 页面模式：默认看板
const isManageMode = ref(false)
const toggleMode = () => { isManageMode.value = !isManageMode.value }

// 图表引用
const borrowingTrendChart = ref<HTMLElement>()
const popularBooksChart = ref<HTMLElement>()
const categoryDistributionChart = ref<HTMLElement>()
const timeAnalysisChart = ref<HTMLElement>()
const userBehaviorChart = ref<HTMLElement>()
const utilizationHeatmap = ref<HTMLElement>()

// 添加图书
const handleAddBook = () => {
  // 重置表单
  Object.assign(editForm, {
    id: 0,
    title: '',
    author: '',
    category: '',
    totalCopies: 0,
    availableCopies: 0,
    status: 'active'
  })
  editDialogVisible.value = true
}

// 编辑图书
const handleEditBook = (row: any) => {
  Object.assign(editForm, {
    id: row.id,
    title: row.title,
    author: row.author,
    category: row.category,
    totalCopies: row.totalCopies,
    availableCopies: row.availableCopies,
    status: row.status
  })
  editDialogVisible.value = true
}

// 查看借阅记录
const handleViewBorrowings = async (row: any) => {
  try {
    // 模拟借阅记录数据
    borrowingList.value = [
      {
        userName: '张三',
        borrowDate: '2024-01-15',
        dueDate: '2024-02-15',
        status: 'borrowed',
        notes: '正常借阅'
      },
      {
        userName: '李四',
        borrowDate: '2024-01-10',
        dueDate: '2024-02-10',
        status: 'returned',
        notes: '已归还'
      }
    ]
    borrowingDialogVisible.value = true
  } catch (e) {
    ElMessage.error('获取借阅记录失败')
  }
}

// 删除图书
const handleDeleteBook = (row: any) => {
  ElMessageBox.confirm(
    `确定要删除图书《${row.title}》吗？`,
    '确认删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    try {
      await deleteBook(row.id)
      ElMessage.success('删除成功')
      // 重新加载列表
      const listRes = await getBookList({ page: 1, limit: 50 })
      bookList.value = (listRes as any).data ?? []
    } catch (e) {
      ElMessage.error('删除失败')
    }
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// 保存图书
const handleSaveBook = async () => {
  try {
    if (editForm.id === 0) {
      // 新增
      await createBook(editForm)
      ElMessage.success('添加成功')
    } else {
      // 编辑
      await updateBook(editForm.id, editForm)
      ElMessage.success('更新成功')
    }
    editDialogVisible.value = false
    // 重新加载列表
    const listRes = await getBookList({ page: 1, limit: 50 })
    bookList.value = (listRes as any).data ?? []
  } catch (e) {
    ElMessage.error('保存失败')
  }
}

// 初始化借阅量趋势图表
const initBorrowingTrendChart = () => {
  if (borrowingTrendChart.value) {
    const chart = echarts.init(borrowingTrendChart.value)
    const option: any = {
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(0,0,0,0.8)',
        borderColor: '#409eff',
        textStyle: { color: '#fff' }
      },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'category',
        data: ['1月', '2月', '3月', '4月', '5月', '6月'],
        axisLine: { lineStyle: { color: '#e0e0e0' } },
        axisLabel: { color: '#666' }
      },
      yAxis: {
        type: 'value',
        axisLine: { lineStyle: { color: '#e0e0e0' } },
        axisLabel: { color: '#666' },
        splitLine: { lineStyle: { color: '#f0f0f0' } }
      },
      series: [{
        data: [1200, 1500, 1800, 1600, 2000, 2200],
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { width: 3, color: '#409eff' },
        itemStyle: { color: '#409eff' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
              { offset: 1, color: 'rgba(64, 158, 255, 0.05)' }
            ]
          }
        }
      }]
    }
    chart.setOption(option)
  }
}

// 初始化热门图书排行图表
const initPopularBooksChart = () => {
  if (popularBooksChart.value) {
    const chart = echarts.init(popularBooksChart.value)
    const option: any = {
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(0,0,0,0.8)',
        borderColor: '#67c23a',
        textStyle: { color: '#fff' }
      },
      grid: { left: '15%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'value',
        axisLine: { lineStyle: { color: '#e0e0e0' } },
        axisLabel: { color: '#666' },
        splitLine: { lineStyle: { color: '#f0f0f0' } }
      },
      yAxis: {
        type: 'category',
        data: ['JavaScript高级程序设计', 'Vue.js设计与实现', '红楼梦', 'Java核心技术', 'Python编程'],
        axisLine: { lineStyle: { color: '#e0e0e0' } },
        axisLabel: { color: '#666' }
      },
      series: [{
        data: [45, 38, 32, 28, 25],
        type: 'bar',
        itemStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 1, y2: 0,
            colorStops: [
              { offset: 0, color: '#67c23a' },
              { offset: 1, color: '#85ce61' }
            ]
          },
          borderRadius: [0, 4, 4, 0]
        },
        barWidth: '60%'
      }]
    }
    chart.setOption(option)
  }
}

// 初始化分类分布图表
const initCategoryDistributionChart = () => {
  if (categoryDistributionChart.value) {
    const chart = echarts.init(categoryDistributionChart.value)
    const option: any = {
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(0,0,0,0.8)',
        borderColor: '#e6a23c',
        textStyle: { color: '#fff' }
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        textStyle: { color: '#666' }
      },
      series: [{
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['60%', '50%'],
        data: [
          { value: 35, name: '计算机', itemStyle: { color: '#409eff' } },
          { value: 25, name: '文学', itemStyle: { color: '#67c23a' } },
          { value: 20, name: '历史', itemStyle: { color: '#e6a23c' } },
          { value: 15, name: '科学', itemStyle: { color: '#f56c6c' } },
          { value: 5, name: '其他', itemStyle: { color: '#909399' } }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    }
    chart.setOption(option)
  }
}

// 初始化借阅时段分析图表
const initTimeAnalysisChart = () => {
  if (timeAnalysisChart.value) {
    const chart = echarts.init(timeAnalysisChart.value)
    const option: any = {
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(0,0,0,0.8)',
        borderColor: '#f56c6c',
        textStyle: { color: '#fff' }
      },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'category',
        data: Array.from({length: 24}, (_, i) => `${i}:00`),
        axisLine: { lineStyle: { color: '#e0e0e0' } },
        axisLabel: { color: '#666', interval: 3 }
      },
      yAxis: {
        type: 'value',
        axisLine: { lineStyle: { color: '#e0e0e0' } },
        axisLabel: { color: '#666' },
        splitLine: { lineStyle: { color: '#f0f0f0' } }
      },
      series: [{
        data: [2, 1, 0, 0, 1, 3, 8, 15, 25, 35, 42, 45, 40, 35, 30, 28, 32, 38, 35, 25, 18, 12, 8, 4],
        type: 'bar',
        itemStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: '#f56c6c' },
              { offset: 1, color: '#f78989' }
            ]
          }
        },
        barWidth: '80%'
      }]
    }
    chart.setOption(option)
  }
}

// 初始化用户行为分析图表
const initUserBehaviorChart = () => {
  if (userBehaviorChart.value) {
    const chart = echarts.init(userBehaviorChart.value)
    const option: any = {
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(0,0,0,0.8)',
        borderColor: '#909399',
        textStyle: { color: '#fff' }
      },
      radar: {
        indicator: [
          { name: '本科生', max: 100 },
          { name: '研究生', max: 100 },
          { name: '博士生', max: 100 },
          { name: '教师', max: 100 },
          { name: '其他', max: 100 }
        ],
        axisName: { color: '#666' },
        splitLine: { lineStyle: { color: '#e0e0e0' } },
        splitArea: { show: false }
      },
      series: [{
        type: 'radar',
        data: [{
          value: [85, 70, 60, 45, 30],
          name: '借阅频率',
          itemStyle: { color: '#409eff' },
          areaStyle: { color: 'rgba(64, 158, 255, 0.2)' }
        }]
      }]
    }
    chart.setOption(option)
  }
}

// 初始化利用率热力图
const initUtilizationHeatmap = () => {
  if (utilizationHeatmap.value) {
    const chart = echarts.init(utilizationHeatmap.value)
    const data = []
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        data.push([j, i, Math.floor(Math.random() * 100)])
      }
    }
    const option: any = {
      tooltip: {
        position: 'top',
        backgroundColor: 'rgba(0,0,0,0.8)',
        borderColor: '#67c23a',
        textStyle: { color: '#fff' }
      },
      grid: { height: '50%', top: '10%' },
      xAxis: {
        type: 'category',
        data: Array.from({length: 10}, (_, i) => `A${i+1}`),
        splitArea: { show: true }
      },
      yAxis: {
        type: 'category',
        data: Array.from({length: 10}, (_, i) => `${i+1}楼`),
        splitArea: { show: true }
      },
      visualMap: {
        min: 0,
        max: 100,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '15%',
        inRange: {
          color: ['#50a3ba', '#eac736', '#d94e5d']
        }
      },
      series: [{
        name: '利用率',
        type: 'heatmap',
        data: data,
        label: {
          show: true,
          color: '#fff'
        },
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
}

// 初始化所有图表
const initCharts = () => {
  nextTick(() => {
    initBorrowingTrendChart()
    initPopularBooksChart()
    initCategoryDistributionChart()
    initTimeAnalysisChart()
    initUserBehaviorChart()
    initUtilizationHeatmap()
  })
}

onMounted(() => {
  initCharts()
  ;(async () => {
    // 固定展示指定概览数值
    overviewData.totalBooks = 1256
    overviewData.borrowedBooks = 342
    overviewData.overdueBooks = 23
    overviewData.reservedBooks = 67

    try {
      loading.value = true
      const listRes = await getBookList({ page: 1, limit: 50 })
      const list = (listRes as any).data ?? []
      bookList.value = list
    } catch (e) {
      ElMessage.error('加载图书列表失败')
    } finally {
      loading.value = false
    }
  })()
})

// 切回看板时重建图表
watch(isManageMode, (val) => {
  if (!val) {
    nextTick(() => initCharts())
  }
})
</script>

<style scoped>
.library-page {
  padding: 20px;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.page-header h2 {
  margin: 0;
  color: #333;
  font-size: 28px;
  font-weight: 600;
}

/* 高级KPI卡片样式 */
.kpi-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.kpi-card {
  background: white;
  border-radius: 20px;
  padding: 25px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.kpi-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #409eff, #67c23a, #e6a23c, #f56c6c);
  background-size: 200% 100%;
  animation: gradientShift 3s ease-in-out infinite;
}

.kpi-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
}

.kpi-icon {
  width: 60px;
  height: 60px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  font-size: 24px;
  color: white;
  background: linear-gradient(135deg, #409eff, #67c23a);
}

.kpi-content {
  color: #333;
}

.kpi-value {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 5px;
  color: #333;
}

.kpi-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.kpi-trend {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 12px;
  display: inline-block;
}

.kpi-trend.positive {
  background: rgba(103, 194, 58, 0.2);
  color: #67c23a;
  border: 1px solid rgba(103, 194, 58, 0.3);
}

.kpi-trend.negative {
  background: rgba(245, 108, 108, 0.2);
  color: #f56c6c;
  border: 1px solid rgba(245, 108, 108, 0.3);
}

/* 高级图表样式 */
.advanced-charts {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.chart-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 25px;
}

.chart-card {
  background: white;
  border-radius: 20px;
  padding: 25px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.chart-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.chart-header {
  margin-bottom: 20px;
  text-align: center;
}

.chart-header h3 {
  color: #333;
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 5px 0;
}

.chart-subtitle {
  color: #666;
  font-size: 12px;
}

.chart-container {
  height: 300px;
  border-radius: 10px;
  background: #fafafa;
}

.books-list {
  background: white;
  border-radius: 20px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.books-list :deep(.el-card__header) {
  background: transparent;
  border-bottom: 1px solid #e0e0e0;
  color: #333;
  font-weight: 600;
}

.books-list :deep(.el-table) {
  background: transparent;
  color: #333;
}

.books-list :deep(.el-table th) {
  background: #f5f5f5;
  color: #333;
  border-bottom: 1px solid #e0e0e0;
}

.books-list :deep(.el-table td) {
  border-bottom: 1px solid #f0f0f0;
  color: #333;
}

.books-list :deep(.el-table--striped .el-table__body tr.el-table__row--striped td) {
  background: #fafafa;
}

/* 操作按钮样式 */
.action-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: nowrap;
  align-items: center;
}

.action-buttons .el-button {
  flex-shrink: 0;
}

/* 动画效果 */
@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .chart-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .kpi-section {
    grid-template-columns: 1fr;
  }
  
  .page-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .library-page {
    padding: 15px;
  }
}
</style>

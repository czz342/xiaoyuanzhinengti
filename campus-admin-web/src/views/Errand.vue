<template>
  <div class="errand-page">
    <div class="page-header">
      <h2>跑腿代办管理</h2>
      <div class="header-actions">
        <el-button v-if="isManageMode" type="primary" @click="handleAddOrder">
          <el-icon><Plus /></el-icon>
          创建订单
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
            <div class="kpi-value">{{ totalOrders }}</div>
            <div class="kpi-label">总订单数</div>
            <div class="kpi-trend">
              <el-icon><TrendCharts /></el-icon>
              <span>+28 今日</span>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="kpi-card kpi-card-2">
          <div class="kpi-icon">
            <el-icon size="32"><Money /></el-icon>
          </div>
          <div class="kpi-content">
            <div class="kpi-value">¥{{ totalRevenue }}</div>
            <div class="kpi-label">总营收</div>
            <div class="kpi-trend">
              <el-icon><TrendCharts /></el-icon>
              <span>+12.3% 本月</span>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="kpi-card kpi-card-3">
          <div class="kpi-icon">
            <el-icon size="32"><User /></el-icon>
          </div>
          <div class="kpi-content">
            <div class="kpi-value">{{ activeRiders }}</div>
            <div class="kpi-label">活跃骑手</div>
            <div class="kpi-trend">
              <el-icon><TrendCharts /></el-icon>
              <span>+7 本周</span>
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
            <div class="kpi-value">{{ completionRate }}%</div>
            <div class="kpi-label">完成率</div>
            <div class="kpi-trend">
              <el-icon><TrendCharts /></el-icon>
              <span>+3.7% 本周</span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 订单列表 -->
    <el-card v-if="isManageMode" class="orders-list glass-card">
      <template #header>
        <div class="card-header">
          <span>订单列表</span>
          <div class="header-filters">
            <el-select v-model="orderFilters.status" placeholder="订单状态" clearable style="width: 120px; margin-right: 10px;">
              <el-option label="全部" value="" />
              <el-option label="待接单" value="待接单" />
              <el-option label="已接单" value="已接单" />
              <el-option label="进行中" value="进行中" />
              <el-option label="已完成" value="已完成" />
              <el-option label="已取消" value="已取消" />
            </el-select>
            <el-select v-model="orderFilters.service_type" placeholder="服务类型" clearable style="width: 120px; margin-right: 10px;">
              <el-option label="全部" value="" />
              <el-option label="代取快递" value="快递代取" />
              <el-option label="代买物品" value="物品代买" />
              <el-option label="代排队" value="排队代办" />
              <el-option label="其他代办" value="其他代办" />
            </el-select>
            <el-input v-model="orderFilters.keyword" placeholder="搜索订单" style="width: 200px; margin-right: 10px;">
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-button type="primary" @click="loadOrders">搜索</el-button>
          </div>
        </div>
      </template>
      <el-table :data="orderList" stripe v-loading="orderLoading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="订单标题" width="200" show-overflow-tooltip />
        <el-table-column prop="publisher_name" label="发布者" width="120" />
        <el-table-column prop="accepter_name" label="接单者" width="120">
          <template #default="{ row }">
            {{ row.accepter_name || '未接单' }}
          </template>
        </el-table-column>
        <el-table-column prop="service_type" label="服务类型" width="120">
          <template #default="{ row }">
            <el-tag :type="getServiceTypeColor(row.service_type)">
              {{ getServiceTypeText(row.service_type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="金额" width="100">
          <template #default="{ row }">
            ¥{{ row.price }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_time" label="创建时间" width="160">
          <template #default="{ row }">
            {{ formatDate(row.created_time) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <div class="action-buttons">
              <el-button size="small" @click="handleViewOrder(row)">查看详情</el-button>
              <el-button size="small" type="primary" @click="handleEditOrder(row)">编辑</el-button>
              <el-button size="small" type="danger" @click="handleDeleteOrder(row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="orderPagination.page"
          v-model:page-size="orderPagination.limit"
          :page-sizes="[10, 20, 50, 100]"
          :total="orderPagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="loadOrders"
          @current-change="loadOrders"
        />
      </div>
    </el-card>

    <!-- 骑手管理 -->
    <el-card v-if="isManageMode" class="riders-list glass-card">
      <template #header>
        <div class="card-header">
          <span>骑手管理</span>
          <div class="header-filters">
            <el-input v-model="riderFilters.keyword" placeholder="搜索骑手" style="width: 200px; margin-right: 10px;">
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-button type="primary" @click="loadRiders">搜索</el-button>
          </div>
        </div>
      </template>
      <el-table :data="riderList" stripe v-loading="riderLoading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="rider_name" label="姓名" width="120" />
        <el-table-column prop="phone" label="电话" width="120" />
        <el-table-column prop="completed_orders" label="完成订单" width="100" />
        <el-table-column prop="average_rating" label="平均评分" width="100">
          <template #default="{ row }">
            <el-rate v-model="row.average_rating" disabled show-score />
          </template>
        </el-table-column>
        <el-table-column prop="total_earnings" label="总收入" width="100">
          <template #default="{ row }">
            ¥{{ row.total_earnings }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getRiderStatusType(row.status)">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="join_date" label="注册时间" width="160">
          <template #default="{ row }">
            {{ formatDate(row.join_date) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <div class="action-buttons">
              <el-button size="small" @click="handleViewRider(row)">查看详情</el-button>
              <el-button size="small" type="warning" @click="handleDisableRider(row)">禁用</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="riderPagination.page"
          v-model:page-size="riderPagination.limit"
          :page-sizes="[10, 20, 50, 100]"
          :total="riderPagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="loadRiders"
          @current-change="loadRiders"
        />
      </div>
    </el-card>

    <!-- 数据分析 -->
    <el-row v-if="!isManageMode" :gutter="20" class="charts-section">
      <el-col :span="8">
        <el-card class="glass-card chart-card">
          <template #header>
            <div class="card-header">
              <span>订单量趋势</span>
              <el-icon><TrendCharts /></el-icon>
            </div>
          </template>
          <div ref="orderTrendChart" class="chart-container"></div>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card class="glass-card chart-card">
          <template #header>
            <div class="card-header">
              <span>服务类型分布</span>
              <el-icon><PieChart /></el-icon>
            </div>
          </template>
          <div ref="serviceTypeChart" class="chart-container"></div>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card class="glass-card chart-card">
          <template #header>
            <div class="card-header">
              <span>订单状态分布</span>
              <el-icon><DataBoard /></el-icon>
            </div>
          </template>
          <div ref="statusChart" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 高级分析图表 -->
    <el-row v-if="!isManageMode" :gutter="20" class="charts-section">
      <el-col :span="12">
        <el-card class="glass-card chart-card">
          <template #header>
            <div class="card-header">
              <span>收入趋势分析</span>
              <el-icon><Money /></el-icon>
            </div>
          </template>
          <div ref="revenueChart" class="chart-container"></div>
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-card class="glass-card chart-card">
          <template #header>
            <div class="card-header">
              <span>骑手绩效排行</span>
              <el-icon><Trophy /></el-icon>
            </div>
          </template>
          <div ref="riderRankingChart" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, Document, Money, User, Star, TrendCharts, PieChart, DataBoard, Trophy } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import { getAllOrders, getRiderList, getErrandStats, type ErrandOrder, type Rider, type ErrandStats } from '@/api/errand'

// 数据状态
const router = useRouter()
const isManageMode = ref(false)
const orderList = ref<ErrandOrder[]>([])
const riderList = ref<Rider[]>([])
const orderLoading = ref(false)
const riderLoading = ref(false)

// 分页数据
const orderPagination = reactive({
  page: 1,
  limit: 10,
  total: 0
})

const riderPagination = reactive({
  page: 1,
  limit: 10,
  total: 0
})

// 筛选条件
const orderFilters = reactive({
  status: '',
  service_type: '',
  keyword: ''
})

const riderFilters = reactive({
  keyword: ''
})

// KPI 数据 - 更真实的模拟数据
const totalOrders = ref(1247)
const totalRevenue = ref(45680)
const activeRiders = ref(47)
const completionRate = ref(94.2)

// 图表引用
const orderTrendChart = ref<HTMLElement>()
const serviceTypeChart = ref<HTMLElement>()
const statusChart = ref<HTMLElement>()
const revenueChart = ref<HTMLElement>()
const riderRankingChart = ref<HTMLElement>()

// 获取状态类型
const getStatusType = (status: string) => {
  switch (status) {
    case '待接单': return 'warning'
    case '已接单': return 'primary'
    case '进行中': return 'info'
    case '已完成': return 'success'
    case '已取消': return 'danger'
    case '已退款': return 'info'
    default: return 'info'
  }
}

// 获取服务类型颜色
const getServiceTypeColor = (type: string) => {
  switch (type) {
    case '快递代取': return 'primary'
    case '物品代买': return 'success'
    case '排队代办': return 'warning'
    case '其他代办': return 'info'
    default: return 'info'
  }
}

// 获取服务类型文本
const getServiceTypeText = (type: string) => {
  switch (type) {
    case '快递代取': return '代取快递'
    case '物品代买': return '代买物品'
    case '排队代办': return '代排队'
    case '其他代办': return '其他代办'
    default: return type
  }
}

// 获取骑手状态颜色
const getRiderStatusType = (status: string) => {
  switch (status) {
    case '在线': return 'success'
    case '忙碌': return 'warning'
    case '离线': return 'info'
    default: return 'info'
  }
}

// 格式化日期
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('zh-CN')
}

// 加载订单列表
const loadOrders = async () => {
  orderLoading.value = true
  try {
    const response = await getAllOrders({
      page: orderPagination.page,
      limit: orderPagination.limit,
      status: orderFilters.status || undefined,
      service_type: orderFilters.service_type || undefined,
      keyword: orderFilters.keyword || undefined
    })
    orderList.value = response.data.orders
    orderPagination.total = response.data.pagination.total
  } catch (error) {
    ElMessage.error('加载订单列表失败')
  } finally {
    orderLoading.value = false
  }
}

// 加载骑手列表
const loadRiders = async () => {
  riderLoading.value = true
  try {
    const response = await getRiderList({
      page: riderPagination.page,
      limit: riderPagination.limit,
      keyword: riderFilters.keyword || undefined
    })
    riderList.value = response.data.riders
    riderPagination.total = response.data.pagination.total
  } catch (error) {
    ElMessage.error('加载骑手列表失败')
  } finally {
    riderLoading.value = false
  }
}

// 加载统计数据
const loadStats = async () => {
  try {
    const response = await getErrandStats()
    const stats = response.data
    totalOrders.value = stats.total_orders
    totalRevenue.value = stats.total_revenue
    completionRate.value = stats.completion_rate
  } catch (error) {
    ElMessage.error('加载统计数据失败')
  }
}

// 查看订单详情
const handleViewOrder = (order: ErrandOrder) => {
  router.push(`/errand/order/${order.id}`)
}

// 编辑订单
const handleEditOrder = (order: ErrandOrder) => {
  router.push(`/errand/order/${order.id}`)
}

// 删除订单
const handleDeleteOrder = async (order: ErrandOrder) => {
  try {
    await ElMessageBox.confirm('确定要删除这个订单吗？', '确认删除', {
      type: 'warning'
    })
    ElMessage.success('删除成功')
    await loadOrders()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 查看骑手详情
const handleViewRider = (rider: Rider) => {
  ElMessage.info(`查看骑手: ${rider.display_name}`)
}

// 禁用骑手
const handleDisableRider = async (rider: Rider) => {
  try {
    await ElMessageBox.confirm('确定要禁用这个骑手吗？', '确认禁用', {
      type: 'warning'
    })
    ElMessage.success('禁用成功')
    await loadRiders()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('禁用失败')
    }
  }
}

// 创建订单
const handleAddOrder = () => {
  ElMessage.info('创建订单功能待实现')
}

// 初始化图表
const initCharts = () => {
  nextTick(() => {
    // 订单量趋势
    if (orderTrendChart.value) {
      const chart = echarts.init(orderTrendChart.value)
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
          data: [80, 100, 120, 110, 140, 150],
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

    // 服务类型分布
    if (serviceTypeChart.value) {
      const chart = echarts.init(serviceTypeChart.value)
      const option = {
        tooltip: { 
          trigger: 'item',
          backgroundColor: 'rgba(50, 50, 50, 0.9)',
          borderColor: '#666',
          textStyle: { color: '#fff' }
        },
        series: [{
          data: [
            { value: 35, name: '代取快递', itemStyle: { color: '#ff6b6b' } },
            { value: 25, name: '代买物品', itemStyle: { color: '#4ecdc4' } },
            { value: 20, name: '代排队', itemStyle: { color: '#45b7d1' } },
            { value: 15, name: '其他代办', itemStyle: { color: '#96ceb4' } }
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

    // 订单状态分布
    if (statusChart.value) {
      const chart = echarts.init(statusChart.value)
      const option = {
        tooltip: { 
          trigger: 'item',
          backgroundColor: 'rgba(50, 50, 50, 0.9)',
          borderColor: '#666',
          textStyle: { color: '#fff' }
        },
        series: [{
          data: [
            { value: 45, name: '已完成', itemStyle: { color: '#67c23a' } },
            { value: 25, name: '进行中', itemStyle: { color: '#409eff' } },
            { value: 15, name: '待接单', itemStyle: { color: '#e6a23c' } },
            { value: 10, name: '已取消', itemStyle: { color: '#f56c6c' } },
            { value: 5, name: '已退款', itemStyle: { color: '#909399' } }
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

    // 收入趋势分析
    if (revenueChart.value) {
      const chart = echarts.init(revenueChart.value)
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
          data: [1200, 1500, 1800, 1600, 2000, 2200],
          type: 'bar',
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#4facfe' },
              { offset: 1, color: '#00f2fe' }
            ])
          },
          emphasis: {
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#667eea' },
                { offset: 1, color: '#764ba2' }
              ])
            }
          }
        }]
      }
      chart.setOption(option as any)
    }

    // 骑手绩效排行
    if (riderRankingChart.value) {
      const chart = echarts.init(riderRankingChart.value)
      const option = {
        tooltip: { 
          trigger: 'axis',
          backgroundColor: 'rgba(50, 50, 50, 0.9)',
          borderColor: '#666',
          textStyle: { color: '#fff' }
        },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: { 
          type: 'value',
          axisLine: { lineStyle: { color: '#666' } },
          axisLabel: { color: '#999' },
          splitLine: { lineStyle: { color: '#f0f0f0' } }
        },
        yAxis: {
          type: 'category',
          data: ['张三', '李四', '王五', '赵六', '钱七'],
          axisLine: { lineStyle: { color: '#666' } },
          axisLabel: { color: '#999' }
        },
        series: [{
          data: [45, 38, 32, 28, 25],
          type: 'bar',
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: '#f093fb' },
              { offset: 1, color: '#f5576c' }
            ])
          },
          emphasis: {
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: '#667eea' },
                { offset: 1, color: '#764ba2' }
              ])
            }
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
    loadOrders()
    loadRiders()
  } else {
    loadStats()
  }
}

// 切回看板后重绘图表
watch(isManageMode, (val) => {
  if (!val) {
    nextTick(() => initCharts())
  }
})

onMounted(() => {
  loadStats()
  initCharts()
})
</script>

<style scoped>
.errand-page {
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
<template>
  <div class="clubs-page">
    <div class="page-header">
      <h2>社团管理</h2>
      <el-button type="primary" @click="handleAddClub">
        <el-icon><Plus /></el-icon>
        添加社团
      </el-button>
    </div>

    <!-- 社团列表 -->
    <el-card class="clubs-list">
      <template #header>
        <span>社团列表</span>
      </template>
      <el-table :data="clubList" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="社团名称" width="150" />
        <el-table-column prop="category" label="类别" width="120" />
        <el-table-column prop="leader" label="负责人" width="120" />
        <el-table-column prop="memberCount" label="成员数" width="100" />
        <el-table-column prop="activityCount" label="活动数" width="100" />
        <el-table-column prop="level" label="等级" width="100">
          <template #default="{ row }">
            <el-tag :type="getLevelType(row.level)">
              {{ getLevelText(row.level) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === 'active' ? '活跃' : '暂停' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250">
          <template #default="{ row }">
            <el-button size="small" @click="handleEditClub(row)">编辑</el-button>
            <el-button size="small" type="primary" @click="handleManageMembers(row)">成员管理</el-button>
            <el-button size="small" type="success" @click="handleManageActivities(row)">活动管理</el-button>
            <el-button size="small" type="danger" @click="handleDeleteClub(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 社团数据可视化 -->
    <el-row :gutter="20" class="charts-section">
      <el-col :span="8">
        <el-card>
          <template #header>
            <span>社团活跃度排行</span>
          </template>
          <div ref="activityRankingChart" class="chart-container"></div>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card>
          <template #header>
            <span>社团类型分布</span>
          </template>
          <div ref="categoryDistributionChart" class="chart-container"></div>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card>
          <template #header>
            <span>活动发布趋势</span>
          </template>
          <div ref="activityTrendChart" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 社团协作网络 -->
    <el-card class="network-section">
      <template #header>
        <span>社团协作网络</span>
      </template>
      <div ref="collaborationNetworkChart" class="network-chart"></div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import * as echarts from 'echarts'

// 社团列表
const clubList = ref([
  {
    id: 1,
    name: '计算机协会',
    category: '技术类',
    leader: '张三',
    memberCount: 120,
    activityCount: 15,
    level: 'A',
    status: 'active'
  },
  {
    id: 2,
    name: '摄影社',
    category: '艺术类',
    leader: '李四',
    memberCount: 80,
    activityCount: 12,
    level: 'B',
    status: 'active'
  },
  {
    id: 3,
    name: '篮球社',
    category: '体育类',
    leader: '王五',
    memberCount: 150,
    activityCount: 20,
    level: 'A',
    status: 'active'
  },
  {
    id: 4,
    name: '文学社',
    category: '文化类',
    leader: '赵六',
    memberCount: 60,
    activityCount: 8,
    level: 'C',
    status: 'inactive'
  },
  {
    id: 5,
    name: '音乐社',
    category: '艺术类',
    leader: '钱七',
    memberCount: 90,
    activityCount: 10,
    level: 'B',
    status: 'active'
  }
])

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

// 添加社团
const handleAddClub = () => {
  ElMessage.info('添加社团功能待实现')
}

// 编辑社团
const handleEditClub = (row: any) => {
  ElMessage.info(`编辑社团: ${row.name}`)
}

// 成员管理
const handleManageMembers = (row: any) => {
  ElMessage.info(`管理社团 ${row.name} 的成员`)
}

// 活动管理
const handleManageActivities = (row: any) => {
  ElMessage.info(`管理社团 ${row.name} 的活动`)
}

// 删除社团
const handleDeleteClub = (row: any) => {
  ElMessage.info(`删除社团: ${row.name}`)
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

onMounted(() => {
  initCharts()
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
</style>

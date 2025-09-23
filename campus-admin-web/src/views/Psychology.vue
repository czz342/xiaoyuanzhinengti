<template>
  <div class="psychology-page">
    <div class="page-header">
      <h2>心理中心管理</h2>
      <div class="header-actions">
        <el-button v-if="isManageMode" type="primary" @click="handleAddCounselor">
          <el-icon><Plus /></el-icon>
          添加咨询师
        </el-button>
        <el-button type="success" plain @click="toggleMode">{{ isManageMode ? '返回可视化看板' : '管理详细数据' }}</el-button>
      </div>
    </div>

    <!-- 高级KPI指标卡片 -->
    <div v-if="!isManageMode" class="kpi-section">
      <div class="kpi-card kpi-primary">
        <div class="kpi-value">{{ kpi.todayConsultations }}</div>
        <div class="kpi-label">今日咨询</div>
        <div class="kpi-trend positive">+10.2%</div>
      </div>
      <div class="kpi-card kpi-success">
        <div class="kpi-value">{{ kpi.waitingClients }}</div>
        <div class="kpi-label">待咨询人数</div>
        <div class="kpi-trend neutral">--</div>
      </div>
      <div class="kpi-card kpi-warning">
        <div class="kpi-value">{{ kpi.satisfaction }}%</div>
        <div class="kpi-label">满意度</div>
        <div class="kpi-trend positive">+2.3%</div>
      </div>
      <div class="kpi-card kpi-info">
        <div class="kpi-value">{{ kpi.availableCounselors }}</div>
        <div class="kpi-label">在线咨询师</div>
        <div class="kpi-trend positive">+1</div>
      </div>
    </div>

    <!-- 咨询师列表 -->
    <el-card v-if="isManageMode" class="counselors-list">
      <template #header>
        <span>咨询师列表</span>
      </template>
      <el-table :data="counselorList" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="specialty" label="专业领域" width="150" />
        <el-table-column prop="experience" label="工作经验" width="120" />
        <el-table-column prop="appointmentCount" label="今日预约" width="100" />
        <el-table-column prop="rating" label="评分" width="100">
          <template #default="{ row }">
            <el-rate v-model="row.rating" disabled show-score />
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === 'active' ? '在线' : '离线' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="handleEditCounselor(row)">编辑</el-button>
            <el-button size="small" type="primary" @click="handleManageSchedule(row)">排班管理</el-button>
            <el-button size="small" type="success" @click="handleManageAppointments(row)">预约管理</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 数据分析 -->
    <el-row v-if="!isManageMode" :gutter="20" class="charts-section">
      <el-col :span="8">
        <el-card class="glass-card">
          <template #header>
            <span>咨询量趋势</span>
          </template>
          <div ref="consultationTrendChart" class="chart-container"></div>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card class="glass-card">
          <template #header>
            <span>心理问题类型分布</span>
          </template>
          <div ref="problemTypeChart" class="chart-container"></div>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card class="glass-card">
          <template #header>
            <span>用户满意度</span>
          </template>
          <div ref="satisfactionChart" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 高阶看板 · 桑基 + 实时流水 -->
    <el-row v-if="!isManageMode" :gutter="20" class="charts-section">
      <el-col :span="12">
        <el-card class="glass-card">
          <template #header>
            <span>来访转介路径桑基图</span>
          </template>
          <div ref="referralSankeyChart" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="glass-card">
          <template #header>
            <div class="card-header"><span>实时排队流水</span><el-tag type="success">实时</el-tag></div>
          </template>
          <div class="stream-list">
            <div v-for="item in streamList" :key="item.id" class="stream-item">
              <span class="time">{{ item.time }}</span>
              <span class="content">{{ item.content }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 高阶看板 · 雷达对比 + 转化漏斗 -->
    <el-row v-if="!isManageMode" :gutter="20" class="charts-section">
      <el-col :span="12">
        <el-card class="glass-card">
          <template #header>
            <span>问卷维度雷达对比</span>
          </template>
          <div ref="questionnaireRadarChart" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="glass-card">
          <template #header>
            <span>咨询转化漏斗</span>
          </template>
          <div ref="conversionFunnelChart" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import * as echarts from 'echarts'

// KPI模拟数据
const kpi = reactive({
  todayConsultations: 86,
  waitingClients: 12,
  satisfaction: 96.5,
  availableCounselors: 8
})

// 咨询师列表
const counselorList = ref([
  {
    id: 1,
    name: '张心理师',
    specialty: '焦虑抑郁',
    experience: '5年',
    appointmentCount: 8,
    rating: 4.8,
    status: 'active'
  },
  {
    id: 2,
    name: '李心理师',
    specialty: '人际关系',
    experience: '3年',
    appointmentCount: 6,
    rating: 4.6,
    status: 'active'
  },
  {
    id: 3,
    name: '王心理师',
    specialty: '学习压力',
    experience: '7年',
    appointmentCount: 10,
    rating: 4.9,
    status: 'active'
  }
])

// 图表引用
const consultationTrendChart = ref<HTMLElement>()
const problemTypeChart = ref<HTMLElement>()
const satisfactionChart = ref<HTMLElement>()
const referralSankeyChart = ref<HTMLElement>()
const questionnaireRadarChart = ref<HTMLElement>()
const conversionFunnelChart = ref<HTMLElement>()
const streamList = ref<any[]>([
  { id: 1, time: '12:00', content: 'A同学 取号成功，等待叫号' },
  { id: 2, time: '12:01', content: 'B同学 正在咨询室2进行会谈' },
  { id: 3, time: '12:02', content: 'C同学 已完成初筛，进入预约阶段' }
])

// 添加咨询师
const handleAddCounselor = () => {
  ElMessage.info('添加咨询师功能待实现')
}

// 编辑咨询师
const handleEditCounselor = (row: any) => {
  ElMessage.info(`编辑咨询师: ${row.name}`)
}

// 排班管理
const handleManageSchedule = (row: any) => {
  ElMessage.info(`管理咨询师 ${row.name} 的排班`)
}

// 预约管理
const handleManageAppointments = (row: any) => {
  ElMessage.info(`管理咨询师 ${row.name} 的预约`)
}

// 初始化图表
const initCharts = () => {
  nextTick(() => {
    const palette = ['#4f8cff', '#43e97b', '#f6d365', '#a18cd1', '#fda085']
    const axisStyle = {
      axisLine: { lineStyle: { color: 'rgba(0,0,0,0.15)' } },
      axisLabel: { color: '#666' },
      splitLine: { lineStyle: { color: 'rgba(0,0,0,0.08)' } }
    }
    const grid = { top: 30, left: 18, right: 12, bottom: 26, containLabel: true }

    // 咨询量趋势（平滑折线+渐变面积）
    if (consultationTrendChart.value) {
      const chart = echarts.init(consultationTrendChart.value)
      const option: any = {
        tooltip: { trigger: 'axis' },
        grid,
        xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月'], ...axisStyle },
        yAxis: { type: 'value', ...axisStyle },
        series: [{
          data: [80, 100, 120, 110, 140, 150],
          type: 'line', smooth: true,
          symbol: 'circle', symbolSize: 6,
          lineStyle: { width: 3, color: palette[0] },
          itemStyle: { color: '#fff', borderColor: palette[0], borderWidth: 2 },
          areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(79,140,255,0.28)' }, { offset: 1, color: 'rgba(79,140,255,0.06)' }] } }
        }]
      }
      chart.setOption(option)
    }

    // 心理问题类型分布（圆环+白描边+高亮阴影）
    if (problemTypeChart.value) {
      const chart = echarts.init(problemTypeChart.value)
      const option: any = {
        tooltip: { trigger: 'item' },
        series: [{
          type: 'pie',
          radius: ['48%', '70%'],
          center: ['50%', '54%'],
          avoidLabelOverlap: false,
          itemStyle: { borderColor: '#fff', borderWidth: 2 },
          label: { color: '#666', formatter: '{b}: {d}%' },
          emphasis: { itemStyle: { shadowBlur: 12, shadowColor: 'rgba(0,0,0,0.18)' } },
          data: [
            { value: 30, name: '学习压力', itemStyle: { color: palette[0] } },
            { value: 25, name: '人际关系', itemStyle: { color: palette[1] } },
            { value: 20, name: '焦虑抑郁', itemStyle: { color: palette[2] } },
            { value: 15, name: '情感问题', itemStyle: { color: palette[3] } },
            { value: 10, name: '其他', itemStyle: { color: palette[4] } }
          ]
        }]
      }
      chart.setOption(option)
    }

    // 用户满意度（横向圆角渐变柱）
    if (satisfactionChart.value) {
      const chart = echarts.init(satisfactionChart.value)
      const option: any = {
        tooltip: { trigger: 'axis' },
        grid,
        xAxis: { type: 'value', ...axisStyle },
        yAxis: { type: 'category', data: ['张心理师', '李心理师', '王心理师', '赵心理师', '钱心理师'], ...axisStyle },
        series: [{
          data: [4.8, 4.6, 4.9, 4.7, 4.5],
          type: 'bar', barWidth: 16,
          itemStyle: { borderRadius: [0, 10, 10, 0], color: { type: 'linear', x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: palette[0] }, { offset: 1, color: 'rgba(79,140,255,0.35)' }] } }
        }]
      }
      chart.setOption(option)
    }

    // 来访转介路径桑基图
    if (referralSankeyChart.value) {
      const chart = echarts.init(referralSankeyChart.value)
      const option: any = {
        tooltip: { trigger: 'item' },
        series: [{
          type: 'sankey',
          layout: 'none',
          nodeWidth: 18,
          nodeGap: 10,
          label: { color: '#555', fontSize: 12 },
          lineStyle: { color: 'gradient', curveness: 0.5, opacity: 0.55 },
          data: [
            { name: '自助预约' }, { name: '线下来访' }, { name: '初筛' }, { name: '正式咨询' }, { name: '转介校医' }, { name: '跟踪回访' }
          ],
          links: [
            { source: '自助预约', target: '初筛', value: 60 },
            { source: '线下来访', target: '初筛', value: 40 },
            { source: '初筛', target: '正式咨询', value: 70 },
            { source: '初筛', target: '转介校医', value: 20 },
            { source: '正式咨询', target: '跟踪回访', value: 65 }
          ]
        }]
      }
      chart.setOption(option)
    }

    // 问卷维度雷达对比
    if (questionnaireRadarChart.value) {
      const chart = echarts.init(questionnaireRadarChart.value)
      const option: any = {
        tooltip: { trigger: 'item' },
        radar: {
          indicator: [
            { name: '焦虑', max: 100 }, { name: '抑郁', max: 100 }, { name: '压力', max: 100 }, { name: '人际', max: 100 }, { name: '睡眠', max: 100 }
          ],
          splitLine: { lineStyle: { color: 'rgba(0,0,0,0.08)' } },
          splitArea: { areaStyle: { color: ['rgba(79,140,255,0.02)','rgba(79,140,255,0.04)'] } }
        },
        legend: { bottom: 0, data: ['入组平均', '个体样本'] },
        series: [{ type: 'radar',
          data: [
            { value: [55, 48, 62, 50, 45], name: '入组平均', areaStyle: { color: 'rgba(67,233,123,0.20)' }, lineStyle: { color: '#43e97b' } },
            { value: [70, 60, 72, 65, 58], name: '个体样本', areaStyle: { color: 'rgba(161,140,209,0.22)' }, lineStyle: { color: '#a18cd1' } }
          ]
        }]
      }
      chart.setOption(option)
    }

    // 咨询转化漏斗
    if (conversionFunnelChart.value) {
      const chart = echarts.init(conversionFunnelChart.value)
      const option: any = {
        tooltip: { trigger: 'item', formatter: '{b}: {c}' },
        series: [{
          type: 'funnel',
          left: '10%',
          width: '80%',
          label: { color: '#666' },
          itemStyle: { opacity: 0.9 },
          data: [
            { value: 200, name: '访问页面' },
            { value: 150, name: '提交初筛' },
            { value: 110, name: '预约成功' },
            { value: 80, name: '到访咨询' },
            { value: 60, name: '完成随访' }
          ]
        }]
      }
      chart.setOption(option)
    }
  })
}

onMounted(() => {
  initCharts()
  // 模拟实时排队流水
  setInterval(() => {
    const names = ['张同学', '李同学', '王同学', '赵同学']
    const actions = ['取号成功', '进入咨询室', '完成初筛', '预约成功']
    const item = {
      id: Date.now(),
      time: new Date().toLocaleTimeString('zh-CN', { hour12: false }).slice(0,5),
      content: `${names[Math.floor(Math.random()*names.length)]} ${actions[Math.floor(Math.random()*actions.length)]}`
    }
    streamList.value.unshift(item)
    if (streamList.value.length > 12) streamList.value.pop()
  }, 5000)
})

// 看板/管理切换
const isManageMode = ref(false)
const toggleMode = () => {
  isManageMode.value = !isManageMode.value
}

// 切回看板后重绘图表
watch(isManageMode, (val) => {
  if (!val) {
    nextTick(() => initCharts())
  }
})
</script>

<style scoped>
.psychology-page {
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

/* 高级KPI卡片样式 */
.kpi-section { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 20px; }
.kpi-card { position: relative; border-radius: 14px; padding: 18px 20px; color: #fff; box-shadow: 0 10px 24px rgba(0,0,0,0.08); overflow: hidden; }
.kpi-card::after { content: ''; position: absolute; right: -30px; top: -30px; width: 120px; height: 120px; background: rgba(255,255,255,0.15); border-radius: 50%; filter: blur(2px); }
.kpi-primary { background: linear-gradient(135deg, #4f8cff 0%, #6cc1ff 100%); }
.kpi-success { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
.kpi-warning { background: linear-gradient(135deg, #f6d365 0%, #fda085 100%); }
.kpi-info { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.kpi-value { font-size: 28px; font-weight: 700; color: #fff; margin-bottom: 6px; text-shadow: 0 2px 6px rgba(0,0,0,0.18); }
.kpi-label { font-size: 13px; color: rgba(255,255,255,0.9); margin-bottom: 10px; }
.kpi-trend { display: inline-block; font-size: 12px; padding: 2px 8px; border-radius: 10px; backdrop-filter: blur(4px); }
.kpi-trend.positive { color: #b2ff59; background: rgba(0,0,0,0.15); }
.kpi-trend.negative { color: #ffe8e6; background: rgba(0,0,0,0.18); }
.kpi-trend.neutral { color: #fff; background: rgba(0,0,0,0.12); }

.counselors-list {
  margin-bottom: 20px;
}

.charts-section {
  margin-bottom: 20px;
}

.chart-container {
  height: 250px;
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
</style>

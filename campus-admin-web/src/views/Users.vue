<template>
  <div class="users-page">
    <div class="page-header">
      <h2>用户管理</h2>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        添加用户
      </el-button>
    </div>

    <!-- 搜索筛选 -->
    <el-card class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="用户名">
          <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable />
        </el-form-item>
        <el-form-item label="学号">
          <el-input v-model="searchForm.studentId" placeholder="请输入学号" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="活跃" value="active" />
            <el-option label="禁用" value="inactive" />
            <el-option label="封禁" value="banned" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 数据表格 -->
    <el-card>
      <el-table :data="userList" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="studentId" label="学号" width="120" />
        <el-table-column prop="displayName" label="显示名" width="120" />
        <el-table-column prop="email" label="邮箱" width="200" />
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="creditScore" label="信誉分" width="100" />
        <el-table-column prop="createdTime" label="注册时间" width="160" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" type="warning" @click="handleResetPassword(row)">重置密码</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 用户数据可视化 -->
    <el-row :gutter="20" class="charts-section">
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>用户增长趋势</span>
          </template>
          <div ref="userGrowthChart" class="chart-container"></div>
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>用户状态分布</span>
          </template>
          <div ref="userStatusChart" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import * as echarts from 'echarts'

// 搜索表单
const searchForm = reactive({
  username: '',
  studentId: '',
  status: ''
})

// 用户列表
const userList = ref([
  {
    id: 1,
    username: 'zhangsan',
    studentId: '2021001',
    displayName: '张三',
    email: 'zhangsan@example.com',
    phone: '13800138001',
    status: 'active',
    creditScore: 4.8,
    createdTime: '2023-09-01 10:00:00'
  },
  {
    id: 2,
    username: 'lisi',
    studentId: '2021002',
    displayName: '李四',
    email: 'lisi@example.com',
    phone: '13800138002',
    status: 'inactive',
    creditScore: 4.5,
    createdTime: '2023-09-02 11:00:00'
  }
])

const loading = ref(false)

// 分页
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 100
})

// 图表引用
const userGrowthChart = ref<HTMLElement>()
const userStatusChart = ref<HTMLElement>()

// 获取状态类型
const getStatusType = (status: string) => {
  switch (status) {
    case 'active': return 'success'
    case 'inactive': return 'warning'
    case 'banned': return 'danger'
    default: return 'info'
  }
}

// 获取状态文本
const getStatusText = (status: string) => {
  switch (status) {
    case 'active': return '活跃'
    case 'inactive': return '禁用'
    case 'banned': return '封禁'
    default: return '未知'
  }
}

// 搜索
const handleSearch = () => {
  loading.value = true
  // 模拟搜索
  setTimeout(() => {
    loading.value = false
    ElMessage.success('搜索完成')
  }, 1000)
}

// 重置
const handleReset = () => {
  Object.assign(searchForm, {
    username: '',
    studentId: '',
    status: ''
  })
}

// 添加用户
const handleAdd = () => {
  ElMessage.info('添加用户功能待实现')
}

// 编辑用户
const handleEdit = (row: any) => {
  ElMessage.info(`编辑用户: ${row.username}`)
}

// 重置密码
const handleResetPassword = (row: any) => {
  ElMessageBox.confirm(
    `确定要重置用户 ${row.username} 的密码吗？`,
    '确认重置',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    ElMessage.success('密码重置成功')
  })
}

// 删除用户
const handleDelete = (row: any) => {
  ElMessageBox.confirm(
    `确定要删除用户 ${row.username} 吗？`,
    '确认删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    ElMessage.success('删除成功')
  })
}

// 分页处理
const handleSizeChange = (val: number) => {
  pagination.pageSize = val
  // 重新加载数据
}

const handleCurrentChange = (val: number) => {
  pagination.currentPage = val
  // 重新加载数据
}

// 初始化图表
const initCharts = () => {
  nextTick(() => {
    // 用户增长趋势图
    if (userGrowthChart.value) {
      const chart = echarts.init(userGrowthChart.value)
      const option = {
        title: { text: '用户增长趋势' },
        tooltip: { trigger: 'axis' },
        xAxis: {
          type: 'category',
          data: ['1月', '2月', '3月', '4月', '5月', '6月']
        },
        yAxis: { type: 'value' },
        series: [{
          data: [120, 200, 150, 80, 70, 110],
          type: 'line',
          smooth: true,
          areaStyle: {}
        }]
      }
      chart.setOption(option)
    }

    // 用户状态分布图
    if (userStatusChart.value) {
      const chart = echarts.init(userStatusChart.value)
      const option = {
        title: { text: '用户状态分布' },
        tooltip: { trigger: 'item' },
        series: [{
          type: 'pie',
          data: [
            { value: 1048, name: '活跃用户' },
            { value: 200, name: '禁用用户' },
            { value: 50, name: '封禁用户' }
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
.users-page {
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

.search-card {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}

.charts-section {
  margin-top: 20px;
}

.chart-container {
  height: 300px;
}
</style>

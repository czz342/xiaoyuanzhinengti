<template>
  <div class="users-page">
    <div class="page-header">
      <h2>用户和角色管理</h2>
      <div style="display:flex; gap:10px;">
        <el-button v-if="isManageMode" type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          添加用户
        </el-button>
        <el-button type="success" plain @click="toggleMode">
          {{ isManageMode ? '返回可视化看板' : '管理详细数据' }}
        </el-button>
      </div>
    </div>

    <!-- 搜索筛选 -->
    <el-card class="search-card" v-if="isManageMode">
      <el-form :model="searchForm" inline>
        <el-form-item label="用户名">
          <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable />
        </el-form-item>
        <el-form-item label="学号">
          <el-input v-model="searchForm.studentId" placeholder="请输入学号" clearable />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="searchForm.role" placeholder="请选择角色" clearable style="min-width: 180px;">
            <el-option label="全部" value="" />
            <el-option label="超级管理员" value="admin" />
            <el-option label="图书馆管理员" value="librarian" />
            <el-option label="教室/自习室管理员" value="room_admin" />
            <el-option label="设备维修管理员" value="device_admin" />
            <el-option label="食堂商户" value="canteen" />
            <el-option label="校医/心理中心管理员" value="medical_psych" />
            <el-option label="校园圈子管理员" value="community_admin" />
            <el-option label="社团活动管理员" value="club_admin" />
            <el-option label="学生" value="student" />
            <el-option label="骑手" value="rider" />
            <el-option label="普通用户" value="user" />
          </el-select>
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

    <!-- 新增/编辑 用户弹窗 -->
    <el-dialog :title="isEdit ? '编辑用户' : '新增用户'" v-model="dialogVisible" width="560px" destroy-on-close>
      <el-form :model="userForm" :rules="formRules" ref="userFormRef" label-width="96px">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="userForm.userName" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item v-if="!isEdit" label="登录密码" prop="password">
          <el-input v-model="userForm.password" type="password" placeholder="请输入登录密码" show-password />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="显示名" prop="displayName">
          <el-input v-model="userForm.displayName" placeholder="请输入显示名" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="userForm.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="学号" prop="studentId">
          <el-input v-model="userForm.studentId" placeholder="请输入学号(选填)" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="userForm.role" placeholder="请选择角色">
            <el-option label="超级管理员" value="admin" />
            <el-option label="图书馆管理员" value="librarian" />
            <el-option label="教室/自习室管理员" value="room_admin" />
            <el-option label="设备维修管理员" value="device_admin" />
            <el-option label="食堂商户" value="canteen" />
            <el-option label="校医/心理中心管理员" value="medical_psych" />
            <el-option label="校园圈子管理员" value="community_admin" />
            <el-option label="社团活动管理员" value="club_admin" />
            <el-option label="学生" value="student" />
            <el-option label="骑手" value="rider" />
            <el-option label="普通用户" value="user" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="userForm.status" placeholder="请选择">
            <el-option label="活跃" value="active" />
            <el-option label="禁用" value="inactive" />
            <el-option label="封禁" value="banned" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">保存</el-button>
      </template>
    </el-dialog>

    <!-- 数据表格 -->
    <el-card v-if="isManageMode">
      <el-table :data="userStore.userList" v-loading="userStore.loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="userName" label="用户名" width="120" />
        <el-table-column prop="studentId" label="学号" width="120" />
        <el-table-column prop="displayName" label="显示名" width="120" />
        <el-table-column prop="email" label="邮箱" width="200" />
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column prop="role" label="角色" width="160">
          <template #default="{ row }">
            <el-tag :type="roleTagType(row.role)">{{ roleLabel(row.role) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="creditScore" label="信誉分" width="100" />
        <el-table-column prop="createdTime" label="注册时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240" fixed="right">
          <template #default="{ row }">
            <div class="op-actions">
              <el-button size="small" @click="handleEdit(row)">编辑</el-button>
              <el-button size="small" type="warning" @click="handleResetPassword(row)">重置密码</el-button>
              <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="userStore.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 顶部概览卡片（仅看板模式） -->
    <el-row v-if="!isManageMode" :gutter="20" class="kpi-section">
      <el-col :span="6">
        <div class="kpi-card kpi-primary">
          <div class="kpi-meta">
            <div class="kpi-title">用户总数</div>
            <div class="kpi-sub">Total Users</div>
          </div>
          <div class="kpi-value">{{ totalUsers }}</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="kpi-card kpi-success">
          <div class="kpi-meta">
            <div class="kpi-title">活跃率</div>
            <div class="kpi-sub">Active Rate</div>
          </div>
          <div class="kpi-value">{{ (activeRate * 100).toFixed(1) }}%</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="kpi-card kpi-warning">
          <div class="kpi-meta">
            <div class="kpi-title">角色种类</div>
            <div class="kpi-sub">Role Types</div>
          </div>
          <div class="kpi-value">{{ roleTypes }}</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="kpi-card kpi-info">
          <div class="kpi-meta">
            <div class="kpi-title">近7日新增</div>
            <div class="kpi-sub">New Users (7d)</div>
          </div>
          <div class="kpi-value">{{ recentAdded7d }}</div>
        </div>
      </el-col>
    </el-row>

    <!-- 用户与角色可视化 -->
    <el-row v-if="!isManageMode" :gutter="20" class="charts-section">
      <el-col :span="12">
        <el-card class="glass-card">
          <template #header>
            <span>用户增长趋势</span>
          </template>
          <div ref="userGrowthChart" class="chart-container"></div>
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-card class="glass-card">
          <template #header>
            <span>用户状态分布</span>
          </template>
          <div ref="userStatusChart" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row v-if="!isManageMode" :gutter="20" class="charts-section">
      <el-col :span="12">
        <el-card class="glass-card">
          <template #header>
            <span>角色分布</span>
          </template>
          <div ref="roleDistChart" class="chart-container"></div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card class="glass-card">
          <template #header>
            <span>角色-状态分布</span>
          </template>
          <div ref="roleStatusChart" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import { useUserStore } from '@/store/user'
import { createUser, updateUser, deleteUser, resetPassword } from '@/api/user'
import type { User, UserCreateParams, UserUpdateParams } from '@/types/api'

const userStore = useUserStore()

// 页面模式：默认展示可视化看板
const isManageMode = ref(false)
const toggleMode = () => {
  isManageMode.value = !isManageMode.value
}

// 切回看板模式时重新初始化图表
watch(isManageMode, (val) => {
  if (!val) {
    nextTick(() => initCharts())
  }
})

// 看板 KPI（先用简单统计，后续可接真实数据）
const totalUsers = ref(0)
const activeRate = ref(0.0)
const roleTypes = ref(0)
const recentAdded7d = ref(0)

const refreshKpis = () => {
  const list = (userStore.userList || []) as User[]
  totalUsers.value = userStore.total || list.length
  const activeCount = list.filter(u => u.status === 'active').length
  activeRate.value = totalUsers.value ? activeCount / totalUsers.value : 0
  const roles = new Set(list.map(u => u.role || 'user'))
  roleTypes.value = roles.size
  // 近7日新增（根据 createdTime 粗略统计）
  const sevenDaysAgo = Date.now() - 7 * 24 * 3600 * 1000
  recentAdded7d.value = list.filter(u => {
    const t = u.createdTime ? new Date(u.createdTime as any).getTime() : 0
    return t >= sevenDaysAgo
  }).length
}

// 搜索表单
const searchForm = reactive({
  username: '',
  studentId: '',
  role: '',
  status: ''
})

// 分页
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 图表引用
const userGrowthChart = ref<HTMLElement>()
const userStatusChart = ref<HTMLElement>()
const roleDistChart = ref<HTMLElement>()
const roleStatusChart = ref<HTMLElement>()

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

// 角色显示
const roleLabel = (role?: string) => {
  const map: Record<string, string> = {
    admin: '超级管理员',
    librarian: '图书馆管理员',
    room_admin: '教室/自习室管理员',
    device_admin: '设备维修管理员',
    canteen: '食堂商户',
    medical_psych: '校医/心理中心管理员',
    community_admin: '校园圈子管理员',
    club_admin: '社团活动管理员',
    student: '学生',
    rider: '骑手',
    user: '普通用户'
  }
  return role ? (map[role] || role) : '普通用户'
}
const roleTagType = (role?: string) => {
  const map: Record<string, 'primary' | 'success' | 'info' | 'warning' | 'danger'> = {
    admin: 'danger',
    librarian: 'success',
    room_admin: 'warning',
    device_admin: 'warning',
    canteen: 'success',
    medical_psych: 'info',
    community_admin: 'info',
    club_admin: 'info',
    student: 'primary',
    rider: 'primary',
    user: 'info'
  }
  return role ? (map[role] ?? 'info') : 'info'
}

// 搜索
const handleSearch = async () => {
  try {
    await userStore.fetchUserList(searchForm)
    pagination.total = userStore.total
    ElMessage.success('搜索完成')
    refreshKpis()
  } catch (error) {
    ElMessage.error('搜索失败')
  }
}

// 重置
const handleReset = () => {
  Object.assign(searchForm, {
    username: '',
    studentId: '',
    role: '',
    status: ''
  })
  handleSearch()
}

// 添加用户
const handleAdd = () => {
  isEdit.value = false
  Object.assign(userForm, defaultUserForm)
  dialogVisible.value = true
}

// 编辑用户
const handleEdit = (row: User) => {
  isEdit.value = true
  Object.assign(userForm, {
    id: row.id,
    userName: row.userName,
    email: row.email,
    phone: row.phone || '',
    displayName: row.displayName || '',
    studentId: row.studentId || '',
    status: row.status || 'active'
  })
  dialogVisible.value = true
}

// 重置密码
const handleResetPassword = (row: User) => {
  ElMessageBox.confirm(
    `确定要重置用户 ${row.userName} 的密码吗？`,
    '确认重置',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      await resetPassword(row.id)
      ElMessage.success('密码重置成功')
    } catch (error) {
      ElMessage.error('密码重置失败')
    }
  })
}

// 删除用户
const handleDelete = (row: User) => {
  ElMessageBox.confirm(
    `确定要删除用户 ${row.userName} 吗？`,
    '确认删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      await deleteUser(row.id)
      ElMessage.success('删除成功')
      handleSearch() // 重新加载列表
    } catch (error) {
      ElMessage.error('删除失败')
    }
  })
}

// 分页处理
const handleSizeChange = (val: number) => {
  pagination.pageSize = val
  pagination.currentPage = 1
  userStore.setPagination(1, val)
  handleSearch()
}

const handleCurrentChange = (val: number) => {
  pagination.currentPage = val
  userStore.setPagination(val, pagination.pageSize)
  handleSearch()
}

// 初始化图表
const initCharts = () => {
  nextTick(() => {
    // 用户增长趋势图
    if (userGrowthChart.value) {
      const chart = echarts.init(userGrowthChart.value)
      const option = {
        grid: { left: 30, right: 20, top: 20, bottom: 20 },
        tooltip: { trigger: 'axis' },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLine: { lineStyle: { color: '#c1c7d0' } },
          axisLabel: { color: '#6b7280' },
          data: ['1月', '2月', '3月', '4月', '5月', '6月']
        },
        yAxis: { 
          type: 'value',
          axisLine: { show: false },
          splitLine: { lineStyle: { color: 'rgba(0,0,0,0.06)' } },
          axisLabel: { color: '#6b7280' }
        },
        series: [{
          data: [120, 200, 150, 220, 260, 310],
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: { width: 3, color: '#4f8cff' },
          itemStyle: { color: '#4f8cff', shadowBlur: 8, shadowColor: 'rgba(79,140,255,0.5)' },
          areaStyle: {
            color: new (echarts as any).graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(79,140,255,0.35)' },
              { offset: 1, color: 'rgba(79,140,255,0.02)' }
            ])
          }
        }]
      }
      chart.setOption(option)
    }

    // 用户状态分布图
    if (userStatusChart.value) {
      const chart = echarts.init(userStatusChart.value)
      const option = {
        tooltip: { trigger: 'item' },
        series: [{
          type: 'pie',
          radius: ['40%', '70%'],
          itemStyle: { borderRadius: 8, borderColor: '#fff', borderWidth: 2 },
          color: ['#43e97b', '#f6d365', '#f5576c'],
          data: [
            { value: 1048, name: '活跃' },
            { value: 200, name: '禁用' },
            { value: 50, name: '封禁' }
          ],
          label: { color: '#4b5563' }
        }]
      }
      chart.setOption(option)
    }

    // 角色分布图
    if (roleDistChart.value) {
      const chart = echarts.init(roleDistChart.value)
      const option = {
        tooltip: { trigger: 'item' },
        legend: { show: false },
        series: [{
          type: 'pie',
          radius: ['45%', '75%'],
          avoidLabelOverlap: false,
          itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
          label: {
            show: true,
            formatter: '{b}\n{d}%',
            color: '#4b5563',
            fontSize: 12
          },
          labelLine: {
            show: true,
            lineStyle: { color: 'rgba(75,85,99,0.4)' },
            length: 12,
            length2: 10
          },
          color: ['#6cc1ff','#a78bfa','#fda085','#34d399','#f59e0b','#f87171','#60a5fa','#22d3ee','#c084fc'],
          data: [
            { value: 15, name: '超级管理员' },
            { value: 60, name: '学生' },
            { value: 10, name: '骑手' },
            { value: 6, name: '食堂商户' },
            { value: 3, name: '设备维修管理员' },
            { value: 2, name: '图书馆管理员' },
            { value: 2, name: '教室/自习室管理员' },
            { value: 1, name: '校园圈子管理员' },
            { value: 1, name: '社团活动管理员' }
          ]
        }],
        grid: { bottom: 20 }
      }
      chart.setOption(option)
    }

    // 角色-状态堆叠条形图
    if (roleStatusChart.value) {
      const chart = echarts.init(roleStatusChart.value)
      const roles = ['学生', '骑手', '食堂', '设备', '图书馆', '教室', '圈子', '社团', '管理员']
      const option = {
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        legend: { data: ['活跃', '禁用', '封禁'], bottom: 10 },
        grid: { left: '3%', right: '4%', bottom: 80, top: 20, containLabel: true },
        xAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(0,0,0,0.06)' } } },
        yAxis: { type: 'category', data: roles, axisLabel: { color: '#6b7280' } },
        series: [
          { name: '活跃', type: 'bar', stack: 'total', barWidth: 14, itemStyle: { borderRadius: [8,8,8,8], color: new (echarts as any).graphic.LinearGradient(0,0,1,0,[{offset:0,color:'#43e97b'},{offset:1,color:'#38f9d7'}]) }, data: [40, 8, 5, 3, 2, 2, 1, 1, 10] },
          { name: '禁用', type: 'bar', stack: 'total', barWidth: 14, itemStyle: { borderRadius: [8,8,8,8], color: new (echarts as any).graphic.LinearGradient(0,0,1,0,[{offset:0,color:'#f6d365'},{offset:1,color:'#fda085'}]) }, data: [15, 2, 1, 0, 0, 0, 0, 0, 3] },
          { name: '封禁', type: 'bar', stack: 'total', barWidth: 14, itemStyle: { borderRadius: [8,8,8,8], color: new (echarts as any).graphic.LinearGradient(0,0,1,0,[{offset:0,color:'#f5576c'},{offset:1,color:'#f093fb'}]) }, data: [5, 0, 0, 0, 0, 0, 0, 0, 2] }
        ]
      }
      chart.setOption(option)
    }
  })
}

onMounted(async () => {
  initCharts()
  await handleSearch() // 初始加载数据
  refreshKpis()
})

// ========== 工具函数 ==========
const formatDate = (val: string) => {
  if (!val) return '-'
  const d = new Date(val)
  if (Number.isNaN(d.getTime())) return val
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  const ss = String(d.getSeconds()).padStart(2, '0')
  return `${y}-${m}-${day} ${hh}:${mm}:${ss}`
}

// ================== 新增/编辑 相关 ==================
const dialogVisible = ref(false)
const isEdit = ref(false)
const submitLoading = ref(false)
const userFormRef = ref()

const defaultUserForm = {
  id: 0,
  userName: '',
  email: '',
  password: '',
  phone: '',
  displayName: '',
  studentId: '',
  role: 'user',
  status: 'active'
}

const userForm = reactive({ ...defaultUserForm })

const formRules = {
  userName: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ],
  password: [
    { required: () => !isEdit.value, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ]
}

const handleSubmit = async () => {
  if (!userFormRef.value) return
  await userFormRef.value.validate(async (valid: boolean) => {
    if (!valid) return
    submitLoading.value = true
    try {
      if (isEdit.value) {
        const payload: UserUpdateParams = {
          userName: userForm.userName,
          email: userForm.email,
          phone: userForm.phone,
          displayName: userForm.displayName,
          studentId: userForm.studentId,
          status: userForm.status as any
        }
        // 管理端允许修改角色
        ;(payload as any).role = userForm.role
        await updateUser(userForm.id, payload)
        ElMessage.success('更新成功')
      } else {
        const payload: UserCreateParams = {
          userId: `USER_${Date.now()}`,
          userName: userForm.userName,
          email: userForm.email,
          password: userForm.password,
          phone: userForm.phone,
          displayName: userForm.displayName,
          studentId: userForm.studentId
        }
        await createUser({ ...payload, role: userForm.role } as any)
        ElMessage.success('创建成功')
      }
      dialogVisible.value = false
      await handleSearch()
    } catch (e) {
      ElMessage.error('保存失败')
    } finally {
      submitLoading.value = false
    }
  })
}
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

/* KPI 高级风格 */
.glass-card :deep(.el-card__body) {
  backdrop-filter: saturate(180%) blur(8px);
}
.glass-card {
  background: rgba(255,255,255,0.6);
  border: none;
  box-shadow: 0 8px 30px rgba(31, 38, 135, 0.08);
}
.glass-card :deep(.el-card__header) {
  background: transparent;
  border-bottom: 1px solid rgba(255,255,255,0.4);
}
.kpi-section { margin-bottom: 16px; }
.kpi-card {
  position: relative;
  border-radius: 14px;
  padding: 18px 20px;
  color: #fff;
  box-shadow: 0 10px 24px rgba(0,0,0,0.08);
  overflow: hidden;
}
.kpi-card::after {
  content: '';
  position: absolute;
  right: -30px;
  top: -30px;
  width: 120px;
  height: 120px;
  background: rgba(255,255,255,0.15);
  border-radius: 50%;
  filter: blur(2px);
}
.kpi-meta { opacity: 0.9; }
.kpi-title { font-size: 14px; letter-spacing: 0.5px; }
.kpi-sub { font-size: 12px; opacity: 0.8; }
.kpi-value { font-size: 28px; font-weight: 700; margin-top: 6px; }
.kpi-primary { background: linear-gradient(135deg, #4f8cff 0%, #6cc1ff 100%); }
.kpi-success { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
.kpi-warning { background: linear-gradient(135deg, #f6d365 0%, #fda085 100%); }
.kpi-info { background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%); }

/* 操作列按钮一行排列 */
.op-actions {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}
</style>

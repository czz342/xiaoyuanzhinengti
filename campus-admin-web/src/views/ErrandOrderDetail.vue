<template>
  <div class="order-detail-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <el-button @click="goBack" class="back-button" type="primary" plain>
          <el-icon><ArrowLeft /></el-icon>
          返回
        </el-button>
        <div class="page-title">
          <h1>订单详情</h1>
          <p>Order Details</p>
        </div>
      </div>
      <div class="header-actions">
        <el-button v-if="order" type="primary" @click="showEditDialog = true" class="action-btn">
          <el-icon><Edit /></el-icon>
          编辑订单
        </el-button>
        <el-button v-if="order" type="success" @click="loadStatusLogs" :loading="logsLoading" class="action-btn">
          <el-icon><Refresh /></el-icon>
          刷新状态
        </el-button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <div class="skeleton-wrapper">
        <el-skeleton :rows="6" animated />
        <el-skeleton :rows="4" animated style="margin-top: 20px;" />
      </div>
    </div>

    <!-- 订单内容 -->
    <div v-else-if="order" class="order-container">
      <!-- 订单概览卡片 -->
      <div class="order-overview">
        <div class="overview-header">
          <div class="order-title-section">
            <h1 class="order-title">{{ order.title }}</h1>
            <div class="order-meta">
              <el-tag :type="getStatusType(order.status)" size="large" class="status-tag">
                <el-icon><CircleCheck /></el-icon>
                {{ order.status }}
              </el-tag>
              <span class="order-id">#{{ order.id }}</span>
            </div>
          </div>
          <div class="price-section">
            <div class="price-label">订单金额</div>
            <div class="price-value">¥{{ order.price }}</div>
            <div class="service-type">
              <el-tag :type="getServiceTypeColor(order.service_type)" size="small">
                {{ getServiceTypeText(order.service_type) }}
              </el-tag>
            </div>
          </div>
        </div>
        
        <div class="overview-stats">
          <div class="stat-item">
            <div class="stat-icon">
              <el-icon><Clock /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-label">创建时间</div>
              <div class="stat-value">{{ formatDate(order.created_time) }}</div>
            </div>
          </div>
          <div class="stat-item" v-if="order.accepted_time">
            <div class="stat-icon">
              <el-icon><Check /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-label">接单时间</div>
              <div class="stat-value">{{ formatDate(order.accepted_time) }}</div>
            </div>
          </div>
          <div class="stat-item" v-if="order.completed_time">
            <div class="stat-icon">
              <el-icon><Trophy /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-label">完成时间</div>
              <div class="stat-value">{{ formatDate(order.completed_time) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 详细信息网格 -->
      <div class="details-grid">
        <!-- 订单描述 -->
        <div class="detail-card description-card">
          <div class="card-header">
            <h3><el-icon><Document /></el-icon>订单描述</h3>
          </div>
          <div class="card-content">
            <p class="description-text">{{ order.description || '暂无描述' }}</p>
          </div>
        </div>

        <!-- 联系信息 -->
        <div class="detail-card contact-card">
          <div class="card-header">
            <h3><el-icon><Phone /></el-icon>联系信息</h3>
          </div>
          <div class="card-content">
            <div class="contact-item">
              <span class="contact-label">联系电话</span>
              <span class="contact-value">{{ order.phone }}</span>
            </div>
            <div class="contact-item">
              <span class="contact-label">期望时间</span>
              <span class="contact-value">{{ formatDateTime(order.expected_time) }}</span>
            </div>
          </div>
        </div>

        <!-- 位置信息 -->
        <div class="detail-card location-card">
          <div class="card-header">
            <h3><el-icon><Location /></el-icon>位置信息</h3>
          </div>
          <div class="card-content">
            <div class="location-item pickup">
              <div class="location-icon">
                <el-icon><Upload /></el-icon>
              </div>
              <div class="location-content">
                <div class="location-label">取件地址</div>
                <div class="location-address">{{ order.pickup_location }}</div>
              </div>
            </div>
            <div class="location-item delivery">
              <div class="location-icon">
                <el-icon><Download /></el-icon>
              </div>
              <div class="location-content">
                <div class="location-label">送达地址</div>
                <div class="location-address">{{ order.delivery_location }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 用户信息卡片 -->
      <div class="users-section">
        <div class="user-card publisher-card">
          <div class="user-header">
            <h3><el-icon><User /></el-icon>发布者</h3>
            <el-tag type="info" size="small">发布者</el-tag>
          </div>
          <div class="user-content">
            <div class="user-avatar">
              <el-avatar :size="60" :src="getUserAvatar(order.publisher_id)">
                <el-icon><User /></el-icon>
              </el-avatar>
              <div class="online-indicator"></div>
            </div>
            <div class="user-details">
              <div class="user-name">{{ order.publisher_name || '未知用户' }}</div>
              <div class="user-id">ID: {{ order.publisher_id }}</div>
              <div class="user-phone" v-if="order.publisher_phone">
                <el-icon><Phone /></el-icon>
                {{ order.publisher_phone }}
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="order.accepter_id" class="user-card accepter-card">
          <div class="user-header">
            <h3><el-icon><UserFilled /></el-icon>接单者</h3>
            <el-tag type="success" size="small">接单者</el-tag>
          </div>
          <div class="user-content">
            <div class="user-avatar">
              <el-avatar :size="60" :src="getUserAvatar(order.accepter_id)">
                <el-icon><UserFilled /></el-icon>
              </el-avatar>
              <div class="online-indicator active"></div>
            </div>
            <div class="user-details">
              <div class="user-name">{{ order.accepter_name || '未知用户' }}</div>
              <div class="user-id">ID: {{ order.accepter_id }}</div>
              <div class="user-phone" v-if="order.accepter_phone">
                <el-icon><Phone /></el-icon>
                {{ order.accepter_phone }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 状态时间线 -->
      <div class="timeline-section">
        <div class="section-header">
          <h3><el-icon><Clock /></el-icon>状态变更记录</h3>
          <el-button @click="loadStatusLogs" :loading="logsLoading" type="primary" plain>
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
        <div class="timeline-container">
          <el-timeline>
            <el-timeline-item
              v-for="log in statusLogs"
              :key="log.id"
              :timestamp="formatDate(log.created_at)"
              :type="getLogType(log.status)"
              :icon="getLogIcon(log.status)"
            >
              <div class="timeline-content">
                <div class="timeline-status">{{ log.status }}</div>
                <div class="timeline-remark" v-if="log.remark">{{ log.remark }}</div>
                <div class="timeline-operator">操作人：{{ log.operator_name || '系统' }}</div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>

      <!-- 评分记录 -->
      <div v-if="ratings.length > 0" class="ratings-section">
        <div class="section-header">
          <h3><el-icon><Star /></el-icon>评分记录</h3>
        </div>
        <div class="ratings-grid">
          <div v-for="rating in ratings" :key="rating.id" class="rating-card">
            <div class="rating-header">
              <div class="rating-user">
                <el-avatar :size="40" :src="getUserAvatar(rating.rater_id)">
                  <el-icon><User /></el-icon>
                </el-avatar>
                <div class="user-info">
                  <div class="user-name">{{ rating.rater_name || '匿名用户' }}</div>
                  <div class="rating-time">{{ formatDate(rating.created_at) }}</div>
                </div>
              </div>
              <div class="rating-score">
                <el-rate v-model="rating.rating" disabled show-score />
              </div>
            </div>
            <div v-if="rating.comment" class="rating-comment">
              "{{ rating.comment }}"
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="error-container">
      <el-empty description="订单不存在或已被删除">
        <el-button type="primary" @click="goBack">返回列表</el-button>
      </el-empty>
    </div>

    <!-- 编辑订单对话框 -->
    <el-dialog v-model="showEditDialog" title="编辑订单" width="60%" :before-close="handleCloseEdit">
      <el-form :model="editForm" :rules="editRules" ref="editFormRef" label-width="100px">
        <el-form-item label="订单标题" prop="title">
          <el-input v-model="editForm.title" placeholder="请输入订单标题" />
        </el-form-item>
        
        <el-form-item label="服务类型" prop="service_type">
          <el-select v-model="editForm.service_type" placeholder="请选择服务类型" style="width: 100%">
            <el-option label="代取快递" value="快递代取" />
            <el-option label="代买物品" value="物品代买" />
            <el-option label="代排队" value="排队代办" />
            <el-option label="其他代办" value="其他代办" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="订单金额" prop="price">
          <el-input-number v-model="editForm.price" :min="0" :precision="2" style="width: 100%" />
        </el-form-item>
        
        <el-form-item label="订单描述" prop="description">
          <el-input v-model="editForm.description" type="textarea" :rows="4" placeholder="请输入订单描述" />
        </el-form-item>
        
        <el-form-item label="取件地址" prop="pickup_location">
          <el-input v-model="editForm.pickup_location" placeholder="请输入取件地址" />
        </el-form-item>
        
        <el-form-item label="送达地址" prop="delivery_location">
          <el-input v-model="editForm.delivery_location" placeholder="请输入送达地址" />
        </el-form-item>
        
        <el-form-item label="期望时间" prop="expected_time">
          <el-input v-model="editForm.expected_time" placeholder="请输入期望时间" />
        </el-form-item>
        
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="editForm.phone" placeholder="请输入联系电话" />
        </el-form-item>
        
        <el-form-item label="订单状态" prop="status">
          <el-select v-model="editForm.status" placeholder="请选择订单状态" style="width: 100%">
            <el-option label="待接单" value="待接单" />
            <el-option label="已接单" value="已接单" />
            <el-option label="进行中" value="进行中" />
            <el-option label="已完成" value="已完成" />
            <el-option label="已取消" value="已取消" />
            <el-option label="已退款" value="已退款" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="备注" prop="remark">
          <el-input v-model="editForm.remark" type="textarea" :rows="2" placeholder="请输入备注信息" />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showEditDialog = false">取消</el-button>
          <el-button type="primary" @click="handleSaveEdit" :loading="editLoading">保存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  ArrowLeft, 
  Edit, 
  Location, 
  Refresh, 
  CircleCheck, 
  Clock, 
  Check, 
  Trophy, 
  Document, 
  Phone, 
  Upload, 
  Download, 
  User, 
  UserFilled, 
  Star 
} from '@element-plus/icons-vue'
import { getOrderDetail, updateOrderStatus, getOrderStatusLogs, getOrderRatings, type ErrandOrder, type OrderStatusLog, type UserRating } from '@/api/errand'

const route = useRoute()
const router = useRouter()

// 数据状态
const order = ref<ErrandOrder | null>(null)
const statusLogs = ref<OrderStatusLog[]>([])
const ratings = ref<UserRating[]>([])
const loading = ref(false)
const logsLoading = ref(false)
const editLoading = ref(false)

// 编辑对话框
const showEditDialog = ref(false)
const editFormRef = ref()
const editForm = reactive({
  title: '',
  service_type: '',
  price: 0,
  description: '',
  pickup_location: '',
  delivery_location: '',
  expected_time: '',
  phone: '',
  status: '',
  remark: ''
})

const editRules = {
  title: [{ required: true, message: '请输入订单标题', trigger: 'blur' }],
  service_type: [{ required: true, message: '请选择服务类型', trigger: 'change' }],
  price: [{ required: true, message: '请输入订单金额', trigger: 'blur' }],
  pickup_location: [{ required: true, message: '请输入取件地址', trigger: 'blur' }],
  delivery_location: [{ required: true, message: '请输入送达地址', trigger: 'blur' }],
  expected_time: [{ required: true, message: '请输入期望时间', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
  status: [{ required: true, message: '请选择订单状态', trigger: 'change' }]
}

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

// 获取日志类型
const getLogType = (status: string) => {
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

// 获取用户头像
const getUserAvatar = (userId: number) => {
  // 优先使用后端返回的用户头像
  if (order.value) {
    if (userId === order.value.publisher_id && order.value.publisher_avatar) {
      return order.value.publisher_avatar
    }
    if (userId === order.value.accepter_id && order.value.accepter_avatar) {
      return order.value.accepter_avatar
    }
  }
  // 如果没有头像，使用默认头像
  return `/static/images/avatar-${userId % 10 + 1}.jpg`
}

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return '未知'
  return new Date(dateString).toLocaleString('zh-CN')
}

// 格式化日期时间
const formatDateTime = (dateString: string) => {
  if (!dateString) return '未知'
  return new Date(dateString).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 获取日志图标
const getLogIcon = (status: string) => {
  switch (status) {
    case '待接单': return 'Clock'
    case '已接单': return 'Check'
    case '进行中': return 'Loading'
    case '已完成': return 'CircleCheck'
    case '已取消': return 'Close'
    case '已退款': return 'Refresh'
    default: return 'InfoFilled'
  }
}

// 加载订单详情
const loadOrderDetail = async () => {
  const orderId = route.params.id
  if (!orderId) return

  loading.value = true
  try {
    const response = await getOrderDetail(Number(orderId))
    order.value = response.data
    
    // 填充编辑表单
    Object.assign(editForm, {
      title: order.value.title,
      service_type: order.value.service_type,
      price: order.value.price,
      description: order.value.description || '',
      pickup_location: order.value.pickup_location,
      delivery_location: order.value.delivery_location,
      expected_time: order.value.expected_time,
      phone: order.value.phone,
      status: order.value.status,
      remark: ''
    })
  } catch (error) {
    ElMessage.error('加载订单详情失败')
  } finally {
    loading.value = false
  }
}

// 加载状态日志
const loadStatusLogs = async () => {
  if (!order.value) return

  logsLoading.value = true
  try {
    const response = await getOrderStatusLogs(order.value.id)
    statusLogs.value = response.data
  } catch (error) {
    ElMessage.error('加载状态日志失败')
  } finally {
    logsLoading.value = false
  }
}

// 加载评分记录
const loadRatings = async () => {
  if (!order.value) return

  try {
    const response = await getOrderRatings(order.value.id)
    ratings.value = response.data
  } catch (error) {
    ElMessage.error('加载评分记录失败')
  }
}

// 保存编辑
const handleSaveEdit = async () => {
  if (!editFormRef.value || !order.value) return

  try {
    await editFormRef.value.validate()
    
    editLoading.value = true
    
    // 如果状态有变化，更新状态
    if (editForm.status !== order.value.status) {
      await updateOrderStatus(order.value.id, {
        status: editForm.status,
        remark: editForm.remark
      })
    }
    
    ElMessage.success('订单更新成功')
    showEditDialog.value = false
    await loadOrderDetail()
    await loadStatusLogs()
  } catch (error) {
    ElMessage.error('更新订单失败')
  } finally {
    editLoading.value = false
  }
}

// 关闭编辑对话框
const handleCloseEdit = () => {
  showEditDialog.value = false
  editFormRef.value?.resetFields()
}

// 返回上一页
const goBack = () => {
  router.go(-1)
}

onMounted(async () => {
  await loadOrderDetail()
  if (order.value) {
    await loadStatusLogs()
    await loadRatings()
  }
})
</script>

<style scoped>
.order-detail-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

/* 页面头部 */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 20px 30px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
}

.page-title h1 {
  margin: 0;
  color: white;
  font-size: 28px;
  font-weight: 700;
}

.page-title p {
  margin: 4px 0 0 0;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  font-weight: 400;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  backdrop-filter: blur(10px);
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
}

/* 加载状态 */
.loading-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 30px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.skeleton-wrapper {
  max-width: 800px;
}

/* 订单容器 */
.order-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

/* 订单概览 */
.order-overview {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 30px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.order-overview::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2, #f093fb);
}

.overview-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
}

.order-title-section {
  flex: 1;
}

.order-title {
  margin: 0 0 16px 0;
  font-size: 32px;
  font-weight: 700;
  color: #2c3e50;
  line-height: 1.2;
}

.order-meta {
  display: flex;
  align-items: center;
  gap: 16px;
}

.status-tag {
  font-size: 16px;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
}

.order-id {
  color: #7f8c8d;
  font-size: 14px;
  font-weight: 500;
}

.price-section {
  text-align: right;
}

.price-label {
  display: block;
  font-size: 14px;
  color: #7f8c8d;
  margin-bottom: 8px;
  font-weight: 500;
}

.price-value {
  font-size: 36px;
  font-weight: 800;
  color: #e74c3c;
  margin-bottom: 8px;
}

.service-type {
  margin-top: 8px;
}

.overview-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(102, 126, 234, 0.2);
}

.stat-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 12px;
  color: #7f8c8d;
  margin-bottom: 4px;
  font-weight: 500;
}

.stat-value {
  font-size: 16px;
  color: #2c3e50;
  font-weight: 600;
}

/* 详细信息网格 */
.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
}

.detail-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.detail-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.card-header {
  margin-bottom: 20px;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 8px;
}

.description-text {
  font-size: 16px;
  line-height: 1.6;
  color: #34495e;
  margin: 0;
  padding: 20px;
  background: rgba(102, 126, 234, 0.05);
  border-radius: 12px;
  border-left: 4px solid #667eea;
}

.contact-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.contact-item:last-child {
  border-bottom: none;
}

.contact-label {
  font-weight: 500;
  color: #7f8c8d;
}

.contact-value {
  font-weight: 600;
  color: #2c3e50;
}

.location-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 12px;
}

.location-item:last-child {
  margin-bottom: 0;
}

.location-item.pickup {
  background: rgba(52, 152, 219, 0.1);
  border: 1px solid rgba(52, 152, 219, 0.2);
}

.location-item.delivery {
  background: rgba(231, 76, 60, 0.1);
  border: 1px solid rgba(231, 76, 60, 0.2);
}

.location-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.location-item.pickup .location-icon {
  background: #3498db;
  color: white;
}

.location-item.delivery .location-icon {
  background: #e74c3c;
  color: white;
}

.location-content {
  flex: 1;
}

.location-label {
  font-size: 12px;
  color: #7f8c8d;
  margin-bottom: 4px;
  font-weight: 500;
}

.location-address {
  font-size: 16px;
  color: #2c3e50;
  font-weight: 600;
}

/* 用户信息区域 */
.users-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.user-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.user-card:hover {
  transform: translateY(-2px);
}

.user-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.user-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-avatar {
  position: relative;
}

.online-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #95a5a6;
  border: 3px solid white;
}

.online-indicator.active {
  background: #2ecc71;
}

.user-details {
  flex: 1;
}

.user-name {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 4px;
}

.user-id {
  font-size: 12px;
  color: #7f8c8d;
  margin-bottom: 8px;
}

.user-phone {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #34495e;
}

/* 时间线区域 */
.timeline-section {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 30px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 8px;
}

.timeline-container {
  padding-left: 20px;
}

.timeline-content {
  padding: 16px 0;
}

.timeline-status {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
}

.timeline-remark {
  color: #7f8c8d;
  margin-bottom: 8px;
  font-style: italic;
}

.timeline-operator {
  font-size: 12px;
  color: #95a5a6;
}

/* 评分区域 */
.ratings-section {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 30px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.ratings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.rating-card {
  background: rgba(102, 126, 234, 0.05);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(102, 126, 234, 0.1);
}

.rating-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.rating-user {
  display: flex;
  align-items: center;
  gap: 12px;
}

.rating-score {
  text-align: right;
}

.rating-comment {
  font-style: italic;
  color: #7f8c8d;
  font-size: 14px;
  line-height: 1.5;
}

/* 错误状态 */
.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .order-detail-page {
    padding: 10px;
  }
  
  .page-header {
    flex-direction: column;
    gap: 20px;
    align-items: flex-start;
  }
  
  .overview-header {
    flex-direction: column;
    gap: 20px;
    align-items: flex-start;
  }
  
  .overview-stats {
    grid-template-columns: 1fr;
  }
  
  .details-grid {
    grid-template-columns: 1fr;
  }
  
  .users-section {
    grid-template-columns: 1fr;
  }
  
  .ratings-grid {
    grid-template-columns: 1fr;
  }
  
  .user-content {
    flex-direction: column;
    text-align: center;
  }
  
  .rating-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
  
  .rating-score {
    text-align: left;
  }
}
</style>

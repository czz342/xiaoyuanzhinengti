import request from '@/utils/request'

// 订单相关接口
export interface ErrandOrder {
  id: number
  title: string
  description: string
  service_type: string
  price: number
  publisher_id: number
  publisher_name?: string
  publisher_phone?: string
  accepter_id?: number
  accepter_name?: string
  accepter_phone?: string
  pickup_location: string
  delivery_location: string
  expected_time: string
  actual_time?: string
  phone: string
  status: string
  created_at: string
  updated_at: string
  completed_at?: string
  rating?: number
  comment?: string
}

export interface OrderStatusLog {
  id: number
  order_id: number
  status: string
  operator_id: number
  operator_name?: string
  remark: string
  created_at: string
}

export interface UserRating {
  id: number
  order_id: number
  rater_id: number
  rater_name?: string
  rated_user_id: number
  rated_user_name?: string
  rating: number
  comment: string
  created_at: string
}

export interface Rider {
  id: number
  user_id: string
  user_name: string
  display_name: string
  phone: string
  completed_orders: number
  average_rating: number
  total_earnings: number
  status: string
  created_at: string
}

export interface ErrandStats {
  total_orders: number
  pending_orders: number
  completed_orders: number
  cancelled_orders: number
  total_revenue: number
  average_order_value: number
  completion_rate: number
  orders_by_status: Array<{
    status: string
    count: number
  }>
  orders_by_service_type: Array<{
    service_type: string
    count: number
  }>
  daily_orders: Array<{
    date: string
    count: number
  }>
  top_riders: Array<{
    rider_id: number
    rider_name: string
    completed_orders: number
    average_rating: number
  }>
}

// 获取所有订单列表（管理员）
export const getAllOrders = (params: {
  page?: number
  limit?: number
  status?: string
  service_type?: string
  publisher_id?: number
  accepter_id?: number
  start_date?: string
  end_date?: string
}) => {
  return request.get('/errand/admin/orders', { params })
}

// 获取订单详情
export const getOrderDetail = (id: number) => {
  return request.get(`/errand/orders/${id}`)
}

// 更新订单状态（管理员）
export const updateOrderStatus = (id: number, data: {
  status: string
  remark?: string
}) => {
  return request.put(`/errand/admin/orders/${id}/status`, data)
}

// 获取订单状态日志
export const getOrderStatusLogs = (id: number) => {
  return request.get(`/errand/orders/${id}/logs`)
}

// 获取订单统计（管理员）
export const getErrandStats = (params?: {
  start_date?: string
  end_date?: string
}) => {
  return request.get('/errand/admin/stats', { params })
}

// 获取骑手列表（管理员）
export const getRiderList = (params: {
  page?: number
  limit?: number
  keyword?: string
}) => {
  return request.get('/errand/admin/riders', { params })
}

// 获取订单评分记录
export const getOrderRatings = (id: number) => {
  return request.get(`/errand/orders/${id}/ratings`)
}

// 提交评分
export const submitRating = (id: number, data: {
  targetUserId: number
  rating: number
  comment?: string
}) => {
  return request.post(`/errand/orders/${id}/rate`, data)
}

// 获取用户收到的评分
export const getReceivedRatings = (params: {
  limit?: number
  offset?: number
}) => {
  return request.get('/errand/ratings/received', { params })
}

// 获取用户发出的评分
export const getGivenRatings = (params: {
  limit?: number
  offset?: number
}) => {
  return request.get('/errand/ratings/given', { params })
}


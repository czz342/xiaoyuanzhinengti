import request from '@/utils/request'
import type { 
  ApiResponse, 
  PaginatedResponse, 
  PaginationParams, 
  SearchParams,
  Classroom
} from '@/types/api'

// 获取教室列表
export const getClassroomList = (params: PaginationParams & SearchParams & {
  building?: string
  floor?: string
  status?: string
}): Promise<ApiResponse<PaginatedResponse<Classroom>>> => {
  return request.get('/classroom/list', { params })
}

// 获取教室详情
export const getClassroomById = (id: number): Promise<ApiResponse<Classroom>> => {
  return request.get(`/classroom/${id}`)
}

// 创建教室
export const createClassroom = (data: Omit<Classroom, 'id' | 'createdTime' | 'updatedTime'>): Promise<ApiResponse<Classroom>> => {
  return request.post('/classroom', data)
}

// 更新教室
export const updateClassroom = (id: number, data: Partial<Omit<Classroom, 'id' | 'createdTime' | 'updatedTime'>>): Promise<ApiResponse<Classroom>> => {
  return request.put(`/classroom/${id}`, data)
}

// 删除教室
export const deleteClassroom = (id: number): Promise<ApiResponse<null>> => {
  return request.delete(`/classroom/${id}`)
}

// 获取教学楼列表
export const getBuildings = (): Promise<ApiResponse<string[]>> => {
  return request.get('/classroom/buildings')
}

// 获取楼层列表
export const getFloors = (building: string): Promise<ApiResponse<string[]>> => {
  return request.get(`/classroom/floors/${building}`)
}

// 获取教室使用率统计
export const getClassroomUsageStats = (): Promise<ApiResponse<{
  totalClassrooms: number
  availableClassrooms: number
  occupiedClassrooms: number
  maintenanceClassrooms: number
  usageRate: number
  buildingStats: Array<{
    building: string
    total: number
    available: number
    usageRate: number
  }>
}>> => {
  return request.get('/classroom/stats')
}

// 获取教室预约统计
export const getClassroomReservationStats = (params?: {
  startDate?: string
  endDate?: string
}): Promise<ApiResponse<{
  totalReservations: number
  reservationsByDay: Array<{
    date: string
    count: number
  }>
  popularClassrooms: Array<{
    classroomName: string
    reservationCount: number
  }>
}>> => {
  return request.get('/classroom/reservation-stats', { params })
}

// ========== 教室预约相关接口 ==========
// 获取预约列表
export const getClassroomReservations = (params: {
  classroomId: number
  date?: string
}): Promise<ApiResponse<any[]>> => {
  const { classroomId, date } = params
  return request.get(`/classroom/reservations/classroom/${classroomId}`, { params: { date } })
}

// 创建预约
export const createClassroomReservation = (data: { classroomId: number; reservationDate: string; startTime: string; endTime: string; purpose?: string; notes?: string }): Promise<ApiResponse<any>> => {
  return request.post('/classroom/reservations', data)
}

// 取消预约
export const cancelClassroomReservation = (id: number): Promise<ApiResponse<null>> => {
  return request.put(`/classroom/reservations/${id}/cancel`)
}

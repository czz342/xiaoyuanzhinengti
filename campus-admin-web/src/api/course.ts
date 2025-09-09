import request from '@/utils/request'
import type { 
  ApiResponse, 
  PaginatedResponse, 
  PaginationParams, 
  SearchParams,
  Course,
  CourseCreateParams,
  PersonalSchedule,
  ScheduleCreateParams
} from '@/types/api'

// ========== 课程管理 API ==========

// 获取课程列表
export const getCourseList = (params: PaginationParams & SearchParams & {
  department?: string
}): Promise<ApiResponse<PaginatedResponse<Course>>> => {
  return request.get('/course/list', { params })
}

// 获取课程详情
export const getCourseById = (id: number): Promise<ApiResponse<Course>> => {
  return request.get(`/course/${id}`)
}

// 创建课程
export const createCourse = (data: CourseCreateParams): Promise<ApiResponse<Course>> => {
  return request.post('/course', data)
}

// 更新课程
export const updateCourse = (id: number, data: Partial<CourseCreateParams>): Promise<ApiResponse<Course>> => {
  return request.put(`/course/${id}`, data)
}

// 删除课程
export const deleteCourse = (id: number): Promise<ApiResponse<null>> => {
  return request.delete(`/course/${id}`)
}

// 搜索课程
export const searchCourses = (keyword: string): Promise<ApiResponse<Course[]>> => {
  return request.get('/course/search', { params: { keyword } })
}

// ========== 个人课程表管理 API ==========

// 获取用户的个人课程表
export const getPersonalSchedule = (userId: string, params?: {
  semester?: string
  academicYear?: string
}): Promise<ApiResponse<PersonalSchedule[]>> => {
  return request.get(`/course/schedule/${userId}`, { params })
}

// 获取所有用户的课程表（管理员视图）
export const getAllSchedules = (params: PaginationParams & {
  userId?: string
  semester?: string
  academicYear?: string
  dayOfWeek?: number
}): Promise<ApiResponse<PaginatedResponse<PersonalSchedule>>> => {
  return request.get('/course/schedules', { params })
}

// 为用户添加课程到课程表
export const addToSchedule = (data: ScheduleCreateParams): Promise<ApiResponse<PersonalSchedule>> => {
  return request.post('/course/schedule', data)
}

// 更新课程表项
export const updateSchedule = (id: number, data: Partial<ScheduleCreateParams>): Promise<ApiResponse<PersonalSchedule>> => {
  return request.put(`/course/schedule/${id}`, data)
}

// 从课程表删除课程
export const removeFromSchedule = (id: number): Promise<ApiResponse<null>> => {
  return request.delete(`/course/schedule/${id}`)
}

// 批量导入课程表
export const importSchedules = (file: File): Promise<ApiResponse<{
  success: number
  failed: number
  errors: string[]
}>> => {
  const formData = new FormData()
  formData.append('file', file)
  return request.post('/course/schedule/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 获取课程表统计
export const getScheduleStats = (): Promise<ApiResponse<{
  totalSchedules: number
  activeStudents: number
  popularCourses: Array<{
    courseName: string
    studentCount: number
  }>
  scheduleDistribution: Array<{
    dayOfWeek: number
    count: number
  }>
}>> => {
  return request.get('/course/schedule/stats')
}

// 获取时间冲突检测
export const checkScheduleConflict = (data: {
  userId: string
  dayOfWeek: number
  startTime: string
  endTime: string
  excludeId?: number
}): Promise<ApiResponse<{
  hasConflict: boolean
  conflictSchedules: PersonalSchedule[]
}>> => {
  return request.post('/course/schedule/check-conflict', data)
}

// 获取课程表日历视图数据
export const getScheduleCalendar = (userId: string, params: {
  year: number
  month: number
}): Promise<ApiResponse<Array<{
  date: string
  schedules: PersonalSchedule[]
}>>> => {
  return request.get(`/course/schedule/calendar/${userId}`, { params })
}

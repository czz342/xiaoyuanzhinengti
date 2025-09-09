import request from '@/utils/request'
import type { 
  ApiResponse, 
  PaginatedResponse, 
  PaginationParams, 
  SearchParams,
  User,
  UserCreateParams,
  UserUpdateParams
} from '@/types/api'

// 获取用户列表
export const getUserList = (params: PaginationParams & SearchParams & {
  status?: string
}): Promise<ApiResponse<PaginatedResponse<User>>> => {
  return request.get('/user/list', { params })
}

// 获取用户详情
export const getUserById = (id: number): Promise<ApiResponse<User>> => {
  return request.get(`/user/${id}`)
}

// 创建用户
export const createUser = (data: UserCreateParams): Promise<ApiResponse<User>> => {
  return request.post('/user', data)
}

// 更新用户
export const updateUser = (id: number, data: UserUpdateParams): Promise<ApiResponse<User>> => {
  return request.put(`/user/${id}`, data)
}

// 删除用户
export const deleteUser = (id: number): Promise<ApiResponse<null>> => {
  return request.delete(`/user/${id}`)
}

// 重置密码
export const resetPassword = (id: number): Promise<ApiResponse<{ newPassword: string }>> => {
  return request.put(`/user/${id}/password`)
}

// 批量导入用户
export const importUsers = (file: File): Promise<ApiResponse<{
  success: number
  failed: number
  errors: string[]
}>> => {
  const formData = new FormData()
  formData.append('file', file)
  return request.post('/user/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 导出用户
export const exportUsers = (params?: SearchParams): Promise<Blob> => {
  return request.get('/user/export', {
    params,
    responseType: 'blob'
  })
}

// 获取用户统计
export const getUserStats = (): Promise<ApiResponse<{
  total: number
  active: number
  inactive: number
  banned: number
  growth: number[]
}>> => {
  return request.get('/user/stats')
}

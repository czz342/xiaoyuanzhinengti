import request from '@/utils/request'
import type { ApiResponse } from '@/types/api'

// 登录参数
export interface LoginParams {
  username: string
  password: string
}

// 登录响应
export interface LoginResponse {
  token: string
  user: {
    id: number
    username: string
    email: string
    role: string
  }
}

// 用户信息
export interface UserInfo {
  id: number
  username: string
  email: string
  role: string
  permissions: string[]
}

// 登录
export const login = (data: LoginParams): Promise<ApiResponse<LoginResponse>> => {
  return request.post('/auth/login', data)
}

// 获取用户信息
export const getUserInfo = (): Promise<ApiResponse<UserInfo>> => {
  return request.get('/auth/me')
}

// 刷新token
export const refreshToken = (): Promise<ApiResponse<{ token: string }>> => {
  return request.post('/auth/refresh')
}

// 登出
export const logout = (): Promise<ApiResponse<null>> => {
  return request.post('/auth/logout')
}

// 修改密码
export const changePassword = (data: {
  oldPassword: string
  newPassword: string
}): Promise<ApiResponse<null>> => {
  return request.post('/auth/change-password', data)
}

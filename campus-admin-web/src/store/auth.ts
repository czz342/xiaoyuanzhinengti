import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login, getUserInfo, logout } from '@/api/auth'
import type { LoginParams, UserInfo } from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const token = ref<string>(localStorage.getItem('token') || '')
  const userInfo = ref<UserInfo | null>(null)
  const permissions = ref<string[]>([])

  // 计算属性
  const isLoggedIn = computed(() => !!token.value)
  const userRole = computed(() => userInfo.value?.role || '')
  const hasPermission = computed(() => (permission: string) => {
    return permissions.value.includes(permission) || userRole.value === 'admin'
  })

  // 登录
  const loginAction = async (loginParams: LoginParams) => {
    try {
      const response = await login(loginParams)
      const { token: newToken, user } = response.data
      
      token.value = newToken
      userInfo.value = {
        id: user.id,
        username: user.userName,
        email: user.email,
        role: 'admin', // 默认角色
        permissions: ['*'] // 默认权限
      }
      localStorage.setItem('token', newToken)
      
      return response
    } catch (error) {
      throw error
    }
  }

  // 获取用户信息
  const getUserInfoAction = async () => {
    try {
      const response = await getUserInfo()
      const user = response.data
      userInfo.value = {
        id: user.id,
        username: user.userName,
        email: user.email,
        role: 'admin', // 默认角色
        permissions: ['*'] // 默认权限
      }
      permissions.value = ['*']
      return response
    } catch (error) {
      // 如果获取用户信息失败，清除token
      logoutAction()
      throw error
    }
  }

  // 登出
  const logoutAction = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // 清除本地状态
      token.value = ''
      userInfo.value = null
      permissions.value = []
      localStorage.removeItem('token')
    }
  }

  // 检查登录状态
  const checkAuth = async () => {
    if (!token.value) {
      return false
    }

    try {
      await getUserInfoAction()
      return true
    } catch (error) {
      return false
    }
  }

  return {
    // 状态
    token,
    userInfo,
    permissions,
    
    // 计算属性
    isLoggedIn,
    userRole,
    hasPermission,
    
    // 方法
    loginAction,
    getUserInfoAction,
    logoutAction,
    checkAuth
  }
})

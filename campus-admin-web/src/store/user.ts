import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUserList, getUserStats } from '@/api/user'
import type { User, PaginationParams, SearchParams } from '@/types/api'

export const useUserStore = defineStore('user', () => {
  // 状态
  const userList = ref<User[]>([])
  const total = ref(0)
  const loading = ref(false)
  const currentPage = ref(1)
  const pageSize = ref(10)

  // 获取用户列表
  const fetchUserList = async (params: PaginationParams & SearchParams & {
    status?: string
  } = {}) => {
    loading.value = true
    try {
      const response = await getUserList({
        page: currentPage.value,
        limit: pageSize.value,
        ...params
      })
      
      userList.value = response.data
      total.value = response.pagination.total
      
      return response
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  // 获取用户统计
  const fetchUserStats = async () => {
    try {
      const response = await getUserStats()
      return response.data
    } catch (error) {
      throw error
    }
  }

  // 设置分页
  const setPagination = (page: number, size: number) => {
    currentPage.value = page
    pageSize.value = size
  }

  // 重置状态
  const resetState = () => {
    userList.value = []
    total.value = 0
    currentPage.value = 1
    pageSize.value = 10
  }

  return {
    // 状态
    userList,
    total,
    loading,
    currentPage,
    pageSize,
    
    // 方法
    fetchUserList,
    fetchUserStats,
    setPagination,
    resetState
  }
})

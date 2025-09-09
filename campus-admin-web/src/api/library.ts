import request from '@/utils/request'
import type { 
  ApiResponse, 
  PaginatedResponse, 
  PaginationParams, 
  SearchParams,
  Book
} from '@/types/api'

// 获取图书列表
export const getBookList = (params: PaginationParams & SearchParams & {
  category?: string
  status?: string
}): Promise<ApiResponse<PaginatedResponse<Book>>> => {
  return request.get('/book/list', { params })
}

// 获取图书详情
export const getBookById = (id: number): Promise<ApiResponse<Book>> => {
  return request.get(`/book/${id}`)
}

// 创建图书
export const createBook = (data: Omit<Book, 'id' | 'createdTime' | 'updatedTime'>): Promise<ApiResponse<Book>> => {
  return request.post('/book', data)
}

// 更新图书
export const updateBook = (id: number, data: Partial<Omit<Book, 'id' | 'createdTime' | 'updatedTime'>>): Promise<ApiResponse<Book>> => {
  return request.put(`/book/${id}`, data)
}

// 删除图书
export const deleteBook = (id: number): Promise<ApiResponse<null>> => {
  return request.delete(`/book/${id}`)
}

// 搜索图书
export const searchBooks = (keyword: string): Promise<ApiResponse<Book[]>> => {
  return request.get('/book/search', { params: { keyword } })
}

// 获取图书分类列表
export const getBookCategories = (): Promise<ApiResponse<string[]>> => {
  return request.get('/book/categories/list')
}

// 获取图书统计概览
export const getBookStats = (): Promise<ApiResponse<{
  totalBooks: number
  borrowedBooks: number
  overdueBooks: number
  reservedBooks: number
  availableBooks: number
  borrowingRate: number
  overdueRate: number
}>> => {
  return request.get('/book/stats/overview')
}

// 获取借阅统计
export const getBorrowingStats = (params?: {
  startDate?: string
  endDate?: string
}): Promise<ApiResponse<{
  borrowingTrend: Array<{
    date: string
    count: number
  }>
  popularBooks: Array<{
    bookTitle: string
    borrowCount: number
  }>
  categoryStats: Array<{
    category: string
    borrowCount: number
  }>
}>> => {
  return request.get('/book/borrowing-stats', { params })
}

// 获取逾期统计
export const getOverdueStats = (): Promise<ApiResponse<{
  overdueCount: number
  overdueRate: number
  overdueBooks: Array<{
    bookTitle: string
    borrower: string
    overdueDays: number
  }>
}>> => {
  return request.get('/book/overdue-stats')
}

// 批量导入图书
export const importBooks = (file: File): Promise<ApiResponse<{
  success: number
  failed: number
  errors: string[]
}>> => {
  const formData = new FormData()
  formData.append('file', file)
  return request.post('/book/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 导出图书
export const exportBooks = (params?: SearchParams): Promise<Blob> => {
  return request.get('/book/export', {
    params,
    responseType: 'blob'
  })
}

import request from '@/utils/request'

// 图书管理
export const getBookList = (params: any) => {
  return request({
    url: '/book/list',
    method: 'get',
    params
  })
}

export const getBookDetail = (id: number) => {
  return request({
    url: `/book/${id}`,
    method: 'get'
  })
}

export const createBook = (data: any) => {
  return request({
    url: '/book',
    method: 'post',
    data
  })
}

export const updateBook = (id: number, data: any) => {
  return request({
    url: `/book/${id}`,
    method: 'put',
    data
  })
}

export const deleteBook = (id: number) => {
  return request({
    url: `/book/${id}`,
    method: 'delete'
  })
}

export const getBookCategories = () => {
  return request({
    url: '/book/categories/list',
    method: 'get'
  })
}

// 借阅管理
export const getBorrowingList = (params: any) => {
  return request({
    url: '/book/borrowings/my',
    method: 'get',
    params
  })
}

export const createBorrowing = (data: any) => {
  return request({
    url: '/book/borrow',
    method: 'post',
    data
  })
}

export const returnBook = (id: number, data: any) => {
  return request({
    url: `/book/return/${id}`,
    method: 'put',
    data
  })
}

export const renewBook = (id: number, data: any) => {
  return request({
    url: `/book/renew/${id}`,
    method: 'put',
    data
  })
}

// 预约管理
export const getReservationList = (params: any) => {
  return request({
    url: '/book/reservations/my',
    method: 'get',
    params
  })
}

export const createReservation = (data: any) => {
  return request({
    url: '/book/reserve',
    method: 'post',
    data
  })
}

export const cancelReservation = (id: number, data: any) => {
  return request({
    url: `/book/reservations/${id}/cancel`,
    method: 'put',
    data
  })
}

// 统计信息
export const getBookStats = () => {
  return request({
    url: '/book/stats/overview',
    method: 'get'
  })
}

export const getLibraryStats = () => {
  return request({
    url: '/book/stats/overview',
    method: 'get'
  })
}

export const getOverdueRecords = () => {
  return request({
    url: '/book/borrowings/overdue/list',
    method: 'get'
  })
}
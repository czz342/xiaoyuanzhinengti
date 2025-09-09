import request from '@/utils/request'

// 帖子相关接口
export interface Post {
  id: number
  title: string
  content: string
  category: string
  author_id: string
  author_name: string
  author_avatar: string
  images?: string[]
  like_count: number
  comment_count: number
  view_count: number
  is_liked: boolean
  is_featured: boolean
  allow_comments: boolean
  created_at: string
  updated_at: string
}

export interface Comment {
  id: number
  post_id: number
  user_id: string
  user_name: string
  user_avatar: string
  content: string
  parent_id?: number
  like_count: number
  is_liked: boolean
  created_at: string
  updated_at: string
}

export interface Report {
  id: number
  type: 'post' | 'comment'
  target_id: number
  target_title: string
  reporter_id: string
  reporter_name: string
  reason: string
  reason_text: string
  description: string
  status: 'pending' | 'approved' | 'rejected'
  admin_comment?: string
  handled_by?: string
  handled_at?: string
  created_at: string
  updated_at: string
}

export interface ReportStats {
  total: number
  pending: number
  approved: number
  rejected: number
  by_type: {
    post: number
    comment: number
  }
  by_reason: {
    spam: number
    inappropriate: number
    harassment: number
    other: number
  }
}

// 获取帖子列表
export const getPostList = (params: {
  page?: number
  limit?: number
  category?: string
  keyword?: string
  sort_by?: string
  sort_order?: string
  is_featured?: boolean
}) => {
  return request.get('/community/posts', { params })
}

// 获取帖子详情
export const getPostDetail = (id: number) => {
  return request.get(`/community/posts/${id}`)
}

// 创建帖子
export const createPost = (data: {
  title: string
  content: string
  category: string
  images?: string[]
  allow_comments?: boolean
}) => {
  return request.post('/community/posts', data)
}

// 更新帖子
export const updatePost = (id: number, data: {
  title?: string
  content?: string
  category?: string
  images?: string[]
  allow_comments?: boolean
}) => {
  return request.put(`/community/posts/${id}`, data)
}

// 删除帖子
export const deletePost = (id: number) => {
  return request.delete(`/community/posts/${id}`)
}

// 获取帖子评论
export const getPostComments = (postId: number, params: {
  page?: number
  limit?: number
  sort_by?: string
  sort_order?: string
}) => {
  return request.get(`/community/posts/${postId}/comments`, { params })
}

// 创建评论
export const createComment = (postId: number, data: {
  content: string
  parent_id?: number
}) => {
  return request.post(`/community/posts/${postId}/comments`, data)
}

// 删除评论
export const deleteComment = (id: number) => {
  return request.delete(`/community/comments/${id}`)
}

// 点赞/取消点赞
export const toggleLike = (data: {
  target_type: 'post' | 'comment'
  target_id: number
}) => {
  return request.post('/community/like', data)
}

// 获取分类统计
export const getCategoryStats = () => {
  return request.get('/community/categories/stats')
}

// 举报管理相关接口
// 获取举报列表
export const getReportList = (params: {
  page?: number
  limit?: number
  status?: string
  type?: string
}) => {
  return request.get('/community/reports', { params })
}

// 处理举报
export const handleReport = (id: number, data: {
  status: 'approved' | 'rejected'
  admin_comment?: string
}) => {
  return request.put(`/community/reports/${id}/handle`, data)
}

// 获取举报统计
export const getReportStats = () => {
  return request.get('/community/reports/stats')
}


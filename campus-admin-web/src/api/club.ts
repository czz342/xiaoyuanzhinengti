import request from '@/utils/request'

// 社团相关类型定义
export interface Club {
  id: number
  name: string
  description: string
  category: string
  logo_url?: string
  leader_id: string
  leader_name: string
  leader_phone?: string
  member_count: number
  activity_count: number
  level: 'A' | 'B' | 'C'
  status: 'active' | 'inactive' | 'suspended'
  established_date?: string
  contact_email?: string
  contact_phone?: string
  meeting_place?: string
  meeting_time?: string
  requirements?: string
  created_at: string
  updated_at: string
}

export interface ClubMember {
  id: number
  club_id: number
  user_id: string
  user_name: string
  role: 'member' | 'vice_leader' | 'leader'
  join_date: string
  status: 'active' | 'inactive' | 'expelled'
  contribution_score: number
  last_activity_date?: string
  created_at: string
  updated_at: string
}

export interface ClubStats {
  total_clubs: number
  active_clubs: number
  inactive_clubs: number
  suspended_clubs: number
  total_members: number
  total_activities: number
  avg_members_per_club: number
  avg_activities_per_club: number
}

export interface ClubCategoryStats {
  category: string
  count: number
  total_members: number
  total_activities: number
}

// 获取社团列表
export const getClubList = (params: {
  page?: number
  limit?: number
  category?: string
  status?: string
  level?: string
  keyword?: string
  sort_by?: string
}) => {
  return request.get('/clubs/list', { params })
}

// 获取社团详情
export const getClubDetail = (id: number) => {
  return request.get(`/clubs/${id}`)
}

// 创建社团
export const createClub = (data: Partial<Club>) => {
  return request.post('/clubs', data)
}

// 更新社团
export const updateClub = (id: number, data: Partial<Club>) => {
  return request.put(`/clubs/${id}`, data)
}

// 删除社团
export const deleteClub = (id: number) => {
  return request.delete(`/clubs/${id}`)
}

// 加入社团
export const joinClub = (id: number) => {
  return request.post(`/clubs/${id}/join`)
}

// 退出社团
export const leaveClub = (id: number) => {
  return request.post(`/clubs/${id}/leave`)
}

// 获取社团成员列表
export const getClubMembers = (id: number, params: {
  role?: string
  status?: string
  limit?: number
}) => {
  return request.get(`/clubs/${id}/members`, { params })
}

// 更新成员角色
export const updateMemberRole = (clubId: number, userId: string, role: string) => {
  return request.put(`/clubs/${clubId}/members/${userId}/role`, { role })
}

// 移除成员
export const removeMember = (clubId: number, userId: string) => {
  return request.delete(`/clubs/${clubId}/members/${userId}`)
}

// 获取社团统计信息
export const getClubStats = () => {
  return request.get('/clubs/stats/overview')
}

// 搜索社团
export const searchClubs = (params: {
  keyword: string
  status?: string
  limit?: number
}) => {
  return request.get('/clubs/search', { params })
}

// 获取我的社团
export const getMyClubs = () => {
  return request.get('/clubs/my/clubs')
}


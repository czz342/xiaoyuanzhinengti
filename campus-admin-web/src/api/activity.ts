import request from '@/utils/request'

export interface Activity {
  id: number
  club_id: number
  club_name: string
  title: string
  description: string
  start_time: string
  end_time: string
  location: string
  max_participants: number
  current_participants: number
  status: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled'
  registration_deadline: string
  cover_image?: string
  tags: string[]
  created_at: string
  updated_at: string
}

export interface ActivityParticipant {
  id: number
  activity_id: number
  user_id: number
  user_name: string
  user_avatar?: string
  registration_time: string
  status: 'registered' | 'attended' | 'absent'
}

export interface ActivityStats {
  total_activities: number
  published_activities: number
  ongoing_activities: number
  total_participants: number
  avg_participants_per_activity: number
  popular_activities: Array<{
    id: number
    title: string
    participants: number
  }>
  activity_trend: Array<{
    date: string
    count: number
  }>
  category_distribution: Array<{
    category: string
    count: number
  }>
}

// 获取活动列表
export const getActivityList = (params: {
  page?: number
  limit?: number
  club_id?: number
  status?: string
  keyword?: string
}) => {
  return request({
    url: '/activity/list',
    method: 'get',
    params
  })
}

// 获取活动详情
export const getActivityDetail = (id: number) => {
  return request({
    url: `/activity/${id}`,
    method: 'get'
  })
}

// 创建活动
export const createActivity = (data: Partial<Activity>) => {
  return request({
    url: '/activity',
    method: 'post',
    data
  })
}

// 更新活动
export const updateActivity = (id: number, data: Partial<Activity>) => {
  return request({
    url: `/activity/${id}`,
    method: 'put',
    data
  })
}

// 删除活动
export const deleteActivity = (id: number) => {
  return request({
    url: `/activity/${id}`,
    method: 'delete'
  })
}

// 获取活动参与者
export const getActivityParticipants = (activityId: number, params?: {
  page?: number
  limit?: number
  status?: string
}) => {
  return request({
    url: `/activity/${activityId}/participants`,
    method: 'get',
    params
  })
}

// 更新参与者状态
export const updateParticipantStatus = (activityId: number, participantId: number, status: string) => {
  return request({
    url: `/activity/${activityId}/participants/${participantId}`,
    method: 'put',
    data: { status }
  })
}

// 标记参与者签到
export const markAttendance = (participantId: number) => {
  return request({
    url: `/activity/participants/${participantId}/attendance`,
    method: 'post'
  })
}

// 移除参与者
export const removeParticipant = (participantId: number) => {
  return request({
    url: `/activity/participants/${participantId}`,
    method: 'delete'
  })
}

// 获取活动统计数据
export const getActivityStats = () => {
  return request({
    url: '/activity/stats',
    method: 'get'
  })
}

// 获取社团活动列表
export const getClubActivities = (clubId: number, params?: {
  page?: number
  limit?: number
  status?: string
}) => {
  return request({
    url: `/club/${clubId}/activities`,
    method: 'get',
    params
  })
}


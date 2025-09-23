import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/components/Layout.vue'),
    redirect: '/dashboard',
    children: [
      // 1) 数据看板
      { path: '/dashboard', name: 'Dashboard', component: () => import('@/views/Dashboard.vue'), meta: { title: '数据看板', icon: 'DataBoard' } },
      // 2) 用户和角色管理
      { path: '/users', name: 'Users', component: () => import('@/views/Users.vue'), meta: { title: '用户和角色管理', icon: 'User' } },
      // 3) 课程管理
      { path: '/courses', name: 'Courses', component: () => import('@/views/Courses.vue'), meta: { title: '课程管理', icon: 'Reading' } },
      // 4) 教室管理
      { path: '/classrooms', name: 'Classrooms', component: () => import('@/views/Classrooms.vue'), meta: { title: '教室管理', icon: 'OfficeBuilding' } },
      // 5) 自习室管理
      { path: '/studyrooms', name: 'StudyRooms', component: () => import('@/views/StudyRooms.vue'), meta: { title: '自习室管理', icon: 'Reading' } },
      // 6) 图书馆管理
      { path: '/library', name: 'Library', component: () => import('@/views/Library.vue'), meta: { title: '图书馆管理', icon: 'Reading' } },
      // 7) 食堂管理
      { path: '/canteen', name: 'Canteen', component: () => import('@/views/Canteen.vue'), meta: { title: '食堂管理', icon: 'Food' } },
      // 8) 快递驿站
      { path: '/express', name: 'Express', component: () => import('@/views/Express.vue'), meta: { title: '快递驿站', icon: 'Van' } },
      // 9) 共享设备
      { path: '/devices', name: 'Devices', component: () => import('@/views/Devices.vue'), meta: { title: '共享设备', icon: 'Monitor' } },
      // 10) 跑腿服务
      { path: '/errand', name: 'Errand', component: () => import('@/views/Errand.vue'), meta: { title: '跑腿服务', icon: 'Bicycle' } },
      // 11) 校园圈子
      { path: '/community', name: 'Community', component: () => import('@/views/Community.vue'), meta: { title: '校园圈子', icon: 'ChatLineRound' } },
      // 12) 社团管理
      { path: '/clubs', name: 'Clubs', component: () => import('@/views/Clubs.vue'), meta: { title: '社团管理', icon: 'Trophy' } },
      // 13) 活动管理
      { path: '/activity-management', name: 'ActivityManagement', component: () => import('@/views/ActivityManagement.vue'), meta: { title: '活动管理', icon: 'Calendar' } },
      // 14) 医务室
      { path: '/medical', name: 'Medical', component: () => import('@/views/Medical.vue'), meta: { title: '医务室', icon: 'FirstAidKit' } },
      // 15) 心理中心
      { path: '/psychology', name: 'Psychology', component: () => import('@/views/Psychology.vue'), meta: { title: '心理中心', icon: 'ChatDotRound' } }
    ]
  },
  {
    path: '/post/:id',
    name: 'PostDetail',
    component: () => import('@/views/PostDetail.vue'),
    meta: { title: '帖子详情' }
  },
  {
    path: '/errand/order/:id',
    name: 'ErrandOrderDetail',
    component: () => import('@/views/ErrandOrderDetail.vue'),
    meta: { title: '订单详情' }
  },
  {
    path: '/activity-detail/:id',
    name: 'ActivityDetail',
    component: () => import('@/views/ActivityDetail.vue'),
    meta: { title: '活动详情' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // 如果是登录页面，直接放行
  if (to.name === 'Login') {
    next()
    return
  }
  
  // 检查是否有token
  if (!authStore.token) {
    next('/login')
    return
  }
  
  // 如果有token但没有用户信息，尝试获取用户信息
  if (!authStore.userInfo) {
    try {
      await authStore.getUserInfoAction()
      next()
    } catch (error) {
      // 获取用户信息失败，清除token并跳转到登录页
      authStore.logoutAction()
      next('/login')
    }
    return
  }
  
  next()
})

export default router

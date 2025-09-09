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
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: { title: '数据看板', icon: 'DataBoard' }
      },
      {
        path: '/users',
        name: 'Users',
        component: () => import('@/views/Users.vue'),
        meta: { title: '用户和角色管理', icon: 'User' }
      },
      {
        path: '/courses',
        name: 'Courses',
        component: () => import('@/views/Courses.vue'),
        meta: { title: '课程管理', icon: 'Reading' }
      },
      {
        path: '/classrooms',
        name: 'Classrooms',
        component: () => import('@/views/Classrooms.vue'),
        meta: { title: '教室管理', icon: 'OfficeBuilding' }
      },
      {
        path: '/studyrooms',
        name: 'StudyRooms',
        component: () => import('@/views/StudyRooms.vue'),
        meta: { title: '自习室管理', icon: 'Reading' }
      },
      {
        path: '/library',
        name: 'Library',
        component: () => import('@/views/Library.vue'),
        meta: { title: '图书馆管理', icon: 'Reading' }
      },
      {
        path: '/canteen',
        name: 'Canteen',
        component: () => import('@/views/Canteen.vue'),
        meta: { title: '食堂管理', icon: 'Food' }
      },
      {
        path: '/express',
        name: 'Express',
        component: () => import('@/views/Express.vue'),
        meta: { title: '快递驿站', icon: 'Truck' }
      },
      {
        path: '/devices',
        name: 'Devices',
        component: () => import('@/views/Devices.vue'),
        meta: { title: '共享设备', icon: 'Monitor' }
      },
      {
        path: '/medical',
        name: 'Medical',
        component: () => import('@/views/Medical.vue'),
        meta: { title: '医务室', icon: 'FirstAidKit' }
      },
      {
        path: '/psychology',
        name: 'Psychology',
        component: () => import('@/views/Psychology.vue'),
        meta: { title: '心理中心', icon: 'ChatDotRound' }
      },
      {
        path: '/community',
        name: 'Community',
        component: () => import('@/views/Community.vue'),
        meta: { title: '校园圈子', icon: 'ChatLineRound' }
      },
      {
        path: '/errand',
        name: 'Errand',
        component: () => import('@/views/Errand.vue'),
        meta: { title: '跑腿服务', icon: 'Bicycle' }
      },
      {
        path: '/clubs',
        name: 'Clubs',
        component: () => import('@/views/Clubs.vue'),
        meta: { title: '社团管理', icon: 'Trophy' }
      },
      {
        path: '/activity-management',
        name: 'ActivityManagement',
        component: () => import('@/views/ActivityManagement.vue'),
        meta: { title: '活动管理', icon: 'Calendar' }
      }
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

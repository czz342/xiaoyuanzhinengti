import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

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
        meta: { title: '用户管理', icon: 'User' }
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
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

<template>
  <el-container class="layout-container">
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '80px' : '220px'" class="sidebar">
      <div class="logo">
        <div class="logo-icon" v-if="!isCollapse">
          <el-icon><School /></el-icon>
        </div>
        <span v-if="!isCollapse">校园管理系统</span>
        <span v-else>校园</span>
      </div>
      
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :unique-opened="true"
        router
        class="sidebar-menu"
      >
        <el-menu-item
          v-for="route in menuRoutes"
          :key="route.path"
          :index="route.path"
        >
          <el-icon><component :is="route.meta?.icon" /></el-icon>
          <template #title>{{ route.meta?.title }}</template>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 主内容区 -->
    <el-container>
      <!-- 顶部导航 -->
      <el-header class="header">
        <div class="header-left">
          <el-button
            type="text"
            @click="toggleCollapse"
            class="collapse-btn"
          >
            <el-icon><Expand v-if="isCollapse" /><Fold v-else /></el-icon>
          </el-button>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item>{{ currentPageTitle }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        
        <div class="header-right">
          <el-dropdown>
            <span class="user-info">
              <el-icon><User /></el-icon>
              <span>{{ authStore.userInfo?.username || '管理员' }}</span>
              <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人设置</el-dropdown-item>
                <el-dropdown-item divided @click="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 页面内容 -->
      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { 
  Expand, 
  Fold, 
  User, 
  ArrowDown,
  School,
  DataBoard,
  Reading,
  OfficeBuilding,
  Food,
  Truck,
  Monitor,
  FirstAidKit,
  ChatDotRound,
  ChatLineRound,
  Bicycle,
  Trophy
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const isCollapse = ref(false)

const menuRoutes = computed(() => {
  return router.getRoutes()
    .find(r => r.name === 'Layout')
    ?.children?.filter(child => child.path !== '/') || []
})

const activeMenu = computed(() => route.path)

const currentPageTitle = computed(() => {
  return route.meta?.title || '首页'
})

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

const logout = async () => {
  try {
    await authStore.logoutAction()
    router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
    router.push('/login')
  }
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

.sidebar {
  background: linear-gradient(180deg, #1f2a37 0%, #111827 100%);
  transition: width 0.3s;
  border-right: 1px solid rgba(255,255,255,0.06);
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #e5e7eb;
  font-size: 18px;
  font-weight: 700;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  letter-spacing: 0.5px;
}

.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-right: 8px;
  background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.08) 100%);
  border-radius: 6px;
}

.logo-icon .el-icon {
  font-size: 20px;
  color: white;
}

.sidebar-menu {
  border: none;
  background: transparent;
  padding: 8px 6px 12px;
}

.sidebar-menu .el-menu-item {
  color: #bfcbd9;
  margin: 8px 10px;
  border-radius: 10px;
  height: 48px;
  line-height: 48px;
  transition: all 0.2s ease;
}

.sidebar-menu .el-menu-item:hover {
  background: rgba(255,255,255,0.06);
  color: #fff;
}

.sidebar-menu .el-menu-item.is-active {
  background: linear-gradient(135deg, #4f8cff 0%, #6cc1ff 100%);
  color: #fff;
  box-shadow: 0 8px 20px rgba(79,140,255,0.25);
}

.header {
  background: rgba(255,255,255,0.65);
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(0,0,0,0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.06);
}

.header-left {
  display: flex;
  align-items: center;
}

.collapse-btn {
  margin-right: 20px;
  font-size: 18px;
  color: #374151;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.user-info:hover {
  background-color: rgba(17,24,39,0.04);
}

.user-info span {
  margin: 0 8px;
}

.main-content {
  background: linear-gradient(180deg, #f7fafc 0%, #f3f4f6 100%);
  padding: 20px;
}
</style>

<template>
  <!-- app-wrapper 是整个应用的容器,固定布局，classObj 是根据设备类型和侧边栏状态计算的类名 -->
  <div :class="classObj" class="app-wrapper">
    <!-- 移动端侧边栏展开时,点击遮罩层关闭侧边栏 -->
    <div v-if="device === 'mobile' && sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    
    <!-- 侧边栏状态调试信息 -->
    <div class="debug-info" style="position: fixed; bottom: 10px; left: 10px; z-index: 9999; background: rgba(0, 0, 0, 0.7); color: white; padding: 10px; border-radius: 4px;">
      Sidebar: {{ sidebar.opened ? 'Opened' : 'Closed' }}
    </div>
    
    <!-- 侧边栏 - 强制显示 -->
    <Sidebar class="sidebar-container" />
    
    <!-- 主容器 -->
    <div class="main-container">
      <!-- 头部 -->
      <div :class="{ 'fixed-header': fixedHeader }">
        <navbar />
      </div>
      <app-main />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeMount, onBeforeUnmount, onMounted, watch, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useSettingsStore } from '@/stores/settings'
import { Navbar, Sidebar, AppMain } from './components/index'
import Cookies from 'js-cookie'

// Constants
const WIDTH = 992 // refer to Bootstrap's responsive design

// Stores and route
const appStore = useAppStore()
const settingsStore = useSettingsStore()
const route = useRoute()

// Computed properties
const sidebar = computed(() => appStore.sidebar)
const device = computed(() => appStore.device)
const fixedHeader = computed(() => settingsStore.fixedHeader)
const classObj = computed(() => ({
  hideSidebar: !sidebar.value.opened,
  openSidebar: sidebar.value.opened,
  withoutAnimation: sidebar.value.withoutAnimation,
  mobile: device.value === 'mobile'
}))

// 打印调试信息
console.log('Sidebar state:', sidebar.value)
console.log('Cookie sidebarStatus:', Cookies.get('sidebarStatus'))

// 强制打开侧边栏
onMounted(() => {
  setTimeout(() => {
    console.log('Force opening sidebar')
    appStore.openSideBar({ withoutAnimation: true })
    console.log('Sidebar state after force open:', appStore.sidebar)
  }, 1000)
})

// Methods
const isMobile = (): boolean => {
  const rect = document.body.getBoundingClientRect()
  return rect.width - 1 < WIDTH
}

const resizeHandler = (): void => {
  if (!document.hidden) {
    const mobile = isMobile()
    appStore.toggleDevice(mobile ? 'mobile' : 'desktop')

    if (mobile) {
      appStore.closeSideBar({ withoutAnimation: true })
    }
  }
}

const handleClickOutside = (): void => {
  appStore.closeSideBar({ withoutAnimation: false })
}

// Lifecycle hooks
onBeforeMount(() => {
  window.addEventListener('resize', resizeHandler)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeHandler)
})

onMounted(() => {
  const mobile = isMobile()
  if (mobile) {
    appStore.toggleDevice('mobile')
    appStore.closeSideBar({ withoutAnimation: true })
  } else {
    // 非移动端环境，强制打开侧边栏
    appStore.openSideBar({ withoutAnimation: false })
  }
})

// Watch route changes
watch(route, () => {
  if (device.value === 'mobile' && sidebar.value.opened) {
    appStore.closeSideBar({ withoutAnimation: false })
  }
})
</script>

<style lang="scss" scoped>
@import "@/styles/mixin.scss";
@import "@/styles/variables.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}

// 确保侧边栏在任何状态下都有最小宽度
.sidebar-container {
  min-width: 210px;
  display: block !important;
  transition: width 0.28s;
}
</style>

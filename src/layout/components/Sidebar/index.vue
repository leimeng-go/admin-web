<template>
  <!-- 是否展示log -->
  <div :class="{'has-logo':showLogo}">
    <!-- 展示logo -->
    <logo v-if="showLogo" :collapse="isCollapse" />
    <!-- 滚动条 -->
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in permissionRoutes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute, RouteRecordRaw } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { usePermissionStore } from '@/stores/permission'
import { useSettingsStore } from '@/stores/settings'
import Logo from './Logo.vue'
import SidebarItem from './SidebarItem.vue'
import variablesModule from '../../../styles/variables.scss?inline'

// Define interface for SCSS variables
interface ScssVariables {
  menuBg: string;
  menuText: string;
  menuActiveText: string;
  [key: string]: string;
}

// Define interface for route items
interface RouteItem {
  path: string
  children?: RouteItem[]
  hidden?: boolean
  alwaysShow?: boolean
  meta?: {
    title: string
    icon?: string
    [key: string]: any
  }
  [key: string]: any
}

// Cast the imported module to the interface
const variables = variablesModule as unknown as ScssVariables

// Stores
const appStore = useAppStore()
const permissionStore = usePermissionStore()
const settingsStore = useSettingsStore()
const route = useRoute()

// Computed properties
const permissionRoutes = computed(() => permissionStore.routes as RouteItem[])
const sidebar = computed(() => appStore.sidebar)

const activeMenu = computed(() => {
  const { meta, path } = route
  // If set path, the sidebar will highlight the path you set
  if (meta.activeMenu) {
    return meta.activeMenu as string
  }
  return path
})

const showLogo = computed(() => settingsStore.sidebarLogo)
const isCollapse = computed(() => !sidebar.value.opened)
</script>

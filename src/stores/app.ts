import { defineStore } from 'pinia'
import Cookies from 'js-cookie'

interface Sidebar {
  // 侧边栏是否打开
  opened: boolean
  // 侧边栏是否动画
  withoutAnimation: boolean
}

interface AppState {
  sidebar: Sidebar
  device: 'desktop' | 'mobile'
  size: string
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    sidebar: {
      // +将字符串转换成数字，!!将数字转换成布尔值
      opened: Cookies.get('sidebarStatus') !== undefined ? !!+Cookies.get('sidebarStatus')! : true,
      withoutAnimation: false
    },
    device: 'desktop',
    size: Cookies.get('size') !== undefined ? Cookies.get('size')! : 'medium'
  }),
  
  actions: {
    // 切换侧边栏的开关
    toggleSideBar() {
      this.sidebar.opened = !this.sidebar.opened
      this.sidebar.withoutAnimation = false
      Cookies.set('sidebarStatus', this.sidebar.opened ? '1' : '0')
    },
    
    // 打开侧边栏
    openSideBar({ withoutAnimation }: { withoutAnimation: boolean }) {
      Cookies.set('sidebarStatus', '1')
      this.sidebar.opened = true
      this.sidebar.withoutAnimation = withoutAnimation
    },
    
    // 关闭侧边栏
    closeSideBar({ withoutAnimation }: { withoutAnimation: boolean }) {
      Cookies.set('sidebarStatus', '0')
      this.sidebar.opened = false
      this.sidebar.withoutAnimation = withoutAnimation
    },
    
    // 切换设备类型
    toggleDevice(device: 'desktop' | 'mobile') {
      this.device = device
    },
    
    setSize(size: string) {
      this.size = size
      Cookies.set('size', size)
    }
  }
}) 
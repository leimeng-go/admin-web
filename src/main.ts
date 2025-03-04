import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import pinia from './stores'
import '@/styles/index.scss'
import SvgIcon from '@/components/SvgIcon/index.vue'
import 'virtual:svg-icons-register'
import { usePermissionStore } from '@/stores/permission'
import { useAppStore } from '@/stores/app'

async function bootstrap() {
    const app = createApp(App)
    app.use(pinia)
    
    // 初始化 stores
    const permissionStore = usePermissionStore()
    const appStore = useAppStore()
    
    // 初始化权限路由
    await permissionStore.generateRoutes(['admin'])
    
    // 初始化侧边栏状态
    appStore.openSideBar({ withoutAnimation: true })
    
    app.use(router)
    app.component('svg-icon', SvgIcon)
    app.mount('#app')
}

bootstrap()




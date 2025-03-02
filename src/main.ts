import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import pinia from './stores'
import '@/styles/index.scss'
import SvgIcon from '@/components/SvgIcon/index.vue'
import 'virtual:svg-icons-register'

async function bootstrap() {
    const app = createApp(App)
    app.use(pinia)
    app.use(router)
    app.component('svg-icon', SvgIcon)
    app.mount('#app')
}

bootstrap()




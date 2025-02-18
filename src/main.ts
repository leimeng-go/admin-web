import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './styles/index.css'
import './styles/element-overrides.css'
import SvgIcon from '@/components/SvgIcon/index.vue'
import 'virtual:svg-icons-register'

async function bootstrap() {
    const app = createApp(App)
    app.use(createPinia())
    app.use(router)
    app.component('svg-icon', SvgIcon)
    app.mount('#app')
}

bootstrap()




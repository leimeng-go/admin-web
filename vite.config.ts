import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ElementPlus from 'unplugin-element-plus/vite'

export default defineConfig({
  plugins: [
    vue(),
    ElementPlus({
      format: 'esm',
    })
  ],
  server: {
    port: 3000,
    hmr: true,
    open: false,
  },
})

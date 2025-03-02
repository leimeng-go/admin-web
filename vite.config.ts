import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'
import path from 'path'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

export default defineConfig({
  resolve:{
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  plugins: [
    vue(),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/icons/svg')],
      symbolId: 'icon-[name]',
    }),
    AutoImport({
      resolvers:[ElementPlusResolver()]
    }),
    Components({
      resolvers:[ElementPlusResolver()]
    })
  ],
  server: {
    port: 3000,
    // hmr: true,
    open: false,
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Use modern API
        quietDeps: true,
        // Don't auto-import variables to prevent circular references
        // Instead, we'll rely on explicit imports in each file
        // Add path resolution for @ alias
        resolve: {
          alias: {
            '@': path.resolve(__dirname, './src')
          }
        }
      }
    }
  }
})

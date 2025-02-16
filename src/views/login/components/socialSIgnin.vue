<template>
    <div class="flex justify-center space-x-8 my-5">
      <button 
        class="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-[#24da70] hover:bg-[#20c464]"
        @click="handleSocialLogin('wechat')"
      >
        <span class="w-10 h-10 flex items-center justify-center">
          <svg-icon 
            icon-class="wechat" 
            class="text-white text-2xl"
          />
        </span>
        <span class="text-white">WeChat</span>
      </button>
  
      <button 
        class="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-[#6BA2D6] hover:bg-[#5891c9]"
        @click="handleSocialLogin('qq')"
      >
        <span class="w-10 h-10 flex items-center justify-center">
          <svg-icon 
            icon-class="qq" 
            class="text-white text-2xl"
          />
        </span>
        <span class="text-white">QQ</span>
      </button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  import { useUserStore } from '@/stores/user'
  
  // 定义社交平台类型
  type SocialPlatform = 'wechat' | 'qq'
  
  const userStore = useUserStore()
  const currentOrigin = computed(() => window.location.origin)
  
  /**
   * 打开第三方登录窗口
   */
  function openWindow(url: string, title: string, w: number, h: number) {
    const dualScreenLeft = window.screenLeft ?? window.screenX
    const dualScreenTop = window.screenTop ?? window.screenY
  
    const width = window.innerWidth ?? document.documentElement.clientWidth ?? screen.width
    const height = window.innerHeight ?? document.documentElement.clientHeight ?? screen.height
  
    const left = ((width / 2) - (w / 2)) + dualScreenLeft
    const top = ((height / 2) - (h / 2)) + dualScreenTop
  
    const windowFeatures = `
      toolbar=no,
      location=no,
      directories=no,
      status=no,
      menubar=no,
      scrollbars=no,
      resizable=no,
      copyhistory=no,
      width=${w},
      height=${h},
      top=${top},
      left=${left}
    `
  
    return window.open(url, title, windowFeatures.replace(/\s/g, ''))
  }
  
  /**
   * 处理社交登录
   */
  async function handleSocialLogin(platform: SocialPlatform) {
    if (process.env.NODE_ENV === 'development') {
      // 开发环境下模拟
      alert(`${platform} login simulation`)
      return
    }
  
    try {
      // 设置当前认证类型
      userStore.setAuthType(platform)
  
      const config = {
        wechat: {
          appId: process.env.VITE_WECHAT_APP_ID,
          redirectUri: process.env.VITE_WECHAT_REDIRECT_URI
        },
        qq: {
          appId: process.env.VITE_QQ_CLIENT_ID,
          redirectUri: process.env.VITE_QQ_REDIRECT_URI
        }
      }[platform]
  
      const redirectUri = encodeURIComponent(
        `${config.redirectUri}?redirect=${currentOrigin.value}/auth-redirect`
      )
  
      let url: string
      if (platform === 'wechat') {
        url = `https://open.weixin.qq.com/connect/qrconnect?appid=${config.appId}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_login#wechat_redirect`
      } else {
        url = `https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=${config.appId}&redirect_uri=${redirectUri}`
      }
  
      openWindow(url, platform, 540, 540)
    } catch (error) {
      console.error('Social login error:', error)
    }
  }
  </script>
  
  <script lang="ts">
  // 为了类型推断和组件名称
  export default {
    name: 'SocialSignin'
  }
  </script>
  
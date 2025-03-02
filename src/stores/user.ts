import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'

interface UserState {
  authType: string | null
  avatar: string
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    authType: null,
    avatar: 'https://avatars.githubusercontent.com/u/583231?v=4'
  }),

  actions: {
    setAuthType(type: string) {
      this.authType = type
    },
    async login(loginForm: { username: string; password: string }) {
      // 实现登录逻辑
      // 例如：调用 API、设置 token 等
      return Promise.resolve()
    },
    async logout() {
      // 实现登出逻辑
      // 例如：清除 token、重置状态等
      this.authType = null
      return Promise.resolve()
    }
  }
}) 
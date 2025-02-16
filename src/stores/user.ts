import { defineStore } from 'pinia'

interface UserState {
  authType: string | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    authType: null
  }),

  actions: {
    setAuthType(type: string) {
      this.authType = type
    },
    async login(loginForm: { username: string; password: string }) {
      // 实现登录逻辑
      // 例如：调用 API、设置 token 等
      return Promise.resolve()
    }
  }
}) 
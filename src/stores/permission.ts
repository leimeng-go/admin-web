import { defineStore } from 'pinia'
import { RouteRecordRaw } from 'vue-router'

export interface PermissionState {
  routes: RouteRecordRaw[]
  addRoutes: RouteRecordRaw[]
}

export const usePermissionStore = defineStore('permission', {
  state: (): PermissionState => ({
    routes: [],
    addRoutes: []
  }),
  
  actions: {
    setRoutes(routes: RouteRecordRaw[]) {
      this.addRoutes = routes
      this.routes = routes
    },
    
    generateRoutes(roles: string[]) {
      // This is a simplified version. In a real app, you would filter routes based on roles
      // For now, we'll just return all routes
      return new Promise<RouteRecordRaw[]>((resolve) => {
        // Here you would normally filter routes based on roles
        // For example:
        // let accessedRoutes
        // if (roles.includes('admin')) {
        //   accessedRoutes = asyncRoutes || []
        // } else {
        //   accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
        // }
        
        // For now, we'll just use an empty array
        const accessedRoutes: RouteRecordRaw[] = []
        
        this.setRoutes(accessedRoutes)
        resolve(accessedRoutes)
      })
    }
  }
}) 
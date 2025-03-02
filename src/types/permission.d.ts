declare module '@/stores/permission' {
  import { RouteRecordRaw } from 'vue-router'
  
  export interface PermissionState {
    routes: RouteRecordRaw[]
    addRoutes: RouteRecordRaw[]
  }
  
  export function usePermissionStore(): {
    routes: RouteRecordRaw[]
    addRoutes: RouteRecordRaw[]
    generateRoutes: (roles: string[]) => Promise<RouteRecordRaw[]>
  }
} 
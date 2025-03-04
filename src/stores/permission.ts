import { defineStore } from 'pinia'
import { RouteRecordRaw } from 'vue-router'
import router from '@/router'

// 定义动态路由
const asyncRoutes: RouteRecordRaw[] = [
  {
    path: '/nested',
    component: () => import('@/layout/index.vue'),
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: {
      title: 'Nested',
      icon: 'nested'
    },
    children: [
      {
        path: 'menu1',
        component: () => import('@/views/nested/menu1/index.vue'),
        name: 'Menu1',
        meta: { title: 'Menu1' }
      },
      {
        path: 'menu2',
        component: () => import('@/views/nested/menu2/index.vue'),
        name: 'Menu2',
        meta: { title: 'Menu2' }
      }
    ]
  }
]

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
      this.routes = [...router.options.routes]
      
      // 动态添加路由
      routes.forEach(route => {
        if (!router.hasRoute(route.name as string)) {
          router.addRoute(route)
        }
      })
    },
    
    generateRoutes(roles: string[]) {
      return new Promise<RouteRecordRaw[]>((resolve) => {
        let accessedRoutes = []
        
        if (roles.includes('admin')) {
          accessedRoutes = asyncRoutes
        } else {
          // 根据角色过滤路由
          accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
        }
        
        this.setRoutes(accessedRoutes)
        resolve(accessedRoutes)
      })
    }
  }
})

// 根据角色过滤路由
function filterAsyncRoutes(routes: RouteRecordRaw[], roles: string[]): RouteRecordRaw[] {
  const res: RouteRecordRaw[] = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

// 判断是否有权限
function hasPermission(roles: string[], route: RouteRecordRaw): boolean {
  if (route.meta && route.meta.roles) {
    return roles.some(role => (route.meta?.roles as string[]).includes(role))
  } else {
    return true
  }
} 
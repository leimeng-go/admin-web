import {
    createRouter,
    createWebHistory,
    createWebHashHistory
} from "vue-router";

import type { RouteRecordRaw } from 'vue-router';

import Layout from '@/layout/index.vue'

const routers: RouteRecordRaw[] = [
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
      hidden: true,
    },
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        name: 'Dashboard',
        meta: {
          title: 'Dashboard',
          icon: 'dashboard',
          affix: true,
        }
      }
    ]
  },
  {
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: { title: '示例', icon: 'example' },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/table/index.vue'),
        meta: { title: '表格', icon: 'table' }
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/tree/index.vue'),
        meta: { title: '树形控件', icon: 'tree' }
      }
    ]
  },
  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index.vue'),
        meta: { title: '表单', icon: 'form' }
      }
    ]
  }
]

const router = createRouter({
  history: 
    import.meta.env.VITE_ROUTER_HISTORY === 'hash' 
    ? 
    createWebHashHistory(import.meta.env.VITE_BASE) 
    :
    createWebHistory(),
  routes: routers
});

export default router


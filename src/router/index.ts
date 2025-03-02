import {
    createRouter,
    createWebHistory,
    createWebHashHistory
} from "vue-router";

import type { RouteRecordRaw } from 'vue-router';

import Layout from '@/layout/index.vue'

const routers: RouteRecordRaw[] =[
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
  }
  
]


const router=createRouter({
   history: 
     import.meta.env.VITE_ROUTER_HISTORY === 'hash' 
     ? 
     createWebHashHistory(import.meta.env.VITE_BASE) 
     :
     createWebHistory(),
     routes: routers
});

export default router


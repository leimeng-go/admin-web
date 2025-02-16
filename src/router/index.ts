import {
    createRouter,
    createWebHistory,
    createWebHashHistory
} from "vue-router";

import type { RouteRecordRaw } from 'vue-router';


const routers: RouteRecordRaw[] =[
  {
      path: '/login',
      component: () => import('@/views/login/index.vue'),
      meta: {
          title: '登录',
          hidden: true,
      },
  },
  
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


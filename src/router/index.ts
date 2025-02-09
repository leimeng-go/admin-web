import {
    createRouter,
    createWebHistory,
    createWebHashHistory
} from "vue-router";

const router=createRouter({
   history: 
     import.meta.env.VITE_ROUTER_HISTORY === 'hash' 
     ? 
     createWebHashHistory(import.meta.env.VITE_BASE) 
     :
     createWebHistory(),
     routes:[]
});
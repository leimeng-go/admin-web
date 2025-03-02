// /// <reference types="vite/client" />

// declare module '*.vue' {
//   import type { DefineComponent } from 'vue'
//   const component: DefineComponent<{}, {}, any>
//   export default component
// }

// declare module '*.scss?inline' {
//   const variables: {
//     menuText: string;
//     menuActiveText: string;
//     subMenuActiveText: string;
//     menuBg: string;
//     menuHover: string;
//     subMenuBg: string;
//     subMenuHover: string;
//     sideBarWidth: string;
//   };
//   export default variables;
// } 

interface Setting {
  // 标题
  title: string;
  // 是否展示右边设置面板
  showSettings: boolean;
  // 是否展示标签视图
  tagsView: boolean;
  // 是否固定头部
  fixedHeader: boolean;
  // 是否展示侧边栏logo
  sidebarLogo: boolean;
  // 错误日志
  errorLog: string
 
}

const setting: Setting = {
  title: 'Vue3 Element Admin',
  showSettings: true,
  tagsView: true,
  fixedHeader: false,
  sidebarLogo: false,
  errorLog: 'production'
}

export default setting;
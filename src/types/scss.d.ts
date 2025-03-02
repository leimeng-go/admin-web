declare module '*.scss?inline' {
  const content: {
    menuText: string;
    menuActiveText: string;
    subMenuActiveText: string;
    menuBg: string;
    menuHover: string;
    subMenuBg: string;
    subMenuHover: string;
    sideBarWidth: string;
    [key: string]: string;
  };
  export default content;
}

declare module '*.scss' {
  const content: Record<string, string>;
  export default content;
}

declare module '*.css' {
  const content: Record<string, string>;
  export default content;
} 
interface Settings {
  title: string
  showSettings: boolean
  tagsView: boolean
  fixedHeader: boolean
  sidebarLogo: boolean
  errorLog: string
}

const settings: Settings = {
  title: 'Vue 3 Admin',
  showSettings: true,
  tagsView: true,
  fixedHeader: true,
  sidebarLogo: false,
  errorLog: 'production'
}

export default settings
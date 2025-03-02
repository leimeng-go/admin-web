import { defineStore } from 'pinia'
import defaultSettings from '@/settings'
import variables from '@/styles/element-variables.scss'

interface SettingsState {
  fixedHeader: boolean
  sidebarLogo: boolean
  showSettings: boolean
  tagsView: boolean
  theme: string
}

export const useSettingsStore = defineStore('settings', {
  state: (): SettingsState => ({
    fixedHeader: true,
    sidebarLogo: true,
    showSettings: true,
    tagsView: true,
    theme: variables.theme
  }),
  
  actions: {
    changeSetting(key: keyof SettingsState, value: any) {
      // @ts-ignore: dynamic key assignment
      this[key] = value
    }
  }
}) 
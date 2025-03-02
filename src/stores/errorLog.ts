import { defineStore } from 'pinia'

export interface ErrorLogItem {
  err: Error
  vm: any
  info: string
  url: string
  time?: string
}

export interface ErrorLogState {
  logs: ErrorLogItem[]
}

export const useErrorLogStore = defineStore('errorLog', {
  state: (): ErrorLogState => ({
    logs: []
  }),
  actions: {
    addErrorLog(log: ErrorLogItem) {
      // Add the current time
      const errorLog = {
        ...log,
        time: new Date().toISOString()
      }
      this.logs.push(errorLog)
    },
    clearErrorLog() {
      this.logs.splice(0)
    }
  }
}) 
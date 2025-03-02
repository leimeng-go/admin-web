import { defineStore } from 'pinia'

export interface ChartData {
  expectedData: number[]
  actualData: number[]
}

export interface LineChartDataType {
  newVisitis: ChartData
  messages: ChartData
  purchases: ChartData
  shoppings: ChartData
  [key: string]: ChartData
}

interface DashboardState {
  lineChartData: ChartData
  lineChartDataSource: LineChartDataType
}

export const useDashboardStore = defineStore('dashboard', {
  state: (): DashboardState => {
    console.log('Initializing dashboard store')
    return {
      lineChartData: {
        expectedData: [100, 120, 161, 134, 105, 160, 165],
        actualData: [120, 82, 91, 154, 162, 140, 145]
      },
      lineChartDataSource: {
        newVisitis: {
          expectedData: [100, 120, 161, 134, 105, 160, 165],
          actualData: [120, 82, 91, 154, 162, 140, 145]
        },
        messages: {
          expectedData: [200, 192, 120, 144, 160, 130, 140],
          actualData: [180, 160, 151, 106, 145, 150, 130]
        },
        purchases: {
          expectedData: [80, 100, 121, 104, 105, 90, 100],
          actualData: [120, 90, 100, 138, 142, 130, 130]
        },
        shoppings: {
          expectedData: [130, 140, 141, 142, 145, 150, 160],
          actualData: [120, 82, 91, 154, 162, 140, 130]
        }
      }
    }
  },
  
  actions: {
    setLineChartData(type: string) {
      console.log('Setting line chart data to type:', type)
      if (!this.lineChartDataSource[type]) {
        console.error(`Chart data type "${type}" not found in lineChartDataSource`)
        return
      }
      this.lineChartData = this.lineChartDataSource[type]
      console.log('Line chart data set to:', this.lineChartData)
    }
  }
}) 
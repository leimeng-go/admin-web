declare module 'echarts/theme/macarons' {
  const content: any
  export default content
}

declare module 'echarts' {
  export * from 'echarts/core'
  import * as echarts from 'echarts/core'
  export default echarts
}

declare module 'echarts/core' {
  export interface EChartsOption {
    xAxis?: any | any[]
    yAxis?: any | any[]
    series?: any[]
    tooltip?: any
    grid?: any
    legend?: any
    radar?: any
    [key: string]: any
  }

  export interface ECharts {
    setOption(option: EChartsOption, notMerge?: boolean, lazyUpdate?: boolean): void
    resize(opts?: { width?: number | string, height?: number | string, silent?: boolean }): void
    dispose(): void
    getWidth(): number
    getHeight(): number
    getDom(): HTMLElement
    getOption(): EChartsOption
    [key: string]: any
  }

  export function init(dom: HTMLElement, theme?: string, opts?: any): ECharts
} 
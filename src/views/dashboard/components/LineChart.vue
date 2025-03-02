<template>
  <div ref="chartRef" :class="className" :style="{height:height,width:width}" />
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import * as echarts from 'echarts'
import 'echarts/theme/macarons' // echarts theme
import { useResize } from './mixins/resize'

interface ChartData {
  expectedData: number[]
  actualData: number[]
}

// Props
const props = defineProps({
  className: {
    type: String,
    default: 'chart'
  },
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '350px'
  },
  autoResize: {
    type: Boolean,
    default: true
  },
  chartData: {
    type: Object,
    required: true
  }
})

// State
const chartRef = ref<HTMLElement | null>(null)
const chart = ref<echarts.ECharts | null>(null)

// Use resize mixin
const { initResizeEvent, destroyResizeEvent, resizeHandler } = useResize(chart)

// Methods
const initChart = () => {
  try {
    if (!chartRef.value) {
      console.error('Chart element ref is null')
      return
    }
    
    console.log('Initializing chart with element:', chartRef.value)
    
    // Try to initialize with theme first
    try {
      chart.value = echarts.init(chartRef.value, 'macarons')
    } catch (e) {
      console.warn('Failed to initialize chart with theme, falling back to default:', e)
      chart.value = echarts.init(chartRef.value)
    }
    
    if (!chart.value) {
      console.error('Failed to initialize chart, echarts.init returned null or undefined')
      return
    }
    
    console.log('Chart initialized successfully, setting options with data:', props.chartData)
    setOptions(props.chartData as ChartData)
  } catch (error) {
    console.error('Failed to initialize chart:', error)
  }
}

const setOptions = ({ expectedData, actualData }: ChartData) => {
  try {
    if (!chart.value) {
      console.error('Chart not initialized when trying to set options')
      return
    }
    
    const options = {
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        boundaryGap: false,
        axisTick: {
          show: false
        }
      },
      grid: {
        left: 10,
        right: 10,
        bottom: 20,
        top: 30,
        containLabel: true
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        },
        padding: [5, 10]
      },
      yAxis: {
        type: 'value',
        axisTick: {
          show: false
        }
      },
      legend: {
        data: ['expected', 'actual']
      },
      series: [
        {
          name: 'expected',
          type: 'line',
          smooth: true,
          data: expectedData || [],
          animationDuration: 2800,
          animationEasing: 'cubicInOut',
          itemStyle: {
            color: '#FF005A',
            lineStyle: {
              color: '#FF005A',
              width: 2
            }
          }
        },
        {
          name: 'actual',
          type: 'line',
          smooth: true,
          data: actualData || [],
          animationDuration: 2800,
          animationEasing: 'quadraticOut',
          itemStyle: {
            color: '#3888fa',
            lineStyle: {
              color: '#3888fa',
              width: 2
            },
            areaStyle: {
              color: '#f3f8ff'
            }
          }
        }
      ]
    }
    
    console.log('Setting chart options:', options)
    chart.value.setOption(options)
    console.log('Chart options set successfully')
  } catch (error) {
    console.error('Failed to set chart options:', error)
  }
}

// Lifecycle hooks
onMounted(() => {
  console.log('LineChart component mounted')
  nextTick(() => {
    console.log('LineChart nextTick, initializing chart')
    initChart()
    if (props.autoResize) {
      console.log('Initializing resize event')
      initResizeEvent()
    }
  })
})

onBeforeUnmount(() => {
  if (props.autoResize) {
    destroyResizeEvent()
  }
  chart.value?.dispose()
  chart.value = null
})

// Watch for data changes
watch(() => props.chartData, (val) => {
  console.log('Chart data changed:', val)
  setOptions(val as ChartData)
}, { deep: true })
</script>

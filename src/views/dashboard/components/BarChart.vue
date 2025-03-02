<template>
  <div ref="chartRef" :class="className" :style="{height:height,width:width}" />
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import * as echarts from 'echarts'
import 'echarts/theme/macarons' // echarts theme
import { useResize } from './mixins/resize'

const animationDuration = 6000

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
    default: '300px'
  }
})

// State
const chartRef = ref<HTMLElement | null>(null)
const chart = ref<echarts.ECharts | null>(null)

// Use resize mixin
const { initResizeEvent, destroyResizeEvent } = useResize(chart)

// Methods
const initChart = () => {
  try {
    if (!chartRef.value) {
      console.error('Chart element ref is null')
      return
    }
    
    console.log('Initializing bar chart with element:', chartRef.value)
    
    // Try to initialize with theme first
    try {
      chart.value = echarts.init(chartRef.value, 'macarons')
    } catch (e) {
      console.warn('Failed to initialize chart with theme, falling back to default:', e)
      chart.value = echarts.init(chartRef.value)
    }
    
    if (!chart.value) {
      console.error('Failed to initialize bar chart, echarts.init returned null or undefined')
      return
    }

    const options = {
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        top: 10,
        left: '2%',
        right: '2%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        axisTick: {
          alignWithLabel: true
        }
      },
      yAxis: {
        type: 'value',
        axisTick: {
          show: false
        }
      },
      series: [
        {
          name: 'pageA',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: [79, 52, 200, 334, 390, 330, 220],
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        }, 
        {
          name: 'pageB',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: [80, 52, 200, 334, 390, 330, 220],
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        }, 
        {
          name: 'pageC',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: [30, 52, 200, 334, 390, 330, 220],
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        }
      ]
    }
    
    console.log('Setting bar chart options:', options)
    chart.value.setOption(options)
    console.log('Bar chart options set successfully')
  } catch (error) {
    console.error('Failed to initialize bar chart:', error)
  }
}

// Lifecycle hooks
onMounted(() => {
  console.log('BarChart component mounted')
  nextTick(() => {
    console.log('BarChart nextTick, initializing chart')
    initChart()
    initResizeEvent()
  })
})

onBeforeUnmount(() => {
  destroyResizeEvent()
  chart.value?.dispose()
  chart.value = null
})
</script>

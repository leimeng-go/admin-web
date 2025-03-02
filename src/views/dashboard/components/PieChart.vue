<template>
  <div ref="chartRef" :class="className" :style="{height:height,width:width}" />
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import * as echarts from 'echarts'
import 'echarts/theme/macarons' // echarts theme
import { useResize } from './mixins/resize'

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
    
    console.log('Initializing pie chart with element:', chartRef.value)
    
    // Try to initialize with theme first
    try {
      chart.value = echarts.init(chartRef.value, 'macarons')
    } catch (e) {
      console.warn('Failed to initialize chart with theme, falling back to default:', e)
      chart.value = echarts.init(chartRef.value)
    }
    
    if (!chart.value) {
      console.error('Failed to initialize pie chart, echarts.init returned null or undefined')
      return
    }

    const options = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        left: 'center',
        bottom: '10',
        data: ['Industries', 'Technology', 'Forex', 'Gold', 'Forecasts']
      },
      series: [
        {
          name: 'WEEKLY WRITE ARTICLES',
          type: 'pie',
          roseType: 'radius',
          radius: [15, 95],
          center: ['50%', '38%'],
          data: [
            { value: 320, name: 'Industries' },
            { value: 240, name: 'Technology' },
            { value: 149, name: 'Forex' },
            { value: 100, name: 'Gold' },
            { value: 59, name: 'Forecasts' }
          ],
          animationEasing: 'cubicInOut',
          animationDuration: 2800
        }
      ]
    }
    
    console.log('Setting pie chart options:', options)
    chart.value.setOption(options)
    console.log('Pie chart options set successfully')
  } catch (error) {
    console.error('Failed to initialize pie chart:', error)
  }
}

// Lifecycle hooks
onMounted(() => {
  console.log('PieChart component mounted')
  nextTick(() => {
    console.log('PieChart nextTick, initializing chart')
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

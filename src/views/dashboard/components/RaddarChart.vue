<template>
  <div ref="chartRef" :class="className" :style="{height:height,width:width}" />
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import * as echarts from 'echarts'
import 'echarts/theme/macarons' // echarts theme
import { useResize } from './mixins/resize'

const animationDuration = 3000

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
    
    console.log('Initializing radar chart with element:', chartRef.value)
    
    // Try to initialize with theme first
    try {
      chart.value = echarts.init(chartRef.value, 'macarons')
    } catch (e) {
      console.warn('Failed to initialize chart with theme, falling back to default:', e)
      chart.value = echarts.init(chartRef.value)
    }
    
    if (!chart.value) {
      console.error('Failed to initialize radar chart, echarts.init returned null or undefined')
      return
    }

    const options = {
      tooltip: {
        trigger: 'item'
      },
      radar: {
        radius: '66%',
        center: ['50%', '42%'],
        splitNumber: 8,
        splitArea: {
          areaStyle: {
            color: 'rgba(127,95,132,.3)',
            opacity: 1,
            shadowBlur: 45,
            shadowColor: 'rgba(0,0,0,.5)',
            shadowOffsetX: 0,
            shadowOffsetY: 15
          }
        },
        indicator: [
          { name: 'Sales', max: 10000 },
          { name: 'Administration', max: 20000 },
          { name: 'Information Technology', max: 20000 },
          { name: 'Customer Support', max: 20000 },
          { name: 'Development', max: 20000 },
          { name: 'Marketing', max: 20000 }
        ]
      },
      legend: {
        left: 'center',
        bottom: '10',
        data: ['Allocated Budget', 'Expected Spending', 'Actual Spending']
      },
      series: [{
        name: 'Budget vs Spending',
        type: 'radar',
        symbolSize: 0,
        areaStyle: {
          shadowBlur: 13,
          shadowColor: 'rgba(0,0,0,.2)',
          shadowOffsetX: 0,
          shadowOffsetY: 10,
          opacity: 1
        },
        data: [
          {
            value: [5000, 7000, 12000, 11000, 15000, 14000],
            name: 'Allocated Budget'
          },
          {
            value: [4000, 9000, 15000, 15000, 13000, 11000],
            name: 'Expected Spending'
          },
          {
            value: [5500, 11000, 12000, 15000, 12000, 12000],
            name: 'Actual Spending'
          }
        ],
        animationDuration: 2800
      }]
    }
    
    console.log('Setting radar chart options:', options)
    chart.value.setOption(options)
    console.log('Radar chart options set successfully')
  } catch (error) {
    console.error('Failed to initialize radar chart:', error)
  }
}

// Lifecycle hooks
onMounted(() => {
  console.log('RaddarChart component mounted')
  nextTick(() => {
    console.log('RaddarChart nextTick, initializing chart')
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

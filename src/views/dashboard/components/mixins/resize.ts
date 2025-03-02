import { ref, onMounted, onBeforeUnmount, onActivated, onDeactivated } from 'vue'
import { debounce } from '@/utils'
import type { Ref } from 'vue'
import type { ECharts } from 'echarts'

export function useResize(chart: Ref<ECharts | null>) {
  const sidebarElm = ref<HTMLElement | null>(null)
  
  // Create a debounced resize handler
  const resizeHandler = debounce(() => {
    if (chart.value) {
      chart.value.resize()
    }
  }, 100)

  // Event handlers
  const initResizeEvent = () => {
    window.addEventListener('resize', resizeHandler)
  }

  const destroyResizeEvent = () => {
    window.removeEventListener('resize', resizeHandler)
  }

  const sidebarResizeHandler = (e: TransitionEvent) => {
    if (e.propertyName === 'width') {
      resizeHandler()
    }
  }

  const initSidebarResizeEvent = () => {
    sidebarElm.value = document.getElementsByClassName('sidebar-container')[0] as HTMLElement
    sidebarElm.value && sidebarElm.value.addEventListener('transitionend', sidebarResizeHandler as EventListener)
  }

  const destroySidebarResizeEvent = () => {
    sidebarElm.value && sidebarElm.value.removeEventListener('transitionend', sidebarResizeHandler as EventListener)
  }

  // Lifecycle hooks
  onMounted(() => {
    initResizeEvent()
    initSidebarResizeEvent()
  })

  onBeforeUnmount(() => {
    destroyResizeEvent()
    destroySidebarResizeEvent()
  })

  // To fix bug when cached by keep-alive
  onActivated(() => {
    initResizeEvent()
    initSidebarResizeEvent()
  })

  onDeactivated(() => {
    destroyResizeEvent()
    destroySidebarResizeEvent()
  })

  return {
    resizeHandler,
    initResizeEvent,
    destroyResizeEvent,
    initSidebarResizeEvent,
    destroySidebarResizeEvent
  }
}

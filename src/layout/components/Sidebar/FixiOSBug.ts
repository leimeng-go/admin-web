import { ref, onMounted, computed } from 'vue'
import { useAppStore } from '@/stores/app'

export default function useFixiOSBug() {
  const appStore = useAppStore()
  const device = computed(() => appStore.device)
  const subMenu = ref<any>(null)

  const fixBugIniOS = () => {
    const $subMenu = subMenu.value
    if ($subMenu) {
      const handleMouseleave = $subMenu.handleMouseleave
      $subMenu.handleMouseleave = (e: MouseEvent) => {
        if (device.value === 'mobile') {
          return
        }
        handleMouseleave(e)
      }
    }
  }

  onMounted(() => {
    // In order to fix the click on menu on the ios device will trigger the mouseleave bug
    // https://github.com/PanJiaChen/vue-element-admin/issues/1135
    fixBugIniOS()
  })

  return {
    subMenu
  }
} 
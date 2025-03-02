<template>
  <el-color-picker
    v-model="theme"
    :predefine="predefineColors"
    class="theme-picker"
    popper-class="theme-picker-dropdown"
    @change="themeChange"
  />
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'

// Element-Plus default theme color
const ORIGINAL_THEME = '#409EFF'

// Theme colors
const predefineColors = [
  '#409EFF', // Default blue
  '#1890ff', // Primary blue
  '#304156', // Dark blue
  '#212121', // Black
  '#11a983', // Green
  '#13c2c2', // Cyan
  '#6959CD', // Purple
  '#f5222d'  // Red
]

const settingsStore = useSettingsStore()
const theme = ref(settingsStore.theme || ORIGINAL_THEME)

// Watch for theme changes
watch(
  () => theme.value,
  (val) => {
    updateTheme(val)
  }
)

// Change theme color
const themeChange = (val: string) => {
  settingsStore.changeSetting('theme', val)
  updateTheme(val)
}

// Update theme color in the DOM
const updateTheme = (val: string) => {
  const style = document.documentElement.style
  
  // Update CSS variables for Element Plus
  style.setProperty('--el-color-primary', val)
  
  // Generate different shades of the primary color
  for (let i = 1; i <= 9; i++) {
    style.setProperty(
      `--el-color-primary-light-${i}`,
      lighten(val, i * 0.1)
    )
  }
  
  // Set darker shade for hover state
  style.setProperty('--el-color-primary-dark-2', darken(val, 0.1))
}

// Helper function to lighten a color
const lighten = (color: string, amount: number): string => {
  const rgb = hexToRgb(color)
  if (!rgb) return color
  
  for (let i = 0; i < 3; i++) {
    rgb[i] = Math.round(rgb[i] + (255 - rgb[i]) * amount)
  }
  
  return rgbToHex(rgb)
}

// Helper function to darken a color
const darken = (color: string, amount: number): string => {
  const rgb = hexToRgb(color)
  if (!rgb) return color
  
  for (let i = 0; i < 3; i++) {
    rgb[i] = Math.round(rgb[i] * (1 - amount))
  }
  
  return rgbToHex(rgb)
}

// Convert hex color to RGB array
const hexToRgb = (hex: string): number[] | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
      ]
    : null
}

// Convert RGB array to hex color
const rgbToHex = (rgb: number[]): string => {
  return '#' + rgb.map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')
}

// Initialize theme on component mount
onMounted(() => {
  if (theme.value !== ORIGINAL_THEME) {
    updateTheme(theme.value)
  }
})
</script>

<style lang="scss" scoped>
.theme-picker {
  float: right;
  height: 26px;
  margin-right: 8px;
  
  .el-color-picker__trigger {
    height: 26px !important;
    width: 26px !important;
    padding: 2px;
  }
  
  .el-color-picker__color {
    border-radius: 2px !important;
  }
}

.theme-picker-dropdown .el-color-dropdown__link-btn {
  display: none;
}
</style> 
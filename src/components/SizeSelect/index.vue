<template>
  <el-dropdown trigger="click" @command="handleClick">
    <div>
      <svg-icon class-name="size-icon" icon-class="size" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-for="item in sizeOptions" :key="item.value" :disabled="size === item.value" :command="item.value">
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'
import { ElMessage } from 'element-plus'

const appStore = useAppStore()
const size = computed(() => appStore.size)

const sizeOptions = [
  { label: 'Default', value: 'default' },
  { label: 'Medium', value: 'medium' },
  { label: 'Small', value: 'small' },
  { label: 'Mini', value: 'mini' }
]

const handleClick = (size: string) => {
  if (appStore.size === size) {
    return
  }
  appStore.setSize(size)
  refreshView()
  ElMessage({
    message: 'Switch Size Success',
    type: 'success'
  })
}

const refreshView = () => {
  // Force refresh the view
  const { href } = window.location
  window.location.href = href
}
</script>

<style lang="scss" scoped>
.size-icon {
  font-size: 18px;
  vertical-align: middle;
}
</style> 
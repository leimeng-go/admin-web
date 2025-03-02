<template>
  <el-scrollbar
    ref="scrollContainer"
    :vertical="false"
    class="scroll-container"
    @wheel.prevent="handleScroll"
  >
    <slot />
  </el-scrollbar>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const scrollContainer = ref<HTMLElement | null>(null)
const emits = defineEmits(['scroll'])

const handleScroll = (e: WheelEvent) => {
  const eventDelta = e.deltaY || -e.wheelDelta
  const $scrollWrapper = scrollContainer.value?.wrap
  
  if ($scrollWrapper) {
    $scrollWrapper.scrollLeft += eventDelta / 4
  }
  emits('scroll')
}

const moveToTarget = (currentTag: HTMLElement) => {
  const $container = scrollContainer.value
  const $containerWidth = $container?.$el.offsetWidth || 0
  const $scrollWrapper = scrollContainer.value?.wrap

  if (!$scrollWrapper) return
  
  let firstTag = null
  let lastTag = null

  // find first and last tag element
  const tagList = $container?.$el.querySelectorAll('.tags-view-item')
  
  if (tagList && tagList.length > 0) {
    firstTag = tagList[0]
    lastTag = tagList[tagList.length - 1]
  }

  if (!firstTag || !lastTag) return

  // determine if scroll position needs adjustment
  const beforeTagOffsetLeft = (currentTag.offsetLeft || 0)
  const afterTagOffsetLeft = currentTag.offsetLeft + currentTag.offsetWidth

  if (beforeTagOffsetLeft < $scrollWrapper.scrollLeft) {
    // tag is to the left of the visible area
    $scrollWrapper.scrollLeft = beforeTagOffsetLeft - 10
  } else if (afterTagOffsetLeft > $scrollWrapper.scrollLeft + $containerWidth) {
    // tag is to the right of the visible area
    $scrollWrapper.scrollLeft = afterTagOffsetLeft - $containerWidth + 10
  }
}

// Expose the moveToTarget method to parent component
defineExpose({
  moveToTarget
})
</script>

<style lang="scss" scoped>
.scroll-container {
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: 100%;
  
  :deep(.el-scrollbar__bar) {
    bottom: 0px;
  }
  
  :deep(.el-scrollbar__wrap) {
    height: 49px;
  }
}
</style>

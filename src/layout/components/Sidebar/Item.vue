<template>
  <div>
    <i v-if="icon && icon.includes('el-icon')" :class="[icon, 'sub-el-icon']" />
    <svg-icon v-else-if="icon" :icon-class="icon" />
    <span v-if="title">{{ title }}</span>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  icon: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
</style>

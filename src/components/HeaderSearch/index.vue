<template>
  <div :class="{'show': show}" class="header-search">
    <svg-icon class-name="search-icon" icon-class="search" @click.stop="onShowClick" />
    <el-select
      ref="headerSearchSelectRef"
      v-model="search"
      :remote-method="querySearch"
      filterable
      default-first-option
      remote
      placeholder="Search"
      class="header-search-select"
      @change="change"
    >
      <el-option v-for="item in options" :key="item.path" :value="item" :label="item.title.join(' > ')" />
    </el-select>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import Fuse from 'fuse.js'

const show = ref(false)
const router = useRouter()
const search = ref('')
const options = ref<any[]>([])
const searchPool = ref<any[]>([])
const headerSearchSelectRef = ref<any>(null)
const fuse = ref<any>(null)

const onShowClick = () => {
  show.value = !show.value
  if (show.value) {
    nextTick(() => {
      headerSearchSelectRef.value?.focus()
    })
  }
}

const routes = computed(() => {
  return router.getRoutes()
    .filter(route => route.meta && route.meta.title)
    .map(route => {
      const data: any = {
        path: route.path,
        title: route.meta.title instanceof Array ? route.meta.title : [route.meta.title]
      }
      if (route.redirect !== 'noRedirect') {
        data.redirect = route.redirect
      }
      return data
    })
})

const initFuse = (list: any[]) => {
  fuse.value = new Fuse(list, {
    shouldSort: true,
    threshold: 0.4,
    location: 0,
    distance: 100,
    minMatchCharLength: 1,
    keys: [{
      name: 'title',
      weight: 0.7
    }, {
      name: 'path',
      weight: 0.3
    }]
  })
}

const initSearchPool = () => {
  searchPool.value = routes.value
}

const querySearch = (query: string) => {
  if (fuse.value && searchPool.value) {
    options.value = query ? fuse.value.search(query).map((result: any) => result.item) : []
  }
}

const change = (val: any) => {
  router.push(val.path)
  search.value = ''
  options.value = []
  show.value = false
}

const close = () => {
  show.value = false
  options.value = []
}

// Initialize
initSearchPool()
initFuse(searchPool.value)

// Add event listener for ESC key
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    close()
  }
}

// Add click outside to close
const handleClickOutside = (e: MouseEvent) => {
  const headerSearch = document.querySelector('.header-search')
  if (headerSearch && !headerSearch.contains(e.target as Node)) {
    close()
  }
}

watch(show, (val) => {
  if (val) {
    document.body.addEventListener('click', handleClickOutside)
    window.addEventListener('keydown', handleKeyDown)
  } else {
    document.body.removeEventListener('click', handleClickOutside)
    window.removeEventListener('keydown', handleKeyDown)
  }
})
</script>

<style lang="scss" scoped>
.header-search {
  font-size: 0 !important;

  .search-icon {
    cursor: pointer;
    font-size: 18px;
    vertical-align: middle;
  }

  .header-search-select {
    font-size: 18px;
    transition: width 0.2s;
    width: 0;
    overflow: hidden;
    background: transparent;
    border-radius: 0;
    display: inline-block;
    vertical-align: middle;

    :deep(.el-input__inner) {
      border-radius: 0;
      border: 0;
      padding-left: 0;
      padding-right: 0;
      box-shadow: none !important;
      border-bottom: 1px solid #d9d9d9;
      vertical-align: middle;
    }
  }

  &.show {
    .header-search-select {
      width: 210px;
      margin-left: 10px;
    }
  }
}
</style> 
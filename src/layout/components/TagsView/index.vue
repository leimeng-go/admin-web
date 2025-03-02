<template>
  <div id="tags-view-container" class="tags-view-container">
    <scroll-pane ref="scrollPane" class="tags-view-wrapper" @scroll="handleScroll">
      <router-link
        v-for="tag in visitedViews"
        ref="tag"
        :key="tag.path"
        :class="isActive(tag)?'active':''"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        custom
        v-slot="{ navigate }"
      >
        <span
          class="tags-view-item"
          @click="navigate"
          @click.middle="!isAffix(tag) ? closeSelectedTag(tag) : ''"
          @contextmenu.prevent="openMenu(tag, $event)"
        >
          {{ tag.title }}
          <span v-if="!isAffix(tag)" class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)" />
        </span>
      </router-link>
    </scroll-pane>
    <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
      <li @click="refreshSelectedTag(selectedTag)">Refresh</li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">Close</li>
      <li @click="closeOthersTags">Close Others</li>
      <li @click="closeAllTags(selectedTag)">Close All</li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, nextTick, watch, onMounted } from 'vue'
import { useRoute, useRouter, RouteLocationNormalizedLoaded } from 'vue-router'
import { useTagsViewStore } from '@/stores/tagsView'
import { usePermissionStore } from '@/stores/permission'
import ScrollPane from './ScrollPane.vue'

interface TagView {
  path: string
  name?: string
  title?: string
  fullPath?: string
  query?: Record<string, string>
  meta?: any
}

// Refs
const visible = ref(false)
const top = ref(0)
const left = ref(0)
const selectedTag = ref<TagView>({} as TagView)
const affixTags = ref<TagView[]>([])
const scrollPane = ref<InstanceType<typeof ScrollPane> | null>(null)
const tags = ref<HTMLElement[]>([])

// Stores and router
const tagsViewStore = useTagsViewStore()
const permissionStore = usePermissionStore()
const route = useRoute()
const router = useRouter()

// Computed
const visitedViews = computed(() => tagsViewStore.visitedViews)
const routes = computed(() => permissionStore.routes)

// Methods
const isActive = (tag: TagView): boolean => {
  return tag.path === route.path
}

const isAffix = (tag: TagView): boolean => {
  return tag.meta && tag.meta.affix
}

const filterAffixTags = (routes: any[], basePath = '/'): TagView[] => {
  let tags: TagView[] = []
  routes.forEach(route => {
    if (route.meta && route.meta.affix) {
      const tagPath = basePath.endsWith('/') 
        ? basePath + route.path 
        : basePath + '/' + route.path
      tags.push({
        fullPath: tagPath,
        path: tagPath,
        name: route.name,
        meta: { ...route.meta }
      })
    }
    if (route.children) {
      const tempTags = filterAffixTags(route.children, route.path)
      if (tempTags.length >= 1) {
        tags = [...tags, ...tempTags]
      }
    }
  })
  return tags
}

const initTags = (): void => {
  const affixTags = filterAffixTags(routes.value)
  for (const tag of affixTags) {
    if (tag.name) {
      tagsViewStore.addVisitedView(tag)
    }
  }
  affixTags.value = affixTags
}

const addTags = (): void => {
  const { name } = route
  if (name) {
    tagsViewStore.addView(route as unknown as TagView)
  }
}

const moveToCurrentTag = (): void => {
  nextTick(() => {
    for (const tag of tags.value) {
      if ((tag as any).to.path === route.path) {
        scrollPane.value?.moveToTarget(tag)
        // When query is different then update
        if ((tag as any).to.fullPath !== route.fullPath) {
          tagsViewStore.updateVisitedView(route as unknown as TagView)
        }
        break
      }
    }
  })
}

const refreshSelectedTag = (view: TagView): void => {
  tagsViewStore.delCachedView(view).then(() => {
    const { fullPath } = view
    nextTick(() => {
      router.replace({
        path: '/redirect' + fullPath
      })
    })
  })
}

const closeSelectedTag = (view: TagView): void => {
  tagsViewStore.delView(view).then(() => {
    if (isActive(view)) {
      toLastView(visitedViews.value, view)
    }
  })
}

const closeOthersTags = (): void => {
  router.push(selectedTag.value)
  tagsViewStore.delOthersViews(selectedTag.value).then(() => {
    moveToCurrentTag()
  })
}

const closeAllTags = (view: TagView): void => {
  tagsViewStore.delAllViews().then(() => {
    if (affixTags.value.some(tag => tag.path === view.path)) {
      return
    }
    toLastView(visitedViews.value, view)
  })
}

const toLastView = (visitedViews: TagView[], view: TagView): void => {
  const latestView = visitedViews.slice(-1)[0]
  if (latestView) {
    router.push(latestView.fullPath || latestView.path)
  } else {
    // Now the default is to redirect to the home page if there is no tags-view,
    // you can adjust it according to your needs.
    if (view.name === 'Dashboard') {
      // To reload home page
      router.replace({ path: '/redirect' + view.fullPath })
    } else {
      router.push('/')
    }
  }
}

const openMenu = (tag: TagView, e: MouseEvent): void => {
  const menuMinWidth = 105
  const offsetLeft = (e.currentTarget as HTMLElement).getBoundingClientRect().left
  const offsetWidth = (e.currentTarget as HTMLElement).offsetWidth
  const maxLeft = offsetWidth - menuMinWidth
  const left = e.clientX - offsetLeft + 15

  if (left > maxLeft) {
    left.value = maxLeft
  } else {
    left.value = left
  }

  top.value = e.clientY
  visible.value = true
  selectedTag.value = tag
}

const closeMenu = (): void => {
  visible.value = false
}

const handleScroll = (): void => {
  closeMenu()
}

// Watchers
watch(() => route, () => {
  addTags()
  moveToCurrentTag()
}, { deep: true })

watch(() => visible.value, (value) => {
  if (value) {
    document.body.addEventListener('click', closeMenu)
  } else {
    document.body.removeEventListener('click', closeMenu)
  }
})

// Lifecycle hooks
onMounted(() => {
  initTags()
  addTags()
})
</script>

<style lang="scss" scoped>
.tags-view-container {
  height: 34px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);
  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;
      &:first-of-type {
        margin-left: 15px;
      }
      &:last-of-type {
        margin-right: 15px;
      }
      &.active {
        background-color: #42b983;
        color: #fff;
        border-color: #42b983;
        &::before {
          content: '';
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>

<style lang="scss">
//reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      width: 16px;
      height: 16px;
      vertical-align: 2px;
      border-radius: 50%;
      text-align: center;
      transition: all .3s cubic-bezier(.645, .045, .355, 1);
      transform-origin: 100% 50%;
      &:before {
        transform: scale(.6);
        display: inline-block;
        vertical-align: -3px;
      }
      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}
</style>

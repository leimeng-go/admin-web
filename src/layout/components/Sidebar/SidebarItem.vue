<template>
  <div v-if="!item.hidden">
    <template v-if="hasOneShowingChild(item.children, item) && (!onlyOneChild.children || onlyOneChild.noShowingChildren) && !item.alwaysShow">
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown': !isNest}">
          <item :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)" :title="onlyOneChild.meta.title" />
        </el-menu-item>
      </app-link>
    </template>

    <el-sub-menu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
      <template #title>
        <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-sub-menu>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { RouteRecordRaw } from 'vue-router'
import { isExternal } from '@/utils'
import Item from './Item.vue'
import AppLink from './Link.vue'
import useFixiOSBug from './FixiOSBug'

interface RouteItem {
  path: string
  children?: RouteItem[]
  hidden?: boolean
  alwaysShow?: boolean
  meta?: {
    title: string
    icon?: string
    [key: string]: any
  }
  [key: string]: any
}

interface OnlyChild extends RouteItem {
  noShowingChildren?: boolean
}

const props = defineProps({
  // route object
  item: {
    type: Object as () => RouteItem,
    required: true
  },
  isNest: {
    type: Boolean,
    default: false
  },
  basePath: {
    type: String,
    default: ''
  }
})

// To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
// TODO: refactor with render function
const onlyOneChild = ref<OnlyChild | null>(null)

const { subMenu } = useFixiOSBug()

const hasOneShowingChild = (children: RouteItem[] = [], parent: RouteItem): boolean => {
  const showingChildren = children.filter(item => {
    if (item.hidden) {
      return false
    } else {
      // Temp set(will be used if only has one showing child)
      onlyOneChild.value = item
      return true
    }
  })

  // When there is only one child router, the child router is displayed by default
  if (showingChildren.length === 1) {
    return true
  }

  // Show parent if there are no child router to display
  if (showingChildren.length === 0) {
    onlyOneChild.value = { ...parent, path: '', noShowingChildren: true }
    return true
  }

  return false
}

const resolvePath = (routePath: string): string => {
  if (isExternal(routePath)) {
    return routePath
  }
  if (isExternal(props.basePath)) {
    return props.basePath
  }
  // Simple path join without using path-browserify
  return props.basePath.endsWith('/') 
    ? props.basePath + routePath 
    : props.basePath + '/' + routePath
}
</script>

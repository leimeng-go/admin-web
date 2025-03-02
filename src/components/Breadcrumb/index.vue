<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
        <span v-if="item.redirect === 'noRedirect' || index === levelList.length - 1" class="no-redirect">
          {{ item.meta.title }}
        </span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script lang="ts" setup>
import { ref, watch, onBeforeMount } from 'vue'
import { useRoute, useRouter, RouteLocationNormalizedLoaded } from 'vue-router'

// Initialize router and route
const router = useRouter()
const route = useRoute()

// State
interface IBreadcrumb {
  path: string
  redirect?: string
  meta: {
    title: string
  }
}

const levelList = ref<IBreadcrumb[]>([])

// Methods
const getBreadcrumb = () => {
  // Only show routes with meta.title
  let matched = route.matched.filter(item => item.meta && item.meta.title)
  const first = matched[0]

  // If the first route is not the dashboard, push dashboard to the beginning
  if (first && first.path !== '/dashboard') {
    matched = [
      {
        path: '/dashboard',
        meta: { title: 'Dashboard' }
      } as RouteLocationNormalizedLoaded
    ].concat(matched)
  }

  levelList.value = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)
}

const isDashboard = (route: RouteLocationNormalizedLoaded) => {
  const name = route && route.name
  if (!name) return false
  return name.toString().trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase()
}

const pathCompile = (path: string) => {
  // To handle parameter paths like /user/:id
  const { params } = route
  const toPath = (pathString: string, pathParams: Record<string, string>) => {
    for (const key in pathParams) {
      const regex = new RegExp(`/:${key}`, 'g')
      if (regex.test(pathString)) {
        pathString = pathString.replace(regex, `/${pathParams[key]}`)
      }
    }
    return pathString
  }
  return toPath(path, params as Record<string, string>)
}

const handleLink = (item: IBreadcrumb) => {
  const { redirect, path } = item
  if (redirect) {
    router.push(redirect)
    return
  }
  router.push(pathCompile(path))
}

// Lifecycle hooks
onBeforeMount(() => {
  getBreadcrumb()
})

// Watch for route changes
watch(
  () => route.path,
  () => {
    getBreadcrumb()
  }
)
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}

.breadcrumb-enter-active,
.breadcrumb-leave-active {
  transition: all .5s;
}

.breadcrumb-enter-from,
.breadcrumb-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.breadcrumb-leave-active {
  position: absolute;
}
</style> 
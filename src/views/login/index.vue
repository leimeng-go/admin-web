<template>
    <div class="min-h-screen w-full bg-login-bg flex items-center justify-center">
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="w-[520px] max-w-full mx-auto px-8 pt-40"
        autocomplete="on"
        label-position="left"
      > 
        <div class="mb-10 text-center">
          <h3 class="text-2xl font-bold text-gray-100">Login Form</h3>
        </div>
  
        <el-form-item prop="username">
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-[#889aa4]">
              <svg-icon icon-class="user" />
            </span>
            <el-input
              ref="usernameRef"
              v-model="loginForm.username"
              placeholder="Username"
              name="username"
              type="text"
              tabindex="1"
              class="h-12 bg-black/10"
              autocomplete="on"
            />
          </div>
        </el-form-item>
  
        <el-tooltip
          v-model:visible="capsTooltip"
          content="Caps lock is On"
          placement="right"
          manual
        >
          <el-form-item prop="password">
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-[#889aa4]">
                <svg-icon icon-class="password" />
              </span>
              <el-input
                ref="passwordRef"
                v-model="loginForm.password"
                :type="passwordType"
                placeholder="Password"
                name="password"
                tabindex="2"
                class="h-12 bg-black/10"
                autocomplete="on"
                @keyup="checkCapslock"
                @blur="capsTooltip = false"
                @keyup.enter="handleLogin"
              />
              <span 
                class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#889aa4]"
                @click="showPwd"
              >
                <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
              </span>
            </div>
          </el-form-item>
        </el-tooltip>
  
        <el-button 
          :loading="loading" 
          type="primary" 
          class="w-full mb-8"
          @click.prevent="handleLogin"
        >
          Login
        </el-button>
  
        <div class="relative">
          <div class="text-sm text-white space-y-2">
            <div>
              <span>Username : admin</span>
              <span class="ml-4">Password : any</span>
            </div>
            <div>
              <span>Username : editor</span>
              <span class="ml-4">Password : any</span>
            </div>
          </div>
  
          <el-button
            class="absolute right-0 bottom-0 md:block hidden"
            type="primary"
            @click="showDialog = true"
          >
            Or connect with
          </el-button>
        </div>
      </el-form>
  
      <el-dialog
        v-model="showDialog"
        title="Or connect with"
        width="480px"
      >
        <div class="text-center">
          <p class="mb-8">
            Can not be simulated on local, so please combine you own business simulation! ! !
          </p>
          <social-sign />
        </div>
      </el-dialog>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive, watch, onMounted, onUnmounted, nextTick } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import type { FormInstance, FormRules } from 'element-plus'
  import type { LocationQuery } from 'vue-router'
  import { useUserStore } from '@/stores/user'
  import { validUsername } from '@/utils/validate'
//   import SocialSign from './components/SocialSignin.vue'

  defineOptions({
    name: 'Login'
  })
  
  interface LoginForm {
    username: string
    password: string
  }
  
  const route = useRoute()
  const router = useRouter()
  const userStore = useUserStore()
  
  // refs
  const loginFormRef = ref<FormInstance>()
  const usernameRef = ref<HTMLInputElement>()
  const passwordRef = ref<HTMLInputElement>()
  
  // reactive state
  const loginForm = reactive<LoginForm>({
    username: 'admin',
    password: '111111'
  })
  
  const loginRules: FormRules = {
    username: [{
      required: true,
      trigger: 'blur',
      validator: (_: unknown, value: string, callback: (error?: Error) => void) => {
        if (!validUsername(value)) {
          callback(new Error('Please enter the correct user name'))
        } else {
          callback()
        }
      }
    }],
    password: [{
      required: true,
      trigger: 'blur',
      validator: (_, value, callback) => {
        if (value.length < 6) {
          callback(new Error('The password can not be less than 6 digits'))
        } else {
          callback()
        }
      }
    }]
  }
  
  // state
  const passwordType = ref('password')
  const capsTooltip = ref(false)
  const loading = ref(false)
  const showDialog = ref(false)
  const redirect = ref<string>()
  const otherQuery = ref<LocationQuery>({})
  
  // watch route
  watch(
    () => route.query,
    (query) => {
      if (query) {
        redirect.value = query.redirect as string
        otherQuery.value = getOtherQuery(query)
      }
    },
    { immediate: true }
  )
  
  // methods
  function checkCapslock(e: KeyboardEvent) {
    const { key } = e
    capsTooltip.value = Boolean(key && key.length === 1 && (key >= 'A' && key <= 'Z'))
  }
  
  function showPwd() {
    passwordType.value = passwordType.value === 'password' ? '' : 'password'
    nextTick(() => {
      passwordRef.value?.focus()
    })
  }
  
  async function handleLogin() {
    if (!loginFormRef.value) return
    
    try {
      await loginFormRef.value.validate()
      loading.value = true
      
      await userStore.login(loginForm)
      router.push({
        path: redirect.value || '/',
        query: otherQuery.value
      })
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      loading.value = false
    }
  }
  
  function getOtherQuery(query: LocationQuery) {
    return Object.keys(query).reduce((acc, cur) => {
      if (cur !== 'redirect') {
        acc[cur] = query[cur]
      }
      return acc
    }, {} as LocationQuery)
  }
  
  // lifecycle
  onMounted(() => {
    if (loginForm.username === '') {
      usernameRef.value?.focus()
    } else if (loginForm.password === '') {
      passwordRef.value?.focus()
    }
  })
  </script>
  
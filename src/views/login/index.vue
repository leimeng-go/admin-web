<template>
    <div class="login-container min-h-screen w-full bg-login-bg flex items-center justify-center">
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="w-[520px] max-w-full mx-auto p-8 [&_.el-form-item__error]:text-[#ff4949]"
        autocomplete="on"
        label-position="left"
      > 
        <div class="mb-10 text-center">
          <h3 class="text-2xl font-bold text-white">系统登录</h3>
        </div>
  
        <el-form-item prop="username" class="w-full [&_.el-form-item__content]:w-full">
          <div class="relative w-full [&_.el-input__wrapper]:bg-transparent [&_.el-input__wrapper]:shadow-none [&_.el-input__wrapper]:border-0 [&_.el-input__wrapper]:p-0">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-light-gray z-10">
              <svg-icon icon-class="user" class="text-xl" />
            </span>
            <el-input
              ref="usernameRef"
              v-model="loginForm.username"
              placeholder="Username"
              name="username"
              type="text"
              tabindex="1"
              class="w-full h-[47px] [&_.el-input__inner]:text-white [&_.el-input__inner]:pl-9 [&_.el-input__inner]:h-[47px] [&_.el-input__inner]:leading-[47px] [&_.el-input__inner]:bg-black/10 [&_.el-input__inner]:rounded-md [&_.el-input__inner]:w-full [&_.el-input__inner::placeholder]:text-light-gray"
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
          <el-form-item prop="password" class="w-full [&_.el-form-item__content]:w-full">
            <div class="relative w-full [&_.el-input__wrapper]:bg-transparent [&_.el-input__wrapper]:shadow-none [&_.el-input__wrapper]:border-0 [&_.el-input__wrapper]:p-0">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-light-gray">
                <svg-icon icon-class="password" />
              </span>
              <el-input
                ref="passwordRef"
                v-model="loginForm.password"
                :type="passwordType"
                placeholder="Password"
                name="password"
                tabindex="2"
                class="w-full h-[47px] [&_.el-input__inner]:text-white [&_.el-input__inner]:pl-9 [&_.el-input__inner]:h-[47px] [&_.el-input__inner]:leading-[47px] [&_.el-input__inner]:bg-black/10 [&_.el-input__inner]:rounded-md [&_.el-input__inner]:w-full [&_.el-input__inner::placeholder]:text-light-gray"
                autocomplete="on"
                @keyup="checkCapslock"
                @blur="capsTooltip = false"
                @keyup.enter="handleLogin"
              />
              <span 
                class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-light-gray"
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
          class="w-full mb-8 bg-[#1890ff] border-[#1890ff] hover:bg-[#40a9ff] hover:border-[#40a9ff]"
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
  
  <style scoped>
  .login-container {
    :deep(.el-input__wrapper) {
      background-color: transparent;
      box-shadow: none;
      border: none;
      padding: 0;
    }

    :deep(.el-input__inner) {
      color: #fff;
      padding-left: 35px;
      height: 47px;
      line-height: 47px;
      background-color: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      width: 100%;
    }

    :deep(.el-input) {
      --el-input-bg-color: transparent;
      background-color: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      height: 47px;
    }

    :deep(.el-input__inner::placeholder) {
      color: #889aa4;
    }

    :deep(.el-form-item__error) {
      color: #ff4949;
    }

    :deep(.el-button--primary) {
      background-color: #1890ff;
      border-color: #1890ff;

      &:hover {
        background-color: #40a9ff;
        border-color: #40a9ff;
      }
    }
  }
  </style>
  
<template>
  <div class="login-container">
    <!-- autocomplete 自动填充,label-position 标签位置 -->
    <el-form
      ref="loginFormRef"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">Login Form</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="usernameRef"
          v-model="loginForm.username"
          placeholder="Username"
          name="username"
          type="text" 
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-tooltip
        v-model:visible="capsTooltip"
        content="Caps lock is On"
        placement="right"
        manual
      >
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <!-- 组件的唯一标识，当组件的key发生变化时，组件会被重新渲染 -->
           <!-- :type="passwordType" 动态设置密码框的类型，值来自passwordType -->
            <!-- @keyup="checkCapslock" 监听键盘按下事件,检查是否按下了大写锁定键 -->
            <!-- @blur="capsTooltip = false" 失去焦点时，关闭capsTooltip -->
            <!-- @keyup.enter="handleLogin" 监听回车键按下事件,调用handleLogin方法 ,用户输入密码后按回车键登录  -->
          <el-input
            ref="passwordRef"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="Password"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>

      <el-button
        :loading="loading"
        type="primary"
        style="width:100%;margin-bottom:30px;"
        @click.prevent="handleLogin"
      >
        Login
      </el-button>

      <!-- <div style="position:relative">
        <div class="tips">
          <span>Username : admin</span>
          <span>Password : any</span>
        </div>
        <div class="tips">
          <span style="margin-right:18px;">Username : editor</span>
          <span>Password : any</span>
        </div>

        <el-button
          class="thirdparty-button"
          type="primary"
          @click="showDialog = true"
        >
          Or connect with
        </el-button>
      </div> -->
    </el-form>

    <!-- <el-dialog
      v-model="showDialog"
      title="Or connect with"
    >
      Can not be simulated on local, so please combine you own business simulation! ! !
      <br>
      <br>
      <br>
      <social-sign />
    </el-dialog> -->
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { validUsername } from '@/utils'
import type { FormInstance, FormRules } from 'element-plus'
// import SocialSign from './components/SocialSignin.vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const loginFormRef = ref<FormInstance>()
const usernameRef = ref<HTMLInputElement>()
const passwordRef = ref<HTMLInputElement>()

const loginForm = reactive({
  username: 'admin',
  password: '111111'
})

const validateUsername = (rule: any, value: string, callback: any) => {
  if (!validUsername(value)) {
    callback(new Error('请输入正确的用户名'))
  } else {
    callback()
  }
}

const validatePassword = (rule: any, value: string, callback: any) => {
  if (value.length < 6) {
    callback(new Error('密码不能小于6位'))
  } else {
    callback()
  }
}

const loginRules = reactive<FormRules>({
  username: [{ required: true, trigger: 'blur', validator: validateUsername }],
  password: [{ required: true, trigger: 'blur', validator: validatePassword }]
})

const passwordType = ref('password')
const capsTooltip = ref(false)
const loading = ref(false)
const showDialog = ref(false)
const redirect = ref<string>()
const otherQuery = ref({})

const checkCapslock = (e: KeyboardEvent) => {
  const { key } = e
  capsTooltip.value = Boolean(key && key.length === 1 && (key >= 'A' && key <= 'Z'))
}

const showPwd = () => {
  passwordType.value = passwordType.value === 'password' ? '' : 'password'
  nextTick(() => {
    passwordRef.value?.focus()
  })
}

const handleLogin = () => {
  loginFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true
      try {
        await userStore.login(loginForm)
        router.push({ path: redirect.value || '/', query: otherQuery.value })
      } catch (error) {
        console.error(error)
      } finally {
        loading.value = false
      }
    }
  })
}

const getOtherQuery = (query: Record<string, string>) => {
  return Object.keys(query).reduce((acc, cur) => {
    if (cur !== 'redirect') {
      acc[cur] = query[cur]
    }
    return acc
  }, {} as Record<string, string>)
}

onMounted(() => {
  if (loginForm.username === '') {
    usernameRef.value?.focus()
  } else if (loginForm.password === '') {
    passwordRef.value?.focus()
  }
})

// 监听路由
watch(() => route.query, (query: Record<string, any>) => {
  if (query) {
    redirect.value = query.redirect as string
    otherQuery.value = getOtherQuery(query as Record<string, string>)
  }
}, { immediate: true })
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;  // 控制整体宽度

    .el-input__wrapper {
      width: 100% !important;  // 强制占满父元素宽度
      background: transparent;
      box-shadow: none;
      border: 0;
    }

    input {
      background: transparent;
      border: 0;
      appearance: none;
      border-radius: 0;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    } 
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }

  :deep(.el-input) {
    .el-input__wrapper {
      // 外层样式
    }
    
    .el-input__inner {
      // 内层样式
    }
  }
}
</style>

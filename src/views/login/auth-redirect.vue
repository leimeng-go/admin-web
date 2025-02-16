<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  const hash = window.location.search.slice(1)
  if (window.localStorage) {
    window.localStorage.setItem('x-admin-oauth-code', hash)
    window.close()
  }
})
</script>

<template>
  <div class="auth-redirect">
    <p class="text-center text-gray-600">
      Redirecting...
    </p>
  </div>
</template>
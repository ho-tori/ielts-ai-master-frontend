<template>
  <!-- 路由渲染出口 -->
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

onMounted(() => {
  // 应用初始化时恢复用户状态
  userStore.fetchProfile()
})
</script>
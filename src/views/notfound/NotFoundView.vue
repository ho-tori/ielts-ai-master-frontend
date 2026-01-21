<script setup lang="ts">
import { useRouter } from 'vue-router'
import { BaseButton } from '@/components'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
    <div class="text-center max-w-md px-6">
      <!-- 404 大图标 -->
      <div class="mb-6">
        <div class="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
          404
        </div>
      </div>

      <!-- 标题 -->
      <h1 class="text-3xl font-bold text-slate-900 mb-2">页面不存在</h1>
      
      <!-- 描述 -->
      <p class="text-slate-600 mb-8">
        抱歉，您访问的页面不存在或已被移除。请检查URL是否正确，或返回首页重新开始。
      </p>

      <!-- 操作按钮 -->
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <BaseButton
          variant="primary"
          size="md"
          @click="goHome"
        >
          返回首页
        </BaseButton>
        
        <BaseButton
          variant="secondary"
          size="md"
          @click="goBack"
        >
          返回上一页
        </BaseButton>
      </div>

      <!-- 装饰元素 -->
      <div class="mt-12 flex justify-center gap-2">
        <div class="w-2 h-2 rounded-full bg-indigo-300"></div>
        <div class="w-2 h-2 rounded-full bg-purple-300"></div>
        <div class="w-2 h-2 rounded-full bg-pink-300"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 可选：添加一些动画效果 */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>

<template>
  <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-50 shrink-0">
    <div class="flex items-center space-x-3">
      <div class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
        <Icon icon="heroicons:academic-cap-solid" class="text-white text-2xl" />
      </div>
      <div>
        <h1 class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">IELTS Master AI</h1>
        <p class="text-[10px] text-slate-400 font-medium tracking-widest uppercase">Intelligent Reading Assistant</p>
      </div>
    </div>

    <div class="flex items-center space-x-6">
      <div class="flex items-center bg-slate-100 rounded-full px-4 py-1.5 space-x-2">
        <Icon icon="heroicons:fire-solid" class="text-amber-500" />
        <span class="text-sm font-bold">12 Days</span>
      </div>
      <button class="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors" @click="goAccount" title="个人信息">
        <Icon icon="heroicons:cog-6-tooth" class="text-slate-600 text-xl" />
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'

const router = useRouter()

function goAccount() {
  router.push('/account')
}
</script>
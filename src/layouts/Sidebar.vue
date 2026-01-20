<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

// 定义导航菜单配置
const menuItems = [
  { name: 'Dashboard', path: '/', icon: 'heroicons:chart-bar' },
  { name: 'Reading', path: '/reading', icon: 'heroicons:book-open' },
  { name: 'Practice', path: '/practice', icon: 'heroicons:pencil-square' },
  { name: 'Lab', path: '/lab', icon: 'heroicons:beaker' },
];

function goAccount() {
  router.push('/account')
}
</script>

<template>
  <!-- 左侧侧边栏 - 快捷功能 -->
  <aside class="w-20 bg-white border-r border-slate-200 flex flex-col items-center py-8 shrink-0">
    
    <!-- 菜单项容器 -->
    <div class="space-y-8">
      <!-- 循环渲染菜单按钮 -->
      <router-link
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        class="p-3 rounded-2xl transition-all group relative block"
        :class="[
          route.path === item.path 
            ? 'bg-indigo-50 text-indigo-600 shadow-sm' 
            : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-50'
        ]"
      >
        <Icon :icon="item.icon" class="text-2xl" />
        
        <!-- 悬浮文字提示 (Tooltip) - 可选 -->
        <span class="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
          {{ item.name }}
        </span>
      </router-link>
    </div>

    <!-- 底部设置按钮 -->
    <div class="mt-auto">
      <button 
        @click="goAccount" 
        class="p-3 rounded-2xl transition-all"
        :class="[
          route.path === '/account'
            ? 'bg-red-50 text-red-500 shadow-sm'
            : 'text-slate-400 hover:text-red-500 hover:bg-red-50'
        ]"
        title="个人信息"
      >
        <Icon icon="heroicons:cog-6-tooth" class="text-2xl" />
      </button>
    </div>
  </aside>
</template>

<style scoped>
/* 如果有特殊的样式可以在这里写 */
</style>
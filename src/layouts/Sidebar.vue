<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import SidebarNavItem from './components/SidebarNavItem.vue';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

// 定义导航菜单配置
const menuItems = [
  { name: 'Dashboard', path: '/', icon: 'heroicons:chart-bar' },
  { name: 'Reading', path: '/reading', icon: 'heroicons:book-open' },
  { name: 'Practice', path: '/practice', icon: 'heroicons:pencil-square' },
  { name: 'Lab', path: '/lab', icon: 'heroicons:beaker' }
];

const visibleMenuItems = computed(() => {
  const items = [...menuItems]
  if (userStore.user?.username === 'admin') {
    items.push({ name: 'Admin', path: '/admin/upload', icon: 'heroicons:shield-check' })
  }
  return items
})

function goAccount() {
  router.push('/account')
}
</script>

<template>
  <!-- 左侧侧边栏 - 快捷功能 -->
  <aside class="w-20 bg-surface border-r border-border flex flex-col items-center py-8 shrink-0">
    
    <!-- 菜单项容器 -->
    <div class="space-y-8">
      <!-- 循环渲染菜单按钮 -->
      <SidebarNavItem
        v-for="item in visibleMenuItems"
        :key="item.path"
        :to="item.path"
        :icon="item.icon"
        :label="item.name"
        :active="route.path === item.path"
      />
    </div>

    <!-- 底部设置按钮 -->
    <div class="mt-auto">
      <SidebarNavItem 
        @click="goAccount" 
        icon="heroicons:cog-6-tooth"
        label="个人信息"
        :active="route.path === '/account'"
        :danger="true"
      />
    </div>
  </aside>
</template>

<style scoped>
/* 如果有特殊的样式可以在这里写 */
</style>
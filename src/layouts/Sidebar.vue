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
  { name: 'Wrong Answers', path: '/wrong-answers', icon: 'heroicons:exclamation-triangle' },
  { name: 'Vocabulary', path: '/vocabulary', icon: 'heroicons:bookmark' },
  { name: 'Training', path: '/training', icon: 'heroicons:bolt' }
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
  <aside class="hidden w-[88px] shrink-0 border-r border-border/60 bg-surface/90 px-4 py-5 backdrop-blur md:flex md:flex-col md:items-center">
    <div class="flex flex-col gap-2">
      <SidebarNavItem
        v-for="item in visibleMenuItems"
        :key="item.path"
        :to="item.path"
        :icon="item.icon"
        :label="item.name"
        :active="route.path === item.path"
      />
    </div>

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

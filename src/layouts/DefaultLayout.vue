<template>
  <div class="h-dvh overflow-hidden bg-surface-muted font-sans text-text-primary antialiased flex flex-col">
    <Header />
    <main class="flex-1 flex overflow-hidden">
      <Sidebar />
      <div :class="['flex-1 overflow-y-auto bg-transparent', isReadingRoute ? '' : 'px-4 py-5 sm:px-6 sm:py-6 lg:px-10']">
        <div :class="[isReadingRoute ? 'h-full min-h-0' : 'mx-auto h-full min-h-0 w-full max-w-7xl']">
          <router-view />
        </div>
      </div>
    </main>
    <nav
      v-if="!isReadingRoute"
      class="border-t border-border/70 bg-surface/95 px-2 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] backdrop-blur md:hidden"
      aria-label="主要导航"
    >
      <div class="grid grid-cols-5 gap-1">
        <router-link
          v-for="item in mobileMenuItems"
          :key="item.path"
          :to="item.path"
          class="flex min-h-12 flex-col items-center justify-center rounded-lg text-[11px] font-medium transition-colors"
          :class="route.path === item.path ? 'bg-primary text-white shadow-[0_8px_18px_rgb(var(--color-primary)_/_0.18)]' : 'text-text-secondary hover:bg-surface-muted hover:text-text-primary'"
        >
          <Icon :icon="item.icon" class="text-lg" />
          <span class="mt-0.5 truncate">{{ item.short }}</span>
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import Header from './Header.vue'
import Sidebar from './Sidebar.vue'

const route = useRoute()
const isReadingRoute = computed(() => route.path.startsWith('/reading'))
const mobileMenuItems = [
  { short: '首页', path: '/', icon: 'heroicons:chart-bar' },
  { short: '练习', path: '/practice', icon: 'heroicons:pencil-square' },
  { short: '错题', path: '/wrong-answers', icon: 'heroicons:exclamation-triangle' },
  { short: '生词', path: '/vocabulary', icon: 'heroicons:bookmark' },
  { short: '训练', path: '/training', icon: 'heroicons:bolt' }
]
</script>

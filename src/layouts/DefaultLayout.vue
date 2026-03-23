<template>
  <div class="bg-surface-muted text-text-primary font-sans antialiased h-screen overflow-hidden flex flex-col">
    <Header />
    <main class="flex-1 flex overflow-hidden">
      <Sidebar />
      <!-- 主内容区 -->
      <div :class="['flex-1 overflow-y-auto bg-surface-muted hide-scrollbar', isReadingRoute ? '' : 'p-6']">
            <div :class="[isReadingRoute ? 'h-full min-h-0' : 'max-w-7xl mx-auto h-full min-h-0']">
          <router-view /> <!-- 这里会渲染 ReadingView.vue -->
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Header from './Header.vue'
import Sidebar from './Sidebar.vue'

const route = useRoute()
const isReadingRoute = computed(() => route.path.startsWith('/reading'))
</script>
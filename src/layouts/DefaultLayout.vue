<template>
  <div class="bg-surface-muted text-text-primary font-sans antialiased h-screen overflow-hidden flex flex-col">
    <Header />
    <main class="flex-1 flex overflow-hidden">
      <Sidebar />
      <!-- 主内容区 -->
      <div class="flex-1 overflow-y-auto bg-surface-muted p-6 hide-scrollbar">
            <div class="max-w-7xl mx-auto space-y-8 h-full min-h-0">
          <router-view /> <!-- 这里会渲染 ReadingView.vue -->
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import Header from './Header.vue'
import Sidebar from './Sidebar.vue'
</script>
<template>
  <header class="h-16 bg-surface border-b border-border flex items-center justify-between px-8 z-50 shrink-0">
    <div class="flex items-center space-x-3">
      <div class="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
        <Icon icon="heroicons:academic-cap-solid" class="text-white text-2xl" />
      </div>
      <div>
        <h1 class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-hover">IELTS Master AI</h1>
        <p class="text-[10px] text-text-secondary/70 font-medium tracking-widest uppercase">Intelligent Reading Assistant</p>
      </div>
    </div>

    <div class="flex items-center space-x-6">
      <div class="flex items-center bg-surface-muted rounded-full px-4 py-1.5 space-x-2">
        <Icon icon="heroicons:fire-solid" class="text-success" />
        <span class="text-sm font-bold">{{ streakDays }} Days</span>
      </div>
      <BaseButton variant="secondary" size="sm" @click="toggleTheme">
        {{ themeLabel }}
      </BaseButton>
      <BaseButton variant="ghost" size="sm" @click="goAccount" title="个人信息">
        <Icon icon="heroicons:cog-6-tooth" class="text-text-secondary text-xl" />
      </BaseButton>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { BaseButton } from '@/components'
import { apiGetUserStats } from '@/api/stats'
import { useUserStore } from '@/stores/user'
import { useThemeStore } from '@/stores/theme'

const router = useRouter()
const userStore = useUserStore()
const themeStore = useThemeStore()
const streakDays = ref(0)

const themeLabel = computed(() => (themeStore.currentTheme === 'light' ? 'Ocean' : 'Light'))

const fetchStreakDays = async () => {
  if (!userStore.user) return
  try {
    const { data } = await apiGetUserStats()
    if (data.code === 0) {
      streakDays.value = data.data.totalArticlesRead || 0
    }
  } catch (e) {
    console.warn('获取连续学习天数失败', e)
  }
}

onMounted(() => {
  fetchStreakDays()
})

function goAccount() {
  router.push('/account')
}

function toggleTheme() {
  themeStore.toggleTheme()
}
</script>
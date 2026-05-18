<template>
  <header class="z-50 flex h-[68px] shrink-0 items-center justify-between border-b border-border/60 bg-surface/92 px-4 backdrop-blur sm:px-6 lg:px-10">
    <div class="flex items-center space-x-3 min-w-0">
      <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary shadow-[0_10px_22px_rgb(var(--color-primary)_/_0.2)]">
        <Icon icon="heroicons:academic-cap-solid" class="text-white text-2xl" />
      </div>
      <div class="min-w-0">
        <h1 class="truncate text-lg font-semibold text-text-primary sm:text-xl">IELTS Master AI</h1>
        <p class="hidden text-[11px] font-medium text-text-secondary sm:block">智能阅读与错题训练工作台</p>
      </div>
    </div>

    <div class="flex items-center space-x-2 sm:space-x-3">
      <div class="hidden min-h-11 items-center gap-2 rounded-lg border border-border/60 bg-surface-elevated px-3 shadow-[0_1px_2px_rgb(15_23_42_/_0.03)] sm:flex">
        <Icon icon="heroicons:book-open" class="text-primary" />
        <span class="text-sm font-semibold text-text-primary">已练 {{ streakDays }} 篇</span>
      </div>
      <BaseButton variant="secondary" size="sm" aria-label="切换主题" @click="toggleTheme">
        <Icon icon="heroicons:swatch" />
        {{ themeLabel }}
      </BaseButton>
      <BaseButton variant="ghost" size="sm" @click="goAccount" title="个人信息" aria-label="个人信息">
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

const themeLabel = computed(() => {
  if (themeStore.currentTheme === 'light') return 'Ocean'
  if (themeStore.currentTheme === 'ocean') return '黑白橙'
  if (themeStore.currentTheme === 'mono') return 'Claude'
  return 'Light'
})

const fetchStreakDays = async () => {
  if (!userStore.user) return
  try {
    const { data } = await apiGetUserStats()
    if (data.code === 0) {
      streakDays.value = data.data.totalArticlesPracticed || 0
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

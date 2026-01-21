<template>
  <div class="space-y-6">
    <!-- Welcome Banner -->
    <BaseCard>
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-slate-800">欢迎回来！</h2>
          <p class="text-slate-500 mt-1">继续你的雅思阅读之旅</p>
        </div>
        <div class="text-5xl">📚</div>
      </div>
    </BaseCard>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <BaseCard>
        <div class="text-center">
          <div class="text-3xl font-bold text-indigo-600">{{ totalArticles }}</div>
          <p class="text-slate-500 text-sm mt-2">已完成文章</p>
        </div>
      </BaseCard>
      <BaseCard>
        <div class="text-center">
          <div class="text-3xl font-bold text-emerald-600">{{ totalVocab }}</div>
          <p class="text-slate-500 text-sm mt-2">掌握词汇</p>
        </div>
      </BaseCard>
      <BaseCard>
        <div class="text-center">
          <div class="text-3xl font-bold text-amber-600">{{ streakDays }}</div>
          <p class="text-slate-500 text-sm mt-2">连续学习天数</p>
        </div>
      </BaseCard>
    </div>

    <!-- Recent Articles -->
    <BaseCard>
      <template #header>
        <h3 class="font-bold text-slate-800">最近练习</h3>
      </template>
      <div class="space-y-2">
        <router-link
          v-for="article in recentArticles"
          :key="String(article.id)"
          to="/reading"
          class="block p-3 rounded-lg hover:bg-slate-50 transition-colors border border-slate-100"
        >
          <p class="font-medium text-slate-800">{{ article.title }}</p>
          <p class="text-xs text-slate-500 mt-1">{{ article.category }}</p>
        </router-link>
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { mockArticles } from '@/data/article'
import { BaseCard } from '@/components'

const userStore = useUserStore()

// 计算已完成的文章数
const totalArticles = computed(() => {
  return userStore.user?.recentArticles?.length || 0
})

// 计算掌握的词汇（基于阅读过的文章中的单词）
const totalVocab = computed(() => {
  if (!userStore.user?.recentArticles) return 0
  return userStore.user.recentArticles.reduce((total, articleId) => {
    const article = mockArticles.find(a => a.id === articleId)
    return total + (article?.wordCount || 0)
  }, 0)
})

// 连续学习天数（示例值）
const streakDays = computed(() => {
  return userStore.user?.recentArticles?.length ? 7 : 0
})

// 最近阅读的文章列表
const recentArticles = computed(() => {
  if (!userStore.user?.recentArticles) return []
  return userStore.user.recentArticles
    .map(articleId => mockArticles.find(a => a.id === articleId))
    .filter(article => article !== undefined)
    .slice(0, 5) // 最多显示5个
})
</script>

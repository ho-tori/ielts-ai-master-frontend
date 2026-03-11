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
        <h3 class="font-bold text-slate-800">最近练习 <span class="text-xs text-slate-400 font-normal">（最近5条）</span></h3>
      </template>
      <div v-if="loading" class="flex justify-center py-4">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
      <div v-else-if="recentArticles.length === 0" class="text-center py-4 text-slate-500">
        暂无最近练习记录
      </div>
      <div v-else class="space-y-2">
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
import { ref, computed, onMounted, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import { getArticleDetail } from '@/api/article'
import { apiGetUserStats } from '@/api/stats'
import { BaseCard } from '@/components'
import type { Article } from '@/types/article'

const userStore = useUserStore()
const loading = ref(false)
const recentArticlesData = ref<Article[]>([])
const stats = ref({
  totalArticles: 0,
  totalVocabulary: 0,
  streakDays: 0
})

const totalArticles = computed(() => stats.value.totalArticles)
const totalVocab = computed(() => stats.value.totalVocabulary)
const streakDays = computed(() => stats.value.streakDays)

const recentArticles = computed(() => {
  return recentArticlesData.value.slice(0, 5)
})

const fetchStats = async () => {
  try {
    console.log('获取用户统计数据...')
    const { data } = await apiGetUserStats()
    console.log('统计数据返回:', data)
    if (data.code === 0) {
      stats.value = data.data
    }
  } catch (e) {
    console.error('获取统计数据失败', e)
  }
}

const fetchRecentArticles = async () => {
  const user = userStore.user
  if (!user?.recentArticles || user.recentArticles.length === 0) {
    recentArticlesData.value = []
    return
  }
  
  loading.value = true
  try {
    const articles = await Promise.all(
      user.recentArticles.map(async (articleId) => {
        try {
          const { data } = await getArticleDetail(String(articleId))
          if (data.code === 0) {
            return data.data
          }
          return null
        } catch {
          return null
        }
      })
    )
    recentArticlesData.value = articles.filter((item): item is Article => item !== null)
  } catch (e) {
    console.error('获取最近阅读列表失败', e)
    recentArticlesData.value = []
  } finally {
    loading.value = false
  }
}

watch(() => userStore.user, (newUser) => {
  if (newUser?.recentArticles) {
    fetchRecentArticles()
  }
}, { immediate: true })

onMounted(() => {
  fetchStats()
})
</script>

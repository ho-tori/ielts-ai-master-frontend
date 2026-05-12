<template>
  <div class="space-y-6">
    <!-- Welcome Banner -->
    <div class="rounded-2xl bg-gradient-to-r from-primary to-indigo-500 p-6 text-white">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold">欢迎回来，{{ userStore.user?.nickname || userStore.user?.username || '同学' }}</h2>
          <p class="text-white/80 mt-1 text-sm">
            坚持练习，你的阅读能力一定会提升
          </p>
          <div v-if="stats" class="mt-3 flex items-center gap-2 text-xs text-white/70">
            <span v-if="stats.lastPracticeTime">最近练习：{{ stats.lastPracticeTime }}</span>
          </div>
        </div>
        <div class="text-5xl opacity-30 select-none">IELTS</div>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-surface rounded-xl border border-border/70 p-4 hover:border-primary/20 transition-colors">
        <div class="text-2xl font-bold text-primary">{{ stats?.totalArticlesPracticed || 0 }}</div>
        <p class="text-xs text-text-secondary mt-1">练习文章</p>
      </div>
      <div class="bg-surface rounded-xl border border-border/70 p-4 hover:border-primary/20 transition-colors">
        <div class="text-2xl font-bold text-text-primary">{{ stats?.totalQuestionsAnswered || 0 }}</div>
        <p class="text-xs text-text-secondary mt-1">答题总数</p>
      </div>
      <div class="bg-surface rounded-xl border border-border/70 p-4 hover:border-primary/20 transition-colors">
        <div class="text-2xl font-bold" :class="correctRateClass">{{ stats?.correctRate || 0 }}%</div>
        <p class="text-xs text-text-secondary mt-1">正确率</p>
      </div>
      <div
        class="bg-surface rounded-xl border border-border/70 p-4 hover:border-primary/20 transition-colors cursor-pointer"
        @click="$router.push('/wrong-answers')"
      >
        <div class="flex items-center gap-2">
          <div class="text-2xl font-bold" :class="pendingClass">{{ stats?.pendingReviewCount || 0 }}</div>
          <span v-if="(stats?.pendingReviewCount || 0) > 0" class="w-2 h-2 rounded-full bg-danger animate-pulse" />
        </div>
        <p class="text-xs text-text-secondary mt-1">待复习错题</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Recent Articles (left 2/3) -->
      <div class="lg:col-span-2 space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="font-bold text-text-primary">最近练习</h3>
          <BaseButton variant="secondary" size="sm" @click="$router.push('/practice')">全部文章 →</BaseButton>
        </div>

        <div v-if="loading" class="flex justify-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>

        <div v-else-if="!stats || stats.recentArticles.length === 0" class="bg-surface rounded-xl border border-border/70 p-8 text-center">
          <p class="text-text-secondary text-sm mb-3">还没有练习记录</p>
          <BaseButton variant="primary" @click="$router.push('/practice')">开始第一篇文章</BaseButton>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="article in stats.recentArticles"
            :key="article.articleId"
            class="bg-surface rounded-xl border border-border/70 p-4 hover:border-primary/20 hover:shadow-sm transition-all cursor-pointer"
            @click="$router.push(`/reading?articleId=${article.articleId}`)"
          >
            <div class="flex items-center justify-between">
              <div class="min-w-0 flex-1">
                <p class="font-medium text-text-primary truncate">{{ article.title }}</p>
                <p class="text-xs text-text-secondary mt-1">
                  {{ article.correctCount }}/{{ article.totalQuestions }} 题正确
                </p>
              </div>
              <div class="ml-4 flex items-center gap-3">
                <!-- mini progress bar -->
                <div class="w-16 h-2 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                  <div
                    class="h-full rounded-full transition-all"
                    :class="articleScoreColor(article.score)"
                    :style="{ width: article.score + '%' }"
                  />
                </div>
                <span class="text-sm font-bold" :class="articleScoreColor(article.score)">{{ article.score }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions + Summary (right 1/3) -->
      <div class="space-y-4">
        <h3 class="font-bold text-text-primary">快捷操作</h3>

        <button
          class="w-full flex items-center gap-3 p-4 rounded-xl border border-border/70 bg-surface hover:border-primary/30 hover:shadow-sm transition-all text-left"
          @click="$router.push('/practice')"
        >
          <span class="text-2xl">📖</span>
          <div>
            <p class="font-medium text-text-primary text-sm">开始练习</p>
            <p class="text-xs text-text-secondary">继续刷阅读题</p>
          </div>
        </button>

        <button
          class="w-full flex items-center gap-3 p-4 rounded-xl border border-border/70 bg-surface hover:border-primary/30 hover:shadow-sm transition-all text-left"
          @click="$router.push('/wrong-answers')"
        >
          <span class="text-2xl">📊</span>
          <div>
            <p class="font-medium text-text-primary text-sm">错题本</p>
            <p class="text-xs text-text-secondary">
              {{ (stats?.wrongAnswersCount || 0) > 0 ? `${stats?.wrongAnswersCount} 道错题待复盘` : '暂无错题' }}
            </p>
          </div>
          <span v-if="(stats?.pendingReviewCount || 0) > 0" class="ml-auto w-5 h-5 rounded-full bg-danger text-white text-[10px] flex items-center justify-center font-bold">
            {{ stats?.pendingReviewCount }}
          </span>
        </button>

        <button
          class="w-full flex items-center gap-3 p-4 rounded-xl border border-border/70 bg-surface hover:border-primary/30 hover:shadow-sm transition-all text-left"
          @click="$router.push('/vocabulary')"
        >
          <span class="text-2xl">📝</span>
          <div>
            <p class="font-medium text-text-primary text-sm">生词本</p>
            <p class="text-xs text-text-secondary">同义替换词汇</p>
          </div>
        </button>

        <button
          class="w-full flex items-center gap-3 p-4 rounded-xl border border-border/70 bg-surface hover:border-primary/30 hover:shadow-sm transition-all text-left"
          @click="$router.push('/training')"
        >
          <span class="text-2xl">🎯</span>
          <div>
            <p class="font-medium text-text-primary text-sm">专项训练</p>
            <p class="text-xs text-text-secondary">针对性强化薄弱点</p>
          </div>
        </button>

        <!-- Quick Stats Summary -->
        <div class="bg-surface rounded-xl border border-border/70 p-4 mt-4">
          <p class="text-xs text-text-secondary mb-3">答题概况</p>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-text-secondary">总答题数</span>
              <span class="font-medium text-text-primary">{{ stats?.totalQuestionsAnswered || 0 }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-text-secondary">正确数</span>
              <span class="font-medium text-success">{{ correctCount }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-text-secondary">错误数</span>
              <span class="font-medium text-danger">{{ stats?.wrongAnswersCount || 0 }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-text-secondary">练习文章</span>
              <span class="font-medium text-text-primary">{{ stats?.totalArticlesPracticed || 0 }} 篇</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { apiGetUserStats } from '@/api/stats'
import { BaseButton } from '@/components'
import type { UserStats } from '@/types/user'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const stats = ref<UserStats | null>(null)

const correctCount = computed(() => {
  if (!stats.value) return 0
  const total = stats.value.totalQuestionsAnswered
  const rate = stats.value.correctRate
  return Math.round(total * rate / 100)
})

const correctRateClass = computed(() => {
  const r = stats.value?.correctRate || 0
  if (r >= 80) return 'text-success'
  if (r >= 60) return 'text-primary'
  return 'text-danger'
})

const pendingClass = computed(() => {
  const n = stats.value?.pendingReviewCount || 0
  if (n > 0) return 'text-danger'
  return 'text-text-secondary'
})

function articleScoreColor(score: number) {
  if (score >= 80) return 'text-success'
  if (score >= 60) return 'text-primary'
  return 'text-danger'
}

async function fetchStats() {
  loading.value = true
  try {
    const { data } = await apiGetUserStats()
    if (data.code === 0) {
      stats.value = data.data
    }
  } catch (e) {
    console.error('获取统计数据失败', e)
  } finally {
    loading.value = false
  }
}

onMounted(fetchStats)
</script>

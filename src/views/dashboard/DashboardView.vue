<template>
  <div class="space-y-6">
    <!-- Welcome Banner -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-indigo-600 to-purple-600 p-8 text-white">
      <div class="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
      <div class="absolute bottom-0 left-1/2 w-48 h-48 bg-white/5 rounded-full translate-y-1/2" />
      <div class="relative flex items-center gap-5">
        <div class="w-14 h-14 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-2xl font-bold shrink-0 border border-white/20">
          {{ (userStore.user?.nickname || userStore.user?.username || '?').slice(0, 1).toUpperCase() }}
        </div>
        <div class="min-w-0">
          <h2 class="text-xl font-bold">欢迎回来，{{ userStore.user?.nickname || userStore.user?.username || '同学' }}</h2>
          <p class="text-white/70 text-sm mt-0.5">每一天的练习都在让你更接近目标分数</p>
          <p v-if="stats?.lastPracticeTime" class="text-white/50 text-xs mt-2 flex items-center gap-1">
            <span class="inline-block w-1.5 h-1.5 rounded-full bg-green-300" />
            最近练习 {{ stats.lastPracticeTime }}
          </p>
        </div>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- 练习文章 -->
      <div class="group relative bg-surface rounded-2xl border border-border/60 p-5 hover:border-primary/30 hover:shadow-md transition-all duration-300 overflow-hidden">
        <div class="absolute top-0 left-0 w-1 h-full bg-primary rounded-l-full" />
        <div class="flex items-start justify-between">
          <div>
            <p class="text-3xl font-bold text-primary">{{ stats?.totalArticlesPracticed || 0 }}</p>
            <p class="text-xs text-text-secondary mt-1">练习文章</p>
          </div>
          <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-xl">📖</div>
        </div>
      </div>

      <!-- 答题总数 -->
      <div class="group relative bg-surface rounded-2xl border border-border/60 p-5 hover:border-primary/30 hover:shadow-md transition-all duration-300 overflow-hidden">
        <div class="absolute top-0 left-0 w-1 h-full bg-sky-500 rounded-l-full" />
        <div class="flex items-start justify-between">
          <div>
            <p class="text-3xl font-bold text-text-primary">{{ stats?.totalQuestionsAnswered || 0 }}</p>
            <p class="text-xs text-text-secondary mt-1">答题总数</p>
          </div>
          <div class="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center text-xl">✏️</div>
        </div>
      </div>

      <!-- 正确率 -->
      <div class="group relative bg-surface rounded-2xl border border-border/60 p-5 hover:border-primary/30 hover:shadow-md transition-all duration-300 overflow-hidden">
        <div class="absolute top-0 left-0 w-1 h-full rounded-l-full" :class="correctRateBarClass" />
        <div class="flex items-start justify-between">
          <div>
            <div class="flex items-baseline gap-1">
              <p class="text-3xl font-bold" :class="correctRateClass">{{ stats?.correctRate || 0 }}</p>
              <span class="text-sm text-text-secondary">%</span>
            </div>
            <p class="text-xs text-text-secondary mt-1">正确率</p>
          </div>
          <!-- mini ring -->
          <div class="relative w-10 h-10">
            <svg class="w-10 h-10 -rotate-90" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="17" fill="none" stroke="currentColor" stroke-width="3" class="text-slate-100" />
              <circle cx="20" cy="20" r="17" fill="none" stroke="currentColor" stroke-width="3"
                :class="correctRateRingClass"
                :stroke-dasharray="`${(stats?.correctRate || 0) * 1.07} 107`"
                stroke-linecap="round" />
            </svg>
          </div>
        </div>
      </div>

      <!-- 待复习 -->
      <div
        class="group relative bg-surface rounded-2xl border border-border/60 p-5 hover:border-primary/30 hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer"
        @click="$router.push('/wrong-answers')"
      >
        <div class="absolute top-0 left-0 w-1 h-full rounded-l-full" :class="pendingBarClass" />
        <div class="flex items-start justify-between">
          <div>
            <div class="flex items-center gap-2">
              <p class="text-3xl font-bold" :class="pendingClass">{{ stats?.pendingReviewCount || 0 }}</p>
              <span v-if="(stats?.pendingReviewCount || 0) > 0" class="flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-danger opacity-75" />
                <span class="relative inline-flex rounded-full h-2 w-2 bg-danger" />
              </span>
            </div>
            <p class="text-xs text-text-secondary mt-1">待复习错题</p>
          </div>
          <div class="w-10 h-10 rounded-xl bg-danger/10 text-danger flex items-center justify-center text-xl">🎯</div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Recent Articles -->
      <div class="lg:col-span-2">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <h3 class="font-bold text-text-primary text-lg">最近练习</h3>
            <span v-if="stats?.recentArticles.length" class="text-xs px-2 py-0.5 rounded-full bg-surface-muted text-text-secondary">
              {{ stats?.recentArticles.length }} 篇
            </span>
          </div>
          <BaseButton variant="secondary" size="sm" @click="$router.push('/practice')">
            练习中心 →
          </BaseButton>
        </div>

        <div v-if="loading" class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>

        <div v-else-if="!stats || stats.recentArticles.length === 0" class="bg-surface rounded-2xl border border-border/60 p-10 text-center">
          <div class="text-5xl mb-4">🚀</div>
          <p class="text-text-primary font-medium mb-2">准备开始你的雅思之旅</p>
          <p class="text-text-secondary text-sm mb-4">完成第一篇文章后，你的练习记录会出现在这里</p>
          <BaseButton variant="primary" @click="$router.push('/practice')">去练习中心</BaseButton>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="article in stats.recentArticles"
            :key="article.articleId"
            class="group bg-surface rounded-xl border border-border/60 p-4 hover:border-primary/30 hover:shadow-md transition-all duration-200 cursor-pointer"
            @click="$router.push(`/reading?articleId=${article.articleId}`)"
          >
            <div class="flex items-center gap-4">
              <!-- Score ring -->
              <div class="shrink-0 relative w-12 h-12 flex items-center justify-center">
                <svg class="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                  <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" stroke-width="3" class="text-slate-100" />
                  <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" stroke-width="3"
                    :class="articleScoreRingColor(article.score)"
                    :stroke-dasharray="`${article.score * 1.26} 126`"
                    stroke-linecap="round" />
                </svg>
                <span class="absolute text-xs font-bold" :class="articleScoreColor(article.score)">{{ article.score }}%</span>
              </div>

              <div class="flex-1 min-w-0">
                <p class="font-semibold text-text-primary truncate group-hover:text-primary transition-colors">{{ article.title }}</p>
                <div class="flex items-center gap-3 mt-1.5">
                  <span class="text-xs text-text-secondary">
                    {{ article.correctCount }}/{{ article.totalQuestions }} 正确
                  </span>
                  <span class="text-[10px] px-1.5 py-0.5 rounded-full"
                    :class="article.score >= 80 ? 'bg-success/10 text-success' : article.score >= 60 ? 'bg-primary/10 text-primary' : 'bg-danger/10 text-danger'"
                  >
                    {{ article.score >= 80 ? '优秀' : article.score >= 60 ? '良好' : '需加强' }}
                  </span>
                </div>
              </div>

              <div class="shrink-0 text-text-secondary/30 group-hover:text-primary/50 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Panel -->
      <div class="space-y-4">
        <!-- Quick Actions -->
        <div class="bg-surface rounded-2xl border border-border/60 overflow-hidden">
          <div class="px-4 py-3 border-b border-border/40 bg-surface-muted/50">
            <p class="text-xs font-semibold text-text-secondary uppercase tracking-wider">快捷入口</p>
          </div>
          <router-link to="/practice" class="flex items-center gap-3 px-4 py-3 hover:bg-primary/5 transition-colors border-b border-border/30 last:border-0 group">
            <span class="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all text-sm">📖</span>
            <div class="flex-1"><p class="text-sm font-medium text-text-primary">练习中心</p></div>
            <svg class="w-4 h-4 text-text-secondary/40 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
          </router-link>
          <router-link to="/wrong-answers" class="flex items-center gap-3 px-4 py-3 hover:bg-primary/5 transition-colors border-b border-border/30 last:border-0 group">
            <span class="w-8 h-8 rounded-lg bg-danger/10 text-danger flex items-center justify-center group-hover:bg-danger group-hover:text-white transition-all text-sm">📊</span>
            <div class="flex-1"><p class="text-sm font-medium text-text-primary">错题本</p></div>
            <span v-if="(stats?.pendingReviewCount || 0) > 0" class="text-[10px] px-1.5 py-0.5 rounded-full bg-danger text-white font-bold mr-1">{{ stats?.pendingReviewCount }}</span>
            <svg class="w-4 h-4 text-text-secondary/40 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
          </router-link>
          <router-link to="/vocabulary" class="flex items-center gap-3 px-4 py-3 hover:bg-primary/5 transition-colors border-b border-border/30 last:border-0 group">
            <span class="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-all text-sm">📝</span>
            <div class="flex-1"><p class="text-sm font-medium text-text-primary">生词本</p></div>
            <svg class="w-4 h-4 text-text-secondary/40 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
          </router-link>
          <router-link to="/training" class="flex items-center gap-3 px-4 py-3 hover:bg-primary/5 transition-colors group">
            <span class="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-all text-sm">🎯</span>
            <div class="flex-1"><p class="text-sm font-medium text-text-primary">专项训练</p></div>
            <svg class="w-4 h-4 text-text-secondary/40 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
          </router-link>
        </div>

        <!-- Answer Summary -->
        <div class="bg-surface rounded-2xl border border-border/60 p-5">
          <p class="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-4">答题概况</p>
          <div class="space-y-3">
            <div class="flex items-center gap-3">
              <div class="flex-1">
                <div class="flex justify-between text-sm mb-1">
                  <span class="text-text-secondary">正确</span>
                  <span class="font-semibold text-success">{{ correctCount }}</span>
                </div>
                <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div class="h-full bg-success rounded-full transition-all duration-700" :style="{ width: (stats?.correctRate || 0) + '%' }" />
                </div>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div class="flex-1">
                <div class="flex justify-between text-sm mb-1">
                  <span class="text-text-secondary">错误</span>
                  <span class="font-semibold text-danger">{{ stats?.wrongAnswersCount || 0 }}</span>
                </div>
                <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div class="h-full bg-danger rounded-full transition-all duration-700" :style="{ width: (stats?.totalQuestionsAnswered ? (stats?.wrongAnswersCount || 0) * 100 / stats.totalQuestionsAnswered : 0) + '%' }" />
                </div>
              </div>
            </div>
          </div>
          <div class="mt-4 pt-4 border-t border-border/40 grid grid-cols-2 gap-3 text-center">
            <div>
              <p class="text-lg font-bold text-text-primary">{{ stats?.totalArticlesPracticed || 0 }}</p>
              <p class="text-[10px] text-text-secondary">练习文章</p>
            </div>
            <div>
              <p class="text-lg font-bold text-text-primary">{{ stats?.totalQuestionsAnswered || 0 }}</p>
              <p class="text-[10px] text-text-secondary">答题总数</p>
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
  return Math.round(stats.value.totalQuestionsAnswered * stats.value.correctRate / 100)
})

const correctRateClass = computed(() => {
  const r = stats.value?.correctRate || 0
  if (r >= 80) return 'text-success'
  if (r >= 60) return 'text-primary'
  return 'text-danger'
})

const correctRateBarClass = computed(() => {
  const r = stats.value?.correctRate || 0
  if (r >= 80) return 'bg-success'
  if (r >= 60) return 'bg-primary'
  return 'bg-danger'
})

const correctRateRingClass = computed(() => {
  const r = stats.value?.correctRate || 0
  if (r >= 80) return 'text-success'
  if (r >= 60) return 'text-primary'
  return 'text-danger'
})

const pendingClass = computed(() => (stats.value?.pendingReviewCount || 0) > 0 ? 'text-danger' : 'text-text-secondary')
const pendingBarClass = computed(() => (stats.value?.pendingReviewCount || 0) > 0 ? 'bg-danger' : 'bg-slate-300')

function articleScoreColor(score: number) {
  if (score >= 80) return 'text-success'
  if (score >= 60) return 'text-primary'
  return 'text-danger'
}

function articleScoreRingColor(score: number) {
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

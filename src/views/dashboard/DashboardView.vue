<template>
  <div class="app-page">
    <div class="surface-panel overflow-hidden">
      <div class="flex flex-col gap-6 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div class="flex min-w-0 items-center gap-4">
          <div class="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-primary/15 bg-primary/10">
            <img
              :src="avatarSrc"
              alt="用户头像"
              class="h-full w-full object-cover"
              @error="handleAvatarError"
            >
          </div>
          <div class="min-w-0">
            <p class="section-label mb-1">今日学习概览</p>
            <h2 class="text-2xl font-semibold leading-tight text-text-primary">
              欢迎回来，{{ userStore.user?.nickname || userStore.user?.username || '同学' }}
            </h2>
            <p class="mt-1 text-sm leading-6 text-text-secondary">把阅读、错题和词汇复盘放在同一条学习路径里。</p>
            <p v-if="stats?.lastPracticeTime" class="mt-2 flex items-center gap-1.5 text-xs text-text-secondary">
              <Icon icon="heroicons:clock" class="text-primary" />
              最近练习 {{ stats.lastPracticeTime }}
            </p>
          </div>
        </div>
        <div class="flex flex-col gap-2 sm:flex-row">
          <BaseButton variant="secondary" @click="$router.push('/wrong-answers')">
            <Icon icon="heroicons:clipboard-document-check" />
            复盘错题
          </BaseButton>
          <BaseButton variant="primary" @click="$router.push('/practice')">
            <Icon icon="heroicons:play" />
            开始练习
          </BaseButton>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div class="metric-card relative overflow-hidden">
        <div class="absolute inset-x-0 top-0 h-1 bg-primary" />
        <div class="flex h-full flex-col justify-between gap-5">
          <div class="flex items-center justify-between gap-3">
            <p class="section-label">练习文章</p>
            <div class="icon-box bg-primary/10 text-primary"><Icon icon="heroicons:book-open" class="text-xl" /></div>
          </div>
          <div>
            <p class="text-3xl font-semibold text-text-primary">{{ stats?.totalArticlesPracticed || 0 }}</p>
            <p class="mt-1 text-xs text-text-secondary">累计完成文章</p>
          </div>
        </div>
      </div>

      <div class="metric-card relative overflow-hidden">
        <div class="absolute inset-x-0 top-0 h-1 bg-info" />
        <div class="flex h-full flex-col justify-between gap-5">
          <div class="flex items-center justify-between gap-3">
            <p class="section-label">答题总数</p>
            <div class="icon-box bg-info/10 text-info"><Icon icon="heroicons:pencil-square" class="text-xl" /></div>
          </div>
          <div>
            <p class="text-3xl font-semibold text-text-primary">{{ stats?.totalQuestionsAnswered || 0 }}</p>
            <p class="mt-1 text-xs text-text-secondary">已提交答案</p>
          </div>
        </div>
      </div>

      <div class="metric-card relative overflow-hidden">
        <div class="absolute inset-x-0 top-0 h-1" :class="correctRateBarClass" />
        <div class="flex h-full items-center justify-between gap-4">
          <div>
            <p class="section-label mb-4">正确率</p>
            <div class="flex items-baseline gap-1">
              <p class="text-3xl font-semibold" :class="correctRateClass">{{ stats?.correctRate || 0 }}</p>
              <span class="text-sm text-text-secondary">%</span>
            </div>
            <p class="mt-1 text-xs text-text-secondary">阅读题表现</p>
          </div>
          <div class="relative flex h-14 w-14 shrink-0 items-center justify-center">
            <svg class="h-14 w-14 -rotate-90" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="17" fill="none" stroke="currentColor" stroke-width="3" class="text-border/60" />
              <circle
                cx="20"
                cy="20"
                r="17"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
                :class="correctRateRingClass"
                :stroke-dasharray="`${(stats?.correctRate || 0) * 1.07} 107`"
                stroke-linecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      <button
        type="button"
        class="metric-card relative overflow-hidden text-left"
        @click="$router.push('/wrong-answers')"
      >
        <div class="absolute inset-x-0 top-0 h-1" :class="pendingBarClass" />
        <div class="flex h-full flex-col justify-between gap-5">
          <div class="flex items-center justify-between gap-3">
            <p class="section-label">待复习错题</p>
            <div class="icon-box bg-danger/10 text-danger"><Icon icon="heroicons:exclamation-triangle" class="text-xl" /></div>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <p class="text-3xl font-semibold" :class="pendingClass">{{ stats?.pendingReviewCount || 0 }}</p>
              <span v-if="(stats?.pendingReviewCount || 0) > 0" class="flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-danger opacity-75" />
                <span class="relative inline-flex rounded-full h-2 w-2 bg-danger" />
              </span>
            </div>
            <p class="mt-1 text-xs text-text-secondary">点击进入错题本</p>
          </div>
        </div>
      </button>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <section class="surface-panel overflow-hidden lg:col-span-2">
        <div class="flex items-center justify-between gap-3 border-b border-border/50 bg-surface-muted/35 px-5 py-4">
          <div class="flex items-center gap-2">
            <h3 class="text-base font-semibold text-text-primary">最近练习</h3>
            <span v-if="stats?.recentArticles.length" class="rounded-full bg-surface px-2 py-0.5 text-xs text-text-secondary ring-1 ring-border/60">
              {{ stats?.recentArticles.length }} 篇
            </span>
          </div>
          <BaseButton variant="secondary" size="sm" @click="$router.push('/practice')">
            练习中心
            <Icon icon="heroicons:arrow-right" />
          </BaseButton>
        </div>

        <div v-if="loading" class="flex justify-center py-14">
          <div class="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
        </div>

        <div v-else-if="!stats || stats.recentArticles.length === 0" class="px-6 py-12 text-center">
          <div class="icon-box mx-auto mb-4 h-12 w-12 bg-primary/10 text-primary"><Icon icon="heroicons:rocket-launch" class="text-2xl" /></div>
          <p class="mb-2 font-medium text-text-primary">准备开始你的雅思之旅</p>
          <p class="mb-4 text-sm text-text-secondary">完成第一篇文章后，你的练习记录会出现在这里</p>
          <BaseButton variant="primary" @click="$router.push('/practice')">去练习中心</BaseButton>
        </div>

        <div v-else class="divide-y divide-border/45">
          <div
            v-for="article in stats.recentArticles"
            :key="article.articleId"
            class="group cursor-pointer px-5 py-4 transition-colors hover:bg-surface-muted/45"
            @click="$router.push(`/reading?articleId=${article.articleId}`)"
          >
            <div class="flex items-center gap-4">
              <div class="relative flex h-12 w-12 shrink-0 items-center justify-center">
                <svg class="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                  <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" stroke-width="3" class="text-border/60" />
                  <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" stroke-width="3"
                    :class="articleScoreRingColor(article.score)"
                    :stroke-dasharray="`${article.score * 1.26} 126`"
                    stroke-linecap="round" />
                </svg>
                <span class="absolute text-xs font-bold" :class="articleScoreColor(article.score)">{{ article.score }}%</span>
              </div>

              <div class="flex-1 min-w-0">
                <p class="truncate font-medium text-text-primary transition-colors group-hover:text-primary">{{ article.title }}</p>
                <div class="mt-1.5 flex flex-wrap items-center gap-3">
                  <span class="text-xs text-text-secondary">
                    {{ article.correctCount }}/{{ article.totalQuestions }} 正确
                  </span>
                  <span class="rounded-full px-2 py-0.5 text-[11px] font-medium"
                    :class="article.score >= 80 ? 'bg-success/10 text-success' : article.score >= 60 ? 'bg-primary/10 text-primary' : 'bg-danger/10 text-danger'"
                  >
                    {{ article.score >= 80 ? '优秀' : article.score >= 60 ? '良好' : '需加强' }}
                  </span>
                </div>
              </div>

              <Icon icon="heroicons:chevron-right" class="shrink-0 text-xl text-text-secondary/30 transition-colors group-hover:text-primary/50" />
            </div>
          </div>
        </div>
      </section>

      <div class="space-y-4">
        <div class="surface-panel overflow-hidden">
          <div class="border-b border-border/50 bg-surface-muted/35 px-4 py-3">
            <p class="section-label">快捷入口</p>
          </div>
          <router-link to="/practice" class="group flex items-center gap-3 border-b border-border/30 px-4 py-3 transition-colors last:border-0 hover:bg-surface-muted/45">
            <span class="icon-box h-9 w-9 bg-primary/10 text-primary transition-all group-hover:bg-primary group-hover:text-white"><Icon icon="heroicons:pencil-square" /></span>
            <div class="flex-1"><p class="text-sm font-medium text-text-primary">练习中心</p></div>
            <Icon icon="heroicons:chevron-right" class="text-text-secondary/40 transition-colors group-hover:text-primary" />
          </router-link>
          <router-link to="/wrong-answers" class="group flex items-center gap-3 border-b border-border/30 px-4 py-3 transition-colors last:border-0 hover:bg-surface-muted/45">
            <span class="icon-box h-9 w-9 bg-danger/10 text-danger transition-all group-hover:bg-danger group-hover:text-white"><Icon icon="heroicons:exclamation-triangle" /></span>
            <div class="flex-1"><p class="text-sm font-medium text-text-primary">错题本</p></div>
            <span v-if="(stats?.pendingReviewCount || 0) > 0" class="text-[10px] px-1.5 py-0.5 rounded-full bg-danger text-white font-bold mr-1">{{ stats?.pendingReviewCount }}</span>
            <Icon icon="heroicons:chevron-right" class="text-text-secondary/40 transition-colors group-hover:text-primary" />
          </router-link>
          <router-link to="/vocabulary" class="group flex items-center gap-3 border-b border-border/30 px-4 py-3 transition-colors last:border-0 hover:bg-surface-muted/45">
            <span class="icon-box h-9 w-9 bg-warning/10 text-warning transition-all group-hover:bg-warning group-hover:text-white"><Icon icon="heroicons:bookmark" /></span>
            <div class="flex-1"><p class="text-sm font-medium text-text-primary">生词本</p></div>
            <Icon icon="heroicons:chevron-right" class="text-text-secondary/40 transition-colors group-hover:text-primary" />
          </router-link>
          <router-link to="/training" class="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-muted/45">
            <span class="icon-box h-9 w-9 bg-info/10 text-info transition-all group-hover:bg-info group-hover:text-white"><Icon icon="heroicons:bolt" /></span>
            <div class="flex-1"><p class="text-sm font-medium text-text-primary">专项训练</p></div>
            <Icon icon="heroicons:chevron-right" class="text-text-secondary/40 transition-colors group-hover:text-primary" />
          </router-link>
        </div>

        <div class="surface-panel p-5">
          <p class="section-label mb-4">答题概况</p>
          <div class="space-y-3">
            <div class="flex items-center gap-3">
              <div class="flex-1">
                <div class="flex justify-between text-sm mb-1">
                  <span class="text-text-secondary">正确</span>
                  <span class="font-semibold text-success">{{ correctCount }}</span>
                </div>
                <div class="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
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
                <div class="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
                  <div class="h-full bg-danger rounded-full transition-all duration-700" :style="{ width: (stats?.totalQuestionsAnswered ? (stats?.wrongAnswersCount || 0) * 100 / stats.totalQuestionsAnswered : 0) + '%' }" />
                </div>
              </div>
            </div>
          </div>
          <div class="mt-5 grid grid-cols-2 gap-3 border-t border-border/40 pt-4 text-center">
            <div class="rounded-lg bg-surface-muted/60 px-3 py-3">
              <p class="text-lg font-semibold text-text-primary">{{ stats?.totalArticlesPracticed || 0 }}</p>
              <p class="text-[11px] text-text-secondary">练习文章</p>
            </div>
            <div class="rounded-lg bg-surface-muted/60 px-3 py-3">
              <p class="text-lg font-semibold text-text-primary">{{ stats?.totalQuestionsAnswered || 0 }}</p>
              <p class="text-[11px] text-text-secondary">答题总数</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { apiGetUserStats } from '@/api/stats'
import { BaseButton } from '@/components'
import { Icon } from '@iconify/vue'
import type { UserStats } from '@/types/user'

const userStore = useUserStore()
const loading = ref(false)
const stats = ref<UserStats | null>(null)
const DEFAULT_AVATAR_SRC = '/images/default-avatar.jpg'

const avatarSrc = computed(() => userStore.user?.avatar || DEFAULT_AVATAR_SRC)

function handleAvatarError(event: Event) {
  const img = event.currentTarget as HTMLImageElement
  if (img.src.endsWith(DEFAULT_AVATAR_SRC)) return
  img.src = DEFAULT_AVATAR_SRC
}

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

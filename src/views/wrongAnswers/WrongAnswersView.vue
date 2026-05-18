<template>
  <div class="app-page">
    <PageHeader
      title="智能错题本"
      description="查看错因分布、AI 诊断和完整答题历史。"
    >
      <template #actions>
        <div class="segmented-control">
          <BaseButton
            :variant="activeTab === 'wrong' ? 'primary' : 'ghost'"
            size="sm"
            @click="activeTab = 'wrong'"
          >
            <Icon icon="heroicons:chart-pie" />
            错题分析
          </BaseButton>
          <BaseButton
            :variant="activeTab === 'history' ? 'primary' : 'ghost'"
            size="sm"
            @click="activeTab = 'history'; fetchHistory()"
          >
            <Icon icon="heroicons:clock" />
            答题历史
          </BaseButton>
        </div>
      </template>
    </PageHeader>

    <template v-if="activeTab === 'wrong'">
      <div class="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
        <BaseCard v-if="stats.length > 0">
          <template #header>
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div class="flex items-center gap-2">
                  <span class="icon-box h-9 w-9 bg-primary/10 text-primary">
                    <Icon icon="heroicons:chart-bar-square" />
                  </span>
                  <div>
                    <h3 class="font-semibold text-text-primary">错误类型分布</h3>
                    <p class="mt-1 text-xs text-text-secondary">按占比查看当前阶段最常见的阅读失误。</p>
                  </div>
                </div>
              </div>
              <div class="segmented-control">
                <BaseButton
                  v-for="p in periods"
                  :key="p.value"
                  :variant="selectedPeriod === p.value ? 'primary' : 'ghost'"
                  size="sm"
                  @click="switchPeriod(p.value)"
                >{{ p.label }}</BaseButton>
              </div>
            </div>
          </template>
          <div class="space-y-4">
            <div
              v-for="(stat, index) in stats"
              :key="stat.errorType"
              class="group rounded-lg border border-border/60 bg-surface-muted/35 p-4 transition-all hover:border-primary/30 hover:bg-surface-muted/55"
            >
              <div class="mb-3 flex items-start justify-between gap-3">
                <div class="flex min-w-0 items-start gap-3">
                  <span
                    class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-semibold ring-1"
                    :class="getRankClass(index)"
                  >
                    {{ index + 1 }}
                  </span>
                  <div class="min-w-0">
                    <p class="truncate text-sm font-semibold text-text-primary">{{ stat.errorType }}</p>
                    <p class="mt-0.5 text-xs text-text-secondary">{{ stat.count }} 题记录</p>
                  </div>
                </div>
                <span class="shrink-0 rounded-full bg-surface px-2.5 py-1 text-xs font-semibold text-text-primary ring-1 ring-border/60">
                  {{ stat.percentage }}%
                </span>
              </div>
              <div class="relative h-3 overflow-hidden rounded-full bg-surface ring-1 ring-border/50">
                <div
                  class="h-full rounded-full transition-all duration-500"
                  :class="getBarColor(stat.percentage)"
                  :style="{ width: Math.max(stat.percentage, 6) + '%' }"
                />
              </div>
            </div>
          </div>
        </BaseCard>
        <BaseCard v-else>
          <Empty>暂无错误分布数据</Empty>
        </BaseCard>

        <DiagnosisCard
          :diagnosis="diagnosis?.diagnosis"
          :weaknesses="diagnosis?.topWeaknesses"
          :loading="diagnosisLoading"
        />
      </div>

      <BaseCard>
        <template #header>
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 class="font-semibold text-text-primary">
                错题列表
                <span v-if="wrongAnswers.length" class="ml-2 text-sm font-normal text-text-secondary">共 {{ wrongAnswers.length }} 题</span>
              </h3>
              <p class="mt-1 text-xs text-text-secondary">点击题目查看完整解析，或直接回到原文定位。</p>
            </div>
            <BaseButton
              v-if="wrongAnswers.length > 0"
              variant="secondary"
              size="sm"
              :loading="diagnosisLoading"
              @click="fetchDiagnosis"
            >
              <Icon icon="heroicons:arrow-path" />
              刷新诊断
            </BaseButton>
          </div>
        </template>
        <Loading v-if="listLoading" />
        <Empty v-else-if="wrongAnswers.length === 0">暂无错题记录，快去完成一套阅读练习吧</Empty>
        <div v-else class="space-y-3">
          <div
            v-for="item in wrongAnswers"
            :key="item.questionId"
            class="interactive-row cursor-pointer"
            @click="viewDetail(item)"
          >
            <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div class="min-w-0 flex-1" @click.stop="viewDetail(item)">
                <div class="mb-2 flex flex-wrap items-center gap-2">
                  <span class="rounded-md bg-surface-muted px-2 py-1 text-xs font-medium text-text-secondary">
                    {{ item.articleTitle }}
                  </span>
                  <span class="text-xs text-text-secondary">{{ formatTime(item.createTime) }}</span>
                </div>
                <p class="line-clamp-2 text-sm font-medium leading-6 text-text-primary sm:text-base">{{ item.questionStem }}</p>
              </div>
              <div class="flex shrink-0 flex-wrap items-center gap-2 sm:max-w-[260px] sm:justify-end">
                <span
                  v-if="!item.hasAnalysis"
                  class="rounded-full bg-warning/10 px-2 py-1 text-xs font-medium text-warning"
                >待分析</span>
                <ErrorTypeBadge v-for="et in (item.errorTypes || [])" :key="et" :type="et" />
                <BaseButton
                  variant="ghost"
                  size="sm"
                  class="!text-xs"
                  :disabled="!item.articleId"
                  :title="!item.articleId ? '后端未重新编译，缺少articleId' : '回到原文查看'"
                  @click.stop="goToArticle(item)"
                >回原文</BaseButton>
              </div>
            </div>
          </div>
        </div>
      </BaseCard>
    </template>

    <template v-if="activeTab === 'history'">
      <BaseCard>
        <template #header>
          <div>
            <h3 class="font-semibold text-text-primary">
              答题记录
              <span v-if="history.length" class="ml-2 text-sm font-normal text-text-secondary">共 {{ history.length }} 条</span>
            </h3>
            <p class="mt-1 text-xs text-text-secondary">按时间复盘每一次作答结果。</p>
          </div>
        </template>
        <Loading v-if="historyLoading" />
        <Empty v-else-if="history.length === 0">暂无答题记录</Empty>
        <div v-else class="space-y-2">
          <div
            v-for="item in history"
            :key="`${item.questionId}-${item.answerTime}`"
            class="interactive-row flex cursor-pointer flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
            :class="item.isCorrect ? 'hover:border-success/30' : 'hover:border-danger/30'"
            @click="!item.isCorrect && $router.push(`/wrong-answers/${item.questionId}`)"
          >
            <div class="flex min-w-0 flex-1 items-start gap-3">
              <span
                class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                :class="item.isCorrect ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'"
              >
                <Icon :icon="item.isCorrect ? 'heroicons:check-circle' : 'heroicons:x-circle'" />
              </span>
              <div class="min-w-0">
                <p class="mb-0.5 text-xs text-text-secondary">{{ item.articleTitle }}</p>
                <p class="line-clamp-1 text-sm font-medium text-text-primary">{{ item.questionStem }}</p>
                <p class="mt-1 text-xs text-text-secondary">
                  {{ formatTime(item.answerTime) }}
                </p>
              </div>
            </div>
            <div class="flex shrink-0 flex-wrap items-center gap-2 sm:ml-3">
              <span
                class="text-xs px-2 py-0.5 rounded-full font-medium"
                :class="item.isCorrect ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'"
              >
                {{ item.isCorrect ? '正确' : '错误' }}
              </span>
              <BaseButton
                v-if="!item.isCorrect"
                variant="ghost"
                size="sm"
                class="!text-xs"
                :disabled="!item.articleId"
                @click.stop="goToArticle(item)"
              >回原文</BaseButton>
              <BaseButton
                v-if="!item.isCorrect"
                variant="secondary"
                size="sm"
                @click.stop="$router.push(`/wrong-answers/${item.questionId}`)"
              >
                {{ item.hasAnalysis ? '查看解析' : '分析' }}
              </BaseButton>
            </div>
          </div>
        </div>
      </BaseCard>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { BaseCard, BaseButton, Loading, Empty, PageHeader } from '@/components'
import { Icon } from '@iconify/vue'
import ErrorTypeBadge from './components/ErrorTypeBadge.vue'
import DiagnosisCard from './components/DiagnosisCard.vue'
import { apiGetWrongAnswerList, apiGetAnswerHistory } from '@/api/wrongAnswer'
import { apiGetErrorStats, apiGetDiagnosis } from '@/api/stats'
import type { WrongAnswerListItem, ErrorStats, DiagnosisResult } from '@/types/wrongAnswer'
import type { AnswerHistoryItem } from '@/api/wrongAnswer'

const router = useRouter()
const activeTab = ref<'wrong' | 'history'>('wrong')

// 错题分析状态
const listLoading = ref(false)
const diagnosisLoading = ref(false)
const wrongAnswers = ref<WrongAnswerListItem[]>([])
const stats = ref<ErrorStats[]>([])
const diagnosis = ref<DiagnosisResult | null>(null)
const selectedPeriod = ref('all')

// 答题历史状态
const historyLoading = ref(false)
const history = ref<AnswerHistoryItem[]>([])

const periods = [
  { label: '全部', value: 'all' },
  { label: '近7天', value: '7days' },
  { label: '近20题', value: '20questions' }
]

function getBarColor(pct: number) {
  if (pct >= 40) return 'bg-gradient-to-r from-danger to-rose-500'
  if (pct >= 20) return 'bg-gradient-to-r from-warning to-orange-400'
  return 'bg-gradient-to-r from-primary to-info'
}

function getRankClass(index: number) {
  if (index === 0) return 'bg-danger/10 text-danger ring-danger/20'
  if (index === 1) return 'bg-warning/10 text-warning ring-warning/20'
  if (index === 2) return 'bg-primary/10 text-primary ring-primary/20'
  return 'bg-surface text-text-secondary ring-border/60'
}

function formatTime(dateStr: string) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleString('zh-CN')
}

function viewDetail(item: WrongAnswerListItem) {
  router.push(`/wrong-answers/${item.questionId}`)
}

function goToArticle(item: Pick<WrongAnswerListItem, 'articleId' | 'questionId'>) {
  console.log('回原文: articleId=' + item.articleId + ', questionId=' + item.questionId)
  if (item.articleId) {
    router.push(`/reading?articleId=${item.articleId}&focusQuestion=${item.questionId}`)
  }
}

async function switchPeriod(period: string) {
  selectedPeriod.value = period
  await fetchStats()
}

async function fetchList() {
  listLoading.value = true
  try {
    const { data } = await apiGetWrongAnswerList(0, 50)
    if (data.code === 0) {
      wrongAnswers.value = data.data || []
    }
  } catch (e) {
    console.error('获取错题列表失败', e)
  } finally {
    listLoading.value = false
  }
}

async function fetchStats() {
  try {
    const { data } = await apiGetErrorStats(selectedPeriod.value)
    if (data.code === 0) {
      stats.value = data.data || []
    }
  } catch (e) {
    console.error('获取错误统计失败', e)
  }
}

async function fetchDiagnosis() {
  diagnosisLoading.value = true
  try {
    const { data } = await apiGetDiagnosis()
    if (data.code === 0) {
      diagnosis.value = data.data
    }
  } catch (e) {
    console.error('获取诊断失败', e)
  } finally {
    diagnosisLoading.value = false
  }
}

async function fetchHistory() {
  historyLoading.value = true
  try {
    const { data } = await apiGetAnswerHistory(0, 50)
    if (data.code === 0) {
      history.value = data.data || []
    }
  } catch (e) {
    console.error('获取答题历史失败', e)
  } finally {
    historyLoading.value = false
  }
}

onMounted(() => {
  fetchList()
  fetchStats()
  fetchDiagnosis()
  fetchHistory()
})
</script>

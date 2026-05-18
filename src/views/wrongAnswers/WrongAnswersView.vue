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
          >错题分析</BaseButton>
          <BaseButton
            :variant="activeTab === 'history' ? 'primary' : 'ghost'"
            size="sm"
            @click="activeTab = 'history'; fetchHistory()"
          >答题历史</BaseButton>
        </div>
      </template>
    </PageHeader>

    <!-- ====== 错题分析 Tab ====== -->
    <template v-if="activeTab === 'wrong'">
      <!-- Error Stats Section -->
      <BaseCard v-if="stats.length > 0">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-text-primary">错误类型分布</h3>
            <div class="segmented-control">
              <BaseButton
                v-for="p in periods" :key="p.value"
                :variant="selectedPeriod === p.value ? 'primary' : 'ghost'"
                size="sm"
                @click="switchPeriod(p.value)"
              >{{ p.label }}</BaseButton>
            </div>
          </div>
        </template>
        <div class="space-y-3">
          <div v-for="stat in stats" :key="stat.errorType" class="grid gap-2 sm:grid-cols-[8rem_1fr_3rem] sm:items-center sm:gap-3">
            <span class="text-sm font-medium text-text-primary">{{ stat.errorType }}</span>
            <div class="h-6 overflow-hidden rounded-full bg-surface-muted">
              <div
                class="h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                :class="getBarColor(stat.percentage)"
                :style="{ width: Math.max(stat.percentage, 4) + '%' }"
              >
                <span class="text-xs text-white font-medium">{{ stat.percentage }}%</span>
              </div>
            </div>
            <span class="text-xs text-text-secondary sm:text-right">{{ stat.count }}题</span>
          </div>
        </div>
      </BaseCard>

      <!-- Diagnosis Section -->
      <DiagnosisCard
        v-if="diagnosis"
        :diagnosis="diagnosis.diagnosis"
        :weaknesses="diagnosis.topWeaknesses"
        :loading="diagnosisLoading"
      />

      <!-- Wrong Answer List -->
      <BaseCard>
        <template #header>
          <h3 class="font-bold text-text-primary">
            错题列表
            <span v-if="wrongAnswers.length" class="text-sm text-text-secondary font-normal ml-2">共 {{ wrongAnswers.length }} 题</span>
          </h3>
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
              <div class="flex-1 min-w-0" @click.stop="viewDetail(item)">
                <p class="text-sm text-text-secondary mb-1">{{ item.articleTitle }}</p>
                <p class="text-text-primary line-clamp-2">{{ item.questionStem }}</p>
              </div>
              <div class="flex shrink-0 flex-wrap items-center gap-2">
                <span
                  v-if="!item.hasAnalysis"
                  class="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700"
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

      <!-- Refresh Diagnosis -->
      <div v-if="wrongAnswers.length > 0" class="text-center">
        <BaseButton variant="secondary" :loading="diagnosisLoading" @click="fetchDiagnosis">
          刷新诊断
        </BaseButton>
      </div>
    </template>

    <!-- ====== 答题历史 Tab ====== -->
    <template v-if="activeTab === 'history'">
      <BaseCard>
        <template #header>
          <h3 class="font-bold text-text-primary">
            答题记录
            <span v-if="history.length" class="text-sm text-text-secondary font-normal ml-2">共 {{ history.length }} 条</span>
          </h3>
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
            <div class="flex-1 min-w-0">
              <p class="text-xs text-text-secondary mb-0.5">{{ item.articleTitle }}</p>
              <p class="text-sm text-text-primary line-clamp-1">{{ item.questionStem }}</p>
              <p class="text-xs text-text-secondary mt-1">
                {{ formatTime(item.answerTime) }}
              </p>
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
  if (pct >= 40) return 'bg-danger'
  if (pct >= 20) return 'bg-amber-500'
  return 'bg-primary'
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

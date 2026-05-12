<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-text-primary">智能错题本</h2>
      <!-- Tab Switch -->
      <div class="flex gap-2">
        <BaseButton
          :variant="activeTab === 'wrong' ? 'primary' : 'secondary'"
          size="sm"
          @click="activeTab = 'wrong'"
        >错题分析</BaseButton>
        <BaseButton
          :variant="activeTab === 'history' ? 'primary' : 'secondary'"
          size="sm"
          @click="activeTab = 'history'; fetchHistory()"
        >答题历史</BaseButton>
      </div>
    </div>

    <!-- ====== 错题分析 Tab ====== -->
    <template v-if="activeTab === 'wrong'">
      <!-- Error Stats Section -->
      <BaseCard v-if="stats.length > 0">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-text-primary">错误类型分布</h3>
            <div class="flex gap-2">
              <BaseButton
                v-for="p in periods" :key="p.value"
                :variant="selectedPeriod === p.value ? 'primary' : 'secondary'"
                size="sm"
                @click="switchPeriod(p.value)"
              >{{ p.label }}</BaseButton>
            </div>
          </div>
        </template>
        <div class="space-y-3">
          <div v-for="stat in stats" :key="stat.errorType" class="flex items-center gap-3">
            <span class="text-sm text-text-primary w-32 shrink-0">{{ stat.errorType }}</span>
            <div class="flex-1 bg-slate-100 rounded-full h-6 overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                :class="getBarColor(stat.percentage)"
                :style="{ width: Math.max(stat.percentage, 4) + '%' }"
              >
                <span class="text-xs text-white font-medium">{{ stat.percentage }}%</span>
              </div>
            </div>
            <span class="text-xs text-text-secondary w-12 text-right">{{ stat.count }}题</span>
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
            class="p-4 rounded-lg border border-border/70 hover:border-primary/30 hover:bg-surface-muted transition-colors cursor-pointer"
            @click="viewDetail(item)"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="flex-1 min-w-0">
                <p class="text-sm text-text-secondary mb-1">{{ item.articleTitle }}</p>
                <p class="text-text-primary line-clamp-2">{{ item.questionStem }}</p>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <span
                  v-if="!item.hasAnalysis"
                  class="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700"
                >待分析</span>
                <ErrorTypeBadge v-for="et in (item.errorTypes || [])" :key="et" :type="et" />
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
            class="flex items-center justify-between p-3 rounded-lg border border-border/70"
            :class="item.isCorrect ? 'hover:border-success/30' : 'hover:border-danger/30'"
          >
            <div class="flex-1 min-w-0">
              <p class="text-xs text-text-secondary mb-0.5">{{ item.articleTitle }}</p>
              <p class="text-sm text-text-primary line-clamp-1">{{ item.questionStem }}</p>
              <p class="text-xs text-text-secondary mt-1">
                {{ formatTime(item.answerTime) }}
              </p>
            </div>
            <div class="flex items-center gap-2 shrink-0 ml-3">
              <span
                class="text-xs px-2 py-0.5 rounded-full font-medium"
                :class="item.isCorrect ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'"
              >
                {{ item.isCorrect ? '正确' : '错误' }}
              </span>
              <BaseButton
                v-if="!item.isCorrect"
                variant="secondary"
                size="sm"
                @click="item.articleId ? $router.push(`/reading?articleId=${item.articleId}&focusQuestion=${item.questionId}`) : $router.push(`/wrong-answers/${item.questionId}`)"
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
import { BaseCard, BaseButton, Loading, Empty } from '@/components'
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
  if (item.articleId) {
    router.push(`/reading?articleId=${item.articleId}&focusQuestion=${item.questionId}`)
  } else {
    router.push(`/wrong-answers/${item.questionId}`)
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

<template>
  <div class="app-page">
    <PageHeader
      title="专项训练"
      description="基于你的错题薄弱点，选择要强化的错误类型，AI 将生成针对性微训练。"
    />

    <!-- Step 1: 选择训练类型 -->
    <BaseCard>
      <template #header>
        <div>
          <h3 class="font-semibold text-text-primary">选择训练类型</h3>
          <p class="mt-1 text-xs text-text-secondary">优先训练错误频率最高的题型，也可以手动切换薄弱点。</p>
        </div>
      </template>
      <Loading v-if="focusLoading" />
      <Empty v-else-if="focusPoints.length === 0">
        暂无错题数据，请先在错题本中完成 AI 解析
      </Empty>
      <div v-else class="space-y-5">
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <button
            v-for="fp in focusPoints"
            :key="fp.type"
            type="button"
            class="min-h-[84px] rounded-lg border px-4 py-3 text-left transition-all"
            :class="selectedFocus === fp.type
              ? 'border-primary bg-primary text-white shadow-[0_10px_22px_rgb(var(--color-primary)_/_0.18)]'
              : 'border-border/70 bg-surface-muted/60 text-text-primary hover:-translate-y-0.5 hover:border-primary/35 hover:bg-surface'"
            @click="selectedFocus = fp.type"
          >
            <span class="block text-sm font-semibold">{{ fp.type }}</span>
            <span class="mt-2 inline-flex items-center gap-1 text-xs opacity-75">
              <Icon icon="heroicons:exclamation-circle" />
              {{ fp.count }} 题待强化
            </span>
          </button>
          <button
            type="button"
            class="min-h-[84px] rounded-lg border px-4 py-3 text-left transition-all"
            :class="selectedFocus === 'auto'
              ? 'border-primary bg-primary text-white shadow-[0_10px_22px_rgb(var(--color-primary)_/_0.18)]'
              : 'border-border/70 bg-surface-muted/60 text-text-primary hover:-translate-y-0.5 hover:border-primary/35 hover:bg-surface'"
            @click="selectedFocus = 'auto'"
          >
            <span class="block text-sm font-semibold">自动选择</span>
            <span class="mt-2 inline-flex items-center gap-1 text-xs opacity-75">
              <Icon icon="heroicons:sparkles" />
              使用最高频薄弱点
            </span>
          </button>
        </div>

        <div class="flex flex-col gap-3 border-t border-border/50 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p class="text-sm text-text-secondary">
            当前选择：
            <span class="font-semibold text-text-primary">{{ selectedFocus === 'auto' ? '自动选择' : selectedFocus }}</span>
          </p>
          <BaseButton
            variant="primary"
            size="lg"
            :loading="generating"
            :disabled="generating || !selectedFocus"
            @click="generateTraining"
          >
            {{ generating ? 'AI出题中...' : `生成「${selectedFocus === 'auto' ? '自动' : selectedFocus}」专项训练` }}
          </BaseButton>
        </div>
      </div>
    </BaseCard>

    <!-- Training History -->
    <BaseCard>
      <template #header>
        <h3 class="font-bold text-text-primary">训练历史</h3>
      </template>
      <Loading v-if="loading" />
      <Empty v-else-if="history.length === 0">
        暂无训练记录
      </Empty>
      <div v-else class="space-y-3">
        <div
          v-for="item in history"
          :key="item.trainingId"
          class="interactive-row flex cursor-pointer flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          @click="$router.push(`/training/${item.trainingId}`)"
        >
          <div class="flex min-w-0 items-center gap-3">
            <span class="icon-box h-9 w-9 bg-primary/10 text-primary">
              <Icon icon="heroicons:bolt" />
            </span>
            <div class="min-w-0">
              <p class="truncate font-medium text-text-primary">{{ item.title }}</p>
              <p class="mt-0.5 text-xs text-text-secondary">{{ formatDate(item.createTime) }}</p>
            </div>
          </div>
          <div class="flex w-full flex-wrap items-center justify-between gap-3 sm:w-auto sm:justify-end">
            <span class="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{{ item.focusPoint }}</span>
            <span v-if="item.completed" class="text-sm font-bold" :class="scoreClass(item.score)">
              {{ item.score }}分
            </span>
            <span v-else class="text-xs text-text-secondary">未完成</span>
          </div>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { BaseCard, BaseButton, Loading, Empty, PageHeader } from '@/components'
import { Icon } from '@iconify/vue'
import { apiGenerateTraining, apiGetTrainingHistory, apiGetFocusPoints } from '@/api/training'
import type { TrainingHistoryItem, FocusPoint } from '@/api/training'

const router = useRouter()
const loading = ref(false)
const generating = ref(false)
const focusLoading = ref(false)
const history = ref<TrainingHistoryItem[]>([])
const focusPoints = ref<FocusPoint[]>([])
const selectedFocus = ref<string>('')

function scoreClass(score: number | null) {
  if (score === null) return 'text-text-secondary'
  if (score >= 80) return 'text-success'
  if (score >= 60) return 'text-primary'
  return 'text-danger'
}

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleString('zh-CN')
}

async function fetchHistory() {
  loading.value = true
  try {
    const { data } = await apiGetTrainingHistory()
    if (data.code === 0) {
      history.value = data.data || []
    }
  } catch (e) {
    console.error('获取训练历史失败', e)
  } finally {
    loading.value = false
  }
}

async function fetchFocusPoints() {
  focusLoading.value = true
  try {
    const { data } = await apiGetFocusPoints()
    if (data.code === 0 && data.data?.length > 0) {
      focusPoints.value = data.data
      selectedFocus.value = 'auto'
    }
  } catch (e) {
    console.error('获取训练类型失败', e)
  } finally {
    focusLoading.value = false
  }
}

async function generateTraining() {
  if (!selectedFocus.value) return
  generating.value = true
  try {
    const { data } = await apiGenerateTraining(selectedFocus.value)
    if (data.code === 0 && data.data) {
      router.push(`/training/${data.data.trainingId}`)
    }
  } catch (e: any) {
    const msg = e?.response?.data?.message || '生成训练失败'
    alert(msg)
  } finally {
    generating.value = false
  }
}

onMounted(() => {
  fetchFocusPoints()
  fetchHistory()
})
</script>

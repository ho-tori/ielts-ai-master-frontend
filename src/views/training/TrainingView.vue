<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold text-text-primary">专项训练</h2>

    <p class="text-text-secondary text-sm">
      基于你的错题薄弱点，选择要强化的错误类型，AI 将生成针对性微训练。
    </p>

    <!-- Step 1: 选择训练类型 -->
    <BaseCard>
      <template #header>
        <h3 class="font-bold text-text-primary">选择训练类型</h3>
      </template>
      <Loading v-if="focusLoading" />
      <Empty v-else-if="focusPoints.length === 0">
        暂无错题数据，请先在错题本中完成 AI 解析
      </Empty>
      <div v-else class="space-y-3">
        <p class="text-sm text-text-secondary mb-2">你的错题薄弱点分布（点击选择要训练的类型）：</p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="fp in focusPoints"
            :key="fp.type"
            class="px-4 py-2 rounded-lg border text-sm font-medium transition-colors"
            :class="selectedFocus === fp.type
              ? 'bg-primary text-white border-primary'
              : 'bg-surface-muted text-text-primary border-border/70 hover:border-primary/30'"
            @click="selectedFocus = fp.type"
          >
            {{ fp.type }}
            <span class="ml-1.5 text-xs opacity-70">({{ fp.count }}题)</span>
          </button>
          <button
            class="px-4 py-2 rounded-lg border text-sm font-medium transition-colors"
            :class="selectedFocus === 'auto'
              ? 'bg-primary text-white border-primary'
              : 'bg-surface-muted text-text-primary border-border/70 hover:border-primary/30'"
            @click="selectedFocus = 'auto'"
          >
            自动选择（最高频）
          </button>
        </div>

        <div class="pt-3">
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
      <div v-else class="space-y-2">
        <div
          v-for="item in history"
          :key="item.trainingId"
          class="flex items-center justify-between p-3 rounded-lg border border-border/70 hover:border-primary/30 hover:bg-surface-muted transition-colors cursor-pointer"
          @click="$router.push(`/training/${item.trainingId}`)"
        >
          <div>
            <p class="font-medium text-text-primary">{{ item.title }}</p>
            <p class="text-xs text-text-secondary mt-0.5">{{ formatDate(item.createTime) }}</p>
          </div>
          <div class="flex items-center gap-3">
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
import { BaseCard, BaseButton, Loading, Empty } from '@/components'
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

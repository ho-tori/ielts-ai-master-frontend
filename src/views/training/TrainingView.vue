<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-text-primary">专项训练</h2>
      <BaseButton
        variant="primary"
        size="lg"
        :loading="generating"
        :disabled="generating"
        @click="generateTraining"
      >
        {{ generating ? 'AI出题中...' : '生成专项训练' }}
      </BaseButton>
    </div>

    <p class="text-text-secondary text-sm">
      基于你的错题薄弱点，AI将自动生成针对性微训练。每次训练聚焦一个特定能力点，帮助你精准提升。
    </p>

    <!-- Training History -->
    <BaseCard>
      <template #header>
        <h3 class="font-bold text-text-primary">训练历史</h3>
      </template>
      <Loading v-if="loading" />
      <Empty v-else-if="history.length === 0">
        暂无训练记录，点击上方按钮生成你的第一份专项训练
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
import { apiGenerateTraining, apiGetTrainingHistory } from '@/api/training'
import type { TrainingHistoryItem } from '@/types/training'

const router = useRouter()
const loading = ref(false)
const generating = ref(false)
const history = ref<TrainingHistoryItem[]>([])

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

async function generateTraining() {
  generating.value = true
  try {
    const { data } = await apiGenerateTraining()
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

onMounted(fetchHistory)
</script>

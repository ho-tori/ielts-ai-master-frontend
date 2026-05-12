<template>
  <div class="space-y-6">
    <div class="flex items-center gap-3">
      <BaseButton variant="secondary" size="sm" @click="$router.back()">← 返回</BaseButton>
      <h2 class="text-xl font-bold text-text-primary">AI 深度解析</h2>
    </div>

    <Loading v-if="loading" />
    <ErrorState v-else-if="error" :message="error" />

    <template v-else-if="detail">
      <!-- Question Overview -->
      <BaseCard>
        <template #header><h3 class="font-bold text-text-primary">题目信息</h3></template>
        <div class="space-y-3 text-sm">
          <p class="text-text-primary"><span class="text-text-secondary">题目：</span>{{ detail.questionStem }}</p>
          <div class="flex gap-6">
            <p><span class="text-text-secondary">正确答案：</span><span class="text-success font-medium">{{ detail.correctAnswer }}</span></p>
            <p><span class="text-text-secondary">你的答案：</span><span class="text-danger font-medium">{{ detail.userAnswer }}</span></p>
          </div>
          <div class="flex flex-wrap gap-1.5">
            <span class="text-text-secondary text-xs">错误类型：</span>
            <ErrorTypeBadge v-for="et in detail.errorTypes" :key="et" :type="et" />
          </div>
        </div>
      </BaseCard>

      <!-- Error Analysis -->
      <BaseCard>
        <template #header>
          <div class="flex items-center gap-2">
            <span class="text-danger text-lg">⚠</span>
            <h3 class="font-bold text-text-primary">错因分析</h3>
          </div>
        </template>
        <p class="text-text-primary leading-relaxed whitespace-pre-wrap">{{ detail.detailedAnalysis }}</p>
      </BaseCard>

      <!-- Correct Thought Path -->
      <BaseCard>
        <template #header>
          <div class="flex items-center gap-2">
            <span class="text-success text-lg">✓</span>
            <h3 class="font-bold text-text-primary">正确思维路径</h3>
          </div>
        </template>
        <p class="text-text-primary leading-relaxed whitespace-pre-wrap">{{ detail.correctThoughtPath }}</p>
      </BaseCard>

      <!-- Exam Points -->
      <BaseCard v-if="detail.examPoints && detail.examPoints.length > 0">
        <template #header><h3 class="font-bold text-text-primary">考点标注</h3></template>
        <div class="space-y-2">
          <div
            v-for="(point, idx) in detail.examPoints"
            :key="idx"
            class="flex items-start gap-2 p-2 rounded bg-surface-muted"
          >
            <span class="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary shrink-0 mt-0.5">{{ point.type }}</span>
            <div class="text-sm text-text-secondary">
              <template v-if="point.type === '同义替换对'">
                <span class="text-text-primary font-medium">{{ point.sourceWord }}</span>
                <span class="mx-1">→</span>
                <span class="text-text-primary font-medium">{{ point.targetWord }}</span>
                <span v-if="point.note" class="ml-2">（{{ point.note }}）</span>
              </template>
              <template v-else-if="point.type === '定位关键词'">
                <span class="text-text-primary font-medium">{{ point.keyword }}</span>
                <span v-if="point.reason" class="ml-2">— {{ point.reason }}</span>
              </template>
              <template v-else>
                {{ point.note || point.reason || '' }}
              </template>
            </div>
          </div>
        </div>
      </BaseCard>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { BaseCard, BaseButton, Loading, ErrorState } from '@/components'
import ErrorTypeBadge from './components/ErrorTypeBadge.vue'
import { apiGetAnalysis, apiAnalyzeWrongAnswer } from '@/api/wrongAnswer'
import type { AnalysisDetail } from '@/types/wrongAnswer'

const route = useRoute()
const loading = ref(false)
const error = ref<string | null>(null)
const detail = ref<AnalysisDetail | null>(null)

async function loadAnalysis(questionId: number) {
  loading.value = true
  error.value = null
  try {
    // 先尝试获取已有解析
    const { data } = await apiGetAnalysis(questionId)
    if (data.code === 0) {
      detail.value = data.data
      return
    }
  } catch {
    // 没有已有解析，触发AI分析
  }

  try {
    const { data } = await apiAnalyzeWrongAnswer(questionId)
    if (data.code === 0) {
      detail.value = data.data
    } else {
      error.value = data.message || '解析失败'
    }
  } catch (e: any) {
    error.value = e?.response?.data?.message || e?.message || 'AI解析请求失败'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  const id = Number(route.params.id)
  if (id) loadAnalysis(id)
})
</script>

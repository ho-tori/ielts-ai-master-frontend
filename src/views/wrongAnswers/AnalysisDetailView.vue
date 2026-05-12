<template>
  <div class="space-y-6">
    <div class="flex items-center gap-3">
      <BaseButton variant="secondary" size="sm" @click="$router.back()">← 返回</BaseButton>
      <h2 class="text-xl font-bold text-text-primary">错题详情</h2>
    </div>

    <Loading v-if="loading" />
    <ErrorState v-else-if="error" :message="error" />

    <template v-else-if="detail">
      <!-- Question Overview -->
      <BaseCard>
        <template #header><h3 class="font-bold text-text-primary">题目信息</h3></template>
        <div class="space-y-3 text-sm">
          <p class="text-text-primary">{{ detail.questionStem }}</p>
          <div class="flex gap-6">
            <p><span class="text-text-secondary">正确答案：</span><span class="text-success font-medium">{{ formatAnswer(detail.correctAnswer) }}</span></p>
            <p><span class="text-text-secondary">你的答案：</span><span class="text-danger font-medium">{{ formatAnswer(detail.userAnswer) }}</span></p>
          </div>
          <div v-if="detail.errorTypes && detail.errorTypes.length > 0" class="flex flex-wrap gap-1.5">
            <span class="text-text-secondary text-xs">错误类型：</span>
            <ErrorTypeBadge v-for="et in detail.errorTypes" :key="et" :type="et" />
          </div>
        </div>
      </BaseCard>

      <!-- AI Analysis (if exists) -->
      <template v-if="detail.analysisExists">
        <BaseCard>
          <template #header>
            <div class="flex items-center gap-2">
              <span class="text-danger text-lg">⚠</span>
              <h3 class="font-bold text-text-primary">AI 错因分析</h3>
            </div>
          </template>
          <p class="text-text-primary leading-relaxed whitespace-pre-wrap">{{ detail.detailedAnalysis }}</p>
        </BaseCard>

        <BaseCard>
          <template #header>
            <div class="flex items-center gap-2">
              <span class="text-success text-lg">✓</span>
              <h3 class="font-bold text-text-primary">正确思维路径</h3>
            </div>
          </template>
          <p class="text-text-primary leading-relaxed whitespace-pre-wrap">{{ detail.correctThoughtPath }}</p>
        </BaseCard>

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

      <!-- No AI Analysis yet -->
      <BaseCard v-else>
        <template #header><h3 class="font-bold text-text-primary">AI 深度解析</h3></template>
        <div class="text-center py-6">
          <p class="text-text-secondary mb-4">AI解析尚未生成</p>
          <BaseButton
            variant="primary"
            :loading="analyzing"
            :disabled="analyzing"
            @click="triggerAnalysis"
          >
            {{ analyzing ? 'AI分析中...' : '生成AI解析' }}
          </BaseButton>
          <p v-if="analyzeError" class="text-danger text-sm mt-2">{{ analyzeError }}</p>
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
const analyzing = ref(false)
const analyzeError = ref<string | null>(null)

function formatAnswer(answer: string): string {
  if (!answer) return ''
  try {
    const parsed = JSON.parse(answer)
    if (Array.isArray(parsed)) return parsed.join(', ')
    return String(parsed)
  } catch {
    return answer
  }
}

async function loadAnalysis(questionId: number) {
  loading.value = true
  error.value = null
  try {
    const { data } = await apiGetAnalysis(questionId)
    if (data.code === 0) {
      detail.value = data.data
    } else {
      error.value = data.message || '加载失败'
    }
  } catch (e: any) {
    error.value = e?.response?.data?.message || e?.message || '加载失败'
  } finally {
    loading.value = false
  }
}

async function triggerAnalysis() {
  if (!detail.value) return
  analyzing.value = true
  analyzeError.value = null
  try {
    const { data } = await apiAnalyzeWrongAnswer(detail.value.questionId)
    if (data.code === 0) {
      detail.value = data.data
    } else {
      analyzeError.value = data.message || 'AI解析失败'
    }
  } catch (e: any) {
    analyzeError.value = e?.response?.data?.message || e?.message || 'AI服务暂时不可用，请稍后重试'
  } finally {
    analyzing.value = false
  }
}

onMounted(() => {
  const id = Number(route.params.id)
  if (id) loadAnalysis(id)
})
</script>

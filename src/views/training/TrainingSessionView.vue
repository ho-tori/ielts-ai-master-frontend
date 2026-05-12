<template>
  <div class="space-y-6">
    <div class="flex items-center gap-3">
      <BaseButton variant="secondary" size="sm" @click="$router.push('/training')">← 返回</BaseButton>
      <h2 class="text-xl font-bold text-text-primary">{{ session?.title || '专项训练' }}</h2>
    </div>

    <Loading v-if="loading" />

    <template v-else-if="session">
      <!-- Training Description -->
      <BaseCard>
        <div class="flex items-center justify-between">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{{ session.focusPoint }}</span>
            </div>
            <p class="text-text-secondary text-sm">{{ session.description }}</p>
          </div>
          <div v-if="session.completed" class="text-center">
            <div class="text-2xl font-bold" :class="scoreClass(session.score)">{{ session.score }}分</div>
            <p class="text-xs text-text-secondary">得分</p>
          </div>
        </div>
      </BaseCard>

      <!-- Training Items -->
      <div v-if="!session.completed" class="space-y-6">
        <div v-for="(item, idx) in session.items" :key="idx" class="space-y-4">
          <!-- Source Sentence -->
          <div class="p-4 bg-surface-muted rounded-lg border border-border/70">
            <p class="text-xs text-text-secondary mb-1">原文句子</p>
            <p class="text-text-primary leading-relaxed">{{ item.sourceSentence }}</p>
          </div>

          <!-- Locate Question -->
          <BaseCard>
            <template #header>
              <span class="text-sm font-bold text-text-primary">定位题 {{ idx * 2 + 1 }}</span>
            </template>
            <p class="text-text-primary mb-3 text-sm">{{ item.locateQuestion.stem }}</p>
            <div class="space-y-2">
              <BaseButton
                v-for="opt in item.locateQuestion.options"
                :key="opt.label"
                :variant="getVariant(answers['locate_' + idx], opt.label, item.locateQuestion.answer, showResult)"
                block
                :disabled="showResult"
                @click="selectAnswer('locate_' + idx, opt.label)"
              >
                {{ opt.label }}. {{ opt.content }}
                <span v-if="showResult && opt.label === item.locateQuestion.answer" class="ml-1">✓</span>
              </BaseButton>
            </div>
            <div v-if="showResult && item.locateQuestion.analysis" class="mt-2 p-2 bg-slate-50 rounded text-sm text-text-secondary">
              {{ item.locateQuestion.analysis }}
            </div>
          </BaseCard>

          <!-- Synonym Question -->
          <BaseCard>
            <template #header>
              <span class="text-sm font-bold text-text-primary">同义替换题 {{ idx * 2 + 2 }}</span>
            </template>
            <p class="text-text-primary mb-3 text-sm">{{ item.synonymQuestion.stem }}</p>
            <div class="space-y-2">
              <BaseButton
                v-for="opt in item.synonymQuestion.options"
                :key="opt.label"
                :variant="getVariant(answers['syn_' + idx], opt.label, item.synonymQuestion.answer, showResult)"
                block
                :disabled="showResult"
                @click="selectAnswer('syn_' + idx, opt.label)"
              >
                {{ opt.label }}. {{ opt.content }}
                <span v-if="showResult && opt.label === item.synonymQuestion.answer" class="ml-1">✓</span>
              </BaseButton>
            </div>
            <div v-if="showResult" class="mt-2 p-2 bg-slate-50 rounded text-sm text-text-secondary">
              <p>{{ item.synonymQuestion.analysis }}</p>
              <div v-if="item.synonymQuestion.distractorDesign" class="mt-2 pt-2 border-t border-border/50">
                <p class="text-xs text-text-secondary mb-1">干扰项设计：</p>
                <div v-for="(design, label) in item.synonymQuestion.distractorDesign" :key="label" class="text-xs text-text-secondary">
                  <span class="font-medium">{{ label }}：</span>{{ design }}
                </div>
              </div>
            </div>
          </BaseCard>
        </div>

        <!-- Submit / Reset -->
        <div class="space-y-3">
          <div v-if="!showResult">
            <BaseButton variant="primary" size="lg" block :disabled="!allAnswered" @click="handleSubmit">
              提交答案
            </BaseButton>
            <p v-if="!allAnswered" class="text-xs text-text-secondary text-center mt-1">
              已答 {{ answeredCount }} / {{ totalCount }} 题
            </p>
          </div>
          <div v-else class="space-y-2">
            <div class="p-3 text-center rounded-lg" :class="resultBgClass">
              <p class="text-lg font-bold" :class="scoreClass(session.score)">
                {{ (session.score || 0) >= 60 ? '继续加油！' : '多多练习！' }}
              </p>
              <p class="text-sm text-text-secondary">正确率: {{ session.score }}%</p>
            </div>
            <BaseButton variant="primary" block @click="$router.push('/training')">
              返回训练列表
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- Completed View -->
      <div v-else class="space-y-4">
        <div v-for="(item, idx) in session.items" :key="idx" class="space-y-4">
          <div class="p-4 bg-surface-muted rounded-lg border border-border/70">
            <p class="text-xs text-text-secondary mb-1">原文句子</p>
            <p class="text-text-primary leading-relaxed">{{ item.sourceSentence }}</p>
          </div>
          <BaseCard v-for="(q, qIdx) in [item.locateQuestion, item.synonymQuestion]" :key="qIdx">
            <template #header>
              <div class="flex items-center gap-2">
                <span :class="q.userAnswer === q.answer ? 'text-success' : 'text-danger'">
                  {{ q.userAnswer === q.answer ? '✓' : '✗' }}
                </span>
                <span class="text-sm font-bold text-text-primary">{{ qIdx === 0 ? '定位题' : '同义替换题' }}</span>
              </div>
            </template>
            <p class="text-text-primary mb-2 text-sm">{{ q.stem }}</p>
            <p class="text-xs text-text-secondary">
              你的答案：<span :class="q.userAnswer === q.answer ? 'text-success' : 'text-danger'">{{ q.userAnswer || '未作答' }}</span>
            </p>
            <p class="text-xs text-text-secondary">正确答案：<span class="text-success">{{ q.answer }}</span></p>
            <p class="text-xs text-text-secondary mt-1">{{ q.analysis }}</p>
          </BaseCard>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { BaseCard, BaseButton, Loading } from '@/components'
import { apiGetTraining, apiSubmitTraining } from '@/api/training'
import type { TrainingSession } from '@/types/training'

const route = useRoute()
const loading = ref(false)
const session = ref<TrainingSession | null>(null)
const answers = ref<Record<string, string>>({})
const showResult = ref(false)
const submitting = ref(false)

const allAnswered = computed(() => {
  if (!session.value) return false
  const total = session.value.items.length * 2
  const answered = Object.values(answers.value).filter(Boolean).length
  return answered >= total
})

const answeredCount = computed(() => Object.values(answers.value).filter(Boolean).length)
const totalCount = computed(() => session.value ? session.value.items.length * 2 : 0)

const resultBgClass = computed(() => {
  const s = session.value?.score || 0
  if (s >= 80) return 'bg-success/10'
  if (s >= 60) return 'bg-primary/10'
  return 'bg-danger/10'
})

function scoreClass(score: number | null) {
  if (score === null) return 'text-text-secondary'
  if (score >= 80) return 'text-success'
  if (score >= 60) return 'text-primary'
  return 'text-danger'
}

function getVariant(userAnswer: string | undefined, optionLabel: string, correctAnswer: string, show: boolean): string {
  if (show) {
    if (optionLabel === correctAnswer) return 'success'
    if (optionLabel === userAnswer && optionLabel !== correctAnswer) return 'danger'
    return 'secondary'
  }
  return optionLabel === userAnswer ? 'tertiary' : 'secondary'
}

function selectAnswer(key: string, value: string) {
  answers.value[key] = value
}

async function handleSubmit() {
  if (!session.value) return
  submitting.value = true

  const answerList: string[] = []
  for (let i = 0; i < session.value.items.length; i++) {
    answerList.push(answers.value['locate_' + i] || '')
    answerList.push(answers.value['syn_' + i] || '')
  }

  try {
    const { data } = await apiSubmitTraining(session.value.trainingId, answerList)
    if (data.code === 0) {
      session.value = data.data
      showResult.value = true
    }
  } catch (e: any) {
    const msg = e?.response?.data?.message || '提交失败'
    alert(msg)
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  const id = Number(route.params.id)
  if (!id) return
  loading.value = true
  try {
    const { data } = await apiGetTraining(id)
    if (data.code === 0) {
      session.value = data.data
      showResult.value = data.data.completed
    }
  } catch (e) {
    console.error('获取训练失败', e)
  } finally {
    loading.value = false
  }
})
</script>

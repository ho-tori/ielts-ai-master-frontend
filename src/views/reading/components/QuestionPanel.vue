<template>
  <BaseCard>
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="font-semibold text-text-primary">Questions</h3>
        <span v-if="showResults" class="text-sm font-bold" :class="scoreClass">
          得分: {{ score }}%
        </span>
      </div>
    </template>
    <div class="space-y-4">
      <div v-for="(q, idx) in questions" :key="q.id" class="pb-4 border-b border-border/70 last:border-0">
        <p class="font-medium text-text-primary mb-3">
          <span class="text-primary">{{ idx + 1 }}.</span> {{ q.questionText }}
        </p>
        <div class="space-y-2">
          <BaseButton
            v-if="q.type === 'TRUE_FALSE_NOT_GIVEN'"
            v-for="opt in ['TRUE', 'FALSE', 'NOT GIVEN']"
            :key="`${q.id}-tfn-${opt}`"
            :variant="getButtonVariant(q.id, opt, q.answer, true)"
            block
            :disabled="showResults"
            @click="selectAnswer(q.id, opt)"
          >
            {{ opt }}
            <span v-if="showResults && opt === q.answer" class="ml-2">✓</span>
          </BaseButton>
          <BaseButton
            v-else
            v-for="opt in q.options"
            :key="`${q.id}-mc-${opt}`"
            :variant="getButtonVariant(q.id, opt, q.answer, false)"
            block
            :disabled="showResults"
            @click="selectAnswer(q.id, opt.charAt(0))"
          >
            {{ opt }}
            <span v-if="showResults && opt.charAt(0) === q.answer" class="ml-2">✓</span>
          </BaseButton>
        </div>
        <div v-if="showResults && q.explanation" class="mt-2 p-2 bg-surface-muted rounded-lg text-sm text-text-secondary">
          {{ q.explanation }}
        </div>
      </div>
    </div>
    <template #footer>
      <div v-if="showResults" class="space-y-2">
        <div class="p-3 rounded-lg text-center" :class="scoreBgClass">
          <p class="text-lg font-bold" :class="scoreClass">
            {{ score >= 60 ? '🎉 恭喜通过！' : '💪 继续加油！' }}
          </p>
          <p class="text-sm text-text-secondary">正确率: {{ score }}%</p>
        </div>
        <BaseButton 
          @click="resetQuiz"
          variant="secondary"
          block
        >
          重新作答
        </BaseButton>
      </div>
      <BaseButton 
        v-else
        @click="handleSubmit"
        variant="primary"
        block
      >
        Submit
      </BaseButton>
    </template>
  </BaseCard>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Question } from '../../../types/article'
import { BaseCard, BaseButton } from '@/components'

const props = defineProps<{
  questions: Question[]
  showResults?: boolean
}>()

const emit = defineEmits<{
  (e: 'update-answer', questionId: number, answer: string): void
  (e: 'submit'): void
  (e: 'reset'): void
}>()

const selectedAnswers = ref<Record<number, string>>({})

function selectAnswer(questionId: number, answer: string) {
  selectedAnswers.value[questionId] = answer
  emit('update-answer', questionId, answer)
}

function handleSubmit() {
  emit('submit')
}

function resetQuiz() {
  selectedAnswers.value = {}
  emit('reset')
}

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger' | 'success'

const score = computed(() => {
  if (!props.showResults) return 0
  let correct = 0
  props.questions.forEach(q => {
    if (selectedAnswers.value[q.id] === q.answer) {
      correct++
    }
  })
  return Math.round((correct / props.questions.length) * 100)
})

const scoreClass = computed(() => {
  if (score.value >= 80) return 'text-success'
  if (score.value >= 60) return 'text-primary'
  return 'text-danger'
})

const scoreBgClass = computed(() => {
  if (score.value >= 80) return 'bg-success/10'
  if (score.value >= 60) return 'bg-primary/10'
  return 'bg-danger/10'
})

function getButtonVariant(questionId: number, option: string, correctAnswer?: string, isTrueFalse: boolean = true): ButtonVariant {
  const userAnswer = selectedAnswers.value[questionId]
  const optionKey = isTrueFalse ? option : option.charAt(0)
  
  if (props.showResults) {
    if (optionKey === correctAnswer) return 'success'
    if (optionKey === userAnswer && optionKey !== correctAnswer) return 'danger'
    return 'secondary'
  }
  
  return optionKey === userAnswer ? 'tertiary' : 'secondary'
}
</script>

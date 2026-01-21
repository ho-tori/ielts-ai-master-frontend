<template>
  <BaseCard>
    <template #header>
      <h3 class="font-semibold text-slate-800">Questions</h3>
    </template>
    <div class="space-y-4">
      <div v-for="(q, idx) in questions" :key="q.id" class="pb-4 border-b border-slate-100 last:border-0">
        <p class="font-medium text-slate-800 mb-3">
          <span class="text-indigo-600">{{ idx + 1 }}.</span> {{ q.questionText }}
        </p>
        <div class="space-y-2">
          <BaseButton
            v-if="q.type === 'TRUE_FALSE_NOT_GIVEN'"
            v-for="opt in ['TRUE/YES', 'FALSE/NO', 'NOT GIVEN']"
            :key="`${q.id}-tfn-${opt}`"
            :variant="selectedAnswers[q.id] === opt ? 'tertiary' : 'secondary'"
            block
            @click="selectAnswer(q.id, opt)"
          >
            {{ opt }}
          </BaseButton>
          <BaseButton
            v-else
            v-for="opt in q.options"
            :key="`${q.id}-mc-${opt}`"
            :variant="selectedAnswers[q.id] === opt ? 'tertiary' : 'secondary'"
            block
            @click="selectAnswer(q.id, opt)"
          >
            {{ opt }}
          </BaseButton>
        </div>
      </div>
    </div>
    <template #footer>
      <BaseButton 
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
import { ref } from 'vue'
import type { Question } from '../../../types/article'
import { BaseCard, BaseButton } from '@/components'

const props = defineProps<{
  questions: Question[]
}>()

const emit = defineEmits<{
  (e: 'update-answer', questionId: string, answer: string): void
  (e: 'submit'): void
}>()

const selectedAnswers = ref<Record<string, string>>({})

function selectAnswer(questionId: string, answer: string) {
  selectedAnswers.value[questionId] = answer
  emit('update-answer', questionId, answer)
}

function handleSubmit() {
  emit('submit')
}
</script>

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
          <button
            v-if="q.type === 'TRUE_FALSE_NOT_GIVEN'"
            v-for="opt in ['TRUE/YES', 'FALSE/NO', 'NOT GIVEN']"
            :key="`${q.id}-tfn-${opt}`"
            class="block w-full text-left p-3 rounded-lg border-2 font-medium transition-all cursor-pointer hover:bg-indigo-50"
            :class="selectedAnswers[q.id] === opt ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200'"
            @click="selectAnswer(q.id, opt)"
          >
            {{ opt }}
          </button>
          <button
            v-else
            v-for="opt in q.options"
            :key="`${q.id}-mc-${opt}`"
            class="block w-full text-left p-3 rounded-lg border-2 font-medium transition-all cursor-pointer hover:bg-indigo-50"
            :class="selectedAnswers[q.id] === opt ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200'"
            @click="selectAnswer(q.id, opt)"
          >
            {{ opt }}
          </button>
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
import BaseCard from '../../../components/common/BaseCard.vue'
import BaseButton from '../../../components/common/BaseButton.vue'

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

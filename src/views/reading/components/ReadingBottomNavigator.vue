<script setup lang="ts">
import type { Question } from '@/types/article'

defineProps<{
  questions: Question[]
  selectedAnswers: Record<number, string>
  currentProgressPercent: number
}>()

const emit = defineEmits<{
  (e: 'jump', displayOrder: number): void
}>()
</script>

<template>
  <div class="bg-surface px-3 py-2 rounded-2xl shadow-lg">
    <div class="flex items-center justify-between gap-3">
      <div class="flex items-center gap-2 overflow-x-auto">
        <span class="text-[10px] text-text-secondary font-bold tracking-wide uppercase">题目导航</span>
        <button
          v-for="(q, index) in questions"
          :key="`nav-${q.id}`"
          type="button"
          @click="emit('jump', index + 1)"
          :class="[
            'w-8 h-8 text-xs font-bold transition-colors',
            selectedAnswers[q.id]
              ? 'bg-primary text-white'
              : 'bg-surface-muted text-text-secondary hover:text-primary'
          ]"
        >
          {{ index + 1 }}
        </button>
      </div>

      <div class="shrink-0 flex items-center gap-2">
        <span class="text-xs text-text-secondary">{{ currentProgressPercent }}%</span>
        <div class="w-28 bg-surface-muted h-2 rounded-full overflow-hidden">
          <div
            class="h-2 transition-all duration-300 rounded-full"
            :class="currentProgressPercent === 100 ? 'bg-success' : 'bg-primary'"
            :style="{ width: `${currentProgressPercent}%` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

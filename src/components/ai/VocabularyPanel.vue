<template>
  <div class="space-y-3">
    <h4 class="font-semibold text-slate-800 text-sm">核心词汇</h4>
    <div class="space-y-2">
      <div
        v-for="vocab in vocabularies"
        :key="vocab.word"
        class="p-3 bg-indigo-50 rounded-lg border border-indigo-100 hover:bg-indigo-100 transition-colors"
      >
        <p class="font-medium text-indigo-600">{{ vocab.word }}</p>
        <p class="text-xs text-slate-600 mt-1">{{ vocab.meaning }}</p>
        <p v-if="vocab.example" class="text-xs text-slate-500 italic mt-1">例：{{ vocab.example }}</p>
      </div>
      <div v-if="!vocabularies.length" class="text-center text-slate-400 text-sm py-4">
        暂无词汇数据
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { VocabularyItem } from '../../types/ai'

defineProps<{
  vocabularies: VocabularyItem[]
}>()
</script>

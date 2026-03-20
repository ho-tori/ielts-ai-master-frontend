<template>
  <div class="space-y-3">
    <h4 class="font-semibold text-text-primary text-sm">核心词汇</h4>
    <div class="space-y-2">
      <div
        v-for="vocab in vocabularies"
        :key="vocab.word"
        class="p-3 bg-primary/10 rounded-lg border border-primary/20 hover:bg-primary/15 transition-colors"
      >
        <p class="font-medium text-primary">{{ vocab.word }}</p>
        <p class="text-xs text-text-secondary mt-1">{{ vocab.meaning }}</p>
        <p v-if="vocab.example" class="text-xs text-text-secondary/80 italic mt-1">例：{{ vocab.example }}</p>
      </div>
      <div v-if="!vocabularies.length" class="text-center text-text-secondary/70 text-sm py-4">
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

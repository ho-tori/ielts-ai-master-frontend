<template>
  <div class="space-y-3">
    <h4 class="font-semibold text-text-primary text-sm">句子分析</h4>
    <div class="p-4 bg-primary/10 rounded-lg border border-primary/20">
      <p class="text-sm font-mono text-primary leading-relaxed mb-3">
        {{ analysis.original }}
      </p>
      <div class="bg-surface rounded p-2 text-xs text-text-secondary leading-relaxed">
        {{ analysis.explanation }}
      </div>
      <p v-if="analysis.grammar" class="text-xs text-text-secondary mt-2 italic">语法：{{ analysis.grammar }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SentenceAnalysis } from '../../types/ai'

defineProps<{
  analysis: SentenceAnalysis
}>()
</script>

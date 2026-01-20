<template>
  <div class="space-y-3">
    <h4 class="font-semibold text-slate-800 text-sm">句子分析</h4>
    <div class="p-4 bg-blue-50 rounded-lg border border-blue-100">
      <p class="text-sm font-mono text-blue-700 leading-relaxed mb-3">
        {{ analysis.original }}
      </p>
      <div class="bg-white rounded p-2 text-xs text-slate-700 leading-relaxed">
        {{ analysis.explanation }}
      </div>
      <p v-if="analysis.grammar" class="text-xs text-slate-600 mt-2 italic">语法：{{ analysis.grammar }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SentenceAnalysis } from '../../types/ai'

defineProps<{
  analysis: SentenceAnalysis
}>()
</script>

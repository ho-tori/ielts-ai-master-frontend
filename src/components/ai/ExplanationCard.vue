<template>
  <BaseCard>
    <template #header>
      <h3 class="font-semibold text-slate-800">AI 详细解析</h3>
    </template>
    <div v-if="loading" class="py-8">
      <Loading />
    </div>
    <div v-else-if="error" class="py-4">
      <ErrorState :title="'加载失败'" :message="error" />
    </div>
    <div v-else-if="result" class="space-y-6">
      <div>
        <h4 class="font-semibold text-slate-800 mb-2 text-sm">解释</h4>
        <p class="text-slate-700 leading-relaxed">{{ result.explanation }}</p>
      </div>
      <VocabularyPanel v-if="result.vocabulary.length" :vocabularies="result.vocabulary" />
      <SentenceAnalysis v-if="result.sentenceAnalysis" :analysis="result.sentenceAnalysis" />
      <div v-if="result.relatedQuestions" class="pt-2 border-t border-slate-100">
        <h4 class="font-semibold text-slate-800 mb-2 text-sm">相关提问</h4>
        <ul class="space-y-1 text-sm text-slate-600">
          <li v-for="q in result.relatedQuestions" :key="q" class="flex items-start gap-2">
            <span class="text-indigo-600 mt-0.5">•</span>
            <span>{{ q }}</span>
          </li>
        </ul>
      </div>
    </div>
    <div v-else class="text-center text-slate-400 py-8">暂无数据</div>
  </BaseCard>
</template>

<script setup lang="ts">
import BaseCard from '../common/BaseCard.vue'
import Loading from '../common/Loading.vue'
import ErrorState from '../common/ErrorState.vue'
import VocabularyPanel from './VocabularyPanel.vue'
import SentenceAnalysis from './SentenceAnalysis.vue'
import type { AIResult } from '../../types/ai'

defineProps<{
  loading?: boolean
  error?: string | null
  result?: AIResult | null
}>()
</script>

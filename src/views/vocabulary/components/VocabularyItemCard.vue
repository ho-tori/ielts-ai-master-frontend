<template>
  <BaseCard>
    <div class="flex items-start justify-between gap-3">
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{{ item.semanticCluster }}</span>
        </div>

        <!-- Synonym Pair -->
        <div class="flex items-center gap-2 mb-3 py-2 px-3 bg-surface-muted rounded-lg">
          <span class="text-text-primary font-bold text-base">{{ item.word }}</span>
          <span class="text-primary text-lg">→</span>
          <span class="text-primary font-bold text-base">{{ item.questionReplacement }}</span>
        </div>

        <!-- Source sentence -->
        <div v-if="item.sourceSentence" class="p-2 bg-surface-muted rounded text-sm text-text-secondary italic mb-2">
          {{ item.sourceSentence }}
        </div>

        <!-- Synonyms -->
        <div v-if="item.synonyms && item.synonyms.length > 0" class="flex flex-wrap gap-1 mb-2">
          <span class="text-xs text-text-secondary">近义词：</span>
          <span v-for="s in item.synonyms" :key="s" class="text-xs px-1.5 py-0.5 bg-slate-100 rounded">{{ s }}</span>
        </div>

        <!-- Examples -->
        <div v-if="item.exampleSentences && item.exampleSentences.length > 0" class="text-xs text-text-secondary space-y-1 mt-2">
          <p v-for="(ex, idx) in item.exampleSentences" :key="idx" class="pl-2 border-l-2 border-border">{{ ex }}</p>
        </div>
      </div>
      <BaseButton variant="ghost" size="sm" @click="$emit('delete')" title="删除">✕</BaseButton>
    </div>

    <!-- Nuance Notes -->
    <div v-if="item.nuanceNotes" class="mt-3 pt-3 border-t border-border/70">
      <p class="text-xs text-text-secondary leading-relaxed">
        <span class="font-medium text-text-primary">近义辨析：</span>{{ item.nuanceNotes }}
      </p>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { BaseCard, BaseButton } from '@/components'
import type { VocabularyItem } from '@/types/vocabulary'

defineProps<{ item: VocabularyItem }>()
defineEmits<{ (e: 'delete'): void }>()
</script>

<template>
  <BaseCard>
    <div class="flex items-start justify-between gap-4">
      <div class="min-w-0 flex-1">
        <span class="inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">{{ item.semanticCluster }}</span>
        <div class="mt-3 flex flex-wrap items-center gap-2 rounded-lg border border-border/60 bg-surface-muted/60 px-3 py-3">
          <span class="text-base font-semibold text-text-primary">{{ item.word }}</span>
          <Icon icon="heroicons:arrow-right" class="text-primary" />
          <span class="text-base font-semibold text-primary">{{ item.questionReplacement }}</span>
        </div>
      </div>
      <BaseButton variant="ghost" size="sm" @click="$emit('delete')" title="删除" aria-label="删除生词">
        <Icon icon="heroicons:trash" />
      </BaseButton>
    </div>

    <div v-if="item.sourceSentence" class="mt-4 rounded-lg border-l-4 border-primary/30 bg-surface-muted/55 px-3 py-3">
      <p class="text-sm italic leading-6 text-text-secondary">
        {{ item.sourceSentence }}
      </p>
    </div>

    <div v-if="item.synonyms && item.synonyms.length > 0" class="mt-4 flex flex-wrap items-center gap-2">
      <span class="text-xs font-medium text-text-secondary">近义词</span>
      <span v-for="s in item.synonyms" :key="s" class="rounded-md bg-surface-muted px-2 py-1 text-xs text-text-secondary">{{ s }}</span>
    </div>

    <div v-if="item.exampleSentences && item.exampleSentences.length > 0" class="mt-4 space-y-2 text-xs leading-5 text-text-secondary">
      <p v-for="(ex, idx) in item.exampleSentences" :key="idx" class="border-l-2 border-border pl-3">{{ ex }}</p>
    </div>

    <div v-if="item.nuanceNotes" class="mt-4 border-t border-border/60 pt-4">
      <p class="text-xs leading-relaxed text-text-secondary">
        <span class="font-medium text-text-primary">近义辨析：</span>{{ item.nuanceNotes }}
      </p>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { BaseCard, BaseButton } from '@/components'
import { Icon } from '@iconify/vue'
import type { VocabularyItem } from '@/types/vocabulary'

defineProps<{ item: VocabularyItem }>()
defineEmits<{ (e: 'delete'): void }>()
</script>

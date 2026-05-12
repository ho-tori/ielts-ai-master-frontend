<template>
  <BaseCard>
    <template #header>
      <h3 class="font-bold text-text-primary">AI 阅读能力诊断</h3>
    </template>
    <Loading v-if="loading" />
    <ErrorState v-else-if="error" :message="error" />
    <div v-else-if="diagnosis" class="space-y-4">
      <div class="p-4 bg-primary/5 rounded-lg border border-primary/20">
        <p class="text-text-primary leading-relaxed">{{ diagnosis }}</p>
      </div>
      <div v-for="w in weaknesses" :key="w.errorType" class="p-3 border border-border/70 rounded-lg">
        <div class="flex items-center gap-2 mb-2">
          <ErrorTypeBadge :type="w.errorType" />
          <span class="text-sm font-medium text-text-primary">核心薄弱点</span>
        </div>
        <p class="text-sm text-text-secondary mb-2">{{ w.description }}</p>
        <div class="flex items-start gap-1.5 text-sm text-primary">
          <span class="mt-0.5">💡</span>
          <span>{{ w.suggestion }}</span>
        </div>
      </div>
    </div>
    <Empty v-else>暂无诊断数据</Empty>
  </BaseCard>
</template>

<script setup lang="ts">
import { BaseCard, Loading, ErrorState, Empty } from '@/components'
import ErrorTypeBadge from './ErrorTypeBadge.vue'
import type { WeaknessItem } from '@/types/wrongAnswer'

defineProps<{
  diagnosis?: string | null
  weaknesses?: WeaknessItem[]
  loading?: boolean
  error?: string | null
}>()
</script>

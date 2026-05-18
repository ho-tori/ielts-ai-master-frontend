<template>
  <BaseCard>
    <template #header>
      <div class="flex items-center justify-between gap-3">
        <div>
          <h3 class="font-semibold text-text-primary">AI 阅读能力诊断</h3>
          <p class="mt-1 text-xs text-text-secondary">基于错题模式生成的复盘建议。</p>
        </div>
        <span class="icon-box bg-primary/10 text-primary">
          <Icon icon="heroicons:sparkles" />
        </span>
      </div>
    </template>
    <Loading v-if="loading" />
    <ErrorState v-else-if="error" :message="error" />
    <div v-else-if="diagnosis" class="space-y-4">
      <div class="rounded-lg border border-primary/20 bg-primary/5 p-4">
        <div class="mb-2 flex items-center gap-2">
          <Icon icon="heroicons:document-magnifying-glass" class="text-primary" />
          <p class="text-sm font-semibold text-text-primary">诊断摘要</p>
        </div>
        <p class="text-sm leading-7 text-text-primary">{{ diagnosis }}</p>
      </div>
      <div
        v-for="w in weaknesses"
        :key="w.errorType"
        class="rounded-lg border border-border/60 bg-surface-muted/35 p-4"
      >
        <div class="mb-3 flex flex-wrap items-center gap-2">
          <span class="rounded-md bg-surface px-2 py-1 text-xs font-semibold text-text-secondary ring-1 ring-border/60">薄弱点</span>
          <ErrorTypeBadge :type="w.errorType" />
        </div>
        <p class="mb-3 text-sm leading-6 text-text-secondary">{{ w.description }}</p>
        <div class="flex items-start gap-2 rounded-lg bg-surface px-3 py-3 text-sm text-primary ring-1 ring-border/50">
          <Icon icon="heroicons:light-bulb" class="mt-0.5 shrink-0 text-lg" />
          <span class="leading-6">{{ w.suggestion }}</span>
        </div>
      </div>
    </div>
    <Empty v-else>暂无诊断数据</Empty>
  </BaseCard>
</template>

<script setup lang="ts">
import { BaseCard, Loading, ErrorState, Empty } from '@/components'
import { Icon } from '@iconify/vue'
import ErrorTypeBadge from './ErrorTypeBadge.vue'
import type { WeaknessItem } from '@/types/wrongAnswer'

defineProps<{
  diagnosis?: string | null
  weaknesses?: WeaknessItem[]
  loading?: boolean
  error?: string | null
}>()
</script>

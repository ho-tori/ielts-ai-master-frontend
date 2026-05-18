<template>
  <div class="page-header rounded-lg border border-border/60 bg-surface/55 px-5 py-4 shadow-[inset_0_1px_0_rgb(255_255_255_/_0.7)] backdrop-blur">
    <div class="min-w-0">
      <div v-if="eyebrow" class="mb-1 text-xs font-semibold uppercase text-primary">
        {{ eyebrow }}
      </div>
      <h1 class="page-title">{{ title }}</h1>
      <p v-if="description" class="page-subtitle">{{ description }}</p>
    </div>
    <div v-if="$slots.actions" class="flex flex-wrap items-center gap-2">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description?: string
  eyebrow?: string
}>()
</script>

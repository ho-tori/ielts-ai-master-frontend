<template>
  <div class="p-3 bg-surface-muted rounded-lg border border-border hover:border-primary/30 hover:bg-surface transition-all cursor-pointer group" @click="$emit('select', sentence)">
    <p class="text-text-secondary leading-relaxed text-sm group-hover:text-primary transition-colors">
      {{ sentence }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  sentence: string
}>()

defineEmits<{
  (e: 'select', sentence: string): void
}>()
</script>

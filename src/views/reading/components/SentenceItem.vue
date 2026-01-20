<template>
  <div class="p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-100 transition-all cursor-pointer group" @click="$emit('select', sentence)">
    <p class="text-slate-700 leading-relaxed text-sm group-hover:text-indigo-600 transition-colors">
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

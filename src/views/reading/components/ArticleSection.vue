<script setup lang="ts">
const props = defineProps<{
  title: string
  content: string
}>()

const emit = defineEmits<{
  (e: 'on-select', text: string): void
}>()

const handleMouseUp = () => {
  const selection = window.getSelection()
  const text = selection?.toString().trim()
  if (text) {
    emit('on-select', text)
  }
}
</script>

<template>
  <div class="bg-surface-muted rounded-2xl p-8 flex flex-col border border-border">
    <h3 class="text-2xl font-bold mb-6 text-text-primary leading-tight">
      {{ title }}
    </h3>

    <div
      class="flex-1 pr-4 leading-relaxed text-text-secondary text-base"
      @mouseup="handleMouseUp"
    >
      {{ content }}
    </div>
  </div>
</template>

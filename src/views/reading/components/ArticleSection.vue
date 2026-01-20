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
  <div class="bg-slate-50 rounded-2xl p-8 flex flex-col border border-slate-200">
    <h3 class="text-2xl font-bold mb-6 text-slate-900 leading-tight">
      {{ title }}
    </h3>

    <div
      class="flex-1 pr-4 leading-relaxed text-slate-700 text-base"
      @mouseup="handleMouseUp"
    >
      {{ content }}
    </div>
  </div>
</template>

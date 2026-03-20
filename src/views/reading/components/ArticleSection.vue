<script setup lang="ts">
import type { Paragraph } from '@/types/article'

const props = defineProps<{
  title: string
  paragraphs: Paragraph[]
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
  <div class="bg-slate-50 rounded-2xl p-8 flex flex-col border border-slate-200 overflow-auto">
    <h3 class="text-2xl font-bold mb-6 text-slate-900 leading-tight">
      {{ title }}
    </h3>

    <div
      class="flex-1 pr-4 leading-relaxed text-slate-700 text-base space-y-4"
      @mouseup="handleMouseUp"
    >
      <div v-for="paragraph in paragraphs" :key="paragraph.paragraphNumber" class="paragraph-block">
        <p class="text-slate-800">{{ paragraph.content }}</p>
        <p v-if="paragraph.translation" class="text-slate-500 text-sm mt-1">{{ paragraph.translation }}</p>
      </div>
    </div>
  </div>
</template>

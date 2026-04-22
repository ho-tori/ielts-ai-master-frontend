<script setup lang="ts">
import type { Paragraph } from '@/types/article'

const props = defineProps<{
  title: string
  paragraphs: Paragraph[]
  visibleTranslations: Record<number, boolean>
}>()

const emit = defineEmits<{
  (e: 'on-select', text: string): void
  (e: 'toggle-translation', paragraphNumber: number): void
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
  <div class="bg-surface p-6 flex flex-col h-full overflow-y-auto">
    <h3 class="text-2xl font-bold mb-5 text-text-primary leading-tight">
      {{ title }}
    </h3>

    <div
      class="flex-1 pr-1 leading-relaxed text-text-secondary text-base"
      @mouseup="handleMouseUp"
    >
      <div v-for="paragraph in paragraphs" :key="paragraph.paragraphNumber" class="paragraph-block">
        <p class="text-slate-800">{{ paragraph.content }}</p>
        <p v-if="paragraph.translation && visibleTranslations[paragraph.paragraphNumber]" class="text-slate-500 text-sm mt-1">{{ paragraph.translation }}</p>
      </div>
    </div>
  </div>
</template>

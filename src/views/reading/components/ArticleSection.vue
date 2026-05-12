<script setup lang="ts">
import { computed } from 'vue'
import type { Paragraph } from '@/types/article'

interface HighlightRange {
  startOffset: number
  endOffset: number
  color: string
  id: number
}

const props = defineProps<{
  title: string
  paragraphs: Paragraph[]
  visibleTranslations: Record<number, boolean>
  highlights: Record<number, HighlightRange[]>  // paragraphNumber → highlights
  noteParagraphs: Set<number>  // paragraphs that have notes
}>()

const emit = defineEmits<{
  (e: 'on-select', text: string, paragraphNumber: number, startOffset: number, endOffset: number): void
  (e: 'toggle-translation', paragraphNumber: number): void
  (e: 'clear-highlights'): void
}>()

function getSegments(content: string, paraNum: number): Array<{ text: string; highlighted: boolean; color?: string }> {
  const ranges = (props.highlights[paraNum] || []).slice().sort((a, b) => a.startOffset - b.startOffset)
  if (ranges.length === 0) return [{ text: content, highlighted: false }]

  // Merge overlapping ranges
  const merged: HighlightRange[] = []
  for (const r of ranges) {
    const last = merged[merged.length - 1]
    if (last && r.startOffset <= last.endOffset) {
      last.endOffset = Math.max(last.endOffset, r.endOffset)
    } else {
      merged.push({ ...r })
    }
  }

  const segments: Array<{ text: string; highlighted: boolean; color?: string }> = []
  let cursor = 0
  for (const r of merged) {
    if (r.startOffset > cursor) {
      segments.push({ text: content.substring(cursor, r.startOffset), highlighted: false })
    }
    segments.push({ text: content.substring(r.startOffset, r.endOffset), highlighted: true, color: r.color })
    cursor = r.endOffset
  }
  if (cursor < content.length) {
    segments.push({ text: content.substring(cursor), highlighted: false })
  }
  return segments
}

function handleMouseUp(event: MouseEvent) {
  const selection = window.getSelection()
  if (!selection || selection.isCollapsed) return
  const text = selection.toString().trim()
  if (!text) return

  // 找到选区所在的段落和偏移量
  const anchorNode = selection.anchorNode
  if (!anchorNode) return

  // 向上找 .paragraph-block 容器
  let el: HTMLElement | null = anchorNode.parentElement
  while (el && !el.classList.contains('paragraph-block')) {
    el = el.parentElement
  }
  if (!el) return

  const paraNumAttr = el.getAttribute('data-para')
  if (!paraNumAttr) return
  const paragraphNumber = Number(paraNumAttr)

  // 计算选区在整个段落文本中的偏移
  const fullText = el.textContent || ''
  const range = selection.getRangeAt(0)
  const preRange = document.createRange()
  preRange.selectNodeContents(el)
  preRange.setEnd(range.startContainer, range.startOffset)
  const startOffset = preRange.toString().length
  const endOffset = startOffset + text.length

  emit('on-select', text, paragraphNumber, startOffset, endOffset)
}
</script>

<template>
  <div class="bg-surface p-6 flex flex-col h-full overflow-y-auto">
    <div class="flex items-center justify-between mb-5">
      <h3 class="text-2xl font-bold text-text-primary leading-tight">
        {{ title }}
      </h3>
    </div>

    <div
      class="flex-1 pr-1 leading-relaxed text-text-secondary text-base"
      @mouseup="handleMouseUp"
    >
      <div
        v-for="paragraph in paragraphs"
        :key="paragraph.paragraphNumber"
        :data-para="paragraph.paragraphNumber"
        class="paragraph-block mb-4"
      >
        <p class="text-slate-800">
          <template v-for="(seg, idx) in getSegments(paragraph.content, paragraph.paragraphNumber)" :key="idx">
            <mark v-if="seg.highlighted" :style="{ backgroundColor: seg.color || '#ffeb3b' }" class="rounded px-0.5">{{ seg.text }}</mark>
            <span v-else>{{ seg.text }}</span>
          </template>
          <span
            v-if="noteParagraphs.has(paragraph.paragraphNumber)"
            class="ml-1 text-xs text-primary cursor-help"
            title="此段落有笔记"
          >📝</span>
        </p>
        <p
          v-if="paragraph.translation && visibleTranslations[paragraph.paragraphNumber]"
          class="text-slate-500 text-sm mt-1"
        >{{ paragraph.translation }}</p>
      </div>
    </div>
  </div>
</template>

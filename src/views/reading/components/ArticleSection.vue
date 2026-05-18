<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import type { Paragraph } from '@/types/article'

interface HighlightRange {
  startOffset: number
  endOffset: number
  color: string
  id: number
}

interface TextSegment {
  text: string
  highlighted: boolean
  color?: string
  highlightId?: number
  paraNum?: number
}

const props = defineProps<{
  title: string
  paragraphs: Paragraph[]
  visibleTranslations: Record<number, boolean>
  highlights: Record<number, HighlightRange[]>
  noteParagraphs: Set<number>
  hasHighlights: boolean
}>()

const emit = defineEmits<{
  (e: 'on-select', text: string, paragraphNumber: number, startOffset: number, endOffset: number): void
  (e: 'toggle-translation', paragraphNumber: number): void
  (e: 'delete-highlight', highlightId: number): void
  (e: 'clear-highlights'): void
}>()

// 被点击的高亮状态
const clickedHighlight = ref<{ id: number; x: number; y: number } | null>(null)

function getSegments(content: string, paraNum: number): TextSegment[] {
  const ranges = (props.highlights[paraNum] || []).slice().sort((a, b) => a.startOffset - b.startOffset)
  if (ranges.length === 0) return [{ text: content, highlighted: false, paraNum }]

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

  const segments: TextSegment[] = []
  let cursor = 0
  for (const r of merged) {
    if (r.startOffset > cursor) {
      segments.push({ text: content.substring(cursor, r.startOffset), highlighted: false, paraNum })
    }
    segments.push({ text: content.substring(r.startOffset, r.endOffset), highlighted: true, color: r.color, highlightId: r.id, paraNum })
    cursor = r.endOffset
  }
  if (cursor < content.length) {
    segments.push({ text: content.substring(cursor), highlighted: false, paraNum })
  }
  return segments
}

function handleMouseUp() {
  const selection = window.getSelection()
  if (!selection || selection.isCollapsed) return
  const text = selection.toString().trim()
  if (!text) return

  const anchorNode = selection.anchorNode
  if (!anchorNode) return

  let el: HTMLElement | null = anchorNode.parentElement
  while (el && !el.classList.contains('paragraph-block')) {
    el = el.parentElement
  }
  if (!el) return

  const paraNumAttr = el.getAttribute('data-para')
  if (!paraNumAttr) return
  const paragraphNumber = Number(paraNumAttr)

  const range = selection.getRangeAt(0)
  const preRange = document.createRange()
  preRange.selectNodeContents(el)
  preRange.setEnd(range.startContainer, range.startOffset)
  const startOffset = preRange.toString().length
  const endOffset = startOffset + text.length

  emit('on-select', text, paragraphNumber, startOffset, endOffset)
}

function handleMarkClick(event: MouseEvent, seg: TextSegment) {
  event.stopPropagation()
  event.preventDefault()
  if (!seg.highlightId) return
  const rect = (event.target as HTMLElement).getBoundingClientRect()
  clickedHighlight.value = {
    id: seg.highlightId,
    x: rect.left + rect.width / 2,
    y: rect.top - 36
  }
}

function deleteClickedHighlight() {
  if (clickedHighlight.value) {
    emit('delete-highlight', clickedHighlight.value.id)
    clickedHighlight.value = null
  }
}

function closePopup() {
  clickedHighlight.value = null
}
</script>

<template>
  <div class="bg-surface p-6 flex flex-col h-full overflow-y-auto" @click="closePopup">
    <!-- 标题栏：文章标题 + 清除高亮按钮 -->
    <div class="flex items-center justify-between mb-5">
      <h3 class="text-2xl font-bold text-text-primary leading-tight">
        {{ title }}
      </h3>
      <button
        v-if="hasHighlights"
        class="shrink-0 ml-4 px-3 py-1.5 text-xs font-medium rounded-lg border border-border/70 bg-surface-muted text-text-secondary hover:bg-danger/5 hover:text-danger hover:border-danger/30 transition-colors"
        @click.stop="emit('clear-highlights'); clickedHighlight = null"
      >
        清除全部高亮
      </button>
    </div>

    <!-- 正文 -->
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
        <p class="text-text-primary">
          <template v-for="(seg, idx) in getSegments(paragraph.content, paragraph.paragraphNumber)" :key="idx">
            <mark
              v-if="seg.highlighted"
              :style="{ backgroundColor: seg.color || '#ffeb3b' }"
              class="rounded px-0.5 cursor-pointer hover:ring-2 hover:ring-primary/40 transition-all"
              @click.stop="handleMarkClick($event, seg)"
            >{{ seg.text }}</mark>
            <span v-else>{{ seg.text }}</span>
          </template>
          <Icon
            v-if="noteParagraphs.has(paragraph.paragraphNumber)"
            icon="heroicons:pencil-square"
            class="ml-1 inline text-primary cursor-help"
            title="此段落有笔记"
          />
        </p>
        <p
          v-if="paragraph.translation && visibleTranslations[paragraph.paragraphNumber]"
          class="text-text-secondary text-sm mt-1"
        >{{ paragraph.translation }}</p>
      </div>
    </div>

    <!-- 删除单个高亮的浮窗 -->
    <Teleport to="body">
      <div
        v-if="clickedHighlight"
        class="fixed z-50 bg-surface rounded-lg shadow-lg border border-border px-3 py-2 flex items-center gap-2 text-sm"
        :style="{ top: clickedHighlight.y + 'px', left: clickedHighlight.x + 'px', transform: 'translateX(-50%)' }"
      >
        <button
          class="text-danger hover:bg-danger/5 px-2 py-0.5 rounded transition-colors"
          @click.stop="deleteClickedHighlight"
        >删除此高亮</button>
      </div>
    </Teleport>
  </div>
</template>

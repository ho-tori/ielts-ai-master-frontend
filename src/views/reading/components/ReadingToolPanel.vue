<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { CSSProperties } from 'vue'
import QuestionPanel from './QuestionPanel.vue'
import AiResultPanel from './AiResultPanel.vue'
import RecentArticlesPanel from './RecentArticlesPanel.vue'
import type { Article, Question, RecentArticle } from '@/types/article'

interface ToolItem {
  key: 'questions' | 'translation' | 'ai' | 'notes' | 'recent'
  label: string
  icon: string
}

const props = defineProps<{
  rightPaneStyle: CSSProperties
  activeTool: ToolItem['key']
  toolItems: readonly ToolItem[]
  answeredCount: number
  currentProgressPercent: number
  sampleQuestions: Question[]
  showResults: boolean
  focusedQuestionId: number | null
  selectionContext: { text: string; articleTitle: string }
  currentArticle: Article
  notes: string
  recentArticles: RecentArticle[]
  currentArticleId?: string
}>()

const emit = defineEmits<{
  (e: 'update:activeTool', value: ToolItem['key']): void
  (e: 'update:notes', value: string): void
  (e: 'update-answer', questionId: number, answer: string): void
  (e: 'submit'): void
  (e: 'reset'): void
  (e: 'select-recent', articleId: string): void
}>()
</script>

<template>
  <aside class="border-l border-border/50 bg-surface overflow-hidden flex flex-col" :style="props.rightPaneStyle">
    <div class="px-3 pt-3 pb-2 border-b border-border/40 grid grid-cols-5 gap-2">
      <button
        v-for="item in props.toolItems"
        :key="item.key"
        type="button"
        @click="emit('update:activeTool', item.key)"
        :class="[
          'h-16 transition-all flex flex-col items-center justify-center gap-1',
          props.activeTool === item.key
            ? 'bg-primary/10 text-primary'
            : 'bg-transparent text-text-secondary hover:bg-surface-muted/80'
        ]"
      >
        <Icon :icon="item.icon" class="text-xl" />
        <span class="text-[10px] font-bold">{{ item.label }}</span>
      </button>
    </div>

    <div class="px-4 py-3 bg-surface-muted/40 border-b border-border/40">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-[10px] text-text-secondary/70 font-bold uppercase">答题状态</p>
          <p class="text-xs font-semibold text-text-primary">{{ props.answeredCount }}/{{ props.sampleQuestions.length }} 已完成</p>
        </div>
        <div class="text-sm font-bold" :class="props.currentProgressPercent === 100 ? 'text-success' : 'text-primary'">
          {{ props.currentProgressPercent }}%
        </div>
      </div>
    </div>

    <div class="flex-1 min-h-0 overflow-y-auto px-3 pt-2 pb-4">
      <QuestionPanel
        v-if="props.activeTool === 'questions'"
        :questions="props.sampleQuestions"
        :show-results="props.showResults"
        :focus-question-id="props.focusedQuestionId"
        @update-answer="(questionId, answer) => emit('update-answer', questionId, answer)"
        @submit="emit('submit')"
        @reset="emit('reset')"
      />

      <section v-else-if="props.activeTool === 'translation'" class="space-y-3">
        <h3 class="font-semibold text-text-primary py-1">翻译</h3>
        <div
          v-for="p in props.currentArticle.paragraphs"
          :key="`trans-${p.paragraphNumber}`"
          class="p-3 bg-surface-muted/40"
        >
          <p class="text-xs font-semibold text-text-secondary mb-1">段落 {{ p.paragraphNumber }}</p>
          <p class="text-sm text-text-primary">{{ p.translation || '暂无翻译' }}</p>
        </div>
      </section>

      <AiResultPanel v-else-if="props.activeTool === 'ai'" :selection="props.selectionContext" />

      <section v-else-if="props.activeTool === 'notes'" class="pt-1">
        <h3 class="font-semibold text-text-primary mb-3">笔记</h3>
        <textarea
          :value="props.notes"
          @input="emit('update:notes', ($event.target as HTMLTextAreaElement).value)"
          class="w-full min-h-[260px] bg-surface-muted/40 px-3 py-2 text-sm text-text-primary outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="记录你的关键词、错误点和复盘要点..."
        ></textarea>
      </section>

      <section v-else class="pt-1">
        <h3 class="font-semibold text-text-primary mb-3">最近阅读</h3>
        <RecentArticlesPanel
          :articles="props.recentArticles"
          :active-article-id="props.currentArticleId"
          @select="(articleId) => emit('select-recent', articleId)"
        />
      </section>
    </div>
  </aside>
</template>

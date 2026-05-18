<template>
  <div class="interactive-row group flex cursor-pointer flex-col overflow-hidden p-0" @click="$emit('start', article.id)">
    <div class="flex flex-1 flex-col gap-4 p-5">
      <div class="flex flex-wrap items-center gap-2">
        <span class="rounded-md bg-primary/10 px-2 py-1 text-[11px] font-semibold text-primary">
            {{ article.examType }}
          </span>
          <span class="flex items-center rounded-md bg-surface-muted px-2 py-1 text-[11px] font-semibold" :class="getDifficultyColor(article.difficulty)">
            {{ getDifficultyLabel(article.difficulty) }}
          </span>
          <span
            v-for="topic in (article.topics || [])"
            :key="topic.id"
            class="rounded-md bg-surface-muted px-2 py-1 text-[11px] text-text-secondary"
          >
            {{ topic.name }}
          </span>
        </div>

        <h4 class="line-clamp-2 min-h-[3.25rem] text-lg font-semibold leading-7 text-text-primary transition-colors group-hover:text-primary">
          {{ article.title }}
        </h4>

        <div class="mt-auto flex flex-wrap items-center gap-4 text-xs text-text-secondary">
          <span class="inline-flex items-center gap-1">
            <Icon icon="heroicons:list-bullet" />{{ article.questions?.length || 0 }} 题
          </span>
          <span v-if="article.paragraphs?.length" class="inline-flex items-center gap-1">
            <Icon icon="heroicons:document-text" />{{ article.paragraphs.length }} 段落
          </span>
        </div>
    </div>

    <div class="flex flex-col gap-3 border-t border-border/45 bg-surface-muted/35 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="min-w-0 flex-1">
        <span
          :class="[
            'inline-flex rounded-full px-2.5 py-1 text-xs font-medium',
            progress?.completed
              ? 'bg-success/15 text-success'
              : progress
                ? 'bg-primary/10 text-primary'
                : 'bg-surface-muted text-text-secondary'
          ]"
        >
          {{ progress?.completed ? '已完成' : progress ? `已答${progress.answeredQuestions}/${progress.totalQuestions}题` : '未开始' }}
        </span>
        <div v-if="progress" class="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface">
          <div
            class="h-full rounded-full bg-primary transition-all duration-500"
            :style="{ width: Math.min(100, Math.round(progress.answeredQuestions * 100 / Math.max(progress.totalQuestions, 1))) + '%' }"
          />
        </div>
      </div>
      <BaseButton variant="primary" size="sm">
        {{ progress ? '继续练习' : '开始练习' }}
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BaseButton } from '@/components'
import { Icon } from '@iconify/vue'
import type { ArticleListItem } from '@/types/article'

defineProps<{
  article: ArticleListItem
  progress?: { totalQuestions: number; answeredQuestions: number; correctAnswers: number; completed: boolean } | null
}>()

defineEmits<{ (e: 'start', id: number): void }>()

function getDifficultyLabel(difficulty: string) {
  const map: Record<string, string> = { '简单': '简单', 'easy': '简单', '中等': '中等', 'medium': '中等', '困难': '困难', 'hard': '困难' }
  return map[difficulty] || difficulty || '中等'
}

function getDifficultyColor(difficulty: string) {
  if (difficulty === '简单' || difficulty === 'easy') return 'text-success'
  if (difficulty === '中等' || difficulty === 'medium') return 'text-primary'
  if (difficulty === '困难' || difficulty === 'hard') return 'text-danger'
  return 'text-text-secondary'
}
</script>

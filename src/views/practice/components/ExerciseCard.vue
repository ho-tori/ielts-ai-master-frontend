<template>
  <div class="group p-5 bg-surface border border-border/70 rounded-2xl hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 transition-all cursor-pointer"
       @click="$emit('start', article.id)">
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <!-- Tags -->
        <div class="flex items-center space-x-3 mb-3">
          <span class="px-2 py-0.5 text-[10px] font-black rounded uppercase bg-primary/10 text-primary">
            {{ article.examType }}
          </span>
          <span class="flex items-center text-[11px] font-bold" :class="getDifficultyColor(article.difficulty)">
            {{ getDifficultyLabel(article.difficulty) }}
          </span>
          <span
            v-for="topic in (article.topics || [])"
            :key="topic.id"
            class="px-2 py-0.5 bg-surface-muted text-text-secondary text-[10px] rounded"
          >
            {{ topic.name }}
          </span>
        </div>

        <!-- Title -->
        <h4 class="text-lg font-bold text-text-primary group-hover:text-primary transition-colors line-clamp-2 mb-2">
          {{ article.title }}
        </h4>

        <!-- Stats -->
        <div class="flex items-center space-x-6 text-xs text-text-secondary/70">
          <span>{{ article.questions?.length || 0 }} 题</span>
          <span v-if="article.paragraphs?.length">{{ article.paragraphs.length }} 段落</span>
        </div>
      </div>

      <!-- Right: status + button -->
      <div class="flex flex-col items-end space-y-3 ml-4">
        <span
          :class="[
            'px-3 py-1 text-[10px] font-bold rounded-full',
            progress?.completed
              ? 'bg-success/15 text-success'
              : progress
                ? 'bg-primary/10 text-primary'
                : 'bg-surface-muted text-text-secondary'
          ]"
        >
          {{ progress?.completed ? '已完成' : progress ? `已答${progress.answeredQuestions}/${progress.totalQuestions}题` : '未开始' }}
        </span>
        <BaseButton variant="primary" size="sm">
          {{ progress ? '继续练习' : '开始练习' }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BaseButton } from '@/components'
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

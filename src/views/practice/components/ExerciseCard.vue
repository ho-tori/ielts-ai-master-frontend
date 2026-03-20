<template>
  <div class="group p-5 bg-surface border border-border/70 rounded-2xl hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 transition-all cursor-pointer">
    <div class="flex items-start justify-between">
      <!-- 左侧内容 -->
      <div class="flex-1">
        <!-- 标签区域 -->
        <div class="flex items-center space-x-3 mb-3">
          <span :class="['px-2 py-0.5 text-[10px] font-black rounded uppercase', getCategoryClass(exercise.category)]">
            {{ getCategoryLabel(exercise.category) }}
          </span>
          <span class="flex items-center text-[11px] font-bold" :class="getDifficultyColor(exercise.difficulty)">
            <Icon :icon="getDifficultyIcon(exercise.difficulty)" class="mr-1" /> 
            {{ getDifficultyLabel(exercise.difficulty) }}
          </span>
        </div>

        <!-- 标题 -->
        <h4 class="text-lg font-bold text-text-primary group-hover:text-primary transition-colors line-clamp-2 mb-2">
          {{ exercise.title }}
        </h4>

        <!-- 描述 -->
        <p class="text-xs text-text-secondary line-clamp-2 mb-3">
          {{ exercise.description }}
        </p>

        <!-- 统计信息 -->
        <div class="flex items-center space-x-6 text-xs text-text-secondary/70">
          <span class="flex items-center">
            <Icon icon="heroicons:document-text" class="mr-1.5" /> 
            {{ exercise.wordCount }} 词
          </span>
          <span class="flex items-center">
            <Icon icon="heroicons:clock" class="mr-1.5" /> 
            {{ exercise.estimatedTime }}
          </span>
          <div class="flex items-center gap-2">
            <span 
              v-for="tag in exercise.tags.slice(0, 2)"
              :key="tag"
              class="px-2 py-0.5 bg-surface-muted text-text-secondary text-[10px] rounded"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>

      <!-- 右侧操作区 -->
      <div class="flex flex-col items-end space-y-3 ml-4">
        <span 
          :class="[
            'px-3 py-1 text-[10px] font-bold rounded-full',
            exercise.completed 
              ? 'bg-success/15 text-success' 
              : 'bg-surface-muted text-text-secondary'
          ]"
        >
          {{ exercise.completed ? '完成过' : '未开始' }}
        </span>
        <BaseButton 
          @click="$emit('start', exercise.id)"
          variant="primary" 
          size="sm"
        >
          开始练习
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { BaseButton } from '@/components'
import type { Exercise } from '../../../types/article'

defineProps<{
  exercise: Exercise
}>()

defineEmits<{
  (e: 'start', id: number): void
}>()

const getDifficultyLabel = (difficulty: string) => {
  switch(difficulty) {
    case 'easy':
      return '基础'
    case 'medium':
      return '中等'
    case 'hard':
      return '挑战'
    default:
      return '未知'
  }
}

const getDifficultyIcon = (difficulty: string) => {
  switch(difficulty) {
    case 'easy':
      return 'heroicons:academic-cap-solid'
    case 'medium':
      return 'heroicons:star-solid'
    case 'hard':
      return 'heroicons:fire-solid'
    default:
      return 'heroicons:star-solid'
  }
}

const getDifficultyColor = (difficulty: string) => {
  switch(difficulty) {
    case 'easy':
      return 'text-success'
    case 'medium':
      return 'text-primary'
    case 'hard':
      return 'text-danger'
    default:
      return 'text-text-secondary'
  }
}

const getCategoryLabel = (category: string) => {
  switch(category) {
    case 'news':
      return '新闻'
    case 'academic':
      return '学术'
    case 'fiction':
      return '文学'
    default:
      return '其他'
  }
}

const getCategoryClass = (category: string) => {
  switch(category) {
    case 'news':
      return 'bg-surface-muted text-text-secondary'
    case 'academic':
      return 'bg-primary/10 text-primary'
    case 'fiction':
      return 'bg-surface-muted text-text-secondary'
    default:
      return 'bg-surface-muted text-text-secondary'
  }
}
</script>

<style scoped>
</style>

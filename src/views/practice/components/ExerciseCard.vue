<template>
  <div class="group p-5 bg-white border border-slate-100 rounded-2xl hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-50 transition-all cursor-pointer">
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
        <h4 class="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-2 mb-2">
          {{ exercise.title }}
        </h4>

        <!-- 描述 -->
        <p class="text-xs text-slate-500 line-clamp-2 mb-3">
          {{ exercise.description }}
        </p>

        <!-- 统计信息 -->
        <div class="flex items-center space-x-6 text-xs text-slate-400">
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
              class="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>

      <!-- 右侧操作区 -->
      <div class="flex flex-col items-end space-y-3 ml-4">
        <span class="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-full">
          {{ exercise.completed ? '已完成' : '未开始' }}
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
      return 'text-blue-500'
    case 'medium':
      return 'text-amber-500'
    case 'hard':
      return 'text-red-500'
    default:
      return 'text-gray-500'
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
      return 'bg-blue-50 text-blue-600'
    case 'academic':
      return 'bg-indigo-50 text-indigo-600'
    case 'fiction':
      return 'bg-purple-50 text-purple-600'
    default:
      return 'bg-slate-50 text-slate-600'
  }
}
</script>

<style scoped>
</style>

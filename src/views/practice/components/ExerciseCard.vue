<template>
  <div class="group">
    <BaseCard class="h-full flex flex-col hover:shadow-md transition-shadow cursor-pointer">
      <!-- 卡片头部 -->
      <div class="mb-4 pb-4 border-b border-slate-200">
        <h3 class="text-lg font-semibold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">
          {{ exercise.title }}
        </h3>
        
        <!-- 难度和分类标签 -->
        <div class="flex gap-2 flex-wrap">
          <span :class="['inline-block px-3 py-1 rounded-full text-xs font-medium', getDifficultyClass(exercise.difficulty)]">
            {{ getDifficultyLabel(exercise.difficulty) }}
          </span>
          <span class="inline-block px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
            {{ getCategoryLabel(exercise.category) }}
          </span>
        </div>
      </div>

      <!-- 卡片内容 -->
      <div class="flex-1 mb-4">
        <p class="text-sm text-slate-600 mb-4 line-clamp-3">
          {{ exercise.description }}
        </p>

        <!-- 标签 -->
        <div class="flex gap-2 flex-wrap mb-4">
          <span 
            v-for="tag in exercise.tags"
            :key="tag"
            class="inline-block px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded"
          >
            {{ tag }}
          </span>
        </div>

        <!-- 统计信息 -->
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div class="flex items-center gap-2 text-slate-600">
            <Icon icon="heroicons:document-text" class="text-lg" />
            <span>{{ exercise.wordCount }} 词</span>
          </div>
          <div class="flex items-center gap-2 text-slate-600">
            <Icon icon="heroicons:clock" class="text-lg" />
            <span>{{ exercise.estimatedTime }}</span>
          </div>
        </div>
      </div>

      <!-- 底部按钮 -->
      <div class="pt-4 border-t border-slate-200">
        <BaseButton 
          @click="$emit('start', exercise.id)"
          variant="primary" 
          class="w-full"
        >
          开始练习
        </BaseButton>
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import BaseCard from '../../../components/common/BaseCard.vue'
import BaseButton from '../../../components/common/BaseButton.vue'
import type { Exercise } from '../../../types/article'

defineProps<{
  exercise: Exercise
}>()

defineEmits<{
  (e: 'start', id: number): void
}>()

const getDifficultyClass = (difficulty: string) => {
  switch(difficulty) {
    case 'easy':
      return 'bg-green-50 text-green-700 border border-green-200'
    case 'medium':
      return 'bg-amber-50 text-amber-700 border border-amber-200'
    case 'hard':
      return 'bg-red-50 text-red-700 border border-red-200'
    default:
      return 'bg-slate-50 text-slate-700 border border-slate-200'
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

const getDifficultyLabel = (difficulty: string) => {
  switch(difficulty) {
    case 'easy':
      return '简单'
    case 'medium':
      return '中等'
    case 'hard':
      return '困难'
    default:
      return '未知'
  }
}
</script>

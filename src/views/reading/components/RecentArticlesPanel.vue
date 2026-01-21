<script setup lang="ts">
import type { RecentArticle } from '@/types/article'

interface Props {
  articles: RecentArticle[]
  activeArticleId?: string
}

interface Emits {
  (e: 'select', id: string): void
}

defineProps<Props>()
defineEmits<Emits>()

const categoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    'news': '新闻',
    'academic': '学术',
    'fiction': '文学'
  }
  return labels[category] || category
}

const categoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    'news': 'bg-blue-50 border-blue-200',
    'academic': 'bg-indigo-50 border-indigo-200',
    'fiction': 'bg-purple-50 border-purple-200'
  }
  return colors[category] || 'bg-gray-50 border-gray-200'
}

const getBorderClass = (category: string, isActive: boolean): string => {
  if (isActive) {
    return 'border border-indigo-200 ring-2 ring-indigo-400'
  }
  const colors: Record<string, string> = {
    'news': 'border border-blue-200',
    'academic': 'border border-indigo-200',
    'fiction': 'border border-purple-200'
  }
  return colors[category] || 'border border-gray-200'
}

const categoryBadgeColor = (category: string): string => {
  const colors: Record<string, string> = {
    'news': 'bg-blue-100 text-blue-800',
    'academic': 'bg-indigo-100 text-indigo-800',
    'fiction': 'bg-purple-100 text-purple-800'
  }
  return colors[category] || 'bg-gray-100 text-gray-800'
}
</script>

<template>
  <div v-if="articles.length > 0" class="mb-6">
    <div class="mb-3">
      <h3 class="text-sm font-semibold text-slate-900">最近阅读</h3>
    </div>
    
    <!-- 水平滚动卡片 -->
    <div class="overflow-x-auto pb-2 -mx-4 px-4 pt-2">
      <div class="flex gap-3 min-w-min">
        <div
          v-for="(article, index) in articles"
          :key="article.id"
          @click="$emit('select', String(article.id))"
          :class="[categoryColor(article.category), getBorderClass(article.category, activeArticleId === String(article.id))]"
          class="flex-shrink-0 w-64 p-3 rounded-lg cursor-pointer transition"
        >
          <!-- 编号标签 -->
          <div class="flex items-center justify-between mb-2">
            <span class="inline-block w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
              {{ index + 1 }}
            </span>
            <span :class="categoryBadgeColor(article.category)" class="text-xs font-medium px-2 py-1 rounded">
              {{ categoryLabel(article.category) }}
            </span>
          </div>

          <!-- 标题 -->
          <h4 class="text-sm font-semibold text-slate-900 line-clamp-2 mb-2">
            {{ article.title }}
          </h4>

          <!-- 进度条 -->
          <div v-if="article.progress !== undefined" class="mb-2">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs text-slate-500">作答进度</span>
              <span class="text-xs font-semibold text-slate-700">{{ article.progress }}%</span>
            </div>
            <div class="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div 
                class="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
                :style="{ width: `${article.progress}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 隐藏滚动条但保持滚动功能 */
.overflow-x-auto {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.overflow-x-auto::-webkit-scrollbar {
  display: none;
}
</style>

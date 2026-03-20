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
    'news': 'bg-surface-muted border-border',
    'academic': 'bg-surface-muted border-border',
    'fiction': 'bg-surface-muted border-border'
  }
  return colors[category] || 'bg-surface-muted border-border'
}

const getBorderClass = (category: string, isActive: boolean): string => {
  if (isActive) {
    return 'border border-primary/30 ring-2 ring-primary/40'
  }
  const colors: Record<string, string> = {
    'news': 'border border-border',
    'academic': 'border border-border',
    'fiction': 'border border-border'
  }
  return colors[category] || 'border border-border'
}

const categoryBadgeColor = (category: string): string => {
  const colors: Record<string, string> = {
    'news': 'bg-surface text-text-secondary border border-border',
    'academic': 'bg-primary/10 text-primary border border-primary/20',
    'fiction': 'bg-surface text-text-secondary border border-border'
  }
  return colors[category] || 'bg-surface text-text-secondary border border-border'
}
</script>

<template>
  <div v-if="articles.length > 0" class="mb-6">
    <div class="mb-3">
      <h3 class="text-sm font-semibold text-text-primary">最近阅读</h3>
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
            <div class="flex items-center gap-2">
              <span class="inline-block w-6 h-6 rounded-full bg-text-primary text-white text-xs font-bold flex items-center justify-center">
                {{ index + 1 }}
              </span>
              <span v-if="article.everCompleted" class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-success/15 text-success">
                <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/>
                </svg>
                完成过
              </span>
            </div>
            <span :class="categoryBadgeColor(article.category)" class="text-xs font-medium px-2 py-1 rounded">
              {{ categoryLabel(article.category) }}
            </span>
          </div>

          <!-- 标题 -->
          <h4 class="text-sm font-semibold text-text-primary line-clamp-2 mb-2">
            {{ article.title }}
          </h4>

          <!-- 进度条 -->
          <div v-if="article.progress !== undefined" class="mb-2">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs text-text-secondary">作答进度</span>
              <span class="text-xs font-semibold text-text-primary">{{ article.progress }}%</span>
            </div>
            <div class="w-full h-1.5 bg-border rounded-full overflow-hidden">
              <div 
                class="h-full bg-gradient-to-r from-primary to-primary-hover transition-all"
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
/* 自定义水平滚动条样式 */
.overflow-x-auto {
  scrollbar-width: thin;
  scrollbar-color: rgb(var(--color-primary) / 0.4) transparent;
}

.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: rgb(var(--color-primary) / 0.4);
  border-radius: 3px;
  transition: background 0.2s;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: rgb(var(--color-primary));
}
</style>

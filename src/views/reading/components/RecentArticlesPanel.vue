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
  <div v-if="articles.length > 0" class="mb-2">
    <div class="mb-3">
      <h3 class="text-sm font-semibold text-text-primary">最近阅读</h3>
    </div>
    
    <div class="overflow-x-auto pb-2 -mx-4 px-4 pt-2">
      <div class="flex gap-3 min-w-min">
        <div
          v-for="(article, index) in articles"
          :key="article.id"
          @click="$emit('select', String(article.id))"
          :class="[categoryColor(article.category || 'academic'), getBorderClass(article.category || 'academic', activeArticleId === String(article.id))]"
          class="flex-shrink-0 w-64 p-3 cursor-pointer transition"
        >
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <span class="inline-block w-6 h-6 rounded-full bg-text-primary text-white text-xs font-bold flex items-center justify-center">
                {{ index + 1 }}
              </span>
            </div>
            <span :class="categoryBadgeColor(article.category || 'academic')" class="text-xs font-medium px-2 py-1">
              {{ categoryLabel(article.category || 'academic') }}
            </span>
          </div>

          <h4 class="text-sm font-semibold text-text-primary line-clamp-2 mb-2">
            {{ article.title }}
          </h4>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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

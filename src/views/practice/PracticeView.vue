<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import SearchBar from './components/SearchBar.vue'
import ExerciseCard from './components/ExerciseCard.vue'
import EmptyState from './components/EmptyState.vue'
import { getArticleList, apiGetProgress } from '@/api/article'
import { useUserStore } from '@/stores/user'
import { BaseButton, PageHeader } from '@/components'
import { Icon } from '@iconify/vue'
import type { ArticleListItem } from '@/types/article'

const router = useRouter()
const userStore = useUserStore()

const searchKeyword = ref('')
const selectedDifficulty = ref<string>('all')
const selectedCategory = ref<'all' | 'A类' | 'G类'>('all')

const articles = ref<ArticleListItem[]>([])
const progressMap = ref<Record<number, any>>({})
const loading = ref(false)
const error = ref<string | null>(null)

const fetchArticles = async () => {
  loading.value = true
  error.value = null
  try {
    const examType = selectedCategory.value === 'all' ? undefined : selectedCategory.value
    const difficulty = selectedDifficulty.value === 'all' ? undefined : selectedDifficulty.value
    const { data } = await getArticleList({ examType, difficulty, page: 0, size: 100 })
    if (data.code === 0) {
      articles.value = data.data || []
    } else {
      error.value = data.message || '获取练习列表失败'
    }
  } catch (e) {
    console.error('获取练习列表失败', e)
    error.value = '网络错误，请检查后端服务是否启动'
    articles.value = []
  } finally {
    loading.value = false
  }
}

const fetchProgress = async () => {
  try {
    const { data } = await apiGetProgress()
    if (data.code === 0) {
      progressMap.value = data.data || {}
    }
  } catch (e) {
    console.error('获取进度失败', e)
  }
}

onMounted(async () => {
  await Promise.all([fetchArticles(), fetchProgress()])
})

const filteredArticles = computed(() => {
  return articles.value.filter(article => {
    if (!searchKeyword.value) return true
    const keyword = searchKeyword.value.toLowerCase()
    const titleMatch = article.title.toLowerCase().includes(keyword)
    const topicMatch = (article.topics || []).some(t =>
      t.name.toLowerCase().includes(keyword) || t.code.toLowerCase().includes(keyword)
    )
    return titleMatch || topicMatch
  })
})

const handleSearch = (value: string) => {
  searchKeyword.value = value
}

const handleDifficultyChange = async (value: string) => {
  selectedDifficulty.value = value as any
  await fetchArticles()
}

const handleCategoryChange = async (value: string) => {
  selectedCategory.value = value as any
  await fetchArticles()
}

const startPractice = (articleId: number) => {
  userStore.addRecentArticle(articleId)
  router.push(`/reading?articleId=${articleId}`)
}

const getArticleProgress = (articleId: number) => {
  return progressMap.value[articleId] || null
}
</script>

<template>
  <div class="app-page">
    <PageHeader
      title="练习中心"
      description="按考试类型、难度和话题筛选阅读文章，快速进入练习。"
    >
      <template #actions>
        <BaseButton @click="router.push('/ielts-intro')">
          <Icon icon="heroicons:map" />
          雅思流程
        </BaseButton>
      </template>
    </PageHeader>

    <SearchBar
      v-model="searchKeyword"
      :difficulty="selectedDifficulty"
      :category="selectedCategory"
      @update:modelValue="handleSearch"
      @update:difficulty="handleDifficultyChange"
      @update:category="handleCategoryChange"
    />

    <div class="surface-panel-muted flex items-center justify-between gap-3 px-4 py-3">
      <p class="flex items-center gap-2 text-sm text-text-secondary">
        <Icon icon="heroicons:document-magnifying-glass" class="text-primary" />
        找到 <span class="font-semibold text-text-primary">{{ filteredArticles.length }}</span> 篇文章
      </p>
      <span class="hidden text-xs text-text-secondary sm:inline">筛选结果会随条件实时更新</span>
    </div>

    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <div v-else-if="error" class="p-4 bg-danger/10 border border-danger/30 rounded-lg">
      <p class="text-danger text-sm">{{ error }}</p>
    </div>

    <div v-else-if="filteredArticles.length > 0" class="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <ExerciseCard
        v-for="article in filteredArticles"
        :key="article.id"
        :article="article"
        :progress="getArticleProgress(article.id)"
        @start="startPractice"
      />
    </div>

    <EmptyState v-else />
  </div>
</template>

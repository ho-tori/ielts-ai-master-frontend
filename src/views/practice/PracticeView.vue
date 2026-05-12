<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import SearchBar from './components/SearchBar.vue'
import ExerciseCard from './components/ExerciseCard.vue'
import EmptyState from './components/EmptyState.vue'
import Pagination from './components/Pagination.vue'
import { getArticleList, apiGetProgress } from '@/api/article'
import { useUserStore } from '@/stores/user'
import type { ArticleListItem } from '@/types/article'

const router = useRouter()
const userStore = useUserStore()

const currentPage = ref(1)
const itemsPerPage = 9

const searchKeyword = ref('')
const selectedDifficulty = ref<'all' | 'easy' | 'medium' | 'hard'>('all')
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
    const { data } = await getArticleList({ examType, difficulty, page: currentPage.value - 1 })
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

const totalPages = computed(() => Math.max(1, Math.ceil(filteredArticles.value.length / itemsPerPage)))

const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredArticles.value.slice(start, start + itemsPerPage)
})

const handleSearch = (value: string) => {
  searchKeyword.value = value
  currentPage.value = 1
}

const handleDifficultyChange = (value: string) => {
  selectedDifficulty.value = value as any
  currentPage.value = 1
  fetchArticles()
}

const handleCategoryChange = async (value: string) => {
  selectedCategory.value = value as any
  currentPage.value = 1
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
  <div class="space-y-6">
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-text-primary mb-2">练习中心</h1>
        <p class="text-text-secondary">搜索并练习IELTS阅读考试题目</p>
      </div>
      <button
        @click="router.push('/ielts-intro')"
        class="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white font-medium transition-colors"
      >
        <span>雅思考试流程指南</span>
      </button>
    </div>

    <SearchBar
      v-model="searchKeyword"
      :difficulty="selectedDifficulty"
      :category="selectedCategory"
      @update:modelValue="handleSearch"
      @update:difficulty="handleDifficultyChange"
      @update:category="handleCategoryChange"
    />

    <div class="mb-6">
      <p class="text-text-secondary">
        找到 <span class="font-semibold text-text-primary">{{ filteredArticles.length }}</span> 篇文章
        <span v-if="totalPages > 1" class="text-text-secondary/70">
          · 第 {{ currentPage }} / {{ totalPages }} 页
        </span>
      </p>
    </div>

    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <div v-else-if="error" class="p-4 bg-danger/10 border border-danger/30 rounded-lg">
      <p class="text-danger text-sm">{{ error }}</p>
    </div>

    <div v-else-if="paginatedArticles.length > 0" class="space-y-4">
      <ExerciseCard
        v-for="article in paginatedArticles"
        :key="article.id"
        :article="article"
        :progress="getArticleProgress(article.id)"
        @start="startPractice"
      />
    </div>

    <EmptyState v-else />

    <div class="mt-8">
      <Pagination
        :current-page="currentPage"
        :total-pages="totalPages"
        @update:current-page="currentPage = $event"
      />
    </div>
  </div>
</template>

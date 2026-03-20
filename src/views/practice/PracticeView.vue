<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import SearchBar from './components/SearchBar.vue'
import ExerciseCard from './components/ExerciseCard.vue'
import EmptyState from './components/EmptyState.vue'
import Pagination from './components/Pagination.vue'
import { getArticleList } from '@/api/article'
import { useUserStore } from '@/stores/user'
import type { Exercise } from '../../types/article'

const router = useRouter()
const userStore = useUserStore()

const currentPage = ref(1)
const itemsPerPage = 9

const searchKeyword = ref('')
const selectedDifficulty = ref<'all' | 'easy' | 'medium' | 'hard'>('all')
const selectedCategory = ref<'all' | 'news' | 'academic' | 'fiction'>('all')

const exercisesFromApi = ref<Exercise[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const fetchExercises = async () => {
  loading.value = true
  error.value = null
  try {
    const { data } = await getArticleList({ 
      examType: selectedCategory.value === 'all' ? undefined : selectedCategory.value,
      difficulty: selectedDifficulty.value === 'all' ? undefined : selectedDifficulty.value,
      page: currentPage.value - 1
    })
    if (data.code === 0) {
      exercisesFromApi.value = data.data.map((article: any) => ({
        id: article.id,
        title: article.title,
        description: article.description || '',
        difficulty: article.difficulty || 'medium',
        category: article.examType || 'academic',
        examType: article.examType,
        tags: article.tags || [],
        wordCount: article.wordCount || 0,
        estimatedTime: article.readingTime ? `${article.readingTime}分钟` : '15分钟',
        questionCount: article.questions?.length || 0,
        completed: false
      }))
    } else {
      error.value = data.message || '获取练习列表失败'
    }
  } catch (e) {
    console.error('从后端获取练习列表失败', e)
    error.value = '网络错误，请检查后端服务是否启动'
    exercisesFromApi.value = []
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await fetchExercises()
})

const filteredExercises = computed(() => {
  return exercisesFromApi.value.filter(exercise => {
    const matchKeyword = !searchKeyword.value || 
      exercise.title.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      exercise.description.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      exercise.tags.some(tag => tag.toLowerCase().includes(searchKeyword.value.toLowerCase()))
    
    return matchKeyword
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredExercises.value.length / itemsPerPage)))

const paginatedExercises = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredExercises.value.slice(start, end)
})

const handleSearch = (value: string) => {
  searchKeyword.value = value
  currentPage.value = 1
}

const handleDifficultyChange = (value: string) => {
  selectedDifficulty.value = value as any
  currentPage.value = 1
}

const handleCategoryChange = async (value: string) => {
  selectedCategory.value = value as any
  currentPage.value = 1
  await fetchExercises()
}

const startPractice = (exerciseId: number) => {
  console.log('🚀 开始练习，exerciseId:', exerciseId)
  
  const articleId = exerciseId
  
  userStore.addRecentArticle(articleId)
  
  router.push(`/reading?exerciseId=${exerciseId}`)
}
</script>

<template>
  <div class="space-y-6">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-text-primary mb-2">练习中心</h1>
      <p class="text-text-secondary">搜索并练习IELTS阅读考试题目</p>
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
        找到 <span class="font-semibold text-text-primary">{{ filteredExercises.length }}</span> 个相关习题
        <span v-if="totalPages > 1" class="text-text-secondary/70">
          · 第 {{ currentPage }} / {{ totalPages }} 页
        </span>
      </p>
    </div>

    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <div v-else-if="error" class="p-4 bg-danger/10 border border-danger/30 rounded-lg">
      <p class="text-danger text-sm">❌ {{ error }}</p>
    </div>

    <div v-else-if="paginatedExercises.length > 0" class="space-y-4">
      <ExerciseCard 
        v-for="exercise in paginatedExercises"
        :key="exercise.id"
        :exercise="exercise"
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

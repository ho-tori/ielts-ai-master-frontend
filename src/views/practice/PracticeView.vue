<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import SearchBar from './components/SearchBar.vue'
import ExerciseCard from './components/ExerciseCard.vue'
import EmptyState from './components/EmptyState.vue'
import Pagination from './components/Pagination.vue'
import { mockExercises } from '@/data/article'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

// 分页配置
const currentPage = ref(1)
const itemsPerPage = 9

// 搜索相关
const searchKeyword = ref('')
const selectedDifficulty = ref<'all' | 'easy' | 'medium' | 'hard'>('all')
const selectedCategory = ref<'all' | 'news' | 'academic' | 'fiction'>('all')

// 过滤习题
const filteredExercises = computed(() => {
  return mockExercises.filter(exercise => {
    // 按关键字搜索
    const matchKeyword = !searchKeyword.value || 
      exercise.title.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      exercise.description.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      exercise.tags.some(tag => tag.toLowerCase().includes(searchKeyword.value.toLowerCase()))
    
    // 按难度过滤
    const matchDifficulty = selectedDifficulty.value === 'all' || 
      exercise.difficulty === selectedDifficulty.value
    
    // 按分类过滤
    const matchCategory = selectedCategory.value === 'all' || 
      exercise.category === selectedCategory.value
    
    return matchKeyword && matchDifficulty && matchCategory
  })
})

// 分页计算
const totalPages = computed(() => Math.max(1, Math.ceil(filteredExercises.value.length / itemsPerPage)))

const paginatedExercises = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredExercises.value.slice(start, end)
})

// 监听搜索条件变化，重置到第一页
const handleSearch = (value: string) => {
  searchKeyword.value = value
  currentPage.value = 1
}

const handleDifficultyChange = (value: string) => {
  selectedDifficulty.value = value as any
  currentPage.value = 1
}

const handleCategoryChange = (value: string) => {
  selectedCategory.value = value as any
  currentPage.value = 1
}

// 开始练习
const startPractice = (exerciseId: number) => {
  console.log('🚀 开始练习，exerciseId:', exerciseId)
  console.log('👤 当前用户:', userStore.user?.name)
  
  // exerciseId 与 articleId 一一对应
  const articleId = exerciseId
  
  // 将文章添加到用户最近阅读列表
  userStore.addRecentArticle(articleId)
  
  // 跳转到阅读页面
  router.push(`/reading?exerciseId=${exerciseId}`)
}
</script>

<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-slate-900 mb-2">练习中心</h1>
      <p class="text-slate-600">搜索并练习IELTS阅读考试题目</p>
    </div>

    <!-- 搜索和过滤区域 -->
    <SearchBar 
      v-model="searchKeyword"
      :difficulty="selectedDifficulty"
      :category="selectedCategory"
      @update:modelValue="handleSearch"
      @update:difficulty="handleDifficultyChange"
      @update:category="handleCategoryChange"
    />

    <!-- 搜索结果统计 -->
    <div class="mb-6">
      <p class="text-slate-600">
        找到 <span class="font-semibold text-slate-900">{{ filteredExercises.length }}</span> 个相关习题
        <span v-if="totalPages > 1" class="text-slate-400">
          · 第 {{ currentPage }} / {{ totalPages }} 页
        </span>
      </p>
    </div>

    <!-- 习题卡片列表（纵向排列，一行一个） -->
    <div v-if="paginatedExercises.length > 0" class="space-y-4">
      <ExerciseCard 
        v-for="exercise in paginatedExercises"
        :key="exercise.id"
        :exercise="exercise"
        @start="startPractice"
      />
    </div>

    <!-- 空状态 -->
    <EmptyState v-else />

    <!-- 分页组件 -->
    <div class="mt-8">
      <Pagination 
        :current-page="currentPage"
        :total-pages="totalPages"
        @update:current-page="currentPage = $event"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import SearchBar from './components/SearchBar.vue'
import ExerciseCard from './components/ExerciseCard.vue'
import EmptyState from './components/EmptyState.vue'
import type { Exercise } from '../../types/article'

const router = useRouter()

// 搜索相关
const searchKeyword = ref('')
const selectedDifficulty = ref<'all' | 'easy' | 'medium' | 'hard'>('all')
const selectedCategory = ref<'all' | 'news' | 'academic' | 'fiction'>('all')

// 模拟习题数据
const mockExercises: Exercise[] = [
  {
    id: 1,
    title: 'The Future of Artificial Intelligence',
    category: 'academic',
    difficulty: 'medium',
    wordCount: 450,
    estimatedTime: '12 min',
    description: '关于人工智能发展趋势的学术文章，涵盖机器学习、深度学习等内容',
    tags: ['AI', '科技', '机器学习']
  },
  {
    id: 2,
    title: 'Climate Change and Global Warming',
    category: 'academic',
    difficulty: 'hard',
    wordCount: 520,
    estimatedTime: '15 min',
    description: '深度讨论气候变化和全球变暖的科学证据和影响',
    tags: ['环境', '气候', '科学']
  },
  {
    id: 3,
    title: 'Breaking News: Major Discovery in Physics',
    category: 'news',
    difficulty: 'medium',
    wordCount: 380,
    estimatedTime: '10 min',
    description: '物理学领域的重要发现，涉及量子计算',
    tags: ['物理', '新闻', '科学发现']
  },
  {
    id: 4,
    title: 'The Lost City: A Mystery Novel',
    category: 'fiction',
    difficulty: 'easy',
    wordCount: 420,
    estimatedTime: '11 min',
    description: '冒险小说，讲述考古学家寻找失落古城的故事',
    tags: ['冒险', '小说', '考古']
  },
  {
    id: 5,
    title: 'Digital Revolution in Education',
    category: 'academic',
    difficulty: 'medium',
    wordCount: 480,
    estimatedTime: '13 min',
    description: '探讨数字技术如何改变现代教育',
    tags: ['教育', '技术', '数字化']
  },
  {
    id: 6,
    title: 'Sustainable Fashion Industry',
    category: 'news',
    difficulty: 'easy',
    wordCount: 320,
    estimatedTime: '9 min',
    description: '时尚业的可持续发展趋势',
    tags: ['环保', '时尚', '可持续']
  }
]

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

// 开始练习
const startPractice = (exerciseId: number) => {
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
      @update:modelValue="searchKeyword = $event"
      @update:difficulty="selectedDifficulty = $event as any"
      @update:category="selectedCategory = $event as any"
    />

    <!-- 搜索结果统计 -->
    <div class="mb-6">
      <p class="text-slate-600">
        找到 <span class="font-semibold text-slate-900">{{ filteredExercises.length }}</span> 个相关习题
      </p>
    </div>

    <!-- 习题卡片网格 -->
    <div v-if="filteredExercises.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ExerciseCard 
        v-for="exercise in filteredExercises"
        :key="exercise.id"
        :exercise="exercise"
        @start="startPractice"
      />
    </div>

    <!-- 空状态 -->
    <EmptyState v-else />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ArticleSection from './components/ArticleSection.vue'
import AiResultPanel from './components/AiResultPanel.vue'
import QuestionPanel from './components/QuestionPanel.vue'
import RecentArticlesPanel from './components/RecentArticlesPanel.vue'
import { mockArticles, mockExercises } from '@/data/article'
import { useUserStore } from '@/stores/user'
import type { RecentArticle } from '../../types/article'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const error = ref<string | null>(null)

/**
 * 获取随机文章
 */
const getRandomArticle = () => {
  if (mockArticles.length === 0) {
    error.value = '没有可用的文章数据'
    return null
  }
  const randomIndex = Math.floor(Math.random() * mockArticles.length)
  return mockArticles[randomIndex]
}

// 根据 exerciseId 或 articleId 获取对应的文章
const currentArticle = computed(() => {
  error.value = null
  const exerciseIdParam = route.query.exerciseId
  const articleIdParam = route.query.articleId
  
  // 优先使用 articleId（从最近阅读点击过来）
  if (articleIdParam) {
    const articleId = Number(articleIdParam)
    const article = mockArticles.find(a => a.id === articleId)
    if (article) {
      return article
    }
    error.value = `文章 ID ${articleIdParam} 不存在`
    return null
  }

  // 如果没有提供 exerciseId，显示随机文章
  if (!exerciseIdParam) {
    const randomArticle = getRandomArticle()
    if (!randomArticle) {
      error.value = '无法加载文章'
      return null
    }
    return randomArticle
  }
  
  const exerciseId = Number(exerciseIdParam)
  
  // 验证 exerciseId 的有效性
  if (isNaN(exerciseId)) {
    error.value = '无效的习题ID'
    return null
  }
  
  // 查找对应的习题
  const exercise = mockExercises.find(e => e.id === exerciseId)
  if (!exercise) {
    error.value = `习题 ID ${exerciseId} 不存在`
    return null
  }
  
  // 根据习题编号找到对应的文章
  if (exerciseId >= 1 && exerciseId <= mockArticles.length) {
    const article = mockArticles.find(a => a.id === exerciseId)
    if (article) {
      return article
    }
  }
  
  // 其他习题ID无效
  error.value = `无法找到习题 ID ${exerciseId} 对应的文章`
  return null
})

const selectionContext = ref<{
  text: string
  articleTitle: string
}>({
  text: '',
  articleTitle: ''
})

const handleSelect = (text: string) => {
  if (!currentArticle.value) return
  selectionContext.value = {
    text,
    articleTitle: currentArticle.value.title
  }
}

// 从用户数据获取最近阅读的文章列表
const recentArticlesPanel = computed(() => {
  const user = userStore.user
  if (!user || !user.recentArticles || user.recentArticles.length === 0) {
    console.log('📭 用户未登录或无最近阅读记录', { user: user?.name, recent: user?.recentArticles })
    return []
  }
  
  console.log('📚 获取最近阅读列表:', user.recentArticles)
  
  // 根据用户的文章ID列表查找完整的文章数据
  return user.recentArticles
    .map(articleId => {
      const article = mockArticles.find(a => a.id === articleId)
      if (!article) return null
      
      return {
        id: article.id,
        title: article.title,
        category: article.category,
        readDate: '最近阅读',
        progress: Math.floor(Math.random() * 100) // 模拟进度
      } as RecentArticle
    })
    .filter((item): item is RecentArticle => item !== null)
})

// 示例问题数据
const sampleQuestions = computed(() => {
  return currentArticle.value?.questions || []
})

const updateAnswer = (questionId: string, answer: string) => {
  console.log(`Question ${questionId}: ${answer}`)
}

const handleSubmit = () => {
  console.log('Submitted answers:', selectedAnswers.value)
}

const selectedAnswers = ref<Record<string, string>>({})

const handleSelectRecentArticle = (articleId: string) => {
  router.push({ path: '/reading', query: { articleId } })
}

// 获取当前选中的文章 ID
const currentArticleId = computed(() => {
  const articleIdParam = route.query.articleId
  const exerciseIdParam = route.query.exerciseId
  
  if (articleIdParam) {
    return String(articleIdParam)
  }
  
  if (exerciseIdParam) {
    const exerciseId = Number(exerciseIdParam)
    if (exerciseId >= 1 && exerciseId <= 12) {
      return String(exerciseId)
    }
  }
  
  return undefined
})
</script>

<template>
  <div class="h-full">
    <!-- 最近阅读文章 -->
    <RecentArticlesPanel 
      v-if="recentArticlesPanel.length > 0"
      :articles="recentArticlesPanel"
      :active-article-id="currentArticleId"
      @select="handleSelectRecentArticle"
      class="mb-6"
    />

    <!-- 错误提示 -->
    <div v-if="error" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
      <p class="text-red-800 text-sm">❌ {{ error }}</p>
    </div>

    <!-- 无文章显示的错误状态 -->
    <div v-if="!currentArticle && error" class="flex items-center justify-center h-full">
      <div class="text-center">
        <p class="text-gray-600 mb-2">{{ error }}</p>
        <p class="text-sm text-gray-500">请检查习题 ID 或返回练习中心重新选择</p>
      </div>
    </div>

    <!-- 三列布局：AI面板 | 文章 | 问题 -->
    <div v-else class="h-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      <!-- 左侧 AI 面板 -->
      <AiResultPanel
        class="lg:col-span-3 order-3 lg:order-1 h-full"
        :selection="selectionContext"
      />

      <!-- 中间文章 -->
      <ArticleSection
        class="lg:col-span-6 order-1 lg:order-2 h-full"
        :title="currentArticle!.title"
        :content="currentArticle!.content"
        @on-select="handleSelect"
      />

      <!-- 右侧问题 -->
      <QuestionPanel 
        class="lg:col-span-3 order-2 lg:order-3 h-full"
        :questions="sampleQuestions"
        @update-answer="updateAnswer"
        @submit="handleSubmit"
      />
    </div>
  </div>
</template>

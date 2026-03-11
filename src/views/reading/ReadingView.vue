<script setup lang="ts">
import { ref, computed, onMounted, watch, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ArticleSection from './components/ArticleSection.vue'
import AiResultPanel from './components/AiResultPanel.vue'
import QuestionPanel from './components/QuestionPanel.vue'
import RecentArticlesPanel from './components/RecentArticlesPanel.vue'
import { getArticleList, getArticleDetail } from '@/api/article'
import { apiGetProgress, apiUpdateProgress, apiGetAllProgress, type ProgressData } from '@/api/progress'
import { useUserStore } from '@/stores/user'
import type { RecentArticle, Article } from '../../types/article'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const error = ref<string | null>(null)
const loading = ref(false)
const articleFromApi = ref<Article | null>(null)
const currentProgress = ref<ProgressData | null>(null)
const progressData = reactive<Record<number, number>>({})
const everCompletedData = reactive<Record<number, boolean>>({})

const setProgress = (articleId: number, progress: number) => {
  progressData[articleId] = progress
}

const getProgress = (articleId: number): number => {
  return progressData[articleId] || 0
}

const setEverCompleted = (articleId: number, completed: boolean) => {
  everCompletedData[articleId] = completed
}

const getEverCompleted = (articleId: number): boolean => {
  return everCompletedData[articleId] || false
}

const fetchArticleFromApi = async (articleId: number) => {
  loading.value = true
  error.value = null
  try {
    const { data } = await getArticleDetail(String(articleId))
    if (data.code === 0) {
      articleFromApi.value = data.data
      userStore.addRecentArticle(articleId)
      fetchProgress(articleId)
    } else {
      error.value = data.message || '获取文章失败'
    }
  } catch (e: any) {
    console.error('从后端获取文章失败', e)
    error.value = '网络错误，请检查后端服务是否启动'
    articleFromApi.value = null
  } finally {
    loading.value = false
  }
}

const fetchProgress = async (articleId: number) => {
  try {
    const { data } = await apiGetProgress(articleId)
    if (data.code === 0) {
      currentProgress.value = data.data
      if (data.data.answeredQuestions) {
        data.data.answeredQuestions.forEach(qId => {
          selectedAnswers.value[Number(qId)] = ''
        })
      }
    }
  } catch (e) {
    console.warn('获取进度失败', e)
  }
}

const currentArticle = computed(() => {
  return articleFromApi.value
})

onMounted(() => {
  const articleIdParam = route.query.articleId
  const exerciseIdParam = route.query.exerciseId
  
  if (articleIdParam) {
    fetchArticleFromApi(Number(articleIdParam))
  } else if (exerciseIdParam) {
    fetchArticleFromApi(Number(exerciseIdParam))
  }
})

watch(() => route.query, (newQuery) => {
  const articleIdParam = newQuery.articleId
  const exerciseIdParam = newQuery.exerciseId
  
  if (articleIdParam) {
    fetchArticleFromApi(Number(articleIdParam))
  } else if (exerciseIdParam) {
    fetchArticleFromApi(Number(exerciseIdParam))
  } else {
    articleFromApi.value = null
  }
}, { deep: true })

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

const recentArticlesPanel = ref<RecentArticle[]>([])

const recentArticlesWithProgress = computed(() => {
  return recentArticlesPanel.value.map(article => ({
    ...article,
    progress: getProgress(Number(article.id)),
    everCompleted: getEverCompleted(Number(article.id))
  }))
})

const fetchRecentArticles = async () => {
  const user = userStore.user
  if (!user || !user.recentArticles || user.recentArticles.length === 0) {
    recentArticlesPanel.value = []
    return
  }
  
  try {
    const progressRes = await apiGetAllProgress()
    if (progressRes.data.code === 0) {
      progressRes.data.data.forEach(p => {
        setProgress(p.articleId, p.progress)
        if (p.everCompleted !== undefined) {
          setEverCompleted(p.articleId, p.everCompleted)
        }
      })
    }
  } catch (e) {
    console.warn('获取进度列表失败', e)
  }
  
  try {
    const articles = await Promise.all(
      user.recentArticles.map(async (articleId) => {
        try {
          const { data } = await getArticleDetail(String(articleId))
          if (data.code === 0) {
            return {
              id: data.data.id,
              title: data.data.title,
              category: data.data.category,
              readDate: '最近阅读'
            } as RecentArticle
          }
          return null
        } catch {
          return null
        }
      })
    )
    recentArticlesPanel.value = articles.filter((item): item is RecentArticle => item !== null)
  } catch (e) {
    console.error('获取最近阅读列表失败', e)
    recentArticlesPanel.value = []
  }
}

watch(() => userStore.user, (newUser) => {
  if (newUser) {
    fetchRecentArticles()
  }
}, { immediate: true })

const sampleQuestions = computed(() => {
  return currentArticle.value?.questions || []
})

const selectedAnswers = ref<Record<number, string>>({})

const currentProgressPercent = computed(() => {
  const totalQuestions = sampleQuestions.value.length
  if (totalQuestions === 0) return 0
  const answeredCount = Object.values(selectedAnswers.value).filter(
    a => a && a !== ''
  ).length
  return Math.round((answeredCount / totalQuestions) * 100)
})

const updateAnswer = async (questionId: number, answer: string) => {
  selectedAnswers.value[questionId] = answer
  
  const totalQuestions = sampleQuestions.value.length
  if (totalQuestions === 0) return
  
  const progress = Math.min(currentProgressPercent.value, 99)
  
  const articleId = route.query.articleId || route.query.exerciseId
  if (!articleId) return
  
  try {
    const answeredQuestions = Object.keys(selectedAnswers.value).map(String)
    await apiUpdateProgress({
      articleId: Number(articleId),
      progress,
      answeredQuestions
    })
    setProgress(Number(articleId), progress)
  } catch (e) {
    console.warn('更新进度失败', e)
  }
}

const submitted = ref(false)
const score = ref(0)
const showResults = ref(false)

const handleSubmit = async () => {
  if (Object.keys(selectedAnswers.value).length === 0) {
    alert('请先回答问题')
    return
  }
  
  const questions = sampleQuestions.value
  let correctCount = 0
  
  questions.forEach(q => {
    const userAnswer = selectedAnswers.value[q.id]
    if (userAnswer && userAnswer === q.answer) {
      correctCount++
    }
  })
  
  score.value = Math.round((correctCount / questions.length) * 100)
  submitted.value = true
  showResults.value = true
  
  const articleId = route.query.articleId || route.query.exerciseId
  if (articleId) {
    try {
      const answeredQuestions = Object.keys(selectedAnswers.value).map(String)
      console.log('提交进度更新:', { articleId: Number(articleId), progress: 100, answeredQuestions })
      const result = await apiUpdateProgress({
        articleId: Number(articleId),
        progress: 100,
        answeredQuestions
      })
      console.log('进度更新结果:', result.data)
      setProgress(Number(articleId), 100)
      setEverCompleted(Number(articleId), true)
    } catch (e) {
      console.warn('更新完成进度失败', e)
    }
  }
  
  console.log(`提交完成: ${correctCount}/${questions.length} 正确, 得分: ${score.value}%`)
}

const handleReset = () => {
  selectedAnswers.value = {}
  submitted.value = false
  showResults.value = false
  score.value = 0
}

const handleSelectRecentArticle = (articleId: string) => {
  router.push({ path: '/reading', query: { articleId } })
}

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
      v-if="recentArticlesWithProgress.length > 0"
      :articles="recentArticlesWithProgress"
      :active-article-id="currentArticleId"
      @select="handleSelectRecentArticle"
      class="mb-6"
    />

    <!-- 加载状态 -->
    <div v-if="loading" class="flex items-center justify-center h-full">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="text-gray-600 mt-4">加载中...</p>
      </div>
    </div>

    <!-- 错误提示 -->
    <div v-else-if="error" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
      <p class="text-red-800 text-sm">❌ {{ error }}</p>
    </div>

    <!-- 无文章显示的错误状态 -->
    <div v-if="!loading && !currentArticle && error" class="flex items-center justify-center h-full">
      <div class="text-center">
        <p class="text-gray-600 mb-2">{{ error }}</p>
        <p class="text-sm text-gray-500">请检查习题 ID 或返回练习中心重新选择</p>
      </div>
    </div>

    <!-- 三列布局：AI面板 | 文章 | 问题 -->
    <div v-else-if="!loading && currentArticle" class="h-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
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
      <div class="lg:col-span-3 order-2 lg:order-3 h-full flex flex-col gap-4">
        <!-- 进度条 -->
        <div class="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-slate-600">答题进度</span>
            <span class="text-sm font-bold" :class="currentProgressPercent === 100 ? 'text-green-600' : 'text-indigo-600'">
              {{ currentProgressPercent }}%
            </span>
          </div>
          <div class="w-full bg-slate-100 rounded-full h-2.5">
            <div 
              class="h-2.5 rounded-full transition-all duration-300 ease-out"
              :class="currentProgressPercent === 100 ? 'bg-green-500' : 'bg-indigo-500'"
              :style="{ width: currentProgressPercent + '%' }"
            ></div>
          </div>
        </div>
        
        <!-- 问题面板 -->
        <QuestionPanel 
          class="flex-1 overflow-auto"
          :questions="sampleQuestions"
          :show-results="showResults"
          @update-answer="updateAnswer"
          @submit="handleSubmit"
          @reset="handleReset"
        />
      </div>
    </div>
  </div>
</template>

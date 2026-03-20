<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ArticleSection from './components/ArticleSection.vue'
import AiResultPanel from './components/AiResultPanel.vue'
import QuestionPanel from './components/QuestionPanel.vue'
import RecentArticlesPanel from './components/RecentArticlesPanel.vue'
import { getArticleDetail } from '@/api/article'
import { useUserStore } from '@/stores/user'
import type { RecentArticle, Article } from '../../types/article'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const error = ref<string | null>(null)
const loading = ref(false)
const articleFromApi = ref<Article | null>(null)

const fetchArticleFromApi = async (articleId: number) => {
  loading.value = true
  error.value = null
  try {
    const { data } = await getArticleDetail(String(articleId))
    if (data.code === 0) {
      articleFromApi.value = data.data
      userStore.addRecentArticle(articleId)
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

const fetchRecentArticles = async () => {
  const user = userStore.user
  if (!user || !user.recentArticles || user.recentArticles.length === 0) {
    recentArticlesPanel.value = []
    return
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
              category: data.data.examType,
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

const updateAnswer = (questionId: number, answer: string) => {
  selectedAnswers.value[questionId] = answer
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
    if (userAnswer && userAnswer === q.correctAnswer) {
      correctCount++
    }
  })
  
  score.value = Math.round((correctCount / questions.length) * 100)
  submitted.value = true
  showResults.value = true
  
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
    <RecentArticlesPanel 
      v-if="recentArticlesPanel.length > 0"
      :articles="recentArticlesPanel"
      :active-article-id="currentArticleId"
      @select="handleSelectRecentArticle"
      class="mb-6"
    />

    <div v-if="loading" class="flex items-center justify-center h-full">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p class="text-text-secondary mt-4">加载中...</p>
      </div>
    </div>

    <div v-else-if="error" class="mb-4 p-4 bg-danger/10 border border-danger/30 rounded-lg">
      <p class="text-danger text-sm">❌ {{ error }}</p>
    </div>

    <div v-if="!loading && !currentArticle && error" class="flex items-center justify-center h-full">
      <div class="text-center">
        <p class="text-text-secondary mb-2">{{ error }}</p>
        <p class="text-sm text-text-secondary/80">请检查习题 ID 或返回练习中心重新选择</p>
      </div>
    </div>

    <div v-else-if="!loading && currentArticle" class="h-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      <AiResultPanel
        class="lg:col-span-3 order-3 lg:order-1 h-full"
        :selection="selectionContext"
      />

      <ArticleSection
        class="lg:col-span-6 order-1 lg:order-2 h-full"
        :title="currentArticle!.title"
        :paragraphs="currentArticle!.paragraphs"
        @on-select="handleSelect"
      />

      <div class="lg:col-span-3 order-2 lg:order-3 h-full flex flex-col gap-4">
        <div class="bg-surface rounded-xl p-4 shadow-sm border border-border/70">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-text-secondary">答题进度</span>
            <span class="text-sm font-bold" :class="currentProgressPercent === 100 ? 'text-success' : 'text-primary'">
              {{ currentProgressPercent }}%
            </span>
          </div>
          <div class="w-full bg-surface-muted rounded-full h-2.5">
            <div 
              class="h-2.5 rounded-full transition-all duration-300 ease-out"
              :class="currentProgressPercent === 100 ? 'bg-success' : 'bg-primary'"
              :style="{ width: currentProgressPercent + '%' }"
            ></div>
          </div>
        </div>
        
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

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ArticleSection from './components/ArticleSection.vue'
import ReadingBottomNavigator from './components/ReadingBottomNavigator.vue'
import ReadingToolPanel from './components/ReadingToolPanel.vue'
import { getArticleDetail, submitAnswer } from '@/api/article'
import { apiGetNotes, apiSaveHighlight, apiSaveNote, apiClearHighlights, apiDeleteNote } from '@/api/note'
import { useUserStore } from '@/stores/user'
import type { RecentArticle, Article } from '../../types/article'

// 路由与全局状态
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// 页面基础请求状态
const error = ref<string | null>(null)
const loading = ref(false)
const articleFromApi = ref<Article | null>(null)

// 右侧工具区的状态（最近阅读、答题、笔记、聚焦题目）
const recentArticlesPanel = ref<RecentArticle[]>([])
const selectedAnswers = ref<Record<number, string>>({})
const showResults = ref(false)
const notes = ref('')
const focusedQuestionId = ref<number | null>(null)

// 翻译显示状态管理
const visibleTranslations = ref<Record<number, boolean>>({})

// 高亮和笔记状态
interface HighlightRange { startOffset: number; endOffset: number; color: string; id: number }
const highlights = ref<Record<number, HighlightRange[]>>({})
const noteParagraphs = ref(new Set<number>())
const noteContents = ref<Record<number, string>>({})
const noteSaveTimer = ref<ReturnType<typeof setTimeout> | null>(null)

// 高亮颜色选项
const highlightColors = ['#ffeb3b', '#a5d6a7', '#90caf9', '#f48fb1', '#ce93d8']
const highlightToolbarX = ref(0)
const highlightToolbarY = ref(0)

// 选中文本的上下文（含偏移量）
const selectionContext = ref<{
  text: string
  paragraphNumber: number
  startOffset: number
  endOffset: number
  articleTitle: string
}>({
  text: '',
  paragraphNumber: 0,
  startOffset: 0,
  endOffset: 0,
  articleTitle: ''
})

// 右侧工具栏当前激活的标签
const activeTool = ref<'questions' | 'translation' | 'ai' | 'notes' | 'recent'>('questions')
// 工具栏配置（key 用于切换，icon 用于渲染图标）
const toolItems = [
  { key: 'questions', label: '题目', icon: 'mdi:format-list-numbered' },
  { key: 'translation', label: '翻译', icon: 'mdi:translate' },
  { key: 'ai', label: 'AI解析', icon: 'mdi:robot-outline' },
  { key: 'notes', label: '笔记', icon: 'mdi:notebook-edit-outline' },
  { key: 'recent', label: '最近阅读', icon: 'mdi:history' }
] as const

const splitContainer = ref<HTMLElement | null>(null)
const isDesktop = ref(false)
const isResizing = ref(false)
const rightPaneWidth = ref(420)
const MIN_RIGHT_PANE = 320
const MAX_RIGHT_PANE = 620
const RIGHT_PANE_KEY = 'reading_tool_pane_width'

// 当前文章与题目列表（题目列表用于导航、进度、右侧面板）
const currentArticle = computed(() => articleFromApi.value)
const sampleQuestions = computed(() => currentArticle.value?.questions || [])

// 已答题数量：以 selectedAnswers 中的有效值为准
const answeredCount = computed(() => {
  return Object.values(selectedAnswers.value).filter((value) => value && value !== '').length
})

// 答题进度百分比
const currentProgressPercent = computed(() => {
  const totalQuestions = sampleQuestions.value.length
  if (totalQuestions === 0) return 0
  return Math.round((answeredCount.value / totalQuestions) * 100)
})

// 右侧工具区宽度样式：仅桌面端启用拖拽宽度
const rightPaneStyle = computed(() => {
  if (!isDesktop.value) return {}
  return { width: `${rightPaneWidth.value}px` }
})

// 底部题目导航条定位：
// - 移动端：左右留 16px
// - 桌面端：左侧避开 sidebar，右侧避开工具区
const navigatorStyle = computed(() => {
  if (!isDesktop.value) {
    return { left: '16px', right: '16px', bottom: '12px' }
  }

  return {
    left: '120px',
    right: `${rightPaneWidth.value + 28}px`,
    bottom: '14px'
  }
})

// 当前文章 ID（用于“最近阅读”高亮）
const currentArticleId = computed(() => {
  const articleIdParam = route.query.articleId
  const exerciseIdParam = route.query.exerciseId

  if (articleIdParam) return String(articleIdParam)

  if (exerciseIdParam) {
    const exerciseId = Number(exerciseIdParam)
    if (exerciseId >= 1 && exerciseId <= 12) return String(exerciseId)
  }

  return undefined
})

function updateDesktopMode() {
  isDesktop.value = window.innerWidth >= 1024
}

// 初始化读取用户上次调整的右侧工具区宽度
function loadPaneWidth() {
  const raw = window.localStorage.getItem(RIGHT_PANE_KEY)
  const width = raw ? Number(raw) : 420
  if (!Number.isFinite(width)) return
  rightPaneWidth.value = Math.max(MIN_RIGHT_PANE, Math.min(MAX_RIGHT_PANE, width))
}

function persistPaneWidth() {
  window.localStorage.setItem(RIGHT_PANE_KEY, String(rightPaneWidth.value))
}

// 拖拽分割条：根据鼠标 x 坐标动态计算右侧宽度
function onResizeMove(event: PointerEvent) {
  if (!isResizing.value || !splitContainer.value) return
  const rect = splitContainer.value.getBoundingClientRect()
  const calculated = rect.right - event.clientX
  rightPaneWidth.value = Math.max(MIN_RIGHT_PANE, Math.min(MAX_RIGHT_PANE, calculated))
}

function onResizeUp() {
  if (!isResizing.value) return
  isResizing.value = false
  persistPaneWidth()
}

function startResize(event: PointerEvent) {
  if (!isDesktop.value) return
  event.preventDefault()
  isResizing.value = true
}

function resetPaneWidth() {
  rightPaneWidth.value = 420
  persistPaneWidth()
}

// 按“真实题目ID”跳转到右侧题目（用于定位组件内部滚动）
function jumpToQuestion(questionId: number) {
  activeTool.value = 'questions'
  focusedQuestionId.value = null
  requestAnimationFrame(() => {
    focusedQuestionId.value = questionId
  })
}

// 按“显示序号(1..n)”跳转，先映射回真实题目ID再定位。
// 这样可以保证 UI 序号与数据库 ID 解耦。
function jumpToQuestionByOrder(displayOrder: number) {
  const target = sampleQuestions.value[displayOrder - 1]
  if (!target) return
  jumpToQuestion(target.id)
}

// 拉取文章详情：用于正文显示、题目渲染、最近阅读写入
const fetchArticleFromApi = async (articleId: number) => {
  loading.value = true
  error.value = null
  try {
    const { data } = await getArticleDetail(String(articleId))
    if (data.code === 0) {
      articleFromApi.value = data.data
      userStore.addRecentArticle(articleId)
      loadHighlightsAndNotes(articleId)
      // 如果URL带了focusQuestion参数，自动定位到该题
      const focusQ = route.query.focusQuestion
      if (focusQ) {
        nextTick(() => {
          focusedQuestionId.value = Number(focusQ)
        })
      }
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

// 拉取最近阅读列表：根据 userStore.recentArticles 逐个补全文章详情
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

// 正文选词回调：更新 AI 分析上下文
function handleSelect(text: string, paragraphNumber: number, startOffset: number, endOffset: number) {
  if (!currentArticle.value) return
  const sel = window.getSelection()
  if (sel && sel.rangeCount > 0) {
    const rect = sel.getRangeAt(0).getBoundingClientRect()
    highlightToolbarX.value = rect.left + rect.width / 2 - 60
    highlightToolbarY.value = rect.top - 40
  }
  selectionContext.value = {
    text,
    paragraphNumber,
    startOffset,
    endOffset,
    articleTitle: currentArticle.value.title
  }
}

// 高亮选中文本
async function addHighlight(color?: string) {
  const ctx = selectionContext.value
  if (!ctx.text || !currentArticle.value) return
  const articleId = currentArticle.value.id

  try {
    const { data } = await apiSaveHighlight(articleId, ctx.paragraphNumber, {
      startOffset: ctx.startOffset,
      endOffset: ctx.endOffset,
      text: ctx.text
    }, color || '#ffeb3b')
    if (data.code === 0) {
      // 添加到本地状态
      if (!highlights.value[ctx.paragraphNumber]) {
        highlights.value[ctx.paragraphNumber] = []
      }
      highlights.value[ctx.paragraphNumber].push({
        startOffset: ctx.startOffset,
        endOffset: ctx.endOffset,
        color: color || '#ffeb3b',
        id: data.data.id
      })
    }
  } catch (e) {
    console.error('保存高亮失败', e)
  }
}

// 清除所有高亮
async function handleClearHighlights() {
  if (!currentArticle.value) return
  try {
    await apiClearHighlights(currentArticle.value.id)
    highlights.value = {}
  } catch (e) {
    console.error('清除高亮失败', e)
  }
}

// 删除单个高亮
async function handleDeleteHighlight(highlightId: number) {
  try {
    await apiDeleteNote(highlightId)
    // 从本地状态移除
    for (const paraNum of Object.keys(highlights.value)) {
      const num = Number(paraNum)
      highlights.value[num] = (highlights.value[num] || []).filter(h => h.id !== highlightId)
      if (highlights.value[num].length === 0) {
        delete highlights.value[num]
      }
    }
  } catch (e) {
    console.error('删除高亮失败', e)
  }
}

// 是否有高亮
const hasHighlights = computed(() => Object.keys(highlights.value).length > 0)

// 保存笔记（带防抖）
function handleSaveNote(content: string) {
  if (!currentArticle.value) return
  const articleId = currentArticle.value.id
  // 保存到本地状态
  notes.value = content
  // 防抖保存到后端
  if (noteSaveTimer.value) clearTimeout(noteSaveTimer.value)
  noteSaveTimer.value = setTimeout(async () => {
    try {
      // 找当前笔记对应的段落（使用第一个段落作为默认）
      const paraNum = currentArticle.value?.paragraphs?.[0]?.paragraphNumber || 1
      await apiSaveNote(articleId, paraNum, content)
    } catch (e) {
      console.error('保存笔记失败', e)
    }
  }, 1500)
}

// 加载高亮和笔记
async function loadHighlightsAndNotes(articleId: number) {
  try {
    const { data } = await apiGetNotes(articleId)
    if (data.code !== 0) return

    const hlMap: Record<number, HighlightRange[]> = {}
    const noteParas = new Set<number>()
    const noteContentMap: Record<number, string> = {}

    for (const item of data.data || []) {
      if (item.type === 'highlight' && item.position) {
        const pos = item.position as any
        if (!hlMap[item.paragraphNumber]) hlMap[item.paragraphNumber] = []
        hlMap[item.paragraphNumber].push({
          startOffset: pos.startOffset || 0,
          endOffset: pos.endOffset || 0,
          color: item.highlightColor,
          id: item.id
        })
      } else if (item.type === 'note') {
        noteParas.add(item.paragraphNumber)
        noteContentMap[item.paragraphNumber] = item.noteContent || ''
      }
    }
    highlights.value = hlMap
    noteParagraphs.value = noteParas
    noteContents.value = noteContentMap
    if (noteContentMap[1] != null) {
      notes.value = noteContentMap[1]
    }
  } catch (e) {
    console.error('加载高亮和笔记失败', e)
  }
}

// 更新某题答案
function updateAnswer(questionId: number, answer: string) {
  selectedAnswers.value[questionId] = answer
}

// 记录错题questionId列表
const wrongQuestionIds = ref<number[]>([])

// 提交答题：调用后端评分接口，记录错题
async function handleSubmit() {
  if (Object.keys(selectedAnswers.value).length === 0) {
    alert('请先回答问题')
    return
  }

  const questions = articleFromApi.value?.questions || []
  wrongQuestionIds.value = []

  for (const q of questions) {
    const userAnswer = selectedAnswers.value[q.id]
    if (!userAnswer) continue
    try {
      const { data } = await submitAnswer(q.id, {
        questionId: q.id,
        userAnswer: userAnswer
      })
      if (data.code === 0 && data.data?.needAnalysis) {
        wrongQuestionIds.value.push(q.id)
      }
    } catch (e) {
      console.error('提交答案失败: questionId=' + q.id, e)
    }
  }

  showResults.value = true
}

// 重置答题状态
function handleReset() {
  selectedAnswers.value = {}
  showResults.value = false
}

// 点击最近阅读卡片后切换文章
function handleSelectRecentArticle(articleId: string) {
  router.push({ path: '/reading', query: { articleId } })
}

// 切换段落翻译的显示/隐藏
function handleToggleTranslation(paragraphNumber: number) {
  visibleTranslations.value[paragraphNumber] = !visibleTranslations.value[paragraphNumber]
}

onMounted(() => {
  // 初始化布局状态与拖拽监听
  updateDesktopMode()
  loadPaneWidth()
  window.addEventListener('resize', updateDesktopMode)
  window.addEventListener('pointermove', onResizeMove)
  window.addEventListener('pointerup', onResizeUp)

  // 首次进入页面：支持通过 articleId / exerciseId 两种参数打开
  const articleIdParam = route.query.articleId
  const exerciseIdParam = route.query.exerciseId

  if (articleIdParam) {
    fetchArticleFromApi(Number(articleIdParam))
  } else if (exerciseIdParam) {
    fetchArticleFromApi(Number(exerciseIdParam))
  }
})

onBeforeUnmount(() => {
  // 组件销毁时清理全局监听
  window.removeEventListener('resize', updateDesktopMode)
  window.removeEventListener('pointermove', onResizeMove)
  window.removeEventListener('pointerup', onResizeUp)
})

watch(
  () => route.query,
  (newQuery) => {
    // 路由参数变化时刷新文章，支持页面内切题
    const articleIdParam = newQuery.articleId
    const exerciseIdParam = newQuery.exerciseId

    if (articleIdParam) {
      fetchArticleFromApi(Number(articleIdParam))
    } else if (exerciseIdParam) {
      fetchArticleFromApi(Number(exerciseIdParam))
    } else {
      articleFromApi.value = null
    }
  },
  { deep: true }
)

watch(
  () => userStore.user,
  (newUser) => {
    // 登录态变化后刷新最近阅读
    if (newUser) {
      fetchRecentArticles()
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="h-full" ref="splitContainer">
    <!-- 加载态 -->
    <div v-if="loading" class="flex items-center justify-center h-full">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p class="text-text-secondary mt-4">加载中...</p>
      </div>
    </div>

    <!-- 错误态 -->
    <div v-else-if="error" class="mb-4 p-4 bg-danger/10 border border-danger/30 rounded-lg">
      <p class="text-danger text-sm">❌ {{ error }}</p>
    </div>

    <div v-else-if="!currentArticle && error" class="flex items-center justify-center h-full">
      <div class="text-center">
        <p class="text-text-secondary mb-2">{{ error }}</p>
        <p class="text-sm text-text-secondary/80">请检查习题 ID 或返回练习中心重新选择</p>
      </div>
    </div>

    <!-- 空状态：没有加载文章 -->
    <div v-else-if="!currentArticle" class="flex items-center justify-center h-full">
      <div class="text-center max-w-md">
        <div class="text-6xl mb-4">📖</div>
        <h3 class="text-xl font-bold text-text-primary mb-2">准备开始阅读练习</h3>
        <p class="text-text-secondary text-sm mb-6">
          从练习中心选择一篇文章开始答题，AI 会帮你分析错题、提取生词、生成专项训练。
        </p>
        <div class="flex gap-3 justify-center">
          <BaseButton variant="primary" @click="$router.push('/practice')">去练习中心</BaseButton>
          <BaseButton variant="secondary" @click="$router.push('/wrong-answers')">查看错题本</BaseButton>
        </div>
        <div v-if="recentArticles.length > 0" class="mt-8 text-left">
          <p class="text-xs text-text-secondary mb-3">最近阅读过的文章</p>
          <div
            v-for="item in recentArticles.slice(0, 3)"
            :key="item.id"
            class="flex items-center justify-between p-2 rounded-lg hover:bg-surface-muted cursor-pointer transition-colors"
            @click="$router.push(`/reading?articleId=${item.id}`)"
          >
            <span class="text-sm text-text-primary truncate">{{ item.title }}</span>
            <span class="text-xs text-text-secondary shrink-0 ml-2">{{ item.examType }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 主体：左正文 + 右工具区 -->
    <div v-else-if="currentArticle" class="h-full flex gap-0">
      <section class="relative flex-1 min-w-0">
        <!-- 正文区 -->
        <ArticleSection
          class="h-full"
          :title="currentArticle.title"
          :paragraphs="currentArticle.paragraphs"
          :visible-translations="visibleTranslations"
          :highlights="highlights"
          :note-paragraphs="noteParagraphs"
          :has-highlights="hasHighlights"
          @on-select="handleSelect"
          @toggle-translation="handleToggleTranslation"
          @delete-highlight="handleDeleteHighlight"
          @clear-highlights="handleClearHighlights"
        />

        <!-- 选中文字时的浮动高亮按钮 -->
        <div
          v-if="selectionContext.text"
          class="fixed z-40 bg-white rounded-lg shadow-lg border border-border px-2 py-1.5 flex items-center gap-1"
          :style="{ top: highlightToolbarY + 'px', left: highlightToolbarX + 'px' }"
        >
          <button
            v-for="c in highlightColors"
            :key="c"
            class="w-5 h-5 rounded-full border border-gray-300 cursor-pointer hover:scale-110 transition-transform"
            :style="{ backgroundColor: c }"
            @click="addHighlight(c); selectionContext.text = ''"
          />
          <span class="text-xs text-text-secondary ml-2 mr-1 cursor-pointer hover:text-primary" @click="addHighlight(); selectionContext.text = ''">确认</span>
        </div>

        <!-- 固定底部题目导航（按序号跳题） -->
        <div class="fixed z-20" :style="navigatorStyle">
          <ReadingBottomNavigator
            :questions="sampleQuestions"
            :selected-answers="selectedAnswers"
            :current-progress-percent="currentProgressPercent"
            @jump="jumpToQuestionByOrder"
          />
        </div>
      </section>

      <!-- 中间可拖拽分割条 -->
      <div
        v-if="isDesktop"
        class="w-0.5 shrink-0 cursor-col-resize  hover:bg-primary/50 active:bg-primary/100 transition-colors"
        @pointerdown="startResize"
        @dblclick="resetPaneWidth"
      ></div>

      <!-- 右侧工具区（题目/翻译/AI/笔记/最近阅读） -->
      <ReadingToolPanel
        :right-pane-style="rightPaneStyle"
        :active-tool="activeTool"
        :tool-items="toolItems"
        :answered-count="answeredCount"
        :current-progress-percent="currentProgressPercent"
        :sample-questions="sampleQuestions"
        :show-results="showResults"
        :focused-question-id="focusedQuestionId"
        :selection-context="selectionContext"
        :current-article="currentArticle"
        :notes="notes"
        :recent-articles="recentArticlesPanel"
        :current-article-id="currentArticleId"
        :visible-translations="visibleTranslations"
        @update:active-tool="(value) => (activeTool = value)"
        @update:notes="handleSaveNote"
        @update-answer="updateAnswer"
        @submit="handleSubmit"
        @reset="handleReset"
        @select-recent="handleSelectRecentArticle"
        @toggle-translation="handleToggleTranslation"
      />

      <!-- 提交后有错题时显示分析入口 -->
      <div
        v-if="showResults && wrongQuestionIds.length > 0"
        class="fixed bottom-20 right-6 z-30"
      >
        <router-link
          to="/wrong-answers"
          class="inline-flex items-center gap-2 px-4 py-3 bg-primary text-white rounded-lg shadow-lg hover:bg-primary-hover transition-colors text-sm font-medium"
        >
          <span>📊</span>
          <span>查看错题本 ({{ wrongQuestionIds.length }}道错题)</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cursor-col-resize {
  cursor: col-resize;
}
</style>

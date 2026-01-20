<script setup lang="ts">
import { ref } from 'vue'
import ArticleSection from './components/ArticleSection.vue'
import AiResultPanel from './components/AiResultPanel.vue'
import QuestionPanel from './components/QuestionPanel.vue'
import type { Question } from '../../types/article'

const currentArticle = ref({
  title: 'The Impact of Artificial Intelligence on Marine Biology',
  content:
    'Oceanographers and marine biologists are increasingly turning to sophisticated deep-learning algorithms to process vast quantities of underwater data.'
})

const selectionContext = ref<{
  text: string
  articleTitle: string
}>({
  text: '',
  articleTitle: ''
})

const handleSelect = (text: string) => {
  selectionContext.value = {
    text,
    articleTitle: currentArticle.value.title
  }
}

// 示例问题数据
const sampleQuestions = ref<Question[]>([
  {
    id: '1',
    questionText: '根据文章，海洋生物学家使用什么技术来处理水下数据？',
    type: 'MULTIPLE_CHOICE',
    options: [
      '深度学习算法',
      '人工神经网络',
      '传统统计方法',
      '手工分析'
    ]
  },
  {
    id: '2',
    questionText: '文章表明深度学习算法对海洋数据处理是必要的。',
    type: 'TRUE_FALSE_NOT_GIVEN',
    options: []
  },
  {
    id: '3',
    questionText: '海洋学家使用算法的主要原因是什么？',
    type: 'MULTIPLE_CHOICE',
    options: [
      '处理大量水下数据',
      '降低研究成本',
      '提高准确性',
      '减少工作时间'
    ]
  }
])

const updateAnswer = (questionId: string, answer: string) => {
  console.log(`Question ${questionId}: ${answer}`)
}

const handleSubmit = () => {
  console.log('Submitted answers:', selectedAnswers.value)
}

const selectedAnswers = ref<Record<string, string>>({})
</script>

<template>
  <div class="h-full">
    <!-- 三列布局：AI面板 | 文章 | 问题 -->
    <div class="h-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      <!-- 左侧 AI 面板 -->
      <AiResultPanel
        class="lg:col-span-3 order-3 lg:order-1 h-full"
        :selection="selectionContext"
      />

      <!-- 中间文章 -->
      <ArticleSection
        class="lg:col-span-6 order-1 lg:order-2 h-full"
        :title="currentArticle.title"
        :content="currentArticle.content"
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

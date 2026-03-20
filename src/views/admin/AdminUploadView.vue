<script setup lang="ts">
import { reactive, ref } from 'vue'
import { uploadArticle, type UploadArticlePayload } from '@/api/article'
import { BaseButton, BaseCard, BaseInput, BaseSelect, BaseTextarea } from '@/components'
import AdminQuestionItem from './components/AdminQuestionItem.vue'

type InputMode = 'form' | 'json'

interface AdminQuestion {
  questionNumber: number
  questionTypeCode: 'single_choice' | 'judgment'
  stem: string
  options?: Array<{ label: string; content: string }>
  correctAnswer: string
  analysis?: string
  answerParagraphNumber: number
  answerSentenceIndex: number
}

const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const inputMode = ref<InputMode>('form')

const form = reactive({
  title: '',
  examType: 'IELTS',
  difficulty: 'medium',
  topicCodesText: 'technology',
  paragraphContent: '',
  paragraphTranslation: ''
})

function createDefaultQuestion(index: number): AdminQuestion {
  return {
    questionNumber: index,
    questionTypeCode: 'single_choice',
    stem: '',
    options: [
      { label: 'A', content: '' },
      { label: 'B', content: '' },
      { label: 'C', content: '' },
      { label: 'D', content: '' }
    ],
    correctAnswer: 'A',
    analysis: '',
    answerParagraphNumber: 1,
    answerSentenceIndex: 0
  }
}

const questions = ref<AdminQuestion[]>([createDefaultQuestion(1)])

const jsonPayload = ref(JSON.stringify({
  title: 'Sample Article',
  examType: 'IELTS',
  difficulty: 'medium',
  topicCodes: ['technology'],
  paragraphs: [
    {
      paragraphNumber: 1,
      content: 'Write your paragraph here.',
      translation: '在这里填写段落翻译。',
      sentenceList: ['Write your paragraph here.'],
      sentenceTranslationList: ['在这里填写段落翻译。']
    }
  ],
  questions: [
    {
      questionNumber: 1,
      questionTypeCode: 'single_choice',
      stem: 'What is the best answer?',
      options: [
        { label: 'A', content: 'Option A' },
        { label: 'B', content: 'Option B' },
        { label: 'C', content: 'Option C' },
        { label: 'D', content: 'Option D' }
      ],
      correctAnswer: 'A',
      analysis: 'Because A is correct.',
      answerParagraphNumber: 1,
      answerSentenceIndex: 0
    }
  ]
}, null, 2))

function addQuestion() {
  questions.value.push(createDefaultQuestion(questions.value.length + 1))
}

function removeQuestion(index: number) {
  if (questions.value.length === 1) return
  questions.value.splice(index, 1)
  questions.value = questions.value.map((item, idx) => ({ ...item, questionNumber: idx + 1 }))
}

function updateQuestion(index: number, value: AdminQuestion) {
  questions.value[index] = value
}

function resetForm() {
  form.title = ''
  form.examType = 'IELTS'
  form.difficulty = 'medium'
  form.topicCodesText = 'technology'
  form.paragraphContent = ''
  form.paragraphTranslation = ''
  questions.value = [createDefaultQuestion(1)]
}

function buildPayloadFromForm(): UploadArticlePayload {
  if (!form.title.trim()) throw new Error('标题不能为空')
  if (!form.paragraphContent.trim()) throw new Error('正文不能为空')

  const topicCodes = form.topicCodesText
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

  if (topicCodes.length === 0) {
    throw new Error('至少填写一个 topicCode')
  }

  const normalizedQuestions = questions.value.map((question, index) => {
    if (!question.stem.trim()) {
      throw new Error(`第 ${index + 1} 题缺少题干`)
    }

    const questionTypeCode = question.questionTypeCode
    const options = questionTypeCode === 'single_choice'
      ? (question.options || [])
          .filter((opt) => opt.content.trim().length > 0)
          .map((opt) => ({ label: opt.label, content: opt.content.trim() }))
      : undefined

    if (questionTypeCode === 'single_choice' && (!options || options.length < 2)) {
      throw new Error(`第 ${index + 1} 题至少需要 2 个选项`)
    }

    return {
      questionNumber: index + 1,
      questionTypeCode,
      stem: question.stem.trim(),
      options,
      correctAnswer: question.correctAnswer,
      analysis: question.analysis?.trim() || undefined,
      answerParagraphNumber: question.answerParagraphNumber,
      answerSentenceIndex: question.answerSentenceIndex
    }
  })

  return {
    title: form.title.trim(),
    examType: form.examType,
    difficulty: form.difficulty,
    topicCodes,
    paragraphs: [
      {
        paragraphNumber: 1,
        content: form.paragraphContent.trim(),
        translation: form.paragraphTranslation.trim() || undefined,
        sentenceList: [form.paragraphContent.trim()],
        sentenceTranslationList: form.paragraphTranslation.trim() ? [form.paragraphTranslation.trim()] : undefined
      }
    ],
    questions: normalizedQuestions
  }
}

function parseJsonPayload(): UploadArticlePayload {
  let parsed: any
  try {
    parsed = JSON.parse(jsonPayload.value)
  } catch {
    throw new Error('JSON 格式不正确，请检查逗号、引号和括号')
  }

  if (!parsed?.title || !parsed?.examType || !parsed?.difficulty) {
    throw new Error('JSON 中 title/examType/difficulty 为必填字段')
  }

  if (!Array.isArray(parsed?.paragraphs) || parsed.paragraphs.length === 0) {
    throw new Error('JSON 中 paragraphs 必须是至少包含 1 个段落的数组')
  }

  if (!Array.isArray(parsed?.questions) || parsed.questions.length === 0) {
    throw new Error('JSON 中 questions 必须是至少包含 1 个题目的数组')
  }

  return parsed as UploadArticlePayload
}

function syncFormToJson() {
  errorMessage.value = ''
  successMessage.value = ''
  try {
    const payload = buildPayloadFromForm()
    jsonPayload.value = JSON.stringify(payload, null, 2)
    successMessage.value = '已将表单内容转换为 JSON'
  } catch (error: any) {
    errorMessage.value = error?.message || '表单转换失败'
  }
}

function syncJsonToForm() {
  errorMessage.value = ''
  successMessage.value = ''

  let payload: UploadArticlePayload
  try {
    payload = parseJsonPayload()
  } catch (error: any) {
    errorMessage.value = error?.message || 'JSON 解析失败'
    return
  }

  form.title = payload.title
  form.examType = payload.examType
  form.difficulty = payload.difficulty
  form.topicCodesText = (payload.topicCodes || []).join(', ')
  form.paragraphContent = payload.paragraphs[0]?.content || ''
  form.paragraphTranslation = payload.paragraphs[0]?.translation || ''

  questions.value = payload.questions.map((question, index) => ({
    questionNumber: question.questionNumber || index + 1,
    questionTypeCode: question.questionTypeCode === 'judgment' ? 'judgment' : 'single_choice',
    stem: question.stem || '',
    options: question.options || [
      { label: 'A', content: '' },
      { label: 'B', content: '' },
      { label: 'C', content: '' },
      { label: 'D', content: '' }
    ],
    correctAnswer: question.correctAnswer || 'A',
    analysis: question.analysis || '',
    answerParagraphNumber: question.answerParagraphNumber || 1,
    answerSentenceIndex: question.answerSentenceIndex || 0
  }))

  if (questions.value.length === 0) {
    questions.value = [createDefaultQuestion(1)]
  }

  successMessage.value = '已将 JSON 回填到表单'
}

async function handleSubmit() {
  errorMessage.value = ''
  successMessage.value = ''

  let payload: UploadArticlePayload
  try {
    payload = inputMode.value === 'form' ? buildPayloadFromForm() : parseJsonPayload()
  } catch (error: any) {
    errorMessage.value = error?.message || '参数校验失败'
    return
  }

  loading.value = true
  try {
    const { data } = await uploadArticle(payload)
    if (data.code !== 0) {
      throw new Error(data.message || '上传失败')
    }

    successMessage.value = `上传成功：${data.data.title}（ID: ${data.data.id}）`
    resetForm()
  } catch (error: any) {
    errorMessage.value = error?.message || '上传失败，请稍后重试'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <BaseCard>
    <template #header>
      <div>
        <h2 class="text-2xl font-bold text-text-primary mb-1">管理员文章上传</h2>
        <p class="text-text-secondary text-sm">按后端 UploadArticlePayload 结构录入文章数据。</p>
      </div>
    </template>

    <form class="space-y-6" @submit.prevent="handleSubmit">
      <div class="flex flex-wrap items-center gap-2">
        <div class="flex items-center gap-2 rounded-xl bg-surface-muted p-1 w-fit">
          <BaseButton
            type="button"
            size="sm"
            :variant="inputMode === 'form' ? 'primary' : 'ghost'"
            @click="inputMode = 'form'"
          >
            表单模式
          </BaseButton>
          <BaseButton
            type="button"
            size="sm"
            :variant="inputMode === 'json' ? 'primary' : 'ghost'"
            @click="inputMode = 'json'"
          >
            JSON 模式
          </BaseButton>
        </div>

        <BaseButton type="button" size="sm" variant="secondary" @click="syncFormToJson">
          表单转 JSON
        </BaseButton>
        <BaseButton type="button" size="sm" variant="secondary" @click="syncJsonToForm">
          JSON 回填表单
        </BaseButton>
      </div>

      <template v-if="inputMode === 'form'">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BaseInput v-model="form.title" label="标题" placeholder="请输入文章标题" />

          <BaseSelect v-model="form.examType" label="考试类型">
            <option value="IELTS">IELTS</option>
            <option value="TOEFL">TOEFL</option>
          </BaseSelect>

          <BaseSelect v-model="form.difficulty" label="难度">
            <option value="easy">easy</option>
            <option value="medium">medium</option>
            <option value="hard">hard</option>
          </BaseSelect>

          <BaseInput v-model="form.topicCodesText" label="话题代码" placeholder="technology, humanity" />
        </div>

        <BaseTextarea
          v-model="form.paragraphContent"
          label="正文段落"
          placeholder="请输入正文内容"
          :rows="8"
          min-height-class="min-h-[220px]"
        />

        <BaseTextarea
          v-model="form.paragraphTranslation"
          label="段落翻译（可选）"
          placeholder="请输入中文翻译"
          :rows="4"
          min-height-class="min-h-[120px]"
        />

        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="font-semibold text-text-primary">题目列表</h3>
            <BaseButton type="button" size="sm" @click="addQuestion">新增题目</BaseButton>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <AdminQuestionItem
              v-for="(question, index) in questions"
              :key="`${question.questionNumber}-${index}`"
              :model-value="question"
              :index="index"
              :can-remove="questions.length > 1"
              @update:model-value="(value) => updateQuestion(index, value)"
              @remove="removeQuestion(index)"
            />
          </div>
        </div>
      </template>

      <template v-else>
        <BaseTextarea
          v-model="jsonPayload"
          label="UploadArticlePayload JSON"
          placeholder="请粘贴 UploadArticlePayload JSON"
          :rows="18"
          min-height-class="min-h-[420px]"
        />
      </template>

      <div class="rounded-xl border border-border p-4 bg-surface-muted">
        <p v-if="successMessage" class="text-success text-sm">{{ successMessage }}</p>
        <p v-if="errorMessage" class="text-danger text-sm">{{ errorMessage }}</p>
        <p v-if="!successMessage && !errorMessage" class="text-text-secondary text-sm">提交后会进入后端文章库，可在阅读模块加载。</p>
      </div>

      <div class="flex items-center gap-3">
        <BaseButton type="submit" :loading="loading">提交文章</BaseButton>
        <BaseButton type="button" variant="secondary" @click="resetForm">重置表单</BaseButton>
      </div>
    </form>
  </BaseCard>
</template>

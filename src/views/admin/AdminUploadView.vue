<script setup lang="ts">
import { reactive, ref } from 'vue'
import { uploadArticle, type UploadArticlePayload } from '@/api/article'
import { BaseButton, BaseCard, BaseInput, BaseSelect, BaseTextarea } from '@/components'
import type { Question } from '@/types/article'
import AdminQuestionItem from './components/AdminQuestionItem.vue'

type InputMode = 'form' | 'json'

const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const inputMode = ref<InputMode>('form')
const jsonPayload = ref(`{
  "title": "Sample Article",
  "category": "academic",
  "difficulty": "medium",
  "source": "Custom Source",
  "author": "Admin",
  "content": "Write your article content here.",
  "questions": [
    {
      "id": 1,
      "type": "MULTIPLE_CHOICE",
      "questionText": "What is the best answer?",
      "options": ["A option", "B option", "C option", "D option"],
      "answer": "A",
      "explanation": "Because A is correct.",
      "difficulty": "medium"
    }
  ]
}`)

function createDefaultQuestion(id: number): Question {
  return {
    id,
    type: 'MULTIPLE_CHOICE',
    questionText: '',
    options: ['', '', '', ''],
    answer: 'A',
    explanation: '',
    difficulty: 'medium'
  }
}

const form = reactive({
  title: '',
  category: 'academic',
  difficulty: 'medium' as 'easy' | 'medium' | 'hard',
  source: '',
  author: '',
  content: ''
})

const questions = ref<Question[]>([
  createDefaultQuestion(1),
  createDefaultQuestion(2),
  createDefaultQuestion(3)
])

function addQuestion() {
  questions.value.push(createDefaultQuestion(questions.value.length + 1))
}

function removeQuestion(index: number) {
  if (questions.value.length === 1) return
  questions.value.splice(index, 1)
  questions.value = questions.value.map((item, idx) => ({ ...item, id: idx + 1 }))
}

function updateQuestion(index: number, value: Question) {
  questions.value[index] = value
}

function resetForm() {
  form.title = ''
  form.category = 'academic'
  form.difficulty = 'medium'
  form.source = ''
  form.author = ''
  form.content = ''
  questions.value = [
    createDefaultQuestion(1),
    createDefaultQuestion(2),
    createDefaultQuestion(3)
  ]

  jsonPayload.value = `{
  "title": "Sample Article",
  "category": "academic",
  "difficulty": "medium",
  "source": "Custom Source",
  "author": "Admin",
  "content": "Write your article content here.",
  "questions": [
    {
      "id": 1,
      "type": "MULTIPLE_CHOICE",
      "questionText": "What is the best answer?",
      "options": ["A option", "B option", "C option", "D option"],
      "answer": "A",
      "explanation": "Because A is correct.",
      "difficulty": "medium"
    }
  ]
}`
}

function buildPayloadFromForm(): UploadArticlePayload {
  return {
    title: form.title.trim(),
    category: form.category,
    difficulty: form.difficulty,
    source: form.source.trim() || undefined,
    author: form.author.trim() || undefined,
    content: form.content,
    questions: questions.value.map((q, idx) => {
      if (!q.questionText?.trim()) {
        throw new Error(`第 ${idx + 1} 题缺少题干`)
      }

      return {
        ...q,
        id: idx + 1,
        options: q.type === 'MULTIPLE_CHOICE' ? (q.options || []).map((item) => item.trim()) : undefined,
        answer: q.answer?.trim() || undefined,
        explanation: q.explanation?.trim() || undefined
      }
    })
  }
}

function parseJsonPayload(): UploadArticlePayload {
  let parsed: any
  try {
    parsed = JSON.parse(jsonPayload.value)
  } catch {
    throw new Error('JSON 格式不正确，请检查逗号、引号和括号')
  }

  if (!parsed?.title || !parsed?.content) {
    throw new Error('JSON 中 title 和 content 为必填字段')
  }

  if (!Array.isArray(parsed?.questions) || parsed.questions.length === 0) {
    throw new Error('JSON 中 questions 必须是至少包含 1 个题目的数组')
  }

  parsed.questions.forEach((question: any, index: number) => {
    if (!question.questionText?.trim()) {
      throw new Error(`第 ${index + 1} 题缺少题干`)
    }
  })

  return parsed as UploadArticlePayload
}

function syncFormToJson() {
  errorMessage.value = ''
  successMessage.value = ''
  const payload = buildPayloadFromForm()
  jsonPayload.value = JSON.stringify(payload, null, 2)
  successMessage.value = '已将表单内容转换为 JSON'
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

  form.title = payload.title || ''
  form.category = (payload.category as 'academic' | 'news' | 'fiction') || 'academic'
  form.difficulty = (payload.difficulty as 'easy' | 'medium' | 'hard') || 'medium'
  form.source = payload.source || ''
  form.author = payload.author || ''
  form.content = payload.content || ''

  questions.value = payload.questions
    .map((question, index) => {
      const type = question.type || 'MULTIPLE_CHOICE'
      return {
        id: index + 1,
        type,
        questionText: question.questionText || '',
        options:
          type === 'MULTIPLE_CHOICE'
            ? [...(question.options || ['', '', '', '']), '', '', '', ''].slice(0, 4)
            : undefined,
        answer:
          question.answer || (type === 'MULTIPLE_CHOICE' ? 'A' : 'TRUE'),
        explanation: question.explanation || '',
        difficulty: (question.difficulty as 'easy' | 'medium' | 'hard') || 'medium'
      } as Question
    })
    .filter((question) => question.questionText.trim().length > 0)

  if (questions.value.length === 0) {
    questions.value = [createDefaultQuestion(1)]
  }

  successMessage.value = '已将 JSON 回填到表单'
}

async function handleSubmit() {
  errorMessage.value = ''
  successMessage.value = ''

  let payload: UploadArticlePayload

  if (inputMode.value === 'form') {
    if (!form.title.trim() || !form.content.trim()) {
      errorMessage.value = '标题和正文不能为空'
      return
    }

    try {
      payload = buildPayloadFromForm()
    } catch (error: any) {
      errorMessage.value = error?.message || '题目校验失败'
      return
    }
  } else {
    try {
      payload = parseJsonPayload()
    } catch (error: any) {
      errorMessage.value = error?.message || 'JSON 解析失败'
      return
    }
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
        <h2 class="text-2xl font-bold text-slate-900 mb-1">管理员文章上传</h2>
        <p class="text-slate-600 text-sm">按 Article 类型录入文章，提交后可在阅读模块使用。</p>
      </div>
    </template>

    <form class="space-y-6" @submit.prevent="handleSubmit">
      <div class="flex flex-wrap items-center gap-2">
        <div class="flex items-center gap-2 rounded-xl bg-slate-100 p-1 w-fit">
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

        <BaseSelect v-model="form.category" label="分类">
          <option value="academic">academic</option>
          <option value="news">news</option>
          <option value="fiction">fiction</option>
        </BaseSelect>

        <BaseSelect v-model="form.difficulty" label="难度">
          <option value="easy">easy</option>
          <option value="medium">medium</option>
          <option value="hard">hard</option>
        </BaseSelect>

        <BaseInput v-model="form.source" label="来源" placeholder="例如 Nature" />
        <div class="md:col-span-2">
          <BaseInput v-model="form.author" label="作者" placeholder="例如 Dr. Smith" />
        </div>
      </div>

      <BaseTextarea
        v-model="form.content"
        label="正文内容"
        placeholder="请输入完整文章正文"
        :rows="8"
        min-height-class="min-h-[220px]"
      />

      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="font-semibold text-slate-800">题目列表</h3>
          <BaseButton type="button" size="sm" @click="addQuestion">新增题目</BaseButton>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AdminQuestionItem
            v-for="(question, index) in questions"
            :key="question.id"
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
          label="Article JSON"
          placeholder="请粘贴 UploadArticlePayload JSON"
          :rows="18"
          min-height-class="min-h-[420px]"
        />
      </template>

      <div class="rounded-xl border border-slate-200 p-4 bg-slate-50">
        <p v-if="successMessage" class="text-green-700 text-sm">{{ successMessage }}</p>
        <p v-if="errorMessage" class="text-red-700 text-sm">{{ errorMessage }}</p>
        <p v-if="!successMessage && !errorMessage" class="text-slate-500 text-sm">提交后将自动生成文章 ID、字数和阅读时长。</p>
      </div>

      <div class="flex items-center gap-3">
        <BaseButton type="submit" :loading="loading">提交文章</BaseButton>
        <BaseButton type="button" variant="secondary" @click="resetForm">重置表单</BaseButton>
      </div>
    </form>
  </BaseCard>
</template>

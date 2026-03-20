import request from './request'
import type { ApiResponse } from '../types/api'
import type { Article, ArticleListItem, SubmitAnswerRequest, SubmitAnswerResponse } from '../types/article'
import { mockArticles } from '../data/article'

const mockAuthEnabled = import.meta.env.VITE_ENABLE_MOCK_AUTH === 'true'

function mockResponse<T>(data: T, message = 'ok', code = 0) {
  return Promise.resolve({
    data: {
      code,
      message,
      data
    }
  } as { data: ApiResponse<T> })
}

export interface UploadArticlePayload {
  title: string
  examType: string
  difficulty: string
  topicCodes?: string[]
  paragraphs: Array<{
    paragraphNumber: number
    content: string
    translation?: string
    sentenceList: string[]
    sentenceTranslationList?: string[]
  }>
  questions: Array<{
    questionNumber: number
    questionTypeCode: string
    stem: string
    options?: Array<{ label: string; content: string }>
    correctAnswer: string
    analysis?: string
    answerParagraphNumber: number
    answerSentenceIndex: number
  }>
}

export function getArticleList(params?: { examType?: string; difficulty?: string; page?: number }) {
  if (mockAuthEnabled) {
    const filtered = mockArticles.filter((item) => {
      const examTypeOk = !params?.examType || item.examType === params.examType
      const difficultyOk = !params?.difficulty || item.difficulty === params.difficulty
      return examTypeOk && difficultyOk
    })

    const page = params?.page ?? 0
    const pageSize = 10
    const data: ArticleListItem[] = filtered
      .slice(page * pageSize, page * pageSize + pageSize)
      .map((item) => ({
        id: item.id,
        title: item.title,
        examType: item.examType,
        difficulty: item.difficulty,
        topics: item.topics
      }))

    return mockResponse<ArticleListItem[]>(data, 'mock article list success')
  }

  return request.get<ApiResponse<ArticleListItem[]>>('/articles', { params })
}

export function getArticleDetail(id: string) {
  if (mockAuthEnabled) {
    const article = mockArticles.find((item) => item.id === Number(id))
    if (!article) {
      return Promise.reject(new Error('article not found'))
    }
    return mockResponse<Article>(article, 'mock article detail success')
  }

  return request.get<ApiResponse<Article>>(`/articles/${id}`)
}

export function submitAnswer(articleId: string, data: SubmitAnswerRequest) {
  if (mockAuthEnabled) {
    const article = mockArticles.find((item) => item.id === Number(articleId))
    const question = article?.questions.find((item) => item.id === data.questionId)
    const correctAnswer = question?.correctAnswer || 'A'
    const analysis = question?.analysis || 'mock analysis'

    return mockResponse<SubmitAnswerResponse>(
      { isCorrect: data.userAnswer === correctAnswer, correctAnswer, analysis },
      'mock submit success'
    )
  }

  return request.post<ApiResponse<SubmitAnswerResponse>>(
    `/articles/${articleId}/submit`,
    data
  )
}

export function uploadArticle(payload: UploadArticlePayload) {
  if (mockAuthEnabled) {
    const nextArticleId = mockArticles.reduce((max, item) => Math.max(max, item.id), 0) + 1

    const topicNameMap: Record<string, string> = {
      technology: '科技',
      humanity: '人文',
      environment: '环境',
      health: '健康',
      language: '语言',
      animal: '动物'
    }

    const questionTypeNameMap: Record<string, string> = {
      single_choice: '单选题',
      multi_choice: '多选题',
      blank: '填空题',
      judgment: '判断题',
      match: '匹配题'
    }

    const article: Article = {
      id: nextArticleId,
      title: payload.title,
      examType: payload.examType,
      difficulty: payload.difficulty,
      paragraphs: payload.paragraphs,
      topics: (payload.topicCodes || []).map((code, index) => ({
        id: index + 1,
        code,
        name: topicNameMap[code] || code
      })),
      questions: payload.questions.map((question, index) => ({
        id: index + 1,
        questionNumber: question.questionNumber,
        questionTypeCode: question.questionTypeCode,
        questionTypeName: questionTypeNameMap[question.questionTypeCode] || question.questionTypeCode,
        stem: question.stem,
        options: question.options,
        correctAnswer: question.correctAnswer,
        analysis: question.analysis,
        answerParagraphNumber: question.answerParagraphNumber,
        answerSentenceIndex: question.answerSentenceIndex
      }))
    }

    mockArticles.unshift(article)
    return mockResponse<Article>(article, 'mock article upload success')
  }

  return request.post<ApiResponse<Article>>('/admin/uploadArticle', payload)
}

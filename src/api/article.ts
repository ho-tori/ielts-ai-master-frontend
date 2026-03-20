import request from './request'
import type { ApiResponse } from '../types/api'
import type { Article, ArticleListItem, SubmitAnswerRequest, SubmitAnswerResponse } from '../types/article'

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
    const data: ArticleListItem[] = []
    return mockResponse<ArticleListItem[]>(data, 'mock article list success')
  }

  return request.get<ApiResponse<Article[]>>('/articles', { params })
}

export function getArticleDetail(id: string) {
  if (mockAuthEnabled) {
    return Promise.reject(new Error('article not found'))
  }

  return request.get<ApiResponse<Article>>(`/articles/${id}`)
}

export function submitAnswer(articleId: string, data: SubmitAnswerRequest) {
  if (mockAuthEnabled) {
    return mockResponse<SubmitAnswerResponse>(
      { isCorrect: true, correctAnswer: 'A', analysis: 'mock analysis' },
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
    return mockResponse<Article>({} as Article, 'mock article upload success')
  }

  return request.post<ApiResponse<Article>>('/admin/uploadArticle', payload)
}

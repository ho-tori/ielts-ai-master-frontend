import request from './request'
import type { ApiResponse } from '../types/api'
import type { Article, Question } from '../types/article'
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

export type UploadArticlePayload = Omit<Article, 'id'>

export function getArticleList(params?: { category?: string; difficulty?: string; page?: number }) {
  if (mockAuthEnabled) {
    let data = [...mockArticles]

    if (params?.category) {
      data = data.filter((article) => article.category === params.category)
    }

    if (params?.difficulty) {
      data = data.filter((article) => article.difficulty === params.difficulty)
    }

    return mockResponse<Article[]>(data, 'mock article list success')
  }

  return request.get<ApiResponse<Article[]>>('/articles', { params })
}

export function getArticleDetail(id: string) {
  if (mockAuthEnabled) {
    const articleId = Number(id)
    const article = mockArticles.find((item) => item.id === articleId)

    if (!article) {
      return Promise.reject(new Error('article not found'))
    }

    return mockResponse<Article>(article, 'mock article detail success')
  }

  return request.get<ApiResponse<Article>>(`/articles/${id}`)
}

export function submitAnswer(articleId: string, answers: Record<string, string>) {
  if (mockAuthEnabled) {
    const article = mockArticles.find((item) => item.id === Number(articleId))
    if (!article) {
      return mockResponse<{ score: number }>({ score: 0 }, 'article not found', 404)
    }

    const total = article.questions.length
    if (total === 0) {
      return mockResponse<{ score: number }>({ score: 0 }, 'mock submit success')
    }

    let correct = 0
    article.questions.forEach((question) => {
      const userAnswer = answers[String(question.id)]
      if (userAnswer && question.answer && userAnswer === question.answer) {
        correct += 1
      }
    })

    const score = Math.round((correct / total) * 100)
    return mockResponse<{ score: number }>({ score }, 'mock submit success')
  }

  return request.post<ApiResponse<{ score: number }>>(
    `/articles/${articleId}/submit`,
    { answers }
  )
}

export function uploadArticle(payload: UploadArticlePayload) {
  if (mockAuthEnabled) {
    const nextId = mockArticles.reduce((max, item) => Math.max(max, item.id), 0) + 1
    const publishDate = payload.publishDate || new Date().toISOString().slice(0, 10)
    const wordCount = payload.wordCount || payload.content.trim().split(/\s+/).length
    const readingTime = payload.readingTime || Math.max(1, Math.ceil(wordCount / 220))

    const normalizedQuestions: Question[] = payload.questions.map((question, index) => ({
      ...question,
      id: Number(question.id) || index + 1
    }))

    const article: Article = {
      ...payload,
      id: nextId,
      publishDate,
      wordCount,
      readingTime,
      questions: normalizedQuestions
    }

    mockArticles.unshift(article)
    return mockResponse<Article>(article, 'mock article upload success')
  }

  return request.post<ApiResponse<Article>>('/admin/uploadArticle', payload)
}

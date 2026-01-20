import request from './request'
import type { ApiResponse } from '../types/api'
import type { Article } from '../types/article'

export function getArticleList(params?: { category?: string; page?: number }) {
  return request.get<ApiResponse<Article[]>>('/articles', { params })
}

export function getArticleDetail(id: string) {
  return request.get<ApiResponse<Article>>(`/articles/${id}`)
}

export function submitAnswer(articleId: string, answers: Record<string, string>) {
  return request.post<ApiResponse<{ score: number }>>(
    `/articles/${articleId}/submit`,
    { answers }
  )
}

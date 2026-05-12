import request from './request'
import type { ApiResponse } from '../types/api'

export interface WrongAnswerListItem {
  analysisId: number | null
  questionId: number
  articleId: number | null
  questionStem: string
  articleTitle: string
  errorTypes: string[]
  hasAnalysis: boolean
  createTime: string
}

export interface AnswerHistoryItem {
  questionId: number
  articleId: number | null
  articleTitle: string
  questionStem: string
  userAnswer: string
  correctAnswer: string
  isCorrect: boolean
  hasAnalysis: boolean
  answerTime: string
}

export interface AnalysisDetail {
  analysisId: number | null
  questionId: number
  questionStem: string
  correctAnswer: string
  userAnswer: string
  errorTypes: string[]
  detailedAnalysis: string | null
  correctThoughtPath: string | null
  examPoints: Array<{
    type: string
    sourceWord?: string
    targetWord?: string
    keyword?: string
    note?: string
    reason?: string
  }>
  createTime: string | null
  analysisExists: boolean
}

export function apiAnalyzeWrongAnswer(questionId: number) {
  return request.post<ApiResponse<AnalysisDetail>>(`/wrong-answers/${questionId}/analyze`, {}, { timeout: 120000 })
}

export function apiGetAnalysis(questionId: number) {
  return request.get<ApiResponse<AnalysisDetail>>(`/wrong-answers/${questionId}/analysis`)
}

export function apiGetWrongAnswerList(page: number = 0, size: number = 10) {
  return request.get<ApiResponse<WrongAnswerListItem[]>>('/wrong-answers/list', {
    params: { page, size }
  })
}

export function apiGetAnswerHistory(page: number = 0, size: number = 50) {
  return request.get<ApiResponse<AnswerHistoryItem[]>>('/wrong-answers/history', {
    params: { page, size }
  })
}

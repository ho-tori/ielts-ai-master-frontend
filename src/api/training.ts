import request from './request'
import type { ApiResponse } from '../types/api'

export interface TrainingItem {
  sourceSentence: string
  locateQuestion: {
    stem: string
    options: Array<{ label: string; content: string }>
    answer: string
    analysis: string
  }
  synonymQuestion: {
    stem: string
    options: Array<{ label: string; content: string }>
    answer: string
    analysis: string
    distractorDesign: Record<string, string>
  }
  userCorrect?: boolean
  userAnswer?: string
}

export interface TrainingSession {
  trainingId: number
  title: string
  focusPoint: string
  description: string
  items: TrainingItem[]
  score?: number
  completed: boolean
  createTime: string
}

export interface TrainingHistoryItem {
  trainingId: number
  title: string
  focusPoint: string
  score: number | null
  completed: boolean
  createTime: string
}

export function apiGenerateTraining() {
  return request.post<ApiResponse<TrainingSession>>('/training/generate')
}

export function apiGetTraining(id: number) {
  return request.get<ApiResponse<TrainingSession>>(`/training/${id}`)
}

export function apiSubmitTraining(id: number, answers: string[]) {
  return request.post<ApiResponse<TrainingSession>>(`/training/${id}/submit`, { answers })
}

export function apiGetTrainingHistory() {
  return request.get<ApiResponse<TrainingHistoryItem[]>>('/training/history')
}

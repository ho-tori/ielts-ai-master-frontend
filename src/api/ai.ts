import request from './request'
import type { ApiResponse } from '../types/api'
import type { AIResult } from '../types/ai'

export function analyzeWord(word: string, context?: string) {
  return request.post<ApiResponse<AIResult>>('/ai/analyze/word', {
    word,
    context
  })
}

export function analyzeSentence(sentence: string) {
  return request.post<ApiResponse<AIResult>>('/ai/analyze/sentence', {
    sentence
  })
}

export function generateExplanation(text: string, type: 'vocabulary' | 'grammar' | 'sentence') {
  return request.post<ApiResponse<AIResult>>('/ai/explain', {
    text,
    type
  })
}

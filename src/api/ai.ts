import request from './request'
import type { ApiResponse } from '../types/api'

export interface AiAnalyzeRequest {
	text: string
	articleTitle?: string
}

export interface AiAnalyzeResponse {
	explanation: string
	vocab: Array<{
		word: string
		meaning: string
	}>
}

export function apiAiAnalyze(data: AiAnalyzeRequest) {
	return request.post<ApiResponse<AiAnalyzeResponse>>('/ai/analyze', data)
}

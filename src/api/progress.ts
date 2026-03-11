import request from './request'
import type { ApiResponse } from '../types/api'

export interface ProgressData {
	articleId: number
	progress: number
	answeredQuestions: string[]
	everCompleted?: boolean
}

export interface UpdateProgressPayload {
	articleId: number
	progress: number
	answeredQuestions?: string[]
}

export function apiGetProgress(articleId: number) {
	return request.get<ApiResponse<ProgressData>>(`/progress/${articleId}`)
}

export function apiGetAllProgress() {
	return request.get<ApiResponse<ProgressData[]>>('/progress')
}

export function apiUpdateProgress(data: UpdateProgressPayload) {
	return request.put<ApiResponse<ProgressData>>('/progress', data)
}

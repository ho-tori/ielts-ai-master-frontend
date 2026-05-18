import request from './request'
import type { ApiResponse } from '../types/api'
import type { UserStats } from '../types/user'
import { mockArticles } from '../data/article'

const mockAuthEnabled = import.meta.env.VITE_ENABLE_MOCK_AUTH === 'true'

function mockResponse<T>(data: T, message = 'ok', code = 0) {
	return Promise.resolve({
		data: { code, message, data }
	} as { data: ApiResponse<T> })
}

export function apiGetUserStats() {
	if (mockAuthEnabled) {
		const totalArticlesRead = mockArticles.length
		const totalQuestionsAnswered = mockArticles.reduce((sum, item) => sum + item.questions.length, 0)
		return mockResponse<UserStats>({
			totalArticlesPracticed: totalArticlesRead,
			totalQuestionsAnswered,
			correctRate: 78,
			wrongAnswersCount: Math.floor(totalQuestionsAnswered * 0.22),
			pendingReviewCount: 3,
			lastPracticeTime: new Date().toISOString(),
			recentArticles: []
		}, 'mock stats success')
	}
	return request.get<ApiResponse<UserStats>>('/stats')
}

export function apiGetErrorStats(period: string = 'all') {
	return request.get<ApiResponse<Array<{ errorType: string; count: number; percentage: number }>>>('/error-patterns/stats', {
		params: { period }
	})
}

export function apiGetDiagnosis() {
	return request.get<ApiResponse<{ diagnosis: string; topWeaknesses: Array<{ errorType: string; description: string; suggestion: string }> }>>('/error-patterns/diagnosis')
}

import request from './request'
import type { ApiResponse } from '../types/api'
import type { UserStats } from '../types/user'
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

export function apiGetUserStats() {
	if (mockAuthEnabled) {
		const totalArticlesRead = mockArticles.length
		const totalQuestionsAnswered = mockArticles.reduce((sum, item) => sum + item.questions.length, 0)
		const correctRate = 78

		return mockResponse<UserStats>({
			totalArticlesRead,
			totalQuestionsAnswered,
			correctRate
		}, 'mock stats success')
	}

	return request.get<ApiResponse<UserStats>>('/stats')
}

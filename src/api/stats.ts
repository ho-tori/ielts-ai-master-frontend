import request from './request'
import type { ApiResponse } from '../types/api'

export interface UserStatsResponse {
	totalArticles: number
	totalVocabulary: number
	streakDays: number
}

export interface ReadingProgressResponse {
	dailyProgress: Array<{
		date: string
		articlesRead: number
		wordsLearned: number
	}>
}

export function apiGetUserStats() {
	return request.get<ApiResponse<UserStatsResponse>>('/stats')
}

export function apiGetReadingProgress() {
	return request.get<ApiResponse<ReadingProgressResponse>>('/stats/reading-progress')
}

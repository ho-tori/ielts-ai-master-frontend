import request from './request'
import type { ApiResponse } from '../types/api'
import type { UserStats } from '../types/user'

export function apiGetUserStats() {
	return request.get<ApiResponse<UserStats>>('/stats')
}

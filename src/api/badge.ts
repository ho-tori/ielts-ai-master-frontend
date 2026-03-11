import request from './request'
import type { ApiResponse } from '../types/api'

export interface BadgeResponse {
	id: string
	name: string
	description: string
	icon: string
	earned: boolean
	earnedAt?: string
}

export function apiGetBadges() {
	return request.get<ApiResponse<BadgeResponse[]>>('/badges')
}

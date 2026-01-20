import request from './request'
import type { ApiResponse } from '../types/api'
import type { LoginPayload, LoginResponse } from '../types/user'

export function apiLogin(data: LoginPayload) {
	return request.post<ApiResponse<LoginResponse>>('/auth/login', data)
}

export function apiProfile() {
	return request.get<ApiResponse<LoginResponse['user']>>('/auth/profile')
}


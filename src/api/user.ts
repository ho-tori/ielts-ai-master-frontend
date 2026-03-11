import request from './request'
import type { ApiResponse } from '../types/api'
import type { LoginPayload, LoginResponse, RegisterPayload, EditProfilePayload, AccountSecurityPayload, ReminderPayload } from '../types/user'

export function apiLogin(data: LoginPayload) {
	return request.post<ApiResponse<LoginResponse>>('/auth/login', data)
}

export function apiRegister(data: RegisterPayload) {
	return request.post<ApiResponse<LoginResponse>>('/auth/register', data)
}

export function apiProfile() {
	return request.get<ApiResponse<LoginResponse['user']>>('/auth/profile')
}

export function apiUpdateRecentArticles(recentArticles: number[]) {
	return request.put<ApiResponse<LoginResponse['user']>>('/auth/recent-articles', { recentArticles })
}

export function apiUpdateProfile(data: EditProfilePayload) {
	return request.put<ApiResponse<LoginResponse['user']>>('/auth/profile', data)
}

export function apiUpdateSecurity(data: AccountSecurityPayload) {
	return request.put<ApiResponse<LoginResponse['user']>>('/auth/security', data)
}

export function apiUpdateReminder(data: ReminderPayload) {
	return request.put<ApiResponse<LoginResponse['user']>>('/auth/reminder', data)
}


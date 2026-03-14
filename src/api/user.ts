import request from './request'
import type { ApiResponse } from '../types/api'
import type { LoginPayload, LoginResponse, RegisterPayload, EditProfilePayload, AccountSecurityPayload, ReminderPayload } from '../types/user'
import type { User } from '../types/user'
import { performLogin } from '../data/user'
import { getRole } from '../utils/storage'

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

function buildFallbackMockUser(email: string): User {
	const nameFromEmail = email.includes('@') ? email.split('@')[0] : email
	const role: 'user' | 'admin' = email.toLowerCase().includes('admin') ? 'admin' : 'user'
	return {
		id: `mock_${Date.now()}`,
		name: nameFromEmail || 'mock_user',
		email,
		role,
		recentArticles: []
	}
}

export function apiLogin(data: LoginPayload) {
	if (mockAuthEnabled) {
		const mockResult = performLogin(data.email, data.password)
		if (mockResult) {
			return mockResponse<LoginResponse>({
				token: mockResult.token,
				user: {
					...mockResult.user,
					role: mockResult.user.role || 'user'
				}
			})
		}

		const fallbackUser = buildFallbackMockUser(data.email)
		const token = `mock_token_${fallbackUser.id}`
		return mockResponse<LoginResponse>({ token, user: fallbackUser }, 'mock auth login success')
	}

	return request.post<ApiResponse<LoginResponse>>('/auth/login', data)
}

export function apiRegister(data: RegisterPayload) {
	if (mockAuthEnabled) {
		const user: User = {
			id: `mock_${Date.now()}`,
			name: data.name,
			email: data.email,
			role: 'user',
			target: data.target,
			phone: data.phone,
			recentArticles: []
		}
		const token = `mock_token_${user.id}`
		return mockResponse<LoginResponse>({ token, user }, 'mock auth register success')
	}

	return request.post<ApiResponse<LoginResponse>>('/auth/register', data)
}

export function apiProfile() {
	if (mockAuthEnabled) {
		const role = getRole() || 'user'
		const user: User = {
			id: 'mock_profile_user',
			name: role === 'admin' ? 'mock_admin' : 'mock_user',
			email: role === 'admin' ? 'admin@mock.local' : 'user@mock.local',
			role,
			recentArticles: []
		}
		return mockResponse<LoginResponse['user']>(user, 'mock profile success')
	}

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


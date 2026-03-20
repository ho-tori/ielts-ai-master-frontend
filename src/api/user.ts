import request from './request'
import type { ApiResponse } from '../types/api'
import type { LoginPayload, LoginResponse, RegisterPayload, EditProfilePayload, AccountSecurityPayload, User } from '../types/user'

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

function buildFallbackMockUser(username: string): User {
	return {
		id: `mock_${Date.now()}`,
		username,
		nickname: username,
	}
}

let mockCurrentUser: User = {
	id: 'mock_profile_user',
	username: 'mock_user',
	nickname: 'Mock User'
}

export function apiLogin(data: LoginPayload) {
	if (mockAuthEnabled) {
		const fallbackUser = buildFallbackMockUser(data.username)
		const token = `mock_token_${fallbackUser.id}`
		return mockResponse<LoginResponse>({ token, user: fallbackUser }, 'mock auth login success')
	}

	return request.post<ApiResponse<LoginResponse>>('/auth/login', data)
}

export function apiRegister(data: RegisterPayload) {
	if (mockAuthEnabled) {
		const user: User = {
			id: `mock_${Date.now()}`,
			username: data.username,
			nickname: data.nickname || data.username,
			email: data.email,
		}
		const token = `mock_token_${user.id}`
		return mockResponse<LoginResponse>({ token, user }, 'mock auth register success')
	}

	return request.post<ApiResponse<LoginResponse>>('/auth/register', data)
}

export function apiProfile() {
	if (mockAuthEnabled) {
		return mockResponse<LoginResponse['user']>(mockCurrentUser, 'mock profile success')
	}

	return request.get<ApiResponse<LoginResponse['user']>>('/auth/profile')
}

export function apiUpdateProfile(data: EditProfilePayload) {
	if (mockAuthEnabled) {
		mockCurrentUser = {
			...mockCurrentUser,
			nickname: data.nickname || mockCurrentUser.nickname,
			email: data.email || mockCurrentUser.email,
			avatar: data.avatar || mockCurrentUser.avatar
		}
		return mockResponse<LoginResponse['user']>(mockCurrentUser, 'mock profile update success')
	}

	return request.put<ApiResponse<LoginResponse['user']>>('/auth/profile', data)
}

export function apiUpdateSecurity(data: AccountSecurityPayload) {
	if (mockAuthEnabled) {
		return mockResponse<LoginResponse['user']>(mockCurrentUser, `mock security update success: ${data.password ? 'ok' : 'noop'}`)
	}

	return request.put<ApiResponse<LoginResponse['user']>>('/auth/security', data)
}

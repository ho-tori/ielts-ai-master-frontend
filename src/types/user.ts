export interface User {
	id: string
	name: string
	email: string
	role?: 'user' | 'admin'
	avatar?: string
	phone?: string
	target?: string
	badges?: string[]
	recentArticles?: number[]
	reminderEnabled?: boolean
	reminderTime?: string
}

// 用户认证信息（仅用于登录时的验证）
export interface UserAuth extends User {
	password: string
}

export interface LoginPayload {
	email: string
	password: string
}

export interface RegisterPayload {
	email: string
	password: string
	name: string
	phone?: string
	target?: string
}

export interface LoginResponse {
	token: string
	user: User
}

export interface UserStats {
	totalArticles: number
	totalVocabulary: number
	streakDays: number
	completedReadings?: number
	masteredVocab?: number
}

export interface UserProfile extends User {
	stats?: UserStats
	badges?: string[]
}

// 编辑资料表单
export interface EditProfilePayload {
	name: string
	target: string
}

// 账户安全表单
export interface AccountSecurityPayload {
	phone: string
	password: string
}

// 学习提醒表单
export interface ReminderPayload {
	reminderEnabled: boolean
	reminderTime: string
}


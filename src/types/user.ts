export interface User {
	id: string
	name: string
	email: string
	avatar?: string
	phone?: string
	target?: string // 备考目标 (如 6.0, 6.5, 7.0 等)
	badges?: string[] // 徽章
	recentArticles?: number[] // 最近阅读的文章ID列表
}

// 用户认证信息（仅用于登录时的验证）
export interface UserAuth extends User {
	password: string
}

export interface LoginPayload {
	email: string
	password: string
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


export interface User {
	id: string
	name: string
	email: string
	avatar?: string
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


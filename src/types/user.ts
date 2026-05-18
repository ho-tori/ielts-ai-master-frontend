export interface User {
	id: string
	username: string
	nickname: string
	email?: string
	avatar?: string
	recentArticles?: number[]
}

export interface LoginPayload {
	username: string
	password: string
}

export interface RegisterPayload {
	username: string
	password: string
	nickname?: string
	email?: string
}

export interface LoginResponse {
	token: string
	user: User
}

export interface RecentArticleStats {
  articleId: number
  title: string
  totalQuestions: number
  correctCount: number
  score: number
}

export interface UserStats {
  totalArticlesPracticed: number
  totalQuestionsAnswered: number
  correctRate: number
  wrongAnswersCount: number
  pendingReviewCount: number
  lastPracticeTime: string | null
  recentArticles: RecentArticleStats[]
}

export interface UserProfile extends User {
	stats?: UserStats
}

export interface EditProfilePayload {
	nickname: string
	email: string
	avatar?: string
}

export interface AccountSecurityPayload {
	password: string
}

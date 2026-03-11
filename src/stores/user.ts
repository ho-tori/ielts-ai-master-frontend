import { defineStore } from 'pinia'
import { apiLogin, apiProfile, apiUpdateRecentArticles } from '../api/user'
import type { User, LoginPayload } from '../types/user'
import { getToken, setToken, clearAuth } from '../utils/storage'

interface State {
	token: string | null
	user: User | null
	loading: boolean
	error: string | null
}

export const useUserStore = defineStore('user', {
	state: (): State => ({
		token: getToken(),
		user: null,
		loading: false,
		error: null
	}),
	actions: {
		async login(payload: LoginPayload) {
			this.loading = true
			this.error = null
			try {
				const { data } = await apiLogin(payload)
				if (data.code !== 0) throw new Error(data.message || '登录失败')
				setToken(data.data.token)
				this.token = data.data.token
				this.user = data.data.user
				console.log(`✅ 用户 ${data.data.user.name} 登录成功`)
				return true
			} catch (e: any) {
				this.error = e?.message || '登录失败'
				return false
			} finally {
				this.loading = false
			}
		},

		async fetchProfile() {
			if (!this.token) return
			try {
				const { data } = await apiProfile()
				if (data.code === 0) {
					this.user = data.data
				}
			} catch (e: any) {
				if (e?.response?.status === 403 || e?.response?.status === 401) {
					console.warn('Token 无效，已清除')
					clearAuth()
					this.token = null
				}
			}
		},

		logout() {
			clearAuth()
			this.token = null
			this.user = null
		},

		async addRecentArticle(articleId: number) {
			if (!this.user) {
				console.warn('❌ 用户未登录，无法添加最近阅读')
				return
			}

			if (!this.user.recentArticles) {
				this.user.recentArticles = []
			}

			const index = this.user.recentArticles.indexOf(articleId)
			if (index > -1) {
				this.user.recentArticles.splice(index, 1)
			}

			this.user.recentArticles.unshift(articleId)

			if (this.user.recentArticles.length > 10) {
				this.user.recentArticles.pop()
			}

			console.log('📚 文章添加到最近阅读:', this.user.recentArticles)

			try {
				const { data } = await apiUpdateRecentArticles(this.user.recentArticles)
				if (data.code === 0) {
					this.user = data.data
					console.log('☁️ 最近阅读已同步到服务器')
				}
			} catch (e) {
				console.warn('⚠️ 同步最近阅读到服务器失败', e)
			}
		}
	}
})


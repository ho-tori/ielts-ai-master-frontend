import { defineStore } from 'pinia'
import { apiLogin, apiProfile } from '../api/user'
import { authenticateUser, generateLoginResponse } from '../data/user'
import type { User, LoginPayload } from '../types/user'
import { getToken, setToken, clearAuth, getUser, setUser } from '../utils/storage'

const isMockAuthEnabled: boolean = String((import.meta as any).env?.VITE_ENABLE_MOCK_AUTH ?? 'true').toLowerCase() === 'true'

interface State {
	token: string | null
	user: User | null
	loading: boolean
	error: string | null
}

export const useUserStore = defineStore('user', {
	state: (): State => ({
		token: getToken(),
		user: getUser<User>(),
		loading: false,
		error: null
	}),
	actions: {
		async login(payload: LoginPayload) {
			this.loading = true
			this.error = null
			try {
				if (isMockAuthEnabled) {
					// 使用测试用户数据进行认证
					const userAuth = authenticateUser(payload.email, payload.password)
					
					if (!userAuth) {
						this.error = '邮箱或密码错误'
						return false
					}
					
					const loginResponse = generateLoginResponse(userAuth)
					setToken(loginResponse.token)
					setUser(loginResponse.user)
					this.token = loginResponse.token
					this.user = loginResponse.user
					
					console.log(`✅ 用户 ${loginResponse.user.name} 登录成功`)
					return true
				} else {
					const { data } = await apiLogin(payload)
					if (data.code !== 0) throw new Error(data.message || '登录失败')
					setToken(data.data.token)
					setUser(data.data.user)
					this.token = data.data.token
					this.user = data.data.user
					return true
				}
			} catch (e: any) {
				this.error = e?.message || '登录失败'
				return false
			} finally {
				this.loading = false
			}
		},

		async fetchProfile() {
			if (!this.token) return
			if (isMockAuthEnabled) {
				// 模拟模式下，使用本地 user 即可
				const local = getUser<User>()
				if (local) this.user = local
				return
			}
			try {
				const { data } = await apiProfile()
				if (data.code === 0) {
					this.user = data.data
					setUser(data.data)
				}
			} catch {
				/* ignore */
			}
		},

		logout() {
			clearAuth()
			this.token = null
			this.user = null
		},

		/**
		 * 添加文章到用户最近阅读列表
		 * @param articleId 文章ID
		 */
		addRecentArticle(articleId: number) {
			if (!this.user) {
				console.warn('❌ 用户未登录，无法添加最近阅读')
				return
			}

			console.log('🔍 开始处理最近阅读 - 文章ID:', articleId)
			console.log('📋 当前用户:', this.user.name, '现有最近阅读:', this.user.recentArticles)

			// 初始化 recentArticles 数组
			if (!this.user.recentArticles) {
				this.user.recentArticles = []
			}

			// 如果文章已在列表中，移到最前面（移除原位置）
			const index = this.user.recentArticles.indexOf(articleId)
			if (index > -1) {
				this.user.recentArticles.splice(index, 1)
				console.log('♻️ 文章已存在，从位置', index, '移除')
			}

			// 将文章ID添加到最前面
			this.user.recentArticles.unshift(articleId)
			console.log('✅ 文章添加到最前面，当前列表:', this.user.recentArticles)

			// 只保留最多 10 个最近阅读文章
			if (this.user.recentArticles.length > 10) {
				const removed = this.user.recentArticles.pop()
				console.log('🗑️ 超过10个限制，移除最后的:', removed)
			}

			// 同步到本地存储 - 关键！必须创建新对象以触发响应式
			const updatedUser = { ...this.user }
			setUser(updatedUser)
			this.user = updatedUser
			
			console.log('📚 ✨ 文章成功添加到最近阅读:', this.user.recentArticles)
		}
	}
})


import { defineStore } from 'pinia'
import { apiLogin, apiProfile } from '../api/user'
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
		user: getUser<User>() ,
		loading: false,
		error: null
	}),
	actions: {
		async login(payload: LoginPayload) {
			this.loading = true
			this.error = null
			try {
				if (isMockAuthEnabled) {
					// 本地模拟：无论什么邮箱/密码均登录成功
					const mock = {
						token: 'dev-token-' + Date.now(),
						user: {
							id: 'u_' + Math.random().toString(36).slice(2, 10),
							name: (payload.email || '用户').split('@')[0] || '用户',
							email: payload.email || 'user@example.com',
							avatar: ''
						} as User
					}
					setToken(mock.token)
					setUser(mock.user)
					this.token = mock.token
					this.user = mock.user
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
			} catch { /* ignore */ }
		},
		logout() {
			clearAuth()
			this.token = null
			this.user = null
		}
	}
})


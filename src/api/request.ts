import axios from 'axios'
import { getToken, clearAuth } from '../utils/storage'

const instance = axios.create({
	baseURL: import.meta.env.VITE_API_BASE || '/api',
	timeout: 15000
})

instance.interceptors.request.use((config) => {
	const token = getToken()
	if (token) {
		config.headers = config.headers || {}
		config.headers.Authorization = `Bearer ${token}`
	}
	return config
})

instance.interceptors.response.use(
	(res) => {
		return res
	},
	(err) => {
		if (err?.response?.status === 401) {
			clearAuth()
			// 可选：在此处做全局跳转到登录
			// window.location.href = '/login'
		}
		return Promise.reject(err)
	}
)

export default instance


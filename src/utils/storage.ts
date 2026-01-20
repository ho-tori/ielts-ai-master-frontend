const TOKEN_KEY = 'ielts_token'
const USER_KEY = 'ielts_user'

export function getToken(): string | null {
	return window.localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string) {
	window.localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
	window.localStorage.removeItem(TOKEN_KEY)
}

export function getUser<T = any>(): T | null {
	const raw = window.localStorage.getItem(USER_KEY)
	if (!raw) return null
	try { return JSON.parse(raw) as T } catch { return null }
}

export function setUser(data: unknown) {
	window.localStorage.setItem(USER_KEY, JSON.stringify(data))
}

export function clearUser() {
	window.localStorage.removeItem(USER_KEY)
}

export function clearAuth() {
	clearToken();
	clearUser();
}


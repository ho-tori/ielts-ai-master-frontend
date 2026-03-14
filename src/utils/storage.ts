const TOKEN_KEY = 'ielts_token'
const ROLE_KEY = 'ielts_role'

export function getToken(): string | null {
	return window.localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string) {
	window.localStorage.setItem(TOKEN_KEY, token)
}

export function getRole(): 'user' | 'admin' | null {
	const role = window.localStorage.getItem(ROLE_KEY)
	if (role === 'admin' || role === 'user') {
		return role
	}
	return null
}

export function setRole(role: 'user' | 'admin') {
	window.localStorage.setItem(ROLE_KEY, role)
}

export function clearRole() {
	window.localStorage.removeItem(ROLE_KEY)
}

export function clearToken() {
	window.localStorage.removeItem(TOKEN_KEY)
}

export function clearAuth() {
	clearToken()
	clearRole()
}


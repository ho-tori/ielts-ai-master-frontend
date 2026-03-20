import type { User, UserStats, UserProfile, LoginPayload, LoginResponse } from '../types/user'

export const mockUsersAuth: Array<User & { password: string }> = [
  {
    id: 'admin_001',
    username: 'admin',
    nickname: '系统管理员',
    password: 'admin123',
    email: 'admin@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
  },
  {
    id: 'user_001',
    username: 'zhangsan',
    nickname: '张三',
    password: 'password123',
    email: 'zhangsan@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan',
  },
  {
    id: 'user_002',
    username: 'lisi',
    nickname: '李四',
    password: 'password123',
    email: 'lisi@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisi',
  }
]

export const authenticateUser = (username: string, password: string): (User & { password: string }) | null => {
  const user = mockUsersAuth.find(u => u.username === username)
  
  if (!user) {
    console.warn(`用户 ${username} 不存在`)
    return null
  }
  
  if (user.password !== password) {
    console.warn(`用户 ${username} 密码错误`)
    return null
  }
  
  return user
}

export const generateLoginResponse = (userAuth: User & { password: string }): LoginResponse => {
  const token = `token_${userAuth.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  const { password, ...userWithoutPassword } = userAuth
  
  return {
    token,
    user: userWithoutPassword as User
  }
}

export const mockCurrentUser: User = {
  id: 'user_001',
  username: 'zhangsan',
  nickname: '张三',
  email: 'zhangsan@example.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan',
}

export const mockUserStats: UserStats = {
  totalArticlesRead: 45,
  totalQuestionsAnswered: 328,
  correctRate: 87
}

export const mockUserProfile: UserProfile = {
  id: 'user_001',
  username: 'zhangsan',
  nickname: '张三',
  email: 'zhangsan@example.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan',
  stats: mockUserStats
}

export const mockLoginPayload: LoginPayload = {
  username: 'zhangsan',
  password: 'password123'
}

export const mockLoginResponse: LoginResponse = {
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzAwMSIsImlhdCI6MTcwNTMwNjAwMH0.test_token_signature',
  user: mockCurrentUser
}

export const performLogin = (username: string, password: string): LoginResponse | null => {
  const userAuth = authenticateUser(username, password)
  if (!userAuth) {
    return null
  }
  return generateLoginResponse(userAuth)
}

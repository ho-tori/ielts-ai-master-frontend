import type { User, UserStats, UserProfile, LoginPayload, LoginResponse, UserAuth } from '../types/user'

/**
 * 测试数据 - 用户认证信息（包含密码，仅用于登录验证）
 */
export const mockUsersAuth: UserAuth[] = [
  {
    id: 'user_001',
    name: '张三',
    email: 'zhangsan@example.com',
    password: 'password123',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan',
    phone: '13800138000',
    target: '6.5',
    badges: ['入门者', '读书达人', '连续7天打卡'],
    recentArticles: [2, 3]
  },
  {
    id: 'user_002',
    name: '李四',
    email: 'lisi@example.com',
    password: 'password123',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisi',
    phone: '13900139000',
    target: '7.0',
    badges: ['进阶者', '词汇高手'],
    recentArticles: [1, 3]
  },
  {
    id: 'user_003',
    name: '王五',
    email: 'wangwu@example.com',
    password: 'password123',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wangwu',
    phone: '14000140000',
    target: '7.5',
    badges: ['高手', '完美者'],
    recentArticles: [1, 2]
  },
  {
    id: 'user_004',
    name: '赵六',
    email: 'zhaoliu@example.com',
    password: 'password123',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhaoliu',
    phone: '14100141000',
    target: '6.0',
    badges: ['新手'],
    recentArticles: [3]
  },
  {
    id: 'user_005',
    name: 'John Smith',
    email: 'john@example.com',
    password: 'password123',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    phone: '15000150000',
    target: '8.0',
    badges: ['专家', '讲师'],
    recentArticles: [1, 2, 3]
  }
]

/**
 * 登录认证服务（模拟后端验证）
 */
export const authenticateUser = (email: string, password: string): UserAuth | null => {
  const user = mockUsersAuth.find(u => u.email === email)
  
  if (!user) {
    console.warn(`用户 ${email} 不存在`)
    return null
  }
  
  if (user.password !== password) {
    console.warn(`用户 ${email} 密码错误`)
    return null
  }
  
  return user
}

/**
 * 从认证用户数据生成登录响应（去除密码）
 */
export const generateLoginResponse = (userAuth: UserAuth): LoginResponse => {
  // 生成 mock token
  const token = `token_${userAuth.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  // 提取不包含密码的用户信息
  const { password, ...userWithoutPassword } = userAuth
  
  return {
    token,
    user: userWithoutPassword as User
  }
}

/**
 * 测试数据 - 当前登录用户
 */
export const mockCurrentUser: User = {
  id: 'user_001',
  name: '张三',
  email: 'zhangsan@example.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan',
  phone: '13800138000',
  target: '6.5',
  badges: ['入门者', '读书达人', '连续7天打卡'],
  recentArticles: [2, 3] // 最近阅读的文章ID
}

/**
 * 测试数据 - 用户统计
 */
export const mockUserStats: UserStats = {
  totalArticles: 45,
  totalVocabulary: 328,
  streakDays: 7,
  completedReadings: 12,
  masteredVocab: 45
}

/**
 * 测试数据 - 用户资料（包含统计信息）
 */
export const mockUserProfile: UserProfile = {
  id: 'user_001',
  name: '张三',
  email: 'zhangsan@example.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan',
  phone: '13800138000',
  target: '6.5',
  badges: ['入门者', '读书达人', '连续7天打卡'],
  recentArticles: [2, 3],
  stats: mockUserStats
}

/**
 * 测试数据 - 登录负载
 */
export const mockLoginPayload: LoginPayload = {
  email: 'zhangsan@example.com',
  password: 'password123'
}

/**
 * 测试数据 - 登录响应
 */
export const mockLoginResponse: LoginResponse = {
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzAwMSIsImlhdCI6MTcwNTMwNjAwMH0.test_token_signature',
  user: mockCurrentUser
}

/**
 * 便捷方法：使用指定用户邮箱和密码进行登录
 * @example
 * const response = performLogin('zhangsan@example.com', 'password123')
 * if (response) {
 *   localStorage.setItem('token', response.token)
 *   // 更新用户状态
 * }
 */
export const performLogin = (email: string, password: string): LoginResponse | null => {
  const userAuth = authenticateUser(email, password)
  if (!userAuth) {
    return null
  }
  return generateLoginResponse(userAuth)
}

/**
 * 测试数据 - 已完成的练习记录
 */
export const mockCompletedExercises = [
  {
    exerciseId: 2,
    title: 'Climate Change and Global Warming',
    completedDate: '2024-03-08',
    score: 85,
    timeSpent: '14 min'
  },
  {
    exerciseId: 4,
    title: 'The Lost City: A Mystery Novel',
    completedDate: '2024-03-07',
    score: 92,
    timeSpent: '11 min'
  },
  {
    exerciseId: 6,
    title: 'Sustainable Fashion Industry',
    completedDate: '2024-03-06',
    score: 88,
    timeSpent: '9 min'
  },
  {
    exerciseId: 8,
    title: 'Innovation in Healthcare',
    completedDate: '2024-03-05',
    score: 79,
    timeSpent: '15 min'
  },
  {
    exerciseId: 10,
    title: 'Ocean Conservation Efforts',
    completedDate: '2024-03-04',
    score: 95,
    timeSpent: '9 min'
  },
  {
    exerciseId: 12,
    title: 'Modern Architecture Trends',
    completedDate: '2024-03-03',
    score: 81,
    timeSpent: '12 min'
  }
]

/**
 * 测试数据 - 学习报告
 */
export const mockLearningReport = {
  period: '本周',
  startDate: '2024-03-04',
  endDate: '2024-03-10',
  totalReadingTime: '72 min',
  articlesCompleted: 6,
  questionsAnswered: 24,
  correctRate: 0.875,
  newVocabulary: 45,
  streakDays: 7,
  trend: 'up' // up | down | flat
}

/**
 * 测试数据 - 词汇学习记录
 */
export const mockVocabularyRecords = [
  {
    word: 'artificial',
    meaning: '人工的，人造的',
    pronunciation: '/ɑːtɪˈfɪʃl/',
    difficulty: 'easy',
    lastReviewDate: '2024-03-10',
    nextReviewDate: '2024-03-15',
    masteryLevel: 3 // 0-5
  },
  {
    word: 'transformative',
    meaning: '具有改革性的，变革性的',
    pronunciation: '/trænzˈfɔːrmətɪv/',
    difficulty: 'hard',
    lastReviewDate: '2024-03-09',
    nextReviewDate: '2024-03-14',
    masteryLevel: 2
  },
  {
    word: 'algorithm',
    meaning: '算法',
    pronunciation: '/ˈælɡərɪðəm/',
    difficulty: 'hard',
    lastReviewDate: '2024-03-08',
    nextReviewDate: '2024-03-13',
    masteryLevel: 4
  },
  {
    word: 'recommendation',
    meaning: '推荐',
    pronunciation: '/ˌrekəˈmendeɪʃn/',
    difficulty: 'medium',
    lastReviewDate: '2024-03-07',
    nextReviewDate: '2024-03-12',
    masteryLevel: 3
  },
  {
    word: 'autonomous',
    meaning: '自主的，自治的',
    pronunciation: '/ɔːˈtɒnəməs/',
    difficulty: 'hard',
    lastReviewDate: '2024-03-06',
    nextReviewDate: '2024-03-11',
    masteryLevel: 2
  }
]

export interface Question {
  id: string
  type: 'TRUE_FALSE_NOT_GIVEN' | 'MULTIPLE_CHOICE'
  questionText: string
  options?: string[]
  answer?: string
  userAnswer?: string
  explanation?: string
  difficulty?: 'easy' | 'medium' | 'hard'
}

export interface Article {
  id: number
  title: string
  category: string
  source?: string
  content: string
  questions: Question[]
  author?: string
  publishDate?: string
  wordCount?: number
  readingTime?: number
}

export interface RecentArticle {
  id: number
  title: string
  category: string
  readDate?: string
  progress?: number
}

export interface Exercise {
  id: number
  title: string
  category: 'news' | 'academic' | 'fiction'
  difficulty: 'easy' | 'medium' | 'hard'
  wordCount: number
  estimatedTime: string
  description: string
  tags: string[]
  completed?: boolean
  score?: number
}
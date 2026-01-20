export interface Question {
  id: string;
  type: 'TRUE_FALSE_NOT_GIVEN' | 'MULTIPLE_CHOICE';
  questionText: string;
  options?: string[];
  answer?: string;
}

export interface Article {
  id: string;
  title: string;
  category: string;
  source?: string;
  content: string;
  questions: Question[];
}

export interface RecentArticle {
  id: string;
  title: string;
  category: string;
}

export interface Exercise {
  id: number;
  title: string;
  category: 'news' | 'academic' | 'fiction';
  difficulty: 'easy' | 'medium' | 'hard';
  wordCount: number;
  estimatedTime: string;
  description: string;
  tags: string[];
}
export interface Question {
  id: number;
  type: 'TRUE_FALSE_NOT_GIVEN' | 'CHOICE';
  questionText: string;
  options?: string[];
  answer: string;
}

export interface Article {
  id: string;
  title: string;
  category: string;
  source: string;
  content: string; // HTML 字符串或纯文本
  questions: Question[];
}
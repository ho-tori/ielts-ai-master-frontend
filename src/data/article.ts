import type { Exercise, Article, Question } from '../types/article'

export const mockExercises: Exercise[] = [
  {
    id: 1,
    title: 'The Future of Artificial Intelligence',
    category: 'academic',
    examType: 'IELTS',
    difficulty: 'medium',
    description: '关于人工智能发展趋势的学术文章',
    tags: ['AI', '科技'],
    wordCount: 450,
    estimatedTime: '12 min',
    questionCount: 3,
    completed: false
  },
  {
    id: 2,
    title: 'Climate Change and Global Warming',
    category: 'news',
    examType: 'IELTS',
    difficulty: 'hard',
    description: '讨论气候变化和全球变暖的影响',
    tags: ['环境', '气候'],
    wordCount: 520,
    estimatedTime: '15 min',
    questionCount: 3,
    completed: true
  },
  {
    id: 3,
    title: 'Ancient Civilizations',
    category: 'fiction',
    examType: 'IELTS',
    difficulty: 'easy',
    description: '古代文明探索故事',
    tags: ['历史', '文明'],
    wordCount: 380,
    estimatedTime: '10 min',
    questionCount: 3,
    completed: false
  }
]

export const mockQuestions: Question[] = [
  {
    id: 1,
    questionNumber: 1,
    questionTypeCode: 'single_choice',
    questionTypeName: '单选题',
    stem: 'According to the passage, AI is...',
    options: [
      { label: 'A', content: 'the simulation of human intelligence' },
      { label: 'B', content: 'a type of computer' },
      { label: 'C', content: 'a replacement for all jobs' },
      { label: 'D', content: 'a social media tool' }
    ],
    correctAnswer: 'A',
    analysis: '第一段定义了 AI。',
    answerParagraphNumber: 1,
    answerSentenceIndex: 0
  },
  {
    id: 2,
    questionNumber: 2,
    questionTypeCode: 'judgment',
    questionTypeName: '判断题',
    stem: 'AI will replace all jobs by 2030.',
    correctAnswer: 'FALSE',
    analysis: '文中并未支持该绝对化结论。',
    answerParagraphNumber: 2,
    answerSentenceIndex: 1
  },
  {
    id: 3,
    questionNumber: 3,
    questionTypeCode: 'single_choice',
    questionTypeName: '单选题',
    stem: 'What is a major concern mentioned?',
    options: [
      { label: 'A', content: 'Ethics and privacy' },
      { label: 'B', content: 'Lack of internet' },
      { label: 'C', content: 'No useful applications' },
      { label: 'D', content: 'No investments' }
    ],
    correctAnswer: 'A',
    analysis: '文中提到 ethics 与 privacy。',
    answerParagraphNumber: 3,
    answerSentenceIndex: 0
  }
]

export const mockArticles: Article[] = [
  {
    id: 1,
    title: 'The Future of Artificial Intelligence',
    examType: 'IELTS',
    difficulty: 'medium',
    paragraphs: [
      {
        paragraphNumber: 1,
        content: 'Artificial intelligence is transforming many industries.',
        translation: '人工智能正在改变许多行业。',
        sentenceList: ['Artificial intelligence is transforming many industries.'],
        sentenceTranslationList: ['人工智能正在改变许多行业。']
      },
      {
        paragraphNumber: 2,
        content: 'Its impact includes opportunities and ethical concerns.',
        translation: '它既带来机遇，也带来伦理问题。',
        sentenceList: ['Its impact includes opportunities and ethical concerns.'],
        sentenceTranslationList: ['它既带来机遇，也带来伦理问题。']
      }
    ],
    topics: [
      { id: 1, code: 'technology', name: '科技' }
    ],
    questions: mockQuestions
  }
]

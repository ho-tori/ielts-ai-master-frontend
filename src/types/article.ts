export interface QuestionOption {
	label: string
	content: string
}

export interface Question {
	id: number
	questionNumber: number
	questionTypeCode: string
	questionTypeName: string
	stem: string
	options?: QuestionOption[]
	correctAnswer?: string
	userAnswer?: string
	analysis?: string
	answerParagraphNumber: number
	answerSentenceIndex: number
}

export interface Paragraph {
	paragraphNumber: number
	content: string
	translation?: string
	sentenceList: string[]
	sentenceTranslationList?: string[]
}

export interface Topic {
	id: number
	code: string
	name: string
}

export interface Article {
	id: number
	title: string
	examType: string
	difficulty: string
	paragraphs: Paragraph[]
	topics: Topic[]
	questions: Question[]
}

export interface ArticleListItem {
	id: number
	title: string
	examType: string
	difficulty: string
	topics?: Topic[]
}

export interface RecentArticle {
	id: number
	title: string
	category?: string
	examType?: string
	readDate?: string
}

export interface Exercise {
	id: number
	title: string
	category: 'news' | 'academic' | 'fiction'
	examType?: string
	difficulty: string
	description: string
	tags: string[]
	wordCount: number
	estimatedTime: string
	questionCount: number
	completed?: boolean
}

export interface SubmitAnswerRequest {
	questionId: number
	userAnswer: string
}

export interface SubmitAnswerResponse {
	isCorrect: boolean
	correctAnswer: string
	analysis: string
}

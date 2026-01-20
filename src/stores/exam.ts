import { defineStore } from 'pinia'
import type { Article } from '../types/article'

interface ExamState {
  currentArticle: Article | null
  answers: Record<string, string>
  progress: number
  loading: boolean
  error: string | null
}

export const useExamStore = defineStore('exam', {
  state: (): ExamState => ({
    currentArticle: null,
    answers: {},
    progress: 0,
    loading: false,
    error: null
  }),
  actions: {
    setArticle(article: Article) {
      this.currentArticle = article
      this.answers = {}
      this.error = null
    },
    setAnswer(questionId: string, answer: string) {
      this.answers[questionId] = answer
    },
    setProgress(percent: number) {
      this.progress = Math.max(0, Math.min(100, percent))
    },
    reset() {
      this.currentArticle = null
      this.answers = {}
      this.progress = 0
      this.error = null
    }
  },
  getters: {
    answeredCount: (state) => Object.keys(state.answers).length,
    totalQuestions: (state) => state.currentArticle?.questions?.length || 0
  }
})

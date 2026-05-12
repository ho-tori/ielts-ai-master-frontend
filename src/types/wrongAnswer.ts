export interface WrongAnswerListItem {
  analysisId: number
  questionId: number
  questionStem: string
  articleTitle: string
  errorTypes: string[]
  createTime: string
}

export interface AnalysisDetail {
  analysisId: number
  questionId: number
  questionStem: string
  correctAnswer: string
  userAnswer: string
  errorTypes: string[]
  detailedAnalysis: string
  correctThoughtPath: string
  examPoints: ExamPoint[]
  createTime: string
}

export interface ExamPoint {
  type: string
  sourceWord?: string
  targetWord?: string
  keyword?: string
  note?: string
  reason?: string
}

export interface ErrorStats {
  errorType: string
  count: number
  percentage: number
}

export interface WeaknessItem {
  errorType: string
  description: string
  suggestion: string
}

export interface DiagnosisResult {
  diagnosis: string
  topWeaknesses: WeaknessItem[]
}

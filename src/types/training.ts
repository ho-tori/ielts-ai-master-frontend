export interface TrainingItem {
  sourceSentence: string
  locateQuestion: TrainingQuestion
  synonymQuestion: TrainingQuestion
  userCorrect?: boolean
  userAnswer?: string
}

export interface TrainingQuestion {
  stem: string
  options: Array<{ label: string; content: string }>
  answer: string
  analysis: string
  distractorDesign?: Record<string, string>
  userCorrect?: boolean
  userAnswer?: string
}

export interface TrainingSession {
  trainingId: number
  title: string
  focusPoint: string
  description: string
  items: TrainingItem[]
  score?: number | null
  completed: boolean
  createTime: string
}

export interface TrainingHistoryItem {
  trainingId: number
  title: string
  focusPoint: string
  score: number | null
  completed: boolean
  createTime: string
}

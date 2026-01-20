export interface VocabularyItem {
  word: string
  meaning: string
  example?: string
  partOfSpeech?: string
}

export interface SentenceAnalysis {
  original: string
  explanation: string
  grammar?: string
}

export interface AIResult {
  explanation: string
  vocabulary: VocabularyItem[]
  sentenceAnalysis?: SentenceAnalysis
  relatedQuestions?: string[]
}

export interface AIState {
  loading: boolean
  error: string | null
  result: AIResult | null
}

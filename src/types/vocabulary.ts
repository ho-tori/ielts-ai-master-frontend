export interface VocabularyItem {
  id: number
  word: string
  semanticCluster: string
  sourceSentence: string
  questionReplacement: string
  nuanceNotes: string
  synonyms: string[]
  exampleSentences: string[]
}

export interface ClusterInfo {
  name: string
  count: number
}

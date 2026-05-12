import request from './request'
import type { ApiResponse } from '../types/api'

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

export function apiGenerateVocabulary() {
  return request.post<ApiResponse<VocabularyItem[]>>('/vocabulary/generate')
}

export function apiGetVocabularyList(cluster?: string) {
  return request.get<ApiResponse<VocabularyItem[]>>('/vocabulary/list', {
    params: cluster ? { cluster } : {}
  })
}

export function apiGetClusters() {
  return request.get<ApiResponse<ClusterInfo[]>>('/vocabulary/clusters')
}

export function apiDeleteVocabulary(id: number) {
  return request.delete<ApiResponse<null>>(`/vocabulary/${id}`)
}

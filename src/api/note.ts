import request from './request'
import type { ApiResponse } from '../types/api'

export interface NoteItem {
  id: number
  paragraphNumber: number
  position: { startOffset?: number; endOffset?: number; text?: string }
  highlightColor: string
  noteContent: string | null
  type: 'highlight' | 'note'
}

export function apiGetNotes(articleId: number) {
  return request.get<ApiResponse<NoteItem[]>>('/notes', { params: { articleId } })
}

export function apiSaveHighlight(articleId: number, paragraphNumber: number, position: Record<string, any>, color?: string) {
  return request.post<ApiResponse<any>>('/notes/highlight', { articleId, paragraphNumber, position, color })
}

export function apiSaveNote(articleId: number, paragraphNumber: number, content: string) {
  return request.post<ApiResponse<any>>('/notes/save', { articleId, paragraphNumber, content })
}

export function apiDeleteNote(id: number) {
  return request.delete<ApiResponse<null>>(`/notes/${id}`)
}

export function apiClearHighlights(articleId: number) {
  return request.delete<ApiResponse<null>>('/notes/highlights', { params: { articleId } })
}

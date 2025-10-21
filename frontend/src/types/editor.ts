export interface EditorState {
  activeFile: string | null
  openFiles: string[]
  cursorPosition: CursorPosition
  selection: Selection
  theme: 'light' | 'dark'
  fontSize: number
  tabSize: number
  wordWrap: boolean
  minimap: boolean
}

export interface CursorPosition {
  line: number
  column: number
}

export interface Selection {
  startLine: number
  startColumn: number
  endLine: number
  endColumn: number
}

export interface CodeSuggestion {
  id: string
  text: string
  range: {
    startLine: number
    startColumn: number
    endLine: number
    endColumn: number
  }
  confidence: number
  source: 'ai' | 'snippet' | 'autocomplete'
}

export interface AIRequest {
  type: 'explain' | 'refactor' | 'debug' | 'optimize' | 'generate'
  code: string
  language: string
  context?: string
  options?: Record<string, any>
}

export interface AIResponse {
  id: string
  type: string
  content: string
  suggestions?: CodeSuggestion[]
  metadata?: Record<string, any>
}

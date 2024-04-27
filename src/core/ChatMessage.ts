import { ChatRole } from './ChatRole'

export type ChatMessage = {
  id: number
  role: ChatRole
  content: string
  date: Date
}

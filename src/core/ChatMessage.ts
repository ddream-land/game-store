import { ChatRole } from './ChatRole'

export type AIChatMessage = {
  role: ChatRole
  content: string
}

export type ChatMessage = AIChatMessage & {
  id: number
  date: Date
}

let uid = Date.now()
export function chatMessage(content: string, role: ChatRole = ChatRole.User): ChatMessage {
  
  const chatMsg: ChatMessage = {
    id: uid++,
    role: role,
    content: content,
    date: new Date(),
  }

  return chatMsg
}

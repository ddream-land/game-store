import { ChatRole } from './ChatRole'

export enum MessageSummaryState {
  NotSummary = 1,
  Summary = 2,
}

export type AIChatMessage = {
  role: ChatRole
  content: string
}

export type ChatMessage = AIChatMessage & {
  id: string
  date: Date
}

export type NuwaChatMessage = ChatMessage & {
  summaryState: MessageSummaryState
  roleId: string
  contents?: string[]
  timestamp?: number
  tokens?: number
}

let uid = Date.now()
export function chatMessage(content: string, role: ChatRole = ChatRole.User): ChatMessage {
  const chatMsg: ChatMessage = {
    id: (uid++).toString(),
    role: role,
    content: content,
    date: new Date(),
  }

  return chatMsg
}

export function nuwaChatMessage(
  content: string,
  roleId: string,
  role: ChatRole = ChatRole.User
): NuwaChatMessage {
  const chatMsg: NuwaChatMessage = {
    id: (uid++).toString(),
    role: role,
    content: content,
    date: new Date(),

    summaryState: MessageSummaryState.NotSummary,
    roleId: roleId,
  }

  return chatMsg
}

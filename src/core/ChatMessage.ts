import { ChatRole } from './ChatRole'

export enum MessageSummaryState {
  NotSummary = 1,
  Summary = 2,
}

export type AIChatMessage = {
  role: ChatRole
  content: string
}

export type NuwaChatMessage = AIChatMessage & {
  id: string
  date: Date
  summaryState: MessageSummaryState
  roleId: string
  contents?: {
    content: string
    tokens: number
  }[]
  timestamp?: number
  tokens: number
}

let uid = Date.now()

export function nuwaChatMessage(
  content: string,
  roleId: string,
  tokens: number = 0,
  role: ChatRole = ChatRole.User
): NuwaChatMessage {
  const chatMsg: NuwaChatMessage = {
    id: (uid++).toString(),
    role: role,
    content: content,
    date: new Date(),

    summaryState: MessageSummaryState.NotSummary,
    roleId: roleId,
    tokens,
  }

  return chatMsg
}

import { NuwaChatMessage } from '@/core/ChatMessage'
import { History } from './resDto'
import { ChatRole } from '@/core/ChatRole'

export function historyMapping(dto: History[]): NuwaChatMessage[] {
  const result: NuwaChatMessage[] = []
  const len = dto.length
  for (let i = 0; i < len; i++) {
    const item = dto[i]

    result.push({
      role: item.is_sender ? ChatRole.User : ChatRole.Assistant,
      content: item.content,
      id: item.msg_id,
      date: item.last_udpate,

      summaryState: item.summary,
      roleId: item.role_id,
      timestamp: item.timestamp,
      tokens: item.tokens,
    })
  }

  return result
}

import { NuwaChatMessage } from '@/core/ChatMessage'
import { History } from './resDto'
import { ChatRole } from '@/core/ChatRole'

export function historyMapping(dto: History[]): NuwaChatMessage[] {
  const result: NuwaChatMessage[] = []
  const len = dto.length
  for (let i = 0; i < len; i++) {
    const item = dto[i]

    result.push({
      summary: item.summary,
      msgId: item.msg_id,
      content: item.content,
      role: item.is_sender ? ChatRole.User : ChatRole.Assistant,
      lastUpdate: new Date(item.last_udpate),
      roleId: item.role_id,
      timestamp: item.timestamp,
      uid: item.uid,
    })
  }

  return result
}

import { DataDto, DtoBase } from '../dtoBase'
import { request } from '../request'
import { historyMapping } from './mapping'
import { History } from './resDto'

export async function chatHistory(roleId: string, signal?: AbortSignal) {
  const res = await request<DataDto<History[]>>({
    url: `/nuwa/api/backends/chat-completions/history`,
    method: 'POST',
    data: {
      role_id: roleId,
    },
    signal,
  })

  return historyMapping(res.data)
}

export async function newChat(roleId: string) {
  const res = await request<DtoBase>({
    url: `/nuwa/api/backends/chat-completions/reset_chat`,
    method: 'POST',
    data: {
      role_id: roleId,
    },
  })

  return res
}

export async function delHistory(humanMsgId: string, nextAIMsgId: string) {
  const res = await request<DtoBase>({
    url: `/nuwa/api/backends/chat-completions/delete`,
    method: 'POST',
    data: {
      msg_ids: [humanMsgId, nextAIMsgId],
    },
  })

  return res
}

export async function updateChatMsg(msgId: string, newContent: string) {
  const res = await request<DtoBase>({
    url: `/nuwa/api/backends/chat-completions/edit`,
    method: 'POST',
    data: {
      msg_id: msgId,
      update_content: newContent,
    },
  })

  return res
}

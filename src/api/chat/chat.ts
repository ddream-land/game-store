import { DataDto, DtoBase } from '../dtoBase'
import { request } from '../request'
import { historyMapping } from './mapping'
import { History } from './resDto'

export async function history(roleId: string) {
  const res = await request<DataDto<History[]>>({
    url: `/api/backends/chat-completions/history`,
    method: 'POST',
    data: {
      role_id: roleId,
    },
  })

  return historyMapping(res.data)
}

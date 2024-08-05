import { request } from '../request'

export async function heart() {
  return await request<void>({
    url: `/ddream/api/v1/common/heartbeat`,
    method: 'post',
  })
}

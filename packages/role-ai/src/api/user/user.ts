import { DtoBase, DataDto } from '../dtoBase'
import { request, requestList } from '../request'
import { UserInfo } from '@/core/User'

export async function getUserInfo() {
  const res = await request<DataDto<UserInfo>>({
    url: `/ddream/api/v1/user/info/get`,
    method: 'POST',
  })

  return res
}

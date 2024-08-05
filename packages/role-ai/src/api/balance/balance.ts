import { BalanceType } from '@/core/BalanceType'
import { DtoBase, DataDto } from '../dtoBase'
import { request, requestList } from '../request'

export async function getBalance() {
  const res = await request<DataDto<Record<BalanceType, number>>>({
    url: `/ddream/api/v1/finance/get_bags`,
    method: 'POST',
  })

  return res
}

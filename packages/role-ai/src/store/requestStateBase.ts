import { ReqStatus } from '@/core/ReqStatus'

export interface RequestStateBase {
  status: ReqStatus
  error?: string
}

export const requestStateBase: RequestStateBase = {
  status: ReqStatus.Idel,
}

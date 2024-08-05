import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RequestStateBase, requestStateBase } from '../requestStateBase'
import { ReqStatus } from '@/core/ReqStatus'
import { Auth } from '@ddreamland/common'
import { getBalance } from '@/api/balance/balance'
import { BalanceType } from '@/core/BalanceType'

interface BalanceState extends RequestStateBase {
  ddreamToken: number
}

const initialState: BalanceState = {
  ...requestStateBase,
  ddreamToken: 0,
}

export const balanceSlice = createSlice({
  name: 'balance',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(refreshBalanceInfo.pending, function (state, action) {
        state.status = ReqStatus.Pending
        state.ddreamToken = 0
      })
      .addCase(refreshBalanceInfo.fulfilled, (state, action) => {
        if (BalanceType.DDreamToken in action.payload) {
          state.ddreamToken = action.payload[BalanceType.DDreamToken]
        } else {
          state.ddreamToken = 0
        }
        state.status = ReqStatus.Succeeded
      })
      .addCase(refreshBalanceInfo.rejected, (state, action) => {
        state.status = ReqStatus.Failed
        state.error = action.error.message
        state.ddreamToken = 0
      })
  },
})

export const refreshBalanceInfo = createAsyncThunk('balance/refreshBalanceInfo', async function () {
  const res = await getBalance()
  if (res.code !== 0) {
    throw new Error(res.msg ?? 'error')
  }
  return res.data
})

export const {} = balanceSlice.actions

export default balanceSlice.reducer

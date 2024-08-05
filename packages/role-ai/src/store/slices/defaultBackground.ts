import { getDefaultBackground } from '@/api/backgrounds/backgrounds'
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RequestStateBase, requestStateBase } from '../requestStateBase'
import { ReqStatus } from '@/core/ReqStatus'
import { isString } from '@/libs/isTypes'

interface DefaultBackgroundState extends RequestStateBase {
  defaultBg: string | undefined
}

const initialState: DefaultBackgroundState = {
  ...requestStateBase,
  defaultBg: undefined,
}

export const defaultBackgroundSlice = createSlice({
  name: 'defaultBackground',
  initialState,
  reducers: {
    setDefaultBg(state, action: PayloadAction<string | undefined>) {
      state.defaultBg = action.payload
    },
  },
  extraReducers(builder) {
    builder
      .addCase(refreshDefaultBg.pending, function (state, action) {
        state.status = ReqStatus.Pending
      })
      .addCase(refreshDefaultBg.fulfilled, (state, action) => {
        state.status = ReqStatus.Succeeded
        state.defaultBg = action.payload
      })
      .addCase(refreshDefaultBg.rejected, (state, action) => {
        state.status = ReqStatus.Failed
        state.error = action.error.message
      })
  },
})

export const refreshDefaultBg = createAsyncThunk('defaultBackground/request', async function () {
  const res = await getDefaultBackground()
  if (res.code === 0) {
    return res.data
  }
  throw new Error(isString(res.msg) ? res.msg : '')
})

export const { setDefaultBg } = defaultBackgroundSlice.actions

export default defaultBackgroundSlice.reducer

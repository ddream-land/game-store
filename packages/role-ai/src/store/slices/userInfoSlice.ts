import { getUserInfo } from '@/api/user/user'
import { DEFAULT_NO_USER, UserInfo } from '@/core/User'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RequestStateBase, requestStateBase } from '../requestStateBase'
import { ReqStatus } from '@/core/ReqStatus'
import { Auth } from '@ddreamland/common'
import { refreshBalanceInfo } from './balanceSlice'

interface UserInfoState extends RequestStateBase {
  info: UserInfo
}

const initialState: UserInfoState = {
  ...requestStateBase,
  info: DEFAULT_NO_USER,
}

export const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // refreshUserInfo
      .addCase(refreshUserInfo.pending, function (state, action) {
        state.status = ReqStatus.Pending
      })
      .addCase(refreshUserInfo.fulfilled, (state, action) => {
        state.info = action.payload
        state.status = ReqStatus.Succeeded
      })
      .addCase(refreshUserInfo.rejected, (state, action) => {
        state.status = ReqStatus.Failed
        state.error = action.error.message
        state.info = DEFAULT_NO_USER
      })

      // logout
      .addCase(logout.pending, function (state, action) {
        state.status = ReqStatus.Pending
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.status = ReqStatus.Succeeded
        state.info = DEFAULT_NO_USER
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = ReqStatus.Failed
        state.error = action.error.message
        state.info = DEFAULT_NO_USER
      })
  },
})

export const refreshUserInfo = createAsyncThunk(
  'userInfo/refreshUserInfo',
  async function (_, { dispatch, getState }) {
    const res = await getUserInfo()
    await dispatch(refreshBalanceInfo())

    if (res.code !== 0) {
      throw new Error(res.msg ?? 'error')
    }
    return res.data
  }
)

export const logout = createAsyncThunk('userInfo/logout', async function () {
  try {
    await Auth.logout()
  } catch {}
})

export const {} = userInfoSlice.actions

export default userInfoSlice.reducer

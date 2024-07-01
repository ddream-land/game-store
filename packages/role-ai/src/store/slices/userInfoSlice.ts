import { getUserInfo } from '@/api/user/user'
import { UserInfo } from '@/core/User'
import { PayloadAction, SliceCaseReducers, SliceSelectors, createSlice } from '@reduxjs/toolkit'

const initialState: UserInfo = {
  email: '',
  uid: -1,
  wallet: '',
  name: '',
  avatar: '',
}

export const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    resetts: function (userInfo) {
      userInfo.email = ''
      userInfo.uid = -1
      userInfo.wallet = ''
      userInfo.name = ''
      userInfo.avatar = ''
    },
    reset: (userInfo) => {
      userInfo.email = ''
      userInfo.uid = -1
      userInfo.wallet = ''
      userInfo.name = ''
      userInfo.avatar = ''
    },
    refreshUserInfo: (userInfo) => {
      ;(async function () {
        const userInfoRes = await getUserInfo()
        if (userInfoRes.code === 0) {
          //   setUserInfo(userInfoRes.data)
        }
      })()
    },
  },
})

// Action creators are generated for each case reducer function
export const { refreshUserInfo, resetts, reset } = userInfoSlice.actions

export default userInfoSlice.reducer

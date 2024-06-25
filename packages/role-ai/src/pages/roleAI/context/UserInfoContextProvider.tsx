import { getUserInfo } from '@/api/user/user'
import { KEEP_ROLE_PANEL_OPEN } from '@/constant/env'
import { UserInfo } from '@/core/User'
import { Auth } from '@ddreamland/common'
import { ReactNode, createContext, useContext, useEffect, useState } from 'react'

const UserInfoStateContext = createContext<UserInfo>({
  email: '',
  uid: 0,
  wallet: '',
  name: '',
  avatar: '',
})

const SetUserInfoStateContext = createContext<React.Dispatch<React.SetStateAction<UserInfo>>>(
  function () {}
)

export function UserInfoContextProvider({ children }: { children: ReactNode }) {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    email: '',
    uid: -1,
    wallet: '',
    name: '',
    avatar: '',
  })

  useEffect(function () {
    ;(async function () {
      const userInfoRes = await getUserInfo()
      if (userInfoRes.code === 0) {
        setUserInfo(userInfoRes.data)
      }
    })()
  }, [])

  return (
    <UserInfoStateContext.Provider value={userInfo}>
      <SetUserInfoStateContext.Provider value={setUserInfo}>
        {children}
      </SetUserInfoStateContext.Provider>
    </UserInfoStateContext.Provider>
  )
}

export function useUserInfoContext() {
  return useContext(UserInfoStateContext)
}

export function useSetUserInfoContext() {
  const setUserInfo = useContext(SetUserInfoStateContext)

  async function Logout() {
    try {
      await Auth.logout()
    } catch {
    } finally {
      setUserInfo({
        email: '',
        uid: -1,
        wallet: '',
        name: '',
        avatar: '',
      })
    }
  }

  async function refreshUserInfo() {
    try {
      const userInfoRes = await getUserInfo()
      if (userInfoRes.code === 0) {
        setUserInfo(userInfoRes.data)
      } else {
        setUserInfo({
          email: '',
          uid: -1,
          wallet: '',
          name: '',
          avatar: '',
        })
      }
    } catch {
      setUserInfo({
        email: '',
        uid: -1,
        wallet: '',
        name: '',
        avatar: '',
      })
    }
  }

  return { setUserInfo, refreshUserInfo, Logout }
}

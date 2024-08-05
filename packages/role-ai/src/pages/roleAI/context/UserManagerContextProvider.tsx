import {
  MutableRefObject,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Auth, LoginModal } from '@ddreamland/common'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { refreshUserInfo } from '@/store/slices/userInfoSlice'
import { useAppSelector } from '@/hooks/useAppSelector'
import { ReqStatus } from '@/core/ReqStatus'
import {
  clearCharacterList,
  refreshCharacterList,
  setCurrentAdminCharacterId,
  setCurrentChatCharacterId,
} from '@/store/slices/characterSlice'
import { refreshDefaultBg, setDefaultBg } from '@/store/slices/defaultBackground'
import { stop } from '@/store/slices/ttsSlice'
import { setDdreamTokenPayIsOpen, setPowerExchangePayIsOpen } from '@/store/slices/uiSlice'

const LoginModalOpenStateContext = createContext<boolean>(true)
const SetLoginModalOpenStateContext = createContext<(openStatus: boolean) => void>(function (
  openStatus: boolean
) {})

export function useSetLoginModalOpenState() {
  const setLoginModalOpenState = useContext(SetLoginModalOpenStateContext)

  return {
    setLoginModalOpenState,
  }
}

export function UserManagerContextProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation()
  const dispatch = useAppDispatch()
  const [loginIsOpen, setLoginIsOpen] = useState(false)
  const userInfo = useAppSelector((state) => state.userInfo.info)
  const userInfoStatus = useAppSelector((state) => state.userInfo.status)

  function onLogin() {
    ;(async function () {
      await dispatch(refreshUserInfo())
      setLoginIsOpen(false)
    })()
  }

  useEffect(
    function () {
      dispatch(setCurrentAdminCharacterId(undefined))
      dispatch(setCurrentChatCharacterId(undefined))
      dispatch(clearCharacterList())
      dispatch(setDefaultBg(undefined))
      dispatch(stop())
      dispatch(setDdreamTokenPayIsOpen(false))
      dispatch(setPowerExchangePayIsOpen(false))

      if (userInfoStatus === ReqStatus.Idel || userInfoStatus === ReqStatus.Pending) {
        return
      }

      if (userInfo.uid < 0 || userInfoStatus === ReqStatus.Failed) {
        setLoginIsOpen(true)
      } else {
        ;(async function () {
          await dispatch(refreshCharacterList())
          await dispatch(refreshDefaultBg())
        })()
      }
    },
    [userInfo, userInfoStatus]
  )

  useEffect(function () {
    ;(async function () {
      await dispatch(refreshUserInfo())
    })()
  }, [])

  return (
    <LoginModalOpenStateContext.Provider value={loginIsOpen}>
      <SetLoginModalOpenStateContext.Provider value={setLoginIsOpen}>
        {children}
        <LoginModal
          isOpen={loginIsOpen}
          locale={i18n.language as 'en' | 'zh-CN'}
          onLogin={() => {
            onLogin()
          }}
          onClose={() => {
            setLoginIsOpen(false)
          }}
        />
      </SetLoginModalOpenStateContext.Provider>
    </LoginModalOpenStateContext.Provider>
  )
}

// import {
//   MutableRefObject,
//   ReactNode,
//   createContext,
//   useContext,
//   useEffect,
//   useRef,
//   useState,
// } from 'react'
// import { Auth, LoginModal } from '@ddreamland/common'
// import { useTranslation } from 'react-i18next'
// import { useAppDispatch } from '@/hooks/useAppDispatch'
// import { refreshUserInfo } from '@/store/slices/userInfoSlice'
// import { useAppSelector } from '@/hooks/useAppSelector'
// import { ReqStatus } from '@/core/ReqStatus'
// import {
//   clearCharacterList,
//   refreshCharacterList,
//   setCurrentAdminCharacterId,
//   setCurrentChatCharacterId,
// } from '@/store/slices/characterSlice'
// import { refreshDefaultBg, setDefaultBg } from '@/store/slices/defaultBackground'

// export function ChatCharacterManagerContextProvider({ children }: { children: ReactNode }) {
//   const currentChatCharacterId = useAppSelector((state) => state.character.currentChatCharacterId)

//   useEffect(
//     function () {
//       dispatch(setCurrentAdminCharacterId(undefined))
//       dispatch(setCurrentChatCharacterId(undefined))
//       dispatch(clearCharacterList())
//       dispatch(setDefaultBg(undefined))

//       if (userInfoStatus === ReqStatus.Idel || userInfoStatus === ReqStatus.Pending) {
//         return
//       }

//       if (userInfo.uid < 0 || userInfoStatus === ReqStatus.Failed) {
//         setLoginIsOpen(true)
//       } else {
//         ;(async function () {
//           await dispatch(refreshCharacterList())
//           await dispatch(refreshDefaultBg())
//         })()
//       }
//     },
//     [currentChatCharacterId]
//   )

//   return <>{children}</>
// }

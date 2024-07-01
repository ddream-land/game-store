'use client'
import Main from './Main'
import { RoleAIContextProvider } from './context/RoleAIContextProvider'

import Notifications from './notifications/Notifications'
import Live2dLayer from './live2dLayer/Live2dLayer'
import ChatLayer from './chatLayer/ChatLayer'
import AdminLayer from './adminLayer/AdminLayer'
import { useEffect } from 'react'
import { reqDefaultBg } from '@/store/slices/defaultBackground'
import { useAppDispatch } from '@/hooks/useAppDispatch'

export default function RoleAI() {
  const dispatch = useAppDispatch()

  useEffect(function () {
    dispatch(reqDefaultBg())
  }, [])

  return (
    <>
      <RoleAIContextProvider>
        <Main>
          <Live2dLayer></Live2dLayer>
          <ChatLayer></ChatLayer>
          <AdminLayer></AdminLayer>
          <Notifications></Notifications>
        </Main>
      </RoleAIContextProvider>
    </>
  )
}

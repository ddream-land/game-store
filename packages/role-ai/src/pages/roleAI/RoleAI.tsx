'use client'
import Main from './Main'
import { RoleAIContextProvider } from './context/RoleAIContextProvider'

import Notifications from './notifications/Notifications'
import Live2dLayer from './live2dLayer/Live2dLayer'
import ChatLayer from './chatLayer/ChatLayer'
import AdminLayer from './adminLayer/AdminLayer'

export default function RoleAI() {
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

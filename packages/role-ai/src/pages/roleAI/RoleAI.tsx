import Main from './Main'
import { RoleAIContextProvider } from './context/RoleAIContextProvider'
import Live2dExtension from '@/pages/roleAI/live2dExtension/Live2dExtension'
import RoleAILayout from './layout/RoleAILayout'
import ChatPanel from './chatPanel/ChatPanel'
import CharactersPanel from './charactersPanel/CharactersPanel'
import { useEffect, useState } from 'react'
import { DEFAULT_OPEN_LIVE2D } from '@/constant/env'
import Notifications from './notifications/Notifications'
import OSS from 'ali-oss'

export default function RoleAI() {
  const [live2dExtensionEnable, setLive2dExtensionEnable] = useState(DEFAULT_OPEN_LIVE2D)

  return (
    <>
      <RoleAIContextProvider>
        <Main>
          {live2dExtensionEnable && <Live2dExtension></Live2dExtension>}
          <RoleAILayout
            charactersArea={<CharactersPanel></CharactersPanel>}
            chatArea={<ChatPanel></ChatPanel>}
          ></RoleAILayout>

          <Notifications></Notifications>
        </Main>
      </RoleAIContextProvider>
    </>
  )
}

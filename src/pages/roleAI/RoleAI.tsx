import classes from './RoleAI.module.scss'
import { RoleAIContextProvider } from './context/RoleAIContextProvider'
import Live2dExtension from '@/components/live2dExtension/Live2dExtension'
import RoleAILayout from './layout/RoleAILayout'
import ChatPanel from './chatPanel/ChatPanel'
import CharactersPanel from './charactersPanel/CharactersPanel'
import { useState } from 'react'
import { DEFAULT_OPEN_LIVE2D } from '@/constant/env'

export default function RoleAI() {
  const [live2dExtensionEnable, setLive2dExtensionEnable] = useState(DEFAULT_OPEN_LIVE2D)

  return (
    <>
      <div className={`${classes.roleAI} w-full h-full flex flex-row box-border`}>
        <RoleAIContextProvider>
          <>
            {live2dExtensionEnable && <Live2dExtension></Live2dExtension>}
            <RoleAILayout
              charactersArea={<CharactersPanel></CharactersPanel>}
              chatArea={<ChatPanel></ChatPanel>}
            ></RoleAILayout>
          </>
        </RoleAIContextProvider>
      </div>
    </>
  )
}

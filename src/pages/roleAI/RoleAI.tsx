import classes from './RoleAI.module.scss'
import { RoleAIContextProvider } from './context/RoleAIContextProvider'
import Live2dExtension from '@/components/live2dExtension/Live2dExtension'
import RoleAILayout from './layout/RoleAILayout'
import ChatPanel from './chatPanel/ChatPanel'
import CharactersPanel from './charactersPanel/CharactersPanel'

export default function RoleAI() {
  return (
    <>
      <div
        className={`${classes.roleAI} w-full h-full flex flex-row box-border`}
      >
        <RoleAIContextProvider>
          <>
            {/* <Live2dExtension></Live2dExtension> */}
            <RoleAILayout
              charactersArea={
                <CharactersPanel></CharactersPanel>
              }
              chatArea={<ChatPanel></ChatPanel>}
            ></RoleAILayout>
          </>
        </RoleAIContextProvider>
      </div>
    </>
  )
}

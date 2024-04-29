import classes from './RoleAI.module.scss'
import { RoleAIContextProvider } from './context/RoleAIContextProvider'
import Live2dExt from '@/components/live2dExtension/Live2dExtension'
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
            {/* <Live2dExt></Live2dExt> */}
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

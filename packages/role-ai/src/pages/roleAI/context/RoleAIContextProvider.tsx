import { ReactNode } from 'react'
import { CharacterInfoListContextProvider } from './CharacterInfoListContextProvider'
import { CurrentChatCharacterIdContextProvider } from './CurrentChatCharacterIdContextProvider'
import { CurrentChatCharacterInfoContextProvider } from './CurrentChatCharacterInfoContextProvider'
import { ChatHistoryContextProvider } from './ChatHistoryContextProvider'
import { TTSContextProvider } from './TTSContextProvider'
import { Live2dExtensionContextProvider } from './Live2dExtensionContextProvider'

export function RoleAIContextProvider({ children }: { children: ReactNode }) {
  return (
    <Live2dExtensionContextProvider>
      <CharacterInfoListContextProvider>
        <CurrentChatCharacterIdContextProvider>
          <CurrentChatCharacterInfoContextProvider>
            <ChatHistoryContextProvider>
              <TTSContextProvider>{children}</TTSContextProvider>
            </ChatHistoryContextProvider>
          </CurrentChatCharacterInfoContextProvider>
        </CurrentChatCharacterIdContextProvider>
      </CharacterInfoListContextProvider>
    </Live2dExtensionContextProvider>
  )
}

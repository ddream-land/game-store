import { ReactNode } from 'react'
import { CharacterCardInfoListContextProvider } from './CharacterCardInfoListContextProvider'
import { CurrentCharacterCardInfoIdContextProvider } from './CurrentCharacterCardInfoIdContextProvider'
import { CurrentCharacterCardInfoContextProvider } from './CurrentCharacterCardInfoContextProvider'
import { ChatHistoryContextProvider } from './ChatHistoryContextProvider'
import { TTSContextProvider } from './TTSContextProvider'
import { Live2dExtensionContextProvider } from './Live2dExtensionContextProvider'

export function RoleAIContextProvider({ children }: { children: ReactNode }) {
  return (
    <Live2dExtensionContextProvider>
      <CharacterCardInfoListContextProvider>
        <CurrentCharacterCardInfoIdContextProvider>
          <CurrentCharacterCardInfoContextProvider>
            <ChatHistoryContextProvider>
              <TTSContextProvider>{children}</TTSContextProvider>
            </ChatHistoryContextProvider>
          </CurrentCharacterCardInfoContextProvider>
        </CurrentCharacterCardInfoIdContextProvider>
      </CharacterCardInfoListContextProvider>
    </Live2dExtensionContextProvider>
  )
}

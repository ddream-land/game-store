import { CharacterCardInfoListContextProvider } from './CharacterCardInfoListContextProvider'
import { CurrentCharacterCardInfoIdContextProvider } from './CurrentCharacterCardInfoIdContextProvider'
import { CurrentCharacterCardInfoContextProvider } from './CurrentCharacterCardInfoContextProvider'
import { ChatHistoryContextProvider } from './ChatHistoryContextProvider'
import { TTSContextProvider } from './TTSContextProvider'
import { ReactNode } from 'react'

export function RoleAIContextProvider({ children }: { children: ReactNode }) {
  return (
    <CharacterCardInfoListContextProvider>
      <CurrentCharacterCardInfoIdContextProvider>
        <CurrentCharacterCardInfoContextProvider>
          <ChatHistoryContextProvider>
            <TTSContextProvider>{children}</TTSContextProvider>
          </ChatHistoryContextProvider>
        </CurrentCharacterCardInfoContextProvider>
      </CurrentCharacterCardInfoIdContextProvider>
    </CharacterCardInfoListContextProvider>
  )
}

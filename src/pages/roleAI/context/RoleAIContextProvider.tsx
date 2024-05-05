import { CharacterCardInfoListContextProvider } from './CharacterCardInfoListContextProvider'
import { CurrentCharacterCardInfoIdContextProvider } from './CurrentCharacterCardInfoIdContextProvider'
import { CurrentCharacterCardInfoContextProvider } from './CurrentCharacterCardInfoContextProvider'
import { ChatHistoryContextProvider } from './ChatHistoryContextProvider'
import { TTSContextProvider } from './TTSContextProvider'

export function RoleAIContextProvider({ children }: { children: JSX.Element }) {
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

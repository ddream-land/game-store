import { CharacterCardInfoListContextProvider } from './CharacterCardInfoListContextProvider'
import { CurrentCharacterCardInfoIdContextProvider } from './CurrentCharacterCardInfoIdContextProvider'
import { CurrentCharacterCardInfoContextProvider } from './CurrentCharacterCardInfoContextProvider'
import { ChatHistoryContextProvider } from './ChatHistoryContextProvider'
import { TTSContextProvider } from './TTSContextProvider'

export function RoleAIContextProvider({ children }: { children: JSX.Element }) {
  return (
    <CharacterCardInfoListContextProvider>
      <TTSContextProvider>
        <CurrentCharacterCardInfoIdContextProvider>
          <CurrentCharacterCardInfoContextProvider>
            <ChatHistoryContextProvider>{children}</ChatHistoryContextProvider>
          </CurrentCharacterCardInfoContextProvider>
        </CurrentCharacterCardInfoIdContextProvider>
      </TTSContextProvider>
    </CharacterCardInfoListContextProvider>
  )
}

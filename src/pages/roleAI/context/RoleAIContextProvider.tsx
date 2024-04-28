import { CharacterCardInfoListContextProvider } from './CharacterCardInfoListContextProvider'
import { CurrentCharacterCardInfoIdContextProvider } from './CurrentCharacterCardInfoIdContextProvider'
import { CurrentCharacterCardInfoContextProvider } from './CurrentCharacterCardInfoContextProvider'
import { ChatHistoryContextProvider } from './ChatHistoryContextProvider'

export function RoleAIContextProvider({
  children,
}: {
  children: JSX.Element
}) {
  return (
    <CharacterCardInfoListContextProvider>
      <CurrentCharacterCardInfoIdContextProvider>
        <CurrentCharacterCardInfoContextProvider>
          <ChatHistoryContextProvider>
            {children}
          </ChatHistoryContextProvider>
        </CurrentCharacterCardInfoContextProvider>
      </CurrentCharacterCardInfoIdContextProvider>
    </CharacterCardInfoListContextProvider>
  )
}

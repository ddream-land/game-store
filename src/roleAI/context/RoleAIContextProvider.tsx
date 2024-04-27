import { CharacterCardInfoListContextProvider } from './CharacterCardInfoListContextProvider'
import { CurrentDigitalLifeIdContextProvider } from './CurrentDigitalLifeIdContextProvider'
import { ChatHistoryContextProvider } from './ChatHistoryContextProvider'

export function RoleAIContextProvider({
  children,
}: {
  children: JSX.Element
}) {
  return (
    <CharacterCardInfoListContextProvider>
      <CurrentDigitalLifeIdContextProvider>
        <ChatHistoryContextProvider>
          {children}
        </ChatHistoryContextProvider>
      </CurrentDigitalLifeIdContextProvider>
    </CharacterCardInfoListContextProvider>
  )
}

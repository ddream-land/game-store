import { DigitalLifeDetailListContextProvider } from './DigitalLifeDetailListContext'
import { CurrentDigitalLifeIdContextProvider } from './CurrentDigitalLifeIdContextProvider'
import { ChatMessagesContextProvider } from './ChatMessagesContextProvider'

export function CharacterContextProvider({ children }: { children: JSX.Element }) {
  return (
    <DigitalLifeDetailListContextProvider>
      <CurrentDigitalLifeIdContextProvider>
        <ChatMessagesContextProvider>{children}</ChatMessagesContextProvider>
      </CurrentDigitalLifeIdContextProvider>
    </DigitalLifeDetailListContextProvider>
  )
}

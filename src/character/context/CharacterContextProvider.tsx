import { DigitalLifeDetailListContextProvider } from './DigitalLifeDetailListContextProvider'
import { CurrentDigitalLifeIdContextProvider } from './CurrentDigitalLifeIdContextProvider'
import { ChatMessagesContextProvider } from './ChatMessagesContextProvider'
import { CardInfoLocalStorageContextProvider } from './CardInfoLocalStorageContextProvider'

export function CharacterContextProvider({
  children,
}: {
  children: JSX.Element
}) {
  return (
    <CardInfoLocalStorageContextProvider>
      <DigitalLifeDetailListContextProvider>
        <CurrentDigitalLifeIdContextProvider>
          <ChatMessagesContextProvider>
            {children}
          </ChatMessagesContextProvider>
        </CurrentDigitalLifeIdContextProvider>
      </DigitalLifeDetailListContextProvider>
    </CardInfoLocalStorageContextProvider>
  )
}

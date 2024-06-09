import { ReactNode, createContext, useContext, useState } from 'react'

const CurrentChatCharacterIdContext = createContext<string | undefined>(undefined)

const SetCurrentChatCharacterIdContext = createContext<
  React.Dispatch<React.SetStateAction<string | undefined>>
>(function () {})

export function CurrentChatCharacterIdContextProvider({ children }: { children: ReactNode }) {
  const [currentChatCharacterId, setCurrentChatCharacterId] = useState<string | undefined>(
    undefined
  )

  return (
    <CurrentChatCharacterIdContext.Provider value={currentChatCharacterId}>
      <SetCurrentChatCharacterIdContext.Provider value={setCurrentChatCharacterId}>
        {children}
      </SetCurrentChatCharacterIdContext.Provider>
    </CurrentChatCharacterIdContext.Provider>
  )
}

export function useCurrentChatCharacterId() {
  return useContext(CurrentChatCharacterIdContext)
}

export function useSetCurrentChatCharacterId() {
  return useContext(SetCurrentChatCharacterIdContext)
}

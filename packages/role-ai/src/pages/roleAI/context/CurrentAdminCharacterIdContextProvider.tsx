import { ReactNode, createContext, useContext, useState } from 'react'

const CurrentAdminCharacterIdContext = createContext<string | undefined>(undefined)

const SetCurrentAdminCharacterIdContext = createContext<
  React.Dispatch<React.SetStateAction<string | undefined>>
>(function () {})

export function CurrentAdminCharacterIdContextProvider({ children }: { children: ReactNode }) {
  const [currentAdminCharacterId, setCurrentAdminCharacterId] = useState<string | undefined>(
    undefined
  )

  return (
    <CurrentAdminCharacterIdContext.Provider value={currentAdminCharacterId}>
      <SetCurrentAdminCharacterIdContext.Provider value={setCurrentAdminCharacterId}>
        {children}
      </SetCurrentAdminCharacterIdContext.Provider>
    </CurrentAdminCharacterIdContext.Provider>
  )
}

export function useCurrentAdminCharacterId() {
  return useContext(CurrentAdminCharacterIdContext)
}

export function useSetCurrentAdminCharacterId() {
  return useContext(SetCurrentAdminCharacterIdContext)
}

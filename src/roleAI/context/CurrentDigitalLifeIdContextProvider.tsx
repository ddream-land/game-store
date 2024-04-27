import { createContext, useContext, useEffect, useState } from 'react'

const CurrentDigitalLifeIdContext = createContext<number | undefined>(undefined)
const SetCurrentDigitalLifeIdContext = createContext<
  React.Dispatch<React.SetStateAction<number | undefined>>
>(function () {})

export function CurrentDigitalLifeIdContextProvider({ children }: { children: JSX.Element }) {
  const [currentDigitalLifeId, setCurrentDigitalLifeId] = useState<number | undefined>(undefined)

  return (
    <CurrentDigitalLifeIdContext.Provider value={currentDigitalLifeId}>
      <SetCurrentDigitalLifeIdContext.Provider value={setCurrentDigitalLifeId}>
        {children}
      </SetCurrentDigitalLifeIdContext.Provider>
    </CurrentDigitalLifeIdContext.Provider>
  )
}

export function useCurrentDigitalLifeId() {
  return useContext(CurrentDigitalLifeIdContext)
}

export function useSetCurrentDigitalLifeId() {
  return useContext(SetCurrentDigitalLifeIdContext)
}

import { createContext, useContext, useState } from 'react'

const CurrentCharacterCardInfoIdContext = createContext<
  string | undefined
>(undefined)

const SetCurrentCharacterCardInfoIdContext = createContext<
  React.Dispatch<React.SetStateAction<string | undefined>>
>(function () {})

export function CurrentCharacterCardInfoIdContextProvider({
  children,
}: {
  children: JSX.Element
}) {
  const [
    currentCharacterCardInfoId,
    setCurrentCharacterCardInfoId,
  ] = useState<string | undefined>(undefined)

  return (
    <CurrentCharacterCardInfoIdContext.Provider
      value={currentCharacterCardInfoId}
    >
      <SetCurrentCharacterCardInfoIdContext.Provider
        value={setCurrentCharacterCardInfoId}
      >
        {children}
      </SetCurrentCharacterCardInfoIdContext.Provider>
    </CurrentCharacterCardInfoIdContext.Provider>
  )
}

export function useCurrentCharacterCardInfoId() {
  return useContext(CurrentCharacterCardInfoIdContext)
}

export function useSetCurrentCharacterCardInfoId() {
  return useContext(SetCurrentCharacterCardInfoIdContext)
}

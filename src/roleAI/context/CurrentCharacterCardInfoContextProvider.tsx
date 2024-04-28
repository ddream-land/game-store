import { CharacterCardInfo } from '@/core/CharacterCardInfo'
import { createContext, useContext } from 'react'
import { useCharacterCardInfoList } from './CharacterCardInfoListContextProvider'
import { useCurrentCharacterCardInfoId } from './CurrentCharacterCardInfoIdContextProvider'

const CurrentCharacterCardInfoContext = createContext<
  CharacterCardInfo | undefined
>(undefined)

export function CurrentCharacterCardInfoContextProvider({
  children,
}: {
  children: JSX.Element
}) {
  const characterCardInfoList = useCharacterCardInfoList()
  const currentCharacterCardInfoId =
    useCurrentCharacterCardInfoId()

  const currentCharacterCardInfo:
    | CharacterCardInfo
    | undefined = characterCardInfoList.find(
    (item) => item.id === currentCharacterCardInfoId
  )

  return (
    <CurrentCharacterCardInfoContext.Provider
      value={currentCharacterCardInfo}
    >
      {children}
    </CurrentCharacterCardInfoContext.Provider>
  )
}

export function useCurrentCharacterCardInfo() {
  return useContext(CurrentCharacterCardInfoContext)
}

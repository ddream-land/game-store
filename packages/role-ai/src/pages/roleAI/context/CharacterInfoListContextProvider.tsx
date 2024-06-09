import { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { CharacterCardInfo } from '@/core/CharacterCardInfo'
import { useLocalStorage } from '@/libs/useLocalStorage'
import { getAllCards } from '@/api/characterCard/characterCard'

export const LOCAL_STORAGE_CARD_KEY = 'files'

const CharacterInfoListContext = createContext<CharacterCardInfo[]>([])
const SetCharacterInfoListContext = createContext<
  React.Dispatch<React.SetStateAction<CharacterCardInfo[]>>
>(function () {})

export function CharacterInfoListContextProvider({ children }: { children: ReactNode }) {
  const [characterInfoList, setCharacterInfoList] = useState<CharacterCardInfo[]>([])

  // const [characterCardInfoList, setCharacterCardInfoList] = useLocalStorage<CharacterCardInfo[]>(
  //   LOCAL_STORAGE_CARD_KEY,
  //   []
  // )

  useEffect(function () {
    ;(async function () {
      const cards = await getAllCards()
      setCharacterInfoList(cards)
    })()
  }, [])

  return (
    <CharacterInfoListContext.Provider value={characterInfoList}>
      <SetCharacterInfoListContext.Provider value={setCharacterInfoList}>
        {children}
      </SetCharacterInfoListContext.Provider>
    </CharacterInfoListContext.Provider>
  )
}

export function useCharacterInfoList() {
  return useContext(CharacterInfoListContext)
}

export function useSetCharacterInfoList() {
  const setCharacterInfoList = useContext(SetCharacterInfoListContext)

  async function refreshCharacterInfoList() {
    const cards = await getAllCards()
    setCharacterInfoList(cards)
  }

  return {
    setCharacterInfoList,
    refreshCharacterInfoList,
  }
}

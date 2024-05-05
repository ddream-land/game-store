import { createContext, useContext, useEffect, useState } from 'react'
import { CharacterCardInfo } from '@/core/CharacterCardInfo'
import { useLocalStorage } from '@/libs/useLocalStorage'
import { getAllCards } from '@/api/characterCard/characterCard'
import { GetAllCardsRes } from '@/api/characterCard/resDto'

export const LOCAL_STORAGE_CARD_KEY = 'files'

const CharacterCardInfoListContext = createContext<CharacterCardInfo[]>([])
const SetCharacterCardInfoListContext = createContext<
  React.Dispatch<React.SetStateAction<CharacterCardInfo[]>>
>(function () {})

export function CharacterCardInfoListContextProvider({ children }: { children: JSX.Element }) {
  const [characterCardInfoList, setCharacterCardInfoList] = useState<CharacterCardInfo[]>([])

  // const [characterCardInfoList, setCharacterCardInfoList] = useLocalStorage<CharacterCardInfo[]>(
  //   LOCAL_STORAGE_CARD_KEY,
  //   []
  // )

  useEffect(function () {
    ;(async function () {
      const cards = await getAllCards()
      setCharacterCardInfoList(cards)
    })()
  }, [])

  return (
    <CharacterCardInfoListContext.Provider value={characterCardInfoList}>
      <SetCharacterCardInfoListContext.Provider value={setCharacterCardInfoList}>
        {children}
      </SetCharacterCardInfoListContext.Provider>
    </CharacterCardInfoListContext.Provider>
  )
}

export function useCharacterCardInfoList() {
  return useContext(CharacterCardInfoListContext)
}

export function useSetCharacterCardInfoList() {
  const setCharacterCardInfoList = useContext(SetCharacterCardInfoListContext)

  async function refreshCharacterCardInfoList() {
    const cards = await getAllCards()
    setCharacterCardInfoList(cards)
  }

  return {
    setCharacterCardInfoList,
    refreshCharacterCardInfoList,
  }
}

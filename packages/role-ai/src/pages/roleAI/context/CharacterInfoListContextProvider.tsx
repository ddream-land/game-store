import { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { CharacterCardInfo } from '@/core/CharacterCardInfo'
import { useLocalStorage } from '@/libs/useLocalStorage'
import { getAllCards } from '@/api/characterCard/characterCard'
import { useUserInfoContext } from './UserInfoContextProvider'

export const LOCAL_STORAGE_CARD_KEY = 'files'

const CharacterInfoListContext = createContext<CharacterCardInfo[]>([])
const SetCharacterInfoListContext = createContext<
  React.Dispatch<React.SetStateAction<CharacterCardInfo[]>>
>(function () {})

export function CharacterInfoListContextProvider({ children }: { children: ReactNode }) {
  const [characterInfoList, setCharacterInfoList] = useState<CharacterCardInfo[]>([])
  const userInfo = useUserInfoContext()

  // const [characterCardInfoList, setCharacterCardInfoList] = useLocalStorage<CharacterCardInfo[]>(
  //   LOCAL_STORAGE_CARD_KEY,
  //   []
  // )

  async function refreshCharacterInfoList() {
    setCharacterInfoList([])
    const cards = await getAllCards()
    setCharacterInfoList(cards)
  }

  useEffect(
    function () {
      refreshCharacterInfoList()
    },
    [userInfo]
  )

  useEffect(function () {
    ;(async function () {
      await refreshCharacterInfoList()
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

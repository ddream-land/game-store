import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import { CharacterCardInfo } from '@/core/CharacterCardInfo'
import { useLocalStorage } from '@/libs/useLocalStorage'

export const LOCAL_STORAGE_CARD_KEY = 'files'

const CharacterCardInfoListContext = createContext<
  CharacterCardInfo[]
>([])
const SetCharacterCardInfoListContext = createContext<
  React.Dispatch<React.SetStateAction<CharacterCardInfo[]>>
>(function () {})

export function CharacterCardInfoListContextProvider({
  children,
}: {
  children: JSX.Element
}) {
  // const [characterCardInfoList, setCharacterCardInfoList] =
  //   useState<CharacterCardInfo[]>([])

  const [characterCardInfoList, setCharacterCardInfoList] =
    useLocalStorage<CharacterCardInfo[]>(
      LOCAL_STORAGE_CARD_KEY,
      []
    )

  // const cardInfos = useCardInfos()

  // function localStorageCardsToList() {
  //   const list: CharacterCardInfo[] = []
  //   for (let i = 0; i < cardInfos.length; i++) {
  //     const cardInfo = cardInfos[i]
  //     const item: CharacterCardInfo = {
  //       ...cardInfo,
  //     }

  //     list.push(item)
  //   }

  //   setCharacterCardInfoList(list)
  // }

  // useEffect(
  //   function () {
  //     localStorageCardsToList()
  //   },
  //   [cardInfos]
  // )

  return (
    <CharacterCardInfoListContext.Provider
      value={characterCardInfoList}
    >
      <SetCharacterCardInfoListContext.Provider
        value={setCharacterCardInfoList}
      >
        {children}
      </SetCharacterCardInfoListContext.Provider>
    </CharacterCardInfoListContext.Provider>
  )
}

export function useCharacterCardInfoList() {
  return useContext(CharacterCardInfoListContext)
}

export function useSetCharacterCardInfoList() {
  return useContext(SetCharacterCardInfoListContext)
}

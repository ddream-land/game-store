import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useCardInfos } from './CardInfoLocalStorageContextProvider'
import { CharacterCardV2 } from '@/libs/characterCard'

export const LOCAL_STORAGE_CARD_KEY = 'files'

export type CharacterCardDetail = {
  id: number
  card: CharacterCardV2
  pngUrlOrBase64: string
}

const DigitalLifeDetailListContext = createContext<
CharacterCardDetail[]
>([])
const SetDigitalLifeDetailListContext = createContext<
  React.Dispatch<React.SetStateAction<CharacterCardDetail[]>>
>(function () {})

export function DigitalLifeDetailListContextProvider({
  children,
}: {
  children: JSX.Element
}) {
  const [digitalLifeDetailList, setDigitalLifeDetailList] =
    useState<CharacterCardDetail[]>([])

  const cardInfos = useCardInfos()

  function localStorageCardsToList() {
    const list: CharacterCardDetail[] = []
    for (let i = 0; i < cardInfos.length; i++) {
      const cardInfo = cardInfos[i]
      const item: CharacterCardDetail  = {
        ...cardInfo
      }

      list.push(item)
    }

    setDigitalLifeDetailList(list)
  }

  useEffect(
    function () {
      localStorageCardsToList()
    },
    [cardInfos]
  )

  return (
    <DigitalLifeDetailListContext.Provider
      value={digitalLifeDetailList}
    >
      <SetDigitalLifeDetailListContext.Provider
        value={setDigitalLifeDetailList}
      >
        {children}
      </SetDigitalLifeDetailListContext.Provider>
    </DigitalLifeDetailListContext.Provider>
  )
}

export function useDigitalLifeDetailList() {
  return useContext(DigitalLifeDetailListContext)
}

export function useSetDigitalLifeDetailList() {
  return useContext(SetDigitalLifeDetailListContext)
}

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import {
  CharacterCardDetail,
  LOCAL_STORAGE_CARD_KEY,
} from './DigitalLifeDetailListContextProvider'
import { useLocalStorage } from '@/libs/useLocalStorage'

const CardInfosContext = createContext<
CharacterCardDetail[]
>([])
const SetCardInfosContext = createContext<
  React.Dispatch<
    React.SetStateAction<CharacterCardDetail[]>
  >
>(function () {})

export function CardInfoLocalStorageContextProvider({
  children,
}: {
  children: JSX.Element
}) {
  const localStorageCards: CharacterCardDetail[] = []
  const [cards, setCards] = useLocalStorage(
    LOCAL_STORAGE_CARD_KEY,
    localStorageCards
  )

  return (
    <CardInfosContext.Provider value={cards}>
      <SetCardInfosContext.Provider value={setCards}>
        {children}
      </SetCardInfosContext.Provider>
    </CardInfosContext.Provider>
  )
}

export function useCardInfos() {
  return useContext(CardInfosContext)
}

export function useSetCardInfos() {
  return useContext(SetCardInfosContext)
}

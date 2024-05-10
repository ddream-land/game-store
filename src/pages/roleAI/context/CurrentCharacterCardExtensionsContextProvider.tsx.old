import { CharacterCardInfo } from '@/core/CharacterCardInfo'
import { createContext, useContext, useEffect, useMemo } from 'react'
import { useCharacterCardInfoList } from './CharacterCardInfoListContextProvider'
import { useCurrentCharacterCardInfoId } from './CurrentCharacterCardInfoIdContextProvider'
import { preMsgGenerator } from '@/core/promptMessageGenerator'
import { AIChatMessage } from '@/core/ChatMessage'

type CharacterCardExtensions = {
  live2d: {
    enable: boolean
  }
}

const CurrentCharacterCardInfoContext = createContext<CharacterCardInfo | undefined>(undefined)

export function CurrentCharacterCardExtensionsContextProvider({ children }: { children: JSX.Element }) {
  const characterCardInfoList = useCharacterCardInfoList()
  const currentCharacterCardInfoId = useCurrentCharacterCardInfoId()

  const currentCharacterCardInfo: CharacterCardInfo | undefined = characterCardInfoList.find(
    (item) => item.id === currentCharacterCardInfoId
  )

  return (
    <CurrentCharacterCardInfoContext.Provider value={currentCharacterCardInfo}>
      {children}
    </CurrentCharacterCardInfoContext.Provider>
  )
}

export function useCurrentCharacterCardInfo() {
  const charaCardInfo = useContext(CurrentCharacterCardInfoContext)

  const charaPreMsg: AIChatMessage[] | undefined = useMemo(
    function () {
      if (!charaCardInfo) {
        return
      }
      return preMsgGenerator(charaCardInfo.card)
    },
    [charaCardInfo]
  )

  return {
    charaCardInfo: charaCardInfo,
    charaPreMsg,
  }
}

import { CharacterCardInfo } from '@/core/CharacterCardInfo'
import { createContext, useContext, useEffect, useMemo } from 'react'
import {
  useCharacterCardInfoList,
  useSetCharacterCardInfoList,
} from './CharacterCardInfoListContextProvider'
import { useCurrentCharacterCardInfoId } from './CurrentCharacterCardInfoIdContextProvider'
import { preMsgGenerator } from '@/core/promptMessageGenerator'
import { AIChatMessage } from '@/core/ChatMessage'
import { editCard } from '@/api/characterCard/characterCard'
import { CharacterCardV2 } from '@/core/characterCard/characterCardV2'

const CurrentCharacterCardInfoContext = createContext<CharacterCardInfo | undefined>(undefined)

export function CurrentCharacterCardInfoContextProvider({ children }: { children: JSX.Element }) {
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
  const { setCharacterCardInfoList, refreshCharacterCardInfoList } = useSetCharacterCardInfoList()
  const charaCardInfo = useContext(CurrentCharacterCardInfoContext)

  // const charaPreMsg: AIChatMessage[] | undefined = useMemo(
  //   function () {
  //     if (!charaCardInfo) {
  //       return
  //     }
  //     return preMsgGenerator(charaCardInfo.card)
  //   },
  //   [charaCardInfo]
  // )

  async function uploadCurrentCharacterCardInfo(card: CharacterCardV2, avatar?: File) {
    const currentId = charaCardInfo?.id
    const currentAvatarUrl = charaCardInfo?.pngUrlOrBase64
    if (!currentId || !currentAvatarUrl) {
      return
    }

    const res = await editCard(currentId, currentAvatarUrl, card, avatar)
    if (res.code === 0) {
      await refreshCharacterCardInfoList()
    } else {
      throw new Error(res.msg ?? 'error')
    }
  }

  return {
    charaCardInfo: charaCardInfo,
    // charaPreMsg,
    uploadCurrentCharacterCardInfo,
  }
}

import { CharacterCardInfo } from '@/core/CharacterCardInfo'
import { createContext, useContext, useEffect, useMemo } from 'react'
import { useCharacterInfoList, useSetCharacterInfoList } from './CharacterInfoListContextProvider'
import { useCurrentChatCharacterId } from './CurrentChatCharacterIdContextProvider'
import { editCard } from '@/api/characterCard/characterCard'
import { CharacterCardV2 } from '@/core/characterCard/characterCardV2'

const CurrentChatCharacterInfoContext = createContext<CharacterCardInfo | undefined>(undefined)

export function CurrentChatCharacterInfoContextProvider({ children }: { children: JSX.Element }) {
  const characterInfoList = useCharacterInfoList()
  const currentChatCharacterId = useCurrentChatCharacterId()

  const currentCharacterInfo: CharacterCardInfo | undefined = characterInfoList.find(
    (item) => item.id === currentChatCharacterId
  )

  return (
    <CurrentChatCharacterInfoContext.Provider value={currentCharacterInfo}>
      {children}
    </CurrentChatCharacterInfoContext.Provider>
  )
}

export function useCurrentChatCharacterInfo() {
  const { refreshCharacterInfoList } = useSetCharacterInfoList()
  const charaCardInfo = useContext(CurrentChatCharacterInfoContext)

  async function uploadCurrentCharacterCardInfo(card: CharacterCardV2, avatar?: File) {
    const currentId = charaCardInfo?.id
    const currentAvatarUrl = charaCardInfo?.pngUrlOrBase64
    if (!currentId || !currentAvatarUrl) {
      return
    }

    const res = await editCard(currentId, currentAvatarUrl, card, avatar)
    if (res.code === 0) {
      await refreshCharacterInfoList()
    } else {
      throw new Error(res.msg ?? 'error')
    }
  }

  return {
    charaCardInfo: charaCardInfo,
    uploadCurrentCharacterCardInfo,
  }
}

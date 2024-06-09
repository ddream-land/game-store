import { CharacterCardInfo } from '@/core/CharacterCardInfo'
import { createContext, useContext, useEffect, useMemo } from 'react'
import { useCharacterInfoList, useSetCharacterInfoList } from './CharacterInfoListContextProvider'
import { editCard } from '@/api/characterCard/characterCard'
import { CharacterCardV2 } from '@/core/characterCard/characterCardV2'
import { useCurrentAdminCharacterId } from './CurrentAdminCharacterIdContextProvider'

const CurrentAdminCharacterInfoContext = createContext<CharacterCardInfo | undefined>(undefined)

export function CurrentAdminCharacterInfoContextProvider({ children }: { children: JSX.Element }) {
  const characterInfoList = useCharacterInfoList()
  const currentAdminCharacterId = useCurrentAdminCharacterId()

  const currentCharacterInfo: CharacterCardInfo | undefined = characterInfoList.find(
    (item) => item.id === currentAdminCharacterId
  )

  return (
    <CurrentAdminCharacterInfoContext.Provider value={currentCharacterInfo}>
      {children}
    </CurrentAdminCharacterInfoContext.Provider>
  )
}

export function useCurrentAdminCharacterInfo() {
  const { refreshCharacterInfoList } = useSetCharacterInfoList()
  const charaCardInfo = useContext(CurrentAdminCharacterInfoContext)

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

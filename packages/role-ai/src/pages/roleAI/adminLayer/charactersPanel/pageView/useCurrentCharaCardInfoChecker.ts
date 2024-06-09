import { useEffect } from 'react'
import { useCurrentChatCharacterInfo } from '../../../context/CurrentChatCharacterInfoContextProvider'
import { useNavigate } from 'react-router-dom'

export function useCurrentCharaCardInfoChecker() {
  const { charaCardInfo } = useCurrentChatCharacterInfo()
  const navigate = useNavigate()

  useEffect(function () {
    if (!charaCardInfo) {
      navigate(`/`)
    }
  }, [])

  return { charaCardInfo: charaCardInfo! }
}

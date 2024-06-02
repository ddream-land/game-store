import { useEffect } from 'react'
import { useCurrentCharacterCardInfo } from '../../../context/CurrentCharacterCardInfoContextProvider'
import { useNavigate } from 'react-router-dom'

export function useCurrentCharaCardInfoChecker() {
  const { charaCardInfo } = useCurrentCharacterCardInfo()
  const navigate = useNavigate()

  useEffect(function () {
    if (!charaCardInfo) {
      navigate(`/`)
    }
  }, [])

  return { charaCardInfo: charaCardInfo! }
}

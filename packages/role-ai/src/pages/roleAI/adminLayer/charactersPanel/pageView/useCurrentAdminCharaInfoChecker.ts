import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCurrentAdminCharacterInfo } from '@/pages/roleAI/context/CurrentAdminCharacterInfoContextProvider'

export function useCurrentAdminCharaInfoChecker() {
  const { adminCharaInfo } = useCurrentAdminCharacterInfo()
  const navigate = useNavigate()

  useEffect(function () {
    if (!adminCharaInfo) {
      navigate(`/`)
    }
  }, [])

  return { adminCharaInfo: adminCharaInfo! }
}

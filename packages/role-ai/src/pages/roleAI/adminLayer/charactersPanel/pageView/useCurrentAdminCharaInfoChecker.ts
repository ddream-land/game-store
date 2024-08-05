import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '@/hooks/useAppSelector'
import { currentAdminCharacterInfoSelector } from '@/store/slices/characterSlice'

export function useCurrentAdminCharaInfoChecker() {
  const navigate = useNavigate()
  const adminCharaInfo = useAppSelector(currentAdminCharacterInfoSelector)

  useEffect(function () {
    if (!adminCharaInfo) {
      navigate(`/`)
    }
  }, [])

  return { adminCharaInfo: adminCharaInfo }
}

import { deleteCard, exportCardPNG } from '@/api/characterCard/characterCard'
import { CharacterCardV2 } from '@/core/characterCard/characterCardV2'
import { isString } from '@/libs/isTypes'
import { saveBlob } from '@/libs/saveBlob'
import { useEffect, useState, MouseEvent } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useCurrentAdminCharaInfoChecker } from '../useCurrentAdminCharaInfoChecker'
import { cloneDeep } from 'lodash'
import { NuwaExtensionVersion } from '@/core/characterCard/NuwaCharacterCardExtensions'
import { refreshCharacterList, uploadCurrentAdminCharaInfo } from '@/store/slices/characterSlice'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { useGlobalEvent } from '@/hooks/useGlobalEvent'

export function useMenuDialog() {
  const { adminCharaInfo } = useCurrentAdminCharaInfoChecker()
  const [menuDialogOpened, setMenuDialogOpened] = useState(false)
  const [currentAdminCharaCardData, setCurrentAdminCharaCardData] = useState(
    cloneDeep(adminCharaInfo?.card.data ?? {})
  )
  const navigate = useNavigate()
  const { t: tCommon } = useTranslation('common')
  const [renameModalOpened, setRenameModalOpened] = useState(false)
  const [callMeByModalOpened, setCallMeByModalOpened] = useState(false)
  const dispatch = useAppDispatch()
  useGlobalEvent('click', globalCloseMenuDialog)

  async function uploadCurrAdminCharaInfo(card: CharacterCardV2, avatar?: File) {
    await dispatch(uploadCurrentAdminCharaInfo({ card, avatar }))
  }

  function openMenuDialog(e: MouseEvent<HTMLDivElement>) {
    e.stopPropagation()
    setMenuDialogOpened(true)
  }

  function globalCloseMenuDialog() {
    setMenuDialogOpened(false)
  }

  async function renameClicked() {
    setMenuDialogOpened(false)
    setRenameModalOpened(true)
  }

  function onRenameModalOpenChange(isOpen: boolean) {
    setRenameModalOpened(isOpen)
  }

  function onCallMeByModalOpenChange(isOpen: boolean) {
    setCallMeByModalOpened(isOpen)
  }

  async function onRenameSave(newName: string) {
    if (!adminCharaInfo) {
      return
    }
    setRenameModalOpened(false)

    const id = toast.loading(tCommon('loading'))

    const newCard: CharacterCardV2 = {
      spec: adminCharaInfo.card.spec,
      spec_version: adminCharaInfo.card.spec_version,
      data: {
        ...adminCharaInfo.card.data,
        ...{ currentAdminCharaCardData, name: newName },
      },
    }
    try {
      await uploadCurrAdminCharaInfo(newCard)
      toast.success(tCommon('opSuccess'), {
        id: id,
      })
    } catch (err: any) {
      const msg = err?.message
      toast.error(isString(msg) ? msg : tCommon('opFailed'), {
        id: id,
      })
    }
  }

  async function onCallMeBySave(newName: string) {
    if (!adminCharaInfo) {
      return
    }
    setCallMeByModalOpened(false)

    const id = toast.loading(tCommon('loading'))

    const newCard: CharacterCardV2 = {
      spec: adminCharaInfo.card.spec,
      spec_version: adminCharaInfo.card.spec_version,
      data: {
        ...adminCharaInfo.card.data,
        extensions: {
          ...adminCharaInfo.card.data.extensions,
          nuwa_call_me_by: {
            version: NuwaExtensionVersion.V1,
            name: newName,
          },
        },
      },
    }
    try {
      await uploadCurrAdminCharaInfo(newCard)
      toast.success(tCommon('opSuccess'), {
        id: id,
      })
    } catch (err: any) {
      const msg = err?.message
      toast.error(isString(msg) ? msg : tCommon('opFailed'), {
        id: id,
      })
    }
  }

  async function callMeByClicked() {
    setCallMeByModalOpened(true)
  }

  async function linkToWorldBookClicked() {
    setMenuDialogOpened(false)
  }

  async function exportClicked() {
    if (!adminCharaInfo) {
      return
    }
    setMenuDialogOpened(false)

    const id = toast.loading(tCommon('loading'))
    try {
      const res = await exportCardPNG(adminCharaInfo.id)

      toast.dismiss(id)

      saveBlob(res.data, `${adminCharaInfo.card.data.name}.png`)
    } catch (err: any) {
      const msg = err?.message
      toast.error(isString(msg) ? msg : tCommon('opFailed'), {
        id: id,
      })
    }
  }

  async function deleteClicked() {
    if (!adminCharaInfo) {
      return
    }
    setMenuDialogOpened(false)

    const id = toast.loading(tCommon('deleting'))

    const res = await deleteCard(adminCharaInfo.id)
    if (res.code === 0) {
      toast.success(tCommon('deleted'), {
        id: id,
      })
      navigate('/')
      await dispatch(refreshCharacterList())
    } else {
      toast(tCommon('opFailed'), {
        id: id,
      })
    }
  }

  return {
    menuDialogOpened,
    renameModalOpened,
    callMeByModalOpened,
    onRenameModalOpenChange,
    onCallMeByModalOpenChange,
    onRenameSave,
    onCallMeBySave,
    openMenuDialog,
    renameClicked,
    callMeByClicked,
    linkToWorldBookClicked,
    exportClicked,
    deleteClicked,
  }
}

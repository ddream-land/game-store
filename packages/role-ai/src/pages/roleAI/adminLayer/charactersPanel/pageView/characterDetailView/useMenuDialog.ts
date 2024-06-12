import { deleteCard, exportCardPNG } from '@/api/characterCard/characterCard'
import { CharacterCardV2 } from '@/core/characterCard/characterCardV2'
import { isString } from '@/libs/isTypes'
import { saveBlob } from '@/libs/saveBlob'
import { useSetCharacterInfoList } from '@/pages/roleAI/context/CharacterInfoListContextProvider'
import { useEffect, useState, MouseEvent } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useCurrentAdminCharaInfoChecker } from '../useCurrentAdminCharaInfoChecker'
import { cloneDeep } from 'lodash'
import { useCurrentAdminCharacterInfo } from '@/pages/roleAI/context/CurrentAdminCharacterInfoContextProvider'

export function useMenuDialog() {
  const [menuDialogOpened, setMenuDialogOpened] = useState(false)
  const { adminCharaInfo } = useCurrentAdminCharaInfoChecker()
  const { uploadCurrentAdminCharaInfo } = useCurrentAdminCharacterInfo()
  const [currentAdminCharaCardData, setCurrentAdminCharaCardData] = useState(
    cloneDeep(adminCharaInfo.card.data)
  )
  const { refreshCharacterInfoList } = useSetCharacterInfoList()
  const navigate = useNavigate()
  const { t: tCommon } = useTranslation('common')
  const [renameModalOpened, setRenameModalOpened] = useState(false)
  const [callMeByModalOpened, setCallMeByModalOpened] = useState(false)

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

  async function onRenameSave(newName: string) {
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
      await uploadCurrentAdminCharaInfo(newCard)
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
    setMenuDialogOpened(false)
  }

  async function linkToWorldBookClicked() {
    setMenuDialogOpened(false)
  }

  async function exportClicked() {
    setMenuDialogOpened(false)

    if (!adminCharaInfo) {
      return
    }

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
    setMenuDialogOpened(false)

    if (!adminCharaInfo) {
      return
    }

    const id = toast.loading(tCommon('deleting'))

    const res = await deleteCard(adminCharaInfo.id)
    if (res.code === 0) {
      toast.success(tCommon('deleted'), {
        id: id,
      })
      navigate('/')
      await refreshCharacterInfoList()
    } else {
      toast(tCommon('opFailed'), {
        id: id,
      })
    }
  }

  useEffect(function () {
    document.addEventListener('click', globalCloseMenuDialog)

    return function () {
      document.removeEventListener('click', globalCloseMenuDialog)
    }
  }, [])

  return {
    menuDialogOpened,
    renameModalOpened,
    onRenameModalOpenChange,
    onRenameSave,
    openMenuDialog,
    renameClicked,
    callMeByClicked,
    linkToWorldBookClicked,
    exportClicked,
    deleteClicked,
  }
}

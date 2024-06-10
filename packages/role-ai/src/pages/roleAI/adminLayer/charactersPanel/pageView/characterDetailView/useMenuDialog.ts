import { deleteCard, exportCardPNG } from '@/api/characterCard/characterCard'
import { isString } from '@/libs/isTypes'
import { saveBlob } from '@/libs/saveBlob'
import { useSetCharacterInfoList } from '@/pages/roleAI/context/CharacterInfoListContextProvider'
import { useCurrentChatCharacterInfo } from '@/pages/roleAI/context/CurrentChatCharacterInfoContextProvider'
import { useEffect, useState, MouseEvent } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

export function useMenuDialog() {
  const [menuDialogOpened, setMenuDialogOpened] = useState(false)
  const { charaCardInfo } = useCurrentChatCharacterInfo()
  const { refreshCharacterInfoList } = useSetCharacterInfoList()
  const navigate = useNavigate()
  const { t: tCommon } = useTranslation('common')

  function openMenuDialog(e: MouseEvent<HTMLDivElement>) {
    e.stopPropagation()
    setMenuDialogOpened(true)
  }

  function globalCloseMenuDialog() {
    setMenuDialogOpened(false)
  }

  async function renameClicked() {
    setMenuDialogOpened(false)
    navigate('editName')
  }

  async function linkToWorldBookClicked() {
    setMenuDialogOpened(false)
  }

  async function exportClicked() {
    setMenuDialogOpened(false)

    if (!charaCardInfo) {
      return
    }

    const id = toast.loading(tCommon('loading'))
    try {
      const res = await exportCardPNG(charaCardInfo.id)

      toast.dismiss(id)

      saveBlob(res.data, `${charaCardInfo.card.data.name}.png`)
    } catch (err: any) {
      const msg = err?.message
      toast.error(isString(msg) ? msg : tCommon('opFailed'), {
        id: id,
      })
    }
  }

  async function deleteClicked() {
    setMenuDialogOpened(false)

    if (!charaCardInfo) {
      return
    }

    const id = toast.loading(tCommon('deleting'))

    const res = await deleteCard(charaCardInfo.id)
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
    openMenuDialog,
    renameClicked,
    linkToWorldBookClicked,
    exportClicked,
    deleteClicked,
  }
}

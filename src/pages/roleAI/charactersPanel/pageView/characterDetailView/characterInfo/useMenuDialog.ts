import { deleteCard, exportCardPNG } from '@/api/characterCard/characterCard'
import { saveBlob } from '@/libs/saveBlob'
import { useSetCharacterCardInfoList } from '@/pages/roleAI/context/CharacterCardInfoListContextProvider'
import { useCurrentCharacterCardInfo } from '@/pages/roleAI/context/CurrentCharacterCardInfoContextProvider'
import { useEffect, useState, MouseEvent } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

export function useMenuDialog() {
  const [menuDialogOpened, setMenuDialogOpened] = useState(false)
  const { charaCardInfo } = useCurrentCharacterCardInfo()
  const { refreshCharacterCardInfoList } = useSetCharacterCardInfoList()
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
    navigate('editName')
  }

  async function linkToWorldBookClicked() {}

  async function exportClicked() {
    if (!charaCardInfo) {
      return
    }

    try {
      const res = await exportCardPNG(charaCardInfo.id)
      saveBlob(res.data, `${charaCardInfo.card.data.name}.png`)
    } catch {
      toast.error(tCommon('opFailed'))
    }
  }

  async function deleteClicked() {
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
      await refreshCharacterCardInfoList()
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

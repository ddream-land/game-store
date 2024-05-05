import { deleteCard } from '@/api/characterCard/characterCard'
import { useSetCharacterCardInfoList } from '@/pages/roleAI/context/CharacterCardInfoListContextProvider'
import { useCurrentCharacterCardInfo } from '@/pages/roleAI/context/CurrentCharacterCardInfoContextProvider'
import { useEffect, useState, MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'

export function useMenuDialog() {
  const [menuDialogOpened, setMenuDialogOpened] = useState(false)
  const { charaCardInfo } = useCurrentCharacterCardInfo()
  const { refreshCharacterCardInfoList } = useSetCharacterCardInfoList()
  const navigate = useNavigate()

  function openMenuDialog(e: MouseEvent<HTMLDivElement>) {
    e.stopPropagation()
    setMenuDialogOpened(true)
  }

  function globalCloseMenuDialog() {
    setMenuDialogOpened(false)
  }

  async function renameClicked() {}

  async function linkToWorldBookClicked() {}

  async function exportClicked() {}

  async function deleteClicked() {
    if (!charaCardInfo) {
      return
    }
    const res = await deleteCard(charaCardInfo.avatar)
    if (res === 'OK') {
      navigate('/')
      await refreshCharacterCardInfoList()
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

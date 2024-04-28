import { useEffect, useState, MouseEvent } from 'react'

export function useMenuDialog() {
  const [menuDialogOpened, setMenuDialogOpened] =
    useState(false)

  function openMenuDialog(e: MouseEvent<HTMLDivElement>) {
    e.stopPropagation()
    setMenuDialogOpened(true)
  }

  function globalCloseMenuDialog() {
    setMenuDialogOpened(false)
  }

  useEffect(function () {
    document.addEventListener(
      'click',
      globalCloseMenuDialog
    )

    return function () {
      document.removeEventListener(
        'click',
        globalCloseMenuDialog
      )
    }
  }, [])

  return {
    menuDialogOpened,
    openMenuDialog,
  }
}

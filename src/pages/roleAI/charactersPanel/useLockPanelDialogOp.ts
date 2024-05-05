import { DEFAULT_LOCK_PANEL } from '@/constant/env'
import { useState } from 'react'

export function useLockPanelDialogOp() {
  const [lockPanelForNotMinimize, setLockPanelForNotMinimize] = useState(DEFAULT_LOCK_PANEL)

  function switchPanelLock(to: boolean) {
    setLockPanelForNotMinimize(to)
  }

  return {
    lockPanelForNotMinimize,
    switchPanelLock,
  }
}

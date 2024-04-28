import { useState } from 'react'

export function useLockPanelDialogOp() {
  const [lockPanelForNotMinimize , setLockPanelForNotMinimize ] = useState(false)

  function switchPanelLock(to: boolean) {
    setLockPanelForNotMinimize(to)
  }

  return {
    lockPanelForNotMinimize,
    switchPanelLock,
  }
}

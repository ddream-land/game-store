import { useState } from 'react'

export function useLockDialogOp() {
  const [lockForNotMinify, setLockForNotMinify] = useState(false)

  function switchLock(to: boolean) {
    setLockForNotMinify(to)
  }

  return {
    lockForNotMinify,
    switchLock,
  }
}

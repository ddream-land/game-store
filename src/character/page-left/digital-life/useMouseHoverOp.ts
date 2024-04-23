import { useState } from 'react'

const MINIFY_PANEL_TIMEOUT = 2000
let MINIFY_PANEL_TIMER_SIGNAL: number | undefined

export function useMouseHoverOp() {
  const [minify, setMinify] = useState(true)
  const [showLockDialog, setShowLockDialog] = useState(false)

  function mouseOnPanel() {
    MINIFY_PANEL_TIMER_SIGNAL && clearTimeout(MINIFY_PANEL_TIMER_SIGNAL)
    setMinify(false)
    setShowLockDialog(true)
  }

  function mouseOutofPanel() {
    MINIFY_PANEL_TIMER_SIGNAL && clearTimeout(MINIFY_PANEL_TIMER_SIGNAL)
    MINIFY_PANEL_TIMER_SIGNAL = window.setTimeout(() => {
      setMinify(true)
      setShowLockDialog(false)
    }, MINIFY_PANEL_TIMEOUT)
  }

  return {
    mouseOnPanel,
    mouseOutofPanel,

    minify,
    showLockDialog,
  }
}

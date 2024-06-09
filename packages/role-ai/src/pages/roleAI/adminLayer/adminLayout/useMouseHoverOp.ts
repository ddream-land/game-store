import { useState } from 'react'

let MINIFY_PANEL_TIMER_SIGNAL: number | undefined

export function useMouseHoverOp(minifyTimeout: number = 2000) {
  const [minify, setMinify] = useState(false)

  function mouseOnPanel() {
    MINIFY_PANEL_TIMER_SIGNAL && clearTimeout(MINIFY_PANEL_TIMER_SIGNAL)
    setMinify(false)
  }

  function mouseOutofPanel() {
    MINIFY_PANEL_TIMER_SIGNAL && clearTimeout(MINIFY_PANEL_TIMER_SIGNAL)
    MINIFY_PANEL_TIMER_SIGNAL = window.setTimeout(() => {
      // setMinify(true)
    }, minifyTimeout)
  }

  return {
    mouseOnPanel,
    mouseOutofPanel,

    minify,
  }
}

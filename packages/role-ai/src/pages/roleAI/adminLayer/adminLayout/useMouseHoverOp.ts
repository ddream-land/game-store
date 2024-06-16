import { useSetAdminPanelStateContext } from '../../context/AdminPanelStateContextProvider'
import { KEEP_ROLE_PANEL_OPEN } from '@/constant/env'

let MINIFY_PANEL_TIMER_SIGNAL: number | undefined

export function useMouseHoverOp(minifyTimeout: number = 2000) {
  const setAdminPanelState = useSetAdminPanelStateContext()

  function mouseOnPanel() {
    MINIFY_PANEL_TIMER_SIGNAL && clearTimeout(MINIFY_PANEL_TIMER_SIGNAL)
    setAdminPanelState({
      minify: false,
    })
  }

  function mouseOutofPanel() {
    MINIFY_PANEL_TIMER_SIGNAL && clearTimeout(MINIFY_PANEL_TIMER_SIGNAL)
    MINIFY_PANEL_TIMER_SIGNAL = window.setTimeout(() => {
      if (KEEP_ROLE_PANEL_OPEN) {
        return
      }
      setAdminPanelState({
        minify: true,
      })
    }, minifyTimeout)
  }

  return {
    mouseOnPanel,
    mouseOutofPanel,
  }
}

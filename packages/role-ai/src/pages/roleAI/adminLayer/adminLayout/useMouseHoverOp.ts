import {
  useAdminPanelState,
  useSetAdminPanelStateContext,
} from '../../context/AdminPanelStateContextProvider'

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
      // setAdminPanelState({
      //   minify: true,
      // })
    }, minifyTimeout)
  }

  return {
    mouseOnPanel,
    mouseOutofPanel,
  }
}

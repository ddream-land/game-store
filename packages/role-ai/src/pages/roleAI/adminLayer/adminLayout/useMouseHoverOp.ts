import { KEEP_ROLE_PANEL_OPEN } from '@/constant/env'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { setMinify } from '@/store/slices/adminPanelSlice'

let MINIFY_PANEL_TIMER_SIGNAL: number | undefined

export function useMouseHoverOp(minifyTimeout: number = 2000) {
  const dispatch = useAppDispatch()

  function setMinifyVal(val: boolean) {
    dispatch(setMinify(val))
  }

  function mouseOnPanel() {
    MINIFY_PANEL_TIMER_SIGNAL && clearTimeout(MINIFY_PANEL_TIMER_SIGNAL)
    setMinifyVal(false)
  }

  function mouseOutofPanel() {
    MINIFY_PANEL_TIMER_SIGNAL && clearTimeout(MINIFY_PANEL_TIMER_SIGNAL)
    MINIFY_PANEL_TIMER_SIGNAL = window.setTimeout(() => {
      if (KEEP_ROLE_PANEL_OPEN) {
        return
      }
      setMinifyVal(true)
    }, minifyTimeout)
  }

  return {
    mouseOnPanel,
    mouseOutofPanel,
  }
}

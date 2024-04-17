import { useEffect, useRef, useState } from 'react'
import classes from './digital-life-panel.module.scss'
import Overview, { DigitalLifeInfo } from './overview/overview'
import Detail from './detail/detail'

const MINIFY_PANEL_TIMEOUT = 2000
let MINIFY_PANEL_TIMER_SIGNAL: number | undefined

function LockDialog({ lock, switchLock }: { lock: boolean; switchLock: (to: boolean) => void }) {
  return (
    <div
      onClick={function () {
        switchLock(!lock)
      }}
      className={`${classes['lock-dialog']} ${
        lock ? classes.lock : classes.unlock
      } absolute cursor-pointer`}
    ></div>
  )
}

export default function DigitalLifePanel() {
  const panelEl = useRef<HTMLDivElement | null>(null)
  const [minify, setMinify] = useState(true)
  const [lockForNotMinify, setLockForNotMinify] = useState(true)
  const [showLockDialog, setShowLockDialog] = useState(false)

  const [currentDigitalLifeInfo, setCurrentDigitalLifeInfo] = useState<
    DigitalLifeInfo | undefined
  >()

  function mouseOnPanel() {
    MINIFY_PANEL_TIMER_SIGNAL && clearTimeout(MINIFY_PANEL_TIMER_SIGNAL)
    setMinify(false)
    setShowLockDialog(true)
  }
  function mouseOutofPanel() {
    MINIFY_PANEL_TIMER_SIGNAL && clearTimeout(MINIFY_PANEL_TIMER_SIGNAL)
    MINIFY_PANEL_TIMER_SIGNAL = setTimeout(() => {
      setMinify(true)
      setShowLockDialog(false)
    }, MINIFY_PANEL_TIMEOUT)
  }

  function switchLock(to: boolean) {
    setLockForNotMinify(to)
  }

  const showDetail = lockForNotMinify || !minify

  const content = showDetail ? (
    <Detail></Detail>
  ) : (
    <Overview digitalLifeInfo={currentDigitalLifeInfo}></Overview>
  )

  return (
    <div
      ref={panelEl}
      className={`${classes.dlp} ${
        showDetail ? '' : `${classes['minify']}`
      } relative pointer-events-auto`}
      onMouseEnter={mouseOnPanel}
      onMouseOver={mouseOnPanel}
      onMouseLeave={mouseOutofPanel}
    >
      {content}
      <div className={`${showLockDialog ? '' : 'hidden'}`}>
        <LockDialog lock={lockForNotMinify} switchLock={switchLock}></LockDialog>
      </div>
    </div>
  )
}

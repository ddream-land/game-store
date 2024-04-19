import { useEffect, useRef, useState } from 'react'
import classes from './DigitalLifePanel.module.scss'
import Overview from './overview/Overview'
import Detail from './detail/Detail'
import { DigitalLifeContextProvider } from './DigitalLifeContext'
import { useMouseHoverOp } from './useMouseHoverOp'
import { useLockDialogOp } from './useLockDialogOp'
import { usePageOp } from './usePageOp'
import LifeDetail from './life-detail/LifeDetail'

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
  const { mouseOnPanel, mouseOutofPanel, minify, showLockDialog } = useMouseHoverOp()
  const { lockForNotMinify, switchLock } = useLockDialogOp()
  const { open: lifeDetailPageOpen, setOpen: setLifeDetailPageOpen } = usePageOp(minify)
  // const { open: bgImgPageOpen, setOpen: setBgImgPageOpen } = usePageOp()

  const showDetail = lockForNotMinify || !minify

  return (
    <DigitalLifeContextProvider>
      <div
        className={`${classes.dlp} ${
          showDetail ? '' : `${classes['minify']}`
        } relative pointer-events-auto`}
        onMouseEnter={mouseOnPanel}
        onMouseOver={mouseOnPanel}
        onMouseLeave={mouseOutofPanel}
      >
        <div className={`${classes.page} ${classes['base-page']} w-full h-full`}>
          {showDetail ? (
            <Detail itemClicked={() => setLifeDetailPageOpen(true)}></Detail>
          ) : (
            <Overview></Overview>
          )}
          <div className={`${showLockDialog ? '' : 'hidden'}`}>
            <LockDialog lock={lockForNotMinify} switchLock={switchLock}></LockDialog>
          </div>
        </div>

        {lifeDetailPageOpen && (
          <div className={`${classes.page} animate ${classes['over-page']} absolute inset-0`}>
            <LifeDetail onCloseClicked={() => setLifeDetailPageOpen(false)}></LifeDetail>
          </div>
        )}
      </div>
    </DigitalLifeContextProvider>
  )
}

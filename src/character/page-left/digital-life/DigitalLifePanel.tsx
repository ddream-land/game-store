import { useEffect, useRef, useState } from 'react'
import classes from './DigitalLifePanel.module.scss'
import Overview from './overview/Overview'
import Detail from './detail/Detail'
import { useMouseHoverOp } from './useMouseHoverOp'
import { useLockDialogOp } from './useLockDialogOp'
import { usePageOp } from './usePageOp'
import LifeDetail from './life-detail/LifeDetail'
import { useCurrentDigitalLifeId } from '@/character/context/CurrentDigitalLifeIdContextProvider'

function LockDialog({
  lock,
  switchLock,
}: {
  lock: boolean
  switchLock: (to: boolean) => void
}) {
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
  const {
    mouseOnPanel,
    mouseOutofPanel,
    minify,
    showLockDialog,
  } = useMouseHoverOp()
  const { lockForNotMinify, switchLock } = useLockDialogOp()
  const currentDigitalLifeId = useCurrentDigitalLifeId()
  const {
    open: lifeDetailPageOpen,
    setOpen: setLifeDetailPageOpen,
  } = usePageOp()
  // const { open: bgImgPageOpen, setOpen: setBgImgPageOpen } = usePageOp()

  const showDetail = lockForNotMinify || !minify

  useEffect(
    function () {
      if (!showDetail) {
        setLifeDetailPageOpen(false)
      }
    },
    [minify]
  )

  useEffect(
    function () {
      if (currentDigitalLifeId === undefined) {
        setLifeDetailPageOpen(false)
      }
    },
    [currentDigitalLifeId]
  )

  return (
    <div
      className={`${classes.dlp} ${
        showDetail ? '' : `${classes['minify']}`
      } relative pointer-events-auto`}
      onMouseEnter={mouseOnPanel}
      onMouseOver={mouseOnPanel}
      onMouseLeave={mouseOutofPanel}
    >
      <div
        className={`${classes.page} ${classes['base-page']} w-full h-full`}
      >
        {showDetail ? (
          <Detail
            itemClicked={() => setLifeDetailPageOpen(true)}
          ></Detail>
        ) : (
          <Overview></Overview>
        )}
        <div
          className={`${showLockDialog ? '' : 'hidden'}`}
        >
          <LockDialog
            lock={lockForNotMinify}
            switchLock={switchLock}
          ></LockDialog>
        </div>
      </div>

      {showDetail && lifeDetailPageOpen && (
        <div
          className={`${classes.page} ${classes['over-page']} absolute inset-0`}
        >
          <LifeDetail
            onCloseClicked={() =>
              setLifeDetailPageOpen(false)
            }
          ></LifeDetail>
        </div>
      )}
    </div>
  )
}

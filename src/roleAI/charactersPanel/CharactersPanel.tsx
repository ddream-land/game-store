import { useEffect, useRef, useState } from 'react'
import classes from './CharactersPanel.module.scss'
import { useMouseHoverOp } from './useMouseHoverOp'
import { useLockPanelDialogOp } from './useLockPanelDialogOp'
import { usePageOp } from './usePageOp'
import CharacterDetailView from './characterDetailView/CharacterDetailView'
import { useCurrentDigitalLifeId } from '@/roleAI/context/CurrentDigitalLifeIdContextProvider'
import LockPanelDialog from './lockPanelDialog/LockPanelDialog'
import CharactersView from './charactersView/CharactersView'
import MinimizedOverview from './minimizedOverview/MinimizedOverview'

export default CharactersPanel

function CharactersPanel() {
  const {
    mouseOnPanel,
    mouseOutofPanel,
    minify,
    showLockDialog,
  } = useMouseHoverOp()
  const { lockPanelForNotMinimize, switchPanelLock } =
    useLockPanelDialogOp()
  const currentDigitalLifeId = useCurrentDigitalLifeId()
  const {
    open: lifeDetailPageOpen,
    setOpen: setLifeDetailPageOpen,
  } = usePageOp()
  // const { open: bgImgPageOpen, setOpen: setBgImgPageOpen } = usePageOp()

  const showDetail = lockPanelForNotMinimize || !minify

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
      className={`${classes.charactersPanel} ${
        showDetail ? '' : `${classes.minify}`
      } relative pointer-events-auto`}
      onMouseEnter={mouseOnPanel}
      onMouseOver={mouseOnPanel}
      onMouseLeave={mouseOutofPanel}
    >
      <div
        className={`${classes.page} ${classes['base-page']} w-full h-full`}
      >
        {showDetail ? (
          <CharactersView
            characterSelected={() =>
              setLifeDetailPageOpen(true)
            }
          ></CharactersView>
        ) : (
          <MinimizedOverview></MinimizedOverview>
        )}
        <div
          className={`${showLockDialog ? '' : 'hidden'}`}
        >
          <LockPanelDialog
            lock={lockPanelForNotMinimize}
            switchLock={switchPanelLock}
          ></LockPanelDialog>
        </div>
      </div>

      {showDetail && lifeDetailPageOpen && (
        <div
          className={`${classes.page} ${classes['over-page']} absolute inset-0`}
        >
          <CharacterDetailView
            onViewCloseClicked={() =>
              setLifeDetailPageOpen(false)
            }
          ></CharacterDetailView>
        </div>
      )}
    </div>
  )
}

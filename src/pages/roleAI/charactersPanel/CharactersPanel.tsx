import classes from './CharactersPanel.module.scss'
import { useMouseHoverOp } from './useMouseHoverOp'
import { useLockPanelDialogOp } from './useLockPanelDialogOp'
import { useSetCurrentCharacterCardInfoId } from '@/pages/roleAI/context/CurrentCharacterCardInfoIdContextProvider'
import LockPanelDialog from './lockPanelDialog/LockPanelDialog'
import CharactersView from './charactersView/CharactersView'
import MinimizedOverview from './minimizedOverview/MinimizedOverview'
import { Outlet, useNavigate } from 'react-router-dom'

export default CharactersPanel

function CharactersPanel() {
  const navigate = useNavigate()
  const {
    mouseOnPanel,
    mouseOutofPanel,
    minify,
    showLockDialog,
  } = useMouseHoverOp()
  const { lockPanelForNotMinimize, switchPanelLock } =
    useLockPanelDialogOp()

  const setCurrent = useSetCurrentCharacterCardInfoId()

  const showLargePanel = lockPanelForNotMinimize || !minify

  function onCharaSelected(id: string) {
    setCurrent(id)
    navigate(`detail`)
  }

  return (
    <div
      className={`${classes.charactersPanel} ${
        showLargePanel ? '' : `${classes.minify}`
      } relative pointer-events-auto`}
      onMouseEnter={mouseOnPanel}
      onMouseOver={mouseOnPanel}
      onMouseLeave={mouseOutofPanel}
    >
      <div
        className={`${classes.page} ${classes['base-page']} w-full h-full`}
      >
        {showLargePanel ? (
          <CharactersView
            characterSelected={onCharaSelected}
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

      {showLargePanel && <Outlet></Outlet>}
    </div>
  )
}

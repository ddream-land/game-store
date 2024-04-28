import classes from './LockPanelDialog.module.scss'

export type LockPanelDialogProps = {
  lock: boolean
  switchLock: (to: boolean) => void
}

function LockPanelDialog({
  lock,
  switchLock,
}: LockPanelDialogProps) {
  return (
    <div
      onClick={function () {
        switchLock(!lock)
      }}
      className={`${classes.lockPanelDialog} ${
        lock ? classes.lock : classes.unlock
      } absolute cursor-pointer`}
    ></div>
  )
}

export default LockPanelDialog

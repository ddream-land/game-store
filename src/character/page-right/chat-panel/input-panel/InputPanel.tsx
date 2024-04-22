import classes from './InputPanel.module.scss'
import { KeyboardEvent } from 'react'

export default function InputPanel() {
  function onKeyDownEnter(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== 'Enter') {
      return
    }
    event.preventDefault()
  }

  return (
    <div className={`${classes.ip} flex flex-row items-center`}>
      <div className={`${classes.op} flex-1 flex flex-row items-center`}>
        <div className={`${classes.btn} ${classes.voice} bg-no-repeat bg-center flex-none`}> </div>
        <div className={`${classes.msg} flex-1 flex items-center`}>
          <textarea
            onKeyDown={onKeyDownEnter}
            rows={1}
            className={`w-full h-full box-border`}
          ></textarea>
        </div>
        <div className={`${classes.btn} ${classes.send} bg-no-repeat bg-center flex-none`}> </div>
      </div>
      <div className={`${classes.new} flex-none flex justify-center items-center`}>+</div>
    </div>
  )
}

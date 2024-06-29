import { NuwaChatMessage } from '@/core/ChatMessage'
import classes from './UserMsg.module.scss'
import { Image } from '@nextui-org/react'
import MsgMenu from '../MsgControl/MsgMenu'
import { useState, MouseEvent } from 'react'
import MsgControl from '../MsgControl/MsgControl'

export default UserMsg

type UserMsgProps = Readonly<{
  msg: NuwaChatMessage
  menuVisible: boolean
  onMenuBtnClicked: (e: MouseEvent) => void
  onEditClicked: (e: MouseEvent) => void
  onDelClicked: (e: MouseEvent) => void
}>

function UserMsg({
  msg,
  menuVisible,
  onMenuBtnClicked,
  onEditClicked,
  onDelClicked,
}: UserMsgProps) {
  return (
    <div className={`${classes.userMsg} mt-[48px] w-full flex flex-row-reverse relative`}>
      <div className="w-5/6 group relative">
        <div className={`${classes.content}`}>{msg.content}</div>

        <MsgControl
          menuVisible={menuVisible}
          onMenuBtnClicked={onMenuBtnClicked}
          onEditClicked={onEditClicked}
          onDelClicked={onDelClicked}
          className="!right-[0px]"
        ></MsgControl>
      </div>
    </div>
  )
}

import { NuwaChatMessage } from '@/core/ChatMessage'
import classes from './UserMsg.module.scss'
import { Image, Textarea } from '@nextui-org/react'
import { useState, MouseEvent, useEffect } from 'react'
import MsgControl, { MenuPopoverPlacement } from '../MsgControl/MsgControl'
import EditControl from '../MsgControl/EditControl'
import type { PressEvent } from '@react-types/shared'

export default UserMsg

type UserMsgProps = Readonly<{
  msg: NuwaChatMessage
  onEditClicked: (e: PressEvent) => void
  onEditCancelClicked: (e: MouseEvent) => void
  onEditSaveClicked: (e: MouseEvent, content: string) => void
  onDelClicked: (e: PressEvent) => void
  onMouseLeave?: (e: MouseEvent) => void
  editMode?: boolean
  menuPopoverPlacement?: MenuPopoverPlacement
}>

function UserMsg({
  msg,
  onEditClicked,
  onEditCancelClicked,
  onEditSaveClicked,
  onDelClicked,
  onMouseLeave,
  editMode,
  menuPopoverPlacement,
}: UserMsgProps) {
  const [editText, setEditText] = useState(msg.content)

  useEffect(
    function () {
      if (editMode) {
        setEditText(msg.content)
      } else {
        setEditText('')
      }
    },
    [editMode]
  )

  return (
    <div className={`${classes.userMsg} mt-[48px] w-full flex flex-row-reverse relative`}>
      <div className="w-5/6 group relative">
        <div
          className={`${
            editMode ? 'hidden' : ''
          } w-full px-[30px] py-[26px] bg-[#383838] text-[#fff] text-[12px] font-[400] leading-[18px] text-left whitespace-pre-wrap rounded-[18px] rounded-br-none shadow-[0_4px_12px_0_rgba(0,0,0,0.1)]`}
        >
          {msg.content}
        </div>
        <Textarea
          fullWidth
          maxRows={25}
          variant="bordered"
          value={editText}
          onValueChange={setEditText}
          className={`${
            editMode ? '' : 'hidden'
          }  p-[18px] bg-[#383838] text-[#fff] text-[12px] font-[400] leading-[18px] text-left whitespace-pre-wrap rounded-[18px] rounded-br-none shadow-[0_4px_12px_0_rgba(0,0,0,0.1)]`}
          classNames={{
            input: 'scrollbar-override',
          }}
        />

        <MsgControl
          onEditClicked={onEditClicked}
          onDelClicked={onDelClicked}
          onMouseLeave={onMouseLeave}
          menuPopoverPlacement={menuPopoverPlacement}
          className={`${editMode && '!hidden'}`}
        ></MsgControl>

        <EditControl
          visible={!!editMode}
          onSaveClicked={(e) => onEditSaveClicked(e, editText)}
          onCancelClicked={onEditCancelClicked}
        ></EditControl>
      </div>
    </div>
  )
}

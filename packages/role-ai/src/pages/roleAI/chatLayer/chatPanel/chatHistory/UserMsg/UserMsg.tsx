import { NuwaChatMessage } from '@/core/ChatMessage'
import classes from './UserMsg.module.scss'
import { Image, Textarea } from '@nextui-org/react'
import MsgMenu from '../MsgControl/MsgMenu'
import { useState, MouseEvent, useEffect } from 'react'
import MsgControl from '../MsgControl/MsgControl'
import EditControl from '../MsgControl/EditControl'

export default UserMsg

type UserMsgProps = Readonly<{
  msg: NuwaChatMessage
  menuVisible: boolean
  onMenuBtnClicked: (e: MouseEvent) => void
  onEditClicked: (e: MouseEvent) => void
  onEditCancelClicked: (e: MouseEvent) => void
  onEditSaveClicked: (e: MouseEvent, content: string) => void
  onDelClicked: (e: MouseEvent) => void
  onMouseLeave?: (e: MouseEvent) => void
  editMode?: boolean
}>

function UserMsg({
  msg,
  menuVisible,
  onMenuBtnClicked,
  onEditClicked,
  onEditCancelClicked,
  onEditSaveClicked,
  onDelClicked,
  onMouseLeave,
  editMode,
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
          menuVisible={menuVisible}
          onMenuBtnClicked={onMenuBtnClicked}
          onEditClicked={onEditClicked}
          onDelClicked={onDelClicked}
          onMouseLeave={onMouseLeave}
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

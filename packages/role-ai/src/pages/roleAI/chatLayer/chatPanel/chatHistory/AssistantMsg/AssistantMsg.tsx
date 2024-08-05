import { NuwaChatMessage } from '@/core/ChatMessage'
import classes from './AssistantMsg.module.scss'
import { Image, Textarea } from '@nextui-org/react'
import { MouseEvent, useEffect, useState } from 'react'
import MsgControl, { MenuPopoverPlacement } from '../MsgControl/MsgControl'
import EditControl from '../MsgControl/EditControl'
import { useAppSelector } from '@/hooks/useAppSelector'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { setChatHistory } from '@/store/slices/chatSlice'
import type { PressEvent } from '@react-types/shared'

export default AssistantMsg

type AssistantMsgProps = Readonly<{
  msg: NuwaChatMessage
  showPlayVoiceBtn?: boolean
  showPauseBtn?: boolean
  showRegenerateBtn?: boolean
  showMenuBtn?: boolean
  onEditClicked: (e: PressEvent) => void
  onEditCancelClicked: (e: MouseEvent) => void
  onEditSaveClicked: (e: MouseEvent, content: string) => void
  onDelClicked: (e: PressEvent) => void
  onMouseLeave?: (e: MouseEvent) => void
  onPlayVoiceBtnClicked?: (e: MouseEvent, msg: NuwaChatMessage) => void
  onPauseBtnClicked?: (e: MouseEvent, msg: NuwaChatMessage) => void
  onRegenerateBtnClicked?: (e: MouseEvent) => void
  editMode?: boolean
  menuPopoverPlacement?: MenuPopoverPlacement
}>

function AssistantMsg({
  msg,
  showPlayVoiceBtn,
  showPauseBtn,
  showRegenerateBtn,
  showMenuBtn,
  onEditClicked,
  onEditCancelClicked,
  onEditSaveClicked,
  onDelClicked,
  onMouseLeave,
  onPlayVoiceBtnClicked,
  onPauseBtnClicked,
  onRegenerateBtnClicked,
  editMode,
  menuPopoverPlacement,
}: AssistantMsgProps) {
  const dispatch = useAppDispatch()
  const chatHistory = useAppSelector((state) => state.chat.chatHistory)

  const msgId = msg.id
  const showSwitch = msg.contents && msg.contents.length > 1
  let leftEnable = false
  let rightEnable = false
  if (showSwitch) {
    const currentContentIndex = msg.contents!.findIndex((x) => x.content === msg.content)
    if (currentContentIndex > 0) {
      leftEnable = true
    }
    if (currentContentIndex < msg.contents!.length - 1) {
      rightEnable = true
    }
  }

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

  async function onLeftClicked() {
    if (!showSwitch || !leftEnable) {
      return
    }
    const currentContentIndex = msg.contents!.findIndex((x) => x.content === msg.content)
    let toContentIndex = 0
    if (currentContentIndex > 0) {
      toContentIndex = currentContentIndex - 1
    }

    dispatch(
      setChatHistory(
        chatHistory.map(function (msg) {
          if (msg.id === msgId) {
            return {
              ...msg,
              content: msg.contents![toContentIndex].content,
              tokens: msg.contents![toContentIndex].tokens,
            }
          } else {
            return msg
          }
        })
      )
    )
  }

  async function onRightClicked() {
    if (!showSwitch || !rightEnable) {
      return
    }
    const currentContentIndex = msg.contents!.findIndex((x) => x.content === msg.content)
    let toContentIndex = msg.contents!.length - 1
    if (currentContentIndex < toContentIndex) {
      toContentIndex = currentContentIndex + 1
    }

    dispatch(
      setChatHistory(
        chatHistory.map(function (msg) {
          if (msg.id === msgId) {
            return {
              ...msg,
              content: msg.contents![toContentIndex].content,
              tokens: msg.contents![toContentIndex].tokens,
            }
          } else {
            return msg
          }
        })
      )
    )
  }

  return (
    <div className={`${classes.assistMsg} mt-[48px] w-full flex flex-row relative`}>
      <div className="w-5/6 group relative">
        <div
          className={`${
            editMode && 'hidden'
          } w-full px-[30px] py-[26px] bg-gradient-to-br from-[#6948ea] to-[#9f53da] text-[#fff] text-[12px] font-[400] leading-[18px] text-left whitespace-pre-wrap rounded-[18px] rounded-bl-none shadow-[0_4px_12px_0_rgba(0,0,0,0.1)]`}
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
            !editMode && 'hidden'
          } p-[18px] bg-gradient-to-br from-[#6948ea] to-[#9f53da] text-[#fff] text-[12px] font-[400] leading-[18px] text-left whitespace-pre-wrap rounded-[18px] rounded-br-none shadow-[0_4px_12px_0_rgba(0,0,0,0.1)]`}
          classNames={{
            input: 'scrollbar-override',
          }}
        />

        <div
          className={`${classes.switchMsg} ${!showSwitch && 'hidden'} ${
            editMode && 'hidden'
          } absolute flex flex-row`}
        >
          <div
            onClick={onLeftClicked}
            className={`${classes.arrow} ${
              leftEnable ? '' : classes.disable
            } cursor-pointer h-full flex justify-center items-center flex-1`}
          >
            &lt;
          </div>
          <div
            onClick={onRightClicked}
            className={`${classes.arrow} ${
              rightEnable ? '' : classes.disable
            } cursor-pointer h-full flex justify-center items-center flex-1`}
          >
            &gt;
          </div>
        </div>

        <MsgControl
          showPlayVoiceBtn={showPlayVoiceBtn}
          showPauseBtn={showPauseBtn}
          showRegenerateBtn={showRegenerateBtn}
          showMenuBtn={showMenuBtn}
          onEditClicked={onEditClicked}
          onDelClicked={onDelClicked}
          onMouseLeave={onMouseLeave}
          onPlayVoiceBtnClicked={(e) => {
            onPlayVoiceBtnClicked && onPlayVoiceBtnClicked(e, msg)
          }}
          onPauseBtnClicked={(e) => {
            onPauseBtnClicked && onPauseBtnClicked(e, msg)
          }}
          onRegenerateBtnClicked={onRegenerateBtnClicked}
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

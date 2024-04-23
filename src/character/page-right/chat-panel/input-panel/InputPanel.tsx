import {
  useChatMessages,
  useSetChatMessage,
} from '@/character/context/ChatMessagesContextProvider'
import classes from './InputPanel.module.scss'
import { KeyboardEvent, useRef, useState } from 'react'
import { ChatMessage } from '@/libs/ChatMessage'
import { ChatRole } from '@/libs/ChatRole'
import { chat } from '@/api/chatMessage'
import { useSetCurrentDigitalLifeId } from '@/character/context/CurrentDigitalLifeIdContextProvider'

let uid = 1

export default function InputPanel() {
  const textareaEl = useRef<HTMLTextAreaElement>(null)
  const setChatMsg = useSetChatMessage()
  const [inputDisable, setInputDisable] = useState(false)
  const [newDialogVisible, setNewDialogVisible] =
    useState(false)
  const setCurrentDigitalLifeId =
    useSetCurrentDigitalLifeId()

  async function sendChat(userMsg?: string) {
    if (!userMsg || inputDisable) {
      return
    }

    setInputDisable(true)

    const newUserMsg: ChatMessage = {
      id: uid++,
      role: ChatRole.User,
      content: userMsg,
      date: new Date(),
    }

    setChatMsg((msgs) => [...msgs, newUserMsg])
    textareaEl.current && (textareaEl.current.value = '')

    try {
      const response = await chat(userMsg)
      const newAssistantMsg: ChatMessage = {
        id: uid++,
        role: ChatRole.Assistant,
        content: response,
        date: new Date(),
      }

      setChatMsg((msgs) => [...msgs, newAssistantMsg])
    } catch {}

    setInputDisable(false)
  }

  async function sendBtnClicked() {
    await sendChat(textareaEl.current?.value)
  }

  async function onKeyDownEnter(
    event: KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (event.key !== 'Enter') {
      return
    }
    event.preventDefault()

    await sendChat(textareaEl.current?.value)
  }

  function newBtnClicked() {
    setNewDialogVisible(!newDialogVisible)
  }

  function dialogCloseBtnClicked() {
    setNewDialogVisible(false)
  }

  function dialogNewChatBtnClicked() {
    setChatMsg([])
    dialogCloseBtnClicked()
  }

  function dialogCloseChatBtnClicked() {
    setChatMsg([])
    setCurrentDigitalLifeId(undefined)
    dialogCloseBtnClicked()
  }

  return (
    <>
      <div
        className={`${classes.ip} flex flex-row items-center relative`}
      >
        <div
          className={`${classes.op} flex-1 flex flex-row items-center`}
        >
          <div
            className={`${classes.btn} ${classes.voice} hidden bg-no-repeat bg-center flex-none`}
          >
            {' '}
          </div>
          <div
            className={`${classes.msg} flex-1 flex items-center`}
          >
            <textarea
              ref={textareaEl}
              onKeyDown={onKeyDownEnter}
              rows={1}
              className={`${
                inputDisable ? ' cursor-not-allowed' : ''
              } w-full h-full box-border`}
            ></textarea>
          </div>
          <div
            onClick={sendBtnClicked}
            className={`${classes.btn} ${classes.send} ${
              inputDisable ? ' cursor-not-allowed' : ''
            } cursor-pointer bg-no-repeat bg-center flex-none`}
          >
            {' '}
          </div>
        </div>
        <div
          onClick={newBtnClicked}
          className={`${classes.new} cursor-pointer flex-none flex justify-center items-center`}
        >
          +
        </div>
        <div
          className={`${classes['new-dialog']} ${
            newDialogVisible ? '' : 'hidden'
          } absolute`}
        >
          <div
            className={`${classes.header} flex justify-end`}
          >
            <div
              onClick={dialogCloseBtnClicked}
              className={`${classes.close} cursor-pointer`}
            ></div>
          </div>
          <div
            className={`${classes.content} flex flex-row flex-wrap justify-center items-center`}
          >
            <div
              className={`${classes.re} ${classes.btn} cursor-pointer`}
            >
              重新生成 &nbsp;
            </div>
            <div
              onClick={dialogNewChatBtnClicked}
              className={`${classes.new} ${classes.btn} cursor-pointer`}
            >
              开始新聊天 &nbsp;
            </div>
            <div
              className={`${classes.con} ${classes.btn} cursor-pointer`}
            >
              继续 &nbsp;
            </div>
            <div
              onClick={dialogCloseChatBtnClicked}
              className={`${classes.clo} ${classes.btn} cursor-pointer`}
            >
              关闭聊天 &nbsp;
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

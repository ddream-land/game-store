import { useChatMessages, useSetChatMessage } from '@/character/context/ChatMessagesContextProvider'
import classes from './InputPanel.module.scss'
import { KeyboardEvent, useRef } from 'react'
import { ChatMessage } from '@/libs/ChatMessage'
import { ChatRole } from '@/libs/ChatRole'
import { chat } from '@/api/chatMessage'

let uid = 1

export default function InputPanel() {
  const textareaEl = useRef<HTMLTextAreaElement>(null)
  const setChatMsg = useSetChatMessage()

  async function sendChat(userMsg?: string) {
    if (!userMsg) {
      return
    }

    const newUserMsg: ChatMessage = {
      id: uid++,
      role: ChatRole.User,
      content: userMsg,
      date: new Date(),
    }

    setChatMsg((msgs) => [...msgs, newUserMsg])
    textareaEl.current && (textareaEl.current.value = '')

    const response = await chat(userMsg)

    const newAssistantMsg: ChatMessage = {
      id: uid++,
      role: ChatRole.Assistant,
      content: response,
      date: new Date(),
    }

    setChatMsg((msgs) => [...msgs, newAssistantMsg])
  }

  async function sendClicked() {
    await sendChat(textareaEl.current?.value)
  }

  async function onKeyDownEnter(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== 'Enter') {
      return
    }
    event.preventDefault()

    await sendChat(textareaEl.current?.value)
  }

  return (
    <div className={`${classes.ip} flex flex-row items-center`}>
      <div className={`${classes.op} flex-1 flex flex-row items-center`}>
        <div className={`${classes.btn} ${classes.voice} hidden bg-no-repeat bg-center flex-none`}>
          {' '}
        </div>
        <div className={`${classes.msg} flex-1 flex items-center`}>
          <textarea
            ref={textareaEl}
            onKeyDown={onKeyDownEnter}
            rows={1}
            className={`w-full h-full box-border`}
          ></textarea>
        </div>
        <div
          onClick={sendClicked}
          className={`${classes.btn} ${classes.send} cursor-pointer bg-no-repeat bg-center flex-none`}
        >
          {' '}
        </div>
      </div>
      <div className={`${classes.new} flex-none flex justify-center items-center`}>+</div>
    </div>
  )
}

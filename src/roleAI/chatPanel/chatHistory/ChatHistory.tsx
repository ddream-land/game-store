import { useChatHistory } from '@/roleAI/context/ChatHistoryContextProvider'
import classes from './ChatHistory.module.scss'
import { ChatRole } from '@/core/ChatRole'
import { useEffect, useRef } from 'react'

export default function ChatHistory() {
  const chatMsgs = useChatHistory()
  const chatContainer = useRef<HTMLDivElement>(null)

  function msgRoleClassName(role: ChatRole) {
    switch (role) {
      case ChatRole.User: {
        return classes.user
      }
      case ChatRole.Assistant: {
        return classes.asst
      }
      case ChatRole.System: {
        return classes.sys
      }
      default: {
        return ''
      }
    }
  }

  const elements = chatMsgs
    .filter(function (msg) {
      return msg.role !== ChatRole.System
    })
    .map(function (msg) {
      return (
        <div
          key={msg.id}
          className={`${classes.msg} w-full flex ${
            msg.role === ChatRole.User
              ? 'flex-row-reverse'
              : 'flex-row'
          }`}
        >
          <div
            className={`${
              classes.content
            } ${msgRoleClassName(msg.role)} w-full`}
          >
            {msg.content}
          </div>
        </div>
      )
    })

  useEffect(
    function () {
      const divEl = chatContainer.current
      if (!divEl) {
        return
      }
      divEl.scrollTop = divEl.scrollHeight
    },
    [chatMsgs]
  )

  return (
    <div
      ref={chatContainer}
      className={`${classes.chatHistory} w-full h-full overflow-y-auto scrollbar-override transition-all flex`}
    >
      <div className={`${classes.msgs} w-full mt-auto`}>
        {elements}
      </div>
    </div>
  )
}

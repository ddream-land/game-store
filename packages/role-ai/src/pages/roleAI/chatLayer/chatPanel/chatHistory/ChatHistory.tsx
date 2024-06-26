import { useChatHistory } from '@/pages/roleAI/context/ChatHistoryContextProvider'
import classes from './ChatHistory.module.scss'
import { ChatRole } from '@/core/ChatRole'
import { useEffect, useRef } from 'react'
import UserMsg from './UserMsg/UserMsg'
import AssistantMsg from './AssistantMsg/AssistantMsg'

export default function ChatHistory() {
  const { chatHistory } = useChatHistory()
  const chatContainer = useRef<HTMLDivElement>(null)

  useEffect(
    function () {
      const divEl = chatContainer.current
      if (!divEl) {
        return
      }
      divEl.scrollTop = divEl.scrollHeight
    },
    [chatHistory]
  )

  return (
    <div
      ref={chatContainer}
      className={`${classes.chatHistory} w-full h-full overflow-y-auto scrollbar-override transition-all flex`}
    >
      <div className={`${classes.msgs} w-full`}>
        {chatHistory
          .filter(function (msg) {
            return msg.role !== ChatRole.System
          })
          .map(function (msg) {
            if (msg.role === ChatRole.User) {
              return <UserMsg key={msg.id} msg={msg}></UserMsg>
            } else if (msg.role === ChatRole.Assistant) {
              return <AssistantMsg key={msg.id} msg={msg}></AssistantMsg>
            }
          })}
      </div>
    </div>
  )
}

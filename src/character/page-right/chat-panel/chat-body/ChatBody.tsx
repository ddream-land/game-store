import { useChatMessages } from '@/character/context/ChatMessagesContextProvider'
import classes from './ChatBody.module.scss'
import { ChatMessage } from '@/libs/ChatMessage'
import { ChatRole } from '@/libs/ChatRole'

export default function ChatBody() {
  const chatMsgs = useChatMessages()

  function roleClass(role: ChatRole) {
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

  const elements = chatMsgs.map(function (msg) {
    return (
      <div
        key={msg.id}
        className={`${classes.msg} w-full flex ${
          msg.role === ChatRole.User ? 'flex-row-reverse' : 'flex-row'
        }`}
      >
        <div className={`${classes.content} ${roleClass(msg.role)} w-full`}>{msg.content}</div>
      </div>
    )
  })

  return (
    <div className={`${classes.cb} w-full h-full`}>
      <div className={`${classes.msgs} w-full`}>{elements}</div>
    </div>
  )
}

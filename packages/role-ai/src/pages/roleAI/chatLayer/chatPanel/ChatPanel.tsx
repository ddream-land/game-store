import classes from './ChatPanel.module.scss'
import { useEffect, useState } from 'react'
import { ChatRole } from '@/core/ChatRole'
import { msgMacrosReplace } from '@/core/promptMessageGenerator'
import InputArea from './inputArea/InputArea'
import ChatHistory from './chatHistory/ChatHistory'
import { chatHistory } from '@/api/chat/chat'
import { NuwaChatMessage, nuwaChatMessage } from '@/core/ChatMessage'
import { useAppSelector } from '@/hooks/useAppSelector'
import { currentChatCharacterInfoSelector } from '@/store/slices/characterSlice'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { setChatHistory } from '@/store/slices/chatSlice'

let controller: AbortController | undefined = undefined

export default function ChatPanel() {
  const [visible, setVisible] = useState(false)
  const chatCharacter = useAppSelector(currentChatCharacterInfoSelector)
  const dispatch = useAppDispatch()

  useEffect(
    function () {
      controller?.abort()
      setVisible(false)
      dispatch(setChatHistory([]))
      if (!chatCharacter) {
        return
      }

      const firstMsg = msgMacrosReplace(chatCharacter.card.data.first_mes, chatCharacter.card)
      const nuwaFirstMsg: NuwaChatMessage = nuwaChatMessage(
        firstMsg,
        chatCharacter.id,
        0,
        ChatRole.Assistant
      )

      ;(async function () {
        controller = new AbortController()
        const histories = await chatHistory(chatCharacter.id, controller.signal)
        if (histories && histories.length) {
          dispatch(setChatHistory([nuwaFirstMsg, ...histories]))
        } else {
          dispatch(setChatHistory([nuwaFirstMsg]))
        }

        setVisible(true)
      })()
    },
    [chatCharacter]
  )

  return (
    <div
      className={`${classes.chatPanel} ${
        visible ? '' : 'hidden'
      } w-full h-full flex flex-col pointer-events-auto`}
    >
      <div className="flex-1 min-h-0">{visible && <ChatHistory></ChatHistory>}</div>
      <div className="flex-none" style={{ marginTop: '18px' }}>
        {visible && <InputArea></InputArea>}
      </div>
    </div>
  )
}

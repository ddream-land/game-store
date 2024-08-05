import { useEffect, useState } from 'react'
import { ChatRole } from '@/core/ChatRole'
import { useAppSelector } from '@/hooks/useAppSelector'

export function useChatMessageState() {
  const chatHistory = useAppSelector((state) => state.chat.chatHistory)

  const [regenerateEnable, setRegenerateEnable] = useState(false)
  const [continueEnable, setContinueEnable] = useState(false)
  const [newChatEnable, setNewChatEnable] = useState(true)

  useEffect(
    function () {
      setRegenerateEnable(false)
      setContinueEnable(false)

      if (!chatHistory || chatHistory.length <= 1) {
        // first msg can not continue or re-generate
        return
      }

      const latestMsg = chatHistory[chatHistory.length - 1]
      if (latestMsg.role === ChatRole.Assistant) {
        setRegenerateEnable(true)
        setContinueEnable(true)
      }
    },
    [chatHistory]
  )

  return {
    regenerateEnable,
    continueEnable,
    newChatEnable,
  }
}

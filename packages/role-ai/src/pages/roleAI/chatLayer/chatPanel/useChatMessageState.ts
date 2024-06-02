import { useEffect, useState } from 'react'
import { ChatRole } from '@/core/ChatRole'
import { useChatHistory } from '../../context/ChatHistoryContextProvider'

export function useChatMessageState() {
  const { chatHistory } = useChatHistory()

  const [regenerateEnable, setRegenerateEnable] = useState(false)
  const [continueEnable, setContinueEnable] = useState(false)

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
  }
}

import { AIChatMessage, ChatMessage } from '@/core/ChatMessage'
import { ReactNode, createContext, useContext, useMemo, useState } from 'react'

const ChatHistoryContext = createContext<ChatMessage[]>([])
const SetChatHistoryContext = createContext<React.Dispatch<React.SetStateAction<ChatMessage[]>>>(
  function () {}
)

export function ChatHistoryContextProvider({ children }: { children: ReactNode }) {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])

  return (
    <ChatHistoryContext.Provider value={chatHistory}>
      <SetChatHistoryContext.Provider value={setChatHistory}>
        {children}
      </SetChatHistoryContext.Provider>
    </ChatHistoryContext.Provider>
  )
}

export function useChatHistory() {
  const chatHistory = useContext(ChatHistoryContext)

  const last9Msg: AIChatMessage[] = useMemo(
    function () {
      return chatHistory.slice(Math.max(chatHistory.length - 9, 0)).map(function (x) {
        return {
          role: x.role,
          content: x.content,
        }
      })
    },
    [chatHistory]
  )

  return { chatHistory, last9Msg }
}

export function useSetChatHistory() {
  return useContext(SetChatHistoryContext)
}

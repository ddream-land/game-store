import { AIChatMessage, NuwaChatMessage } from '@/core/ChatMessage'
import { ReactNode, createContext, useContext, useMemo, useState } from 'react'

const ChatHistoryContext = createContext<NuwaChatMessage[]>([])
const SetChatHistoryContext = createContext<
  React.Dispatch<React.SetStateAction<NuwaChatMessage[]>>
>(function () {})

export function ChatHistoryContextProvider({ children }: { children: ReactNode }) {
  const [chatHistory, setChatHistory] = useState<NuwaChatMessage[]>([])

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

  return { chatHistory }
}

export function useSetChatHistory() {
  return useContext(SetChatHistoryContext)
}

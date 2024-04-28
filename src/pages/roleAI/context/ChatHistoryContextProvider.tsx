import { ChatMessage } from '@/core/ChatMessage'
import { createContext, useContext, useState } from 'react'

const ChatHistoryContext = createContext<ChatMessage[]>([])
const SetChatHistoryContext = createContext<
  React.Dispatch<React.SetStateAction<ChatMessage[]>>
>(function () {})

export function ChatHistoryContextProvider({
  children,
}: {
  children: JSX.Element
}) {
  const [chatHistory, setChatHistory] = useState<
    ChatMessage[]
  >([])

  return (
    <ChatHistoryContext.Provider value={chatHistory}>
      <SetChatHistoryContext.Provider
        value={setChatHistory}
      >
        {children}
      </SetChatHistoryContext.Provider>
    </ChatHistoryContext.Provider>
  )
}

export function useChatHistory() {
  return useContext(ChatHistoryContext)
}

export function useSetChatHistory() {
  return useContext(SetChatHistoryContext)
}

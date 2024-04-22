import { ChatMessage } from '@/libs/ChatMessage'
import { createContext, useContext, useEffect, useState } from 'react'

const ChatMessagesContext = createContext<ChatMessage[]>([])
const SetChatMessageContext = createContext<React.Dispatch<React.SetStateAction<ChatMessage[]>>>(
  function () {}
)

export function ChatMessagesContextProvider({ children }: { children: JSX.Element }) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])

  return (
    <ChatMessagesContext.Provider value={chatMessages}>
      <SetChatMessageContext.Provider value={setChatMessages}>
        {children}
      </SetChatMessageContext.Provider>
    </ChatMessagesContext.Provider>
  )
}

export function useChatMessages() {
  return useContext(ChatMessagesContext)
}

export function useSetChatMessage() {
  return useContext(SetChatMessageContext)
}

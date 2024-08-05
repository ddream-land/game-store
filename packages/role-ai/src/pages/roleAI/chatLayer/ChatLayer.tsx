import ChatLayout from './chatLayout/ChatLayout'
import ChatPanel from './chatPanel/ChatPanel'

export default function ChatLayer() {
  return <ChatLayout chatArea={<ChatPanel></ChatPanel>}></ChatLayout>
}

import classes from './ChatPanel.module.scss'
import InputPanel from './input-panel/InputPanel'
import ChatBody from './chat-body/ChatBody'

export default function ChatPanel() {
  return (
    <div className={`${classes.cp} w-full h-full flex flex-col pointer-events-auto`}>
      <div className="flex-1">
        <ChatBody></ChatBody>
      </div>
      <div className="flex-none">
        <InputPanel></InputPanel>
      </div>
    </div>
  )
}

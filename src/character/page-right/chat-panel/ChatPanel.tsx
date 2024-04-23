import classes from './ChatPanel.module.scss'
import InputPanel from './input-panel/InputPanel'
import ChatBody from './chat-body/ChatBody'
import { useCurrentDigitalLifeId } from '@/character/context/CurrentDigitalLifeIdContextProvider'
import { useEffect, useState } from 'react'
import { useSetChatMessage } from '@/character/context/ChatMessagesContextProvider'

export default function ChatPanel() {
  const [visible, setVisible] = useState(false)
  const currentDigitalLifeId = useCurrentDigitalLifeId()
  const setChatMsg = useSetChatMessage()

  function clearChatMsgs() {
    setChatMsg([])
  }

  useEffect(
    function () {
      clearChatMsgs()
      if (currentDigitalLifeId === undefined) {
        setVisible(false)
        return
      }

      setVisible(true)
    },
    [currentDigitalLifeId]
  )

  return (
    <div
      className={`${classes.cp} ${
        visible ? '' : 'hidden'
      } w-full h-full flex flex-col pointer-events-auto`}
    >
      <div className="flex-1 min-h-0">
        <ChatBody></ChatBody>
      </div>
      <div
        className="flex-none"
        style={{ marginTop: '18px' }}
      >
        <InputPanel></InputPanel>
      </div>
    </div>
  )
}

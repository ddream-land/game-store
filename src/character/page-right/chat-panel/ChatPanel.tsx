import classes from './ChatPanel.module.scss'
import InputPanel from './input-panel/InputPanel'
import ChatBody from './chat-body/ChatBody'
import { useCurrentDigitalLifeId } from '@/character/context/CurrentDigitalLifeIdContextProvider'
import { useEffect, useState } from 'react'
import { useSetChatMessage } from '@/character/context/ChatMessagesContextProvider'
import { useDigitalLifeDetailList } from '@/character/context/DigitalLifeDetailListContextProvider'
import { ChatRole } from '@/libs/ChatRole'
import { msgMacrosReplace } from '@/libs/promptMessageGenerator'

export default function ChatPanel() {
  const [visible, setVisible] = useState(false)
  const currentDigitalLifeId = useCurrentDigitalLifeId()
  const digitalLifeDetailList = useDigitalLifeDetailList()
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

      const lifeDetail = digitalLifeDetailList.find(
        (x) => x.id === currentDigitalLifeId
      )

      if (!lifeDetail) {
        throw new Error(`Runtime error.`)
      }

      setChatMsg([
        {
          role: ChatRole.Assistant,
          content: msgMacrosReplace(
            lifeDetail.card.data.first_mes,
            lifeDetail.card
          ),
          id: Date.now(),
          date: new Date(),
        },
      ])

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
        {visible && <ChatBody></ChatBody>}
      </div>
      <div
        className="flex-none"
        style={{ marginTop: '18px' }}
      >
        {visible && <InputPanel></InputPanel>}
      </div>
    </div>
  )
}

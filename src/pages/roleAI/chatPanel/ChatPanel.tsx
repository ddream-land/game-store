import classes from './ChatPanel.module.scss'
import { useCurrentCharacterCardInfoId } from '@/pages/roleAI/context/CurrentCharacterCardInfoIdContextProvider'
import { useEffect, useState } from 'react'
import { useSetChatHistory } from '@/pages/roleAI/context/ChatHistoryContextProvider'
import { useCharacterCardInfoList } from '@/pages/roleAI/context/CharacterCardInfoListContextProvider'
import { ChatRole } from '@/core/ChatRole'
import { msgMacrosReplace } from '@/core/promptMessageGenerator'
import InputArea from './inputArea/InputArea'
import ChatHistory from './chatHistory/ChatHistory'

export default function ChatPanel() {
  const [visible, setVisible] = useState(false)
  const currentDigitalLifeId = useCurrentCharacterCardInfoId()
  const digitalLifeDetailList = useCharacterCardInfoList()
  const setChatMsg = useSetChatHistory()

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
      className={`${classes.chatPanel} ${
        visible ? '' : 'hidden'
      } w-full h-full flex flex-col pointer-events-auto`}
    >
      <div className="flex-1 min-h-0">
        {visible && <ChatHistory></ChatHistory>}
      </div>
      <div
        className="flex-none"
        style={{ marginTop: '18px' }}
      >
        {visible && <InputArea></InputArea>}
      </div>
    </div>
  )
}

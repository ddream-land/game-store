import classes from './ChatPanel.module.scss'
import { useCurrentCharacterCardInfoId } from '@/pages/roleAI/context/CurrentCharacterCardInfoIdContextProvider'
import { useEffect, useState } from 'react'
import { useSetChatHistory } from '@/pages/roleAI/context/ChatHistoryContextProvider'
import { useCharacterCardInfoList } from '@/pages/roleAI/context/CharacterCardInfoListContextProvider'
import { ChatRole } from '@/core/ChatRole'
import { msgMacrosReplace } from '@/core/promptMessageGenerator'
import InputArea from './inputArea/InputArea'
import ChatHistory from './chatHistory/ChatHistory'
import { useSetTTSText } from '../context/TTSContextProvider'
import { chatHistory } from '@/api/chat/chat'
import { NuwaChatMessage, nuwaChatMessage } from '@/core/ChatMessage'

export default function ChatPanel() {
  const [visible, setVisible] = useState(false)
  const currentDigitalLifeId = useCurrentCharacterCardInfoId()
  const characterCardInfoList = useCharacterCardInfoList()
  const setChatMsg = useSetChatHistory()

  useEffect(
    function () {
      setVisible(false)
      setChatMsg([])
      if (currentDigitalLifeId === undefined) {
        return
      }

      const characterCard = characterCardInfoList.find((x) => x.id === currentDigitalLifeId)
      if (!characterCard) {
        throw new Error(`Runtime error.`)
      }

      const firstMsg = msgMacrosReplace(characterCard.card.data.first_mes, characterCard.card)
      const nuwaFirstMsg: NuwaChatMessage = nuwaChatMessage(
        firstMsg,
        characterCard.id,
        0,
        ChatRole.Assistant
      )

      ;(async function () {
        const histories = await chatHistory(characterCard.id)
        if (histories && histories.length) {
          setChatMsg([nuwaFirstMsg, ...histories])
        } else {
          setChatMsg([nuwaFirstMsg])
        }

        setVisible(true)
      })()
    },
    [currentDigitalLifeId]
  )

  return (
    <div
      className={`${classes.chatPanel} ${
        visible ? '' : 'hidden'
      } w-full h-full flex flex-col pointer-events-auto`}
    >
      <div className="flex-1 min-h-0">{visible && <ChatHistory></ChatHistory>}</div>
      <div className="flex-none" style={{ marginTop: '18px' }}>
        {visible && <InputArea></InputArea>}
      </div>
    </div>
  )
}

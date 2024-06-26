import classes from './ChatPanel.module.scss'
import { useCurrentChatCharacterId } from '@/pages/roleAI/context/CurrentChatCharacterIdContextProvider'
import { useEffect, useState } from 'react'
import { useSetChatHistory } from '@/pages/roleAI/context/ChatHistoryContextProvider'
import { useCharacterInfoList } from '@/pages/roleAI/context/CharacterInfoListContextProvider'
import { ChatRole } from '@/core/ChatRole'
import { msgMacrosReplace } from '@/core/promptMessageGenerator'
import InputArea from './inputArea/InputArea'
import ChatHistory from './chatHistory/ChatHistory'
import { chatHistory } from '@/api/chat/chat'
import { NuwaChatMessage, nuwaChatMessage } from '@/core/ChatMessage'

export default function ChatPanel() {
  const [visible, setVisible] = useState(false)
  const currentChatCharacterId = useCurrentChatCharacterId()
  const characterCardInfoList = useCharacterInfoList()
  const setChatMsg = useSetChatHistory()

  useEffect(
    function () {
      setVisible(false)
      setChatMsg([])
      if (currentChatCharacterId === undefined) {
        return
      }

      const characterCard = characterCardInfoList.find((x) => x.id === currentChatCharacterId)
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
    [currentChatCharacterId]
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

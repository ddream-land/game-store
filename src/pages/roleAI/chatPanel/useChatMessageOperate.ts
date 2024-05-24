import { MessageSummaryState, NuwaChatMessage, nuwaChatMessage } from '@/core/ChatMessage'
import { useCurrentCharacterCardInfo } from '../context/CurrentCharacterCardInfoContextProvider'
import { ChatRole } from '@/core/ChatRole'
import { useChatHistory, useSetChatHistory } from '../context/ChatHistoryContextProvider'
import { ChatCompletionReqDto } from '@/api/chat/reqDto'
import { chatCompletionStream } from '@/api/chat/chatCompletion'
import { msgMacrosReplace } from '@/core/promptMessageGenerator'
import { useState } from 'react'

export function useChatMessageOperate() {
  const { charaCardInfo } = useCurrentCharacterCardInfo()
  const setChatMsg = useSetChatHistory()
  const { chatHistory } = useChatHistory()
  const [isChatMsgResponsing, setIsChatMsgResponsing] = useState(false)

  function isNewChat() {
    if (chatHistory.length <= 0) {
      return true
    } else {
      const firstMsg = chatHistory[0]
      if (firstMsg.role === ChatRole.Assistant) {
        return true
      }
    }
    return false
  }

  async function sendChatMsg(
    msg: string,
    option?: {
      onOpen?: (response: Response) => Promise<void>
      onClose?: () => void
      onEnd?: () => void
      onError?: (err: any) => number | null | undefined | void
    }
  ) {
    if (!charaCardInfo) {
      return
    }

    const newUserMsg: NuwaChatMessage = nuwaChatMessage(msg, charaCardInfo.id, ChatRole.User)
    setChatMsg((msgs) => [...msgs, newUserMsg])

    const newAssistantMsg: NuwaChatMessage = nuwaChatMessage(
      '',
      charaCardInfo.id,
      ChatRole.Assistant
    )
    setChatMsg((msgs) => [...msgs, newAssistantMsg])

    const reqDto: ChatCompletionReqDto = {
      content: msg,
      role_id: charaCardInfo.id,
    }
    if (isNewChat()) {
      reqDto.new_conversion = true
    }

    try {
      await chatCompletionStream(reqDto, {
        onMsgId(msgId: string, replyMsgId: string, msgTime: number, replyMsgTime: number) {
          setChatMsg(function (msgs) {
            return msgs.map(function (m) {
              if (m.id === newUserMsg.id) {
                newUserMsg.id = msgId
                newUserMsg.date = new Date(msgTime)
                return {
                  ...m,
                  ...newUserMsg,
                }
              } else if (m.id === newAssistantMsg.id) {
                newAssistantMsg.id = replyMsgId
                newAssistantMsg.date = new Date(replyMsgTime)
                return {
                  ...m,
                  ...newAssistantMsg,
                }
              } else {
                return m
              }
            })
          })
        },
        onOutputTokens(tokens) {
          setChatMsg(function (msgs) {
            return msgs.map(function (m) {
              return m.id === newAssistantMsg.id
                ? {
                    ...m,
                    tokens: tokens,
                  }
                : m
            })
          })
        },
        async onOpen(response) {
          setIsChatMsgResponsing(true)
          option && option.onOpen && (await option.onOpen(response))
        },
        onEnd() {
          setIsChatMsgResponsing(false)
          option && option.onEnd && option.onEnd()
        },
        onMessage(msg) {
          setChatMsg(function (msgs) {
            return msgs.map(function (m) {
              return m.id === newAssistantMsg.id
                ? {
                    ...m,
                    content: m.content + msg,
                  }
                : m
            })
          })
        },
        onClose() {
          setIsChatMsgResponsing(false)
          option && option.onClose && option.onClose()
        },
        onError(err) {
          setIsChatMsgResponsing(false)
          console.log('error', err)
          option && option.onError && option.onError(err)
        },
      })
    } catch (err) {
      setIsChatMsgResponsing(false)
      console.log('error', err)
      option && option.onError && option.onError(err)
    }
  }

  async function newChat() {
    if (!charaCardInfo) {
      setChatMsg([])
      return
    }

    const firstMsg = msgMacrosReplace(charaCardInfo.card.data.first_mes, charaCardInfo.card)
    const nuwaFirstMsg: NuwaChatMessage = {
      role: ChatRole.Assistant,
      content: firstMsg,
      id: Date.now().toString(),
      date: new Date(),

      summaryState: MessageSummaryState.NotSummary,
      roleId: charaCardInfo.id,
    }

    setChatMsg([nuwaFirstMsg])
  }

  async function clearChatMsg() {
    setChatMsg([])
  }

  return {
    clearChatMsg,
    sendChatMsg,
    newChat,
    isChatMsgResponsing,
  }
}

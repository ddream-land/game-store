import { MessageSummaryState, NuwaChatMessage, nuwaChatMessage } from '@/core/ChatMessage'
import { ChatRole } from '@/core/ChatRole'
import { ChatCompletionReqDto } from '@/api/chat/reqDto'
import { chatCompletionStream } from '@/api/chat/chatCompletion'
import { msgMacrosReplace } from '@/core/promptMessageGenerator'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { newChat as newChatReq } from '@/api/chat/chat'
import toast from 'react-hot-toast'
import { useSetCurrentChatCharacterId } from '../../context/CurrentChatCharacterIdContextProvider'
import { useCurrentChatCharacterInfo } from '../../context/CurrentChatCharacterInfoContextProvider'
import { useChatHistory, useSetChatHistory } from '../../context/ChatHistoryContextProvider'

export function useChatMessageOperate() {
  const navigate = useNavigate()
  const setCurrentChatCharaId = useSetCurrentChatCharacterId()
  const { chatCharaInfo } = useCurrentChatCharacterInfo()
  const setChatMsg = useSetChatHistory()
  const { chatHistory } = useChatHistory()
  const [isChatMsgResponsing, setIsChatMsgResponsing] = useState(false)

  async function sendChatMsg(
    msg: string,
    option?: {
      onOpen?: (response: Response) => Promise<void>
      onClose?: () => void
      onEnd?: () => void
      onError?: (err: any) => number | null | undefined | void
    }
  ) {
    if (!chatCharaInfo) {
      return
    }

    setIsChatMsgResponsing(true)

    const reqDto: ChatCompletionReqDto = {
      content: msg,
      role_id: chatCharaInfo.id,
    }

    if (chatHistory && chatHistory.length > 1) {
      // first msg
      const latestMsg = chatHistory[chatHistory.length - 1]
      if (latestMsg.role === ChatRole.Assistant) {
        if (latestMsg.contents && latestMsg.contents.length > 0) {
          reqDto.update_msg = {
            msg_id: latestMsg.id,
            content: latestMsg.content,
            tokens: latestMsg.tokens,
          }
          setChatMsg(function (msgs) {
            return msgs.map(function (m) {
              if (m.id === latestMsg.id) {
                const contents = undefined
                return {
                  ...m,
                  contents,
                }
              } else {
                return m
              }
            })
          })
        }
      }
    }

    const newUserMsg: NuwaChatMessage = nuwaChatMessage(msg, chatCharaInfo.id, 0, ChatRole.User)
    setChatMsg((msgs) => [...msgs, newUserMsg])

    const newAssistantMsg: NuwaChatMessage = nuwaChatMessage(
      '',
      chatCharaInfo.id,
      0,
      ChatRole.Assistant
    )
    setChatMsg((msgs) => [...msgs, newAssistantMsg])

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
        onMessage(index, msg) {
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

  async function continueChatMsg(option?: {
    onOpen?: (response: Response) => Promise<void>
    onClose?: () => void
    onEnd?: () => void
    onError?: (err: any) => number | null | undefined | void
  }) {
    if (!chatCharaInfo) {
      return
    }
    if (!chatHistory || chatHistory.length <= 1) {
      // first msg can not continue
      return
    }

    const latestMsg = chatHistory[chatHistory.length - 1]
    if (latestMsg.role !== ChatRole.Assistant) {
      return
    }

    setIsChatMsgResponsing(true)

    const latestMsgId = latestMsg.id

    const reqDto: ChatCompletionReqDto = {
      role_id: chatCharaInfo.id,
      continue_msg: {
        msg_id: latestMsgId,
      },
    }

    if (latestMsg.contents && latestMsg.contents.length > 0) {
      reqDto.update_msg = {
        msg_id: latestMsgId,
        content: latestMsg.content,
        tokens: latestMsg.tokens,
      }
      setChatMsg(function (msgs) {
        return msgs.map(function (m) {
          if (m.id === latestMsgId) {
            const contents = undefined
            return {
              ...m,
              contents,
            }
          } else {
            return m
          }
        })
      })
    }

    try {
      await chatCompletionStream(reqDto, {
        onMsgId(msgId: string, replyMsgId: string, msgTime: number, replyMsgTime: number) {},
        onOutputTokens(tokens) {
          setChatMsg(function (msgs) {
            return msgs.map(function (m) {
              return m.id === latestMsgId
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
        onMessage(index, msg) {
          setChatMsg(function (msgs) {
            return msgs.map(function (m) {
              return m.id === latestMsgId
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

  async function regenerateChatMsg(option?: {
    onOpen?: (response: Response) => Promise<void>
    onClose?: () => void
    onEnd?: () => void
    onError?: (err: any) => number | null | undefined | void
  }) {
    if (!chatCharaInfo) {
      return
    }
    if (!chatHistory || chatHistory.length <= 1) {
      // first msg can not regenerate
      return
    }

    const latestMsg = chatHistory[chatHistory.length - 1]
    if (latestMsg.role !== ChatRole.Assistant) {
      return
    }

    setIsChatMsgResponsing(true)

    const latestMsgId = latestMsg.id

    const reqDto: ChatCompletionReqDto = {
      role_id: chatCharaInfo.id,
      renew_msg: {
        msg_id: latestMsgId,
      },
    }

    setChatMsg(
      chatHistory.map(function (msg) {
        if (msg.id === latestMsgId) {
          // if no contents, push old content to contents list
          const contents = latestMsg.contents
            ? latestMsg.contents
            : [
                {
                  content: msg.content,
                  tokens: msg.tokens ?? 0,
                },
              ]
          return {
            ...msg,
            contents: contents,
            // clear content
            content: '',
          }
        } else {
          return msg
        }
      })
    )

    function pushRegenerateMsgToContentsList() {
      setChatMsg(function (msgs) {
        return msgs.map(function (m) {
          if (m.id === latestMsgId) {
            const content = m.content
            const contents = [...(m.contents ?? [])]
            if (!(m.contents ?? []).some((x) => x.content === content)) {
              // AI reply content not duplicated
              contents.push({
                content: m.content,
                tokens: m.tokens ?? 0,
              })
            }
            return {
              ...m,
              contents,
            }
          } else {
            return m
          }
        })
      })
    }

    try {
      await chatCompletionStream(reqDto, {
        onMsgId(msgId: string, replyMsgId: string, msgTime: number, replyMsgTime: number) {},
        onOutputTokens(tokens) {
          setChatMsg(function (msgs) {
            return msgs.map(function (m) {
              return m.id === latestMsgId
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
          // Only end signal can push list
          pushRegenerateMsgToContentsList()
          setIsChatMsgResponsing(false)
          option && option.onEnd && option.onEnd()
        },
        onMessage(index, msg) {
          setChatMsg(function (msgs) {
            return msgs.map(function (m) {
              return m.id === latestMsgId
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

  function closeChat() {
    clearChatMsg()
    setCurrentChatCharaId(undefined)
    navigate(`/`)
  }

  async function newChat() {
    if (!chatCharaInfo) {
      setChatMsg([])
      return
    }

    const res = await newChatReq(chatCharaInfo.id)
    if (res.code !== 0) {
      toast.error(res.msg ?? 'Start new chat error.')
      return
    }

    const firstMsg = msgMacrosReplace(chatCharaInfo.card.data.first_mes, chatCharaInfo.card)
    const nuwaFirstMsg: NuwaChatMessage = nuwaChatMessage(
      firstMsg,
      chatCharaInfo.id,
      0,
      ChatRole.Assistant
    )

    setChatMsg([nuwaFirstMsg])
  }

  async function clearChatMsg() {
    setChatMsg([])
  }

  return {
    clearChatMsg,
    sendChatMsg,
    closeChat,
    newChat,
    continueChatMsg,
    regenerateChatMsg,
    isChatMsgResponsing,
  }
}

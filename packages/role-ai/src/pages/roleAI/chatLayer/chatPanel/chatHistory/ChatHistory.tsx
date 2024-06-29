import {
  useChatHistory,
  useSetChatHistory,
} from '@/pages/roleAI/context/ChatHistoryContextProvider'
import classes from './ChatHistory.module.scss'
import { ChatRole } from '@/core/ChatRole'
import { MouseEvent, useEffect, useRef, useState } from 'react'
import UserMsg from './UserMsg/UserMsg'
import AssistantMsg from './AssistantMsg/AssistantMsg'
import { NuwaChatMessage } from '@/core/ChatMessage'
import { delHistory } from '@/api/chat/chat'

export default function ChatHistory() {
  const { chatHistory } = useChatHistory()
  const setChatHistory = useSetChatHistory()
  const chatContainer = useRef<HTMLDivElement>(null)

  const [currentOpenMenuId, setCurrentOpenMenuId] = useState<string | undefined>()
  const [currentEditingId, setCurrentEditingId] = useState<string | undefined>()

  useEffect(
    function () {
      const divEl = chatContainer.current
      if (!divEl) {
        return
      }
      divEl.scrollTop = divEl.scrollHeight
    },
    [chatHistory]
  )

  function menuClicked(e: MouseEvent, msg: NuwaChatMessage) {
    e.stopPropagation()
    setCurrentOpenMenuId(currentOpenMenuId === msg.id ? undefined : msg.id)
  }

  function closeMenu() {
    setCurrentOpenMenuId(undefined)
  }

  function editClicked(e: MouseEvent, msg: NuwaChatMessage) {
    e.stopPropagation()

    closeMenu()
  }

  async function delClicked(e: MouseEvent, msg: NuwaChatMessage) {
    e.stopPropagation()

    closeMenu()

    let humanMsgId = ''
    let aiMsgId = ''

    if (msg.role === ChatRole.User) {
      humanMsgId = msg.id
      const index = chatHistory.findIndex((x) => x.id === humanMsgId)
      aiMsgId = chatHistory[index + 1].id
    } else if (msg.role === ChatRole.Assistant) {
      aiMsgId = msg.id
      const index = chatHistory.findIndex((x) => x.id === aiMsgId)
      humanMsgId = chatHistory[index - 1].id
    }

    if (humanMsgId && aiMsgId) {
      const res = await delHistory(humanMsgId, aiMsgId)
      if (res.code === 0) {
        setChatHistory(chatHistory.filter((x) => x.id !== humanMsgId && x.id !== aiMsgId))
      }
    }
  }

  useEffect(function () {
    window.addEventListener('click', closeMenu)

    return function () {
      window.removeEventListener('click', closeMenu)
    }
  }, [])

  return (
    <div
      ref={chatContainer}
      className={`${classes.chatHistory} w-full h-full overflow-y-auto scrollbar-override transition-all flex`}
    >
      <div className={`${classes.msgs} w-full`}>
        <div className=" mt-[180px] pb-[30px]">
          {chatHistory
            .filter(function (msg) {
              return msg.role !== ChatRole.System
            })
            .map(function (msg, index) {
              if (msg.role === ChatRole.User) {
                return (
                  <UserMsg
                    key={msg.id}
                    msg={msg}
                    menuVisible={currentOpenMenuId === msg.id}
                    onMenuBtnClicked={(e) => {
                      menuClicked(e, msg)
                    }}
                    onEditClicked={(e) => {
                      editClicked(e, msg)
                    }}
                    onDelClicked={(e) => {
                      delClicked(e, msg)
                    }}
                  ></UserMsg>
                )
              } else if (msg.role === ChatRole.Assistant) {
                return (
                  <AssistantMsg
                    key={msg.id}
                    msg={msg}
                    menuVisible={currentOpenMenuId === msg.id}
                    showMenuBtn={index !== 0}
                    onMenuBtnClicked={(e) => {
                      menuClicked(e, msg)
                    }}
                    onEditClicked={(e) => {
                      editClicked(e, msg)
                    }}
                    onDelClicked={(e) => {
                      delClicked(e, msg)
                    }}
                  ></AssistantMsg>
                )
              }
            })}
        </div>
      </div>
    </div>
  )
}

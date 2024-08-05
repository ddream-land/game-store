import classes from './ChatHistory.module.scss'
import { ChatRole } from '@/core/ChatRole'
import { MouseEvent, useEffect, useRef, useState } from 'react'
import type { PressEvent } from '@react-types/shared'
import UserMsg from './UserMsg/UserMsg'
import AssistantMsg from './AssistantMsg/AssistantMsg'
import { NuwaChatMessage } from '@/core/ChatMessage'
import { delHistory, updateChatMsg } from '@/api/chat/chat'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { isString } from '@/libs/isTypes'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { playTTSText } from '@/store/slices/ttsSlice'
import { useAppSelector } from '@/hooks/useAppSelector'
import { changeMsg, regenerateChatMsg, setChatHistory } from '@/store/slices/chatSlice'
import { currentChatCharacterInfoSelector } from '@/store/slices/characterSlice'
import { useTTSScheduler } from '@/pages/roleAI/context/TTSSchedulerProvider'

export default function ChatHistory() {
  const chatHistory = useAppSelector((state) => state.chat.chatHistory)
  const { t: tCommon } = useTranslation('common')
  const chatContainer = useRef<HTMLDivElement>(null)
  const dispatch = useAppDispatch()
  // const isChatMsgResponsing = useAppSelector((state) => state.chat.isChatMsgResponsing)
  const chatCharacter = useAppSelector(currentChatCharacterInfoSelector)
  // const autoPlay = chatCharacter?.card.data.extensions.nuwa_voice?.autoPlay ?? false
  const currentTTSPlayingMsgId = useAppSelector((state) => state.tts.ttsTextInfo?.id)
  const { getPlayState, pauseCurrent, resumeCurrent } = useTTSScheduler()
  // const isOpen

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

  // useEffect(
  //   function () {
  //     if (isChatMsgResponsing || chatHistory.length <= 0) {
  //       return
  //     }
  //     const lastMsg = chatHistory[chatHistory.length - 1]
  //     if (lastMsg.role === ChatRole.Assistant && autoPlay) {
  //       dispatch(playTTSText({ id: lastMsg.id, text: lastMsg.content, publishId: '' }))
  //     }
  //   },
  //   [chatHistory, isChatMsgResponsing]
  // )

  function editClicked(e: PressEvent, msg: NuwaChatMessage) {
    setCurrentEditingId(msg.id)
  }

  async function delClicked(e: PressEvent, msg: NuwaChatMessage) {
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
      const id = toast.loading(tCommon('loading'))
      try {
        const res = await delHistory(humanMsgId, aiMsgId)

        toast.remove(id)

        if (res.code === 0) {
          dispatch(
            setChatHistory(chatHistory.filter((x) => x.id !== humanMsgId && x.id !== aiMsgId))
          )
        } else {
          throw new Error(res.msg ?? '')
        }
      } catch (err: any) {
        const msg = err?.message
        toast.error(isString(msg) ? msg : tCommon('opFailed'), {
          id: id,
        })
      }
    }
  }

  async function saveEditClicked(e: MouseEvent, msg: NuwaChatMessage, newContent: string) {
    const id = toast.loading(tCommon('loading'))

    try {
      const res = await updateChatMsg(msg.id, newContent)

      toast.remove(id)

      setCurrentEditingId(undefined)
      if (res.code === 0) {
        dispatch(
          changeMsg({
            id: msg.id,
            msg: {
              ...msg,
              content: newContent,
              contents: undefined,
            },
          })
        )
      } else {
        throw new Error(res.msg)
      }
    } catch (err: any) {
      const msg = err?.message
      toast.error(isString(msg) ? msg : tCommon('opFailed'), {
        id: id,
      })
    }
  }

  async function playTTSClicked(e: MouseEvent, msg: NuwaChatMessage) {
    let publishId = chatCharacter?.card.data.extensions.nuwa_voice?.publish_id
    if (!publishId) {
      const list = chatCharacter?.card.data.extensions.nuwa_voices?.list
      if (list && list.length > 0) {
        publishId = list[0].publish_id
      }
    }

    dispatch(
      playTTSText({
        id: msg.id,
        text: msg.content,
        publishId: publishId ?? '',
      })
    )
  }

  async function pauseTTSClicked(e: MouseEvent, msg: NuwaChatMessage) {
    pauseCurrent()
    // dispatch(playTTSText({ id: msg.id, text: msg.content, publishId: '' }))
  }

  function playVoiceBtnVisible() {
    const nuwaVoice = chatCharacter?.card.data.extensions.nuwa_voice
    const pulishId = nuwaVoice?.publish_id
    const nuwaVoiceDisable = !!nuwaVoice?.disable

    const q = pulishId && !nuwaVoiceDisable

    const nuwaVoices = chatCharacter?.card.data.extensions.nuwa_voices
    const nuwaVoicesDisable = !!nuwaVoices?.disable

    const x = !nuwaVoicesDisable && (nuwaVoices?.list ?? []).length > 0

    return q || x
  }

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
                    editMode={currentEditingId === msg.id}
                    menuPopoverPlacement={index === chatHistory.length - 1 ? 'top-end' : undefined}
                    onEditClicked={(e) => {
                      editClicked(e, msg)
                    }}
                    onDelClicked={(e) => {
                      delClicked(e, msg)
                    }}
                    onEditCancelClicked={(e) => {
                      setCurrentEditingId(undefined)
                    }}
                    onEditSaveClicked={(e, content) => {
                      saveEditClicked(e, msg, content)
                    }}
                    // onMouseLeave={(e) => {
                    //   closeMenu()
                    // }}
                  ></UserMsg>
                )
              } else if (msg.role === ChatRole.Assistant) {
                return (
                  <AssistantMsg
                    key={msg.id}
                    msg={msg}
                    editMode={currentEditingId === msg.id}
                    showPlayVoiceBtn={playVoiceBtnVisible()}
                    showPauseBtn={currentTTSPlayingMsgId === msg.id && false}
                    showRegenerateBtn={index !== 0 && index === chatHistory.length - 1}
                    showMenuBtn={index !== 0}
                    menuPopoverPlacement={index === chatHistory.length - 1 ? 'top-end' : undefined}
                    onEditClicked={(e) => {
                      editClicked(e, msg)
                    }}
                    onDelClicked={(e) => {
                      delClicked(e, msg)
                    }}
                    onEditCancelClicked={(e) => {
                      setCurrentEditingId(undefined)
                    }}
                    onEditSaveClicked={(e, content) => {
                      saveEditClicked(e, msg, content)
                    }}
                    onPlayVoiceBtnClicked={playTTSClicked}
                    onPauseBtnClicked={pauseTTSClicked}
                    onRegenerateBtnClicked={async (e) => {
                      await dispatch(regenerateChatMsg())
                    }}
                    // onMouseLeave={(e) => {
                    //   closeMenu()
                    // }}
                  ></AssistantMsg>
                )
              }
            })}
        </div>
      </div>
    </div>
  )
}

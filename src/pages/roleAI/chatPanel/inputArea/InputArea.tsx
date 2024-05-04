import {
  useChatHistory,
  useSetChatHistory,
} from '@/pages/roleAI/context/ChatHistoryContextProvider'
import classes from './InputArea.module.scss'
import { KeyboardEvent, useEffect, useRef, useState } from 'react'
import { ChatMessage, chatMessage } from '@/core/ChatMessage'
import { ChatRole } from '@/core/ChatRole'
import { useSetCurrentCharacterCardInfoId } from '@/pages/roleAI/context/CurrentCharacterCardInfoIdContextProvider'
import { msgMacrosReplace } from '@/core/promptMessageGenerator'
import { ChatCompletionReqDto, chatCompletionReqDto } from '@/api/chatCompletion/reqDto'
import { chatCompletionStream } from '@/api/chatCompletion/chatCompletion'
import { useCurrentCharacterCardInfo } from '@/pages/roleAI/context/CurrentCharacterCardInfoContextProvider'
import { useTranslation } from 'react-i18next'
import ControlDialog from './controlDialog/ControlDialog'
import { useNavigate } from 'react-router-dom'
import { useSetTTSText } from '../../context/TTSContextProvider'

export default function InputArea() {
  const { t: tCommon } = useTranslation('common')
  const { t } = useTranslation('roleAI')

  const textareaEl = useRef<HTMLTextAreaElement>(null)
  const setChatMsg = useSetChatHistory()
  const { chatHistory, last9Msg } = useChatHistory()
  const [inputDisable, setInputDisable] = useState(false)
  const [newDialogVisible, setNewDialogVisible] = useState(false)
  const setCurrentCharacterCardInfoId = useSetCurrentCharacterCardInfoId()
  const navigate = useNavigate()
  const setTTSText = useSetTTSText()

  const { charaCardInfo, charaPreMsg } = useCurrentCharacterCardInfo()
  if (!charaCardInfo || !charaPreMsg) {
    return
  }

  const [isChatMsgResponsing, setIsChatMsgResponsing] = useState(false)

  useEffect(
    function () {
      if (isChatMsgResponsing) {
        return
      }

      const lastMsg = chatHistory[chatHistory.length - 1]
      if (lastMsg.role === ChatRole.Assistant) {
        console.log('play tts')

        setTTSText(lastMsg.content)
      }
    },
    [chatHistory, isChatMsgResponsing]
  )

  async function sendChat(userMsg?: string) {
    if (!userMsg || inputDisable) {
      return
    }

    setTTSText(() => undefined)

    setInputDisable(true)

    const newUserMsg: ChatMessage = chatMessage(userMsg, ChatRole.User)

    setChatMsg((msgs) => [...msgs, newUserMsg])
    textareaEl.current && (textareaEl.current.value = '')

    const reqDto: ChatCompletionReqDto = chatCompletionReqDto(userMsg, last9Msg, charaPreMsg)
    const newAssistantMsg: ChatMessage = chatMessage('', ChatRole.Assistant)
    setChatMsg((msgs) => [...msgs, newAssistantMsg])

    try {
      await chatCompletionStream(reqDto, {
        async onOpen(response) {
          setIsChatMsgResponsing(true)
        },
        onEnd() {
          setInputDisable(false)
          setIsChatMsgResponsing(false)
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
          setInputDisable(false)
          setIsChatMsgResponsing(false)
        },
        onError(err) {
          console.log('error', err)
          setInputDisable(false)
          setIsChatMsgResponsing(false)
        },
      })
    } catch (err) {
      console.log('error', err)
      setInputDisable(false)
      setIsChatMsgResponsing(false)
    }
  }

  async function sendBtnClicked() {
    await sendChat(textareaEl.current?.value)
  }

  async function onKeyDownEnter(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== 'Enter') {
      return
    }
    event.preventDefault()

    await sendChat(textareaEl.current?.value)
  }

  function newBtnClicked() {
    setNewDialogVisible(!newDialogVisible)
  }

  function dialogCloseBtnClicked() {
    setNewDialogVisible(false)
  }

  function dialogNewChatBtnClicked() {
    if (charaCardInfo) {
      const chatMsg: ChatMessage = chatMessage(
        msgMacrosReplace(charaCardInfo.card.data.first_mes, charaCardInfo.card),
        ChatRole.Assistant
      )
      setChatMsg([chatMsg])
    }

    dialogCloseBtnClicked()
  }

  function dialogCloseChatBtnClicked() {
    setChatMsg([])
    navigate(`/`)
    setCurrentCharacterCardInfoId(undefined)
    dialogCloseBtnClicked()
  }

  function dialogContinueMsg() {}

  function dialogRegenerate() {}

  return (
    <>
      <div className={`${classes.inputArea} flex flex-row items-center relative`}>
        <div className={`${classes.op} flex-1 flex flex-row items-center p-2`}>
          <div
            className={`${classes.btn} ${classes.voice} hidden bg-no-repeat bg-center flex-none`}
          >
            {' '}
          </div>
          <div className={`${classes.msg} flex-1 flex items-center`}>
            <textarea
              ref={textareaEl}
              onKeyDown={onKeyDownEnter}
              rows={1}
              className={`${inputDisable ? ' cursor-not-allowed' : ''} w-full h-full box-border`}
            ></textarea>
          </div>
          <div
            onClick={sendBtnClicked}
            className={`${classes.btn} ${classes.send} ${
              inputDisable ? ' cursor-not-allowed' : ''
            } cursor-pointer bg-no-repeat bg-center flex-none`}
          >
            {' '}
          </div>
        </div>
        <div
          onClick={newBtnClicked}
          className={`${classes.new} cursor-pointer flex-none flex justify-center items-center`}
        >
          +
        </div>
        {newDialogVisible && (
          <ControlDialog
            regenerate={dialogRegenerate}
            continueMsg={dialogContinueMsg}
            newChat={dialogNewChatBtnClicked}
            closeChat={dialogCloseChatBtnClicked}
            closeDialog={dialogCloseBtnClicked}
          ></ControlDialog>
        )}
      </div>
    </>
  )
}

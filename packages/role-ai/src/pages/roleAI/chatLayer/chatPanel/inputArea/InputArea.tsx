import { useChatHistory } from '@/pages/roleAI/context/ChatHistoryContextProvider'
import classes from './InputArea.module.scss'
import { KeyboardEvent, useEffect, useRef, useState } from 'react'
import { ChatRole } from '@/core/ChatRole'
import { useCurrentChatCharacterInfo } from '@/pages/roleAI/context/CurrentChatCharacterInfoContextProvider'
import { useTranslation } from 'react-i18next'
import ControlDialog from './controlDialog/ControlDialog'
import { useNavigate } from 'react-router-dom'
import { useChatMessageOperate } from '../useChatMessageOperate'
import { useChatMessageState } from '../useChatMessageState'
import { useSetTTSText } from '@/pages/roleAI/context/TTSContextProvider'

export default function InputArea() {
  const { t: tCommon } = useTranslation('common')
  const { t } = useTranslation('roleAI')

  const textareaEl = useRef<HTMLTextAreaElement>(null)
  const { chatHistory } = useChatHistory()
  const [controlDialogVisible, setControlDialogVisible] = useState(false)
  const setTTSText = useSetTTSText()

  const { regenerateEnable, continueEnable } = useChatMessageState()

  const {
    sendChatMsg,
    newChat,
    clearChatMsg,
    regenerateChatMsg,
    continueChatMsg,
    closeChat,
    isChatMsgResponsing,
  } = useChatMessageOperate()

  const { chatCharaInfo } = useCurrentChatCharacterInfo()
  if (!chatCharaInfo) {
    return
  }

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
    if (!userMsg || isChatMsgResponsing) {
      return
    }

    setTTSText(() => undefined)
    textareaEl.current && (textareaEl.current.value = '')

    sendChatMsg(userMsg)
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

  function menuClicked() {
    if (isChatMsgResponsing) {
      return
    }
    setControlDialogVisible(!controlDialogVisible)
  }

  function dialogCloseBtnClicked() {
    setControlDialogVisible(false)
  }

  async function dialogNewChatBtnClicked() {
    dialogCloseBtnClicked()
    await newChat()
  }

  function dialogCloseChatBtnClicked() {
    dialogCloseBtnClicked()
    closeChat()
  }

  function dialogContinueMsgClicked() {
    setTTSText(() => undefined)
    textareaEl.current && (textareaEl.current.value = '')
    dialogCloseBtnClicked()

    continueChatMsg()
  }

  function dialogRegenerateClicked() {
    setTTSText(() => undefined)
    textareaEl.current && (textareaEl.current.value = '')
    dialogCloseBtnClicked()

    regenerateChatMsg()
  }

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
              className={`${
                isChatMsgResponsing ? ' cursor-not-allowed' : ''
              } w-full h-full box-border`}
            ></textarea>
          </div>
          <div
            onClick={sendBtnClicked}
            className={`${classes.btn} ${classes.send} ${
              isChatMsgResponsing ? ' cursor-not-allowed' : 'cursor-pointer'
            } bg-no-repeat bg-center flex-none hidden`}
          >
            {' '}
          </div>
        </div>
        <div
          onClick={menuClicked}
          className={`${classes.menuBtn} ${
            isChatMsgResponsing ? ' cursor-not-allowed' : 'cursor-pointer'
          } ${
            controlDialogVisible ? classes.opened : ''
          } flex-none flex justify-center items-center relative`}
        >
          <div className={`${classes.icon} w-[24px] h-[24px]`}></div>
        </div>

        {controlDialogVisible && (
          <ControlDialog
            regenerateEnable={regenerateEnable}
            continueEnable={continueEnable}
            regenerate={dialogRegenerateClicked}
            continueMsg={dialogContinueMsgClicked}
            newChat={dialogNewChatBtnClicked}
            closeChat={dialogCloseChatBtnClicked}
            closeDialog={dialogCloseBtnClicked}
          ></ControlDialog>
        )}
      </div>
    </>
  )
}

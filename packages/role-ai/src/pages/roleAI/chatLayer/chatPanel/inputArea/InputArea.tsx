import classes from './InputArea.module.scss'
import { KeyboardEvent, useEffect, useRef, useState, MouseEvent } from 'react'
import { ChatRole } from '@/core/ChatRole'
import { useTranslation } from 'react-i18next'
import ControlDialog from './controlDialog/ControlDialog'
import { useNavigate } from 'react-router-dom'
import { useChatMessageState } from '../useChatMessageState'
import { useAppSelector } from '@/hooks/useAppSelector'
import {
  currentChatCharacterInfoSelector,
  setCurrentChatCharacterId,
} from '@/store/slices/characterSlice'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { playTTSText, stop } from '@/store/slices/ttsSlice'
import {
  clearChatHistory,
  continueChatMsg,
  regenerateChatMsg,
  sendChatMsg,
  startNewChat,
} from '@/store/slices/chatSlice'
import { useGlobalEvent } from '@/hooks/useGlobalEvent'
import store from '@/store'

export default function InputArea() {
  // const { t: tCommon } = useTranslation('common')
  // const { t } = useTranslation('roleAI')
  // const navigate = useNavigate()

  const textareaEl = useRef<HTMLTextAreaElement>(null)
  const [controlDialogVisible, setControlDialogVisible] = useState(false)
  const dispatch = useAppDispatch()
  const isChatMsgResponsing = useAppSelector((state) => state.chat.isChatMsgResponsing)
  const { regenerateEnable, continueEnable, newChatEnable } = useChatMessageState()
  const chatCharacter = useAppSelector(currentChatCharacterInfoSelector)

  useGlobalEvent('click', dialogCloseBtnClicked)

  async function sendChat(userMsg?: string) {
    if (!userMsg || isChatMsgResponsing) {
      return
    }

    dispatch(stop())
    textareaEl.current && (textareaEl.current.value = '')

    await dispatch(sendChatMsg({ msg: userMsg }))

    const chatHis = store.getState().chat.chatHistory
    if (isChatMsgResponsing || chatHis.length <= 0) {
      return
    }
    const lastMsg = chatHis[chatHis.length - 1]
    if (
      lastMsg.content &&
      lastMsg.role === ChatRole.Assistant &&
      (chatCharacter?.card.data.extensions.nuwa_voice?.autoPlay ?? false) &&
      chatCharacter?.card.data.extensions.nuwa_voice?.publish_id
    ) {
      dispatch(
        playTTSText({
          id: lastMsg.id,
          text: lastMsg.content,
          publishId: chatCharacter.card.data.extensions.nuwa_voice.publish_id,
        })
      )
    }
  }

  async function sendBtnClicked() {
    await sendChat(textareaEl.current?.value)
  }

  async function onInputKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== 'Enter' || event.keyCode !== 13) {
      return
    }
    event.preventDefault()

    await sendChat(textareaEl.current?.value)
  }

  function menuClicked(e: MouseEvent) {
    e.stopPropagation()
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
    await dispatch(startNewChat())
  }

  function dialogCloseChatBtnClicked() {
    dialogCloseBtnClicked()
    dispatch(clearChatHistory())
    dispatch(setCurrentChatCharacterId(undefined))
  }

  async function dialogContinueMsgClicked() {
    dispatch(stop())
    textareaEl.current && (textareaEl.current.value = '')
    dialogCloseBtnClicked()

    await dispatch(continueChatMsg())
  }

  async function dialogRegenerateClicked() {
    dispatch(stop())
    textareaEl.current && (textareaEl.current.value = '')
    dialogCloseBtnClicked()

    await dispatch(regenerateChatMsg())
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
              onKeyDown={onInputKeyDown}
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
            newChatEnable={newChatEnable}
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

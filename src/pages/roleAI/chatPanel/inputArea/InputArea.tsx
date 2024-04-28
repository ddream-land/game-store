import {
  useChatHistory,
  useSetChatHistory,
} from '@/pages/roleAI/context/ChatHistoryContextProvider'
import classes from './InputArea.module.scss'
import { KeyboardEvent, useRef, useState } from 'react'
import { ChatMessage } from '@/core/ChatMessage'
import { ChatRole } from '@/core/ChatRole'
import { useSetCurrentCharacterCardInfoId } from '@/pages/roleAI/context/CurrentCharacterCardInfoIdContextProvider'
import {
  msgMacrosReplace,
  preMsgGenerator,
} from '@/core/promptMessageGenerator'
import { ChatCompletionReqDto } from '@/api/chatCompletion/reqDto'
import { chatCompletionStream } from '@/api/chatCompletion/chatCompletion'
import { useCurrentCharacterCardInfo } from '@/pages/roleAI/context/CurrentCharacterCardInfoContextProvider'
import { useTranslation } from 'react-i18next'

let uid = 1

export default function InputArea() {
  const { t: tCommon } = useTranslation('common')
  const { t } = useTranslation('roleAI')

  const textareaEl = useRef<HTMLTextAreaElement>(null)
  const setChatMsg = useSetChatHistory()
  const chatMsgs = useChatHistory()
  const [inputDisable, setInputDisable] = useState(false)
  const [newDialogVisible, setNewDialogVisible] =
    useState(false)
  const setCurrentCharacterCardInfoId =
    useSetCurrentCharacterCardInfoId()

  const currentCharaCardInfo = useCurrentCharacterCardInfo()
  if (!currentCharaCardInfo) {
    return
  }

  const preMsg = preMsgGenerator(currentCharaCardInfo.card)

  async function sendChat(userMsg?: string) {
    if (!userMsg || inputDisable) {
      return
    }

    setInputDisable(true)

    const newUserMsg: ChatMessage = {
      id: uid++,
      role: ChatRole.User,
      content: userMsg,
      date: new Date(),
    }

    setChatMsg((msgs) => [...msgs, newUserMsg])
    textareaEl.current && (textareaEl.current.value = '')

    try {
      const last9Msg = chatMsgs
        .slice(Math.max(chatMsgs.length - 9, 0))
        .map(function (x) {
          return {
            role: x.role,
            content: x.content,
          }
        })

      const reqDto: ChatCompletionReqDto = {
        messages: [
          ...preMsg,
          ...last9Msg,
          {
            role: ChatRole.User,
            content: userMsg,
          },
        ],
        model: 'claude-2.0',
        temperature: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        top_p: 1,
        max_tokens: 300,
        logit_bias: {},
        chat_completion_source: 'claude',
        user_name: 'User',
        char_name: 'Flux the Cat',
      }

      const aiMsgId = uid++
      const newAssistantMsg: ChatMessage = {
        id: aiMsgId,
        role: ChatRole.Assistant,
        content: '',
        date: new Date(),
      }

      setChatMsg((msgs) => [...msgs, newAssistantMsg])

      chatCompletionStream(reqDto, {
        async onOpen(response) {
          console.log(response)
        },
        onMessage(eventSourceMsg) {
          if (
            eventSourceMsg.event ===
              'content_block_start' ||
            eventSourceMsg.event ===
              'content_block_delta' ||
            eventSourceMsg.event === 'content_block_stop'
          ) {
            const data = JSON.parse(eventSourceMsg.data)
            let msg = ''
            if (data) {
              if ('content_block' in data) {
                const block = data['content_block']
                if (block && 'text' in block) {
                  msg = block.text
                }
              } else if ('delta' in data) {
                const delta = data['delta']
                if (delta && 'text' in delta) {
                  msg = delta.text
                }
              }
            }

            setChatMsg(function (msgs) {
              return msgs.map(function (m) {
                if (m.id === aiMsgId) {
                  return {
                    ...m,
                    content: m.content + msg,
                  }
                } else {
                  return m
                }
              })
            })
          }
        },
        onClose() {
          setInputDisable(false)
        },
        onError(err) {
          console.log('error')
          setInputDisable(false)
        },
      })
    } catch {}
  }

  async function sendBtnClicked() {
    await sendChat(textareaEl.current?.value)
  }

  async function onKeyDownEnter(
    event: KeyboardEvent<HTMLTextAreaElement>
  ) {
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
    if (currentCharaCardInfo) {
      setChatMsg([
        {
          role: ChatRole.Assistant,
          content: msgMacrosReplace(
            currentCharaCardInfo.card.data.first_mes,
            currentCharaCardInfo.card
          ),
          id: Date.now(),
          date: new Date(),
        },
      ])
    }

    dialogCloseBtnClicked()
  }

  function dialogCloseChatBtnClicked() {
    setChatMsg([])
    setCurrentCharacterCardInfoId(undefined)
    dialogCloseBtnClicked()
  }

  return (
    <>
      <div
        className={`${classes.inputArea} flex flex-row items-center relative`}
      >
        <div
          className={`${classes.op} flex-1 flex flex-row items-center p-2`}
        >
          <div
            className={`${classes.btn} ${classes.voice} hidden bg-no-repeat bg-center flex-none`}
          >
            {' '}
          </div>
          <div
            className={`${classes.msg} flex-1 flex items-center`}
          >
            <textarea
              ref={textareaEl}
              onKeyDown={onKeyDownEnter}
              rows={1}
              className={`${
                inputDisable ? ' cursor-not-allowed' : ''
              } w-full h-full box-border`}
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
        <div
          className={`${classes['new-dialog']} ${
            newDialogVisible ? '' : 'hidden'
          } absolute`}
        >
          <div
            className={`${classes.header} flex justify-end`}
          >
            <div
              onClick={dialogCloseBtnClicked}
              className={`${classes.close} cursor-pointer`}
            ></div>
          </div>
          <div
            className={`${classes.content} flex flex-row flex-wrap justify-center items-center`}
          >
            <div
              className={`${classes.re} ${classes.btn} cursor-pointer`}
            >
              {t('regenerate')} &nbsp;
            </div>
            <div
              onClick={dialogNewChatBtnClicked}
              className={`${classes.new} ${classes.btn} cursor-pointer`}
            >
              {t('newConversation')} &nbsp;
            </div>
            <div
              className={`${classes.con} ${classes.btn} cursor-pointer`}
            >
              {tCommon('continue')} &nbsp;
            </div>
            <div
              onClick={dialogCloseChatBtnClicked}
              className={`${classes.clo} ${classes.btn} cursor-pointer`}
            >
              {t('hideConversation')} &nbsp;
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

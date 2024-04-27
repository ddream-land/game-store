import {
  useChatMessages,
  useSetChatMessage,
} from '@/character/context/ChatMessagesContextProvider'
import classes from './InputPanel.module.scss'
import { KeyboardEvent, useRef, useState } from 'react'
import { ChatMessage } from '@/libs/ChatMessage'
import { ChatRole } from '@/libs/ChatRole'
import { chat } from '@/api/chatMessage'
import {
  useCurrentDigitalLifeId,
  useSetCurrentDigitalLifeId,
} from '@/character/context/CurrentDigitalLifeIdContextProvider'
import { useDigitalLifeDetailList } from '@/character/context/DigitalLifeDetailListContextProvider'
import {
  msgMacrosReplace,
  preMsgGenerator,
} from '@/libs/promptMessageGenerator'
import { ChatCompletionReqDto } from '@/api/chatCompletion/reqDto'
import { chatCompletion } from '@/api/chatCompletion/chatCompletion'
import { fetchEventSource } from '@microsoft/fetch-event-source'

let uid = 1

export default function InputPanel() {
  const textareaEl = useRef<HTMLTextAreaElement>(null)
  const setChatMsg = useSetChatMessage()
  const chatMsgs = useChatMessages()
  const [inputDisable, setInputDisable] = useState(false)
  const [newDialogVisible, setNewDialogVisible] =
    useState(false)
  const setCurrentDigitalLifeId =
    useSetCurrentDigitalLifeId()
  const digitalLifeDetailList = useDigitalLifeDetailList()
  const currentDigitalLifeId = useCurrentDigitalLifeId()

  const lifeDetail = digitalLifeDetailList.find(
    (x) => x.id === currentDigitalLifeId
  )

  if (!lifeDetail) {
    return
  }

  const preMsg = preMsgGenerator(lifeDetail.card)

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
        stream: true,
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

      fetchEventSource(
        `https://st.nirvanaworld.cn/api/backends/chat-completions/generate`,
        {
          body: JSON.stringify(reqDto),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          signal: AbortSignal.timeout(10000),
          async onopen(response) {
            console.log(response)
          },
          onmessage(eventSourceMsg) {
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
          onclose() {
            console.log('close')
            setInputDisable(false)
          },
          onerror(err) {
            console.log('error')
            setInputDisable(false)
          },
        }
      )
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
    if (lifeDetail) {
      setChatMsg([
        {
          role: ChatRole.Assistant,
          content: msgMacrosReplace(
            lifeDetail.card.data.first_mes,
            lifeDetail.card
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
    setCurrentDigitalLifeId(undefined)
    dialogCloseBtnClicked()
  }

  return (
    <>
      <div
        className={`${classes.ip} flex flex-row items-center relative`}
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
              Re-generate &nbsp;
            </div>
            <div
              onClick={dialogNewChatBtnClicked}
              className={`${classes.new} ${classes.btn} cursor-pointer`}
            >
              New Conversation &nbsp;
            </div>
            <div
              className={`${classes.con} ${classes.btn} cursor-pointer`}
            >
              Continue &nbsp;
            </div>
            <div
              onClick={dialogCloseChatBtnClicked}
              className={`${classes.clo} ${classes.btn} cursor-pointer`}
            >
              Hide Conversation &nbsp;
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

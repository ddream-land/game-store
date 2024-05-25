import { NuwaChatMessage } from '@/core/ChatMessage'
import classes from './AssistantMsg.module.scss'
import {
  useChatHistory,
  useSetChatHistory,
} from '@/pages/roleAI/context/ChatHistoryContextProvider'

export default AssistantMsg

type AssistantMsgProps = Readonly<{
  msg: NuwaChatMessage
}>

function AssistantMsg({ msg }: AssistantMsgProps) {
  const setChatMsg = useSetChatHistory()
  const { chatHistory } = useChatHistory()

  const msgId = msg.id
  const showSwitch = msg.contents && msg.contents.length > 1
  let leftEnable = false
  let rightEnable = false
  if (showSwitch) {
    const currentContentIndex = msg.contents!.findIndex((x) => x.content === msg.content)
    if (currentContentIndex > 0) {
      leftEnable = true
    }
    if (currentContentIndex < msg.contents!.length - 1) {
      rightEnable = true
    }
  }

  async function onLeftClicked() {
    if (!showSwitch || !leftEnable) {
      return
    }
    const currentContentIndex = msg.contents!.findIndex((x) => x.content === msg.content)
    let toContentIndex = 0
    if (currentContentIndex > 0) {
      toContentIndex = currentContentIndex - 1
    }

    setChatMsg(
      chatHistory.map(function (msg) {
        if (msg.id === msgId) {
          return {
            ...msg,
            content: msg.contents![toContentIndex].content,
            tokens: msg.contents![toContentIndex].tokens,
          }
        } else {
          return msg
        }
      })
    )
  }

  async function onRightClicked() {
    if (!showSwitch || !rightEnable) {
      return
    }
    const currentContentIndex = msg.contents!.findIndex((x) => x.content === msg.content)
    let toContentIndex = msg.contents!.length - 1
    if (currentContentIndex < toContentIndex) {
      toContentIndex = currentContentIndex + 1
    }

    setChatMsg(
      chatHistory.map(function (msg) {
        if (msg.id === msgId) {
          return {
            ...msg,
            content: msg.contents![toContentIndex].content,
            tokens: msg.contents![toContentIndex].tokens,
          }
        } else {
          return msg
        }
      })
    )
  }

  return (
    <div className={`${classes.assistMsg} w-full flex flex-row relative`}>
      <div className={`${classes.content} w-full`}>{msg.content}</div>

      <div className={`${classes.switchMsg} ${showSwitch ? '' : 'hidden'} absolute flex flex-row`}>
        <div
          onClick={onLeftClicked}
          className={`${classes.arrow} ${
            leftEnable ? '' : classes.disable
          } cursor-pointer h-full flex justify-center items-center flex-1`}
        >
          &lt;
        </div>
        <div
          onClick={onRightClicked}
          className={`${classes.arrow} ${
            rightEnable ? '' : classes.disable
          } cursor-pointer h-full flex justify-center items-center flex-1`}
        >
          &gt;
        </div>
      </div>
    </div>
  )
}

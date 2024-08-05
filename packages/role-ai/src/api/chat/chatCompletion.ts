import { EventSourceMessage, fetchEventSource } from '@microsoft/fetch-event-source'
import { HTTP_TIMEOUT } from '@/constant/env'
import { ClaudeStreamingMessageEventType, RequestStreamEvent } from '../requestStream'
import { ChatCompletionReqDto } from './reqDto'
import { getFullUrl } from '../constants'
import { isObject } from '@/libs/isTypes'
import store from '@/store'
import { logout } from '@/store/slices/userInfoSlice'

enum NuwaStreamingMessageEventTypeExtend {
  MsgId = 'get_msg_id',
}

export type NuwaStreamingMessageEventType =
  | ClaudeStreamingMessageEventType
  | NuwaStreamingMessageEventTypeExtend

export const NuwaStreamingMessageEventTypes = {
  ...ClaudeStreamingMessageEventType,
  ...NuwaStreamingMessageEventTypeExtend,
}

export type NuwaRequestStreamEvent = RequestStreamEvent & {
  onMsgId?: (msgId: string, replyMsgId: string, msgTime: number, replyMsgTime: number) => void
  onOutputTokens?: (tokens: number) => void
}

export async function chatCompletionStream(
  reqDto: ChatCompletionReqDto,
  {
    onMsgId,
    onOpen,
    onMessage,
    onClose,
    onEnd,
    onError,
    onContentEnd,
    onOutputTokens,
  }: NuwaRequestStreamEvent
) {
  const timeout = setTimeout(function () {
    onEnd && onEnd()
    clearTimeout(timeout)
  }, HTTP_TIMEOUT * 10)

  const url = getFullUrl(`/nuwa/api/backends/chat-completions/chat`)

  await fetchEventSource(url, {
    body: JSON.stringify(reqDto),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    signal: AbortSignal.timeout(HTTP_TIMEOUT),
    async onopen(response) {
      // const data = await response.json()
      // if (isObject(data) && 'code' in data) {
      //   const code = data.code
      //   if (code === 604) {
      //     await store.dispatch(logout())
      //   }
      // }
      onOpen && (await onOpen(response))
    },
    onmessage(eventSourceMsg) {
      switch (eventSourceMsg.event) {
        case NuwaStreamingMessageEventTypes.MsgId: {
          const data = JSON.parse(eventSourceMsg.data)
          const msg = data.msg
          const { msg_id, reply_msg_id, msg_time, reply_msg_time } = msg
          onMsgId && onMsgId(msg_id, reply_msg_id, msg_time, reply_msg_time)
          break
        }
        case NuwaStreamingMessageEventTypes.Stop: {
          clearTimeout(timeout)
          onEnd && onEnd()
          break
        }
        case NuwaStreamingMessageEventTypes.Ping:
        case NuwaStreamingMessageEventTypes.Start: {
          break
        }
        case NuwaStreamingMessageEventTypes.Delta: {
          const data = JSON.parse(eventSourceMsg.data)
          const { output_tokens } = data.usage
          onOutputTokens && onOutputTokens(output_tokens)
          break
        }
        case NuwaStreamingMessageEventTypes.BlockStop: {
          const data = JSON.parse(eventSourceMsg.data)
          const contentIndex = data.index
          onContentEnd && onContentEnd(contentIndex)
          break
        }
        case NuwaStreamingMessageEventTypes.BlockDelta: {
          const data = JSON.parse(eventSourceMsg.data)
          const contentIndex = data.index
          const delta = data.delta
          const msg = delta.text
          onMessage && onMessage(contentIndex, msg)
          break
        }
        case NuwaStreamingMessageEventTypes.BlockStart: {
          const data = JSON.parse(eventSourceMsg.data)
          const contentIndex = data.index
          const block = data.content_block
          const msg = block.text
          onMessage && onMessage(contentIndex, msg)
          break
        }

        default: {
          clearTimeout(timeout)
          throw new Error(`Knonwn event type: ${eventSourceMsg.event}`)
        }
      }
    },
    onclose() {
      clearTimeout(timeout)
      onClose && onClose()
    },
    onerror(err) {
      clearTimeout(timeout)
      console.log('error', err)
      onError && onError(err)
    },
  })
}

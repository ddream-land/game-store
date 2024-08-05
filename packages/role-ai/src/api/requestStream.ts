import { EventSourceMessage, fetchEventSource } from '@microsoft/fetch-event-source'
import { HTTP_TIMEOUT } from '@/constant/env'
import './fetchInterceptors'

export enum ClaudeStreamingMessageEventType {
  Start = 'message_start',
  Delta = 'message_delta',
  Stop = 'message_stop',
  BlockStart = 'content_block_start',
  BlockDelta = 'content_block_delta',
  BlockStop = 'content_block_stop',
  Ping = 'ping',
}

export type RequestStreamEvent = {
  onOpen?: (response: Response) => Promise<void>
  onMessage?: (contentIndex: number, msg: string) => void
  onClose?: () => void
  onEnd?: () => void
  onError?: (err: any) => number | null | undefined | void
  onContentEnd?: (contentIndex: number) => void
}

export async function requestStream(
  url: string,
  body: Record<string, any> | null | undefined,
  { onOpen, onMessage, onClose, onEnd, onError, onContentEnd }: RequestStreamEvent
) {
  const timeout = setTimeout(function () {
    clearTimeout(timeout)
    onEnd && onEnd()
  }, HTTP_TIMEOUT * 5)

  await fetchEventSource(url, {
    body: JSON.stringify({ ...(body ?? {}), stream: true }),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    signal: AbortSignal.timeout(HTTP_TIMEOUT),
    async onopen(response) {
      onOpen && (await onOpen(response))
    },
    onmessage(eventSourceMsg) {
      switch (eventSourceMsg.event) {
        case ClaudeStreamingMessageEventType.Stop: {
          clearTimeout(timeout)
          onEnd && onEnd()
          break
        }
        case ClaudeStreamingMessageEventType.Ping:
        case ClaudeStreamingMessageEventType.Start:
        case ClaudeStreamingMessageEventType.Delta: {
          break
        }
        case ClaudeStreamingMessageEventType.BlockStop: {
          const data = JSON.parse(eventSourceMsg.data)
          const contentIndex = data.index
          onContentEnd && onContentEnd(contentIndex)
          break
        }
        case ClaudeStreamingMessageEventType.BlockDelta: {
          const data = JSON.parse(eventSourceMsg.data)
          const contentIndex = data.index
          const delta = data.delta
          const msg = delta.text
          onMessage && onMessage(contentIndex, msg)
          break
        }
        case ClaudeStreamingMessageEventType.BlockStart: {
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
      console.log('close')
      onClose && onClose()
    },
    onerror(err) {
      clearTimeout(timeout)
      console.log('error')
      onError && onError(err)
    },
  })
}

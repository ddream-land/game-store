import { ChatCompletionReqDto } from './reqDto'
import {
  EventSourceMessage,
  fetchEventSource,
} from '@microsoft/fetch-event-source'
import { HTTP_TIMEOUT, getFullUrl } from '../constants'

export async function chatCompletionStream(
  dto: ChatCompletionReqDto,
  {
    onOpen,
    onMessage,
    onClose,
    onError,
  }: {
    onOpen: (response: Response) => Promise<void>
    onMessage: (ev: EventSourceMessage) => void
    onClose: () => void
    onError: (err: any) => number | null | undefined | void
  }
) {
  const url = getFullUrl(
    `/backends/chat-completions/generate`
  )
  fetchEventSource(url, {
    body: JSON.stringify({ ...dto, stream: true }),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    signal: AbortSignal.timeout(HTTP_TIMEOUT),
    async onopen(response) {
      await onOpen(response)
    },
    onmessage(eventSourceMsg) {
      onMessage(eventSourceMsg)
    },
    onclose() {
      onClose()
    },
    onerror(err) {
      onError(err)
    },
  })
}

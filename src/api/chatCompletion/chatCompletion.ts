import { ChatCompletionReqDto } from './reqDto'
import { getFullUrl } from '../constants'
import { requestStream } from '../requestStream'

export async function chatCompletionStream(
  dto: ChatCompletionReqDto,
  events: {
    onOpen: (response: Response) => Promise<void>
    onMessage: (msg: string) => void
    onClose: () => void
    onEnd: () => void
    onError: (err: any) => number | null | undefined | void
  }
) {
  const url = getFullUrl(`/backends/chat-completions/generate`)

  await requestStream(url, dto, {
    async onOpen(response) {
      await events.onOpen(response)
    },
    onMessage(contentIndex, msg) {
      if (contentIndex !== 0) {
        throw new Error(`Multi msg not fit.`)
      }
      events.onMessage(msg)
    },
    onClose() {
      events.onClose()
    },
    onEnd() {
      events.onEnd()
    },
    onError(err) {
      events.onError(err)
    },
  })
}

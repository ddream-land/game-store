import { EventSourceMessage } from '@microsoft/fetch-event-source'

export function streamResponseMsgDecode(eventSourceMsg: EventSourceMessage): string {
  let msg = ''

  if (
    eventSourceMsg.event === 'content_block_start' ||
    eventSourceMsg.event === 'content_block_delta' ||
    eventSourceMsg.event === 'content_block_stop'
  ) {
    const data = JSON.parse(eventSourceMsg.data)

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
  }
  return msg
}

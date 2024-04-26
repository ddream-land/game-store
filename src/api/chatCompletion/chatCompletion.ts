import { requestData } from '../request'
import http from '../http'
import { ChatCompletionReqDto } from './reqDto'
import { fetchEventSource } from '@microsoft/fetch-event-source'

export async function chatCompletion(
  dto: ChatCompletionReqDto
) {
  fetchEventSource(
    `http://47.236.229.54/api/backends/chat-completions/generate`,
    {
      body: JSON.stringify(dto),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      signal: AbortSignal.timeout(10000),
      async onopen(response) {
        console.log(response)
      },
      onmessage(msg) {
        console.log(msg)
      },
      onclose() {
        console.log('close')
      },
      onerror(err) {
        console.log('error')
      },
    }
  )

  //   http
  //     .request({
  //       url: `http://47.236.229.54/api/backends/chat-completions/generate`,
  //       method: 'post',
  //       data: dto,
  //       responseType: 'stream',
  //     })
  //     .then(function (res) {
  //       res.data.pipe((x: any) => {
  //         console.log(x)
  //       })
  //       console.log(res)
  //     })
}

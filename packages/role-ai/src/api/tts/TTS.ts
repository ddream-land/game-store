import { request, requestList } from '../request'
import { AxiosResponse } from 'axios'

export function ttsGetUrl(text: string, character: string = 'shenli') {
  return `https://tts.nirvanaworld.cn/tts?character=${character}&text=${text}&batch_size=10&format=mp3`
}

export async function ttsInfo(publishId: string, text: string, signal?: AbortSignal) {
  return await request<AxiosResponse<ArrayBuffer>>({
    url: `/ddream/api/v1/voice/simplified/inf`,
    method: 'post',
    timeout: 60000,
    signal,
    data: {
      text: text,
      publish_id: publishId,
    },
    responseType: 'arraybuffer',
  })
}

import { sleep } from '@/libs/sleep'
import { requestData } from './request'

export async function chat(msg: string) {
  await sleep(1000)

  if (Math.random() > 0.5) {
    return `Oops
出问题了
因为聊天机器人
还没有运行起来
请稍后再试
Bye.`
  } else {
    return '机器人还未运行'
  }
}

export async function save(msg: string) {
  return requestData<string | null>({
    url: `/project`,
    method: 'post',
  })
}

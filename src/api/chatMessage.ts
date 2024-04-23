import { sleep } from '@/libs/sleep'

export async function chat(msg: string) {
  await sleep(1000)

  return '机器人还未运行'
}

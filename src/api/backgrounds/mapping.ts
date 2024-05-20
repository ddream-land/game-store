import { Background } from '@/core/Background'
import { BackgroundInfo } from './resDto'

export function backgroundMapping(bgs: BackgroundInfo[]): Background[] {
  const result: Background[] = []

  const len = bgs.length

  for (let i = 0; i < len; i++) {
    const bg = bgs[i]
    const bgGround: Background = {
      name: bg.name,
      url: bg.url,
      id: bg.id,
    }

    result.push(bgGround)
  }

  return result
}

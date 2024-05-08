import { Background } from '@/core/Background'
import { backgroundUrl } from './backgrounds'

export function backgroundMapping(bgs: string[]): Background[] {
  const result: Background[] = []

  const len = bgs.length

  for (let i = 0; i < len; i++) {
    const bg = bgs[i]
    const bgGround: Background = {
      name: bg,
      url: backgroundUrl(bg),
    }

    result.push(bgGround)
  }

  return result
}

import { Background } from '@/core/Background'
import { backgroundUrl } from './backgrounds'
import { AllBgResDto } from './resDto'

export function backgroundMapping(bgsRes: AllBgResDto): Background[] {
  const result: Background[] = []

  const bgs = bgsRes.resp
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

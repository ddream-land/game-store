import { CharacterCardInfo } from '@/core/CharacterCardInfo'
import { GetAllCardsRes } from './resDto'
import { isCharacterCard } from '@/core/characterCard/characterCard'
import { CharacterCardVersion } from '@/core/characterCard/CharacterCardVersion'
import { CharacterCardV2, v1Tov2 } from '@/core/characterCard/characterCardV2'
import { CharacterCardV1 } from '@/core/characterCard/characterCardV1'
import { avatarUrl } from './characterCard'

export function stCardToCharacterCardInfo(stCards: GetAllCardsRes): CharacterCardInfo[] {
  const result: CharacterCardInfo[] = []

  const indexes = Reflect.ownKeys(stCards) as string[]
  const len = indexes.length

  for (let i = len - 1; i >= 0; i--) {
    const index = indexes[i]
    const stCard = stCards[index]

    const [isCharaCard, ver] = isCharacterCard(stCard)

    if (!stCard || !isCharaCard) {
      throw new Error(`Invalid character card: ${JSON.stringify(stCard)}`)
    }

    let cardV2: CharacterCardV2 = stCard as CharacterCardV2

    if (ver === CharacterCardVersion.v1) {
      cardV2 = v1Tov2(stCard as CharacterCardV1)!
    }

    const url = avatarUrl(stCard.avatar)

    const charaCardInfo: CharacterCardInfo = {
      id: index,
      card: cardV2,
      pngUrlOrBase64: url,
      avatar: stCard.avatar,
    }

    result.push(charaCardInfo)
  }

  return result
}

import { CharacterCardInfo } from '@/core/CharacterCardInfo'
import { GetAllCardsData } from './resDto'
import { isCharacterCard } from '@/core/characterCard/characterCard'
import { CharacterCardVersion } from '@/core/characterCard/CharacterCardVersion'
import { CharacterCardV2, v1Tov2 } from '@/core/characterCard/characterCardV2'
import { CharacterCardV1 } from '@/core/characterCard/characterCardV1'

export function stCardToCharacterCardInfo(stCards: GetAllCardsData): CharacterCardInfo[] {
  const result: CharacterCardInfo[] = []

  const indexes = Reflect.ownKeys(stCards) as string[]
  const len = indexes.length

  for (let i = len - 1; i >= 0; i--) {
    const index = indexes[i]
    const stCard = stCards[index]

    const [isCharaCard, ver] = isCharacterCard(stCard)

    if (!stCard || !isCharaCard) {
      console.warn(`Invalid character card: ${JSON.stringify(stCard)}`)
      continue
    }

    let cardV2: CharacterCardV2 = stCard as CharacterCardV2

    if (ver === CharacterCardVersion.v1) {
      cardV2 = v1Tov2(stCard as CharacterCardV1)!
    }

    // const url = avatarUrl(stCard.avatar)
    const url = stCard.avatar
    const id = stCard.id

    const charaCardInfo: CharacterCardInfo = {
      id: id,
      card: cardV2,
      pngUrlOrBase64: url,
    }

    result.push(charaCardInfo)
  }

  return result
}

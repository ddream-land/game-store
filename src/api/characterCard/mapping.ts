import { CharacterCardInfo } from '@/core/CharacterCardInfo'
import { GetAllCardsRes } from './resDto'
import { isCharacterCard } from '@/core/characterCard/characterCard'
import { CharacterCardVersion } from '@/core/characterCard/CharacterCardVersion'
import { CharacterCardV2, v1Tov2 } from '@/core/characterCard/characterCardV2'
import { CharacterCardV1 } from '@/core/characterCard/characterCardV1'

export function stCardToCharacterCardInfo(stCards: GetAllCardsRes): CharacterCardInfo[] {
  const indexes = Reflect.ownKeys(stCards) as string[]
  return indexes.map(function (index) {
    const stCard = stCards[index]

    const [isCharaCard, ver] = isCharacterCard(stCard)

    if (!stCard || !isCharaCard) {
      throw new Error(`Invalid character card: ${JSON.stringify(stCard)}`)
    }

    let cardV2: CharacterCardV2 = stCard as CharacterCardV2

    if (ver === CharacterCardVersion.v1) {
      cardV2 = v1Tov2(stCard as CharacterCardV1)!
    }

    const avatarUrl = `https://st.nirvanaworld.cn/thumbnail?type=avatar&file=${stCard.avatar}`

    const charaCardInfo: CharacterCardInfo = {
      id: index,
      card: cardV2,
      pngUrlOrBase64: avatarUrl,
    }

    return charaCardInfo
  })
}

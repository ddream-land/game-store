import { CharacterCardV2 } from './characterCard/characterCardV2'

export type CharacterCardInfo = {
  /**
   * unique, also url
   */
  id: string
  card: CharacterCardV2
  pngUrlOrBase64: string
}

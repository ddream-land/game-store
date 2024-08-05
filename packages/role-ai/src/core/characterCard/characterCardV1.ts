import { isOfTypes } from '@/libs/isTypes'
import { CharacterCardVersion } from './CharacterCardVersion'

export type CharacterCardV1 = {
  name: string
  description: string
  personality: string
  scenario: string
  first_mes: string
  mes_example: string
}

export function isCharacterCardV1(
  val: unknown
): val is CharacterCardV1 {
  return isOfTypes<CharacterCardV1>(val, [
    'name',
    'description',
    'personality',
    'scenario',
    'first_mes',
    'mes_example',
  ])
}

export function version() {
  return CharacterCardVersion.v1
}

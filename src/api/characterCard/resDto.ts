import { CharacterCardV1AndV2 } from '@/core/characterCard/characterCard'

export type STCard = CharacterCardV1AndV2 & {
  avatar: string
}

export type GetAllCardsRes = Record<string, STCard>

import { CharacterCardV1AndV2 } from '@/core/characterCard/characterCard'

export type STCard = CharacterCardV1AndV2 & {
  avatar: string
  chat: string
  chat_size: number
  create_data: string
  id: string
}

export type GetAllCardsData = Record<string, STCard>

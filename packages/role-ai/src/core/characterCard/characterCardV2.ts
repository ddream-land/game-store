import { isOfTypes } from '@/libs/isTypes'
import { CharacterCardV1, isCharacterCardV1 } from './characterCardV1'
import { CharacterBook } from './characterBook'
import { CharacterCardVersion } from './CharacterCardVersion'
import { NuwaExtensions } from './NuwaCharacterCardExtensions'

export type CharacteCardV2DataBeta = CharacterCardV1 & {
  // New fields start here
  creator_notes: string
  system_prompt: string
  post_history_instructions: string
  alternate_greetings: Array<string>
  character_book?: CharacterBook
}

export type CharacteCardV2Data<ExtensionsValType = any> = CharacteCardV2DataBeta & {
  // May 8th additions
  tags: Array<string>
  creator: string
  character_version: string
  extensions: NuwaExtensions //| Record<string, ExtensionsValType>
}

export type CharacterCardV2 = {
  spec: 'chara_card_v2'
  spec_version: CharacterCardVersion.v2 // May 8th addition
  data: CharacteCardV2Data
}

export function isCharacteCardV2Data(val: unknown): val is CharacteCardV2Data {
  return (
    isCharacterCardV1(val) &&
    isOfTypes(val, [
      'creator_notes',
      'system_prompt',
      'post_history_instructions',
      'alternate_greetings',
      'tags',
      'creator',
      'character_version',
      'extensions',
    ])
  )
}

export function isCharacterCardV2(val: unknown): val is CharacterCardV2 {
  if (isOfTypes<CharacterCardV2>(val, ['spec', 'spec_version', 'data'])) {
    if (val.spec === 'chara_card_v2' && val.spec_version === CharacterCardVersion.v2) {
      if (isCharacteCardV2Data(val.data)) {
        return true
      }
    }
  }

  return false
}

export function version() {
  return CharacterCardVersion.v2
}

export function v1Tov2(
  val: CharacterCardV1,
  option?: {
    creator_notes: string
    system_prompt: string
    post_history_instructions: string
    alternate_greetings: Array<string>
    character_book?: CharacterBook
    tags: Array<string>
    creator: string
    character_version: string
    extensions: Record<string, any>
  }
): CharacterCardV2 | undefined {
  if (!isCharacterCardV1(val)) {
    return
  }

  const newField = {
    creator_notes: '',
    system_prompt: '',
    post_history_instructions: '',
    alternate_greetings: [],
    character_book: undefined,
    tags: [],
    creator: '',
    character_version: '',
    extensions: {},
    ...option,
  }

  const data: CharacteCardV2Data = {
    ...val,
    creator_notes: newField.creator_notes,
    system_prompt: newField.system_prompt,
    post_history_instructions: newField.post_history_instructions,
    alternate_greetings: newField.alternate_greetings,
    character_book: newField.character_book,
    tags: newField.tags,
    creator: newField.creator,
    character_version: newField.character_version,
    extensions: newField.extensions,
  }

  const cardV2: CharacterCardV2 = {
    spec: 'chara_card_v2',
    spec_version: CharacterCardVersion.v2,
    data: data,
    // keep v1's property
    ...val,
  }

  return cardV2
}

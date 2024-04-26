import extract from 'png-chunks-extract'
import text from 'png-chunk-text'

const TEXT_CHUNK_NAME = 'tEXt'
const CHARACTER_CHUNK_KEYWORD = 'chara'

export type CharacterCardV1 = {
  name: string
  description: string
  personality: string
  scenario: string
  first_mes: string
  mes_example: string
}

export type CharacteCardV2Data = CharacterCardV1 & {
  // New fields start here
  creator_notes: string
  system_prompt: string
  post_history_instructions: string
  alternate_greetings: Array<string>
  character_book?: CharacterBook

  // May 8th additions
  tags: Array<string>
  creator: string
  character_version: string
  extensions: Record<string, any> // see details for explanation
}

export type CharacterCardV2 = {
  spec: 'chara_card_v2'
  spec_version: '2.0' // May 8th addition
  data: CharacteCardV2Data
}

export type CharacterCardV1AndV2 =
  | CharacterCardV1
  | CharacterCardV2

export type CharacterBook = {
  name?: string
  description?: string
  scan_depth?: number // agnai: "Memory: Chat History Depth"
  token_budget?: number // agnai: "Memory: Context Limit"
  recursive_scanning?: boolean // no agnai equivalent. whether entry content can trigger other entries
  extensions: Record<string, any>
  entries: Array<{
    keys: Array<string>
    content: string
    extensions: Record<string, any>
    enabled: boolean
    insertion_order: number // if two entries inserted, lower "insertion order" = inserted higher
    case_sensitive?: boolean

    // FIELDS WITH NO CURRENT EQUIVALENT IN SILLY
    name?: string // not used in prompt engineering
    priority?: number // if token budget reached, lower priority value = discarded first

    // FIELDS WITH NO CURRENT EQUIVALENT IN AGNAI
    id?: number // not used in prompt engineering
    comment?: string // not used in prompt engineering
    selective?: boolean // if `true`, require a key from both `keys` and `secondary_keys` to trigger the entry
    secondary_keys?: Array<string> // see field `selective`. ignored if selective == false
    constant?: boolean // if true, always inserted in the prompt (within budget limit)
    position?: 'before_char' | 'after_char' // whether the entry is placed before or after the character defs
  }>
}

export type Character = any

function checkCharacterCard() {}

export function readCharacterCardFromChunks(
  chunks: {
    name: string
    data: Uint8Array
  }[]
): Character | undefined {
  const tEXtChunks = chunks.filter(
    (chunk: { name: string }) =>
      chunk.name === TEXT_CHUNK_NAME
  )
  if (!tEXtChunks) {
    return
  }

  const tEXtChunk = tEXtChunks[0]
  const data = text.decode(tEXtChunk.data)
  if (data.keyword !== CHARACTER_CHUNK_KEYWORD) {
    return
  }
  const base64JSON = data.text

  try {
    const jsonString = atob(base64JSON)
    return JSON.parse(jsonString)
  } catch (err) {
    return
  }
}

function writeCharacterCardToChunks(
  chunks: {
    name: string
    data: Uint8Array
  }[],
  character: Character
): any | undefined {
  const tEXtChunks = chunks.filter(
    (chunk: { name: string }) =>
      chunk.name === TEXT_CHUNK_NAME
  )
  if (tEXtChunks) {
    for (let tEXtChunk of tEXtChunks) {
      chunks.splice(chunks.indexOf(tEXtChunk), 1)
    }
  }

  const base64EncodedData = btoa(JSON.stringify(character))
  chunks.splice(
    -1,
    0,
    text.encode(CHARACTER_CHUNK_KEYWORD, base64EncodedData)
  )

  return chunks
}

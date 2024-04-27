import text from 'png-chunk-text'
import {
  CharacterCardV1,
  isCharacterCardV1,
} from './characterCardV1'
import {
  CharacterCardV2,
  isCharacterCardV2,
  v1Tov2,
} from './characterCardV2'
import { CharacterCardVersion } from './CharacterCardVersion'

const TEXT_CHUNK_NAME = 'tEXt'
const CHARACTER_CHUNK_KEYWORD = 'chara'

export type CharacterCardV1AndV2 =
  | CharacterCardV1
  | CharacterCardV2

export function isCharacterCard(
  val: unknown
): [boolean, CharacterCardVersion | undefined] {
  if (isCharacterCardV2(val)) {
    return [true, CharacterCardVersion.v2]
  } else if (isCharacterCardV1(val)) {
    return [true, CharacterCardVersion.v1]
  }

  return [false, undefined]
}

export type Character = any

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

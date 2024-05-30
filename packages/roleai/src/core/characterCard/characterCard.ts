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

export function readCharacterCardFromChunks(
  chunks: {
    name: string
    data: Uint8Array
  }[]
): CharacterCardV2 | undefined {
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

  let mayCard: any = undefined
  try {
    const jsonString = atob(base64JSON)
    mayCard = JSON.parse(jsonString)
  } catch (err) {
    console.error(err)
    mayCard = undefined
  }

  let card: CharacterCardV2 | undefined

  const [isCard, ver] = isCharacterCard(mayCard)
  if (isCard) {
    switch (ver) {
      case CharacterCardVersion.v1: {
        card = v1Tov2(mayCard)
        break
      }
      case CharacterCardVersion.v2: {
        card = mayCard
        break
      }
      default: {
        console.error(
          `Unknown character card version. ${ver}`
        )
        card = undefined
        break
      }
    }
  }

  return card
}

function writeCharacterCardToChunks(
  chunks: {
    name: string
    data: Uint8Array
  }[],
  character: CharacterCardV2
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

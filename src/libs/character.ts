import './App.css'

import extract from 'png-chunks-extract'
import text from 'png-chunk-text'

const TEXT_CHUNK_NAME = 'tEXt'
const CHARACTER_CHUNK_KEYWORD = 'chara'

export type Character = any

function checkCharacter() {}

function readCharacterFromChunks(
  chunks: {
    name: string
    data: Uint8Array
  }[]
): Character | undefined {
  const tEXtChunks = chunks.filter((chunk: { name: string }) => chunk.name === TEXT_CHUNK_NAME)
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

function readCharacterToChunks(
  chunks: {
    name: string
    data: Uint8Array
  }[],
  character: Character
): any | undefined {
  const tEXtChunks = chunks.filter((chunk: { name: string }) => chunk.name === TEXT_CHUNK_NAME)
  if (tEXtChunks) {
    for (let tEXtChunk of tEXtChunks) {
      chunks.splice(chunks.indexOf(tEXtChunk), 1)
    }
  }

  const base64EncodedData = btoa(JSON.stringify(character))
  chunks.splice(-1, 0, text.encode(CHARACTER_CHUNK_KEYWORD, base64EncodedData))

  return chunks
}

// function App() {
//   const inp = useRef<HTMLInputElement>(null)

//   function x(img: ChangeEvent<HTMLInputElement>) {
//     if (!inp.current) {
//       return
//     }
//     if (!inp.current.files) {
//       return
//     }

//     const file = inp.current.files[0]
//     console.log(file)

//     const reader = new FileReader()
//     reader.onload = function () {
//       const arrayBuffer = reader.result
//       if (!arrayBuffer || !(arrayBuffer instanceof ArrayBuffer)) {
//         return
//       }

//       console.log(arrayBuffer)

//       const fileBytes = new Uint8Array(arrayBuffer)
//       console.log(fileBytes)

//       const chunks = extract(fileBytes)
//       console.log(chunks)

//       const tEXtChunks = chunks.filter((chunk: { name: string }) => chunk.name === 'tEXt')
//       if (!tEXtChunks) {
//         return
//       }

//       const tEXtChunk = tEXtChunks[0]
//       const data = text.decode(tEXtChunk.data)
//       if (data.keyword !== 'chara') {
//         return
//       }
//       const base64JSON = data.text

//       try {
//         const w = atob(base64JSON)
//         console.log(w)
//         const infoJSON = JSON.parse(w)
//         console.log(infoJSON)
//       } catch (err) {}
//     } // reader.readAsDataURL(file)
//     reader.readAsArrayBuffer(file)
//   }

//   return (
//     <>
//             <div>123</div>
//             <input ref={inp} type="file" id="myimg" onChange={x} accept="image/png" />   {' '}
//     </>
//   )
// }

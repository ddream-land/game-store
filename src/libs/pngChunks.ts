import extract from 'png-chunks-extract'
import text from 'png-chunk-text'

export function extractChunks(file: File): Promise<
  {
    name: string
    data: Uint8Array
  }[]
> {
  return new Promise(function (resolve, reject) {
    const reader = new FileReader()
    reader.onload = function (e: ProgressEvent<FileReader>) {
      const arrayBuffer = reader.result
      if (!arrayBuffer || !(arrayBuffer instanceof ArrayBuffer)) {
        reject(`File type error.`)
        return
      }
      const fileBytes = new Uint8Array(arrayBuffer)

      try {
        const chunks = extract(fileBytes)
        resolve(chunks)
      } catch (err) {
        reject(err)
      }
    }
    reader.onabort = function (e: ProgressEvent<FileReader>) {
      reject(e)
    }
    reader.onerror = function (e: ProgressEvent<FileReader>) {
      reject(e)
    }

    reader.readAsArrayBuffer(file)
  })
}

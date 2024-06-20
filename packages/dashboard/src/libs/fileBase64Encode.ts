import { isString } from './isTypes'

export async function toBase64(
  file: File
): Promise<string> {
  return new Promise(function (resolve, reject) {
    const reader = new FileReader()
    reader.onload = function (base64) {
      if (isString(reader.result)) {
        resolve(reader.result)
      }
      reject()
    }
    reader.readAsDataURL(file)
  })
}

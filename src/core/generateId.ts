import { customAlphabet } from 'nanoid'

function generateId() {
  /**
   * 需要 url 安全， html 安全的字符，也不能是 - 
   * url 安全： $-_.+!*'(),
   * html 安全：-_
   */
  return customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_', 16)()
}

export default generateId

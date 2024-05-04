import { request, requestList } from '../request'
import { stCardToCharacterCardInfo } from './mapping'
import { GetAllCardsRes } from './resDto'
import axios from 'axios'

export async function createCard(file: File) {
  const formData = new FormData()
  formData.append('file_type', 'png')
  formData.append('preserve_file_name', 'false')
  formData.append('avatar', file)

  return await request<{
    file_name: string
  }>({
    url: `https://st.nirvanaworld.cn/api/characters/import`,
    method: 'post',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export async function getAllCards() {
  const res = await request<GetAllCardsRes>({
    url: `https://st.nirvanaworld.cn/api/characters/all`,
    headers: {
      Accept: '*/*',
      'Content-Type': 'text/html; charset=utf-8',
    },
    method: 'POST',
    data: JSON.stringify({
      '': '',
    }),
  })

  return stCardToCharacterCardInfo(res)
}

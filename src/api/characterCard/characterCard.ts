import { request, requestList } from '../request'
import { stCardToCharacterCardInfo } from './mapping'
import { GetAllCardsRes } from './resDto'

export async function createCard(file: File) {
  const formData = new FormData()
  formData.append('file_type', 'png')
  formData.append('preserve_file_name', 'false')
  formData.append('avatar', file)

  return await request<{
    file_name: string
  }>({
    url: `/api/characters/import`,
    method: 'post',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export async function getAllCards() {
  const res = await request<GetAllCardsRes>({
    url: `/api/characters/all`,
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

export async function deleteCard(avatar: string, deleteChats: boolean = true) {
  return await request<string>({
    url: `/api/characters/delete`,
    method: 'post',
    data: {
      avatar_url: avatar,
      delete_chats: deleteChats,
    },
  })
}

import { AxiosResponse } from 'axios'
import { request, requestList } from '../request'
import { stCardToCharacterCardInfo } from './mapping'
import { GetAllCardsRes } from './resDto'
import { DtoBase } from '../dtoBase'

export async function createCard(file: File) {
  const formData = new FormData()
  formData.append('file_type', 'png')
  formData.append('preserve_file_name', 'false')
  formData.append('avatar', file)

  return await request<DtoBase>({
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
  return await request<DtoBase>({
    url: `/api/characters/delete`,
    method: 'post',
    data: {
      avatar_url: avatar,
      delete_chats: deleteChats,
    },
  })
}

export async function exportCardPNG(avatar: string) {
  return await request<AxiosResponse<Blob, any>>({
    // url: `http://rewuai-foreign.oss-us-west-1.aliyuncs.com/role/6be48da9-5216-4e89-8a32-971199e5b81f.png`,
    // method: 'get',
    url: `/api/characters/export`,
    method: 'post',
    responseType: 'blob',
    data: {
      avatar_url: avatar,
      format: 'png',
    },
  })
}

export async function exportCardJSON(avatar: string) {
  return await request<any>({
    url: `/api/characters/export`,
    method: 'post',
    data: {
      avatar_url: avatar,
      format: 'json',
    },
  })
}

export function avatarUrl(avatar: string) {
  return `https://st.nirvanaworld.cn/thumbnail?type=avatar&file=${avatar}`
}

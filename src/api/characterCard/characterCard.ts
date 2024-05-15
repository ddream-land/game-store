import { AxiosResponse } from 'axios'
import { request, requestList } from '../request'
import { stCardToCharacterCardInfo } from './mapping'
import { GetAllCardsRes } from './resDto'
import { DtoBase } from '../dtoBase'
import { CharacterCardInfo } from '@/core/CharacterCardInfo'
import { CharacterCardV2 } from '@/core/characterCard/characterCardV2'

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

export async function editCard(id: string, card: CharacterCardV2, avatar?: File) {
  const cardData = {
    alternate_greetings: card.data.alternate_greetings,
    world: card.data.character_book,
    character_version: card.data.character_version,
    creator: card.data.creator,
    creator_notes: card.data.creator_notes,
    description: card.data.description,
    extensions: card.data.extensions,
    first_mes: card.data.first_mes,
    mes_example: card.data.mes_example,
    ch_name: card.data.name,
    personality: card.data.personality,
    post_history_instructions: card.data.post_history_instructions,
    scenario: card.data.scenario,
    system_prompt: card.data.system_prompt,
    tags: card.data.tags,
  }

  const cardDataForJSONData = {
    data: cardData,
  }

  const formData = new FormData()
  formData.append('avatar_url', id)
  formData.append('character_version', card.data.character_version)
  formData.append('creator', card.data.creator)
  formData.append('creator_notes', card.data.creator_notes)
  formData.append('description', card.data.description)
  formData.append('first_mes', card.data.first_mes)
  formData.append('mes_example', card.data.mes_example)
  formData.append('ch_name', card.data.name)
  formData.append('personality', card.data.personality)
  formData.append('post_history_instructions', card.data.post_history_instructions)
  formData.append('scenario', card.data.scenario)
  formData.append('system_prompt', card.data.system_prompt)
  formData.append('tags', card.data.tags.join(','))

  formData.append('json_data', JSON.stringify(cardDataForJSONData))

  avatar && formData.append('avatar', avatar)

  // ST deprecated
  formData.append('chat', '')
  formData.append('talkativeness', '')
  // nuwa not use
  formData.append('fav', '')
  formData.append('create_date', '')
  formData.append('last_mes', '')
  formData.append('depth_prompt_prompt', '')
  formData.append('depth_prompt_depth', '')

  return await request<DtoBase>({
    url: `/api/characters/edit`,
    method: 'post',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

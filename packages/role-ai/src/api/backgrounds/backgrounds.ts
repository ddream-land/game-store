import { request, requestList } from '../request'
import { backgroundMapping } from './mapping'
import { BackgroundInfo } from './resDto'
import { DataDto, DtoBase } from '../dtoBase'

export async function uploadBackground(file: File) {
  const formData = new FormData()
  formData.append('avatar', file)

  return await request<DtoBase>({
    url: `/nuwa/api/backgrounds/upload`,
    method: 'post',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export async function getAllBackgrounds() {
  const res = await request<DataDto<BackgroundInfo[]>>({
    url: `/nuwa/api/backgrounds/all`,
    headers: {
      Accept: '*/*',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    data: JSON.stringify({
      '': '',
    }),
  })

  if (res.code !== 0) {
    return []
  }

  return backgroundMapping(res.data)
}

export async function deleteBackground(id: string) {
  return await request<DtoBase>({
    url: `/nuwa/api/backgrounds/delete`,
    method: 'post',
    data: {
      id: id,
    },
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function setDefaultBackground(id: string) {
  return await request<DtoBase>({
    url: `/nuwa/api/backgrounds/default/set`,
    method: 'post',
    data: {
      id: id,
    },
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function getDefaultBackground() {
  return await request<DataDto<string>>({
    url: `/nuwa/api/backgrounds/default/get`,
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
  })
}

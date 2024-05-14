import { request, requestList } from '../request'
import { backgroundMapping } from './mapping'
import { AllBgResDto, UploadBgResDto } from './resDto'
import { DtoBase } from '../dtoBase'

export async function uploadBackground(file: File) {
  const formData = new FormData()
  formData.append('avatar', file)

  return await request<UploadBgResDto>({
    url: `/api/backgrounds/upload`,
    method: 'post',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export async function getAllBackgrounds() {
  const res = await request<AllBgResDto>({
    url: `/api/backgrounds/all`,
    headers: {
      Accept: '*/*',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    data: JSON.stringify({
      '': '',
    }),
  })

  return backgroundMapping(res)
}

export async function deleteBackground(id: string) {
  return await request<DtoBase>({
    url: `/api/backgrounds/delete`,
    method: 'post',
    data: {
      id: id,
    },
    headers: { 'Content-Type': 'application/json' },
  })
}

export function backgroundUrl(bg: string) {
  return `https://st.nirvanaworld.cn/backgrounds/${bg}`
}

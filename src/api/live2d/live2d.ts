import { DtoBase, RespDto } from '../dtoBase'
import { request, requestList } from '../request'

export async function createLive2d(name: string, url: string) {
  const res = await request<DtoBase>({
    url: `/api/live2d/create`,
    method: 'POST',
    data: {
      name,
      url,
    },
  })

  return res
}

export async function getAllLive2d() {
  const res = await request<
    RespDto<
      {
        id: string
        name: string
        status: number
        uid: string
        url: string
      }[]
    >
  >({
    url: `/api/live2d/all`,
    method: 'POST',
  })

  return res
}

export async function deleteLive2d(id: string) {
  const res = await request<DtoBase>({
    url: `/api/live2d/delete`,
    method: 'POST',
    data: {
      id,
    },
  })

  return res
}

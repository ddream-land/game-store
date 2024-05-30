import { DtoBase, DataDto } from '../dtoBase'
import { uploadLive2dZip } from '../oss/oss'
import { request, requestList } from '../request'
import { Live2dInfo } from './resDto'

export async function createLive2d(file: File) {
  const [name, url] = await uploadLive2dZip(file)
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
  const res = await request<DataDto<Live2dInfo[]>>({
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

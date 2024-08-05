import { isString } from 'lodash'
import { DtoBase, DataDto } from '../dtoBase'
import { prepearOssClient, uploadLive2dZip, uploadLive2dZipV2 } from '../oss/oss'
import { request, requestList } from '../request'
import { Live2dInfo } from './resDto'

export async function createLive2d(file: File) {
  const [name, url] = await uploadLive2dZipV2(file)
  const res = await request<DtoBase>({
    url: `/nuwa/api/live2d/create`,
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
    url: `/nuwa/api/live2d/all`,
    method: 'POST',
  })

  return res
}

export async function deleteLive2d(id: string) {
  const res = await request<DtoBase>({
    url: `/nuwa/api/live2d/delete`,
    method: 'POST',
    data: {
      id,
    },
  })

  return res
}

export async function ddreamFreeLive2ds() {
  const freePkgBaseUrl = `https://live2doss.oss-accelerate.aliyuncs.com`

  const res = await request<{
    live2d: string[]
  }>({
    url: `${freePkgBaseUrl}/config.json`,
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
  })

  if (!res || !res.live2d || res.live2d.length <= 0) {
    return []
  }

  const models: { name: string; url: string }[] = []
  const len = res.live2d.length
  for (let i = 0; i < len; i++) {
    const item = res.live2d[i]
    const url = `${freePkgBaseUrl}/${item}/${item}.model3.json`
    try {
      await request({
        url,
        method: 'HEAD',
      })

      models.push({
        name: item,
        url,
      })
    } catch {
      // file may not exist
    }
  }

  return models
}

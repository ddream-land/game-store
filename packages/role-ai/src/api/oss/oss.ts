import OSS from 'ali-oss'
import { request } from '../request'
import { OssTokenData } from './resDto'
import generateId from '@/core/generateId'
import { sleep } from '@/libs/sleep'
import { DataDto } from '../dtoBase'

export async function ossToken() {
  return await request<DataDto<OssTokenData>>({
    url: `/api/sts/get`,
    method: 'post',
  })
}

export async function prepearOssClient(): Promise<[OSS, DataDto<OssTokenData>]> {
  const token = await ossToken()

  const client = new OSS({
    region: token.data.Region,
    accessKeyId: token.data.Credentials.AccessKeyId,
    accessKeySecret: token.data.Credentials.AccessKeySecret,
    stsToken: token.data.Credentials.SecurityToken,
    bucket: token.data.Bucket,
    secure: true,
  })

  return [client, token]
}

export async function isExist(name: string) {
  const [client, token] = await prepearOssClient()

  try {
    await client.head(name)
    return true
  } catch (error: any) {
    if (error.code === 'NoSuchKey') {
      return false
    }
    return false
  }
}

export async function uploadLive2dZip(file: File): Promise<[string, string]> {
  const filename = file.name
  const modelname = filename.split('.')[0]
  if (!filename.endsWith('.zip') && !filename.endsWith('.ZIP') && !modelname) {
    throw new Error('Invalid file.')
  }

  const [client, token] = await prepearOssClient()

  const newFilenameWithoutExt = generateId()
  const res = await client.put(`/nuwa/live2dzip/${newFilenameWithoutExt}.zip`, file)
  if (res.res.status !== 200) {
    throw new Error(`Upload failed.`)
  }

  const base = `/nuwa/live2d/${newFilenameWithoutExt}`
  let live2dJsonUrl = `${base}/${modelname}/${modelname}.model3.json`

  await sleep(1000)

  if (!(await isExist(live2dJsonUrl))) {
    live2dJsonUrl = `${base}/${modelname}.model3.json`

    if (!(await isExist(live2dJsonUrl))) {
      throw new Error(`Upload failed.`)
    }
  }

  return [modelname, `${token.data.Endpoint}/${live2dJsonUrl}`]
}

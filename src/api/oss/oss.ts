import OSS from 'ali-oss'
import { request } from '../request'
import { OssTokenDto } from './resDto'
import generateId from '@/core/generateId'

export async function ossToken() {
  return await request<OssTokenDto>({
    url: `/api/sts/get`,
    method: 'post',
  })
}

export async function prepearOssClient(): Promise<[OSS, OssTokenDto]> {
  const token = await ossToken()

  const client = new OSS({
    region: token.resp.Region,
    accessKeyId: token.resp.Credentials.AccessKeyId,
    accessKeySecret: token.resp.Credentials.AccessKeySecret,
    stsToken: token.resp.Credentials.SecurityToken,
    bucket: token.resp.Bucket,
    secure: true,
  })

  return [client, token]
}

export async function uploadFile(file: File) {
  const [client] = await prepearOssClient()

  const res = await client.put('/zipfolder/qqq.zip', file)
  console.log(res)
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
  const live2dJsonUrl = `${base}/${modelname}/${modelname}.model3.json`
  if (!(await isExist(live2dJsonUrl))) {
    throw new Error(`Upload failed.`)
  }

  return [modelname, `${token.resp.Endpoint}/${live2dJsonUrl}`]
}

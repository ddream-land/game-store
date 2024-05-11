import OSS from 'ali-oss'
import { request, requestList } from '../request'
import { OssTokenDto } from './resDto'

export async function ossToken() {
  return await request<OssTokenDto>({
    url: `/api/sts/get`,
    method: 'post',
  })
}

export async function uploadFile(file: File) {
  const token = await ossToken()

  const client = new OSS({
    region: token.resp.Region,
    accessKeyId: token.resp.Credentials.AccessKeyId,
    accessKeySecret: token.resp.Credentials.AccessKeySecret,
    stsToken: token.resp.Credentials.SecurityToken,
    bucket: token.resp.Bucket,
  })

  const res = await client.put('', file)

  client
    .put('object.rar', file)
    .then(function (r1) {
      console.log('put success: %j', r1)
      return client.get('object')
    })
    .then(function (r2) {
      console.log('get success: %j', r2)
    })
    .catch(function (err) {
      console.error('error: %j', err)
    })
}

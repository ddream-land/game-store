export type OssTokenData = {
  RequestId: string
  AssumedRoleUser: {
    Arn: string
    AssumedRoleId: string
  }
  Credentials: {
    SecurityToken: string
    AccessKeyId: string
    AccessKeySecret: string
    Expiration: string
  }
  Endpoint: string
  Region: string
  Bucket: string
}

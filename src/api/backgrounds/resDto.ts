export type UploadBgResDto = {
  code?: number // 499: duplicate name
  msg: string
}

export type AllBgResDto = {
  resp: {
    _id: string
    id: string
    name: string
    status: number
    uid: string
    url: string
  }[]
}

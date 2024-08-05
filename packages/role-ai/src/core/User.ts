export type UserInfo = {
  email: string
  uid: number
  wallet: string
  name: string
  avatar: string
}

export const DEFAULT_NO_USER: UserInfo = {
  email: '',
  uid: -1,
  wallet: '',
  name: '',
  avatar: '',
}

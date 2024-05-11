export type CharacterAvatar = {
  name?: string
  url: string
}

export enum CharacterAvatarType {
  Live2D = 'LIVE2D',
  VRM = 'VRM',
  Img = 'IMAGE',
}

export type CharacterAvatarTypeContents = {
  type: CharacterAvatarType
  typeName: string
  enable: boolean
  contents: CharacterAvatar[]
}

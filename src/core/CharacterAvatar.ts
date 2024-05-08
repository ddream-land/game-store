export type CharacterAvatar = {
  name: string
  url: string
}

export enum CharacterAvatarType {
  Live2D = 'Live2D',
  VRM = 'VRM',
  Img = 'Img',
}

export type CharacterAvatarTypeContents = {
  type: CharacterAvatarType
  typeName: string
  contents: CharacterAvatar[]
}

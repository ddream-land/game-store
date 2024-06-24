import { CharacterAvatarType } from '../CharacterAvatar'

export enum NuwaExtensionVersion {
  V1 = '1.0',
}

export interface NuwaExtensionConfigBase {
  version: NuwaExtensionVersion
  disable?: boolean
}

export interface NuwaBackgroundExtensionConfig extends NuwaExtensionConfigBase {
  url: string
}

export type NuwaBackgroundExtension = {
  nuwa_bg?: NuwaBackgroundExtensionConfig
}

export interface NuwaVoiceExtensionConfig extends NuwaExtensionConfigBase {
  type: string
  sex: string
  name: string
  language: string
}

export type NuwaVoiceExtension = {
  nuwa_voice?: NuwaVoiceExtensionConfig
}

export type NuwaVoicesExtensionListItem = Omit<NuwaVoiceExtensionConfig, 'version' | 'disable'>

export interface NuwaVoicesExtensionConfig extends NuwaExtensionConfigBase {
  list: NuwaVoicesExtensionListItem[]
}

export type NuwaVoicesExtension = {
  nuwa_voices?: NuwaVoicesExtensionConfig
}

export interface NuwaAvatarExtensionConfig extends NuwaExtensionConfigBase {
  type: CharacterAvatarType
  url: string
  name?: string
}

export type NuwaAvatarExtension = {
  nuwa_avatar?: NuwaAvatarExtensionConfig
}

export type NuwaAvatarsExtensionListItem = Omit<NuwaAvatarExtensionConfig, 'version' | 'disable'>

export interface NuwaAvatarsExtensionConfig extends NuwaExtensionConfigBase {
  list: NuwaAvatarsExtensionListItem[]
}

export type NuwaAvatarsExtension = {
  nuwa_avatars?: NuwaAvatarsExtensionConfig
}

export type NuwaExtensions = NuwaBackgroundExtension &
  NuwaVoiceExtension &
  NuwaVoicesExtension &
  NuwaAvatarExtension &
  NuwaAvatarsExtension

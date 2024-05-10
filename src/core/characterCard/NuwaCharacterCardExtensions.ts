import { CharacterAvatarType } from '../CharacterAvatar'

export enum NuwaExtensionVersion {
  V1 = '1.0',
}

export interface NuwaExtensionConfigBase {
  version: NuwaExtensionVersion
  disable?: boolean
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

export interface NuwaBackgroundExtensionConfig extends NuwaExtensionConfigBase {
  url: string
}

export type NuwaAvatarExtension = {
  nuwa_avatar?: NuwaAvatarExtensionConfig
}

export interface NuwaAvatarExtensionConfig extends NuwaExtensionConfigBase {
  type: CharacterAvatarType
  url: string
  name?: string
}

export type NuwaBackgroundExtension = {
  nuwa_bg?: NuwaBackgroundExtensionConfig
}

export type NuwaExtensions = NuwaVoiceExtension & NuwaBackgroundExtension & NuwaAvatarExtension

import { useEffect, useRef } from 'react'
import classes from './Live2dExtension.module.scss'
import { Live2dExtensionManager } from './Live2dExtensionManager'
import {
  useLive2dExtension,
  useSetLive2dExtension,
} from '../context/Live2dExtensionContextProvider'
import { NuwaExtensionVersion } from '@/core/characterCard/NuwaCharacterCardExtensions'
import { CharacterAvatarType } from '@/core/CharacterAvatar'
import { useAppSelector } from '@/hooks/useAppSelector'
import { currentChatCharacterInfoSelector } from '@/store/slices/characterSlice'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { isString } from '@/libs/isTypes'

type Live2dExtensionProps = Readonly<{
  defaultModelUrl?: string
}>

export default Live2dExtension

let abort: AbortController | undefined

function Live2dExtension({ defaultModelUrl }: Live2dExtensionProps) {
  const { t: tCommon } = useTranslation('common')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { setLive2dExtensionManager } = useSetLive2dExtension()
  const { managerRef } = useLive2dExtension()
  const chatCharaInfo = useAppSelector(currentChatCharacterInfoSelector)
  const isTTSPlaying = useAppSelector((state) => state.tts.isPlaying)

  useEffect(
    function () {
      const manager = managerRef.current
      if (!manager) {
        return
      }

      abort && abort.abort()
      manager.removeAll()

      let live2dUrl: string | undefined

      const nuwaAvatar = chatCharaInfo?.card?.data?.extensions?.nuwa_avatar
      if (nuwaAvatar && !nuwaAvatar.disable) {
        if (nuwaAvatar.type === CharacterAvatarType.Live2D) {
          switch (nuwaAvatar.version) {
            case NuwaExtensionVersion.V1: {
              live2dUrl = nuwaAvatar.url
              break
            }
            default: {
              throw new Error(`Unknown Nuwa extension version: ${nuwaAvatar.version}`)
            }
          }
        }
      }

      if (!live2dUrl) {
        return
      }

      if (manager.modelExistByModelPath(live2dUrl)) {
        return
      }

      const id = toast.loading(tCommon('loading'))

      abort = new AbortController()

      manager
        .addModel(live2dUrl, undefined, abort.signal)
        .then(function (model) {
          if (!model) {
            toast.dismiss(id)
            return
          }

          const startMotion = nuwaAvatar?.startMotion
          if (startMotion) {
            const { groupName, index } = startMotion
            model.startMotion(groupName, index)
          }
          const clickMotion = nuwaAvatar?.clickMotion
          if (clickMotion) {
            model.tapMotion = clickMotion
          }

          toast.success(tCommon('opSuccess'), {
            id: id,
          })
        })
        .catch(function (err) {
          const msg = err?.message
          console.trace(msg)

          toast.error(isString(msg) ? msg : tCommon('opFailed'), {
            id: id,
          })
        })
    },
    [chatCharaInfo]
  )

  useEffect(
    function () {
      const manager = managerRef.current
      if (!manager) {
        return
      }

      for (const id of manager.modelIds) {
        manager.setLipSync(id, isTTSPlaying)
      }
    },
    [isTTSPlaying]
  )

  useEffect(function () {
    if (!canvasRef.current) {
      throw new Error(`Live2D canvas create failed.`)
    }

    const manager = new Live2dExtensionManager(canvasRef.current)
    defaultModelUrl && manager.addModel(defaultModelUrl)
    setLive2dExtensionManager(manager)
    //@ts-ignore
    window.lmn = manager

    return function () {
      managerRef.current && managerRef.current.destroy()
    }
  }, [])

  return (
    <div className={`${classes.live2dExtension} fixed inset-0 bg-transparent`}>
      <canvas ref={canvasRef} className="absolute inset-0 bg-transparent"></canvas>
    </div>
  )
}

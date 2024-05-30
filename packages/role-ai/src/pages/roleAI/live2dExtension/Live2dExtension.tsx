import { useEffect, useRef } from 'react'
import classes from './Live2dExtension.module.scss'
import { Live2dExtensionManager } from './Live2dExtensionManager'
import {
  useLive2dExtension,
  useSetLive2dExtension,
} from '../context/Live2dExtensionContextProvider'
import { useCurrentCharacterCardInfo } from '../context/CurrentCharacterCardInfoContextProvider'
import { NuwaExtensionVersion } from '@/core/characterCard/NuwaCharacterCardExtensions'
import { CharacterAvatarType } from '@/core/CharacterAvatar'

type Live2dExtensionProps = Readonly<{
  defaultModelUrl?: string
}>

export default Live2dExtension

function Live2dExtension({ defaultModelUrl }: Live2dExtensionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { setLive2dExtensionManager } = useSetLive2dExtension()
  const { managerRef } = useLive2dExtension()
  const { charaCardInfo } = useCurrentCharacterCardInfo()

  useEffect(
    function () {
      if (!managerRef.current) {
        return
      }
      const manager = managerRef.current

      let live2dUrl: string | undefined

      const nuwaAvatar = charaCardInfo?.card?.data?.extensions?.nuwa_avatar
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

      if (live2dUrl) {
        if (manager.modelExistByModelPath(live2dUrl)) {
          return
        }
        manager.removeAll()
        manager.addModel(live2dUrl)
      } else {
        manager.removeAll()
      }
    },
    [charaCardInfo]
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
    <div className={`${classes.live2dExtension} absolute inset-0 bg-transparent`}>
      <canvas ref={canvasRef} className="absolute inset-0 bg-transparent"></canvas>
    </div>
  )
}

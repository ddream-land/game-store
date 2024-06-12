import classes from './Main.module.scss'
import { CSSProperties, ReactNode, useEffect, useState } from 'react'
import { useCurrentChatCharacterInfo } from './context/CurrentChatCharacterInfoContextProvider'
import { useLive2dExtension } from './context/Live2dExtensionContextProvider'
import { NuwaExtensionVersion } from '@/core/characterCard/NuwaCharacterCardExtensions'

const DEFAULT_MAIN_BG = '/default-bg.jpg'

export default function Main({ children }: { children: ReactNode }) {
  const [mainBgUrl, setMainBgUrl] = useState(DEFAULT_MAIN_BG)
  const { chatCharaInfo } = useCurrentChatCharacterInfo()

  const mainStyle: CSSProperties = {
    backgroundImage: `url('${mainBgUrl}')`,
  }

  useEffect(
    function () {
      const nuwaBg = chatCharaInfo?.card?.data?.extensions?.nuwa_bg
      let bgUrl = DEFAULT_MAIN_BG
      if (nuwaBg && !nuwaBg.disable) {
        switch (nuwaBg.version) {
          case NuwaExtensionVersion.V1: {
            bgUrl = `${nuwaBg.url}/w2048`
            break
          }
          default: {
            throw new Error(`Unknown Nuwa extension version: ${nuwaBg.version}`)
          }
        }
      }

      if (bgUrl !== mainBgUrl) {
        setMainBgUrl(bgUrl)
      }
    },
    [chatCharaInfo]
  )

  return (
    <div
      className={`${classes.main} w-full h-full relative flex flex-row box-border`}
      style={mainStyle}
    >
      {children}
    </div>
  )
}

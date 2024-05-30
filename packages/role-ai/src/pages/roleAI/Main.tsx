import classes from './Main.module.scss'
import { CSSProperties, ReactNode, useEffect, useState } from 'react'
import { useCurrentCharacterCardInfo } from './context/CurrentCharacterCardInfoContextProvider'
import { useLive2dExtension } from './context/Live2dExtensionContextProvider'
import { NuwaExtensionVersion } from '@/core/characterCard/NuwaCharacterCardExtensions'

const DEFAULT_MAIN_BG = '/default-bg.jpg'

export default function Main({ children }: { children: ReactNode }) {
  const [mainBgUrl, setMainBgUrl] = useState(DEFAULT_MAIN_BG)
  const { charaCardInfo } = useCurrentCharacterCardInfo()

  const mainStyle: CSSProperties = {
    backgroundImage: `url('${mainBgUrl}')`,
  }

  useEffect(
    function () {
      const nuwaBg = charaCardInfo?.card?.data?.extensions?.nuwa_bg
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
    [charaCardInfo]
  )

  return (
    <div className={`${classes.main} w-full h-full flex flex-row box-border`} style={mainStyle}>
      {children}
    </div>
  )
}

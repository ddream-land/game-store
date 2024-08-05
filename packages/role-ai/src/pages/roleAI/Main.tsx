import classes from './Main.module.scss'
import { CSSProperties, ReactNode, useEffect, useState } from 'react'
import { useLive2dExtension } from './context/Live2dExtensionContextProvider'
import { NuwaExtensionVersion } from '@/core/characterCard/NuwaCharacterCardExtensions'
import { useAppSelector } from '@/hooks/useAppSelector'
import { ReqStatus } from '@/core/ReqStatus'
import { currentAdminCharacterInfoSelector } from '@/store/slices/characterSlice'
import i18n from 'i18next'
import { Language } from '@/constant/languages'

const DEFAULT_MAIN_BG = '/imgs/default-bg.jpg'

export default function Main({ children }: { children: ReactNode }) {
  const [mainBgUrl, setMainBgUrl] = useState(DEFAULT_MAIN_BG)
  const bg = useAppSelector((state) => state.defaultBackground)
  const language = i18n.language

  const chatCharaInfo = useAppSelector(currentAdminCharacterInfoSelector)

  const mainStyle: CSSProperties = {
    backgroundImage: `url('${mainBgUrl}')`,
  }

  useEffect(
    function () {
      const nuwaBg = chatCharaInfo?.card?.data?.extensions?.nuwa_bg
      let bgUrl = DEFAULT_MAIN_BG
      if (
        bg.defaultBg &&
        bg.status !== ReqStatus.Idel &&
        bg.status !== ReqStatus.Pending &&
        bg.status !== ReqStatus.Failed
      ) {
        bgUrl = bg.defaultBg
      }
      if (nuwaBg && !nuwaBg.disable) {
        switch (nuwaBg.version) {
          case NuwaExtensionVersion.V1: {
            bgUrl = `${nuwaBg.url}`
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
    [chatCharaInfo, bg.defaultBg]
  )

  return (
    <div
      className={`${language === Language.zhCN ? "font-['PingFangSC']" : "font-['Roboto']"} ${
        classes.main
      } w-full h-full relative flex flex-row box-border`}
      style={mainStyle}
    >
      {children}
    </div>
  )
}

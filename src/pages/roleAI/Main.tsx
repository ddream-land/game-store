import classes from './Main.module.scss'
import { CSSProperties, ReactNode, useEffect, useState } from 'react'
import { useCurrentCharacterCardInfo } from './context/CurrentCharacterCardInfoContextProvider'

const DEFAULT_MAIN_BG = '/bg.png'

export default function Main({ children }: { children: ReactNode }) {
  const [mainBgUrl, setMainBgUrl] = useState(DEFAULT_MAIN_BG)
  const { charaCardInfo } = useCurrentCharacterCardInfo()

  const mainStyle: CSSProperties = {
    backgroundImage: `url('${mainBgUrl}')`,
  }

  useEffect(
    function () {
      const bgUrl = charaCardInfo?.card?.data?.extensions?.nuwa_bg?.url || DEFAULT_MAIN_BG
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

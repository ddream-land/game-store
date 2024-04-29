import { MouseEvent, WheelEvent, useState } from 'react'
import classes from './CharacterDetailView.module.scss'
import LifeInfo from './characterInfo/CharacterInfo'
import DetailTabs from './tabsArea/TabsArea'
import { useCurrentCharacterCardInfo } from '@/pages/roleAI/context/CurrentCharacterCardInfoContextProvider'

export type CharacterDetailViewProps = {
  onViewCloseClicked?: (e: MouseEvent<HTMLDivElement> | undefined) => void
}
export default CharacterDetailView

function CharacterDetailView({ onViewCloseClicked }: CharacterDetailViewProps) {
  const { charaCardInfo } = useCurrentCharacterCardInfo()
  if (!charaCardInfo) {
    return
  }

  const avatarUrl = charaCardInfo.pngUrlOrBase64 ?? '/imgs/default-avatar3.png'

  const [fullDetail, setFullDetail] = useState(false)

  function wheel(e: WheelEvent<HTMLDivElement>) {
    if (e.deltaY > 0) {
      setFullDetail(true)
    } else {
      setFullDetail(false)
    }
  }

  return (
    <div onWheel={wheel} className={`${classes.characterDetailView} w-full h-full relative`}>
      <div
        className={`${classes['life-img']} absolute top-0 w-full bg-center bg-no-repeat bg-cover`}
        style={{
          backgroundImage: `url(${avatarUrl})`,
        }}
      >
        {/* <img src={avatarUrl} className="w-full h-full" /> */}
      </div>

      <div
        className={`${classes['life-detail']} ${
          fullDetail ? classes.full : ''
        } absolute bottom-0 w-full flex flex-col`}
      >
        <div className={`${classes.info} flex-none z-0`}>
          <LifeInfo></LifeInfo>
        </div>
        <div className={`${classes.tabs} flex-1 z-0 overflow-hidden`}>
          <DetailTabs></DetailTabs>
        </div>
      </div>

      <div onClick={onViewCloseClicked} className={`${classes.back} absolute cursor-pointer`}></div>
    </div>
  )
}

import { MouseEvent, WheelEvent, useState } from 'react'
import classes from './LifeDetail.module.scss'
import LifeInfo from './LifeInfo'
import DetailTabs from './DetailTabs'
import { useDigitalLifeDetailList } from '@/character/context/DigitalLifeDetailListContext'
import { useCurrentDigitalLifeId } from '@/character/context/CurrentDigitalLifeIdContextProvider'
import { DigitalLifeDetail } from '@/libs/DigitalLifeDetail'

export type LifeDetailProps = {
  onCloseClicked?: (
    e: MouseEvent<HTMLDivElement> | undefined
  ) => void
}

export default function LifeDetail({
  onCloseClicked,
}: LifeDetailProps) {
  const digitalLifeDetailList = useDigitalLifeDetailList()
  const currentDigitalLifeId = useCurrentDigitalLifeId()
  const lifeDetail: DigitalLifeDetail | undefined =
    digitalLifeDetailList.find(
      (item) => item.id === currentDigitalLifeId
    )
  if (!lifeDetail) {
    return
  }
  const { avatarUrl = '/imgs/default-avatar3.png' } =
    lifeDetail

  const [fullDetail, setFullDetail] = useState(false)

  function wheel(e: WheelEvent<HTMLDivElement>) {
    if (e.deltaY > 0) {
      setFullDetail(true)
    } else {
      setFullDetail(false)
    }
  }

  return (
    <div
      onWheel={wheel}
      className={`${classes.ld} w-full h-full relative`}
    >
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
        <div className={`${classes.tabs} flex-1 z-0`}>
          <DetailTabs></DetailTabs>
        </div>
      </div>

      <div
        onClick={onCloseClicked}
        className={`${classes.back} absolute cursor-pointer`}
      ></div>
    </div>
  )
}

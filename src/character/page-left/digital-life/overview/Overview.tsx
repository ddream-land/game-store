import classes from './Overview.module.scss'
import {
  CharacterCardDetail,
  useDigitalLifeDetailList,
} from '@/character/context/DigitalLifeDetailListContextProvider'
import { useCurrentDigitalLifeId } from '@/character/context/CurrentDigitalLifeIdContextProvider'

function SelectADigitalLife() {
  return (
    <div
      className={`${classes.sel} w-full h-full flex flex-row`}
    >
      <div
        className={`${classes.avatar} flex justify-center items-center`}
      >
        <img src="/imgs/default-avatar.png" />
      </div>
      <div
        className={`${classes.txt} flex justify-center items-center`}
      >
        Select a digital life to chat
      </div>
    </div>
  )
}

interface OverviewProps {}

interface DigitalLifeInfoProps {
  lifeDetail: CharacterCardDetail
}

function DigitalLifeInfo({
  lifeDetail,
}: DigitalLifeInfoProps) {
  const name = lifeDetail.card.data.name
  const desc = lifeDetail.card.data.description
  const avatarUrl =
    lifeDetail.pngUrlOrBase64 ?? '/imgs/default-avatar.png'

  return (
    <div
      className={`${classes.info} flex flex-row overflow-hidden`}
    >
      <div
        className={`${classes.avatar} flex-none flex justify-center items-center overflow-hidden`}
      >
        <img
          src={avatarUrl}
          className="w-full h-full object-cover"
        />
      </div>
      <div
        className={`${classes.detail} flex-1 flex flex-col justify-center overflow-hidden`}
      >
        <div className={`${classes.name} truncate`}>
          {name}
        </div>
        <div className={`${classes.desc} truncate`}>
          {desc}
        </div>
      </div>
    </div>
  )
}

export default function Overview({}: OverviewProps) {
  const digitalLifeDetailList = useDigitalLifeDetailList()
  const currentDigitalLifeId = useCurrentDigitalLifeId()

  const lifeDetail: CharacterCardDetail | undefined =
    digitalLifeDetailList.find(
      (item) => item.id === currentDigitalLifeId
    )

  const content = lifeDetail ? (
    <DigitalLifeInfo
      lifeDetail={lifeDetail}
    ></DigitalLifeInfo>
  ) : (
    <SelectADigitalLife></SelectADigitalLife>
  )

  return (
    <div
      className={`${classes['o']} w-full h-full flex flex-row justify-between overflow-hidden`}
    >
      <div
        className={`${classes.content} flex-1 overflow-hidden`}
      >
        {content}
      </div>
      <div className={`${classes.icon} flex-none`}>
        <img src="/imgs/digitalLifeIcon.png" />
      </div>
    </div>
  )
}

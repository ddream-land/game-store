import { DigitalLifeDetail } from '@/libs/DigitalLifeDetail'
import classes from './Overview.module.scss'
import { useDigitalLifeDetailList } from '@/character/context/DigitalLifeDetailListContext'
import { useCurrentDigitalLifeId } from '@/character/context/CurrentDigitalLifeIdContextProvider'

function SelectADigitalLife() {
  return (
    <div className={`${classes.sel} w-full h-full flex flex-row`}>
      <div className={`${classes.avatar} flex justify-center items-center`}>
        <img src="/imgs/default-avatar.png" />
      </div>
      <div className={`${classes.txt} flex justify-center items-center`}>选择一个数字生命</div>
    </div>
  )
}

interface OverviewProps {}

interface DigitalLifeInfoProps {
  lifeDetail: DigitalLifeDetail
}

function DigitalLifeInfo({ lifeDetail }: DigitalLifeInfoProps) {
  const { name, desc, avatarUrl = '/imgs/default-avatar.png' } = lifeDetail
  return (
    <div className={`${classes.info} flex flex-row overflow-hidden`}>
      <div className={`${classes.avatar} flex-none flex justify-center items-center`}>
        <img src={avatarUrl} />
      </div>
      <div className={`${classes.detail} flex-1 flex flex-col justify-center`}>
        <div className={`${classes.name}`}>{name}</div>
        <div className={`${classes.desc} truncate`}>{desc}</div>
      </div>
    </div>
  )
}

export default function Overview({}: OverviewProps) {
  const digitalLifeDetailList = useDigitalLifeDetailList()
  const currentDigitalLifeId = useCurrentDigitalLifeId()

  const lifeDetail: DigitalLifeDetail | undefined = digitalLifeDetailList.find(
    (item) => item.id === currentDigitalLifeId
  )

  const content = lifeDetail ? (
    <DigitalLifeInfo lifeDetail={lifeDetail}></DigitalLifeInfo>
  ) : (
    <SelectADigitalLife></SelectADigitalLife>
  )

  return (
    <div className={`${classes['o']} w-full h-full flex flex-row overflow-hidden`}>
      <div className={`${classes.content} flex-1 overflow-hidden`}>{content}</div>
      <div className={`${classes.icon} flex-none`}>
        <img src="/imgs/digitalLifeIcon.png" />
      </div>
    </div>
  )
}

import classes from './overview.module.scss'

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

export type DigitalLifeInfo = {
  name: string
  desc: string
  avatarUrl?: string
}

interface OverviewProps {
  digitalLifeInfo?: DigitalLifeInfo
}

interface DigitalLifeInfoProps {
  digitalLifeInfo: DigitalLifeInfo
}

function DigitalLifeInfo({ digitalLifeInfo }: DigitalLifeInfoProps) {
  const { name, desc, avatarUrl = '/imgs/default-avatar.png' } = digitalLifeInfo
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

export default function Overview({ digitalLifeInfo }: OverviewProps) {
  const content = digitalLifeInfo ? (
    <DigitalLifeInfo digitalLifeInfo={digitalLifeInfo}></DigitalLifeInfo>
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

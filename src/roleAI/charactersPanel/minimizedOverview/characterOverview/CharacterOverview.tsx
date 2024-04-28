import { CharacterCardInfo } from '@/core/CharacterCardInfo'
import classes from './CharacterOverview.module.scss'

interface CharacterOverviewProps {
  charaCardInfo: CharacterCardInfo
}

export default CharacterOverview

function CharacterOverview({
  charaCardInfo,
}: CharacterOverviewProps) {
  const name = charaCardInfo.card.data.name
  const desc = charaCardInfo.card.data.description
  const avatarUrl =
    charaCardInfo.pngUrlOrBase64 ??
    '/imgs/default-avatar.png'

  return (
    <div
      className={`${classes.characterOverview} flex flex-row overflow-hidden`}
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

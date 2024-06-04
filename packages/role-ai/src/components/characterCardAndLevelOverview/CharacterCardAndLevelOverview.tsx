import classes from './CharacterCardAndLevelOverview.module.scss'
import { DDLSplitLine } from '@ddreamland/common'
import CharacterCardOverview from '../characterCardOverview/CharacterCardOverview'
import type { CharacterCardOverviewProps } from '../characterCardOverview/CharacterCardOverview'
import LevelOverview from '../LevelOverview/LevelOverview'
import type { LevelOverviewProps } from '../LevelOverview/LevelOverview'

type CharacterCardAndLevelOverviewProps = CharacterCardOverviewProps &
  LevelOverviewProps &
  Readonly<{
    bgColor?: string
  }>

export default function CharacterCardAndLevelOverview({
  name,
  description,
  avatarUrl,
  levelIconUrl,
  levelName,
  xpCurrent,
  xpTotal,
  bgColor = 'rgba(18, 19, 21, 1)',
}: CharacterCardAndLevelOverviewProps) {
  const style = {
    backgroundColor: bgColor,
  }

  return (
    <div className={`${classes.cardAndLevel} w-[400px] h-[165px]`} style={style}>
      <div className={`${classes.info} h-full flex-1 flex flex-col justify-between`}>
        <CharacterCardOverview
          name={name}
          description={description}
          avatarUrl={avatarUrl}
        ></CharacterCardOverview>

        <DDLSplitLine className=""></DDLSplitLine>

        <LevelOverview
          levelIconUrl={levelIconUrl}
          levelName={levelName}
          xpCurrent={xpCurrent}
          xpTotal={xpTotal}
        ></LevelOverview>
      </div>
    </div>
  )
}

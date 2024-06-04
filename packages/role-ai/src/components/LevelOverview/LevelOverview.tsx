import classes from './LevelOverview.module.scss'
import { Progress } from '@nextui-org/react'

export type LevelOverviewProps = Readonly<{
  levelIconUrl: string
  levelName: string
  xpCurrent: number
  xpTotal: number
}>

export default function LevelOverview({
  levelIconUrl,
  levelName,
  xpCurrent,
  xpTotal,
}: LevelOverviewProps) {
  return (
    <div className={`${classes.levelOverview} w-full h-[34px] flex flex-row gap-5`}>
      <div className={`flex-none w-[34px] h=[34px]`}>
        <img className="w-full h-full" src={levelIconUrl} />
      </div>

      <div className={`${classes.info} flex-1 flex flex-col`}>
        <div className={`${classes.name} flex flex-row justify-between`}>
          <div className={`${classes.level}`}>{levelName}</div>
          <div className={`${classes.xp}`}>
            <span>{`${xpCurrent}xp`}</span>
            <span className=" opacity-30">/</span>
            <span className=" opacity-30">{`${xpTotal}xp`}</span>
          </div>
        </div>
        <div className={`${classes.progress} flex flex-row justify-between`}>
          <Progress
            aria-label={xpCurrent.toString()}
            value={(xpCurrent / xpTotal) * 100}
            radius="sm"
            className="w-full"
            classNames={{
              base: 'w-full h-full relative',
              track: 'w-full h-full rounded-lg bg-[#666]',
              indicator: `bg-[#B5FF3A] ${classes.addLight}`,
            }}
          />
        </div>
      </div>
    </div>
  )
}

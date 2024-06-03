import classes from './LevelOverview.module.scss'

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
            <span>/</span>
            <span>{`${xpTotal}xp`}</span>
          </div>
        </div>
        <div className={`${classes.desc} truncate`}>{}</div>
      </div>
    </div>
  )
}

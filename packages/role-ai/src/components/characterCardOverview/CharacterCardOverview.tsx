import classes from './CharacterCardOverview.module.scss'

export type CharacterCardOverviewProps = Readonly<{
  name: string
  description: string
  avatarUrl: string
}>

export default function CharacterCardOverview({
  name,
  description,
  avatarUrl,
}: CharacterCardOverviewProps) {
  return (
    <div className={`${classes.cardOverview} w-full h-[54px] flex flex-row gap-9`}>
      <div className={`${classes.info} flex-1 flex flex-col overflow-hidden`}>
        <div className={`${classes.name}`}>{name}</div>
        <div className={`${classes.desc} mt-2 truncate`}>{description}</div>
      </div>
      <div className={`${classes.avatar} overflow-hidden flex-none w-[54px] h=[54px]`}>
        <img className="w-full h-full object-cover" src={avatarUrl} />
      </div>
    </div>
  )
}

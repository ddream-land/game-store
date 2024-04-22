import { useDigitalLifeDetailList } from '@/character/context/DigitalLifeDetailListContext'
import classes from './Head.module.scss'
import { useCurrentDigitalLifeId } from '@/character/context/CurrentDigitalLifeIdContextProvider'
import { DigitalLifeDetail } from '@/libs/DigitalLifeDetail'

export type DigitalLifeHeadProps = {}

export default function Head({}: DigitalLifeHeadProps) {
  const digitalLifeDetailList = useDigitalLifeDetailList()
  const currentDigitalLifeId = useCurrentDigitalLifeId()

  const lifeDetail: DigitalLifeDetail | undefined = digitalLifeDetailList.find(
    (item) => item.id === currentDigitalLifeId
  )

  const titleDesc = lifeDetail ? '当前对话' : '请选择一个'
  const { name, avatarUrl = '/imgs/default-avatar2.png' } = lifeDetail ?? {
    name: '数字生命',
  }

  return (
    <div className={`${classes.head}`}>
      <div className={`${classes.title} flex flex-row`}>
        <div className={`${classes.info} flex flex-col flex-1`}>
          <div className={`${classes.desc}`}>{titleDesc}</div>
          <div className={`${classes.name}`}>{name}</div>
        </div>
        <div
          className={`${classes['avatar-area']} flex-none flex flex-row justify-center items-center`}
        >
          <div className={`${classes.avatar} overflow-hidden`}>
            <img src={avatarUrl} />
          </div>
        </div>
      </div>
      <div className={`${classes.op} flex flex-row justify-between`}>
        <div className={`${classes.l} flex flex-row`}>
          <div className={`${classes.add} cursor-pointer`}></div>
          <div className={`${classes.edit} cursor-pointer`}></div>
        </div>
        <div className={`${classes.r}`}>
          <div
            className={`${classes['digital-plaza']} cursor-pointer flex flex-row justify-center items-center`}
          >
            <div className={`${classes.txt}`}>数字生命广场</div>
            <img src="/imgs/default-avatar.png" />
          </div>
        </div>
      </div>
      <div className={`${classes.line}`}></div>
    </div>
  )
}

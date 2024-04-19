import { useDigitalLifeDetailList, useSetCurrentDigitalLifeId } from '../DigitalLifeContext'
import classes from './List.module.scss'

export type ListProps = {
  itemClicked?: (id: number) => void
}

export default function List({ itemClicked }: ListProps) {
  const lifeList = useDigitalLifeDetailList()
  const setCurrent = useSetCurrentDigitalLifeId()

  function onItemClicked(id: number) {
    setCurrent(id)
    itemClicked && itemClicked(id)
  }

  const lifeElementItems = lifeList.map(function (life) {
    const { id, name, avatarUrl = '/imgs/default-avatar3.png', desc, tags } = life

    // max length is 3
    const tagsElements = (tags ?? []).slice(0, 3).map(function (tag, index) {
      return (
        <div key={index} className={`${classes['tag']} flex-1 truncate`}>
          {tag}
        </div>
      )
    })

    return (
      <div
        key={id}
        onClick={(e) => onItemClicked(id)}
        className={`${classes['item']} cursor-pointer mt-2 flex flex-row`}
      >
        <div className={`${classes['avatar']} flex-none overflow-hidden`}>
          <img src={avatarUrl} className="w-full h-full" />
        </div>
        <div className={`${classes['life-info']} flex-1 ml-6 flex flex-col py-2`}>
          <div className={`${classes['name']} flex-none`}>{name}</div>
          <div className={`${classes['desc']} flex-1 break-all mt-1 overflow-hidden`}>{desc}</div>
          <div className={`${classes['tags']} flex-none flex flex-row gap-2`}>{tagsElements}</div>
        </div>
      </div>
    )
  })

  return (
    <div className={`${classes['list-area']} h-full w-full`}>
      <div className={`${classes['sum']} flex-none hidden`}>共拥有103个数字生命</div>
      <div
        className={`${classes['list']} h-full overflow-y-auto overflow-x-auto scrollbar-override`}
      >
        {lifeElementItems}
      </div>
    </div>
  )
}

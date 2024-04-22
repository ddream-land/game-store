import { useState } from 'react'
import classes from './DetailTabs.module.scss'
import { isArray, isKey, isNumber, isString } from '@/libs/isTypes'
import { useDigitalLifeDetailList } from '@/character/context/DigitalLifeDetailListContext'
import { useCurrentDigitalLifeId } from '@/character/context/CurrentDigitalLifeIdContextProvider'
import { DigitalLifeDetail } from '@/libs/DigitalLifeDetail'

export default function DetailTabs() {
  const digitalLifeDetailList = useDigitalLifeDetailList()
  const currentDigitalLifeId = useCurrentDigitalLifeId()
  const lifeDetail: DigitalLifeDetail | undefined = digitalLifeDetailList.find(
    (item) => item.id === currentDigitalLifeId
  )
  if (!lifeDetail) {
    throw new Error(`Runtime error.`)
  }

  const [currentTabIndex, setCurrentTabIndex] = useState(0)
  const [tabs] = useState([
    { prop: 'creatorNote', txt: '创作者注释' },
    { prop: 'personalitySummary', txt: '个性摘要' },
    { prop: 'rolDesc', txt: '角色描述' },
    { prop: 'firstMsg', txt: '首条消息' },
    { prop: 'tags', txt: '标签' },
  ])
  const tabsElement = tabs.map(function (tab, index) {
    return (
      <div
        key={index}
        onClick={() => setCurrentTabIndex(index)}
        className={`${classes.tab} ${
          index === currentTabIndex ? classes.current : ''
        } cursor-pointer`}
      >
        {tab.txt}
      </div>
    )
  })

  function getContent() {
    const prop = tabs[currentTabIndex].prop
    let content = '无'
    if (lifeDetail && isKey(lifeDetail, prop)) {
      const val = lifeDetail[prop]
      if (isString(val)) {
        content = val
      } else if (isNumber(val)) {
        content = val.toString()
      } else if (isArray(val)) {
        content = val.join(' ')
      }
    }
    return content
  }

  return (
    <div
      className={`${classes.dtabs} w-full h-full box-border flex flex-col justify-center items-center`}
    >
      <div className={`${classes.tabs} w-full flex flex-row justify-between flex-none`}>
        {tabsElement}
      </div>
      <div className={`${classes.line} flex-none`}></div>
      <div className={`${classes.content} w-full flex-1`}>{getContent()}</div>
    </div>
  )
}

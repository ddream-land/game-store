import { useState } from 'react'
import classes from './TabsArea.module.scss'
import {
  isArray,
  isKey,
  isNumber,
  isString,
} from '@/libs/isTypes'
import { useCurrentCharacterCardInfo } from '@/roleAI/context/CurrentCharacterCardInfoContextProvider'

export default TabsArea

function TabsArea() {
  const currentCharaCardInfo = useCurrentCharacterCardInfo()
  if (!currentCharaCardInfo) {
    throw new Error(`Runtime error.`)
  }

  const [currentTabIndex, setCurrentTabIndex] = useState(0)
  const [tabs] = useState([
    { prop: 'creator_notes', txt: "Creator's Note" },
    { prop: 'personality', txt: 'Personality' },
    { prop: 'description', txt: 'Basic Info' },
    { prop: 'first_mes', txt: 'Greeting Message' },
    { prop: 'tags', txt: 'Tags' },
  ])
  const tabsElement = tabs.map(function (tab, index) {
    return (
      <div
        key={index}
        onClick={() => setCurrentTabIndex(index)}
        className={`${classes.tab} ${
          index === currentTabIndex ? classes.current : ''
        } cursor-pointer flex justify-end items-center`}
      >
        {tab.txt}
      </div>
    )
  })

  function getContent() {
    const prop = tabs[currentTabIndex].prop
    const data = currentCharaCardInfo?.card.data
    let content = '无'
    if (data && isKey(data, prop)) {
      const val = data[prop]
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
      className={`${classes.tabsArea} w-full h-full box-border flex flex-col justify-center items-center`}
    >
      <div
        className={`${classes.tabs} w-full flex flex-row justify-between flex-none`}
      >
        {tabsElement}
      </div>
      <div className={`${classes.line} flex-none`}></div>
      <div
        className={`${classes.content} w-full flex-1 text-ellipsis overflow-hidden`}
      >
        {getContent()}
      </div>
    </div>
  )
}

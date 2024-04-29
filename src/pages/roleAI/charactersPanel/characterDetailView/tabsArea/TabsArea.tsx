import { useState } from 'react'
import classes from './TabsArea.module.scss'
import { isArray, isKey, isNumber, isString } from '@/libs/isTypes'
import { useCurrentCharacterCardInfo } from '@/pages/roleAI/context/CurrentCharacterCardInfoContextProvider'
import { useTranslation } from 'react-i18next'

export default TabsArea

function TabsArea() {
  const { charaCardInfo } = useCurrentCharacterCardInfo()
  if (!charaCardInfo) {
    throw new Error(`Runtime error.`)
  }

  const { t } = useTranslation('roleAI')

  const [currentTabIndex, setCurrentTabIndex] = useState(0)
  const [tabs] = useState([
    { prop: 'creator_notes', txt: t('creatorNote') },
    { prop: 'personality', txt: t('personality') },
    { prop: 'description', txt: t('basicInfo') },
    { prop: 'first_mes', txt: t('greetingMsg') },
    { prop: 'tags', txt: t('tags') },
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
    const data = charaCardInfo?.card.data
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
      <div className={`${classes.tabs} w-full flex flex-row justify-between flex-none`}>
        {tabsElement}
      </div>
      <div className={`${classes.line} flex-none`}></div>
      <div className={`${classes.content} w-full flex-1 text-ellipsis overflow-hidden`}>
        {getContent()}
      </div>
    </div>
  )
}
